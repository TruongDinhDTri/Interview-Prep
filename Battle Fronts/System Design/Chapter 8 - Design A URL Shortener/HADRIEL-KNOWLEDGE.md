# HADRIEL-KNOWLEDGE: Chapter 8 — Design A URL Shortener

---

## Quick Reference

**Core concept:** Map long URL → short 7-char alias. System is read-heavy (10:1 read:write). Key decisions: hash function vs ID-based encoding, 301 vs 302 redirect, collision handling.

**Capacity math to memorize:**
- 100M new URLs/day → ~1,160 writes/sec
- 10:1 read ratio → ~11,600 reads/sec
- 10-year retention → 365B records
- Avg URL = 100 bytes → 365TB storage
- Hash length: 62^7 = 3.5 trillion (covers 10-year need with headroom)

---

## 301 vs 302 Redirect — Deep Dive

| | 301 Permanent | 302 Temporary |
|---|---|---|
| Browser behavior | Caches redirect, skips server next time | Always hits server |
| Server load | Lower (browser caches) | Higher (every request hits server) |
| Analytics | **Cannot track** clicks (browser bypasses) | **Can track** every click |
| Use case | Reduce load when analytics not needed | Track click-through rates, A/B testing |
| HTTP spec | "Resource moved permanently" | "Resource found elsewhere temporarily" |

**Interview trap:** "Should you use 301 or 302?"
→ Answer: **It depends on requirements.** If the product needs analytics (most real URL shorteners do), use 302. If minimizing server load is the priority and analytics don't matter, use 301. In practice, Bit.ly uses 301 for performance, but many analytics-focused services use 302.

**Deeper nuance — CDN caching:**
- 301 responses get cached by CDN edge nodes too, meaning subsequent redirects never reach your origin
- This is a huge cost saving but breaks your ability to update the destination URL later
- Some services use 301 with a short `Cache-Control: max-age=300` as a compromise

---

## Hash Functions Comparison

| Function | Output | Collision Resistance | Speed | Use for URL shortener? |
|---|---|---|---|---|
| CRC32 | 8 hex chars (32-bit) | Low | Fast | Possible but collisions too common |
| MD5 | 32 hex chars | Medium | Fast | First 7 chars only; collision risk |
| SHA-1 | 40 hex chars | High | Slower | First 7 chars; overkill |
| SHA-256 | 64 hex chars | Very High | Slowest | First 7 chars; much overkill |

**The collision problem with truncated hashes:**
Taking the first 7 chars of MD5/SHA-1 does NOT give you collision resistance of the full hash. The birthday paradox means with 365B URLs you have non-trivial collision probability even with SHA-1 truncated to 7 chars.

**Resolution strategy:**
```
hash = MD5(longURL)
shortURL = first 7 chars of hash

if shortURL exists in DB:
    longURL = longURL + predefined_salt  # e.g., "+1", "+2"
    shortURL = first 7 chars of MD5(longURL)
    repeat until no collision
```

**Problem:** Every collision requires another DB read. At scale this is expensive.

---

## Bloom Filter — Mechanics

**What it is:** A probabilistic data structure that tells you "definitely not in set" or "probably in set." Uses k hash functions over a bit array.

**Insert operation:**
1. Hash shortURL with k different hash functions → k indices
2. Set bits at all k indices to 1

**Lookup operation:**
1. Hash shortURL with same k functions → k indices
2. If ANY bit is 0 → definitely not in DB (safe to insert)
3. If ALL bits are 1 → probably in DB (check DB to confirm)

**Why it's perfect for URL shortener collision resolution:**
- **False positives** (says "exists" when it doesn't): Causes one unnecessary DB read — acceptable
- **False negatives** (says "not exists" when it does): Impossible — we never miss an existing shortURL
- Bloom filter fits in memory: 365B URLs, ~10 bits/element → ~456GB… actually too large for a single node; use partitioned bloom filter or count on low false positive rate

**Interview insight:** Bloom filters are also used in Cassandra (SSTable existence check), Bitcoin (wallet address lookup), and Chrome's Safe Browsing feature.

---

## Base 62 Conversion — Algorithm

**Character set:** `0-9` (10) + `a-z` (26) + `A-Z` (26) = 62 characters

**Algorithm (ID → Base62 string):**
```python
CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

def to_base62(id: int) -> str:
    result = []
    while id > 0:
        result.append(CHARS[id % 62])
        id //= 62
    return ''.join(reversed(result)).zfill(7)  # pad to 7 chars

# Example: ID = 11157 → "2TX"
# 11157 % 62 = 33 → 'X'
# 11157 // 62 = 179; 179 % 62 = 55 → 'T'
# 179 // 62 = 2; 2 % 62 = 2 → '2'
# Result: '2TX' (padded to '000002TX' or kept as short as needed)
```

**Why no collision is possible:** Each unique ID maps to exactly one Base62 string. No two IDs produce the same output. The uniqueness guarantee comes from the ID generator, not from the encoding.

**Why Base62 over Base64?**
- Base64 uses `+` and `/` which are URL-unsafe characters
- Base62 uses only alphanumeric characters — safe in URLs without encoding

---

## Hash+Collision vs Base62 — Comparison

| | Hash + Collision Resolution | Base 62 Conversion |
|---|---|---|
| Collision possible? | Yes (must detect and resolve) | No (ID is inherently unique) |
| URL length | Fixed 7 chars | Variable (grows with ID) |
| ID generator needed? | No | Yes (distributed, tricky at scale) |
| Security | Hard to guess next URL | Sequential IDs are guessable |
| Horizontal scale | Easy (stateless hash) | Harder (ID generator is SPOF) |
| Implementation complexity | Medium (need DB check + Bloom filter) | High (distributed ID generator) |

**Interview trap:** "Base62 sounds simpler — why not always use it?"
→ Sequential IDs are **enumerable**. Attacker can crawl all short URLs by incrementing ID. Hash-based approach is more private. Some services add a random salt to the ID before Base62 encoding to mitigate this.

---

## Distributed Unique ID Generator (Connection to Chapter 7)

URL shortener with Base62 encoding requires a globally unique, monotonically increasing ID. Options:

**1. Auto-increment in single DB:**
- Simple but SPOF; doesn't scale horizontally

**2. Multi-master replication (N servers, each increments by N):**
- Server 1: 1, 3, 5, 7... Server 2: 2, 4, 6, 8...
- Problem: Adding servers changes the increment scheme; IDs not time-sorted across servers

**3. Twitter Snowflake:**
- 64-bit ID = 41 bits timestamp + 10 bits machine ID + 12 bits sequence
- ~4096 IDs/ms per machine; globally unique and time-ordered
- Chapter 7 covers this in detail

**4. UUID (random):**
- 128-bit, negligible collision probability
- Too long for Base62 (would produce 22+ char string)

---

## Cache Strategy for URL Redirecting

**Access pattern:** Hot URLs (popular ones) get 80% of reads (Pareto principle). Cache hit rate can be very high.

**Recommended approach:**
- **Cache-Aside** (Lazy Loading): On redirect request, check cache → miss → query DB → populate cache → return longURL
- **Eviction policy:** LRU (Least Recently Used) — most appropriate for URL access patterns
- **Cache size:** 10% of daily active URLs = 100M × 0.1 = 10M entries. At 500 bytes each = 5GB (fits in Redis)
- **TTL:** Avoid setting too short (kills cache effectiveness); popular URLs stay hot indefinitely

**Cache invalidation challenge:**
If a user updates their shortURL destination (rare feature), you need to:
1. Update DB
2. Invalidate cache entry immediately
3. Consider write-through or cache-aside with explicit invalidation

---

## URL Shortening Flow (Figure 8-7 Detail)

```
Client → POST /api/v1/data/shorten { longURL }
          ↓
      Web Server
          ↓
      Does shortURL exist? (check DB/cache by longURL)
      ├── YES: return existing shortURL (idempotency)
      └── NO:
          ↓
      Generate unique ID (Snowflake or DB auto-increment)
          ↓
      Convert ID → Base62 shortURL (7 chars)
          ↓
      Save to DB: { id, shortURL, longURL }
          ↓
      Return shortURL to client
```

**Idempotency consideration:** What if same longURL is submitted twice?
- Option A: Return existing shortURL (requires longURL index in DB)
- Option B: Generate new shortURL each time (simpler, but wasteful)
- Most services do Option A for premium users, Option B for free tier

---

## URL Redirecting Flow (Figure 8-8 Detail)

```
Client → GET /api/v1/{shortURL}
          ↓
      Web Server
          ↓
      Check cache (shortURL → longURL)
      ├── HIT: Return 301/302 to longURL
      └── MISS:
          ↓
      Query DB for shortURL
      ├── FOUND: Populate cache → Return 301/302
      └── NOT FOUND: Return 404
```

**Performance consideration:** Cache hit for 80% of requests means only 20% reach DB. At 11,600 reads/sec, that's ~2,320 DB reads/sec — manageable with a single DB replica.

---

## Real-World Architectures

### Bit.ly
- Uses 301 redirects (reduced server load, analytics via JS tracking pixel instead)
- Stores in MySQL with Redis cache layer
- Shards DB by first char of shortURL (26+ shards)
- CDN in front for very popular links

### TinyURL
- Simpler: uses sequential IDs (guessable)
- No analytics product
- MySQL backend

### Google URL Shortener (goo.gl) — Deprecated 2018
- Used for internal tracking of Google products
- Deprecated as spam vector

---

## Interview Traps

1. **"How do you handle the same longURL submitted twice?"**
   → Requires compound unique index on `longURL` column + idempotency logic

2. **"What if shortURL expires?"**
   → Add `expiry_date` column to url table; background job to clean up expired entries; return 410 Gone instead of 404

3. **"Why not use UUID for shortURL?"**
   → 128-bit UUID in Base62 = ~22 chars. Too long for a "short" URL. Need to truncate, which reintroduces collision risk.

4. **"How do you prevent malicious URLs?"**
   → Maintain blocklist (phishing/malware domains), scan with Google Safe Browsing API on creation, rate limit by IP

5. **"What happens if the ID generator goes down?"**
   → If using single-DB auto-increment: SPOF. Mitigation: pre-generate ID batches (e.g., each web server takes 1000 IDs at startup), or use Snowflake (distributed, no single point)

6. **"How do you scale the database?"**
   → Read replicas for redirecting (read-heavy). Shard writes by shortURL hash prefix or consistent hashing. Consider NoSQL (DynamoDB, Cassandra) for simple key-value access pattern.

7. **"What consistency model do you need?"**
   → **Eventual consistency** is acceptable for redirects (stale cache gives old URL for a few seconds — usually fine). **Strong consistency** needed for shortURL creation (two simultaneous writes must not produce same shortURL).

8. **"How would you support custom aliases (vanity URLs)?"**
   → Separate table for vanity URLs; validate against reserved words (api, www, admin); rate limit (premium feature); check availability endpoint

9. **"How do you monitor this system?"**
   → Track: redirect latency p99, cache hit rate, DB query time, 4xx error rate (expired/invalid links), write throughput vs capacity

10. **"What if two users submit the same longURL simultaneously?"**
    → Race condition on idempotency check. Use DB unique constraint on `longURL` + handle constraint violation by returning existing record. Optimistic locking at application level.

---

## Teaching Playbook

**Opening question to test depth:**
"You're building a URL shortener. Walk me through your API design."
→ Weak answer: "POST to create, GET to redirect"
→ Strong answer: "POST /api/v1/data/shorten with longURL in body, rate-limited per API key. GET /api/v1/{shortURL} returns 302 (to preserve analytics) to longURL. Also consider: GET /api/v1/data/info/{shortURL} for stats endpoint."

**Follow-up to expose 301/302 knowledge:**
"Should the redirect be 301 or 302?"
→ Tests whether candidate understands browser caching implications

**Follow-up to expose hash knowledge:**
"How do you generate the 7-character hash?"
→ Tests whether candidate knows Base62 vs hash, collision handling, Bloom filters

**Estimation prompt:**
"We expect 100M URL creations per day. Size the system."
→ Tests back-of-envelope: writes/sec, reads/sec (with 10:1 assumption), storage over time, cache sizing

**Scaling prompt:**
"The system is getting 10x more traffic. What breaks first?"
→ Answer: DB writes (ID generator bottleneck), then DB reads (need more replicas/sharding), then cache capacity
