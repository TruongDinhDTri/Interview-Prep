# 🚀 Key Talking Points: DevOps & Deployment

**Goal:** Make deployments **reproducible, secure, and observable**. Every layer matters.

Tags: Docker | CI/CD | Security | Monitoring | DevOps | Production

---

## 1. Docker Containers 🐳

**Talking Point:** "I containerize my Django app using Docker and run it with Gunicorn. I structure the Dockerfile to copy `requirements.txt` before source code to leverage Docker's layer cache — so builds are fast even when only the code changes."

**The Core Problem → Solution:** "It works on my machine!" → Docker packages code + Python version + all libraries into one sealed container. Same image runs identically everywhere.

### Production-Ready Dockerfile

```dockerfile
# Production-Ready Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Copy deps FIRST → leverage Docker layer cache ⚡
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# NEVER use runserver in production
CMD ["gunicorn", "myproject.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### Docker Cache — Senior Signal 💡

"I copy `requirements.txt` and run `pip install` BEFORE copying source code — on purpose. If you only change code (not dependencies), Docker skips the pip install layer. Builds that took 2 minutes → now take 10 seconds. ⚡"

**Why this matters:**
- Dependencies rarely change → they stay in the cached layer
- Source code changes frequently → only that layer rebuilds
- Result: dramatically faster CI/CD build times

---

## 2. Environment Variables 🔐

**Talking Point:** "Code = Logic 🧠 | Env Vars = Configuration ⚙️ — keep them strictly separated. Sensitive data like `SECRET_KEY` and `DATABASE_URL` are never hardcoded or committed."

### Never Do This ❌

```python
SECRET_KEY = 'hardcoded-secret'
DEBUG = True
DATABASE_URL = 'postgres://...'
```

### Always Do This ✅

```python
import os
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
```

### The String Trap — Senior Signal 🪤

`os.getenv('DEBUG')` returns a **string**. If you set `DEBUG=False` on the server, Python reads `'False'` — a non-empty string → **always evaluates as `True`**. 🔴

**Fix:** `DEBUG = os.getenv('DEBUG', 'False') == 'True'` — only `True` when string is literally `'True'`.

### Local vs Production Config

| Environment | How Config is Loaded |
|-------------|----------------------|
| **Local Dev** | `python-dotenv` reads from `.env` file |
| **Production** | Platform injects vars directly into OS runtime — **no `.env` file on server** |

---

## 3. Production Settings 🛡️

**Talking Point:** "I build a defense in depth. I disable debug mode, restrict allowed hosts, enforce HTTPS, and enable secure cookie flags. Each setting blocks a different attack vector."

```python
# settings.py — production security block
DEBUG = False
ALLOWED_HOSTS = ['myapp.com', 'www.myapp.com']

SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

| Setting | Attack Blocked | Why It Matters |
|---------|---------------|----------------|
| `DEBUG = False` | Data leaks | `True` exposes full source code + env vars on error pages 🔴 |
| `ALLOWED_HOSTS` | HTTP Host Header attacks | Blocks password reset link poisoning to hacker domains |
| `SECURE_SSL_REDIRECT` | Plain HTTP interception | Forces HTTPS — login creds can't travel in plaintext |
| `SECURE_HSTS_SECONDS` | SSL stripping | Browser knows to use HTTPS before even making the request |
| `SESSION_COOKIE_SECURE` | Session hijacking | Cookies only sent over HTTPS — not interceptable on public WiFi |

---

## 4. Database Migrations in Production 🧬

**Talking Point:** "When touching the database, I never migrate blindly. I use a zero-downtime approach: backup → stage → additive changes → execute → monitor."

### Junior vs Senior Approach

| Approach | What They Do |
|----------|-------------|
| ❌ **Junior** | `python manage.py migrate` straight to production. Rename column immediately. "It'll probably be fine" 🤞 |
| ✅ **Senior** | Backup → Stage → Plan → Execute. Additive changes — add first, remove later. Zero-downtime strategy, tested in staging first. |

### Zero-Downtime Strategy — Renaming a Column

**The 3-Phase Approach (This separates seniors from juniors):**

```
Phase 1: ADD new column
─────────────────────────────────────────
DB:   [first_name] + [full_name]  ← both exist
Code: writes to BOTH columns simultaneously
Users: unaffected ✅

Phase 2: BACKFILL data
─────────────────────────────────────────
Script copies data first_name → full_name
Runs in background, no table lock
Users: unaffected ✅

Phase 3: SWITCH & CLEANUP
─────────────────────────────────────────
Deploy: Code reads ONLY from full_name
Verify: Stable for 1–2 days
Migrate: DROP column first_name
Users: never noticed a thing ✅
```

**Why Table Locks Matter:** When Postgres renames/drops a column, it locks the entire table. On a large table (millions of rows), this lock can hold for *minutes* — all reads and writes fail → users see 500 errors. Additive migrations avoid this entirely.

---

## 5. Static File Serving 📦

**Talking Point:** "For smaller apps, I use WhiteNoise — zero infrastructure overhead. For larger apps, I use `django-storages` with S3 and CloudFront. Django application servers should *never* serve static files in production."

| Option | When | Pros | Cons |
|--------|------|------|------|
| **WhiteNoise** | MVPs, small apps, simple Docker setup | Minimal setup, compression built-in | Still uses server bandwidth |
| **S3 + CloudFront** | Media-heavy, global users, high traffic | Global CDN, Django is completely free | More infra to configure |

---

## 6. Logging & Monitoring 📊

**Talking Point:** "I set up a three-layer observability stack: Django native logging writes errors to file. Sentry gives real-time exception alerts sent to Slack. Datadog tracks API performance to catch bottlenecks proactively."

| Layer | Tool | What It Catches | Mental Model |
|-------|------|----------------|--------------|
| 1️⃣ | **Django LOGGING** | ERROR level events to file — the base safety net | 📜 Historical record |
| 2️⃣ | **Sentry** | Unhandled exceptions → Slack alert instantly, full stack trace + user context | 🚨 Real-time alarm |
| 3️⃣ | **Datadog / New Relic** | API response times, slow queries, CPU spikes — catches *slowness* (not just crashes) | 📊 Health dashboard |

> **Key insight:** Sentry catches crashes — Datadog catches *slowness*. A slow API isn't an exception — no error is thrown — but users still leave. You need both layers.

---

## 7. Deployment Platforms ☁️

**Talking Point:** "Control ↑ → AWS | Speed ↑ → Railway. I choose the right tool for the right moment — not the fanciest one."

| Platform | Control | DevOps Skill | Best For |
|----------|---------|--------------|----------|
| **Railway** 🚄 | Low | Minimal (just Docker) | MVPs, side projects, hackathons |
| **DigitalOcean** 🌊 | Medium | Low | Small/medium startups |
| **AWS EC2 + RDS** ☁️ | Maximum | High | Enterprise, compliance, high traffic |

> **Senior Signal:** "It depends on the stage of the project" — not "X is always best." For early-stage products, Railway lets you focus 100% on product features. When proven demand needs to scale, that's when AWS makes sense.

---

## 8. CI/CD Process (GitHub Actions) 🔁

**Talking Point:** "CI = Test your code 🧪 | CD = Ship your code 🚀 — every push is an automated quality check + deployment. Zero human intervention."

### The 7-Step Pipeline

```
── CI PHASE ──────────────────────────────
1. Push to main       →  Trigger 🔀
2. Run tests (pytest) →  Gatekeeper 🧪
         ↓
   ✅ PASS → CD unlocks
   ❌ FAIL → everything stops, Slack alert fires

── CD PHASE ──────────────────────────────
3. Build Docker image →  Package 🐳
4. Push to registry   →  Store 📦
5. Deploy to prod     →  Ship 🌍
6. Run migrations     →  Sync DB 🗄️
7. Health check       →  Verify ❤️
         ↓
   ✅ 200 OK → "Deploy successful!" 🎉
   ❌ Fails  → abort + Slack alert 🚨
```

### GitHub Actions YAML

```yaml
# .github/workflows/deploy.yml
name: Django CI/CD Pipeline

on:
  push:
    branches: [ "main" ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Tests
        run: pytest

      - name: Build Docker Image
        run: docker build -t myapp:latest .

      - name: Push to Registry
        run: docker push myregistry/myapp:latest

      - name: Deploy + Migrate + Health Check
        run: |
          ssh user@server "
            docker pull myregistry/myapp:latest &&
            docker-compose up -d &&
            docker exec web python manage.py migrate --noinput &&
            curl -f https://myapp.com/api/health/
          "
```

---

## 🚀 The Full Production Stack

**One-Line Mental Model:** "My production setup focuses on **security, stability, and observability** — ensuring the system is reliable, easy to maintain, and proactive about failures rather than reactive."

| Layer | Tool | What It Protects |
|-------|------|-----------------|
| App Runtime | Docker + Gunicorn | Consistency, concurrent requests |
| Config | Environment Variables | No secrets in codebase |
| Security | DEBUG=False, HTTPS, Secure Cookies | Data leaks, attacks, interception |
| Database | Additive migrations + pg_dump backup | Zero downtime, data safety |
| Static Files | WhiteNoise or S3 + CloudFront | Server CPU, global latency |
| Observability | Logging + Sentry + Datadog | Silent failures, slowness detection |
| Deployment | GitHub Actions CI/CD | Human error, broken deploys |

---

## 📌 Quick Reference: Key Phrases for Interview

| Concept | Key Phrase |
|---------|------------|
| Docker | "Copy `requirements.txt` first — leverage layer cache for fast builds" |
| Environment Variables | "Code = Logic, Config = Env Vars — strictly separated, never committed" |
| The String Trap | "`os.getenv('DEBUG', 'False') == 'True'` — strings are always truthy" |
| Production Security | "Defense in depth — each setting blocks a different attack vector" |
| Migrations | "Additive only: add new, backfill, switch, drop old — zero downtime" |
| Static Files | "Gunicorn never serves files in production — WhiteNoise or S3 + CloudFront" |
| Monitoring | "File logs = history, Sentry = alarm, Datadog = performance dashboard" |
| Platform Choice | "Railway for MVPs, AWS for enterprise — depends on stage and scale" |
| CI/CD | "Push → Tests → Build → Push → Deploy → Migrate → Health check" |
| Overall | "Reproducible, secure, and observable deployments" |
