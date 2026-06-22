# 📝 Key Talking Points: Back-of-the-Envelope Estimation

**Goal:** Thực hiện được quick estimation về QPS, storage, latency ngay trong interview — không cần chính xác tuyệt đối, cần đúng order of magnitude và communicate được quá trình suy nghĩ.

---

## Section 1: Power of Two — Nền tảng của mọi estimation

### Tại sao cần biết?
Mọi estimation đều đi qua đây. Bro sẽ cần chuyển đổi bytes ↔ KB ↔ MB ↔ GB ↔ TB trong đầu trong vài giây.

### Bảng cần thuộc lòng

| Power | Giá trị xấp xỉ | Tên | Ký hiệu |
|-------|----------------|-----|---------|
| 2^10 | ~1 Nghìn | 1 Kilobyte | 1 KB |
| 2^20 | ~1 Triệu | 1 Megabyte | 1 MB |
| 2^30 | ~1 Tỷ | 1 Gigabyte | 1 GB |
| 2^40 | ~1 Nghìn tỷ | 1 Terabyte | 1 TB |
| 2^50 | ~1 Triệu tỷ | 1 Petabyte | 1 PB |

### Mental shortcut
- **1 ký tự ASCII = 1 byte**
- **1 tweet (140 chars) ≈ 140 bytes** → xấp xỉ thành 200 bytes cho dễ tính
- **1 ảnh thường = 200KB–2MB** → dùng 1MB cho ước tính
- **1 phút video HD ≈ 150MB**
- **1 UUID = 128 bits = 16 bytes**

---

## Section 2: Latency Numbers — Biết để justify design

### Tại sao cần biết?
Khi bro nói "dùng cache ở đây", interviewer hỏi "tại sao?" — bro cần biết cache nhanh hơn DB **bao nhiêu lần** để justify decision đó.

### Bảng latency (nhớ order of magnitude, không cần chính xác)

| Operation | Latency | Dễ nhớ |
|-----------|---------|--------|
| L1 cache | 0.5 ns | Cực nhanh |
| L2 cache | 7 ns | Rất nhanh |
| RAM (main memory) | 100 ns | Nhanh |
| SSD random read | ~150 µs | Chậm hơn RAM 1,000x |
| HDD disk seek | ~10 ms | Chậm hơn SSD ~100x |
| Read 1MB từ RAM | 250 µs | |
| Read 1MB từ SSD | ~1 ms | |
| Read 1MB từ HDD | ~30 ms | |
| Round trip cùng datacenter | 500 µs | |
| Round trip CA → Netherlands → CA | 150 ms | |

### 4 kết luận quan trọng nhất
1. **Memory nhanh. Disk chậm.** → Luôn cache những gì có thể
2. **Tránh disk seek** nếu được → Dùng memory-first architecture
3. **Compression nhanh** → Nén data trước khi gửi qua network
4. **Cross-continent = 150ms minimum** → Đó là lý do cần CDN cho global users

### Câu hay dùng trong interview
> "Cache hit sẽ là ~1ms, DB query sẽ là ~10ms. Với read:write ratio là 10:1, cache sẽ giảm latency trung bình đáng kể và giảm tải cho DB."

---

## Section 3: Availability & SLA — Nói được "nines"

### SLA là gì?
**Service Level Agreement** — cam kết uptime giữa provider và customer. Đo bằng "số 9".

### Bảng availability (phải thuộc)

| Availability | Downtime/ngày | Downtime/năm | Gọi là |
|-------------|--------------|-------------|--------|
| 99% | 14.4 phút | 3.65 ngày | "Two nines" |
| 99.9% | 1.44 phút | 8.77 giờ | "Three nines" |
| 99.99% | 8.64 giây | 52.6 phút | "Four nines" |
| 99.999% | 864 ms | 5.26 phút | "Five nines" |

### Ứng dụng trong interview
Khi interviewer hỏi "What's the availability requirement?":
- Hỏi lại: "99.9% hay 99.99%? Đây là difference between 8 hours downtime vs 52 minutes per year."
- Design khác nhau: 99.99% cần redundancy mọi component, active-active failover
- 99.9% có thể chấp nhận active-passive với manual failover

---

## Section 4: QPS Estimation — Công thức phải dùng ngay được

### Công thức cốt lõi

```
Average QPS = DAU × số_requests_per_user_per_day ÷ 86,400
Peak QPS    = Average QPS × peak_multiplier (thường 2x–5x)
```

**Tại sao 86,400?** = 24 giờ × 60 phút × 60 giây. Nhớ số này.

### Twitter example (từ Alex Xu)

**Assumptions:**
- 300M monthly active users
- 50% dùng mỗi ngày → DAU = 150M
- Mỗi user post 2 tweets/ngày
- 10% tweets có media

**QPS Calculation:**
```
Tweet QPS = 150M × 2 ÷ 86,400 ≈ 3,500 QPS
Peak QPS  = 3,500 × 2 = ~7,000 QPS
```

**Storage Calculation:**
```
Tweet size: tweet_id (64 bytes) + text (140 bytes) + media (1MB)
Media tweets per day: 150M × 2 × 10% = 30M tweets có media
Daily media storage: 30M × 1MB = 30TB/ngày
5-year storage: 30TB × 365 × 5 = ~55PB
```

### Template cho bất kỳ system nào

```
Step 1: DAU = Monthly Active Users × daily usage rate
Step 2: Requests/day = DAU × requests_per_user
Step 3: Average QPS = Requests/day ÷ 86,400
Step 4: Peak QPS = Average QPS × 2 (hoặc 3–5 nếu có traffic spike rõ ràng)
Step 5: Storage/day = records/day × size_per_record
Step 6: Storage 5 năm = daily × 365 × 5
```

---

## Section 5: Tips quan trọng trong interview

### 1. Làm tròn số táo bạo
Đừng cố tính chính xác. `99,987 ÷ 9.1` → nói "khoảng 100,000 ÷ 10 = 10,000". Interviewer biết bro đang estimate, không thi toán.

### 2. Viết assumptions ra trước
> "Tôi sẽ assume 10M DAU, mỗi user đọc 10 bài và write 1 bài mỗi ngày. Read:write ratio = 10:1."

Điều này cho thấy bro structured và transparent.

### 3. Luôn label units
Đừng nói "5" — nói "5 MB". Không label units là red flag trong interview.

### 4. Sanity check với số thực tế
- Twitter: ~6,000 tweets/giây
- Instagram: ~1,000 photos/giây
- Google: ~99,000 searches/giây

Nếu estimate của bro ra con số gần với thực tế → confidence boost.

### 5. Estimation thường làm khi nào?
**Step 1 của System Design Interview** — sau khi clarify requirements, TRƯỚC khi vẽ architecture. Nó inform design decisions: "With 7,000 peak QPS, a single server can't handle this, we need horizontal scaling."

---

## Interview-Ready Answer

**Q: "Can you estimate the QPS for this system?"**

> "Sure. Let me start with assumptions. If we have 10 million DAU, and each user makes about 10 requests per day, that's 100 million requests per day. Divided by 86,400 seconds, that's roughly 1,150 QPS on average. With a 3x peak multiplier for traffic spikes, peak QPS would be around 3,500. That tells me we'll need multiple application servers with a load balancer, and we should plan for horizontal scaling."

**Key phrases:**
- "Let me start with assumptions..."
- "That's roughly X QPS on average, and with a Yx peak multiplier..."
- "This tells me we need..."

---

## Quick Reference Card

```
86,400 = seconds in a day (quan trọng nhất)
2x–5x = peak multiplier
1 ASCII char = 1 byte
1 photo ≈ 1MB
1 min HD video ≈ 150MB
Cache ≈ 1ms | DB ≈ 10ms | Cross-continent ≈ 150ms
99.9% SLA = 8.77 hours downtime/year
99.99% SLA = 52.6 minutes downtime/year
```
