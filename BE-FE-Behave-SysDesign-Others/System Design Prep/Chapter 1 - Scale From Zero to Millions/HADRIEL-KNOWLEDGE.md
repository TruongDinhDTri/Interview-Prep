# HADRIEL-KNOWLEDGE: Chapter 1 — Scale From Zero to Millions

---

## Quick Reference (Already Covered in Existing Materials)

The existing CSV (42 cards) and HTML files cover:
- Vertical vs Horizontal Scaling fundamentals
- Load Balancer basics (traffic distribution, failover, private IPs)
- Database Replication: Master-slave, read/write split
- Cache: Read-through, TTL, eviction (LRU), consistency challenges
- CDN: Static content delivery, temporary outage handling
- Stateless Web Tier: Session storage in Redis/DB for auto-scaling
- GeoDNS + Multi-Data Center routing
- Message Queue: Decoupling producers/consumers
- Database Sharding: Partition key, Celebrity Problem, join difficulty
- Monitoring: Host, aggregate, business metrics

---

## Deep Knowledge — Additional Topics

---

### Load Balancer — Deep Dive

#### L4 vs L7 Load Balancing
| Feature | L4 (Transport Layer) | L7 (Application Layer) |
|---|---|---|
| Operates on | TCP/UDP (IP + port) | HTTP headers, cookies, URL path |
| Speed | Faster (less inspection) | Slower but smarter routing |
| Content-aware? | No | Yes (route /api → API servers, /images → CDN) |
| SSL termination | No (pass-through) | Yes (decrypts, inspects, re-encrypts) |
| AWS equivalent | NLB (Network Load Balancer) | ALB (Application Load Balancer) |

**AWS Load Balancer Comparison:**
- **CLB (Classic)** — Legacy, L4/L7 basic. Avoid for new systems.
- **NLB (Network)** — L4, ultra-low latency, millions of requests/sec, static IP. Use for TCP/UDP workloads (e.g., gaming, VoIP).
- **ALB (Application)** — L7, path/host-based routing, WebSocket support. Best for HTTP microservices.

#### Load Balancing Algorithms
1. **Round Robin** — Distributes requests sequentially. Simple, ignores server load.
2. **Weighted Round Robin** — Servers with higher capacity get more traffic (weight). Good when servers have different specs.
3. **Least Connections** — Routes to server with fewest active connections. Best for long-lived connections (WebSockets).
4. **IP Hash** — Hashes client IP to always route same client to same server. Enables sticky sessions without cookies.
5. **Random** — Picks random server. Scales well with many servers.
6. **Least Response Time** — Routes to fastest-responding server. Requires latency monitoring overhead.

#### Sticky Sessions (Session Affinity)
**Problem:** User logs in on Server A; next request goes to Server B (no session).
**Solution Options:**
- **Cookie-based affinity** — LB injects a cookie pointing to a specific server. Problem: breaks if server dies.
- **IP Hash** — Same IP → same server. Problem: breaks with NAT (many users share one IP).
- **Better solution** — Store sessions in shared Redis; eliminate stickiness entirely (stateless architecture).

#### Health Checks
LBs ping backend servers on a configurable interval (e.g., every 5 sec, HTTP GET /health). If 3 consecutive failures → mark unhealthy → remove from rotation. Important interview point: **health checks can cause cascading failures** if all servers fail simultaneously.

---

### Caching Strategies — Deep Dive

#### The 4 Patterns

**1. Cache-Aside (Lazy Loading)**
```
Read: check cache → miss → read DB → populate cache → return
Write: write to DB → (optionally) invalidate cache
```
- App controls cache logic explicitly
- Cache only stores requested data (no wasted memory)
- **Risk:** Cache stampede on cold start or expiry

**2. Read-Through**
```
App always talks to cache; cache handles DB reads on miss automatically
```
- Simpler app code; consistent pattern
- First read always slow (cache miss)
- Works well with caching libraries (e.g., Hibernate 2nd level cache)

**3. Write-Through**
```
Write to cache → cache synchronously writes to DB → return success
```
- Cache always consistent with DB
- Every write pays double latency (cache + DB)
- Good for frequently-read, frequently-written data

**4. Write-Behind (Write-Back)**
```
Write to cache → acknowledge → asynchronously flush to DB later
```
- Fastest writes (no DB wait)
- **Risk:** Data loss if cache crashes before flush
- Use for analytics, gaming scores, non-critical writes

#### Cache Stampede / Thundering Herd Problem
**Scenario:** Popular cache key expires. 10,000 concurrent requests all get a miss simultaneously → all 10,000 query the DB → DB crashes.

**Solutions:**
1. **Mutex/Lock** — Only one thread queries DB; others wait. Simple but creates bottleneck.
2. **Probabilistic Early Expiration** — Before key expires, probabilistically refresh it (XFetch algorithm).
3. **Cache Warming** — Pre-populate cache before traffic hits (e.g., during deployment).
4. **Staggered TTLs** — Add jitter to expiry (`TTL = base + random(0, 300 seconds)`).
5. **Promise/Future Pattern** — First miss creates a placeholder; other threads wait on the same promise.

#### Redis vs Memcached
| Feature | Redis | Memcached |
|---|---|---|
| Data structures | Strings, Hashes, Lists, Sets, Sorted Sets, Streams | Strings only |
| Persistence | Yes (RDB snapshots, AOF logs) | No |
| Replication | Yes (master-replica) | No |
| Cluster mode | Yes (Redis Cluster) | Yes (client-side sharding) |
| Pub/Sub | Yes | No |
| Lua scripting | Yes (atomic operations) | No |
| Multi-threading | Single-threaded (Redis 6+ adds I/O threads) | Multi-threaded |
| Use case | Complex caching, sessions, leaderboards, rate limiting | Simple key-value, maximum throughput |

**Rule of thumb:** Almost always choose Redis. Memcached is only faster for pure string workloads at extreme scale where Redis's feature set is unused.

---

### Database Replication — Advanced Topics

#### Multi-Master Replication
- Multiple nodes accept writes simultaneously
- **Conflict resolution required:** Two users update same row on different masters
  - **Last-Write-Wins (LWW)** — Use timestamp to pick winner. Simple but can lose data if clocks drift.
  - **Vector Clocks** — Track causality (which write happened after which). More accurate, complex to implement.
  - **CRDTs (Conflict-free Replicated Data Types)** — Data structures that auto-merge (used in DynamoDB, Redis CRDT).
- Used in: MySQL Group Replication, Cassandra, CockroachDB

#### Replication Lag & Read-After-Write Consistency
**Problem:** User posts a comment → committed to master → reads from slave → slave hasn't replicated yet → user sees no comment.

**Solutions:**
1. **Read-your-own-writes** — Route a user's own reads to master for 1 minute after any write.
2. **Monotonic reads** — User always reads from same replica to avoid going "back in time."
3. **Bounded staleness** — Only read from replicas where lag < threshold (e.g., < 1 second).

#### MySQL Binlog vs PostgreSQL WAL
- **MySQL Binary Log (binlog)** — Statement-based, row-based, or mixed. Used for replication AND point-in-time recovery. External tools (Debezium, Maxwell) tap binlog for CDC (Change Data Capture).
- **PostgreSQL WAL (Write-Ahead Log)** — Sequential log of all changes. Used for replication (logical/physical), crash recovery. Logical replication decodes WAL into row-level changes.
- **Interview point:** Both enable real-time data streaming to data warehouses (Kafka CDC pipelines).

---

### Sharding — Advanced Topics

#### Consistent Hashing
**Problem with simple modulo sharding (`user_id % N`):** Adding/removing a server requires remapping ~all keys.

**Consistent Hashing solution:**
- Place servers on a virtual ring (0 to 2^32)
- Each key is hashed to a point on the ring; assigned to next clockwise server
- Adding a server only remaps keys from one neighbor → average `K/N` keys moved (K = keys, N = nodes)
- Removing a server only affects its immediate neighbor

**Virtual Nodes:**
- Each physical server gets multiple positions on the ring (e.g., 150 virtual nodes)
- Distributes load more evenly, especially with heterogeneous hardware
- Used by: Cassandra, Amazon DynamoDB, Riak

#### Directory-Based Sharding vs Hash-Based Sharding
| Approach | How it works | Trade-offs |
|---|---|---|
| Hash-Based | `shard = hash(key) % N` | Simple, even distribution, no flexibility |
| Directory-Based | Lookup table maps key → shard | Flexible re-sharding, but directory is a SPOF and bottleneck |
| Consistent Hashing | Hash on ring | Minimal remapping on scale-up/down |
| Range-Based | Shard by key range (e.g., A-M, N-Z) | Supports range queries; prone to hotspots |

#### Cross-Shard Queries & Transactions
- **Cross-shard JOIN** — Requires scatter-gather: query all shards in parallel, merge results in app layer.
- **Distributed transactions** — Use 2-Phase Commit (2PC) for ACID across shards. 2PC is blocking; a coordinator failure can leave shards locked.
- **Better approach:** Design data model to avoid cross-shard transactions. Denormalize. Use eventual consistency with compensating transactions (SAGA pattern).

---

### CDN — Advanced Topics

#### Push vs Pull CDN
| Feature | Pull CDN | Push CDN |
|---|---|---|
| How it works | CDN fetches from origin on first request (lazy) | You explicitly upload content to CDN nodes |
| Best for | Frequently-accessed, unpredictable content | Known static assets (video files, game installers) |
| Storage cost | Lower (only popular content cached) | Higher (everything stored everywhere) |
| Examples | Cloudflare, CloudFront (default) | Akamai NetStorage |

#### Cache Invalidation Strategies
1. **TTL-based** — Set expiry; stale content served until TTL expires. Simple, may serve stale data.
2. **Versioned URLs** — `styles.v2.css` never expires; deploy new version creates new URL. Ideal for static assets.
3. **API Invalidation** — Explicitly purge CDN edge nodes via API (e.g., CloudFront Invalidation). Costs money, can be slow.
4. **Surrogate Keys / Cache Tags** — Tag CDN objects; purge by tag. Used by Fastly, Varnish.

#### Origin Shield Pattern
- Add an intermediate caching layer between CDN edge nodes and your origin server
- Collapses cache misses from multiple CDN POPs into single requests to origin
- Reduces origin load by 90%+ for large CDN deployments

---

### Message Queue — Deep Dive

#### Delivery Guarantees
| Guarantee | Meaning | Risk | When to use |
|---|---|---|---|
| At-most-once | Message delivered 0 or 1 times | Data loss | Metrics, logs (loss OK) |
| At-least-once | Message delivered 1+ times | Duplicates | Most use cases (with idempotency) |
| Exactly-once | Message delivered exactly once | Complex, slow | Financial transactions |

**Idempotency:** Make consumers handle duplicates safely (e.g., `INSERT ... ON CONFLICT DO NOTHING`). This is the standard industry approach.

#### Kafka vs RabbitMQ vs SQS
| Feature | Kafka | RabbitMQ | AWS SQS |
|---|---|---|---|
| Model | Log-based (partitioned topic) | Message broker (queue) | Managed queue |
| Message retention | Configurable (days/forever) | Deleted on ack | 14 days max |
| Consumer model | Pull (consumers control offset) | Push (broker pushes) | Pull |
| Ordering | Per-partition ordering | No strict ordering | FIFO queue option |
| Throughput | Millions/sec | Hundreds of thousands/sec | Millions/sec (managed) |
| Replay | Yes (rewind offset) | No | No |
| Use case | Event streaming, audit log, CDC | Task queues, RPC | Simple decoupling in AWS |

#### Dead Letter Queue (DLQ)
- Messages that fail processing N times are moved to a DLQ
- Prevents poison pills from blocking the queue
- DLQ enables manual inspection and reprocessing
- **Interview point:** Always mention DLQ when designing async systems — shows operational maturity

#### Backpressure
- **Problem:** Producer creates messages faster than consumer processes them → queue fills → OOM
- **Solutions:**
  1. **Drop messages** — Only for non-critical data (metrics)
  2. **Block producer** — Producer waits until queue drains. Blocks upstream.
  3. **Rate limit producer** — Apply rate limiting to message publishing
  4. **Scale consumers** — Auto-scale consumer workers (Kubernetes HPA)
  5. **Prioritization** — Use priority queues (RabbitMQ supports this)

---

### Real-World Case Studies

#### Netflix Scaling Architecture
- **Problem (2008):** DVD business crashed, monolith couldn't scale for streaming
- **Key decisions:**
  - Migrated from monolith to **microservices** (700+ services)
  - **AWS all-in** (2016 completed migration)
  - **Cassandra** for distributed storage (viewing history, ratings)
  - **Zuul** as API Gateway/edge proxy for routing + rate limiting
  - **Hystrix** for circuit breaking (now deprecated → resilience4j)
  - **Chaos Engineering** (Chaos Monkey) — intentionally kill instances to test resilience
  - **CDN (Open Connect)** — Netflix's own CDN, ISP-embedded appliances

#### Twitter Scaling (Early Architecture)
- **2006-2012 Problem:** "Fail Whale" — monorail Ruby on Rails app couldn't handle scale
- **Key decisions:**
  - **Fan-out on write** (push) for timeline: when user tweets, push to all followers' timelines in Redis
  - **Exception:** Celebrity users (millions of followers) use fan-out on read to avoid writing 10M times
  - **Redis** for timeline storage (sorted sets by timestamp)
  - **Finagle** (Twitter's RPC framework) for microservices
  - **Manhattan** (distributed key-value store built in-house)

#### Instagram Scaling (0 to 1 billion users)
- **2010 MVP:** 3 engineers, Django + PostgreSQL on EC2
- **Key decisions:**
  - **PostgreSQL** sharded early (user_id-based)
  - **Cassandra** for activity feeds
  - **Django** ORM with aggressive caching
  - **Lesson:** Start simple, optimize only when you hit actual bottlenecks
  - **Django/Python** can scale to billions — technology choice matters less than architecture

---

## Common Interview Traps & How to Handle Them

### "What happens when your cache goes down?"
**Trap:** Saying "we lose all data" or panicking.
**Good answer:**
> "Cache is typically a read-cache, not source of truth. If it goes down:
> 1. All requests fall through to the database — this is called a 'cache avalanche'
> 2. Short-term: increased DB load, potentially high latency
> 3. Mitigation: circuit breaker that limits DB requests during cache recovery, multiple cache replicas (Redis Sentinel/Cluster), graceful degradation (serve slightly stale data)
> 4. Prevention: Redis Cluster with replicas ensures high availability"

### "How do you handle a database failover mid-transaction?"
**Trap:** Saying "the transaction completes" or ignoring partial writes.
**Good answer:**
> "Database failover mid-transaction means the transaction is aborted and rolled back by the client's transaction manager. In MySQL with InnoDB:
> 1. Client gets a connection error
> 2. Application must retry the transaction (with exponential backoff)
> 3. For critical operations, use idempotency keys to safely retry
> 4. With semi-synchronous replication, the primary waits for at least one slave ACK before committing — reduces data loss window to near-zero during failover"

### "Why not just add more RAM to the database server?"
**Trap:** "That's vertical scaling and it works fine."
**Good answer:**
> "Vertical scaling has an upper limit (largest EC2 instance is ~24TB RAM). Beyond that, you must shard. Also, vertical scaling requires downtime for hardware changes (unless using cloud instances). A single large server remains a SPOF. For read-heavy workloads, adding read replicas is cheaper and more effective than scaling vertically."

### "How would you handle a hotspot shard?"
**Trap:** "Reshard everything."
**Good answer:**
> "First, identify why: is it a hot user (celebrity problem), hot content (viral post), or bad shard key?
> - For celebrity: allocate dedicated shard(s) for high-traffic entities
> - For viral content: add a cache layer (Redis) in front of that shard
> - For bad shard key: migrate to composite key or consistent hashing
> - Short-term: read replicas on the hot shard to distribute read load"

### "What's the difference between a load balancer and a reverse proxy?"
**Trap:** Treating them as the same thing.
**Good answer:**
> "A reverse proxy (e.g., Nginx) sits in front of one or more servers and handles SSL termination, compression, caching, and routing. A load balancer distributes traffic across multiple identical servers for scaling and failover. In practice, many load balancers (like Nginx, HAProxy) also act as reverse proxies. The distinction is in purpose: reverse proxy is about request transformation, load balancer is about traffic distribution."

---

## Teaching Playbook

### Socratic Questions by Topic

**Load Balancer:**
- "If a user logs in on Server A, what happens when their next request goes to Server B?"
- "What's the difference between Round Robin and Least Connections? When would each fail?"
- "If the load balancer itself fails, what happens? How would you fix this?"
- "Why use private IPs for backend servers when the load balancer has a public IP?"

**Caching:**
- "If you cache database results, what happens when the database changes?"
- "A user's profile is cached. They update their name. How does the cache get updated?"
- "Your cache is 10x faster than your DB. Your cache hit rate is 90%. What's your actual speedup?"
- "You launch a product at midnight. 100,000 users hit your empty cache simultaneously. What happens? How do you prevent it?"

**Database Replication:**
- "User posts a message. They immediately refresh the page and don't see it. Why? How do you fix it?"
- "You have 1 master and 4 read replicas. The master dies. What happens? Walk me through the failover process."
- "Replication lag is 2 seconds on average. A user reads stale data. Is this acceptable? When is it not?"

**Sharding:**
- "You shard by user_id. A celebrity with 50 million followers uses your app. What happens to their shard?"
- "User A's messages and User B's messages are on different shards. User A sends a message to User B. How do you store and retrieve the conversation?"
- "You start with 4 shards. Traffic grows 10x. You need 8 shards. How do you migrate data?"
- "Why is consistent hashing better than simple modulo hashing when nodes change?"

**Message Queue:**
- "A payment service and a notification service are connected by a queue. The notification service crashes for 2 hours. What happens to the messages? What happens when it recovers?"
- "You send a payment message. Due to a network issue, it's delivered twice. The payment is charged twice. How do you prevent this?"
- "Producers are adding 1000 messages/sec. Consumers process 500/sec. What happens over time? How do you fix it?"

### Common Misconceptions

| Misconception | Reality |
|---|---|
| "Cache is just faster DB storage" | Cache is temporary, can be lost; DB is durable source of truth |
| "More read replicas = linearly more read throughput" | Replication lag limits consistency; all replicas add network overhead to master |
| "Sharding solves all scaling problems" | Sharding makes cross-shard operations hard; requires careful data modeling |
| "Load balancer = reverse proxy" | LB is about distribution; reverse proxy is about request transformation |
| "CDN is only for video/images" | CDN also caches API responses, HTML pages, and handles DDoS mitigation |
| "Message queues guarantee ordering" | Most queues (SQS standard, Kafka partition reassignment) don't guarantee strict global order |
| "Adding cache always improves performance" | Cache with low hit rate + high miss penalty can be slower than direct DB access |

### Aha-Moment Triggers

1. **The "Hot Path" visualization** — Draw the request path for 1M users hitting a single endpoint. Where does it break first? This makes scaling tangible.

2. **The "What if X dies?" game** — For any component in the architecture, ask "what happens if this dies right now?" Good architecture has an answer for every component.

3. **The "10x growth" thought experiment** — "Your system handles 1000 req/sec. Next month it's 10,000. What breaks first?" Walk through the chain: web server → DB reads → DB writes → storage.

4. **The cache hit rate math** — "If your DB query is 100ms and your cache is 1ms, with a 95% hit rate, what's your average latency?" Answer: 0.95 × 1ms + 0.05 × 100ms = 5.95ms vs 100ms. Cache is 17x faster.

5. **The stateless "aha"** — "Why can't we just store sessions on the web server?" → Then: "We need to deploy a new version and restart all servers. What happens to all logged-in users?" Stateless architecture instantly clicks.

### Assessment Questions (Testing Wiganz's Understanding)

**Level 1 — Conceptual:**
- What is the first change you make when your single server starts struggling under load?
- Name the three benefits of database replication beyond just backup.
- What is the difference between write-through and write-behind caching? When would you use each?

**Level 2 — Trade-offs:**
- You need to add caching to your app. Your data changes frequently (every 5 seconds). Is caching worth it? What strategy would you use?
- Your app has 1 write every 100 reads. Should you use master-slave or master-master replication? Why?
- A client asks you to shard their database. What questions do you ask before choosing a shard key?

**Level 3 — Design:**
- Design the data architecture for a social media app with 10 million users. Walk me through your scaling decisions from day 1 to scale.
- You have a message queue with 1 million messages backlogged. Your consumers are crashing on message #50,000. What do you do?
- Design a caching strategy for an e-commerce product catalog where prices change hourly but product descriptions change monthly.

---

## Cross-Chapter Connections

- **Chapter 3 (Framework):** Use the scaling evolution (single server → full architecture) as a worked example of applying the 4-step design framework
- **Chapter 4 (Rate Limiter):** Rate limiting uses Redis for counters — same Redis infrastructure discussed in caching section
- The "stateless web tier" concept directly enables the horizontal scaling needed for rate limiter distribution
- Consistent hashing (sharding section) is also used in CDN routing and distributed cache clusters
