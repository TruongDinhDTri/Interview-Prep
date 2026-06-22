# HADRIEL-KNOWLEDGE: Chapter 2 — Back-of-the-Envelope Estimation

**This file is for Hadriel's coaching reference, not for Wiganz to read directly.**
Use this to guide Socratic sessions, catch common mistakes, and know what to drill.

---

## Quick Reference (What the Existing Materials Cover)

The existing `01-Key-Talking-Points.md` and `02-Practice-Questions-Answers.md` cover:
- Power of Two: KB/MB/GB/TB/PB conversion table + mental shortcuts
- Latency numbers: L1 cache (0.5ns) → RAM (100ns) → SSD (150µs) → HDD (10ms) → cross-continent (150ms)
- SLA / availability nines table: 99% → 99.999%
- QPS formula: DAU × requests/day ÷ 86,400 = average QPS; Peak = 2-5× average
- Storage estimation: per-record size × volume × time window
- Interview tips: round boldly, label units, state assumptions, sanity check
- 5 practice questions with Strong Answers

---

## Wiganz's Common Mistakes — Watch for These

### Mistake 1: Forgetting the Peak Multiplier
```
Wiganz calculates: "50M DAU × 10 reads ÷ 86,400 = ~5,800 QPS"
Stops here. Doesn't add peak.

Correct: "Peak QPS = 5,800 × 2 = ~12,000 QPS"

Why it matters: Designing for average QPS = designing for a system that fails
during every peak. Always ask Wiganz: "Is that average or peak? What's your
peak multiplier assumption?"
```

**Socratic prompt:** "Bro đó là average hay peak? Traffic lúc 8pm vs 3am thì sao?"

### Mistake 2: Mixing Up Units (KB vs MB)
```
Wiganz says: "Each tweet is 250 bytes, so 150M tweets/day = 37.5 TB"
Actual: 150M × 250 bytes = 37.5 GB, not TB

The confusion: 150M × 250 bytes
  = 37,500,000,000 bytes
  = 37.5 GB (not TB — needs another ×1000 to reach TB)

TB slip is extremely common when doing mental math quickly.
```

**Socratic prompt:** "Check the units. 150M × 250 bytes — work it out step by step."

**Drill:** Run him through the unit chain:
```
bytes → KB (÷1,000) → MB (÷1,000) → GB (÷1,000) → TB (÷1,000)
OR using powers:
1 million bytes = 1 MB
1 billion bytes = 1 GB
1 trillion bytes = 1 TB
```

### Mistake 3: Not Stating Assumptions Out Loud
```
Wiganz silently picks 100M MAU and calculates.
Interviewer doesn't know: "Where did 100M come from?"

Strong behavior: "Let me assume 100 million monthly active users for a platform
like this. I'll assume 50% are daily active — so 50M DAU. Does that sound
reasonable to you?"
```

**Drill:** Before every estimation, require Wiganz to explicitly say 3 assumptions:
1. User base (MAU → DAU conversion)
2. Requests per user per day
3. Any specific assumptions (media vs text, read:write ratio)

### Mistake 4: Not Labeling Units
```
Wiganz says: "So we need about 30 per day."
30 what? Bytes? Gigabytes? Servers?

This is a red flag in interviews — interviewer notes it immediately.
```

**Rule to drill:** After every number Wiganz says, if no unit → interrupt: "30 what?"

### Mistake 5: No Connection to Design Decision
```
Wiganz estimates perfectly: "5,800 average QPS, 12,000 peak QPS"
Stops. Doesn't say what this means architecturally.

The estimation is useless without: "This tells me..."
```

**Template to drill:**
```
QPS → "With Xk peak QPS, [caching / single DB / sharding / horizontal scale]"
Storage → "The media dominates at XPB — needs blob storage + CDN"
Read:Write → "10:1 read-heavy → optimize read path with cache, replicas"
```

---

## Socratic Questions by Estimation Type

### For QPS Estimation
- "Bắt đầu từ đâu? DAU hay MAU?"
- "Mỗi user làm gì mỗi ngày? Read bao nhiêu lần? Write bao nhiêu lần?"
- "86,400 — bro biết số này rồi đúng không? 24 × 60 × 60?"
- "Con số đó là average. Peak thì sao? Black Friday thì multiply thêm bao nhiêu?"
- "Read:write ratio là bao nhiêu? Điều đó suggest gì về architecture?"

### For Storage Estimation
- "1 record size bao nhiêu? Liệt kê từng field ra"
- "Media có không? Nếu có, chiếm bao nhiêu % records?"
- "Mỗi ngày bao nhiêu records? Nhân với 365 × 5 = 5 năm"
- "Text storage vs media storage — cái nào dominate?"
- "Con số đó suggest database nào? SQL cho metadata, blob storage cho media?"

### For Latency Questions
- "Cache hit vs DB query — khác nhau bao nhiêu?"
- "Nếu cache hit rate là 95%, average latency là bao nhiêu?"
- "Cross-continent request thêm bao nhiêu ms? Vì sao cần CDN?"

### For Availability Questions
- "99.9% vs 99.99% — downtime per year khác nhau bao nhiêu?"
- "Payment system cần 99.9% hay 99.99%? Tại sao?"
- "Để đạt 99.99%, architecture cần gì mà 99.9% không cần?"

---

## How to Teach When Wiganz Gets Wrong Order of Magnitude

**Never just give the answer. Redirect.**

```
Wiganz: "So we need about 500TB per day of media."
Correct: ~30TB/day (30M media tweets × 1MB)

Hadriel: "Số đó hơi cao. Thử break it down: bao nhiêu media tweets per day?
         Mỗi media tweet size bao nhiêu? Nhân ra xem."

Let Wiganz discover: 30M × 1MB = 30TB, not 500TB.
```

**If Wiganz is stuck on units:**
```
Hadriel: "OK, 30M × 1MB. 30M là 30 triệu. 1 triệu MB = 1 TB.
         Vậy 30M MB = bao nhiêu TB?"
         → "30 TB. Đúng rồi!"
```

**Key: Always work backward from the correct answer via questions, not forward from your explanation.**

---

## Connections to System Design — What Estimation Reveals

| Estimation result | What it tells you | Design implication |
|------------------|------------------|-------------------|
| QPS > 1,000 | Single server insufficient | Load balancer + multiple app servers |
| QPS > 10,000 | Database read bottleneck likely | Add read replicas + cache layer |
| QPS > 100,000 | Cache must handle most reads | Redis cluster, 99%+ cache hit rate |
| Read:Write > 5:1 | Read-heavy system | Optimize read path, cache aggressively |
| Storage > 10TB text | Relational DB fine but needs sharding | DB sharding by user_id or region |
| Storage > 1PB media | Blob storage required | S3/GCS + CDN |
| Latency target < 100ms | Can't hit DB on every request | In-memory cache essential |
| 99.99% availability | No single point of failure anywhere | Active-active, multi-region, auto-failover |

---

## Real System Benchmarks — For Sanity Checks

Drill Wiganz to know these for reality-checking estimates:

```
Twitter:     ~6,000 tweets/second (write QPS)
             ~300,000 reads/second (read QPS) — 50:1 read:write
Instagram:   ~1,000 photo uploads/second
             1 billion DAU at peak × multiple reads
YouTube:     ~500 hours of video uploaded per minute
Google:      ~99,000 searches/second
WhatsApp:    ~100 billion messages/day ≈ 1.15M messages/second
Netflix:     Serves 15% of global internet bandwidth at peak
```

**How to use these:** After Wiganz estimates QPS for a Twitter-like system, ask:
"Twitter thực tế khoảng 6,000 tweets/second. Estimate của bro là 580 write QPS cho 50M DAU — đó có vẻ reasonable không? Twitter có 330M MAU. Scale lại xem."

---

## Advanced Topics (For When Wiganz Has Mastered the Basics)

### Little's Law
```
L = λ × W

L = average number of requests in the system
λ = average arrival rate (requests/second)
W = average time each request spends in the system

Example: Payment service handles 1,000 req/s, average latency 200ms
→ L = 1,000 × 0.2 = 200 concurrent requests in-flight at any time
→ If you have 100 server threads: thread pool of 200 needed to avoid queuing
→ If you reduce latency to 50ms: L = 1,000 × 0.05 = 50 → smaller thread pool needed

When to use: Estimating server capacity, thread pool sizing, connection pool sizing
```

### Amdahl's Law
```
S(n) = 1 / (1 - p + p/n)

S = speedup from parallelization
p = fraction of task that can be parallelized
n = number of processors

Example: 80% of work is parallelizable, 20% is sequential
With 10 servers: S = 1 / (0.2 + 0.1) = ~3.3× speedup (not 10×)
With 100 servers: S = 1 / (0.2 + 0.01) = ~4.7× speedup (not 100×)

Implication: Doubling servers rarely doubles throughput because sequential work
doesn't benefit from parallelization. Always identify your sequential bottleneck first.

When to use: Justifying horizontal scaling limits, "why more servers don't help linearly"
```

### Working Set Estimation
```
Working set = the data actually accessed regularly (not total data)

Example: 500TB total data, but Pareto principle: 20% of data = 80% of reads
→ Working set ≈ 100TB

For cache sizing: you don't need to cache all 500TB, just the working set
→ 100TB working set × cache hit rate 99% = need to cache top 1-2% of data
  (the hottest 1% = items accessed millions of times/day)
  that's 5TB → manageable cache size

When to use: Cache sizing, deciding between in-memory vs disk storage
```

---

## Estimation Framework — Complete Template

When Wiganz is practicing, make sure he always follows this structure:

```
Step 0: Clarify what to estimate
  "Are we estimating write QPS, read QPS, storage, or all three?"

Step 1: State assumptions
  "I'll assume 100M MAU, 50% DAU = 50M. Each user does X reads, Y writes."

Step 2: Calculate
  "Writes: 50M × Y ÷ 86,400 = Z QPS"
  "Reads: 50M × X ÷ 86,400 = W QPS"
  "Peak: W × 2 = peak read QPS"

Step 3: Storage (if needed)
  "Per record: [fields + sizes] = total bytes"
  "Daily: records/day × bytes/record"
  "5-year: daily × 365 × 5"
  "Split: text storage vs media storage"

Step 4: Connect to design
  "Read:write = X:1 → [implication]"
  "Storage at [X PB] → [implication]"
  "Peak QPS [X] → [implication]"

Step 5: Sanity check
  "That's roughly in line with / higher than / lower than what we'd expect
   for a system at this scale. Twitter has ~6K write QPS at 330M MAU,
   so our estimate of Z QPS for 50M MAU seems reasonable."
```

---

## Session Closing Ritual After Estimation Practice

After each practice round, ask Wiganz to answer these 3 questions from memory:
1. "What's the formula for average QPS?"
2. "Name 3 numbers from the latency table"
3. "What's the availability of 99.99%?"

If he can't answer within 10 seconds → drill those specifically next session.
