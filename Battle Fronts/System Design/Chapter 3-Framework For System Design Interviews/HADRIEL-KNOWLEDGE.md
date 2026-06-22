# HADRIEL-KNOWLEDGE: Chapter 3 — A Framework for System Design Interviews

---

## Quick Reference (Already Covered in Existing Materials)

The existing chapter-3-complete.html covers:
- 4-step framework overview
- Step 1: Understand the Problem & Establish Design Scope (3-10 min) — ask clarifying questions
- Step 2: Propose High-Level Design (10-15 min) — box diagrams, back-of-envelope estimates, API endpoints
- Step 3: Design Deep Dive (10-25 min) — focus on 2-3 components interviewer cares about
- Step 4: Wrap Up (3-5 min) — identify bottlenecks, future improvements, edge cases
- Dos and Don'ts for each step
- News feed system as a worked example

---

## Deep Knowledge — Additional Topics

---

### Back-of-the-Envelope Calculations Mastery

#### Numbers Every Engineer Must Know

**Latency Numbers (Jeff Dean's classic, still relevant):**
| Operation | Approximate Latency |
|---|---|
| L1 cache reference | 0.5 ns |
| L2 cache reference | 7 ns |
| RAM read | 100 ns |
| SSD random read | 150 µs |
| HDD random read | 10 ms |
| Send 1KB over 1Gbps network | 10 µs |
| Datacenter roundtrip | 500 µs |
| Cross-continent (US→Europe) roundtrip | 150 ms |
| DNS lookup | 10-100 ms |

**Key insight:** SSD is 70x faster than HDD for random reads. RAM is 1,000x faster than SSD. Design accordingly — cache in RAM, avoid unnecessary disk seeks.

**Powers of 2 Cheat Sheet:**
| Power | Value | Memory Term |
|---|---|---|
| 2^10 | ~1,000 | 1 KB |
| 2^20 | ~1,000,000 | 1 MB |
| 2^30 | ~1,000,000,000 | 1 GB |
| 2^40 | ~1,000,000,000,000 | 1 TB |
| 2^50 | ~1 quadrillion | 1 PB |

**Availability Percentages (SLA math):**
| Availability | Downtime/Year | Downtime/Month | Downtime/Week |
|---|---|---|---|
| 99% (two nines) | 3.65 days | 7.2 hours | 1.68 hours |
| 99.9% (three nines) | 8.77 hours | 43.8 minutes | 10.1 minutes |
| 99.99% (four nines) | 52.6 minutes | 4.38 minutes | 1.01 minutes |
| 99.999% (five nines) | 5.26 minutes | 26.3 seconds | 6.05 seconds |

**Interview point:** AWS EC2 SLA is 99.99%. To achieve 99.99% with two 99.9% servers in parallel: availability = 1 - (0.001 × 0.001) = 99.9999%. Redundancy multiplies availability.

#### QPS Estimation Templates

**Template: Social Media Feed**
```
Given: 300 million monthly active users (MAU)
Daily Active Users: 300M × 50% = 150M DAU
Requests/day per user: assume 10 reads
Total requests/day: 150M × 10 = 1.5 billion/day
QPS: 1.5B / 86,400 sec ≈ 17,400 QPS
Peak QPS: 17,400 × 3 = ~52,000 QPS (3x for peak)
```

**Template: Storage Estimation (Twitter)**
```
Given: 100M tweets/day
Tweet size: 280 chars × 2 bytes = 560 bytes + metadata ≈ 1 KB
Daily storage: 100M × 1 KB = 100 GB/day
5-year storage: 100 GB × 365 × 5 = ~183 TB
With media (20% tweets have images): add 183 TB × 4 = ~730 TB for images
Total 5-year: ~1 PB
```

**Template: Bandwidth Estimation (YouTube)**
```
Given: 5M video uploads/day
Average video: 300 MB
Upload bandwidth: 5M × 300 MB / 86,400 sec ≈ 17 GB/sec upload
Video views: 100M views/day
Average view: 100 MB (compressed stream)
Download bandwidth: 100M × 100 MB / 86,400 sec ≈ 116 GB/sec download
```

**Golden rules for estimation:**
1. Always state assumptions explicitly before calculating
2. Round generously (1M DAU → 10 QPS, not 11.57)
3. Separate read vs write QPS (reads typically 10-100x more than writes)
4. Consider peak load (2-5x average)
5. Add storage for 5 years (shows you think long-term)

---

### Communication Frameworks — Think Out Loud

#### Verbal Signposting Techniques
These phrases signal structure and keep the interviewer engaged:

**When scoping:**
- "Before I dive in, let me clarify the requirements to make sure we're aligned..."
- "I'll assume X for now — is that a reasonable assumption?"
- "What's more important to you: consistency or availability for this feature?"

**When estimating:**
- "Let me do a quick back-of-the-envelope to validate we need [component]..."
- "I'll be rough with the numbers — the order of magnitude matters here, not precision."
- "Based on this estimate, we're looking at roughly 50,000 QPS, so we definitely need horizontal scaling."

**When proposing design:**
- "Let me start with the simplest design that could work, then identify where it breaks..."
- "There are two main approaches here: [A] and [B]. Let me walk through the trade-offs..."
- "I'm going to make a decision here and explain my reasoning — we can revisit if needed."

**When deep diving:**
- "The most interesting challenge in this design is [X]. Let me focus there."
- "This is where I see the bottleneck. Here's how I'd address it..."
- "I'm aware this introduces [trade-off]. That's acceptable because [reason]."

**When wrapping up:**
- "If I had more time, I'd improve [X] because [reason]."
- "The main bottleneck I haven't fully addressed is [Y]. One approach would be..."
- "Any area you'd like me to go deeper on?"

#### Handling "I Don't Know" Moments
**Wrong approach:** "I don't know" (full stop) — kills momentum, signals lack of depth.

**Right approach:**
1. **Acknowledge + Bridge:** "I haven't implemented that specifically, but based on [related knowledge], I'd approach it as..."
2. **Think out loud:** "Let me reason through this... [pause, actually think]. I think the key constraint here is..."
3. **Ask a clarifying question:** "That's an area I want to make sure I address correctly. Is the concern about [X] or [Y]?"
4. **State uncertainty + path forward:** "I'm not certain of the exact implementation, but architecturally I'd consider [A] or [B]. Which direction would you want to explore?"

#### How to Recover from Going Down the Wrong Path
**Signs you're on the wrong path:**
- Interviewer starts asking questions before you finish
- Multiple "hmm" responses without engagement
- "Why would you do it that way?" asked more than once

**Recovery technique:**
> "Actually, I'm going to step back. I realize I may have gone too deep on [X] before establishing [Y]. Let me recalibrate — the real constraint here is [Z]. Starting from that, I'd instead..."

This shows self-awareness and adaptability — qualities interviewers explicitly look for.

---

### Interviewer Psychology — Reading the Room

#### What Different Reactions Signal
| Interviewer Behavior | What It Means | Your Response |
|---|---|---|
| Nodding, taking notes | You're on the right track | Continue but invite feedback |
| Long silence after your statement | They want more depth | "I can go deeper on any of these components" |
| "Interesting, but what about X?" | You missed a critical component | "Good point — let me incorporate that..." |
| "Can you elaborate on Y?" | They want to test your depth | Slow down, explain from first principles |
| "That's one approach, what are some others?" | Don't get attached to one solution | Offer 2-3 alternatives with trade-offs |
| "We're almost out of time..." | They want a wrap-up | Skip details, go straight to summary + next steps |
| Asking about a component you haven't designed | That component matters to them | "I was planning to get to that — let me address it now" |

#### What Interviewers Are Really Evaluating
1. **Problem decomposition** — Can you break an ambiguous problem into concrete components?
2. **Trade-off reasoning** — Do you know that every choice has costs?
3. **Scale awareness** — Do you know when to add complexity?
4. **Communication clarity** — Can you explain your thinking while thinking?
5. **Technical depth** — Can you go deep when asked?
6. **Adaptability** — Can you change course when given new information?

**Critical insight:** System design interviews are not about getting "the right answer." They're about demonstrating engineering judgment. A junior engineer describes what they'd build. A senior engineer describes trade-offs, failure modes, and what they'd change under different constraints.

---

### Multiple Worked Examples (4-Step Framework Applied)

#### Example 1: URL Shortener (bit.ly)

**Step 1 — Scope (5 min):**
- Clarify: Read-heavy (100:1 read/write ratio), no user accounts needed, URLs expire after 1 year
- Scale: 100M URLs created/day; 10B reads/day
- Estimate: 100M / 86,400 ≈ 1,157 writes/sec; 10B / 86,400 ≈ 115,740 reads/sec → read-heavy, caching critical
- Storage: 100M URLs/day × 365 days × ~500 bytes = ~18 TB/year

**Step 2 — High-Level Design:**
- Web server → Application server → Cache (Redis) → Database (PostgreSQL)
- Short URL generation: Base62 encoding of auto-increment ID or hash(long_url)[:7]
- API: `POST /urls` → returns short URL; `GET /{short_code}` → 301/302 redirect

**Step 3 — Deep Dive:**
- **Collision risk:** Hash-based: SHA256 first 7 chars. What if collision? Check DB, regenerate. Use bloom filter for fast collision check.
- **Cache strategy:** Cache `short_code → long_url` (90%+ hit rate expected). Redis, TTL = URL expiry.
- **301 vs 302:** 301 (permanent) — browser caches, reduces server load. 302 (temporary) — server sees every request, enables analytics. Choose based on requirements.
- **Database schema:** `(id, short_code, long_url, created_at, expires_at, user_id)`

**Step 4 — Wrap Up:**
- Bottleneck: Database write performance at scale → shard by short_code
- Future: Custom aliases, analytics tracking, link preview

---

#### Example 2: Chat System (WhatsApp)

**Step 1 — Scope (5 min):**
- 1:1 and group chat (max 100 members), real-time delivery, message history
- 50M DAU, average 40 messages/day
- QPS: 50M × 40 / 86,400 ≈ 23,150 messages/sec

**Step 2 — High-Level Design:**
- Long-lived WebSocket connection between client and chat server
- Stateful chat servers (maintain WebSocket connections)
- Separate stateless services: auth, user profiles, storage
- Message flow: Client → Chat Server → Message Queue → Storage + Push to recipient

**Step 3 — Deep Dive:**
- **Why WebSocket over HTTP?** HTTP is request-response; WebSocket is full-duplex persistent. Server can push messages without polling.
- **Chat server coordination:** User A (on Server 1) sends to User B (on Server 2). Solution: Chat servers subscribe to a pub/sub system (Redis Pub/Sub or Kafka). Each server subscribes to channels for its connected users.
- **Message ordering:** Assign sequence IDs per conversation using Snowflake ID (timestamp-based) for global ordering without coordination.
- **Storage:** Hot data (recent messages) → Cassandra (write-optimized). Cold data → S3. Media → CDN.
- **Group messages:** Fan-out to all group members. For large groups (1000+), fan-out on read.

**Step 4 — Wrap Up:**
- Bottleneck: Message fan-out for large groups
- Online presence: Heartbeat every 5 seconds; last-seen timestamp in Redis
- E2E encryption: Asymmetric key exchange on first message, symmetric for conversation

---

### API Design Patterns

#### RESTful Conventions
```
GET    /users/{id}           — Read a user (idempotent)
POST   /users                — Create user (not idempotent)
PUT    /users/{id}           — Replace user (idempotent)
PATCH  /users/{id}           — Partial update (not always idempotent)
DELETE /users/{id}           — Delete user (idempotent)
GET    /users/{id}/posts     — User's posts (nested resource)
```

**Idempotency:** An operation is idempotent if calling it multiple times has the same effect as calling it once. GET, PUT, DELETE are idempotent. POST is not (creates new resource each time).

**Idempotency Keys for POST:** Client sends `Idempotency-Key: uuid-1234` header. Server stores result for that key. Second request with same key returns cached result instead of creating duplicate. Used by Stripe for payment APIs.

#### Pagination Strategies
| Strategy | How it works | Use case | Limitation |
|---|---|---|---|
| Offset pagination | `?page=3&limit=20` | Simple, SQL OFFSET | Slow for large offsets (scans all rows), items shift if new data added |
| Cursor pagination | `?cursor=eyJpZCI6MTAwfQ==` | Real-time feeds, large datasets | Complex implementation, can't jump to arbitrary page |
| Keyset pagination | `?after_id=1000&limit=20` | Time-ordered data | Only forward navigation |

**Recommendation:** Use cursor pagination for feeds/timelines (consistent results as new data arrives). Use offset pagination only for admin UIs with small datasets.

#### API Versioning
```
URL versioning:    /api/v1/users, /api/v2/users
Header versioning: Accept: application/vnd.myapi.v2+json
Query param:       /api/users?version=2
```
URL versioning is simplest and most explicit. Header versioning is cleaner but harder to test in browser.

---

### Database Schema Design Tips

#### Normalization vs Denormalization
| Approach | Pros | Cons | Use when |
|---|---|---|---|
| Normalized (3NF) | No data duplication, easier writes, consistent updates | Expensive JOINs, multiple round-trips | Write-heavy OLTP, data changes frequently |
| Denormalized | Fewer JOINs, faster reads | Data duplication, update anomalies | Read-heavy, analytics, pre-computed results |

**Interview tip:** Most large-scale systems denormalize for read performance. "We store the comment count directly on the post row instead of counting every time" is a classic denormalization example.

#### Indexing Strategy
- **Primary key index** — Always created automatically; unique, clustered (physically sorted by this key in MySQL InnoDB)
- **Secondary index** — On frequently filtered/sorted columns (e.g., `created_at`, `user_id`)
- **Composite index** — Multiple columns: `(user_id, created_at)` supports queries like `WHERE user_id = 1 ORDER BY created_at DESC`
- **Index rule:** Leftmost prefix rule — composite index `(a, b, c)` supports `WHERE a = ?`, `WHERE a = ? AND b = ?`, but NOT `WHERE b = ?` alone
- **Over-indexing:** Every index slows down writes (index must be updated). Only index columns that appear in WHERE, ORDER BY, or JOIN clauses

---

## Estimation Cheat Sheet (Quick Reference Card)

```
COMMON CONVERSIONS
  1 day = 86,400 seconds ≈ 100,000 seconds
  1 week = 604,800 seconds ≈ 600,000 seconds
  1 month ≈ 2.5M seconds
  1 year ≈ 32M seconds

SCALE REFERENCE
  Small app:     1K QPS
  Medium app:    10K QPS
  Large app:     100K QPS
  Huge app:      1M+ QPS (requires sharding, CDN, distributed everything)

STORAGE QUICK MATH
  1 user record: ~1 KB
  1 tweet: ~1 KB
  1 photo: ~1 MB (compressed: 100-200 KB for thumbnail)
  1 minute HD video: ~100 MB (compressed: ~10 MB for stream)

AVAILABILITY
  99.9%  = 8.77 hrs/year downtime
  99.99% = 52 min/year downtime

TYPICAL READ/WRITE RATIOS
  Social feed: 100:1 (read-heavy)
  E-commerce: 10:1
  Analytics/logging: 1:100 (write-heavy)
```

---

## Anti-Patterns to Recognize and Avoid

### Over-Engineering (The Most Common Mistake)
**Example:** Candidate proposes Kafka, Kubernetes, microservices, and a service mesh for a URL shortener handling 1000 QPS.
**Problem:** Complexity without justification. A single PostgreSQL + Redis setup handles 100K QPS.
**Fix:** Always justify each component with a requirement: "We need [X] because [scale/requirement]."

### Premature Optimization
**Example:** Immediately proposing sharding before establishing user count, QPS, or data size.
**Problem:** Sharding is complex. Unsharded PostgreSQL handles 10,000+ writes/sec.
**Fix:** Start simple. "For phase 1, a single DB is fine. At 10M users, we'd consider read replicas. At 100M, sharding."

### Not Stating Assumptions
**Example:** Designing for 100M users without asking if that's the actual scale.
**Problem:** Your design optimizes for a problem that doesn't exist (or is too small for the complexity).
**Fix:** Always state: "I'm assuming 50M DAU. Is that reasonable?" before designing.

### Monologuing
**Example:** Talking for 10 minutes straight without checking in with the interviewer.
**Problem:** Interviewer can't redirect you; you might solve the wrong problem.
**Fix:** Every 3-5 minutes: "Does this make sense so far? Should I continue here or focus elsewhere?"

### Diving into Details Too Early
**Example:** Spending 15 minutes designing the database schema before establishing the high-level architecture.
**Problem:** You might completely change the schema once you figure out what you're building.
**Fix:** "I'll come back to the detailed schema. First let me establish the overall data flow."

### Proposing a Single Solution
**Example:** "We'll use Redis for caching." Full stop.
**Problem:** Shows lack of trade-off awareness.
**Fix:** "For caching, I'd consider Redis or Memcached. Redis if we need complex data structures or persistence; Memcached for pure throughput. Given our needs, I'd pick Redis because..."

---

## Teaching Playbook

### Mock Interview Script Hadriel Can Run

**Opening (1 min):**
> "This is a 45-minute system design interview. I'll play the interviewer. The problem: Design [Twitter/Uber/WhatsApp]. Before you start, I want you to take 30 seconds to think silently. Then begin."

**During Step 1 (Watch for):**
- Did they ask at least 3 clarifying questions?
- Did they establish scale (users, QPS)?
- Did they state assumptions explicitly?
- **If they jump straight to design:** "You haven't asked me about scale. How many users are you designing for?"

**During Step 2 (Watch for):**
- Did they sketch a box diagram before going deep?
- Did they do back-of-envelope calculation?
- **If they skip estimation:** "Before committing to this architecture, can you estimate the QPS to validate your design choices?"

**During Step 3 (Watch for):**
- Are they covering 2-3 components deeply or shallowly covering everything?
- Are they mentioning trade-offs?
- **If they go too broad:** "Let's focus on the database layer. How would you handle data at 100M users?"

**During Wrap-Up (Watch for):**
- Did they identify the biggest bottleneck?
- Did they propose concrete improvements?
- **If they say "that's it":** "What's the weakest part of your current design? How would you improve it?"

### Evaluation Rubric for Wiganz's Performance

| Dimension | Level 1 (Junior) | Level 2 (Mid) | Level 3 (Senior) |
|---|---|---|---|
| Scoping | Jumps to design, minimal questions | Asks basic questions, establishes scale | Deep clarifying questions, explicitly states assumptions |
| Estimation | Skips or rough guesses | Does QPS/storage estimate | Estimates QPS, storage, bandwidth; uses numbers to justify design |
| Design quality | Single-server thinking | Multi-tier with basic scaling | Full scaling path, multiple trade-offs discussed |
| Trade-offs | "This is the best way" | "This approach has pros/cons" | "Here are 3 approaches, I'd choose X because Y, but in context Z I'd choose differently" |
| Communication | Talks at interviewer | Invites feedback occasionally | Treats as conversation, checks in frequently |
| Bottlenecks | Doesn't identify | Identifies main bottleneck | Identifies multiple, prioritizes, proposes solutions |

### Common Misconceptions to Correct

| Misconception | Correction |
|---|---|
| "System design has a right answer" | It's about trade-off reasoning, not one correct solution |
| "I should design the optimal system from the start" | Start simple, evolve — justify each complexity addition |
| "Back-of-envelope math needs to be exact" | Order of magnitude matters; round aggressively |
| "More components = more impressive" | Unnecessary complexity is a red flag; justify every component |
| "The interviewer wants to see I know [Kafka/K8s/etc.]" | They want to see you know WHEN to use it, not just that it exists |
| "I should pick the 'best' technology" | "Best for this use case" — always contextualize technology choices |

### Aha-Moment Triggers

1. **The "Why does Facebook need 10 data centers?" question** — "If latency to cross the US is 150ms and cross-Atlantic is 300ms, what would a European user experience talking to a US-only server?" → Multi-DC makes latency concrete.

2. **The "What if your interviewer knows more than you?" reframe** — "A system design interview is not a test of whether you know the exact architecture of [Twitter]. It's a test of whether you can reason about trade-offs like a senior engineer."

3. **The "Draw your system's death" exercise** — "Point to every component in your design and tell me: what's the backup if this dies right now?" Forces redundancy thinking naturally.

4. **The "Simplest thing that works first" principle** — "A single server with PostgreSQL handles 10K QPS easily. At what user count does that break? Now design for THAT scale, not 10x beyond it."

---

## Cross-Chapter Connections

- **Chapter 1 (Scaling):** The 4-step framework is how you present Chapter 1's scaling progression in an interview — start simple (single server), establish requirements, evolve architecture
- **Chapter 4 (Rate Limiter):** Use URL shortener QPS example to show why rate limiting is necessary (your 100K QPS estimate reveals the need for traffic control)
- Back-of-envelope skills underpin every subsequent chapter — they tell you when to add complexity
