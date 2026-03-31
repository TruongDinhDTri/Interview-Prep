# HADRIEL-KNOWLEDGE: Chapter 4 — Design A Rate Limiter

---

## Quick Reference (Already Covered in Existing Materials)

The existing CSV (37 cards), chapter-4-complete.html, and algorithm visualizer cover:
- 5 algorithms: Token Bucket, Leaking Bucket, Fixed Window Counter, Sliding Window Log, Sliding Window Counter
- Redis architecture: INCR + EXPIRE commands, centralized data store
- HTTP 429 Too Many Requests + response headers (X-Ratelimit-Remaining, X-Ratelimit-Limit, X-Ratelimit-Retry-After)
- Placement: client-side (unreliable), server-side, middleware/API Gateway
- Distributed challenges: race condition (Lua scripts), synchronization (centralized Redis)
- Hard vs Soft rate limiting, L3 vs L7 rate limiting
- Client best practices (cache, backoff, catch exceptions)
- Rules storage: disk → workers → in-memory cache

---

## Deep Knowledge — Additional Topics

---

### Real-World Implementations

#### Stripe
- **Approach:** Token Bucket per API key, enforced at edge (before hitting application servers)
- **Communication:** Returns `Retry-After` header and `X-RateLimit-*` headers on every response (not just 429s) — so clients know their budget proactively
- **Tiering:** Different limits for test mode vs live mode, different limits per API endpoint (payment creation vs read)
- **Interesting detail:** Stripe uses a sliding window approach for some endpoints to smooth traffic, token bucket for bursty endpoints (webhook delivery retries)
- **Lesson:** Rate limiting is a product feature, not just infrastructure — communicate limits clearly to developers

#### Cloudflare
- **Scale:** 55+ million HTTP requests per second across global network
- **Approach:** Sliding Window Counter at CDN edge nodes — exactly what the book describes
- **Distributed challenge:** Each edge PoP maintains local counters; periodically syncs with central store
- **DDoS layer:** Rate limiting is Layer 7; they also have Layer 3/4 packet-level filtering that runs before rate limiting
- **Anomaly detection:** Machine learning to detect bot patterns — rate limiting is reactive; anomaly detection is proactive
- **Lesson:** At Cloudflare scale, even Redis can be a bottleneck; local counters + eventual sync is the pragmatic solution

#### GitHub API
- **Rate limit structure:**
  - Unauthenticated: 60 requests/hour (by IP)
  - Authenticated: 5,000 requests/hour (by user token)
  - GitHub Apps: 15,000 requests/hour
  - Search API: separate limit of 30 req/min (more expensive queries)
- **Secondary rate limits:** Also limits by: number of concurrent requests, number of requests per minute (burst), CPU time consumed
- **Response headers:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` (Unix timestamp when limit resets), `X-RateLimit-Used`
- **Lesson:** Multi-dimensional rate limiting (by user, by endpoint type, by resource cost) reflects real-world complexity

#### AWS API Gateway
- **Throttling types:**
  - Account-level: 10,000 requests/sec default
  - Stage-level: per deployment stage
  - Method-level: per individual endpoint
  - Usage Plans: tiered limits per API key (subscriber model)
- **Implementation:** Token Bucket per throttle setting; "burst" allows temporary exceeding of steady-state rate
- **Integration with WAF:** Can add IP-based blocking, geographic restrictions, SQL injection protection on top of rate limiting
- **Lesson:** Cloud-managed rate limiting solves the "Redis goes down" problem — managed service handles HA

---

### Redis Implementation Details — Exact Patterns

#### Lua Script for Token Bucket (Atomic)
```lua
-- Key: rate_limit:{user_id}
-- Args: capacity, refill_rate, requested_tokens, now (unix timestamp)

local tokens_key = KEYS[1]
local last_refill_key = KEYS[2]

local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])  -- tokens per second
local requested = tonumber(ARGV[3])
local now = tonumber(ARGV[4])

local last_tokens = tonumber(redis.call("get", tokens_key))
if last_tokens == nil then
  last_tokens = capacity
end

local last_refill = tonumber(redis.call("get", last_refill_key))
if last_refill == nil then
  last_refill = now
end

-- Calculate tokens to add since last request
local elapsed = math.max(0, now - last_refill)
local new_tokens = math.min(capacity, last_tokens + (elapsed * refill_rate))

if new_tokens >= requested then
  -- Allow request
  redis.call("set", tokens_key, new_tokens - requested)
  redis.call("set", last_refill_key, now)
  redis.call("expire", tokens_key, math.ceil(capacity / refill_rate) * 2)
  return 1  -- allowed
else
  -- Reject request
  redis.call("set", tokens_key, new_tokens)
  redis.call("set", last_refill_key, now)
  return 0  -- denied
end
```

**Why Lua over MULTI/EXEC?**
- `MULTI/EXEC` (Redis transactions) executes commands atomically but CAN'T make conditional decisions mid-transaction (no `if` logic)
- Lua scripts execute atomically AND support branching logic (read → compute → write in one atomic block)
- Lua is ~2-10x slower than raw commands but guarantees atomicity with logic
- **Rule:** Use Lua when you need read-compute-write atomicity; use MULTI/EXEC for simple batching

#### Redis Cluster Considerations
- **Problem:** Single Redis instance is a SPOF and throughput bottleneck
- **Redis Sentinel** — High availability for single-node: automatic failover (promotes replica to master), monitoring, notifications. Does NOT shard data.
- **Redis Cluster** — Shards data across 16,384 hash slots across multiple nodes. Each node is responsible for a subset of slots.
- **Rate limiting with Redis Cluster:** All keys for same user must be on same node. Use hash tags: `{user_123}:counter` — Redis Cluster routes by `{...}` part, so all user_123 keys go to same node.
- **Interview answer:** "For production, Redis Cluster with 3 master + 3 replica nodes provides both HA and horizontal throughput scaling."

---

### Advanced Rate Limiting Patterns

#### Adaptive / Dynamic Rate Limiting
**Concept:** Limits adjust automatically based on system health, not just fixed thresholds.

**Example scenarios:**
- System CPU > 80% → reduce rate limit by 20% for all users
- Specific downstream service slow → reduce rate to that service
- Black Friday promotion → temporarily increase limits for authenticated users

**Implementation:**
```
rate_limit = base_limit × health_factor × user_tier_factor
health_factor = (1 - (system_load / max_capacity)) * 1.2  # 0.2 to 1.2 range
```
- Monitor system health metrics (CPU, DB latency, error rates)
- Rate limit values are dynamic, fetched from config store (Consul, etcd) rather than hardcoded

#### Rate Limiting by Cost (Not Just Count)
**Problem:** Not all requests are equal. `GET /users/1` costs 1ms; `GET /users/1/report/annual` costs 500ms and hits 10 DB queries.

**Solution: "Credit/Cost-Based" Rate Limiting**
- Assign a cost to each endpoint (1, 5, 10, 50 credits)
- User has a credit budget per period (e.g., 1000 credits/minute)
- `POST /bulk-import` costs 100 credits; `GET /users` costs 1
- GitHub uses this for their GraphQL API (each query has a calculated cost)

**Implementation:** Return the cost in response headers so clients can plan: `X-RateLimit-Cost: 5`

#### Tiered Rate Limiting (Free/Pro/Enterprise)
```
Free tier:       100 req/min per user
Pro tier:        1,000 req/min per user
Enterprise tier: 10,000 req/min + dedicated rate limiter instance
```

**Storage model:**
```
user_limits table:
  user_id, tier, requests_per_minute, burst_capacity, api_key

rate_limit lookup:
  1. Get user tier from user_limits (cached in Redis Hash, invalidated on plan change)
  2. Apply tier-specific limits to rate limiter check
```

#### Distributed Rate Limiting: Local + Global Counters
**Problem:** Centralized Redis is a bottleneck for millions of requests/sec.

**Solution: Two-Tier Counter**
```
Local counter (in-process):
  - Each rate limiter instance has local counter in memory
  - Extremely fast (nanoseconds, no network call)
  - Periodically syncs with global Redis counter (every 100ms)

Global counter (Redis):
  - Authoritative counter
  - Local counters push deltas periodically

Trade-off:
  - May over-allow by (number_of_nodes × sync_interval × local_rate) in the worst case
  - For most use cases, 10% over-allow is acceptable vs 10x throughput gain
```

This is what Cloudflare actually does at their edge PoPs.

---

### Rate Limiting in Microservices

#### Service Mesh Integration (Istio/Envoy)
- **Sidecar proxy pattern:** Every microservice gets a companion proxy (Envoy) that handles rate limiting, circuit breaking, retries, metrics
- Rate limiting config in Envoy:
  - Local: Envoy's built-in token bucket, per-service (no network call)
  - Global: Envoy calls external rate limit service (gRPC) — Lyft's ratelimit service is open-source
- **Benefit:** Rate limiting logic extracted from application code — consistent policy enforcement across 100+ services
- **Interview point:** "In a microservice architecture, I'd configure rate limiting at the API Gateway level for external clients, and at the service mesh level (Istio) for internal service-to-service calls."

#### Circuit Breaker vs Rate Limiter — Relationship
| Concept | Rate Limiter | Circuit Breaker |
|---|---|---|
| Protects | Server from being overwhelmed | Caller from sending to a failing service |
| Triggers on | Too many requests | Too many failures/timeouts |
| State | Stateless (count-based) | Stateful (CLOSED → OPEN → HALF-OPEN) |
| Direction | Inbound traffic control | Outbound call protection |

**They work together:** Rate limiting prevents overload → if system still becomes unhealthy, circuit breaker stops calls. Both are in the defense-in-depth stack.

#### Rate Limiting Beyond HTTP
**WebSocket connections:**
- Can't rate limit by request (connection is persistent)
- Rate limit by: messages per second on the connection, concurrent connections per user
- Implementation: Track message count in sliding window per `(user_id, connection_id)`

**gRPC:**
- gRPC supports server-side streaming, bidirectional streaming
- Rate limit at the gRPC interceptor layer (equivalent to HTTP middleware)
- Same algorithms apply but count is per-RPC-method, per-stream, or per-message

**Database queries:**
- PostgreSQL: `pg_bouncer` (connection pooler) can limit connections per user/database
- MySQL: `MAX_USER_CONNECTIONS` per account
- Application-level: Semaphore pattern (limit concurrent DB connections from app)

**Background jobs:**
- Sidekiq (Ruby): `Sidekiq::Throttled` — rate limit job processing per queue
- Celery (Python): `rate_limit` param on task definition
- Key insight: Rate limiting jobs prevents downstream services from being overwhelmed during batch processing

---

### DDoS Protection — Defense in Depth

Rate limiting is **one layer** in a multi-layer defense:

```
Layer 1: CDN-Level (Cloudflare, AWS CloudFront)
  - Absorbs volumetric attacks (floods)
  - Geo-blocking, IP reputation lists
  - Handles Gbps-level traffic without reaching your servers

Layer 2: WAF (Web Application Firewall)
  - Layer 7 filtering: SQL injection, XSS, bot signatures
  - OWASP rule sets
  - AWS WAF, Cloudflare WAF, ModSecurity

Layer 3: Rate Limiting (our system)
  - Limits legitimate-looking traffic
  - Per-user, per-IP, per-endpoint limits

Layer 4: Application Layer
  - Input validation, authentication
  - Business logic rate limiting (e.g., max 3 password attempts)

Layer 5: Database/Infrastructure
  - Connection pooling, query timeout
  - Circuit breakers
```

**Interview answer:** "A dedicated rate limiter protects against abuse from legitimate-looking traffic — someone using a valid API key to scrape your entire database. CDN/WAF handles volumetric attacks and known bot signatures. These work together; one doesn't replace the other."

---

### Monitoring & Alerting

#### Key Metrics to Track
| Metric | Description | Alert condition |
|---|---|---|
| `rate_limit_hits_total` | Count of requests that hit rate limit | Sudden spike: possible attack |
| `rate_limit_hits_by_user` | Per-user breakdown | Single user consistently hitting limit: review their usage |
| `rate_limit_latency_p99` | Time added by rate limiter | > 5ms: Redis performance issue |
| `redis_memory_used` | Redis memory consumption | > 80%: scaling needed |
| `redis_replication_lag` | Lag between master and replica | > 100ms: consistency risk |
| `false_positive_rate` | Legitimate users being rate limited | > 0.1%: limits too aggressive |

#### Detecting False Positives (Legitimate Users Being Blocked)
**Signs:**
- Support tickets from users saying they're being blocked despite normal usage
- API error rate spike correlated with a specific event (product launch, marketing campaign)
- P99 request rate from legitimate users approaching limit

**Investigation:**
1. Check which `user_id`s are hitting 429s most
2. Cross-reference with user activity logs (are they really abusing, or is our limit too low?)
3. Check for shared IPs (corporate offices, AWS NAT gateways) — many legitimate users behind one IP

**Solutions:**
- Switch from IP-based to user-token-based limiting for authenticated users
- Whitelist known corporate IP ranges
- Temporarily increase limits for users on legitimate plans during high-traffic events

#### Graceful Degradation
**Instead of hard 429, consider:**
- **Shedding:** Accept request but return cached/stale response
- **Priority queuing:** Critical requests (payments) bypass rate limit; secondary requests (analytics) get limited
- **Soft limiting:** Log and alert but don't block (for internal services) — protect service level without breaking functionality

---

## Interview Follow-Up Traps & How to Handle Them

### "What if Redis goes down?"
**Trap:** "The rate limiter stops working and all requests are allowed."
**Better answer:**
> "This is a critical failure mode. Three approaches:
> 1. **Fail-open (allow all):** Best for user-facing APIs where blocking good users is worse than allowing some extra traffic during Redis outage. Add monitoring to detect abuse during outage.
> 2. **Fail-closed (block all):** For security-sensitive endpoints (login, payment), better to be unavailable than to allow unlimited attempts. Return 503.
> 3. **Fallback to local limiting:** Each rate limiter node uses local in-memory counter. Less accurate but maintains basic protection. Combine with Redis Sentinel/Cluster for HA.
>
> In practice: deploy Redis Cluster (3 master + 3 replica nodes) for HA, use fail-open for most endpoints, fail-closed for auth."

### "How do you rate limit across regions?"
**Trap:** "Just use Redis everywhere."
**Better answer:**
> "Cross-region rate limiting introduces latency (cross-region Redis sync) vs accuracy trade-offs.
> Three approaches:
> 1. **Regional isolation:** Each region has its own rate limit (user gets 1000 req/min per region, not global). Simple but can be gamed by distributing requests.
> 2. **Eventual consistency with sync:** Regional Redis instances; periodic sync. ~100ms of potential over-limiting/under-limiting. Acceptable for most use cases.
> 3. **Centralized global Redis:** Single cluster, all regions write to it. Accurate but adds 50-150ms cross-region latency to every request. Only for strict compliance requirements.
>
> For most systems, regional isolation or eventual sync is the right trade-off."

### "What about authenticated vs unauthenticated users?"
**Trap:** Treating them identically.
**Better answer:**
> "They should have different limits and different limiting keys:
> - **Unauthenticated:** Rate limit by IP address. Typically lower limits (60-100 req/hour) because IP identity is weak (shared NAT, VPNs). Prevents crawling/scraping.
> - **Authenticated:** Rate limit by user token/API key. Higher limits (1000-5000 req/hour). Allows legitimate power users. Also enables accountability — if someone abuses, you know who it is.
>
> For mixed endpoints (supports both auth modes): apply both limits. If authenticated, use token limit. If not, fall back to IP limit."

### "How do you handle rate limiting for your own internal microservices?"
**Trap:** "Same as external rate limiting."
**Better answer:**
> "Internal services have different constraints:
> 1. **Service mesh layer (Istio/Envoy):** Preferred for internal. Sidecar proxy enforces limits without code changes.
> 2. **Lower latency tolerance:** Internal rate limit check must be < 1ms; external can be 5-10ms.
> 3. **Trust model:** Internal services are generally trusted; rate limiting is to prevent accidental thundering herd (e.g., a service restarting and replaying all queued requests), not malicious abuse.
> 4. **Circuit breakers first:** For internal services, circuit breakers are often more appropriate than rate limiting."

---

## Algorithm Selection Decision Tree

```
Is your use case bursty (e.g., marketing email sending, flash sales)?
  ├─ Yes → Token Bucket (allows accumulation and burst release)
  └─ No → Continue...

Do you need a constant, stable outflow rate (e.g., payment processing)?
  ├─ Yes → Leaking Bucket (queue-based, fixed processing rate)
  └─ No → Continue...

Is memory a constraint? Very high cardinality (millions of users)?
  ├─ Yes → Sliding Window Counter (approximate but memory-efficient)
  └─ No → Continue...

Do you need perfect accuracy (e.g., financial transactions, compliance)?
  ├─ Yes → Sliding Window Log (exact but memory-intensive)
  └─ No → Continue...

Default for most APIs:
  └─ Sliding Window Counter (balanced: good accuracy, memory efficient)
      Or Fixed Window Counter (simplest, if boundary burst is acceptable)
```

#### Quick Reference: Algorithm Pros/Cons Summary
| Algorithm | Burst Support | Memory | Accuracy | Complexity | Best For |
|---|---|---|---|---|---|
| Token Bucket | Yes | Low | High | Medium | General APIs, burst-friendly |
| Leaking Bucket | No | Low | High (flow) | Medium | Stable outflow, queuing |
| Fixed Window Counter | Yes (boundary) | Very Low | Medium | Low | Simple throttling, non-critical |
| Sliding Window Log | Yes | High | Perfect | Medium | High-stakes, low-volume endpoints |
| Sliding Window Counter | Partial | Low | High (~99.997%) | Medium | Most production systems |

---

## Teaching Playbook

### Socratic Questions by Topic

**Algorithms:**
- "With Fixed Window Counter, if your limit is 5 requests/minute, how many requests can I make in a 2-second window at midnight? Why is that a problem?"
- "Token Bucket lets you burst. Is that always good? When would a burst be dangerous to your system?"
- "Sliding Window Log is perfectly accurate. Why don't all systems use it?"
- "Sliding Window Counter uses approximation. Given Cloudflare's 0.003% error rate, is this acceptable for a billing system? For a social media feed?"

**Redis / Distribution:**
- "Two rate limiter servers check the counter simultaneously. Both see '4'. Both add 1. Counter is now 5. Is this 5 right? Why is this a problem?"
- "You have 10 rate limiter servers. Should each maintain its own counter, or should they all share one? What are the trade-offs?"
- "Lua scripts in Redis are 'atomic'. What does atomic mean here? What problem does it solve?"
- "Redis is in-memory. Your rate limiter crashes and restarts. All counters reset to zero. Is this a problem?"

**System Design:**
- "Where should you put the rate limiter: in each API server, in a separate middleware, or in the API Gateway? Why?"
- "Your app has 10 endpoints. Should they all share one rate limit, or should each have its own?"
- "A user hits your API 1000 times in one minute, then stops for 5 minutes. Should the 5-minute quiet period 'earn' them extra quota?"

### Common Misconceptions

| Misconception | Reality |
|---|---|
| "Fixed Window Counter is good enough" | The boundary burst problem allows 2x the intended rate at window transitions. For strict limits, this fails. |
| "Rate limiting prevents all DoS attacks" | Rate limiting prevents application-layer abuse. Volumetric DDoS (floods at Gbps level) requires CDN/network-level protection. |
| "More Redis instances = better rate limiting" | Multiple Redis instances without proper synchronization actually makes rate limiting less accurate (counts drift per instance). |
| "Sliding Window Log uses excessive memory because of rejected requests" | Yes — but the fix is to set a TTL on the log and limit its size. Rejected requests can be removed after the window passes. |
| "Rate limiting should be transparent to clients" | Good APIs communicate rate limits proactively (in every response header), not just on 429. Clients can adapt before being blocked. |
| "Token Bucket is for external, Leaking Bucket is for internal" | Both can be used for either. Choose based on burst tolerance vs constant outflow needs, not external/internal distinction. |

### Aha-Moment Triggers

1. **The "Midnight boundary" demo** — Draw a Fixed Window Counter timeline. At 11:59:59 PM, user sends 5 requests. At 12:00:00 AM, they send 5 more. In 1 second, 10 requests pass through a "5/minute" limiter. The light bulb moment: fixed windows are anchored to the clock, not to the user's behavior.

2. **The "Token Bucket savings account" analogy** — "Imagine your API tokens are money. You earn $1/second. Your account holds up to $100. You can save up tokens and spend a lot in a burst, like using a saved-up paycheck. Now explain Token Bucket." Making it concrete with money makes the algorithm intuitive.

3. **The "Why does Stripe charge per API call?" connection** — "If Stripe didn't rate limit, a single buggy customer app could generate 1 million API calls in a minute, costing Stripe thousands in compute. Rate limiting is how Stripe makes billing fair." This makes rate limiting a business necessity, not just technical infrastructure.

4. **The "Race condition hands-on" exercise** — Trace two threads simultaneously: Thread A reads counter=4, Thread B reads counter=4, Thread A writes counter=5, Thread B writes counter=5. Counter is 5 but two requests were allowed. Then trace the same with Lua script: Thread A runs entire script atomically (reads 4, writes 5), THEN Thread B runs (reads 5 → blocks). The atomicity value becomes visceral.

5. **The "Cloudflare's 0.003% number" context** — "400 million requests, 0.003% error rate = 12,000 incorrectly handled requests. For a social media app, that's 12,000 users mildly inconvenienced. For a payment system, that's potentially 12,000 wrong transactions. The same algorithm can be right or wrong depending on context."

### Assessment Questions (Testing Wiganz's Understanding)

**Level 1 — Conceptual:**
- What HTTP status code does a rate limiter return when blocking a request? What headers should it include?
- Name 3 benefits of rate limiting. Which one is most important for a startup vs for a large platform?
- Why is the Token Bucket algorithm preferred for APIs that need to support occasional burst traffic?

**Level 2 — Trade-offs:**
- You're building a rate limiter for a financial API. Accuracy is critical. Which algorithm do you choose? What's the memory cost?
- Your rate limiter uses Redis. Redis goes down. Do you fail-open or fail-closed? Justify your answer for: (a) a login endpoint, (b) a social media post endpoint.
- A user has a Token Bucket with capacity=100 tokens, refill=10/sec. They haven't made a request in 10 seconds. They then burst 100 requests in 1 second. Should all 100 be allowed?

**Level 3 — Design:**
- Design a rate limiter that supports: 100 req/min for free users, 1000 req/min for paid users, and different limits per endpoint. Walk through the data model and request flow.
- Your rate limiter currently runs on a single server. Traffic is growing 10x. How do you scale it? What trade-offs do you accept?
- Your rate limiter is incorrectly blocking 5% of legitimate requests. How do you diagnose this? What are the 3 most likely root causes?

---

## Cross-Chapter Connections

- **Chapter 1 (Scaling):** Rate limiting architecture IS a scaling problem — the rate limiter itself must scale horizontally. Same Redis caching patterns from Chapter 1 apply here.
- **Chapter 3 (Framework):** "Design a Rate Limiter" is a canonical system design interview question. Use Chapter 3's 4-step framework to structure your answer: scope (per-user? per-IP? which endpoints?), estimate (QPS of the rate limiter itself), design (Redis + middleware), deep dive (algorithm choice, distributed challenges).
- Stateless rate limiter middleware connects to Chapter 1's stateless web tier — rate limiting servers can scale horizontally because state lives in Redis
- Consistent hashing from Chapter 1 can be used to route specific users' rate limiting keys to specific Redis nodes in a cluster
