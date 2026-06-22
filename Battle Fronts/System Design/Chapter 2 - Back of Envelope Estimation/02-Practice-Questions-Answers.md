# 🎯 Practice Questions & Answers: Back-of-the-Envelope Estimation

**Cách dùng file này:**
1. Đọc câu hỏi → đóng file → tự nói to answer trong 2 phút
2. Mở file, so sánh với Strong Answer
3. Tìm gap và luyện lại phần đó

---

## Q1: "Can you estimate the QPS for a URL shortener like bit.ly?"

**Weak Answer:**
> "Hmm, I think it would be a lot of requests. Maybe like... thousands per second?"

**Strong Answer:**

*Step 1 — State assumptions out loud:*
> "Let me make some assumptions. bit.ly has roughly 100 million monthly active users. I'll assume 50% use it daily, so 50M DAU. Each user shortens 1 URL and clicks about 10 shortened URLs per day."

*Step 2 — Write QPS:*
```
Writes (URL creation): 50M × 1 ÷ 86,400 ≈ 580 write QPS
Reads (URL redirect):  50M × 10 ÷ 86,400 ≈ 5,800 read QPS
Peak read QPS: ~12,000 (2x multiplier)
Read:write ratio = 10:1
```

*Step 3 — Connect to design:*
> "With 10:1 read-to-write ratio, this is clearly read-heavy. I'd optimize the read path with aggressive caching — cache the top 20% of URLs which probably handle 80% of traffic. The write path is lightweight at ~580 QPS."

---

## Q2: "What are the latency implications of your caching decision?"

**Weak Answer:**
> "Cache is fast, so it will be much faster."

**Strong Answer:**
> "Without cache, every redirect hits the database — roughly 10ms query time. With a cache hit, we're looking at sub-millisecond response, around 1ms. If our cache hit rate is 95%, the average response time becomes:
>
> `0.95 × 1ms + 0.05 × 10ms = 0.95 + 0.5 = 1.45ms average`
>
> Compared to 10ms without cache — that's a 7x improvement in average latency. For a URL shortener where the whole point is fast redirects, this matters a lot."

---

## Q3: "How much storage would a Twitter-like system need over 5 years?"

**Weak Answer:**
> "It would need a lot of storage, probably petabytes."

**Strong Answer:**

*State assumptions:*
> "150M DAU, each posts 2 tweets per day, 10% of tweets contain media."

*Text storage:*
```
Per tweet: tweet_id (64 bytes) + text (140 bytes) + metadata (30 bytes) ≈ 250 bytes
Daily text: 150M × 2 × 250 bytes = 75GB/day
5-year text: 75GB × 365 × 5 ≈ 137TB
```

*Media storage:*
```
Media tweets: 150M × 2 × 10% = 30M media tweets/day
Daily media: 30M × 1MB = 30TB/day
5-year media: 30TB × 365 × 5 ≈ 55PB
```

*Connect to design:*
> "The media storage dominates at 55PB — text is trivial by comparison. This tells me I need blob storage like S3 for media, and a CDN to serve it efficiently. The metadata can live in a relational DB since it's only ~137TB over 5 years."

---

## Q4: "What availability do you need for this system, and what does that mean architecturally?"

**Weak Answer:**
> "We need high availability, like 99.99%."

**Strong Answer:**
> "That depends on the use case. For a payment system, I'd target 99.99% — that's about 52 minutes of downtime per year. For a social feed, 99.9% might be acceptable — around 8.77 hours per year.
>
> The architectural implications are significant. 99.99% means no single point of failure — every component needs redundancy. I need active-active load balancers, multi-AZ database with synchronous replication, and automated failover. 
>
> 99.9% is more forgiving — I can use active-passive setup with manual failover for some components and save on cost."

---

## Q5: "Walk me through a back-of-envelope estimation for Instagram's photo storage."

**Strong Answer (full estimation):**

*Assumptions:*
> "500M DAU. Each user uploads 1 photo per day on average. Average photo size after compression: 500KB."

*Daily storage:*
```
500M users × 1 photo × 500KB = 250TB/day
```

*5-year storage:*
```
250TB × 365 × 5 = ~456PB ≈ ~0.5 exabyte
```

*Servers needed:*
```
If 1 storage server holds 20TB → 250TB/day needs 12-13 new servers daily
Over 5 years → thousands of servers
```

*Connect to design:*
> "At this scale, I'd use distributed blob storage like S3 with geographic replication. The CDN becomes critical — we don't want photo reads hitting origin servers. We'd cache popular photos at edge locations, and for older/rarely-accessed photos, move them to cheaper cold storage like Glacier."

---

## Key Phrases to Remember

| Situation | What to say |
|-----------|-------------|
| Starting estimation | "Let me start with some assumptions..." |
| Calculating QPS | "DAU × requests per user ÷ 86,400 seconds..." |
| Adding peak | "With a 2-3x peak multiplier for traffic spikes..." |
| Connecting to design | "This tells me we need..." |
| Sanity checking | "That's roughly in line with what we know about [real system]..." |
| Labeling units | Always say "50 TB per day" not just "50" |

---

## Practice Strategy

**Phase 1 — Số cần thuộc (5 phút):**
- 86,400 = seconds/day
- Peak = 2-3× average
- Cache ≈ 1ms, DB ≈ 10ms, cross-continent ≈ 150ms
- 99.9% SLA = 8.77h downtime/year

**Phase 2 — Drill estimation (mỗi ngày 1 system):**
Tự cho mình 1 system (Facebook, YouTube, Uber...) và estimate:
- DAU → QPS → Peak QPS
- Storage/day → Storage 5 years
- Read:write ratio → caching strategy

**Phase 3 — Say it out loud:**
Đừng chỉ tính trong đầu. Nói to từng bước như đang present với interviewer. Đây là thứ bro thực sự đang bán.
