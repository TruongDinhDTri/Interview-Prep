# ❓ Practice Questions & Answers: DevOps & Deployment

**Session 6 — DevOps & Deployment**

Read the question → close the file → answer out loud for 2 minutes → compare.

Tags: Docker | CI/CD | Deployment | Production | Interview

---

## Q1: "How do you deploy Django applications?"

> **Weak Answer:** "I use Docker and deploy to a cloud platform, configuring environment variables and running migrations."

### Strong One-Line Mental Model

> "I know how to take an app from local development → to a **secure, scalable, monitored** production system."

### Full Answer

> "I typically deploy Django using **Docker** for environment consistency. I containerize the app with **Gunicorn** as the application server and use **environment variables** for all configuration. In production: `DEBUG=False`, secure cookies, configured allowed hosts. Static files go via **WhiteNoise** or S3 + CloudFront. I deploy to **AWS** or **Railway** depending on scale. Before deploying, I run migrations carefully — tested in staging first for **zero downtime**. And I always set up **Sentry** for error tracking."

### 7-Step Breakdown — Say Each One

**Step 1 — Docker: The Foundation**

"I use Docker to ensure consistency between dev, staging, and production." No "it works on my machine." Same environment everywhere → **portable runtime box** 📦

**Step 2 — Environment Variables: Secrets & Config**

"I manage configs using environment variables via `.env` or cloud secrets." Never hardcode secrets. Different envs → different configs. Config is **external**, not baked into code.

**Step 3 — Production Settings: Security Mode ON**

"I harden Django settings for production." `DEBUG=False`, `SECURE_SSL_REDIRECT=True`, `SESSION_COOKIE_SECURE=True`, HSTS enabled. Protect users. Enforce HTTPS. Prevent leaks. 🔒

**Step 4 — Database Migrations: Handle with Wisdom**

"I run migrations carefully — after backups and staging validation." Backup → Test in staging → Additive changes → Run `migrate`. DB is sacred. Don't rush. ⚠️

**Step 5 — Static Files: Frontend Delivery**

"For static files I use WhiteNoise for small apps, or S3 + CloudFront for scalability." The backend should **never** serve static files in production. 🚫

**Step 6 — Logging & Monitoring: Eyes of the System**

"I set up logging and use Sentry for error tracking." You can't fix what you can't see. 👀 Production errors are **inevitable** — be ready with observability.

**Step 7 — Deployment Platform: Choose Wisely**

"I choose platforms based on complexity and control needed." Railway = fast & simple 🚀. DigitalOcean = balanced ⚖️. AWS EC2 + RDS = full control 🔥.

### Closing Line — Drop This

> "My focus is to make deployments **reproducible, secure, and observable**."

> **Concrete Example:** "For my recent projects, I wrote a `Dockerfile` using `python:3.11`, installed dependencies, and set the entrypoint to Gunicorn. I managed environment variables via `.env` files and hosted on Railway — everything reproducible and secure."

---

## Q2: "Walk me through your CI/CD process."

> **Weak Answer:** "I use GitHub Actions to run tests and deploy automatically when I push to main."

### Strong One-Line Mental Model

> "A robot that tests and ships your code safely every time you push — **zero human intervention**."

### Full Answer

> "My CI/CD pipeline is fully automated using **GitHub Actions**. The **CI phase**: whenever code is pushed to main, it triggers automated tests with `pytest`. If tests pass, the **CD phase** builds a new Docker image, pushes to a container registry, deploys to production, runs database migrations, and performs a health check to verify success."

### The 7-Step Pipeline Flow

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

      # CI PHASE
      - name: Run Tests
        run: pytest

      # CD PHASE
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

### Strong Closing Line

> "My CI/CD pipeline ensures every change is **tested, reproducible, and safely deployed** with minimal manual intervention — eliminating human error during releases entirely."

### Follow-Up: "What if tests fail?"

"The pipeline stops immediately and the deployment is blocked. Only stable, tested code ever reaches production. The team gets notified on Slack so the issue can be fixed before the next merge."

### Follow-Up: "Why run migrations after deploy, not before?"

"Because the new code and the migration need to be in sync. Running migrations before deploy means the DB has columns that old code doesn't know about — which can cause errors. Running after means the new code and the DB schema are consistent from the first request."

---

## Q3: "How do you handle environment configs?"

> **Weak Answer:** "I use environment variables and a `.env` file so secrets aren't hardcoded."

### Strong One-Line Mental Model

> "Config should live **outside** the code — never hardcoded, never committed, never exposed."

### Full Answer

> "I strictly separate code from configuration using **environment variables**. In Django, I use `python-dotenv` to load variables from a `.env` file during local development. Sensitive data like `SECRET_KEY`, database credentials, and API keys are **never hardcoded or committed** to version control. In production, I set variables directly in the hosting platform's environment settings — not a `.env` file. Same codebase. Different config. Zero changes between environments."

### The String Trap — THIS is the Senior Signal

The trap most juniors fall into:

`os.getenv()` always returns a **string**, never a boolean. If you write `DEBUG = os.getenv('DEBUG')` and set `DEBUG=False` on the server... Python reads `'False'` — a non-empty string → **always evaluates as `True`**. Result: `DEBUG = True` in production → full source code + env vars exposed to every user on error pages. 😬

### Bad vs Good Code

**❌ NEVER DO THIS**

```python
# settings.py
SECRET_KEY = 'hardcoded-secret'
DEBUG = True
DATABASE_URL = 'postgres://user:pass@...'
```

**✅ ALWAYS DO THIS**

```python
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
# Critical trick ↓ — the senior signal
DEBUG = os.getenv('DEBUG', 'False') == 'True'
DATABASE_URL = os.getenv('DATABASE_URL')
```

### Local vs Production Config Strategy

| Environment | How Config Is Loaded |
|-------------|----------------------|
| **Local Dev** | `python-dotenv` reads from `.env` file |
| **Staging** | Platform env vars (staging values) |
| **Production** | Platform injects vars directly — no `.env` file |

> **Bonus Senior Signal:** "I also separate settings files per environment — `settings/dev.py`, `settings/prod.py` — for finer control over environment-specific behaviours beyond just secret values."

### Strong Closing Line

> "I keep configuration fully externalized using environment variables to ensure **security, flexibility, and clean separation** from application code."

---

## Q4: "Describe your production setup."

> **Weak Answer:** "I deploy to AWS with Docker, configure security settings, and set up monitoring."

### Strong One-Line Mental Model

> "Production is not just code running — it's a **living system** with layers of security, observability, and automation protecting it."

### Full Answer

> "My production setup focuses on **security, stability, and observability**. I run Dockerized Django with Gunicorn behind Nginx, deployed on AWS EC2 with PostgreSQL on RDS. Static files through CDN (S3 + CloudFront). All configs via environment variables — no hardcoded secrets. `DEBUG=False`, configured `ALLOWED_HOSTS`, HTTPS enforced, secure cookie flags on. Migrations always preceded by backups and designed for **zero downtime**. Sentry for errors, Datadog for performance. Deployment fully automated through CI/CD."

### Full System Architecture

```
🌍 User Request
    ↓
🌐 Nginx (Reverse Proxy — SSL termination, routing)
    ↓
🐳 Django + Gunicorn (inside Docker container)
    ↓
🗄️ PostgreSQL (RDS — managed database)

+──────────────────────────────────────────+
│ 📦 Static & Media  →  CDN (S3 + CF)     │
│ 🔐 Secrets         →  Env Vars          │
│ 📊 Errors          →  Sentry            │
│ 📈 Performance     →  Datadog           │
│ 🔁 Deployment      →  GitHub Actions    │
+──────────────────────────────────────────+
```

### The 3 Pillars — What the Interviewer Wants to Hear

| Pillar | What You Demonstrate | Key Examples |
|--------|---------------------|-------------|
| **Security** 🔐 | You protect the system and users | `DEBUG=False`, HTTPS, secure cookies, ALLOWED_HOSTS |
| **Stability** 🏗️ | You plan for zero downtime | Zero-downtime migrations, staging tests, Docker |
| **Observability** 👀 | You know when things break before users do | Sentry alerts, Datadog performance, file logging |

### Layer-by-Layer Breakdown

#### Layer 1 — App Layer (Docker + Gunicorn + Nginx)

"I run Django inside Docker using Gunicorn as the WSGI server. Nginx sits in front as a reverse proxy — handles SSL, routing, and static files."

> **Never** run `python manage.py runserver` in production. It's single-threaded and not built for real traffic.

#### Layer 2 — Config Layer (Environment Variables)

"All configuration is managed via environment variables — nothing hardcoded." `SECRET_KEY`, `DATABASE_URL`, `API_KEYS` → all from env vars. Same codebase. Different config. Zero changes needed between environments.

#### Layer 3 — Security Layer (Production Settings)

```python
DEBUG = False
ALLOWED_HOSTS = ['myapp.com', 'www.myapp.com']
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

`DEBUG=True` in production = showing your underwear to the internet 😬

#### Layer 4 — Database Layer (PostgreSQL + Zero-Downtime Migrations)

**Zero-Downtime Migration Ritual (renaming a column):**

1. Backup DB (`pg_dump`)
2. Test in staging first
3. Phase 1: Add new column, write to both
4. Phase 2: Backfill data from old to new
5. Phase 3: Switch code to read new column, drop old

Customers keep using the app — they never know you replaced the DB underneath them. ✅

#### Layer 5 — Static Files (WhiteNoise vs S3 + CloudFront)

| Option | When |
|--------|------|
| **WhiteNoise** | MVPs, small apps — minimal setup |
| **S3 + CloudFront** | Global users, high traffic, scalable production |

Django/Gunicorn should **never** serve static files in production. Offload it. 🚫

#### Layer 6 — Observability (Logging + Sentry + Datadog)

| Tool | What It Catches | Mental Model |
|------|----------------|--------------|
| **File Logging** | Historical record of events | 📜 The memory |
| **Sentry** | Real-time exceptions → Slack alert | 🚨 The alarm |
| **Datadog** | Slow APIs, N+1 queries, CPU/RAM | 📊 The dashboard |

"If Sentry isn't set up, users find bugs before you do." 👀

#### Layer 7 — Deployment (CI/CD GitHub Actions)

```
Push → Tests → Build Docker → Push to Registry → Deploy → Migrate → Health Check ✅
```

Zero-touch deployment = zero human error during releases.

### Strong Closing Line

> "My production setup focuses on **scalability, security, and observability** — ensuring the system is reliable, easy to maintain, and proactive about failures rather than reactive."

> **Concrete Example:** "My first priority is security: `DEBUG` is off, `ALLOWED_HOSTS` is locked, all SSL and cookie flags enabled. Static files go through CloudFront. Before any deployment, I back up the database and write backward-compatible migrations. And I always plug in Sentry — if a 500 error happens, I want Slack to ping me **before** a customer even realizes there's an issue."

---

## Key Phrases to Remember

| Situation | What to Say |
|-----------|------------|
| Starting deployment answer | "My focus is reproducible, secure, and observable deployments" |
| Environment variables | "Config is external — never hardcoded, never committed" |
| String trap (senior signal) | "`os.getenv('DEBUG', 'False') == 'True'` — strings are always truthy" |
| CI/CD pipeline | "Push → Tests → Build → Push → Deploy → Migrate → Health check" |
| Zero-downtime migrations | "Add new column → backfill → switch code → drop old column" |
| Static files | "WhiteNoise for small apps, S3 + CloudFront for scale — Gunicorn never serves files" |
| Observability stack | "File logs = history, Sentry = real-time alarm, Datadog = performance dashboard" |
| Production 3 pillars | "Security, stability, observability — proactive, not reactive" |
| Platform choice | "Railway for MVPs, AWS for enterprise — it depends on stage and scale" |
| Health check | "A deployment isn't done until the health check passes — 200 OK or abort" |

> **Timing Drill:** Say the full Q1 answer in under 90 seconds. Hit all 7 steps: Docker → Env Vars → Security → Migrations → Static Files → Monitoring → Platform. Then add the closing line.
