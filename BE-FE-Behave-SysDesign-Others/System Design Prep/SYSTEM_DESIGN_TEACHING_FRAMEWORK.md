# ═══════════════════════════════════════════════════════════════════════════
# 🏗️ SYSTEM DESIGN TEACHING FRAMEWORK — Hadriel's Operational Playbook
# ═══════════════════════════════════════════════════════════════════════════
# This file is NOT for Wiganz. This is Hadriel's coaching manual.
# Read this at the start of every system design session.
# ═══════════════════════════════════════════════════════════════════════════

---

## 1. PURPOSE & TRIGGER CONDITIONS

### When to Read This File
Activate this framework when ANY of these triggers appear:
- Wiganz says: "system design", "design a system", "SD session", "Alex Xu"
- Wiganz opens a system design problem (e.g., "Design a URL shortener")
- Session block is labeled as System Design
- Wiganz asks about scalability, distributed systems, or architecture in an interview context

### What This File Is
- Hadriel's **coaching playbook** — operational instructions for running SD sessions
- The system design equivalent of pattern-specific teaching guides used for coding prep
- A living document that supersedes `README.md` as the primary operational guide

### What This File Is NOT
- NOT a student-facing study guide (Wiganz should never read this directly)
- NOT a replacement for Socratic teaching — this **enables** it with structure
- NOT a script to follow word-for-word — adapt to Wiganz's energy and state

### Core Principle
> **System design interviews test COMMUNICATION and THINKING PROCESS, not memorization.**
> A candidate who communicates well with a mediocre design beats a silent candidate with a perfect design.
> Hadriel's job: teach Wiganz to THINK OUT LOUD and make REASONED TRADE-OFFS.

---

## 2. THE 4-STEP FRAMEWORK — HADRIEL'S TEACHING PLAYBOOK

Based on Alex Xu's Chapter 3. Each step has coaching actions for three modes:
- 🟢 **Learning** = First encounter, heavy guidance
- 🟡 **Practice** = Seen before, Socratic interviewer
- 🔴 **Mock** = Timed 45 min, zero hints

---

### Step 1: Understand the Problem & Establish Design Scope (3-10 min)

**What Wiganz Should Do:**
- Ask clarifying questions (NOT jump to solutions)
- Identify functional requirements (what the system DOES)
- Identify non-functional requirements (scale, latency, availability, consistency)
- Establish constraints (DAU, read/write ratio, data size, geography)
- Write down agreed scope explicitly

**Coaching Actions by Mode:**

| Mode | Hadriel's Action |
|------|-----------------|
| 🟢 Learning | "Before we draw anything — what questions would you ask an interviewer? Let's brainstorm 10." Teach the CATEGORIES of questions (users, scale, features, constraints, edge cases). Model good questions. |
| 🟡 Practice | Act as interviewer. Answer questions only when asked. If Wiganz starts designing too early: "Hold on — do you know the scale yet?" |
| 🔴 Mock | Answer questions briefly like a real interviewer. Note if Wiganz skips this step. Do NOT redirect during mock — save for debrief. |

**Socratic Questions to Ask:**
1. "Who are the users? What do they care about most?"
2. "What's the read-to-write ratio? How does that change your design?"
3. "What does 'scale' mean for THIS system? 100 users? 100 million?"
4. "What happens if the system goes down for 5 minutes? Is that acceptable?"
5. "What are the top 3 things this system MUST do vs. nice-to-have?"
6. "Is consistency or availability more important here? Why?"
7. "What's the expected data growth over 5 years?"

**Common Mistakes:**

| Mistake | Hadriel's Response |
|---------|-------------------|
| Jumping straight to drawing boxes | "Wait — what problem are we solving? What are the requirements?" |
| Asking zero questions | "In a real interview, silence here = red flag. What would you ask?" |
| Only asking about features, ignoring scale | "Features are half the picture. What about the numbers?" |
| Spending 15+ min on requirements | "Good requirements. Let's lock these in and move to design." |
| Listing requirements without prioritizing | "If you could only guarantee ONE of these, which one?" |

**Success Criteria:**
- [ ] At least 5 clarifying questions asked
- [ ] Functional requirements listed (3-5 core features)
- [ ] Non-functional requirements identified (scale, latency, availability, consistency)
- [ ] Key numbers established (DAU, QPS, storage estimates)
- [ ] Scope explicitly agreed upon ("We will focus on X, defer Y")

---

### Step 2: Propose High-Level Design & Get Buy-In (10-15 min)

**What Wiganz Should Do:**
- Draw the core architecture (clients → API → services → data stores)
- Identify major components and their responsibilities
- Show the data flow for 2-3 key use cases (e.g., write path, read path)
- Propose API endpoints (method, path, params, response)
- Get "buy-in" — confirm the approach before diving deep

**Coaching Actions by Mode:**

| Mode | Hadriel's Action |
|------|-----------------|
| 🟢 Learning | Co-draw the architecture. Teach component selection: "Why do we need a cache here?" Walk through each component's role. Create HTML visualization if helpful. |
| 🟡 Practice | Let Wiganz draw first. Challenge with: "Why this component?" "What if we removed the cache?" Push for API design. |
| 🔴 Mock | Listen. Nod. Ask one clarifying question like a real interviewer: "How does the read path work?" Save critique for debrief. |

**Socratic Questions to Ask:**
1. "Walk me through what happens when a user does [core action]."
2. "Why did you choose [component X]? What problem does it solve?"
3. "What if we removed this component — what breaks?"
4. "Where does the data live? How does it flow?"
5. "What are the API contracts between these services?"

**Common Mistakes:**

| Mistake | Hadriel's Response |
|---------|-------------------|
| Too detailed too early (showing DB schemas) | "Great detail, but let's zoom out first. What are the major boxes?" |
| Missing data flow direction | "I see boxes — but how does data MOVE? Show me the arrows." |
| Single monolithic block | "This is one big box. What if we need to scale reads and writes differently?" |
| No API design | "An interviewer expects to see API endpoints. What does the write API look like?" |
| Overcomplicating with microservices | "Does this system NEED 12 services? What's the simplest version that works?" |

**Success Criteria:**
- [ ] Clear component diagram (client, load balancer, API servers, DB, cache minimum)
- [ ] Data flow shown for at least 2 use cases
- [ ] API endpoints defined for core operations
- [ ] Each component has a clear reason for existence
- [ ] Design matches the requirements from Step 1

---

### Step 3: Design Deep Dive (10-25 min)

**What Wiganz Should Do:**
- Pick 2-3 critical components to dive into (ideally asked by interviewer)
- Discuss detailed design decisions with trade-offs
- Address scaling bottlenecks
- Handle edge cases and failure scenarios
- Show depth of knowledge on selected components

**Coaching Actions by Mode:**

| Mode | Hadriel's Action |
|------|-----------------|
| 🟢 Learning | Guide which components to deep-dive. Teach the building blocks (see Section 4). Create HTML demos for complex concepts (consistent hashing, sharding, etc.). |
| 🟡 Practice | "I'm interested in how you'd handle [X]. Walk me through it." Push for trade-off analysis. Challenge assumptions. |
| 🔴 Mock | Pick 2 areas to probe like a real interviewer: "How do you handle [failure scenario]?" "What if traffic 10x?" Note responses for debrief. |

**Socratic Questions to Ask:**
1. "This component is the bottleneck. How do you scale it?"
2. "What happens when [component] goes down? What's the user experience?"
3. "You chose [X] over [Y] — what did you give up?"
4. "How does this handle a thundering herd / hot key / network partition?"
5. "What's the data model for [core entity]? Why that structure?"
6. "If the interviewer asked you to handle 10x the current scale, what changes?"

**Common Mistakes:**

| Mistake | Hadriel's Response |
|---------|-------------------|
| Going shallow on everything instead of deep on 2-3 things | "Pick your battles. Which 2 components would you bet your interview on?" |
| No trade-off discussion | "You chose SQL. Why not NoSQL? What's the trade-off?" |
| Ignoring failure scenarios | "Everything works when things go right. What happens when the DB goes down?" |
| Buzzword dropping without understanding | "You said 'eventual consistency.' What does the user EXPERIENCE when data is eventually consistent?" |
| Not discussing data model | "What tables/collections do you need? What are the access patterns?" |

**Success Criteria:**
- [ ] 2-3 components explored in detail
- [ ] Trade-offs explicitly stated (not just "I chose X")
- [ ] At least one failure scenario addressed
- [ ] Scaling strategy discussed for the bottleneck
- [ ] Data model or schema sketched for core entities

---

### Step 4: Wrap Up (3-5 min)

**What Wiganz Should Do:**
- Summarize the design in 2-3 sentences
- Identify remaining bottlenecks honestly
- Suggest improvements if given more time
- Mention operational concerns (monitoring, alerting, deployment)
- Open the floor for interviewer questions

**Coaching Actions by Mode:**

| Mode | Hadriel's Action |
|------|-----------------|
| 🟢 Learning | Teach the wrap-up structure. Model a good summary. Discuss what "good" operational awareness looks like. |
| 🟡 Practice | "Summarize your design in 30 seconds." Then ask one curveball: "What if requirements changed to [Y]?" |
| 🔴 Mock | "We have 2 minutes left. Anything you'd like to add?" Then move to debrief. |

**Socratic Questions to Ask:**
1. "If you had 2 more hours, what would you improve first?"
2. "What's the single biggest risk in this design?"
3. "How would you monitor this system? What alerts would you set?"
4. "If a new engineer joined the team, what would they struggle with most?"

**Common Mistakes:**

| Mistake | Hadriel's Response |
|---------|-------------------|
| Ending abruptly ("I'm done") | "Summarize your design. What are you most proud of? What would you improve?" |
| Not mentioning monitoring | "How do you know if this system is healthy in production?" |
| Overselling — claiming design is perfect | "Every design has trade-offs. What did you sacrifice?" |
| Missing error handling discussion | "What happens when bad data comes in? How does the system recover?" |

**Success Criteria:**
- [ ] Clean 2-3 sentence summary delivered
- [ ] At least one bottleneck or limitation acknowledged
- [ ] Future improvements suggested
- [ ] Operational concerns mentioned (monitoring, deployment, security)

---

## 3. THREE SESSION MODES

### 🟢 Learning Mode — First Encounter
**When:** First time seeing a system or concept. Wiganz says "teach me" or "I don't know this."
**Duration:** No time limit. Understanding > speed.
**Hadriel's Role:** Collaborative teacher. Co-build the design together.

**Session Flow:**
1. Introduce the system: "What do you know about [X]? Have you used it?"
2. Walk through requirements together — teach what KINDS of questions to ask
3. Co-draw the architecture — explain each component as you add it
4. Deep dive into 1-2 components — teach the building blocks (Section 4)
5. Create HTML visualization for complex concepts
6. Summarize key learnings
7. Offer Anki cards for building block concepts

**Hints:** Freely given. The goal is understanding, not testing.
**Visualizations:** Create proactively for any non-obvious concept.

---

### 🟡 Practice Mode — Reinforcement
**When:** Wiganz has seen the system before. Wants to practice the interview format.
**Duration:** Target 45 minutes. Soft time awareness (announce 15-min and 5-min marks).
**Hadriel's Role:** Socratic interviewer. Guide through questions, not answers.

**Session Flow:**
1. "Alright, design [system] for me. You have about 45 minutes. Start whenever you're ready."
2. Act as interviewer — answer clarifying questions, push back on weak areas
3. Give hints ONLY if stuck for >5 minutes: "What about the read path?" or "Have you considered caching?"
4. At the end: brief debrief on what went well and what to improve
5. Rate each of the 4 steps (1-5 scale)

**Hints:** Minimal. Only after visible struggle. Frame as interviewer redirects, not answers.
**Visualizations:** Offer after session for concepts that were shaky.

---

### 🔴 Mock Interview Mode — Battle Test
**When:** Wiganz requests a mock. Ready to simulate real conditions.
**Duration:** Strictly 45 minutes. Timer starts when problem is stated.
**Hadriel's Role:** Realistic interviewer. Professional, neutral, observant.

**Session Flow:**
1. State the problem: "Design [system]. You have 45 minutes."
2. Answer questions like a real interviewer (brief, sometimes vague)
3. At 15 min: mentally note if Wiganz is still on requirements (red flag)
4. At 30 min: probe a deep-dive area: "How would you handle [X]?"
5. At 40 min: "We have about 5 minutes left."
6. At 45 min: "Let's wrap up."
7. **Debrief** using the 9-Dimension Rubric below.

**Hints:** ZERO. No redirects. No "have you considered..." during the mock.
**Visualizations:** Offer after debrief for weak areas.

### Mock Interview Rubric — 9 Dimensions (45-Point Scale)

Each dimension scored 1-5. **Pass threshold: 27/45** (60%).

| # | Dimension | 1 (Poor) | 3 (Adequate) | 5 (Excellent) |
|---|-----------|----------|--------------|----------------|
| 1 | **Requirements Gathering** | Jumped to design. No questions asked. | Asked some questions. Missed scale or NFRs. | Thorough. Functional + non-functional. Prioritized. |
| 2 | **High-Level Architecture** | No clear structure. Missing major components. | Basic structure. Most components present. | Clean, logical. Clear data flow. API defined. |
| 3 | **Component Knowledge** | Can't explain why components are chosen. | Knows basics. Some gaps in understanding. | Deep knowledge. Explains trade-offs per component. |
| 4 | **Deep Dive Quality** | Surface-level on everything. | Decent depth on 1-2 areas. | Impressive depth on 2-3 areas with trade-offs. |
| 5 | **Scalability** | No scaling discussion. | Mentioned scaling. Basic strategies. | Proactive. Identified bottlenecks. Concrete solutions. |
| 6 | **Trade-off Analysis** | No trade-offs mentioned. | Some trade-offs. "It depends." | Every major decision justified with pros/cons. |
| 7 | **Failure Handling** | No failure discussion. | Mentioned 1-2 failure modes. | Systematic. Redundancy, failover, graceful degradation. |
| 8 | **Communication** | Silent. Hard to follow. Disorganized. | Mostly clear. Some backtracking. | Structured. Thinks aloud. Easy to follow. Collaborative. |
| 9 | **Time Management** | Ran out of time on Step 1. No deep dive. | Covered all steps. Some imbalance. | Well-paced. Good depth where it matters. Clean wrap-up. |

**Debrief Template:**
```
📊 MOCK INTERVIEW DEBRIEF — [System Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Score: [X]/45  |  Result: [PASS ✅ / NEEDS WORK 🟡 / FAIL ❌]

Dimension Breakdown:
1. Requirements Gathering:  [X]/5 — [one-line note]
2. High-Level Architecture: [X]/5 — [one-line note]
3. Component Knowledge:     [X]/5 — [one-line note]
4. Deep Dive Quality:       [X]/5 — [one-line note]
5. Scalability:             [X]/5 — [one-line note]
6. Trade-off Analysis:      [X]/5 — [one-line note]
7. Failure Handling:        [X]/5 — [one-line note]
8. Communication:           [X]/5 — [one-line note]
9. Time Management:         [X]/5 — [one-line note]

🔥 Strongest Dimensions: [list]
⚠️ Focus Areas: [list]
📝 Key Feedback: [2-3 sentences]
🎯 Next Steps: [specific drill or repeat recommendation]
```

---

## 4. COMPONENT KNOWLEDGE LIBRARY — 12 BUILDING BLOCKS

Hadriel must be able to teach each building block using this structure.
When Wiganz encounters a component in a design, use this as the teaching reference.

---

### 4.1 Load Balancer

**What:** Distributes incoming traffic across multiple servers to prevent any single server from being overwhelmed.

**When to Use:**
- Multiple app servers exist
- Need high availability (if one server dies, traffic reroutes)
- Need horizontal scaling

**Interview Pattern:** Almost EVERY design includes a load balancer between client and app servers. Draw it early.

**Algorithms:**
| Algorithm | Best For | Trade-off |
|-----------|----------|-----------|
| Round Robin | Equal servers, stateless requests | Ignores server load |
| Least Connections | Varying request complexity | More overhead to track |
| IP Hash | Session stickiness needed | Uneven distribution possible |
| Weighted Round Robin | Servers with different capacity | Manual weight management |

**Trade-offs:**
- L4 (transport) vs L7 (application) load balancing — L7 is smarter but slower
- Hardware (F5) vs Software (Nginx, HAProxy) — cost vs flexibility
- Single LB = SPOF → need active-passive or active-active pair

**Failure Mode:** LB itself goes down → entire service unavailable. Solution: redundant LBs with health checks.

**Socratic Questions:**
- "Where would you put a load balancer in this design? Why there?"
- "What happens if one of the servers behind the LB crashes mid-request?"
- "Round Robin vs Least Connections — which fits this system better?"

---

### 4.2 Cache

**What:** In-memory data store for frequently accessed data. Reduces DB load, improves latency.

**When to Use:**
- Read-heavy workload (read:write > 5:1)
- Data that's expensive to compute or fetch
- Data that doesn't change frequently
- Need sub-millisecond response times

**Interview Pattern:** Mention caching when read:write ratio is high. Specify WHAT to cache (query results? rendered pages? computed values?).

**Strategies:**
| Strategy | How It Works | Best For |
|----------|-------------|----------|
| Cache-Aside (Lazy) | App checks cache → miss → query DB → write to cache | General purpose. Most common. |
| Write-Through | Write to cache AND DB simultaneously | Strong consistency needed |
| Write-Behind | Write to cache → async write to DB | Write-heavy, can tolerate temporary inconsistency |
| Read-Through | Cache fetches from DB on miss automatically | Simplified app logic |

**Trade-offs:**
- Consistency: cached data can be stale → need TTL or invalidation strategy
- Memory cost: cache is RAM → expensive at scale
- Cold start: empty cache after restart → thundering herd problem
- Cache invalidation is one of the two hard problems in CS

**Failure Mode:** Cache goes down → all traffic hits DB → DB overload (cache stampede). Solution: cache cluster with replication, circuit breaker pattern.

**Socratic Questions:**
- "What data would benefit most from caching here?"
- "Write-through or cache-aside? What's the consequence of each?"
- "What happens when the cache goes down? How does the system degrade?"
- "How do you handle cache invalidation when data changes?"

---

### 4.3 CDN (Content Delivery Network)

**What:** Geographically distributed network of servers that cache static content close to users.

**When to Use:**
- Serving static assets (images, videos, CSS, JS)
- Users distributed globally
- Need low-latency content delivery
- High traffic that would overwhelm origin servers

**Interview Pattern:** Mention CDN when the system serves media (images, videos) or has global users.

**Types:**
| Type | Behavior | Best For |
|------|----------|----------|
| Pull CDN | CDN fetches from origin on first request, caches it | Low-moderate traffic. Less management. |
| Push CDN | You upload content to CDN proactively | Predictable content. Large files. Video. |

**Trade-offs:**
- Cost: CDN bandwidth is not free — can be expensive for video
- Stale content: need cache invalidation or versioned URLs
- Dynamic content: CDN doesn't help with personalized/dynamic data
- Vendor lock-in: switching CDN providers is non-trivial

**Failure Mode:** CDN outage → requests fall back to origin → potential origin overload. Solution: multi-CDN strategy or graceful degradation.

**Socratic Questions:**
- "Where in this system would a CDN help most?"
- "Pull or push CDN for this use case? Why?"
- "How do you invalidate CDN cache when content is updated?"

---

### 4.4 Message Queue

**What:** Asynchronous communication between services. Producer sends messages; consumer processes them independently.

**When to Use:**
- Decoupling services (producer doesn't wait for consumer)
- Handling traffic spikes (queue absorbs burst)
- Tasks that can be processed asynchronously (email, notifications, video encoding)
- Reliable delivery needed (messages persist in queue)

**Interview Pattern:** Use when you say "this doesn't need to happen in real-time" or "this can be processed later."

**Options:**
| Queue | Strength | When to Choose |
|-------|----------|---------------|
| Kafka | High throughput, ordered, replay-able | Event streaming, logs, high-volume |
| RabbitMQ | Flexible routing, priority queues | Task queues, complex routing |
| SQS | Managed, scalable, cheap | AWS ecosystem, simple queues |
| Redis Pub/Sub | Ultra-low latency | Real-time, can tolerate message loss |

**Trade-offs:**
- Adds complexity: now you have eventual consistency between producer and consumer
- Message ordering: guaranteed in Kafka partitions, not in SQS standard
- At-least-once vs exactly-once delivery — exactly-once is very hard
- Dead letter queues needed for failed messages

**Failure Mode:** Consumer dies → messages pile up → queue fills up → producer blocked. Solution: auto-scaling consumers, DLQ for poison messages, monitoring queue depth.

**Socratic Questions:**
- "Does this operation need to be synchronous? What if we made it async?"
- "What happens if the consumer is slower than the producer?"
- "Kafka vs RabbitMQ — what's the key difference for this system?"
- "How do you handle a message that fails processing 5 times?"

---

### 4.5 Database Types & Selection

**What:** Choosing the right database type based on data model, access patterns, and scale requirements.

**When to Use:** EVERY system design. Database selection is always a decision point.

**Interview Pattern:** State your choice AND why. "I'd use PostgreSQL because we need ACID transactions for payments" is 10x better than "I'd use a database."

**Decision Matrix:**

| Type | Examples | Best For | Not Great For |
|------|----------|----------|---------------|
| Relational (SQL) | PostgreSQL, MySQL | Structured data, joins, ACID, complex queries | Massive scale writes, schema-less data |
| Document | MongoDB, DynamoDB | Flexible schema, nested data, horizontal scale | Complex joins, strong consistency |
| Key-Value | Redis, Memcached | Simple lookups, caching, sessions | Complex queries, relationships |
| Wide-Column | Cassandra, HBase | High write throughput, time-series, IoT | Ad-hoc queries, joins |
| Graph | Neo4j, Neptune | Relationships, social networks, recommendations | Simple CRUD, high write volume |
| Time-Series | InfluxDB, TimescaleDB | Metrics, monitoring, IoT sensor data | General-purpose queries |

**Trade-offs:**
- SQL: strong consistency but harder to scale horizontally
- NoSQL: scales easily but weaker consistency guarantees
- Polyglot persistence: use multiple DB types (complexity vs optimization)

**Socratic Questions:**
- "What's the data model? Structured or flexible?"
- "What are the access patterns? More reads or writes?"
- "Do you need joins? Transactions? Full-text search?"
- "SQL or NoSQL — and WHY for this specific system?"

---

### 4.6 API Gateway

**What:** Single entry point for all client requests. Handles routing, auth, rate limiting, protocol translation.

**When to Use:**
- Multiple backend services (microservices)
- Need centralized auth, rate limiting, logging
- Different clients need different APIs (mobile vs web)
- Protocol translation needed (REST → gRPC internal)

**Interview Pattern:** Mention when you have 3+ backend services. It's the "front door" of your system.

**Trade-offs:**
- Single point of failure → need redundancy
- Added latency (one more hop)
- Can become a bottleneck if not scaled
- Complexity of configuration

**Socratic Questions:**
- "How does the client know which service to talk to?"
- "Where do you handle authentication — in each service or centrally?"
- "What if the API gateway goes down?"

---

### 4.7 Rate Limiter

**What:** Controls the rate of requests a client can make. Prevents abuse and protects backend resources.

**When to Use:**
- Public-facing APIs
- Preventing DDoS or abuse
- Enforcing usage tiers (free vs paid)
- Protecting expensive operations

**Interview Pattern:** Mention for any public API. Common as a standalone design problem too.

**Algorithms:**
| Algorithm | How It Works | Trade-off |
|-----------|-------------|-----------|
| Token Bucket | Tokens refill at fixed rate. Request consumes a token. | Allows bursts. Most common. |
| Leaking Bucket | Requests enter a queue. Processed at fixed rate. | Smooths traffic. No bursts. |
| Fixed Window | Count requests per time window. | Simple but boundary spike problem. |
| Sliding Window Log | Track timestamp of each request. | Accurate but memory-heavy. |
| Sliding Window Counter | Weighted count across windows. | Good balance of accuracy and memory. |

**Socratic Questions:**
- "Token bucket vs leaking bucket — what's the user experience difference?"
- "Where do you implement rate limiting — at the gateway or per service?"
- "How do you rate limit in a distributed system with multiple servers?"

---

### 4.8 Database Replication

**What:** Copying data across multiple database servers for redundancy and read scaling.

**When to Use:**
- Need high availability (if master dies, promote replica)
- Read-heavy workload (distribute reads across replicas)
- Geographic distribution (replica closer to users)

**Interview Pattern:** Mention when discussing availability or read-heavy scaling.

**Topologies:**
| Type | How It Works | Trade-off |
|------|-------------|-----------|
| Master-Slave | One write node, multiple read nodes | Simple. Replication lag on reads. |
| Master-Master | Multiple write nodes | Complex conflict resolution. |
| Synchronous | Write confirmed only after replica confirms | Strong consistency. Higher latency. |
| Asynchronous | Write confirmed immediately. Replica catches up. | Low latency. Possible data loss. |

**Failure Mode:** Master dies → promote replica → possible data loss if async replication. Solution: semi-synchronous replication (at least one replica confirmed).

**Socratic Questions:**
- "If the master DB goes down, what happens to in-flight writes?"
- "Sync or async replication — what's the latency vs consistency trade-off?"
- "How do you handle replication lag for the read path?"

---

### 4.9 Database Sharding

**What:** Splitting a large database into smaller pieces (shards) distributed across multiple servers.

**When to Use:**
- Single DB can't handle the data volume
- Write throughput exceeds single server capacity
- Need to scale beyond vertical limits

**Interview Pattern:** Mention when a single DB is a bottleneck. Usually comes up in deep dive.

**Strategies:**
| Strategy | How It Works | Trade-off |
|----------|-------------|-----------|
| Hash-based | Hash(shard_key) % num_shards | Even distribution. Resharding is painful. |
| Range-based | Shard by ranges (A-M, N-Z) | Good for range queries. Possible hot spots. |
| Geography-based | Shard by region | Low latency. Uneven data distribution. |
| Directory-based | Lookup table maps key → shard | Flexible. Directory is SPOF. |

**Challenges:**
- Cross-shard queries (joins across shards are expensive)
- Resharding when adding/removing shards
- Hot shards (uneven data distribution)
- Maintaining referential integrity across shards

**Socratic Questions:**
- "What's your shard key? Why that field?"
- "What happens when you need to add a new shard?"
- "How do you handle a query that needs data from multiple shards?"

---

### 4.10 Consistent Hashing

**What:** A hashing technique that minimizes key redistribution when servers are added or removed.

**When to Use:**
- Distributed caching (deciding which cache server holds which key)
- Load balancing with server changes
- Any system where nodes join/leave dynamically

**Interview Pattern:** Mention when discussing cache distribution or DB sharding with dynamic scaling.

**How It Works:**
1. Hash both servers and keys onto a ring (0 to 2^32)
2. A key is assigned to the first server clockwise from its position
3. When a server is added/removed, only keys between it and its predecessor move
4. Virtual nodes: each server gets multiple positions on the ring for even distribution

**Trade-offs:**
- Without virtual nodes: uneven distribution
- With virtual nodes: more memory for the mapping, but much better balance
- Complexity vs simple modulo hashing

**Socratic Questions:**
- "What problem does consistent hashing solve that regular hash(key) % N doesn't?"
- "What happens when you add a new cache server with consistent hashing vs without?"
- "What are virtual nodes and why do we need them?"

---

### 4.11 CAP Theorem

**What:** In a distributed system, you can only guarantee 2 of 3: Consistency, Availability, Partition Tolerance.

**Key Insight:** Network partitions WILL happen. So the real choice is: **CP (consistency over availability)** or **AP (availability over consistency)** during a partition.

**When to Use:** Any time Wiganz discusses distributed systems. This is the foundation of trade-off analysis.

**Real-World Examples:**
| System | Choice | Why |
|--------|--------|-----|
| Banking/Payment | CP | Money must be consistent. Better to reject than be wrong. |
| Social Media Feed | AP | Showing a slightly stale feed is better than showing nothing. |
| DNS | AP | Old IP is better than no IP. |
| Inventory (e-commerce) | CP | Can't sell items that don't exist. |

**Socratic Questions:**
- "For THIS system, is it worse to show stale data or show nothing?"
- "What happens during a network partition? Which guarantee do you sacrifice?"
- "Is there a way to be 'mostly consistent' without full CP? (Hint: eventual consistency)"

---

### 4.12 Consistency Patterns

**What:** Different levels of data consistency across distributed nodes.

**Patterns:**
| Pattern | Guarantee | Latency | Use Case |
|---------|-----------|---------|----------|
| Strong Consistency | All reads see latest write | Highest | Payments, inventory, banking |
| Eventual Consistency | All reads WILL see latest write... eventually | Lowest | Social feeds, likes, views |
| Causal Consistency | Related operations maintain order | Medium | Comments (reply after original), messaging |
| Read-Your-Writes | User sees their own writes immediately | Medium | Profile updates, posts |

**Interview Pattern:** After choosing AP or CP, specify WHICH consistency pattern and why.

**Socratic Questions:**
- "What level of consistency does this feature actually NEED?"
- "If a user posts a comment and refreshes — must they see it immediately?"
- "What's the business impact of showing stale data for 5 seconds? 5 minutes?"

---

## 5. BACK-OF-ENVELOPE ESTIMATION CHEAT SHEET

### Power of 2 — Data Size Reference

| Power | Exact | Approx | Name |
|-------|-------|--------|------|
| 2^10 | 1,024 | ~1 Thousand | 1 KB |
| 2^20 | 1,048,576 | ~1 Million | 1 MB |
| 2^30 | 1,073,741,824 | ~1 Billion | 1 GB |
| 2^40 | ~1.1 Trillion | ~1 Trillion | 1 TB |
| 2^50 | — | ~1 Quadrillion | 1 PB |

### Latency Numbers Every Engineer Should Know

| Operation | Latency | Order of Magnitude |
|-----------|---------|-------------------|
| L1 cache reference | 0.5 ns | — |
| L2 cache reference | 7 ns | 14x L1 |
| Main memory (RAM) | 100 ns | 200x L1 |
| SSD random read | 150 μs | 1,000x RAM |
| HDD random read | 10 ms | 100x SSD |
| Send 1 KB over 1 Gbps network | 10 μs | — |
| Read 1 MB sequentially from memory | 250 μs | — |
| Read 1 MB sequentially from SSD | 1 ms | — |
| Read 1 MB sequentially from HDD | 20 ms | 20x SSD |
| Round trip within same datacenter | 500 μs | — |
| Round trip CA → Netherlands → CA | 150 ms | 300x datacenter |

**Key Takeaways:**
- Memory is fast. Disk is slow. Network is in between.
- Sequential reads >> random reads (for both SSD and HDD)
- Cross-continent = 150ms minimum — CDN matters for global users

### QPS (Queries Per Second) Formula

```
Average QPS = DAU × avg_queries_per_user / 86,400
Peak QPS = Average QPS × peak_multiplier (typically 2x-5x)
```

**Example:** 10M DAU, 10 queries/user/day
- Average QPS = 10,000,000 × 10 / 86,400 ≈ 1,157 QPS
- Peak QPS ≈ 2,300 - 5,800 QPS

### Storage Estimation Formula

```
Daily storage = data_per_record × records_per_day
Yearly storage = daily × 365
5-year storage = yearly × 5
```

**Example:** 500M tweets/day, 300 bytes each + 20% with 1 MB media
- Text: 500M × 300 bytes = 150 GB/day
- Media: 500M × 0.2 × 1 MB = 100 TB/day
- 5-year: ~183 PB (just media)

### Quick Reference Numbers

| Item | Value |
|------|-------|
| Seconds in a day | 86,400 (~100K) |
| Seconds in a year | ~31.5 Million |
| Average image size | 200 KB - 2 MB |
| Average tweet/post | 200-500 bytes |
| UUID size | 128 bits = 16 bytes |
| Average web page | 2-3 MB |
| HD video (1 min) | ~150 MB |
| Single server handles | 10K-50K concurrent connections |
| Single DB server | ~5K-10K QPS (depends heavily on query complexity) |
| Redis throughput | ~100K QPS per node |

### Estimation Drill Protocol for Hadriel

When Wiganz needs to estimate during a session:
1. "Start with the number of users. How many DAU?"
2. "What's each user doing? How many [actions] per day?"
3. "What's the size of each [action]? Break it down."
4. "Now multiply. What's the daily/yearly total?"
5. "Does this number feel right? Sanity check against known systems."

**Red flags in estimations:**
- Getting exact numbers (estimates should be rough — order of magnitude matters)
- Forgetting peak vs average
- Not accounting for media/blob storage separately
- Confusing KB, MB, GB (check powers of 2)

---

## 6. SOCRATIC QUESTION BANK

Use these during sessions. Pick questions relevant to the current design.

### Requirements & Scope (7 Questions)
1. "What are the CORE features vs nice-to-have? Can you rank them?"
2. "How many users? DAU? Concurrent? Where are they geographically?"
3. "What's the read-to-write ratio? Is this read-heavy or write-heavy?"
4. "What's the acceptable latency? Sub-100ms? Sub-1s? Doesn't matter?"
5. "Do we need real-time updates or is polling/refresh acceptable?"
6. "What's the expected data retention? Forever? 5 years? 30 days?"
7. "Who are the main actors? End users? Admin? Other services?"

### Architecture & Components (5 Questions)
8. "Walk me through the happy path — user does [X], what happens step by step?"
9. "What's the single most important component here? What if it goes down?"
10. "Do you need a queue anywhere? What can be processed asynchronously?"
11. "Where does the data live? How many different data stores do you need?"
12. "Is a monolith or microservices better for this system's current scale?"

### Trade-offs — The Most Differentiating Skill (6 Questions)
13. "You chose [X]. What did you give up by not choosing [Y]?"
14. "If you had to optimize for EITHER latency or consistency, which one and why?"
15. "SQL or NoSQL? Don't just pick one — tell me what you LOSE with each."
16. "Push or pull model for notifications? What's the trade-off?"
17. "Sync or async processing? What's the user experience for each?"
18. "Cache everything or cache selectively? What's the cost of each approach?"

### Scale (5 Questions)
19. "What breaks first if we 10x the traffic?"
20. "Where's the bottleneck? How do you know?"
21. "Can this component scale horizontally? If not, how do you scale it?"
22. "What if a single user generates 1000x more data than average? (Hot key problem)"
23. "How do you handle traffic spikes? (Flash sales, viral content, etc.)"

### Failure Modes (5 Questions)
24. "What happens if [critical component] goes down?"
25. "How do you detect that something is wrong? What metrics do you monitor?"
26. "If the database goes down mid-transaction, what happens to the user's data?"
27. "Network partition between service A and B — what breaks?"
28. "How do you handle cascading failures? (Service A down → B overloaded → C down)"

### Data (5 Questions)
29. "What's the data model? Show me the core entities and their relationships."
30. "What are the access patterns? What queries run most frequently?"
31. "How do you handle data that grows without bound? (Logs, messages, events)"
32. "Do you need ACID transactions? For which operations?"
33. "How do you handle data migration or schema changes at scale?"

---

## 7. ANTI-PATTERNS & RED FLAGS

Watch for these during sessions. When detected, use the suggested intervention.

### Design Anti-Patterns

| Anti-Pattern | What It Looks Like | Hadriel's Intervention |
|-------------|-------------------|----------------------|
| **Silver Bullet** | "Let's use Kafka for everything" | "Kafka is great for X. But what about Y? Is Kafka the right tool there too?" |
| **Resume-Driven Design** | "Let's add Kubernetes and a service mesh" (for a simple system) | "Does this system need that complexity? What's the simplest version?" |
| **Single Point of Failure** | No redundancy anywhere in the design | "What happens if [single component] goes down? The whole system dies?" |
| **Premature Optimization** | Sharding a database that doesn't need it yet | "How much data are we talking about? Does a single Postgres handle this?" |
| **Missing Basics** | Elaborate caching but no database design | "The cache sounds great. But where does the source of truth live?" |
| **Hand-Wavy Scaling** | "We'll just add more servers" | "HOW do you add more servers? What about state? What about data?" |
| **Ignoring Consistency** | No discussion of what happens when data is stale | "User A writes. User B reads. What does User B see? Always the latest?" |

### Communication Anti-Patterns

| Anti-Pattern | What It Looks Like | Hadriel's Intervention |
|-------------|-------------------|----------------------|
| **Silent Designing** | Thinking for 5 minutes without saying anything | "Talk me through what you're thinking. The interviewer needs to hear your process." |
| **Jumping to Deep Dive** | Designing database schema before high-level architecture | "Zoom out. What are the major boxes? We'll go deep in a moment." |
| **Not Asking Questions** | Starting to design immediately when problem is stated | "If I'm the interviewer and you don't ask questions, I think you're not thorough." |
| **Over-Engineering** | 15 microservices for a URL shortener | "Would a startup build this? What's the simplest version that handles the scale?" |
| **Under-Engineering** | "Just one server and one database" for 100M users | "Can one server handle [calculated QPS]? Let's do the math." |
| **No Trade-offs** | "I chose PostgreSQL." (with no justification) | "Why PostgreSQL? What did you consider and reject? What's the downside?" |
| **Buzzword Dropping** | "We'll use eventual consistency with CQRS and event sourcing" | "Explain eventual consistency in your own words. What does the USER experience?" |

---

## 8. POST-SESSION PROTOCOL

Mirror the LeetCode post-solve protocol from CLAUDE.md. Execute after EVERY SD session.

### Step 1: Confirm Completion ✅
"Khoan đã Wiganz ✋ Session system design này đã xong chưa? Mình đã cover đủ chưa?"
→ WAIT for confirmation.

### Step 2: Offer Artifacts (ASK FIRST) 🧠📂

**Q1 — Visualization:**
"Bạn có muốn Hadriel **tạo một file HTML** để visualize kiến trúc system design vừa làm không? (Interactive diagram with data flow)"

**Q2 — Learning Archive:**
"Bạn có muốn Hadriel **tạo một file Markdown (.md)** để ghi lại thiết kế, trade-offs, mistakes, và bài học không?"

**Q3 — Anki Cards:**
"Bạn có muốn Hadriel **tạo Anki cards** cho các building blocks và trade-offs vừa học không?"

**Q4 — Source (if Q2=YES):**
"Nguồn gốc để tạo archive:
1️⃣ Conversation hiện tại
2️⃣ Outside session (paste nội dung)
3️⃣ Session file (tên file cụ thể)
4️⃣ Cả nhiều nguồn"

→ Wait for answers. Execute ONLY what was approved.

### Step 3: Execute Approved Artifacts ⚙️
- HTML → Save in: `System Design Prep/[System Name]/[system]-architecture.html`
- Archive → Save in: `System Design Prep/[System Name]/[system]-archive.md`
- Anki → Save in: `System Design Prep/[System Name]/Anki-Cards/[system]-cards.csv`

### Step 4: Update Progress 📊
Update `memory/system-design-progress.json`:
- Update relevant system in `systems_designed`
- Update component confidence in `core_concepts`
- Add to session history
- Note aha moments and weak areas

### Step 5: Closure 🔒
"Ok, session system design này đã được xử lý xong trọn vẹn rồi 💪 Từ design → reflect → archive."

If mock interview → include rubric score in closure.
If major breakthrough → celebrate BIG and suggest telling Neriah.

---

## 9. PROGRESS TRACKING INTEGRATION

### Mastery Levels for Systems Designed

| Level | Definition | Criteria |
|-------|-----------|----------|
| **not_started** | Haven't attempted this system | No session recorded |
| **learning** | Studied with Hadriel in Learning mode | Completed 1 guided session. Understands components. |
| **practiced** | Designed independently in Practice mode | Score 20+/45 on practice rubric. Can identify components. |
| **mastered** | Passed Mock Interview | Score 27+/45 on mock rubric. Can design confidently in 45 min. |

### Confidence Levels for Core Concepts

| Level | Definition |
|-------|-----------|
| **none** | Haven't learned this concept |
| **beginner** | Knows what it is. Can't explain trade-offs. |
| **competent** | Understands trade-offs. Can apply in design. |
| **confident** | Can teach it. Makes correct decisions quickly. |
| **interview-ready** | Can discuss deeply under pressure. Handles curveball questions. |

### Communication Skills Tracking (5 Dimensions)

Track these across sessions — they're often the difference between pass and fail:

| Dimension | What to Observe |
|-----------|----------------|
| **Thinking Aloud** | Does Wiganz narrate his thought process or go silent? |
| **Structured Approach** | Does he follow the 4-step framework or jump around? |
| **Trade-off Articulation** | Does he state trade-offs or just make decisions? |
| **Requirement Gathering** | Does he ask questions or assume? |
| **Time Management** | Does he pace across all 4 steps or get stuck on one? |

### Suggested Training Order (6-Week Plan)

| Phase | Week | System | Difficulty | Key Concepts to Learn |
|-------|------|--------|------------|----------------------|
| 1 — Foundation | W1-2 | URL Shortener | Easy | Hashing, DB design, caching, estimation |
| 1 — Foundation | W2-3 | Rate Limiter | Easy | Algorithms, distributed counting, Redis |
| 2 — Core | W3-4 | Twitter/News Feed | Medium | Fan-out, timelines, caching strategies |
| 2 — Core | W4-5 | Chat System | Medium | WebSockets, message queues, presence |
| 3 — Advanced | W5-6 | Key-Value Store | Medium | Consistent hashing, replication, partitioning |
| 3 — Advanced | W6+ | Notification System | Medium | Fan-out, push vs pull, priority queues |
| 4 — Boss Level | W7+ | Video Streaming | Hard | CDN, encoding, adaptive bitrate, storage |

**For each system, run 3 sessions:**
1. 🟢 Learning Mode — Guided design with teaching
2. 🟡 Practice Mode — Independent design with Socratic feedback
3. 🔴 Mock Mode — Timed 45-min simulation with rubric scoring

### Progress JSON Update Template

When updating `memory/system-design-progress.json` after a session:

```json
{
  "systems_designed": {
    "[system_name]": {
      "status": "learning|practiced|mastered",
      "sessions": [
        {
          "date": "YYYY-MM-DD",
          "mode": "learning|practice|mock",
          "score": null,
          "notes": "...",
          "aha_moments": ["..."],
          "weak_areas": ["..."]
        }
      ],
      "mock_score": null,
      "last_practiced": "YYYY-MM-DD"
    }
  },
  "core_concepts": {
    "[concept]": {
      "level": "none|beginner|competent|confident|interview-ready",
      "notes": "...",
      "last_studied": "YYYY-MM-DD"
    }
  },
  "communication_skills": {
    "thinking_aloud": "1-5",
    "structured_approach": "1-5",
    "tradeoff_articulation": "1-5",
    "requirement_gathering": "1-5",
    "time_management": "1-5"
  }
}
```

---

# ═══════════════════════════════════════════════════════════════════════════
# END OF FRAMEWORK
# ═══════════════════════════════════════════════════════════════════════════
# Created: 2026-03-23
# Author: Hadriel 🔥⚔️💪
# Purpose: Operational teaching playbook for system design interview prep
# Referenced by: CLAUDE.md system design section
# ═══════════════════════════════════════════════════════════════════════════
