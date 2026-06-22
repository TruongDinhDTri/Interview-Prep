# Chapter 5: Design Consistent Hashing
## Hadriel's Complete Knowledge File

> **Purpose:** Everything Hadriel needs to understand, explain, and teach consistent hashing. Interview-ready answers, analogies, edge cases, and real-world depth.

---

## 1. Chapter Summary

### The Problem: Naive Modular Hashing
```
serverIndex = hash(key) % N
```
- Works perfectly when N is static
- **Fatal flaw:** When N changes (server added or removed), the modulus changes, and nearly every key recalculates to a different server
- Example: N=4→3: 6 out of 8 keys (75%) remapped → massive cache miss storm

### The Solution: Consistent Hashing
- Put both servers AND keys on the same circular hash ring (SHA-1 space: 0 to 2^160 - 1)
- Servers: `position = hash(server_IP)` — no modulus
- Keys: `position = hash(key)` — no modulus
- Key lookup: walk clockwise from key's position → first server encountered owns the key
- **Result:** Only ~k/n keys remapped when topology changes (vs ~k for naive)

### The Enhancement: Virtual Nodes
- Each physical server → multiple ring positions (vnodes)
- Solves: unequal partition sizes + non-uniform key distribution
- Tradeoff: more vnodes = better distribution but higher memory

---

## 2. Key Formulas & Numbers

| Metric | Value |
|--------|-------|
| SHA-1 hash space | 0 to 2^160 - 1 (≈1.46 × 10^48) |
| Naive redistribution | O(k) — almost all keys move |
| Consistent redistribution | O(k/n) — only adjacent keys move |
| 100 vnodes/server std dev | ~10% |
| 200 vnodes/server std dev | ~5% |
| Dynamo vnodes/node | ~150 |
| Cassandra vnodes/node | 256 (default) |
| Ring lookup time | O(log n) with sorted structure |

---

## 3. Complete Interview Q&A

### Q: What problem does consistent hashing solve?
**A:** Naive hashing (`hash(key) % N`) breaks when server count N changes — nearly all keys remap to different servers, causing a cache miss storm that can overload the database. Consistent hashing limits redistribution to O(k/n) keys by using a ring where positions are absolute (no modulus).

### Q: Explain how the hash ring works step by step.
**A:**
1. Take SHA-1 hash space (0 to 2^160-1) and connect its ends into a circle
2. Hash each server's IP to place it on the ring: `position = hash(server_IP)`
3. Hash each key to place it on the ring: `position = hash(key)`
4. To find a key's server: walk clockwise from the key's position until you hit a server node
5. That server owns the key

### Q: What happens when you add a server?
**A:** The new server is hashed onto the ring. It takes ownership of keys in the arc from its predecessor (counterclockwise) to its position. Only those keys move — all others remain unchanged. This is ~1/n of total keys.

### Q: What happens when you remove a server?
**A:** Keys that were owned by the removed server fall through to the next clockwise server. Only those keys migrate. Everything else is unaffected.

### Q: What are the two issues with basic consistent hashing?
**A:**
1. **Unequal partitions:** Random server placement creates unequal arc sizes — some servers get huge arcs (many keys), others get tiny arcs
2. **Hotspots:** Non-uniform key distribution means some servers may receive disproportionate traffic even with equal-sized arcs

### Q: What are virtual nodes and why do they matter?
**A:** Instead of 1 ring position per server, each server gets multiple positions (vnodes). Server s0 appears as s0_0, s0_1, s0_2... at different ring positions. The many small arcs average out into a more uniform distribution. More vnodes = better balance but higher memory cost.

### Q: What's the tradeoff with virtual node count?
**A:**
- More vnodes → better load distribution (100 vnodes ≈ 10% std dev, 200 vnodes ≈ 5% std dev)
- More vnodes → higher memory for the ring data structure (more entries in sorted map)
- Production: Cassandra uses 256, Dynamo uses ~150

### Q: How do you find affected keys when adding/removing a server?
**A:** Walk counterclockwise from the target server until you hit another server. The range between that predecessor and the target is the affected key range.
- Adding: keys in that range move from old server → new server
- Removing: keys in that range move from removed server → next clockwise server

### Q: Name real-world systems using consistent hashing.
**A:** Amazon Dynamo/DynamoDB, Apache Cassandra, Discord (WebSocket routing), Akamai CDN, Google Maglev load balancer, Memcached (client-side consistent hashing)

### Q: Compare consistent hashing vs naive hashing.
| | Naive (hash % N) | Consistent Hashing |
|--|--|--|
| Redistribution | O(k) — most keys move | O(k/n) — few keys move |
| Cache miss on removal | ~75%+ of keys | ~1/n of keys |
| Lookup time | O(1) | O(log n) |
| Scaling | Requires full rebuild | Online, incremental |

### Q: What hash functions are used?
**A:** SHA-1 (book reference, 160-bit), MD5 (128-bit, used in Ketama/Memcached), MurmurHash/xxHash (non-cryptographic, fastest, used in modern systems). Key requirement: uniform distribution across ring space.

### Q: How does consistent hashing prevent thundering herd?
**A:** With naive hashing, a server failure causes all its keys to miss cache simultaneously, flooding the database. With consistent hashing, only ~1/n keys are affected. With virtual nodes, even those keys spread across multiple remaining servers.

---

## 4. Common Misconceptions

### ❌ "Consistent hashing means zero keys are remapped"
**Reality:** Only k/n keys are remapped — there's always some redistribution. The goal is to minimize it, not eliminate it.

### ❌ "Virtual nodes mean physically separate nodes"
**Reality:** Virtual nodes are just extra positions on the ring for the same physical server. More vnodes ≠ more machines.

### ❌ "Any hash function works"
**Reality:** The hash function must produce uniformly distributed output. A biased hash function defeats the purpose of consistent hashing.

### ❌ "Basic consistent hashing is production-ready"
**Reality:** The two problems (unequal partitions + non-uniform distribution) mean basic consistent hashing is rarely used alone. Virtual nodes are almost always needed.

### ❌ "More servers always means better distribution"
**Reality:** With basic consistent hashing, more servers can actually worsen distribution variance if they happen to cluster together on the ring. Virtual nodes solve this.

---

## 5. Teaching Analogies (Hadriel's Set)

### The Musical Chairs Analogy (Problem)
> "Naive hashing is like musical chairs. When you remove one chair, EVERYONE scrambles to a different seat because the seating formula depends on the total number of chairs. Change the count by 1, and the entire arrangement recalculates."

### The Clock Face Analogy (Ring)
> "Think of a clock face — 12 o'clock wraps back to 12. The hash ring is the same: the largest value connects back to the smallest, forming a seamless circle. There's no boundary where the math breaks."

### The Relay Race Analogy (Adding Server)
> "Adding a server to the ring is like inserting a new runner into a relay race. Only the next runner's leg changes — they hand off earlier now. Everyone else keeps running exactly the legs they already had."

### The Neighborhood Mailbox Analogy (Virtual Nodes)
> "Virtual nodes are like having multiple mailboxes around the neighborhood instead of one. Mail (keys) gets distributed more evenly because there are more collection points spread around. No single mailbox ends up with all the mail from one side of the neighborhood."

### The Library Section Analogy (Lookup)
> "Finding a key's server is like shelving a book by Dewey Decimal — go to the number, then walk the shelves forward until you find the first section that encompasses your number. That section's librarian (server) owns the book."

---

## 6. Real-World Deep Dives

### Amazon Dynamo (2007 Paper)
- First large-scale deployment of consistent hashing in production
- Uses "tokens" (= virtual nodes), originally ~150 per physical node
- Each token represents a range of the hash space called a "virtual node"
- Gossip protocol: nodes broadcast membership changes to O(log N) peers
- Data replicated to the next N-1 clockwise nodes for fault tolerance
- Basis for Amazon DynamoDB, Riak

### Apache Cassandra
- 256 vnodes per physical node by default ("vnodes" option)
- Alternative: "single-token" mode assigns 1 large contiguous range per node
- Token ranges stored in system tables, propagated via gossip
- Replication factor (RF): key is replicated to RF consecutive ring nodes
- Consistent hashing drives both data placement and routing

### Discord
- Uses consistent hashing to route WebSocket connections to gateway servers
- Users in the same guild need to route to the same gateway for real-time delivery
- When a gateway restarts, only users in its arc need to reconnect to a new server
- Minimizes disruption compared to random assignment

### Akamai CDN
- Edge cache servers are consistent-hashed; web requests map to the nearest edge
- Cache miss only for the keys in the failed/added server's arc
- Dramatically reduces cache churn compared to a naive partition scheme
- Co-founded by David Karger who authored the original consistent hashing paper

### Google Maglev
- Software load balancer announced 2016
- Routes network packets to backend servers
- Uses a Maglev consistent hash table (a variant optimized for packet routing speed)
- Key property: minimal connection disruption when backends scale
- 65537-slot lookup table built from consistent hashing

---

## 7. Edge Cases & Advanced Follow-ups

### "What if two servers hash to the same position?"
In theory, SHA-1 produces 2^160 positions, making collision probability astronomically low. In practice, implementations add a tie-breaking rule (e.g., server ID as tiebreaker) or use slightly different hash functions per server.

### "What if the ring is empty?"
The system has no servers and cannot serve keys. This is a configuration error, not a consistent hashing issue. Clients must handle NoServersAvailable exceptions.

### "What about read/write consistency during redistribution?"
Consistent hashing tells you WHERE data goes, not HOW to handle consistency during migration. This is handled by the replication/consistency layer (eventual consistency in Dynamo, tunable consistency in Cassandra).

### "How do you rebalance if a new node joins and should take some load from each existing node?"
Virtual nodes handle this automatically. A new node with 256 vnodes interleaves with existing vnodes across the ring, taking ~1/N of each existing server's load. No explicit rebalancing step needed.

### "What's the implementation complexity?"
Ring is stored in a sorted structure (TreeMap or sorted array with bisect). Key operations:
- Add server: O(v log n) — v vnode insertions at O(log n) each
- Remove server: O(v log n) — v vnode deletions
- Key lookup: O(log n) — binary search for next clockwise position

### "Why clockwise instead of counterclockwise?"
Convention only. The algorithm works symmetrically. The important thing is consistency — always use the same direction for all lookups.

### "How does Cassandra's RF affect consistent hashing?"
With RF=3, each key is stored on 3 consecutive nodes (clockwise). The consistent hash ring determines the "coordinator" node (first clockwise), but data is replicated to the next RF-1 nodes. This provides fault tolerance: the key is accessible even if 2 nodes fail.

---

## 8. Connections to Other Chapters

### Chapter 4 (Rate Limiter)
Consistent hashing solves the "where to store the counter" problem for distributed rate limiting. If you use Redis nodes for rate limit counters, consistent hashing routes user requests to the same Redis node, ensuring consistent counter state.

### Chapter 6 (Key-Value Store Design)
Chapter 5 is foundational to Chapter 6. Key-value stores use consistent hashing for data partitioning. Virtual nodes explain how modern KV stores like Dynamo achieve balanced distribution.

### Chapter 7 (Unique ID Generator)
Consistent hashing can route ID generation requests to specific generator nodes based on user ID or region, ensuring no coordination needed between generators.

### Chapter 12/13 (Notification/News Feed)
Hotspot mitigation via virtual nodes directly addresses the "celebrity problem" — when a celebrity posts, their followers are spread across many servers, preventing a single server from being overwhelmed.

### Chapter 15 (Google Drive)
Consistent hashing underlies the metadata storage and chunk placement in distributed file systems. A file's chunks are placed on servers determined by consistent hashing.

---

## 9. Wiganz-Specific Notes

### What Wiganz Should Watch For
1. **The formula distinction:** Make sure the connection between `hash(key) % N` (problem) and `hash(key)` on a ring (solution) is fully clear. Draw the table example — it makes the 75% miss rate visceral.

2. **The clockwise walk:** This should become automatic. Practice: "Where does key X go? Hash it to a position. Walk clockwise. Hit server Y. Done." The visualization helps most.

3. **Virtual nodes are the money answer in interviews:** Any interviewer asking about consistent hashing expects you to mention virtual nodes and their tradeoffs unprompted. Don't wait to be asked.

4. **The redistribution ratio:** k/n is the key metric. With 5 servers and 1M keys, adding a 6th server should move ~1/6 × 1M = ~167K keys. Be able to calculate this on the fly.

5. **Real-world examples matter:** Mention Dynamo and Cassandra by name. If the interviewer asks a follow-up about replication, Cassandra's RF concept bridges Chapter 5 to Chapter 6.

### Common Stumbles to Avoid
- Don't confuse virtual nodes (same physical server, multiple ring positions) with server replication (same data, multiple physical servers)
- Don't say consistent hashing "eliminates" redistribution — it *minimizes* it
- Don't forget the two problems with basic consistent hashing before jumping to virtual nodes — the problems justify the solution

### Study Sequence
1. Understand the problem viscerally with the table (75% miss rate example)
2. Draw the ring by hand once — hash servers, hash keys, do the clockwise walk
3. Simulate server add/remove, count affected keys
4. Add virtual nodes, explain why distribution improves
5. Be able to explain Dynamo's usage in 2-3 sentences

---

## 10. Quick Reference Card

```
CONSISTENT HASHING — QUICK CHEAT SHEET
═══════════════════════════════════════════

PROBLEM:   hash(key) % N → changes N, most keys move (O(k))

SOLUTION:  hash(key) → ring position
           hash(server_IP) → ring position
           Key lookup: walk clockwise → first server

ADD SERVER:   Move keys in (predecessor, new_server] → new server
REMOVE SERVER: Move keys in (predecessor, dead_server] → next CW server

REDISTRIBUTION: O(k/n) instead of O(k)

BASIC ISSUES: 1) Unequal arcs  2) Non-uniform key distribution

VIRTUAL NODES: Each server → multiple ring positions
              100 vnodes → ~10% std dev
              200 vnodes → ~5% std dev
              Trade-off: memory

REAL WORLD:
  Dynamo:    ~150 vnodes/node  (tokens)
  Cassandra: 256 vnodes/node   (default)
  Discord:   WebSocket routing
  Akamai:    CDN edge routing
  Maglev:    Google load balancing

IMPLEMENTATION: TreeMap or sorted array
LOOKUP TIME: O(log n)

HISTORY: Karger et al., MIT, 1997
```
