# ❓ Practice Questions & Answers: Performance & Caching

**How to use:** Read the question → close the file → answer out loud for 2 minutes → compare.

---

## Q1: "How do you optimize Django performance?"

> **❌ Weak Answer:** "I use caching and optimize database queries."

> **✅ Strong Answer:**

"I approach Django performance **systematically, starting from the database up to the infrastructure**. First, I optimize database queries by fixing N+1 issues and fetching only necessary fields. Then, I implement caching with Redis for read-heavy data. I offload long-running tasks to Celery background workers. Finally, I look at infrastructure improvements like CDN for static files and connection pooling."

### 🪜 The 4-Layer Optimization Stack

**Step 1 — 🔍 Measure First (Golden Rule)**

Use **Django Debug Toolbar** in dev, logs/APM tools in prod. Find slow queries, high request times, N+1 problems.

> **Key phrase:** "I always measure before optimizing to avoid guessing."

**Step 2 — 🐘 Database Query Optimization** — 80% of Django performance issues live here

- Fix N+1 with `select_related()` and `prefetch_related()`
- Use `.only('id', 'name')` or `.values()` to avoid loading unused columns
- Never put queries inside loops 🛑
- Add database indexes on frequently queried columns

**Step 3 — ⚡ Caching with Redis** — reduce load for read-heavy data

Cache dashboard stats, user profiles, external API responses. Use `@cache_page` for public endpoints, Cache-Aside pattern for user-specific data.

**Step 4 — 🚀 Async & Background Tasks** — don't block the user

Use **Celery** for CPU-bound/long tasks (email, PDF, image processing). Use **async views** for I/O-bound tasks (external API calls).

**Bonus Step — 🌍 Infrastructure Level**

**CDN** (Cloudflare/S3+CloudFront) for static assets. **PgBouncer** for database connection pooling to reduce PostgreSQL overhead.

> **Gold closing line:** "Before applying any of these, my golden rule is: **Measure, don't guess**. I always profile first to find the actual bottleneck before optimizing."

---

## Q2: "When would you use caching?"

> **❌ Weak Answer:** "I use caching when the data is slow to load."

> **✅ Strong Answer:**

"I use caching primarily for **read-heavy operations** where the data is **expensive to compute** but **doesn't change frequently** — for example, aggregating dashboard statistics or caching external API responses. However, I strictly **avoid caching rapidly changing data** like real-time notifications, or highly sensitive user data without proper isolation."

### ✅ WHEN TO Cache — The Green Light

| # | Scenario | Example |
|---|----------|---------|
| 1️⃣ | 📊 **Expensive computations** | Dashboard stats, COUNT, SUM, AVG aggregations |
| 2️⃣ | 👤 **Frequently accessed data** | User profiles, product listings — rarely change |
| 3️⃣ | 🌐 **Slow external API calls** | Country lists, currency rates, weather data |
| 4️⃣ | 🍪 **Session data** | Login state without DB hit on every request |

### 🚫 WHEN NOT TO Cache — The Red Light

| ❌ Scenario | Why Not |
|------------|---------|
| 📡 **Real-time / rapidly changing data** | Live chat, stock prices — cache becomes stale instantly |
| 🔒 **Sensitive user data (without isolation)** | Cross-user data leaks — security disaster |
| ⚡ **Already fast DB queries** | Cache adds complexity with zero benefit |

> **🏅 Gold Line:** "Cache is a temporary band-aid, not a cure. I only introduce caching *after* I've already optimized my DB queries — like fixing N+1 issues — and the system still needs a boost."

---

## Q3: "Explain your caching strategy"

> **❌ Weak Answer:** "I cache frequently accessed data using Redis with TTL expiration."

> **✅ Strong Answer:**

"My strategy relies on **Redis** for caching hot data, using the **Cache-Aside pattern**. For completely static data, I use **View-level caching** to cache the entire response. For dynamic pages where only certain parts are expensive, I use **Low-level caching** to cache specific data fragments with unique cache keys and a 5-minute timeout."

### The Two Caching Levels

**🧊 Level 1: View-Level Caching — Cache the entire endpoint**

**When to use:** Response is *identical for all users* — public stats page, homepage feed.

```python
from django.views.decorators.cache import cache_page

@cache_page(60 * 5)  # 300 seconds = 5 minutes
def stats_view(request):
    # Expensive aggregation happens here
    return JsonResponse(stats)
```

Django returns the cached response straight from Redis — bypasses view logic entirely. ⚡

**🔑 Level 2: Low-Level Cache-Aside — Cache specific data fragments**

**When to use:** View is user-specific, but only *one expensive piece* needs caching.

```python
from django.core.cache import cache

def get_user_stats(user_id):
    # 1. Unique key per user (prevents cross-user data leaks 🔐)
    cache_key = f'user_stats_{user_id}'

    # 2. Try Redis first
    stats = cache.get(cache_key)

    # 3. Cache Miss → hit the DB, then store
    if stats is None:
        stats = expensive_calculation(user_id)
        cache.set(cache_key, stats, timeout=300)  # 5 min TTL

    # 4. Return (from cache or fresh)
    return stats
```

### ⚠️ Cache Invalidation — The Senior Signal

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

```python
# When user updates their profile → nuke the cache immediately
cache.delete(f'user_stats_{user_id}')
```

### 🔐 Key Isolation — Advanced Senior Signal

> **🚨 Never share cache keys across users!**
>
> ✅ `user_1_profile` → Only user 1's data
> ✅ `user_2_profile` → Only user 2's data
> ❌ `user_profile` → Could leak user 1's data to user 2 🔴

> **✨ Real Example for Interview:** "In my Job Seeker App, I cache per-user dashboard statistics using a unique key like `user_stats_{user_id}` with a 5-minute TTL in Redis. When a user submits a new application, I manually call `cache.delete()` so the next page load reflects the fresh count."

---

## Q4: "How do you handle background tasks?"

> **❌ Weak Answer:** "I use Celery for background tasks."

> **✅ Strong Answer:**

"I handle background tasks by **offloading long-running or CPU-bound operations to Celery**, using **Redis** as a message broker. This ensures the main Django application stays fast and non-blocking. For simpler, strictly I/O-bound tasks, in Django 4.1+, I also utilize **Async Views** to efficiently manage concurrent requests without spinning up a full task queue."

### ❌ The Problem vs ✅ The Fix

❌ **Without Background Tasks:**
```
User Request → send email (30 seconds...) → finally return response 😵
```
User stares at a loading spinner. Server is locked.

✅ **With Celery:**
```
User Request → push task to queue → return response immediately ⚡
```
User gets instant response. Worker handles it quietly.

### The Architecture Flow

```
Django View
    │
    └──► Redis (Message Broker) ──► Celery Worker ──► Execute Task
              (queue)                  (process)
```

### The Code

```python
# tasks.py — define the task
from celery import shared_task

@shared_task
def send_email(user_id):
    # Long-running task: call SendGrid / SES
    return f"Email sent to {user_id}"

# views.py — fire and forget
def register_user(request):
    user = User.objects.create(...)
    send_email.delay(user.id)  # non-blocking ⚡
    return JsonResponse({"message": "Check your inbox soon!"})
```

### Async vs Celery — They Love This Question

| Scenario | Tool | Why |
|----------|------|-----|
| User needs result now, waiting on I/O | `async def` ⚡ | Server multitasks while waiting |
| Heavy/long task, user doesn't wait | Celery 🚀 | Completely offloaded to worker |

> **💡 Senior Signal:** "In production, simply using Celery isn't enough. I implement **retry mechanisms** for transient failures using `bind=True` and `self.retry`. I monitor queues and workers with **Flower** to catch silent failures."

> **✨ Real Example:** "When a user signs up, I save the user immediately and call `send_email.delay(user.id)`. The response returns instantly — the email goes out a second later. The user experience is seamless."

---

## ⚡ Key Phrases to Remember

| Situation | What to Say |
|-----------|------------|
| Performance optimization | "I optimize from DB → Cache → Async → Infra — system thinking, not just code tweaks" |
| N+1 problem | "`select_related` for ForeignKey (SQL JOIN), `prefetch_related` for ManyToMany (2 queries + Python join)" |
| Cache decision | "Read-heavy + expensive + rarely changing → cache. Real-time + sensitive → no cache" |
| Cache invalidation | "TTL for tolerable staleness, manual delete for critical data freshness" |
| Async vs Celery | "Async = I'll come back when it's ready (still in request). Celery = someone else handle it entirely (fire and forget)" |
| Closing performance Q | "Measure first, optimize the whole orchestra — DB, cache, async, infra" |
