# 📝 Key Talking Points: Microservices Basics

**Goal:** Không chỉ biết "microservices là gì" — mà biết *tại sao*, *khi nào*, và *đánh đổi thực sự là gì*. Đặc biệt: khi interviewer hỏi "Would you use microservices for this system?", bro cần nói được nhiều hơn "it scales better" — bro cần đề cập Saga pattern, service discovery, Conway's Law, và khi nào microservices là sai lầm.

---

## Section 1: The Monolith — "Nhà hàng 1 đầu bếp"

### The Story: Một tiệm pizza lúc nhỏ

Hãy tưởng tượng một tiệm pizza lúc mới mở. Chỉ có một đầu bếp làm tất cả: nhào bột, trải sốt, xếp topping, bỏ lò, lấy ra, cắt, và giao hàng.

Khi tiệm nhỏ — có 5 đơn/ngày — hệ thống hoạt động hoàn hảo. Giao tiếp? Đầu bếp tự nói chuyện với tay mình. Nhất quán? Mọi bước xảy ra trong cùng một đầu người.

Nhưng khi tiệm nổi, có 500 đơn/ngày:
- Một đầu bếp không đủ → nhưng nếu thuê 10 đầu bếp vào cùng 1 bếp → chaos (ai làm gì? ai đang dùng lò?)
- Khi bếp xảy ra sự cố ở khâu cắt bánh → cả 10 đầu bếp đều bị ảnh hưởng
- Để upgrade lò (chỉ 1 phần) → phải đóng cửa toàn bộ tiệm

**Đây là monolith.** Hoàn hảo ở quy mô nhỏ. Bộc lộ điểm yếu khi scale.

### Monolith Anatomy

```
┌──────────────────────────────────────────────────┐
│              E-Commerce Monolith                 │
│                                                  │
│  [Auth Module] ←→ [User Module] ←→ [Order Module]│
│       ↕                 ↕               ↕        │
│  [Payment Module] ←→ [Inventory] ←→ [Notification]│
│                                                  │
│  └─ Single codebase    └─ Single database        │
│  └─ Single deployment  └─ Single process         │
└──────────────────────────────────────────────────┘
```

**Strengths of monolith (interviewer bẫy — nhiều người quên điều này):**
- ✅ Simple local function calls (no network overhead)
- ✅ ACID transactions across all modules trivially
- ✅ Easy to debug (one process, one log stream)
- ✅ Simple deployment (one artifact)
- ✅ No distributed systems complexity

**When monolith breaks down:**
- 50+ engineers merging into same codebase → merge conflicts, deployment bottleneck
- One module (e.g., Search) needs 10x more resources than others → must scale entire app
- Team working on Payment wants to deploy at 2am → requires redeploying whole app (risk)
- One buggy deploy of Search crashes Payment service too

---

## Section 2: Microservices — "Mỗi đầu bếp có bếp riêng"

### The Architecture

```
[Auth Service]      → Auth DB (Postgres)
       ↕ REST/gRPC
[User Service]      → User DB (Postgres)
       ↕
[Order Service]     → Order DB (Postgres)
       ↕ async via Kafka
[Payment Service]   → Payment DB (Postgres)
       ↕
[Notification Svc]  → (Email/SMS — no DB needed, stateless)

Each box = independent process, independent database, independent deployment
```

### Conway's Law — "Architecture = Org Chart"

> *"Any organization that designs a system will inevitably produce a design whose structure is a copy of the organization's communication structure."* — Melvin Conway, 1967

**What this means in practice:**
```
Company with 1 team → monolith (natural)

Company with teams organized by function:
  Team A: Frontend  → One frontend service
  Team B: Backend   → One backend service
  Team C: Data      → One data service
→ Produces: 3 monolithic layers (N-tier architecture)

Company with teams organized by domain (Amazon model):
  Team A: Checkout   → Checkout service
  Team B: Search     → Search service
  Team C: Reviews    → Reviews service
→ Produces: microservices naturally
```

**Amazon's famous mandate (Jeff Bezos):** Every team must expose their functionality through a service API. No direct database access, no shared memory. Teams communicate only via APIs. This forced Conway's Law in the right direction — architecture mirrored the autonomous team structure.

**Two-pizza rule:** If a team can't be fed with two pizzas, it's too big (≈ 6-8 people). Each microservice owned by one two-pizza team.

---

## Section 3: When to USE Microservices — The 4 Signals

### Signal 1: Independent Scaling Requirements
```
Scenario: Black Friday sale
  - Search service: 100x normal traffic (everyone searching for deals)
  - Order service: 50x normal traffic
  - User profile service: 2x normal (barely affected)

Monolith solution: Scale ENTIRE app 100x → wasteful, expensive
Microservices solution: Scale Search × 100, Order × 50, Profile × 2
→ 60-70% infrastructure cost reduction
```

### Signal 2: Multiple Teams Working Simultaneously
```
50 engineers × 1 codebase → every engineer experiences:
  - "Why is main broken? Who broke the build?"
  - Merge conflict hell every Friday before deploy
  - "I can't deploy my feature because Team X's broken code is in the same build"
  - Deployment bottleneck: only 1 deploy at a time (everything in same artifact)

50 engineers × 8 services (6-7 engineers per service) →
  - Each team deploys independently, on their own schedule
  - Team A deploying Auth doesn't block Team B deploying Orders
  - No cross-team merge conflicts
```

### Signal 3: Different Technology Requirements
```
ML Recommendation Engine:
  → Needs Python, PyTorch, GPUs
  → Model updates daily (separate deploy cycle)
  → Can't force the whole company to use Python

Payments Service:
  → Needs Java/Kotlin, strong typing, Kafka
  → Compliance requirements: immutable audit log
  → Different reliability SLA (99.99% vs 99.9% for rest)

Real-time Chat:
  → Needs Node.js + WebSockets
  → Stateful connections, in-memory pub/sub
  → Completely different scaling model

In a monolith: stuck with one language, one framework, one deploy lifecycle
```

### Signal 4: Fault Isolation Requirements
```
Without microservices:
  Recommendation service has a memory leak
  → Memory pressure builds on shared server
  → Eventually: OOMKilled (Out of Memory)
  → ENTIRE app goes down (including Payments)
  → Orders can't complete during 5-minute restart

With microservices:
  Recommendation service has memory leak + crashes
  → Recommendation service is unavailable: homepage shows no recommendations
  → Everything else (Checkout, Payments, Search) continues working
  → Blast radius: degraded UX on homepage only
```

---

## Section 4: When NOT to Use Microservices — The 4 Anti-Signals

### Anti-Signal 1: Small Team (< 10 Engineers)
```
5-person startup adopting microservices:
  - Person 1: sets up Kubernetes (1 week)
  - Person 2: configures service discovery (3 days)
  - Person 3: sets up distributed tracing (2 days)
  - Person 4: writes inter-service authentication (2 days)
  - Person 5: debugging "why is Service A not finding Service B?" (2 days)

Result: 2 weeks of 5 engineers on infrastructure → 0 features shipped
Monolith: 2 weeks → 10+ features shipped

Rule of thumb: microservices overhead only makes sense when team coordination
overhead exceeds the microservices operational overhead
```

### Anti-Signal 2: Unclear Domain Boundaries
> "If you're not sure where to draw the service boundaries, you will draw them wrong. Wrong service boundaries = expensive refactoring 6 months later when you understand the domain better."

**The Strangler Fig Pattern (how to migrate safely):**
```
Don't rewrite everything at once — that's the "Big Bang" rewrite, historically fatal.

Instead:
1. Start with monolith
2. New features → build as separate services
3. Existing features → extract one-by-one, starting with the one with clearest boundaries
4. Route traffic through API Gateway that proxies to either monolith or new service
5. Over 12-18 months, strangle the monolith

Like a strangler fig tree: it wraps around the host tree (monolith)
until the original tree dies and is replaced by the new structure.
```

```
Month 0:    [Monolith handles 100% of requests]
Month 3:    [API Gateway] → Search Service (new)
                         → Monolith (everything else)
Month 9:    [API Gateway] → Search Service
                         → User Service (extracted)
                         → Monolith (remaining modules)
Month 18:   [API Gateway] → All services
                         → Monolith deprecated
```

### Anti-Signal 3: No DevOps Maturity
Microservices require BEFORE you start:
- Container orchestration (Kubernetes / ECS)
- Service discovery mechanism
- Centralized logging (Elasticsearch, Datadog)
- Distributed tracing (Jaeger, Zipkin, Datadog APM)
- Health monitoring per service
- CI/CD pipeline per service (not 1 pipeline — N pipelines)

Without these: when something goes wrong, you can't debug it. You have logs in 8 different places, no correlation between them, and no way to trace a single user request across services.

### Anti-Signal 4: Complex Cross-Service Transactions
This is the biggest pain point (covered deep in Section 6).
> "If your business logic requires atomic operations across 5 services, microservices will make you implement distributed transaction protocols. That's 10x harder than an ACID transaction in a monolith."

---

## Section 5: API Gateway — "Receptionist của Microservices City"

### What Problem It Solves

Without API Gateway:
```
Mobile App needs to:
  → GET /api/users/123      (User Service: port 3001)
  → GET /api/orders/user/123 (Order Service: port 3002)
  → GET /api/recommendations (ML Service: port 3003)
  → Verify JWT with Auth Service before each call
  → Handle different base URLs per environment
  → 3 separate CORS configs
  → 3 separate rate limiters
```

With API Gateway:
```
Mobile App:
  → All requests to gateway.api.company.com
  → Gateway handles: routing, auth, rate limiting, CORS
  → Internal services: hidden behind gateway
```

### What API Gateway Does

```
1. ROUTING
   /api/users/*       → User Service
   /api/orders/*      → Order Service
   /api/v1/search/*   → Search Service v1
   /api/v2/search/*   → Search Service v2 (A/B testing)

2. AUTHENTICATION (centralized)
   Client sends JWT → Gateway verifies with Auth Service
   If valid: forward request with user context headers
   If invalid: 401 immediately (never reaches downstream services)

3. RATE LIMITING (centralized)
   Instead of implementing in every service:
   Gateway: 100 requests/minute per IP, 1000/minute per authenticated user

4. PROTOCOL TRANSLATION
   Client speaks REST (HTTP/1.1)
   Internal services speak gRPC (HTTP/2 + protobuf, more efficient)
   Gateway translates between them

5. AGGREGATION (BFF pattern — see below)
   Single client request → gateway calls multiple services → aggregates → one response
```

### BFF Pattern — Backend for Frontend

**Problem:** Mobile app needs a different data shape than web app.
```
Web App needs:
  GET /dashboard → user info + recent orders + recommendations + analytics
  (power user, large screen, lots of data)

Mobile App needs:
  GET /dashboard → user name + 3 recent orders only
  (small screen, limited bandwidth, battery concern)
```

**Without BFF:**
```
Mobile calls 4 separate endpoints, receives 10x more data than it needs,
parses it on device (CPU intensive), shows what's needed
```

**With BFF:**
```
[Mobile BFF] → aggregates User + Orders → sends lean response to mobile
[Web BFF]    → aggregates User + Orders + Analytics → sends full response to web
```

```
               ┌──────────────────┐
iOS/Android ──→│   Mobile BFF     │──→ User Service
               └──────────────────┘──→ Order Service
                                   (no analytics, lean response)

               ┌──────────────────┐
Web Browser ──→│    Web BFF       │──→ User Service
               └──────────────────┘──→ Order Service
                                   ──→ Analytics Service
                                   (full response)
```

### API Gateway Trade-offs

| Pros | Cons |
|------|------|
| Single entry point → simpler clients | Single point of failure → needs redundancy |
| Centralized auth, rate limiting, logging | Added latency (1 extra network hop) |
| Hide internal service topology | Can become bottleneck if not scaled |
| Easy versioning (/v1, /v2) | Temptation to put business logic in gateway (antipattern) |

**Anti-pattern:** Don't put business logic in the API Gateway. It should be a dumb router + authenticator. Business logic → in the services.

---

## Section 6: Database Per Service — "Không share database"

### Why This Matters

**The most important microservices rule that's hardest to follow:**
```
❌ WRONG: All services share one database
┌──────────────────────────────────────────┐
│              Shared Database             │
│  users table  |  orders table  |  products│
└──────────────────────────────────────────┘
       ↑              ↑              ↑
  User Service   Order Service   Product Service

Why this is wrong:
- Order Service developer adds a column to users table → breaks User Service
- User Service indexes a table → slows down Order Service queries
- User Service needs to migrate users table → must coordinate with all teams
- Services are "loosely coupled" in theory, "tightly coupled" in practice (via shared DB)
```

```
✅ RIGHT: Each service owns its data
User Service  → users_db    (Postgres)
Order Service → orders_db   (Postgres)
Product Svc   → products_db (MongoDB — different tech, their choice)
Search Svc    → Elasticsearch (optimized for search)

Changes to users_db: User Service team's decision alone
Schema migration: doesn't affect any other service
Technology: each team picks what fits their use case
```

### But Then... How Do Services Share Data?

```
Q: Order Service needs user's email address for order confirmation. It's in users_db.
   Order Service can't access users_db directly. What does it do?

Option 1: Synchronous API call
  Order Service → GET /users/{id}/email → User Service → returns email
  Pro: Always fresh data
  Con: Order Service now depends on User Service being up

Option 2: Event-driven data replication
  User Service publishes "UserEmailChanged" event → Kafka
  Order Service subscribes → stores email copy in its own DB
  Pro: Order Service is fully independent (works even if User Service is down)
  Con: Eventual consistency — Order Service might have slightly stale email for 1-2 seconds
```

---

## Section 7: Saga Pattern — "Distributed Transactions Without Locks"

### The Problem: Order Placement

User buys a laptop. In a monolith:
```python
# Monolith: trivial ACID transaction
with db.transaction():
    order = Order.create(user_id=123, product_id=456, amount=999)
    payment = Payment.charge(user_id=123, amount=999)
    inventory.reduce(product_id=456, quantity=1)
    notification.send(user_id=123, "Order confirmed!")
# If ANY step fails → entire transaction rolls back atomically
```

In microservices:
```
Order Service, Payment Service, Inventory Service, Notification Service
→ Each has its own database
→ You CANNOT do a single ACID transaction across 4 separate databases
→ What if Order created, Payment charged, but Inventory update FAILS?
   → User paid for something that's out of stock
   → Inconsistent state
```

### Saga Pattern — The Solution

A Saga is a sequence of local transactions. Each step publishes an event or calls the next service. If a step fails, compensating transactions undo previous steps.

**Two flavors:**

#### Choreography-based Saga (Event-driven)
```
Services communicate via events, no central coordinator.

Order Service: creates order → publishes "OrderCreated" event
Payment Service: listens "OrderCreated" → charges card → publishes "PaymentSucceeded"
Inventory Service: listens "PaymentSucceeded" → reserves item → publishes "ItemReserved"
Notification Service: listens "ItemReserved" → sends "Order Confirmed!" email

FAILURE CASE: Inventory out of stock
Inventory Service: publishes "InventoryFailed"
Payment Service: listens "InventoryFailed" → refunds payment → publishes "PaymentRefunded"
Order Service: listens "PaymentRefunded" → cancels order → publishes "OrderCancelled"
Notification Service: listens "OrderCancelled" → sends "Sorry, out of stock" email
```

```
Choreography Flow:
[Order Svc] ──OrderCreated──→ [Kafka] ──→ [Payment Svc]
                                                 ↓
                                         PaymentSucceeded
                                                 ↓
                                        [Kafka] ──→ [Inventory Svc]
                                                          ↓
                                                   InventoryFailed
                                                          ↓
                                           [Kafka] ──→ [Payment Svc]
                                                        (refund)
```

**Choreography pros/cons:**
- ✅ Fully decoupled (services don't know about each other)
- ✅ No single point of failure
- ❌ Hard to track overall saga state ("Where is this order in the flow?")
- ❌ Risk of cyclic dependencies between services
- ❌ Debugging is hard — events scatter across multiple services

#### Orchestration-based Saga (Command-driven)
```
A central "Saga Orchestrator" service coordinates the flow.

[Order Orchestrator] → "PaymentService.charge(123, 999)"
[Payment Service]    → returns success/failure to Orchestrator
[Order Orchestrator] → "InventoryService.reserve(456, 1)"
[Inventory Service]  → returns success/failure
[Order Orchestrator] → "NotificationService.send(123, 'confirmed')"

FAILURE: Inventory fails
[Order Orchestrator] → "PaymentService.refund(123, 999)"  ← compensating transaction
[Order Orchestrator] → "NotificationService.send(123, 'out-of-stock')"
```

**Orchestration pros/cons:**
- ✅ Single place to see the entire flow (Orchestrator owns the state)
- ✅ Easier to add/modify steps (change Orchestrator, not all services)
- ✅ Clearer error handling and compensating transaction logic
- ❌ Orchestrator can become a bottleneck
- ❌ Orchestrator is a single point of failure (needs its own HA setup)
- ❌ Creates coupling: all services know about Orchestrator

### When to Use Each
```
Choreography → Simple flows, few steps (2-3 services), want maximum decoupling
Orchestration → Complex flows, many steps, need visibility into saga state, business-critical flows
```

---

## Section 8: Service Communication — Sync vs Async

### Synchronous — REST and gRPC

```python
# Order Service synchronously calls Payment Service
response = requests.post('http://payment-service/charge', json={
    'user_id': 123,
    'amount': 999
})
# Order Service WAITS for response before continuing
if response.status_code == 200:
    create_order()
```

**REST vs gRPC:**

| | REST (HTTP/1.1 + JSON) | gRPC (HTTP/2 + Protobuf) |
|--|----------------------|------------------------|
| Format | JSON (human-readable, large) | Binary (not human-readable, small) |
| Speed | Baseline | 5-10x faster serialization |
| Schema | Optional (OpenAPI) | Required (.proto files) |
| Streaming | Polling or WebSockets | Native bidirectional streaming |
| Browser support | Native | Needs grpc-web proxy |
| Best for | Public APIs, external clients | Internal service-to-service |

**When to use sync:**
- Payment confirmation (need immediate yes/no)
- User authentication (need to know: valid or not, right now)
- Read operations (GET user profile)

### Asynchronous — Message Queues (Kafka, RabbitMQ)

```python
# Order Service publishes event, doesn't wait
order = order_db.create(...)
kafka.publish('orders', {
    'event': 'OrderCreated',
    'order_id': order.id,
    'user_id': 123
})
# Order Service continues immediately — Notification/Inventory will handle it
```

```
[Order Service] → publishes → [Kafka Topic: orders] → consumed by:
                                                     → [Inventory Service]
                                                     → [Notification Service]
                                                     → [Analytics Service]
                                                     → [Fraud Detection Service]
```

**When to use async:**
- Non-critical path (email notification, push notification)
- Fan-out (one event → multiple consumers)
- Different processing speed (producer fast, consumer slow — queue buffers)
- Resilience required (Notification Service can be down, messages wait in queue)

**Rule of thumb:**
```
Synchronous  = "I need the answer before I can continue"
Asynchronous = "I just need to say it happened, you handle it whenever"
```

---

## Section 9: Service Discovery — "Mỗi service ở đâu?"

### The Problem

In a monolith: `orderService.createOrder()` — direct function call, no "where is it?"

In microservices deployed on Kubernetes:
```
Order Service needs to call Payment Service.
Payment Service might be at:
  - 10.0.1.42:8080 (Pod 1)
  - 10.0.1.87:8080 (Pod 2, just spun up)
  - Pod 1 just crashed → 10.0.1.42 is gone

How does Order Service know the current addresses?
```

### Client-Side Discovery (Traditional)
```
1. Services register themselves with a Service Registry (Consul/Eureka) on startup
2. Caller queries registry: "Where are the Payment Service instances?"
3. Registry returns: [10.0.1.42:8080, 10.0.1.87:8080]
4. Caller load balances between them

Libraries: Netflix Ribbon (Java), consul client
Pro: Caller has full control over load balancing logic
Con: Every language needs a discovery client library
```

### Server-Side Discovery (Kubernetes Native)
```
Kubernetes creates a stable DNS name for each Service:
  payment-service.default.svc.cluster.local

Order Service calls: http://payment-service/charge
Kubernetes DNS resolves → finds healthy pods
Kubernetes Service load balances automatically

Pro: Language-agnostic (no client library needed), Kubernetes handles health checks
Con: Extra network hop through kube-proxy
```

---

## Section 10: Distributed Tracing — "Debug khi request đi qua 5 services"

### The Problem

```
User reports: "My order failed."

Support engineer checks:
  → Order Service logs: "Called payment service"
  → Payment Service logs: "Received request, called inventory"
  → Inventory Service logs: "Inventory check completed"
  → Notification Service logs: "Sent confirmation"

All services look OK. But order still failed. WHERE?
Without distributed tracing: 2 hours of grepping through 5 log files
```

### Correlation ID Pattern

Every request gets a unique ID (X-Correlation-ID header) that propagates through all services:

```python
# API Gateway: generates correlation ID for every incoming request
import uuid

def handle_request(request):
    correlation_id = request.headers.get('X-Correlation-ID') or str(uuid.uuid4())
    request.headers['X-Correlation-ID'] = correlation_id
    # Log with correlation ID
    logger.info(f"[{correlation_id}] Processing order for user {user_id}")
    # Forward to downstream with same header
    requests.post('http://payment-service/charge',
                  headers={'X-Correlation-ID': correlation_id},
                  json=payload)
```

```
Log aggregation (Elasticsearch/Datadog) with query:
  X-Correlation-ID = "abc-123-xyz"
  → Shows: ALL log lines across ALL services for this single user request
  → Timeline: 0ms Order Svc → 45ms Payment Svc → 80ms Inventory Svc → FAIL at 82ms
  → Root cause: Inventory DB timeout at 82ms
```

### Jaeger/Zipkin — Visualization
```
Trace for request "abc-123-xyz":

Order Svc (0-100ms)
  ├── Payment Svc call (10-60ms)
  │     └── Auth verification (10-15ms) ✅
  │     └── DB charge (15-55ms) ✅
  └── Inventory Svc call (60-100ms)
        └── DB query (60-90ms) ✅
        └── Redis lock (90-100ms) ❌ TIMEOUT ← root cause visible instantly
```

---

## Interview-Ready Answers

### Q: "Would you use microservices for this system?"

> "It depends on two factors: team size and independent scaling requirements. For a startup or early-stage product with fewer than 10 engineers, I'd strongly recommend starting with a well-structured monolith. The operational overhead of microservices — service discovery, distributed tracing, separate CI/CD pipelines, inter-service authentication — would consume most of the team's capacity just keeping infrastructure working. Monolith would ship 3x more features in the same time.
>
> For the system you've described at this scale — if we're talking about a product serving millions of users with clear domain boundaries that need to scale independently — microservices make sense. I'd want to verify: does Search need to scale independently from Checkout? Do different teams own different domains? Is there a clear domain model? If yes to all three, microservices. If no, I'd stay with a modular monolith until those signals appear.
>
> And I'd migrate using the Strangler Fig pattern — not a Big Bang rewrite. Start with the service that has the cleanest boundaries and the clearest scaling need, extract it, validate the approach, then continue incrementally."

### Q: "What are the main trade-offs of microservices vs monolith?"

> "The benefits of microservices are real but only materialized at a certain scale and team size: independent deployment means Team A can ship without coordinating with Team B; independent scaling means we pay only for the resources each service actually needs; fault isolation means a recommendation service crash doesn't take down Payments.
>
> But the costs are significant and often underestimated. First: network latency replaces function calls — a local function call is nanoseconds, a service call is 1-100ms. Second: distributed transactions are fundamentally hard — where a monolith uses a single ACID transaction, microservices need Saga patterns with compensating transactions, which is 10x more complex code. Third: observability requires investment — you need distributed tracing (Jaeger), centralized logging, and health monitoring per service before you can debug anything. Fourth: operational complexity — instead of 1 deployment, you have N deployments, N service registrations, N service monitors.
>
> My honest take: microservices are the right answer at scale, but they're often adopted too early. The right time is when the coordination overhead of a large team working on one codebase exceeds the operational overhead of running distributed services."

---

## Quick Reference

```
MONOLITH = 1 codebase, 1 DB, 1 deployment
  ✅ Simple, fast to develop, easy ACID transactions
  ❌ Can't scale parts independently, deployment bottleneck at scale

MICROSERVICES = N services, N databases, N deployments
  ✅ Independent scale/deploy, fault isolation, tech flexibility
  ❌ Network overhead, distributed transactions, DevOps complexity

USE MICROSERVICES WHEN:
  ✅ 50+ engineers, multiple teams needing autonomy
  ✅ Services with clearly different scaling needs
  ✅ Need fault isolation between domains
  ✅ Different tech stack requirements per domain

DON'T USE WHEN:
  ❌ Small team (< 10), startup, unclear domain boundaries
  ❌ No DevOps maturity (Kubernetes, tracing, logging not in place)
  ❌ Business logic requires frequent cross-service ACID transactions

KEY CONCEPTS:
  Conway's Law         = Architecture mirrors org chart
  Strangler Fig        = Incremental migration from monolith
  API Gateway          = Single entry point, centralized auth/routing
  BFF Pattern          = Separate gateway per client type (mobile/web)
  Database per service = No shared DBs, communicate via API/events
  Saga Pattern         = Distributed transactions via compensating events
  Choreography         = Services communicate via events (decoupled)
  Orchestration        = Central coordinator commands each step
  Service Discovery    = Kubernetes DNS or Consul/Eureka registry
  Distributed Tracing  = Correlation ID + Jaeger/Zipkin

Sync  (REST/gRPC) = critical path, need immediate response
Async (Kafka/RMQ) = side effects, fan-out, resilience needed
```
