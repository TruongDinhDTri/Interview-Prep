# 🎯 Practice Questions & Answers: Retry & Circuit Breaker

**Cách dùng:** Đọc câu hỏi → đóng file → tự answer to trong 2 phút → mở ra so sánh.

---

## Q1: "Service A calls Service B and gets a timeout. Walk me through your complete retry strategy."

**Weak Answer:**
> "I would retry the request a few times with exponential backoff so we don't overwhelm the service."

**Strong Answer:**

*Start with diagnosis — what kind of failure is this?*
> "First, I need to classify the failure. A timeout falls into 'transient' — it could be a network blip, a brief overload, or a GC pause on Service B. These typically self-resolve within seconds, so retrying is appropriate. But I need to know: was this request a GET (safe to retry) or a POST that creates a resource (retrying without idempotency handling creates duplicates)?"

*The retry policy, step by step:*
> "Assuming the operation is idempotent — or we've assigned an idempotency key — here's the policy: I would NOT retry immediately. The first retry waits 100ms-1s, the second waits 2-4s, the third waits 4-8s. Each wait time adds random jitter — not exactly 1s, but somewhere in [0, 1s]. This is critical: if 500 Service A instances all timed out at the same moment, without jitter they'd all retry at exactly T+1s, creating a synchronized request spike of 500× normal load on an already-struggling Service B."

*The stopping conditions:*
> "Maximum 3-4 retries. If all 4 attempts fail, I stop and propagate the error up the stack. Retrying more than that on a service that's genuinely down just wastes CPU and holds connections. The circuit breaker (if configured) will open after the first few failures anyway, switching future calls to fail-fast mode."

*What I would NOT retry:*
> "If Service B returns a 400 Bad Request instead of a timeout, I do not retry — my request payload is malformed, and retrying the same bad payload is pointless. Same for 401/403 — auth/permission errors don't resolve with time. Retrying those adds load for no benefit."

---

## Q2: "What is the thundering herd problem and how does jitter solve it?"

**Weak Answer:**
> "Thundering herd is when too many requests hit a service at once. Jitter adds randomness to spread them out."

**Strong Answer:**

*Set up the concrete scenario with numbers:*
> "Let me make this concrete. Imagine 2,000 Order Service instances all share the same Payment Service. At T=0, Payment Service experiences a brief overload spike and returns 503 to all 2,000 instances simultaneously. Each instance uses exponential backoff and waits exactly 1 second before retrying."

*What happens next — the thundering herd:*
> "At T=1 second: all 2,000 instances retry simultaneously. Payment Service, which was just starting to recover from the T=0 overload, is now hit with a synchronized 2,000-request spike. This is 2-5x its normal load. It overloads again. All 2,000 instances get another failure. At T=2s: another synchronized spike of 2,000 requests. The system is now caught in a retry loop where the retries are causing the very overload they're trying to recover from. This is the thundering herd — the herd of retries stampeding in unison."

*How jitter breaks the synchronization:*
> "Jitter destroys the synchronization by making each instance wait a different amount of time. With full jitter, instead of everyone waiting exactly 1 second, each of the 2,000 instances waits a random duration between 0 and 1 second. The retry load that was 2,000 requests at a single point in time is now ~2,000 requests spread across a 1-second window — about 2 requests per millisecond. That's 500x less peak load. Payment Service experiences a smooth drizzle of retries instead of a tidal wave. It recovers, retries succeed, system stabilizes."

*The practical implementation:*
> "AWS, Google, and Netflix all recommend 'full jitter' — random.uniform(0, exponential_max) — rather than adding jitter to a fixed base ('equal jitter'). Full jitter provides the best load distribution at scale."

---

## Q3: "Explain circuit breaker states and when each transition happens. What triggers each transition?"

**Weak Answer:**
> "Circuit breaker has three states: closed, open, and half-open. It opens when there are too many failures and closes when the service recovers."

**Strong Answer:**

*Start with the analogy to ground the concept:*
> "The name comes from household electrical circuit breakers — the safety device that trips and disconnects a circuit when it detects dangerous conditions, preventing fires. Same idea in software: detect a dangerous pattern (too many failures), disconnect the circuit (stop sending requests), test recovery, reconnect when safe."

*CLOSED state — the baseline:*
> "In the CLOSED state, all requests flow through normally. The circuit breaker is a transparent pass-through, but it's counting failures in a sliding time window. The specific threshold is configurable — a common setting is '50% failure rate over the last 10 requests' or '5 consecutive failures.' I use rate-based thresholds rather than count-based when traffic is variable: a service with 10 requests/minute behaves very differently from one with 10,000 requests/minute, but 50% failure rate is meaningful in both cases."

*The CLOSED → OPEN transition:*
> "When the failure threshold is breached — say, 6 out of the last 10 calls failed — the circuit transitions to OPEN immediately. From this point, every incoming request fails instantaneously without making a network call. The caller receives an exception (`CircuitBreakerOpenException`) in microseconds instead of waiting for a network timeout. Threads are freed immediately. The recovery timer starts."

*OPEN state — fail fast:*
> "In the OPEN state, the circuit breaker is a short circuit — every request takes the fast path to failure. Importantly, this is exactly what we want: instead of 100 threads piling up waiting for a 30-second timeout from a dead service, they all fail in microseconds. The downstream service also gets breathing room — no traffic hitting it while it tries to recover."

*OPEN → HALF-OPEN transition:*
> "After the recovery timeout expires — usually 30-60 seconds — the circuit doesn't immediately go back to CLOSED. It enters HALF-OPEN: a cautious testing mode. A small number of probe requests (1-3) are allowed through. This avoids the scenario where the service recovers just barely and immediately getting hit with full traffic causes it to crash again."

*HALF-OPEN resolution:*
> "If the probe requests succeed: CLOSED. Full traffic resumes. If they fail: back to OPEN. Another recovery timeout begins. This can cycle a few times if the service is intermittently recovering — normal and expected. Eventually, the service either fully recovers (stays CLOSED) or the underlying issue is fixed by engineers."

---

## Q4: "You need to retry a POST request that creates an order. What could go wrong, and how do you handle it?"

**Weak Answer:**
> "POST requests aren't idempotent so retrying could create duplicate orders. We should use an idempotency key."

**Strong Answer:**

*Articulate the exact failure scenario:*
> "Here's the precise failure mode: the client sends `POST /orders` with the order data. The Order Service receives it, processes it, creates the order in the database, and sends back a `201 Created` response. But at exactly that moment — network congestion between the service and the client — the response packet is dropped. The client sees a timeout: no response within 5 seconds. From the client's perspective: the request failed. From the server's perspective: the order was created successfully.
>
> If the client naively retries the POST, the Order Service creates a second order — same items, same user, same amount. The user is now charged twice and has two orders. This is a data integrity disaster."

*The solution — idempotency keys:*
> "The standard solution is an idempotency key: the client generates a unique UUID for this operation before sending the first request. It includes this key in every retry of the same operation. The server stores `(idempotency_key, response)` after processing. On receiving a request, the server first checks: have I already processed this idempotency key? If yes, return the stored response without re-processing. If no, process and store."

```
Client:
  idempotency_key = uuid4()  # Generated once, reused for all retries

  POST /orders
  Headers: Idempotency-Key: "abc-123-xyz-def"
  Body: { product: 456, quantity: 1 }

  [timeout — retry]

  POST /orders
  Headers: Idempotency-Key: "abc-123-xyz-def"  ← same key
  Body: { product: 456, quantity: 1 }

Server:
  First request: key "abc-123-xyz-def" not seen → create order → store key+response
  Second request: key "abc-123-xyz-def" already seen → return stored 201 response → no new order
```

*Stripe's implementation as a reference:*
> "Stripe is the canonical example — every charge request accepts an `Idempotency-Key` header. Their documentation explicitly states: always include this for payment operations, and reuse the same key for retries of the same charge. The key is stored for 24 hours, covering any reasonable retry window."

*The TTL consideration:*
> "The idempotency key storage needs a TTL — you don't want to store every key forever. 24 hours is common. This means: if a client retries after 25 hours, it might get a duplicate. But that's an edge case far beyond normal retry windows, and the 24-hour window covers all reasonable retry scenarios."

---

## Q5: "How do bulkheads prevent cascading failures? Give me a concrete example."

**Weak Answer:**
> "Bulkheads isolate different services so that if one fails, it doesn't affect the others."

**Strong Answer:**

*Start with the ship metaphor — briefly:*
> "The name comes from ship design — watertight compartments that prevent one breach from flooding the whole vessel. In software, it's the same idea: isolate failure domains so a breach in one doesn't sink everything."

*Concrete example without bulkheads first — the failure:*
> "Here's a concrete scenario. Order Service has a single thread pool of 100 threads for all outbound service calls. It calls three services: Payment Service (normally 50ms), User Service (normally 20ms), and Inventory Service (normally 30ms).
>
> One afternoon, Payment Service starts responding in 5 seconds due to a database issue. Order Service handles 50 requests/second. At 50 requests/second to Payment Service, each taking 5 seconds, threads are occupied for 5 seconds each. Within 2 seconds: 100 threads × 5s responses = thread pool full. Now a User Service call comes in — no threads available, it queues. An Inventory call — queues. Within 5 seconds, every request to Order Service is queuing. Within 10 seconds, the request queue is full. Order Service is returning errors to everything — not just payment operations, but user lookups, inventory checks, everything.
>
> One slow downstream service has made our entire Order Service unresponsive."

*With bulkheads — the containment:*
> "With bulkheads, Order Service has three separate thread pools:
> - Payment pool: 30 threads
> - User pool: 30 threads  
> - Inventory pool: 30 threads
>
> Same scenario: Payment Service becomes slow (5s). Payment pool's 30 threads fill up within 1 second. New payment requests queue and then fail when the queue is full. But User Service calls? Still have 30 dedicated threads — completely unaffected. Inventory calls? Same — 30 threads untouched.
>
> The blast radius is 'payment-related requests are failing.' All other Order Service functionality is unimpaired. Users can still look up their account, view inventory, do everything except pay — and even that degrades gracefully instead of crashing."

*The key insight:*
> "Bulkheads don't prevent failures — they contain them. The goal isn't to make Payment Service fast again; it's to ensure that when Payment Service fails, it's the only thing that fails. In large microservices systems, complete availability is impossible — partial degradation is the best you can achieve, and bulkheads make partial degradation the outcome instead of total failure."

---

## Q6: "The circuit to your Payment Service opens. What does the user experience? What should the system do?"

**Weak Answer:**
> "The user will see an error. We should show a friendly error message and maybe use a fallback."

**Strong Answer:**

*Describe what the circuit opening means at the infrastructure level:*
> "When the circuit opens, every call to Payment Service returns a `CircuitBreakerOpenException` in microseconds — no network round-trip. From the user's perspective, the checkout page responds immediately — but with an error or degraded state, depending on how we've designed the fallback."

*Three levels of user experience — from worst to best:*

> "**Level 1 (worst): Generic 500 error page.** 'Something went wrong.' No context, no next steps. User leaves, possibly never returns. This is what happens with no fallback logic."

> "**Level 2 (acceptable): Informative error message.** Instead of a generic crash, the checkout flow shows: 'Payment processing is temporarily unavailable. Your cart has been saved — please try again in a few minutes.' This requires the UI to handle the payment error gracefully, not propagate it as a full page crash. Critically, the user's cart state is preserved."

> "**Level 3 (best for critical path like payments): Queue and notify.** This depends on the business model and payment flow. Option: accept the order intent, queue it, and process when payment service recovers. Show user: 'We're processing your order — you'll receive confirmation by email within 5 minutes.' Works for some businesses, not all — requires the ability to decouple order acceptance from payment processing."

*What the SYSTEM should do (beyond UX):*
> "The system should immediately alert on-call engineers when the circuit opens — this isn't a normal state, it indicates a real incident with Payment Service. The circuit state should be visible in the monitoring dashboard alongside the circuit open time and recovery timeout countdown.
>
> Ideally, there's also a queue of failed payment attempts that can be retried when the circuit closes. For e-commerce, losing payment attempts during a 30-minute outage can mean significant revenue loss — queuing them for automatic retry when the circuit recovers is important."

*Across-the-board principle:*
> "The general principle: every circuit opening should have a defined user experience and operational response designed in advance — not discovered in the middle of an incident. 'What happens when X fails?' should be answered at design time, not at 3am during an outage."

---

## Key Phrases to Remember

| Situation | What to say |
|-----------|-------------|
| Starting retry discussion | "First I'd classify the failure — transient or permanent? Idempotent or not?" |
| Exponential backoff | "Wait doubles each attempt: 1s → 2s → 4s → 8s, with random jitter to prevent synchronization" |
| Thundering herd | "1,000 callers retry at T+1s simultaneously — the retry storm is worse than the original failure" |
| Circuit breaker states | "Closed = normal + counting, Open = fail fast, Half-open = cautious probe" |
| Idempotency | "Same key in every retry — server returns stored result if key seen before" |
| Bulkhead | "Separate thread pool per downstream → slow Payment doesn't exhaust User Service threads" |
| Fallback | "Cached response for reads, feature degradation for non-critical, queue for async" |
| After circuit opens | "Alert on-call, show user-friendly message, queue for retry when circuit recovers" |

---

## Practice Strategy

**Timing drill:** Say the full answer to Q1 in under 90 seconds. Include: classification, backoff formula, jitter reason, stopping condition, what not to retry.

**Cascade walkthrough:** Practice drawing the cascading failure timeline on paper — from C slow → B thread exhaustion → A thread exhaustion. Then add the circuit breaker and bulkhead to show containment.

**Numbers to know:**
- Typical circuit threshold: 50% failure rate in 10-second window
- Typical recovery timeout: 30-60 seconds
- Bulkhead pool sizing: 20-30 threads per downstream (not shared)
- Max retries: 3-5 (not more)
- Idempotency key TTL: 24 hours (standard)
