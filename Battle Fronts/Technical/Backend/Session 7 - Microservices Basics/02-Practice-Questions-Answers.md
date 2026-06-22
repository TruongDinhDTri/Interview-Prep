# 🎯 Practice Questions & Answers: Microservices Basics

**Cách dùng:** Đọc câu hỏi → đóng file → tự answer to trong 2 phút → mở ra so sánh.

---

## Q1: "You have a monolith serving 1 million users. It's getting slow. When should you move to microservices?"

**Weak Answer:**
> "When the app becomes too big, we should split it into microservices to scale better."

**Strong Answer:**

*Start with the right diagnostic question:*
> "First I'd want to understand *why* it's getting slow. 'Getting slow' could mean very different things with very different solutions. Is the database query performance degrading? That's an indexing/caching problem — doesn't need microservices. Is a specific module consuming too much CPU and starving other modules? That's a candidate for extraction. Is the deployment process so slow and risky that engineers can't ship features fast enough? That's a people/process problem that microservices might solve."

*The 3 signals that actually justify extraction:*
> "The signals I look for are: first, one component has a dramatically different scaling profile than the rest — like your Search service needs 50x the resources of your User service during peak. Scaling the entire monolith for that is wasteful. Second, teams are stepping on each other's deployments — if 50 engineers are waiting to deploy because the codebase is one artifact, the coordination overhead alone justifies extraction. Third, a clear domain boundary exists where the team can own it independently — you know where the seams are."

*How I'd migrate (not all at once):*
> "And critically — I would not do a Big Bang rewrite. That's killed many companies. I'd use the Strangler Fig pattern: identify the service with the clearest boundary and the biggest performance impact, extract it behind the existing API Gateway, run both monolith and the new service in parallel briefly to validate, then cut over. Over 12-18 months, strangle the monolith incrementally. Every step is reversible."

*What I'd NOT do:*
> "I'd also resist the pressure to extract everything immediately just because 'microservices are modern.' A well-structured modular monolith with clear module boundaries can serve 1 million users without the operational overhead of microservices. The question isn't 'should we use microservices?' — it's 'what specific problem are we solving and is microservices the right tool for it?'"

---

## Q2: "A user places an order on your e-commerce platform. Walk me through what happens across your microservices."

**Weak Answer:**
> "The order goes to the Order Service, then Payment Service charges the card, then the Notification Service sends a confirmation email."

**Strong Answer:**

*First: acknowledge the distributed transaction challenge:*
> "This is a great question because placing an order spans multiple services — Order, Payment, Inventory, Notification — and we need to handle partial failures gracefully. In a monolith, one ACID transaction would handle all of this. In microservices, we need a Saga pattern."

*Walk through the happy path in detail:*
> "Here's the flow using an Orchestration-based Saga, since this is a critical business flow where I want visibility into each step:
>
> 1. Client submits order → API Gateway authenticates JWT, routes to Order Service
> 2. Order Service creates an order record with status `PENDING`, publishes request to Order Orchestrator
> 3. Orchestrator calls Payment Service: 'Charge user 123 for $999.' Payment Service calls Stripe/payment processor, confirms charge, returns `PAYMENT_SUCCESS`.
> 4. Orchestrator calls Inventory Service: 'Reserve 1 unit of product 456.' Inventory checks stock, sets a reservation lock, returns `INVENTORY_RESERVED`.
> 5. Orchestrator updates Order Service: status → `CONFIRMED`.
> 6. Orchestrator publishes `OrderConfirmed` event → Notification Service sends email/push asynchronously."

*Walk through a failure path — this is what separates strong answers:*
> "Now the interesting case: what if Inventory Service fails after Payment already succeeded?
>
> The Orchestrator receives `INVENTORY_FAILED`. It now executes compensating transactions: calls Payment Service with 'Refund charge for user 123.' Payment Service refunds. Orchestrator updates Order status to `CANCELLED`. Notification Service sends 'Sorry, item out of stock' email.
>
> The key insight: compensating transactions must be idempotent — if the refund call fails and we retry, calling 'refund' twice must not double-refund. Payment Service must check if a refund already exists for this order ID."

*Data considerations:*
> "Each service has its own database — Order DB, Payment DB, Inventory DB. The Orchestrator stores the Saga state in its own DB so it can resume after a crash. If the Orchestrator itself crashes mid-saga, it replays from the last committed step."

---

## Q3: "What is the Saga pattern and when do you need it?"

**Weak Answer:**
> "Saga is a pattern for managing transactions across multiple microservices. You use it when you need to coordinate between services."

**Strong Answer:**

*Why it exists — the core problem:*
> "The Saga pattern exists because distributed ACID transactions are practically impossible at scale. When you have Order Service, Payment Service, and Inventory Service each with their own database, you can't issue a BEGIN TRANSACTION across all three and have it roll back atomically if something fails. Two-Phase Commit (2PC) theoretically solves this, but it's slow, brittle, and blocks all participating services while the coordinator decides — terrible for high-throughput systems."

*What Saga actually is:*
> "Saga replaces the single ACID transaction with a sequence of local transactions, each with a corresponding compensating transaction that undoes its effect. Instead of 'lock everything, then commit or rollback atomically,' you 'commit each step, and if a later step fails, explicitly undo earlier steps.'
>
> The key property: each step is locally atomic (ACID within its own DB), but the saga as a whole is only eventually consistent."

*The two flavors with clear trade-offs:*
> "Choreography: services communicate via events. Order Service publishes `OrderCreated` → Payment Service consumes and charges → publishes `PaymentDone` → Inventory consumes and reserves. No central coordinator. Fully decoupled — services don't know about each other, only about events. Downside: the overall saga state is implicit and hard to observe. Debugging a failed saga means hunting through events across multiple services' logs.
>
> Orchestration: an Order Orchestrator service explicitly commands each step: 'PaymentService.charge()' → wait → 'InventoryService.reserve()' → wait. The orchestrator holds the full saga state. Easy to debug (one place to look), easy to add steps, but the orchestrator is now a central dependency and potential bottleneck."

*When you need it:*
> "You need the Saga pattern whenever: a user action spans multiple services AND failure midway must leave the system in a consistent state. For e-commerce: placing an order. For banking: transferring money between accounts. For travel: booking flight + hotel + car together. Any workflow where 'partial success' is worse than 'complete failure.'"

---

## Q4: "Service A calls Service B which calls Service C. Service C starts responding very slowly — 10 second response times. What happens to the system?"

**Weak Answer:**
> "Service C being slow will make Service B and Service A slow too. We should add a circuit breaker to prevent this."

**Strong Answer:**

*Walk through the cascade step by step:*
> "This is a cascading failure scenario, and it's one of the most common ways microservices architectures collapse. Let me trace what actually happens at the infrastructure level:
>
> First: C is slow (10s response). B is waiting for C. B has a thread pool — let's say 100 threads for handling requests. B allocates 1 thread per in-flight request to C. Since C takes 10s, each thread is tied up for 10 seconds instead of the normal 50ms. At B's normal throughput of 100 requests/second, within 10 seconds B has exhausted all 100 threads. New requests from A start queuing. B's response time degrades. B starts returning 503s to A.
>
> Second: A is now waiting for B. A has its own thread pool. Same thing happens — A's threads tie up waiting for B's slow responses. A exhausts its thread pool. A starts returning errors to the original clients."

*The domino name:*
> "This is called **cascading failure** or **timeout propagation**. One slow service propagates latency upstream until the entire call chain is degraded. In distributed systems, slow is often worse than down — a service that's down fails fast, a service that's slow holds threads hostage."

*The solutions — in order:*
> "The defense has three layers:
>
> Layer 1: **Timeouts.** B should not wait 10 seconds for C. Set a timeout based on C's P99 latency — if C normally responds in 200ms, set timeout at 500ms. After 500ms with no response, fail fast and free the thread. This limits blast radius.
>
> Layer 2: **Circuit Breaker.** After 5 consecutive timeouts from C, B's circuit breaker opens. Now B stops calling C entirely and returns an immediate error (or cached fallback). This prevents B's thread pool from being exhausted at all.
>
> Layer 3: **Bulkhead.** B should have a separate, size-limited thread pool for calls to C specifically. If the C-calls pool (say, 20 threads) fills up, it doesn't spill into threads handling calls to other services. Contain the blast radius to C-related functionality only."

---

## Q5: "Should each microservice have its own database? What are the trade-offs?"

**Weak Answer:**
> "Yes, each microservice should have its own database so they are independent."

**Strong Answer:**

*Affirm the principle, then explain WHY — not just what:*
> "Yes, database-per-service is a core microservices principle, but the 'why' is more important than the rule itself. The fundamental goal of microservices is loose coupling — the ability for teams to change, deploy, and scale their service without coordination with other teams. If two services share a database, you've created a coupling point at the data layer that defeats the purpose.
>
> Concretely: if Order Service and User Service share a `users` table, and the User Service team wants to rename a column — they now have to coordinate with the Order Service team, run a multi-phase migration, and deploy both services together. You've recreated the deployment coupling that microservices were meant to eliminate."

*Technology freedom:*
> "Database-per-service also enables technology freedom. User Service might use Postgres (relational, complex queries). Product Search uses Elasticsearch (full-text search). Shopping cart uses Redis (fast key-value, TTL). If they shared a database, you'd be forced to use the same technology for all. Each team picks what best fits their access patterns."

*The hard part — cross-service data access:*
> "The trade-off is cross-service data access. If Order Service needs a user's email for the confirmation, it can't query the users table directly. Two solutions: synchronous API call (`GET /users/{id}`) for fresh data — adds latency and creates a runtime dependency. Or event-driven replication: User Service publishes `UserEmailChanged` events, Order Service consumes and caches email in its own DB — Order Service is now autonomous (doesn't need User Service to be up) at the cost of brief eventual consistency.
>
> The right choice depends on how critical data freshness is. For most data (email, name, preferences), seconds of eventual consistency is acceptable. For financial data (account balance, credit limit), you'd want synchronous calls and potentially Saga-based consistency."

*Anti-pattern to call out:*
> "The worst of both worlds: sharing a database 'just between two services temporarily.' That temporary exception becomes permanent. I'd rather design the API contract explicitly from day one, even if it requires more upfront work."

---

## Q6: "What is an API Gateway and what should NOT go into it?"

**Weak Answer:**
> "API Gateway is a single entry point for all client requests. It handles routing and authentication. Business logic should not go in it."

**Strong Answer:**

*Start with the problem it solves:*
> "Without an API Gateway, client apps face a fragmented interface: the mobile app has to know that user data is at port 3001, orders at port 3002, search at Elasticsearch's port. Each service has its own auth mechanism, its own rate limiter, its own CORS config. When services move or scale, client configuration breaks. The Gateway provides a stable, unified contract to the outside world while the internal topology changes freely."

*What belongs in the Gateway:*
> "The Gateway is the right home for cross-cutting concerns that apply to ALL services: authentication and authorization (verify JWT once at the gateway, forward user context via headers — each downstream service doesn't need to verify tokens independently), rate limiting (100 requests/minute per IP across all APIs), SSL termination, request/response logging, CORS headers, and routing rules.
>
> The BFF (Backend for Frontend) variant is also powerful — a separate gateway per client type. Mobile clients need lean responses to save bandwidth and battery; web clients can handle richer data. Rather than building complex serialization logic in each service, a Mobile BFF aggregates and slims down, a Web BFF provides the full payload."

*What should NOT go in — this is where candidates distinguish themselves:*
> "**Business logic must never go in the API Gateway.** The moment you put 'if user is premium tier, allow more results' or 'calculate shipping cost' in the gateway, you've created a monolith disguised as an API Gateway. It becomes a single point of change for business decisions, requires coordinated deployment, and you lose the independent evolution benefit of microservices.
>
> Similarly, data aggregation beyond simple BFF patterns belongs in services. If you find yourself writing complex join-like aggregation in the gateway ('get user, then get their orders, then get product details for each order'), that's a sign you need a dedicated Aggregation Service or a better data model, not a smarter gateway.
>
> The gateway should be a dumb pipe with smart routing — it knows WHERE to send requests, not WHAT to do with the data."

---

## Key Phrases to Remember

| Situation | What to say |
|-----------|-------------|
| Asked about microservices | "It depends on team size and whether services need to scale independently..." |
| Monolith trade-off | "Monolith gives you ACID transactions, simple debugging, and zero network overhead — don't abandon those lightly" |
| Saga pattern | "A sequence of local transactions with compensating rollbacks — not ACID, but eventually consistent" |
| Cascading failure | "Slow is worse than down — slow services hold threads hostage and cascade upstream" |
| DB per service | "Coupling at the data layer defeats the purpose — but cross-service data access requires explicit design" |
| When NOT to use | "Small team, early stage, unclear boundaries, no DevOps maturity — monolith is the right answer" |
| Strangler Fig | "Incremental extraction behind the existing API Gateway — never a Big Bang rewrite" |

---

## Practice Strategy

**Scenario drill (say out loud):** "Walk me through placing an order in your microservices e-commerce system" — practice until you can say all steps (happy path + failure path + compensating transactions) in under 3 minutes.

**Trade-off drill:** For each of these, state ONE pro and ONE con:
- Choreography vs Orchestration
- REST vs gRPC
- Sync vs Async communication
- Shared DB vs DB-per-service

**The question that trips people:** "When would you NOT use microservices?" — most candidates only practice defending microservices. Practice the reverse.
