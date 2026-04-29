# ⚡ Key Talking Points: Performance & Caching

**Goal:** Optimize from DB → Cache → Async → Infra. System thinking, not just code tweaks.

---

## 1. Redis for Caching Hot Data ⚡

> **Interview Line:** "I use Redis as a cache layer to store frequently accessed data like dashboard stats or API responses, reducing database load and improving performance."

> **🧠 Mental Model:**
>
> ```
> Request → Check cache
>     HIT ✅ → Return immediately (fast ⚡)
>     MISS ❌ → Query DB → Store in Redis → Return
> ```

### Approach A — View-Level Caching (All-In-One)

When the endpoint returns **identical data for every user** (e.g., public stats page, homepage feed).

```python
from django.views.decorators.cache import cache_page

@cache_page(60 * 5)  # 5 minutes
def stats_view(request):
    # Expensive aggregation (e.g., counting 1 million rows)
    return JsonResponse(stats)
```

The `@cache_page` decorator intercepts the request *before* it hits your view logic — serves cached JSON straight from Redis. ⚡

### Approach B — Cache-Aside / Low-Level (Surgical Strike)

When the page is personalized, but only **one expensive piece** needs caching.

```python
from django.core.cache import cache

def get_user_stats(user_id):
    cache_key = f'user_stats_{user_id}'  # unique key per user 🔐

    stats = cache.get(cache_key)         # 1. Check Redis first

    if stats is None:                    # 2. Cache miss → hit DB
        stats = expensive_calculation(user_id)
        cache.set(cache_key, stats, timeout=300)  # 3. Store with 5 min TTL

    return stats                         # 4. Return either way
```

> **💡 Redis vs Memcached Senior Flex:** "I prefer Redis because it supports richer data structures — Strings, Lists, Sets, Hashes. And it persists data to disk, so the cache survives a server restart."

---

## 2. What to Cache vs. What NOT to Cache 🚦

> **Interview Line:** "My first question is always: 'What is the business impact if this data is stale for 5 minutes?' If 'none' — cache it. If 'user gets charged twice' or 'data leaks' — go straight to primary DB."

### 🟢 CACHE — Green Light

- 📊 **Dashboard stats** (COUNT, SUM, AVG) — heavy DB, rarely needs to be exact
- 👤 **User profile data** — avatar, display name, updated once a year
- 🌐 **3rd-party API responses** — country lists, currency rates
- 🍪 **Session data** — authentication checks without DB hit

### 🔴 NO CACHE — Red Light

- 📡 **Real-time data** — live notifications, stock prices, live chat
- 🔐 **Sensitive user data** — billing info, security codes (cache key isolation required)
- ⚡ **Already fast queries** — caching adds complexity with zero benefit

### Cache Invalidation — The Hard Part

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

| Method | How | When to Use |
|--------|-----|-------------|
| ⏱️ **TTL expiry** | Cache auto-expires after N seconds | Data that can tolerate slight staleness |
| 🗑️ **Manual delete** | `cache.delete(cache_key)` | Critical data that must be fresh immediately |

---

## 3. N+1 & Database Query Optimization 🐘

> **Interview Line:** "I optimize database queries using `select_related` and `prefetch_related` to avoid N+1 problems, and minimize data fetching with `only()` or `values()`."

### The N+1 Problem — The Library Analogy 📚

> Ask a librarian for 10 books ✅ — one trip. Then ask "who wrote each one?" — the librarian goes back **10 separate times 💀**. That's N+1: 1 trip for the list + N trips for each item.

❌ **N+1 Problem (Bad):**
```python
posts = Post.objects.all()  # 1 query
for post in posts:
    # 1 query PER iteration 💀
    print(post.author.name)
# 100 posts = 101 DB queries 😵
```

✅ **Fixed (1 query total):**
```python
posts = Post.objects.select_related('author')
for post in posts:
    # already loaded, no extra DB hit ✅
    print(post.author.name)
```

### Two ORM Weapons

| Relationship | Tool | Mechanism |
|-------------|------|-----------|
| ForeignKey / OneToOne | `select_related()` | SQL JOIN — 1 query total |
| ManyToMany / Reverse FK | `prefetch_related()` | 2 queries + Python join |

### Fetch Less Data — The Memory Diet

| Method | Returns | Best for |
|--------|---------|----------|
| `only('id', 'name')` | Model instances (partial fields) | When you need model methods |
| `values('id', 'name')` | Plain dictionaries | JSON APIs — skips model instantiation overhead |

> **🛑 The Golden Rule — No Queries Inside Loops:** "My strict rule during code reviews: **no queries inside loops**. A loop with 1,000 items doing 1 query each will take down a server under load."

---

## 4. Async Views (Django 4.1+) ⚡

> **Interview Line:** "I use async views for I/O-bound operations like external API calls, so the server can handle other requests while waiting — instead of blocking the entire worker thread."

> **☕ The Café Analogy:** You don't freeze at the door waiting for coffee. You read a book, chat with someone — then grab it when it arrives. That's exactly what async does for your Django server.

❌ **Sync — Server frozen 😴:**
```python
def my_view(request):
    data = fetch_api()  # frozen 😴
    return JsonResponse(data)
```

✅ **Async — Server stays free ⚡:**
```python
async def my_view(request):
    data = await fetch_external_api()
    return JsonResponse(data)
```

### Async vs Celery — Critical Distinction

| Scenario | Tool |
|----------|------|
| Waiting for I/O (user needs result *now*) | `async def` + `await` ⚡ |
| Heavy/long task (user doesn't need to wait) | Celery `.delay()` 🚀 |

> **⚠️ Common Trap:** "Async makes everything faster" → WRONG. Async only helps when there's *waiting (I/O)* involved. For CPU-heavy work, async makes things *worse* by blocking the event loop.

---

## 5. Background Tasks with Celery 🚀

> **Interview Line:** "I use Celery with Redis to handle background tasks like sending emails or processing data asynchronously, so the main request remains fast."

### The 3 Roles

> **🏗️ Architecture:**
>
> **Django (Producer)** → sends the task
> **Redis (Broker)** → holds the queue
> **Celery Worker (Consumer)** → picks it up and executes
>
> Django drops a 'ticket' into Redis. Workers constantly watch Redis, pick up tickets, and execute tasks in the background.

```python
# tasks.py — worker logic
from celery import shared_task

@shared_task
def send_email(user_id):
    # Long-running task here
    return f"Email sent to {user_id}"
```

```python
# views.py — fire and forget
def register_user(request):
    user = User.objects.create(...)
    # .delay() = non-blocking ⚡
    send_email.delay(user.id)
    return JsonResponse({"message": "Check inbox!"})
```

### Advanced — Retry Mechanism (Senior Signal)

```python
@shared_task(bind=True, max_retries=3)
def send_email(self, user_id):
    try:
        pass  # send logic
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)  # retry after 60s
```

> **💡 Senior Flex:** "In production, simply using Celery isn't enough. I always implement retry mechanisms for transient failures, and use Flower to monitor worker health and queue depth."

---

## 6. CDN for Static Assets 🌍

> **Interview Line:** "I use a CDN to serve static assets from edge servers closer to users, reducing latency. I *never* let my Django application servers serve static files in production."

> **🥖 Bánh Mì Analogy:** You run a bánh mì shop in District 1. If customers keep asking you to hand-deliver napkins and menus across the street — you'd never finish cooking! Put napkin stations all over the neighborhood. That's a CDN.

❌ **Without CDN:**
```
User → Your Django server 😵
```
Server overloaded. Slow for distant users. Gunicorn wastes CPU on images.

✅ **With CDN:**
```
User → CDN edge server ⚡ → fast
```
Django stays focused on business logic. Users in Vietnam get assets from Singapore edge. 🚀

### Typical Setup

| Component | Role |
|-----------|------|
| **django-storages** | Connects Django to cloud storage |
| **AWS S3** | Stores all static/media files |
| **CloudFront / Cloudflare** | CDN layer — caches assets at edge locations globally |

**Flow:** `collectstatic → S3 bucket → CloudFront CDN → Users worldwide ⚡`

---

## 7. Database Connection Pooling (PgBouncer) 🛢️

> **Interview Line:** "I use connection pooling with PgBouncer to reuse database connections instead of opening a new one for every request, which improves performance and scalability."

> **🏰 VIP Club Analogy:** Opening a brand new door for every single guest (request) is exhausting. Instead, hire a bouncer (PgBouncer) to keep a few doors permanently open, ushering guests through quickly.

❌ **Without Pooling:**
```
Request 1 → open connection → query → close 💀
Request 2 → open connection → query → close 💀
Massive overhead per request
```

✅ **With PgBouncer:**
```
Pool of persistent connections ready ⚡
Request → borrow → query → return to pool
Drastically less overhead
```

| Aspect | Detail |
|--------|--------|
| **What** | Lightweight connection pooler for PostgreSQL |
| **Where** | Sits between Django and PostgreSQL |
| **Result** | ⚡ Faster response, 📉 Less DB overhead, 🚀 Better scalability |

---

## ⚡ The Full Performance Stack

> **🎻 The Mic-Drop Answer:** "Ultimately, performance optimization is a **layered defense**. I optimize the ORM to reduce query volume, use Redis to cache expensive reads, offload heavy processing to Celery, and at the infrastructure level, use CDNs and PgBouncer to protect the web server and database from exhaustion. You have to **tune the whole orchestra**, not just one instrument."

| Layer | Tool | What it Solves |
|-------|------|----------------|
| Measure first | Django Debug Toolbar | Find bottleneck before optimizing |
| DB queries | `select_related`, `prefetch_related`, `only()` | N+1 problems, excess data |
| Caching | Redis + Cache-Aside | Expensive aggregate reads |
| Background tasks | Celery + Redis | Non-blocking user experience |
| I/O concurrency | async/await views | External API calls without blocking |
| Static files | CDN (S3 + CloudFront) | Global delivery, free Gunicorn |
| DB connections | PgBouncer | Connection overhead at scale |

---

## 📌 Quick Reference: Key Phrases for Interview

| Concept | Key Phrase |
|---------|------------|
| Performance approach | "I optimize from DB → Cache → Async → Infra — system thinking, not just code tweaks" |
| N+1 fix | "`select_related` for ForeignKey (SQL JOIN), `prefetch_related` for ManyToMany" |
| Redis caching | "Cache-Aside: check cache → miss → query DB → store → return" |
| Cache decision | "Read-heavy + expensive + rarely changing → cache. Real-time + sensitive → no cache" |
| Celery | "Fire and forget: `.delay()` pushes task to Redis, worker picks it up" |
| CDN | "Never let Django serve static files in production" |
| PgBouncer | "Reuse connections instead of opening a new one for every request" |
| Closing line | "Measure first — profile before optimizing, tune the whole orchestra" |
