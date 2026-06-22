# 📝 Key Talking Points: Retry & Circuit Breaker

**Goal:** Giải thích được *tại sao* retry đơn giản là nguy hiểm, *cách* exponential backoff + jitter giải quyết thundering herd, và *khi nào* circuit breaker là đúng tool (không phải retry). Đây là phần "Error handling & resilience" trong system design interview — thể hiện bro hiểu failure modes của distributed systems.

---

## Section 1: Why Networks Fail — The Starting Point

### Distributed Systems Lie to You

Trong monolith, khi bro gọi một function — nó chạy hoặc nó throw exception. Không có trạng thái trung gian.

Trong microservices, một network call có thể:
```
Call to Payment Service returns...
  → 200 OK (success)
  → 500 Internal Server Error (server failed)
  → TCP timeout (no response in 30s — did it run? did it not?)
  → Connection refused (service is down)
  → 429 Too Many Requests (service is alive but overloaded)
  → 503 Service Unavailable (service restarting)
```

**The ambiguity problem:** With a timeout — you sent the request, but don't know if the server processed it. The server might have:
- Never received it (network dropped it)
- Received it and crashed before responding
- Received it, processed it, and the response got dropped

This ambiguity is fundamentally different from local function calls and is why retry logic requires careful design.

### Types of Failures

| Type | Duration | Cause | Retry safe? |
|------|----------|-------|-------------|
| **Transient** | Milliseconds–seconds | Network blip, brief overload, GC pause | ✅ Yes |
| **Transient (slow)** | Seconds–minutes | Service restarting, deploy in progress | ✅ Yes, with backoff |
| **Prolonged** | Minutes–hours | Service down, dependency down, OOM | ❌ Circuit breaker |
| **Permanent** | Until fix | Bug in service, bad request data | ❌ Don't retry |

---

## Section 2: The Naive Retry — Why It Makes Things Worse

### The Story: Calling a Sick Friend

Your friend is sick in bed. You need to ask them something. Do you call every 30 seconds until they pick up?

That's exactly what naive retry does to a struggling service:

```python
# ❌ NAIVE RETRY — the worst possible approach
def call_payment_service(payload):
    for attempt in range(5):
        try:
            return requests.post('http://payment-service/charge', json=payload, timeout=5)
        except (ConnectionError, Timeout):
            continue  # Retry immediately!
    raise Exception("Payment service unavailable")
```

**What this looks like from the Payment Service's perspective:**
```
T=0ms:   Payment Service gets overloaded (spike in traffic)
T=100ms: Request 1 times out. Caller retries immediately.
T=100ms: Request 2 arrives. Payment Service still overloaded.
T=200ms: Request 2 times out. Retry immediately.
T=200ms: ...

If 1,000 callers all do this: payment service receives
3,000-5,000 requests in the same period it was struggling with 1,000.
The retry storm makes the overload 3-5x worse.
```

**Why naive retry is dangerous:**
1. **Amplifies load** on an already struggling service
2. **Thundering herd** when many callers retry simultaneously
3. **Can create duplicate writes** — if the server processed the request but the response was lost, a retry creates a duplicate order, duplicate charge, etc.

---

## Section 3: Exponential Backoff — Retry with Courtesy

### The Core Idea

Give the service time to recover. After each failure, wait longer before trying again:

```
Attempt 1: Fail → wait 1 second   (2^0 = 1)
Attempt 2: Fail → wait 2 seconds  (2^1 = 2)
Attempt 3: Fail → wait 4 seconds  (2^2 = 4)
Attempt 4: Fail → wait 8 seconds  (2^3 = 8)
Attempt 5: Give up → raise exception
```

**Formula:**
```
wait_time = base_delay × 2^attempt_number
base_delay = 100ms (for fast services) or 1s (for slow/external services)
max_retries = 3-5 (don't retry forever)
max_wait = cap at 30-60s (exponential grows fast: 2^10 = 1024s — too long)
```

```python
import time
import requests

def call_with_exponential_backoff(url, payload, max_retries=4, base_delay=1.0):
    for attempt in range(max_retries + 1):
        try:
            response = requests.post(url, json=payload, timeout=5)
            response.raise_for_status()
            return response

        except requests.exceptions.HTTPError as e:
            # 4xx errors: don't retry (client error, retrying won't help)
            if 400 <= e.response.status_code < 500:
                raise  # e.g. 400 Bad Request, 401 Unauthorized, 404 Not Found

            # 429 Too Many Requests: retry but respect Retry-After header
            if e.response.status_code == 429:
                retry_after = int(e.response.headers.get('Retry-After', base_delay * (2 ** attempt)))
                time.sleep(retry_after)
                continue

        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
            pass  # Transient — worth retrying

        if attempt < max_retries:
            wait = min(base_delay * (2 ** attempt), 60.0)  # Cap at 60s
            time.sleep(wait)

    raise Exception(f"Service unavailable after {max_retries} retries")
```

### Which Errors to Retry — Critical Rule

**Not all failures are worth retrying.** Retrying the wrong errors wastes resources and can cause damage:

```
RETRY (transient, will likely succeed):
  ✅ 503 Service Unavailable  — service overloaded, retry after backoff
  ✅ 504 Gateway Timeout      — upstream service slow, may recover
  ✅ Connection timeout       — transient network issue
  ✅ Connection refused       — service restarting, brief outage
  ✅ 429 Too Many Requests    — respect Retry-After header

DO NOT RETRY (permanent or idempotency risk):
  ❌ 400 Bad Request          — your request is malformed. Retry won't fix it.
  ❌ 401 Unauthorized         — your token is invalid. Retry won't authenticate you.
  ❌ 403 Forbidden            — you don't have permission. Retry won't grant it.
  ❌ 404 Not Found            — resource doesn't exist. Retry won't create it.
  ❌ Non-idempotent 5xx       — POST that creates a record: retry = duplicate
```

### Idempotency — The Hidden Requirement for Safe Retries

**Idempotent operation:** Calling it N times has the same effect as calling it once.

```
Idempotent:
  GET /users/123          → reads don't change state
  DELETE /users/123       → second delete: user already gone, same final state
  PUT /users/123 {name: "Bob"}  → second put: same result

NOT idempotent:
  POST /orders {product: 123}   → second POST = second order created
  POST /payments {amount: 999}  → second POST = second charge
```

**Solution: Idempotency Keys**
```python
import uuid

# Client generates unique ID for this operation
idempotency_key = str(uuid.uuid4())

# Server: check if this key was already processed
# If yes: return the same response as before (don't process again)
# If no: process and store the key

requests.post('/payments', json={
    'amount': 999,
    'user_id': 123
}, headers={
    'Idempotency-Key': idempotency_key  # Stripe uses this pattern
})
# If this request times out and we retry with the SAME key,
# the payment processor knows it's a retry → returns original result → no double charge
```

---

## Section 4: Jitter — Solving the Thundering Herd

### The Problem: 10,000 Retries at the Same Second

```
T=0:    Payment Service gets overloaded
T=0:    1,000 Order Service instances all get a timeout
T=1s:   ALL 1,000 instances retry at exactly T+1s
T=1s:   Payment Service receives 1,000 requests simultaneously
T=1s:   Payment Service crashes under the spike → more timeouts
T=2s:   ALL 1,000 instances retry at exactly T+2s
T=2s:   Another 1,000-request spike → Payment crashes again
```

This is the **thundering herd problem** (also called: retry storm). Exponential backoff without jitter just shifts the problem in time.

### Jitter: Add Randomness to Break Synchronization

```python
import random
import time

def get_backoff_with_jitter(attempt, base_delay=1.0, max_delay=60.0):
    """
    Full Jitter (AWS recommendation): randomly pick from [0, exponential_max]
    This completely desynchronizes retries across all callers.
    """
    exponential_max = min(base_delay * (2 ** attempt), max_delay)
    return random.uniform(0, exponential_max)

# Results when 1,000 callers all fail at T=0:
# Attempt 1 (base 1s): each caller waits 0ms–1000ms (uniformly distributed)
#   → 1,000 retries spread across 1 full second → ~1 request/ms instead of 1,000 requests/ms
# Attempt 2 (base 2s): each caller waits 0ms–2000ms
# ...payment service sees smooth traffic, not spikes
```

**Visualizing the difference:**

```
Without jitter:                     With full jitter:
    |                                   |
1000|    ██                         100|▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
    |    ██                             |▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
    |    ██          ██              10 |▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
    |────┬──────────┬────            ───┼──────────────────►
         T+1s      T+2s                    T+0  to  T+2s
         (spike)  (spike)                  (smooth load)
```

### Retry Budget — The Often-Forgotten Constraint

Even with jitter, uncapped retries can overwhelm a recovering service:

> If 1,000 services each retry 5 times, a struggling service that handles 1,000 requests/s now receives up to 5,000 requests/s while trying to recover.

**Retry budget:** Limit total retry volume across all callers, not just per-call.

```
Implementation options:
1. Client-side: max 3 retries per call, but track total retry rate;
   if retry rate > 20% of total requests → stop retrying (budget exhausted)

2. Server-side: Return 429 with Retry-After when overloaded
   → Callers respect the Retry-After delay (not their own backoff schedule)

3. Load shedder: Server rejects lowest-priority requests under extreme load
   → Preserves capacity for critical paths (Payments) vs nice-to-haves (Recommendations)
```

---

## Section 5: Circuit Breaker — When Retry Isn't Enough

### The Story: The Electrical Circuit Breaker

In your house, a circuit breaker protects you from electrical fires. When too much current flows (short circuit), it trips — disconnecting the circuit instantly. You don't keep trying to push electricity through a shorted wire. After fixing the problem, you reset the breaker.

Retry says: "I'll keep trying, the service might recover."
Circuit Breaker says: "I've tried enough times, clearly the service is down. I'll stop trying until I have reason to believe it's recovered."

**The problem retry doesn't solve:**

```
Payment Service is down for 30 minutes (server crash, database issue).
Retry with exponential backoff: keeps trying every 8-30 seconds.
Result:
  → Threads blocked waiting for timeout responses
  → Thread pool slowly exhausts
  → Order Service starts failing too
  → Cascading failure (covered in Section 7)

Circuit Breaker: after 5 failures, opens the circuit
Result:
  → Requests fail immediately (< 1ms, no network call)
  → Threads freed immediately
  → Order Service stays healthy, can degrade gracefully
  → Payment Service gets breathing room to recover
```

### The Three States

```
           failures exceed threshold
[CLOSED] ────────────────────────────→ [OPEN]
   ↑                                      |
   |                              recovery timeout
   |                                      ↓
success                             [HALF-OPEN]
   |                                      |
   └──────────────────────────────────────┘  (test requests pass)
                                         |
                              test fails → [OPEN] again
```

#### State 1: CLOSED — Normal Operation
```
Requests flow through normally.
Circuit Breaker counts failures in a sliding window:
  - e.g., "5 failures in the last 60 seconds"
  - or "failure rate > 50% over last 10 requests"

When threshold hit → state transitions to OPEN.

Implementation note: failure counting must be time-windowed, not cumulative.
A service that had 100 failures 3 hours ago (now healthy) shouldn't be tripped.
```

#### State 2: OPEN — Circuit Tripped
```
ALL requests fail immediately without making a network call.
Return: error or fallback response (see Section 6)
No threads are wasted waiting for a service that's clearly down.

After a recovery timeout (e.g., 30 seconds) → state transitions to HALF-OPEN.
```

#### State 3: HALF-OPEN — Cautious Testing
```
Allow a small number of "probe" requests through (e.g., 1 per second).
If probes succeed → service has recovered → transition to CLOSED.
If probes fail → service still down → transition back to OPEN.

Why not just go straight to CLOSED?
→ Service might have partially recovered (some requests succeed, others don't)
→ Half-open is conservative: one success per second, not full traffic
→ If it's truly recovered, CLOSED within seconds; if not, back to OPEN safely
```

### Real-World Configuration (Resilience4j — Java)

```java
// Resilience4j Circuit Breaker configuration
CircuitBreakerConfig config = CircuitBreakerConfig.custom()
    .failureRateThreshold(50)          // Open when 50%+ of last N calls fail
    .slidingWindowSize(10)             // Count last 10 calls
    .waitDurationInOpenState(Duration.ofSeconds(30))  // Wait 30s before testing
    .permittedNumberOfCallsInHalfOpenState(3)         // 3 probe requests in half-open
    .recordExceptions(
        IOException.class,
        TimeoutException.class
    )
    .ignoreExceptions(
        BusinessException.class   // Don't count business logic errors as CB failures
    )
    .build();
```

**Python equivalent using `pybreaker`:**
```python
import pybreaker
import requests

# Circuit breaker: open after 5 failures, reset after 60 seconds
payment_cb = pybreaker.CircuitBreaker(
    fail_max=5,
    reset_timeout=60
)

@payment_cb
def charge_user(user_id, amount):
    response = requests.post(
        'http://payment-service/charge',
        json={'user_id': user_id, 'amount': amount},
        timeout=5
    )
    response.raise_for_status()
    return response.json()

# Usage:
try:
    result = charge_user(123, 999)
except pybreaker.CircuitBreakerError:
    # Circuit is open — return fallback immediately
    return {"status": "payment_unavailable", "message": "Try again in a moment"}
```

---

## Section 6: Fallback Strategies — What to Show When Circuit is Open

When a circuit opens, you have options beyond "return an error":

### Option 1: Cached Response (Best for reads)
```python
def get_product_recommendations(user_id):
    cache_key = f"recommendations:{user_id}"

    try:
        # Try live service
        return recommendation_cb.call(fetch_recommendations, user_id)
    except pybreaker.CircuitBreakerError:
        # Circuit open — serve from cache (stale data > no data)
        cached = redis.get(cache_key)
        if cached:
            return json.loads(cached)
        return get_default_recommendations()  # Generic popular items
```

### Option 2: Default / Degraded Response
```python
def get_shipping_estimate(cart, address):
    try:
        return shipping_cb.call(fetch_shipping_estimate, cart, address)
    except (pybreaker.CircuitBreakerError, Exception):
        # Shipping service down → show generic estimate, don't block checkout
        return {
            "estimated_days": "3-7",
            "price": None,  # "Calculated at checkout"
            "degraded": True
        }
```

### Option 3: Graceful Feature Degradation
```
Scenario: Recommendation Service circuit opens on homepage.

❌ Bad: Show error page → user leaves
❌ Bad: Show nothing → confusing layout
✅ Good: Hide "Recommended for you" section entirely
         User can still browse, search, buy — core flow works
         Recommendation widget reappears when service recovers

Principle: "Degrade gracefully, not catastrophically"
Core features must work even if supporting features fail.
```

### Option 4: Queue for Later
```python
def send_notification(user_id, message):
    try:
        notification_cb.call(send_immediately, user_id, message)
    except pybreaker.CircuitBreakerError:
        # Notification service down → queue for delivery later
        # This is fine for notifications (not for payments!)
        job_queue.enqueue('send_notification', user_id, message, delay=300)
```

**Which fallback to use:**
```
Read operations  → Cached response (stale data acceptable)
Non-critical     → Degrade gracefully (hide the feature)
Async operations → Queue for later
Critical path    → Error with clear user message + support contact
```

---

## Section 7: Bulkhead Pattern — Contain the Blast Radius

### Named After Ship Bulkheads

Modern ships are divided into watertight compartments (bulkheads). If one compartment floods, the watertight doors prevent water from spreading to other compartments. The ship might lose the bow section, but the rest of the ship stays afloat.

The bulkhead pattern in software: **separate thread pools (or connection pools) per downstream dependency**, so a slow/failing service can't exhaust resources needed for other services.

### Without Bulkhead — Shared Thread Pool
```
Order Service has 100 threads for all outbound calls.

Payment Service becomes slow (2s response instead of 50ms):
  → Payment calls now occupy threads for 2s each
  → At normal 50 requests/s to Payment: 100 threads tied up
  → Thread pool EXHAUSTED
  → New requests to User Service? No threads available.
  → New requests to Inventory Service? No threads available.
  → Order Service is now fully unresponsive — not just for Payment calls
  → ALL functionality down because of ONE slow downstream service
```

```
Order Service thread pool (100 threads):
[Payment] [Payment] [Payment] [Payment] [Payment] [Payment]... (all 100 slots)
[waiting] [waiting] [waiting] [waiting] [waiting] [waiting]
  ← User Service requests: no threads available → fail
  ← Inventory requests: no threads available → fail
```

### With Bulkhead — Separate Thread Pools
```
Order Service pools:
  Payment pool:   20 threads  ← slow Payment? only these 20 threads affected
  User pool:      20 threads  ← User Service unaffected
  Inventory pool: 20 threads  ← Inventory unaffected
  General pool:   40 threads

If Payment Service is slow and exhausts its 20-thread pool:
  → Payment-related requests fail (or queue)
  → User Service calls: still 20 dedicated threads available ✅
  → Inventory calls: still 20 dedicated threads available ✅
  → Blast radius: Payment functionality only
```

```python
# Python equivalent using concurrent.futures
from concurrent.futures import ThreadPoolExecutor

# Separate executor per downstream service
payment_executor = ThreadPoolExecutor(max_workers=20, thread_name_prefix='payment')
user_executor = ThreadPoolExecutor(max_workers=20, thread_name_prefix='user')
inventory_executor = ThreadPoolExecutor(max_workers=20, thread_name_prefix='inventory')

def place_order(user_id, product_id, amount):
    # These submit to SEPARATE pools — slow payment doesn't affect user/inventory calls
    payment_future = payment_executor.submit(charge_payment, user_id, amount)
    user_future = user_executor.submit(get_user_details, user_id)
    inventory_future = inventory_executor.submit(reserve_inventory, product_id)

    # If payment pool fills up → payment_future raises BrokenExecutor
    # user_future and inventory_future are unaffected ✅
```

---

## Section 8: Timeouts — The Often-Forgotten First Line of Defense

### Why Timeouts Matter

Every external call must have a timeout. Without timeouts:
```
Order Service calls Payment Service.
Payment Service is under extreme load — takes 120 seconds to respond.
Order Service: thread blocked for 120 seconds waiting.
With 100 concurrent users: 100 threads blocked for 2 minutes.
Thread pool exhausted in < 1 minute → Order Service unresponsive.
```

With timeouts:
```
timeout = 2 seconds
Payment Service slow → 2 second timeout fires → thread freed → fail fast
At 100 concurrent users: threads free after 2s → pool never exhausts
```

### Setting the Right Timeout

**P99 latency as the baseline:**
```
Measure Payment Service latency over 30 days:
  P50 (median): 45ms
  P95: 120ms
  P99: 280ms

Timeout = 2-3× P99 = 600-840ms → round to 1 second

Why 2-3× P99, not P99 directly?
  → P99 means 1% of calls legitimately take > 280ms
  → Setting timeout at P99 would fail 1% of valid requests
  → 2-3× gives buffer for legitimate slow calls without holding threads too long
```

**Timeout cascade problem:**
```
Client timeout: 30s
Service A timeout to B: 25s
Service B timeout to C: 20s

If C is slow → B waits 20s → A waits 25s → Client waits 30s
Better: cascading timeouts should DECREASE down the chain:
  Client: 10s
  A → B: 8s
  B → C: 5s
This ensures the inner service fails first, freeing outer threads early.
```

---

## Section 9: Putting It All Together

### The Resilience Stack — Order of Application

```
Every outbound service call should have (from innermost to outermost):

1. TIMEOUT          → Fail fast if service hangs (don't hold threads)
2. RETRY            → Handle transient failures (with backoff + jitter)
3. CIRCUIT BREAKER  → Stop trying when service is clearly down
4. BULKHEAD         → Isolate failure to a dedicated pool
5. FALLBACK         → Degrade gracefully when all else fails

Code flow:
try:
    result = bulkhead_executor.submit(
        circuit_breaker.call(
            retry_with_backoff(
                payment_service.charge,  ← has internal timeout
                payload
            )
        )
    )
except CircuitBreakerOpen:
    result = get_cached_or_default_response()
except BulkheadFull:
    result = {"error": "too_busy", "retry_after": 5}
```

### Cascading Failure — Full Walkthrough

```
System: Client → Service A → Service B → Service C (DB)

T=0:    Database backing Service C starts having issues → C responds in 15s
T=5s:   B's timeout (5s) hits → B is retrying C with backoff
T=5s:   B's circuit breaker not yet open (threshold not reached)
T=30s:  B has exhausted its circuit breaker threshold → CB opens
T=30s:  B now failing fast for C calls → returns 503 to A
T=35s:  A receives 503s from B → A's circuit breaker for B starts counting
T=60s:  A's circuit breaker opens → A returns 503 to Client
T=60s:  Client receives errors for requests involving Service C
         BUT: Service C might be doing different things — 
         requests NOT involving C? Still work! (if bulkheads are in place)

Without circuit breakers:
T=5s:   B holds threads waiting for C (15s response)
T=1min: B's thread pool exhausted → B can't process ANY requests (even those not touching C)
T=1min: A holds threads waiting for B
T=2min: A's thread pool exhausted → entire system unresponsive
```

---

## Interview-Ready Answers

### Q: "What happens when Service A calls Service B and B is down?"

> "My defense-in-depth approach has five layers.
>
> First, every call to B has a **timeout** — set at 2-3× B's P99 latency. If B doesn't respond in, say, 500ms, the call fails fast and the thread is freed. Without this, threads pile up waiting forever.
>
> Second, transient failures get retried with **exponential backoff and jitter** — wait 100ms, then 200ms, then 400ms, each with random variation to spread retry load. Critically, I only retry idempotent operations and genuine transient errors (5xx, timeout) — not client errors (4xx) or non-idempotent POSTs without idempotency keys.
>
> Third, the **circuit breaker** monitors failure rate. If 50% of calls to B fail over a 10-second window, the circuit opens. For the next 30 seconds, calls to B fail immediately without network attempts — threads freed, resources preserved. After 30 seconds, a few probe requests test whether B has recovered. Success → circuit closes; failure → stays open.
>
> Fourth, B's calls run in a **bulkhead** — a dedicated thread pool. B being down doesn't exhaust threads that calls to Service C or D need.
>
> Fifth, with the circuit open, I serve a **fallback** — cached data if available, or a degraded response that removes the feature rather than showing an error page."

### Q: "How do you prevent cascading failures in microservices?"

> "Cascading failures happen when one slow service causes its callers to accumulate blocked threads, exhausting their thread pools, which then causes their callers to do the same. The fix is to stop the cascade at the source.
>
> Circuit breakers are the primary tool — they fail fast once a service is clearly unhealthy, preventing thread accumulation. But circuit breakers only work if timeouts are set properly first — you need calls to fail before threads accumulate.
>
> Bulkheads contain the damage — if Payment Service causes thread exhaustion in its dedicated pool, User Service calls (different pool) still work. The blast radius is 'Payment functionality degraded,' not 'entire service down.'
>
> The system design principle: in a chain A→B→C, if C fails, C should fail fast and isolated. B should fail fast for C-related functionality but work normally for everything else. A should see C-related requests degraded but other requests unaffected. With proper circuit breakers and bulkheads, a cascading failure becomes a graceful partial degradation."

---

## Quick Reference

```
RETRY (for transient failures):
  Pattern: exponential backoff + jitter
  Formula: wait = random.uniform(0, min(base × 2^attempt, max_wait))
  Only retry: 5xx, timeouts, connection errors
  Don't retry: 4xx, non-idempotent operations without idempotency keys
  Max retries: 3-5
  Idempotency key: prevents duplicate operations on retry

CIRCUIT BREAKER (for prolonged outages):
  CLOSED   → normal, counting failures
  OPEN     → failing fast, no network calls (saves threads)
  HALF-OPEN→ testing recovery with a few probe requests
  Threshold: 50% failure rate in 10-second window (configure per service)

BULKHEAD (for blast radius isolation):
  Separate thread pool per downstream service
  Pool exhausted for Payment → User and Inventory pools unaffected

TIMEOUT (first line of defense):
  Set at 2-3× P99 latency of downstream service
  Must decrease down the call chain (client > outer service > inner service)

FALLBACK (when circuit opens):
  Reads     → cached response (stale > none)
  Non-critical → hide the feature
  Async ops → queue for later
  Critical  → clear error + support info

NEVER:
  ❌ Retry immediately (thundering herd)
  ❌ Retry non-idempotent POSTs without idempotency keys
  ❌ No timeout on any external call
  ❌ Shared thread pool for all downstream calls (no bulkhead)
```
