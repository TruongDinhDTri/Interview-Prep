# The Production-Ready Backend Interview Guide: Django/Python for Remote $3,500+/Month Roles

**TL;DR**
- At the $3,500+/month remote tier, interviewers are explicitly screening for *production fluency*, not framework trivia — they want to hear specific incidents, exit codes, lock behavior, and rollback plans, not definitions of `migrate` or "I use Docker."
- The single biggest separator between candidates who get hired and those who don't is concrete war stories with numbers: "47 minutes of effective downtime because a `RunPython` backfill held an ACCESS EXCLUSIVE lock," "exit code 137 = OOMKilled, we capped Gunicorn workers and added `--max-requests`," "GitHub push protection caught the leaked AWS key but a teammate had pushed with `--no-verify`."
- For every topic below, memorize the *weak vs. solid* contrast and the *production-tell line* — these are the literal sentences that flip an interviewer's mental model from "another tutorial-grad" to "this person has shipped."

---

## How to Use This Guide

For each of the 7 topics you'll find: (1) actual interview questions tagged **HIGH FREQUENCY** (asked in roughly every Django/backend screen) or **NICE TO KNOW** (mid-to-senior differentiators); (2) a *weak* vs. *solid* answer contrast so you can hear the gap; (3) the traps candidates fall into; and (4) the *one line that signals real production experience* — drop one of these naturally and you've changed the interview.

The expected DevOps fluency bar at the $3,500/month remote tier (~$22/hr full-time) actually sits *below* the mid-level floor in Lemon.io's 2026 Django rate data, which states: "Django developer salary in 2026 ranges from $30/hr at mid-level to $80/hr for strong seniors, with the global median for a senior Django engineer sitting at $48/hr." In practice this means you are competing in a tier where employers expect you to *ship like a mid-level* (containerize your own app, own a CI pipeline, read Sentry to find a real bug, articulate zero-downtime migration patterns, store secrets outside the repo, know Gunicorn+Nginx layering, know one cloud — usually AWS — and blue/green or rolling-deploy vocabulary) while pricing you below the global mid-level floor. Kubernetes operator-level skill and Terraform module authoring are *senior* territory and not expected here, but the floor for everything else has risen.

---

## TOPIC 1 — Docker

### Real Interview Questions

- **HIGH FREQUENCY** "Walk me through your Dockerfile for a Django app. Why is each line in that order?"
- **HIGH FREQUENCY** "What's the difference between `CMD` and `ENTRYPOINT`? When would you use each?"
- **HIGH FREQUENCY** "How does Docker layer caching work, and how does it affect your `COPY requirements.txt` placement?"
- **HIGH FREQUENCY** "Your container exits immediately in production. How do you debug it?"
- **HIGH FREQUENCY** "What's a multi-stage build and why would you use one for a Python app?"
- **NICE TO KNOW** "Your container died with exit code 137. What does that mean? How do you fix it?"
- **NICE TO KNOW** "Why should you not run as root inside a container?"
- **NICE TO KNOW** "What does `docker-compose` give you over plain `docker run`, and what are its limits in production?"
- **NICE TO KNOW** "What's the difference between a volume and a bind mount?"

### Weak vs. Solid Answer — "Walk me through your Dockerfile"

**Weak (tutorial-grad):**
> "I use `FROM python:3.11`, then `COPY . .`, then `RUN pip install -r requirements.txt`, then `CMD python manage.py runserver`."

Three red flags in one sentence: full `python:3.11` (huge image), `COPY . .` before installing deps (cache-busts on every code change), `runserver` (dev only, single-threaded, never run in production).

**Solid (production):**
> "I start `FROM python:3.12-slim` for a smaller surface area, set `PYTHONDONTWRITEBYTECODE=1` and `PYTHONUNBUFFERED=1` so logs flush to stdout for Docker to capture. I `COPY requirements.txt` first and `pip install --no-cache-dir` *before* copying source — that way the dependency layer is cached and only invalidates when requirements change. Then I copy source, run `collectstatic`, create a non-root user, and `USER appuser`. The `CMD` is `gunicorn config.wsgi --bind 0.0.0.0:8000 --workers 3 --max-requests 1000 --max-requests-jitter 50` — `--max-requests` recycles workers to bound memory growth from leaks. I use a multi-stage build when I have compiled deps like `psycopg2` or `cryptography` — the builder stage has gcc, the final stage doesn't. DEV Community's 2025 benchmark put Python single-stage images at around 920 MB on average and multi-stage at around 85 MB — about a 91% reduction — and Better Stack documents a comparable 1.2 GB → 150 MB drop for dependency-heavy apps with compiled wheels."

### Common Traps

1. **`COPY . .` before `pip install`** — every code change invalidates the dependency layer. Layer caching exists; use it.
2. **`runserver` in `CMD`** — instant disqualifier. Gunicorn (WSGI) or Uvicorn (ASGI) only.
3. **Running as root** — modern Docker security 101; create `RUN useradd --create-home appuser` and `USER appuser`.
4. **`:latest` tag** in `FROM` or in deployment scripts — non-reproducible builds and impossible rollback. Pin to a digest or semantic version.
5. **No `.dockerignore`** — `.git/`, `__pycache__/`, `.env`, `node_modules/` end up in the build context and sometimes inside the image.
6. **Not understanding Docker exit codes** — exit 0 = clean, exit 1 = generic app error, exit 125 = Docker daemon, exit 126 = command not executable, exit 127 = command not found, exit 137 = SIGKILL (almost always OOM), exit 139 = segfault, exit 143 = SIGTERM (graceful shutdown).
7. **Confusing `EXPOSE` with publishing a port** — `EXPOSE` is documentation only; `-p 8000:8000` (or compose `ports:`) actually publishes.
8. **`docker-compose` in production** — fine for local dev and tiny single-host deployments, but it's not an orchestrator; no rolling updates, no health-driven scheduling, no built-in secrets. For real prod you want ECS, Kubernetes, Nomad, or at minimum systemd + a single-host scheduler.

### One Line That Signals Real Production Experience

> *"When the container died I checked `docker inspect` for `"OOMKilled": true` — turned out our Gunicorn worker count times per-worker memory exceeded the container's memory limit, so the kernel sent SIGKILL and we got exit 137. I dropped worker count from 5 to 3 and added `--max-requests 1000` to recycle workers periodically, and the OOMs stopped."*

(Only someone who has actually had a container die in production reaches for `docker inspect` and knows what `OOMKilled: true` looks like in the JSON output.)

---

## TOPIC 2 — CI/CD

### Real Interview Questions

- **HIGH FREQUENCY** "What's the difference between Continuous Integration, Continuous Delivery, and Continuous Deployment?" (This is a gate question — if you say "they're the same thing" the interview is usually over.)
- **HIGH FREQUENCY** "Walk me through a GitHub Actions workflow for a Django project."
- **HIGH FREQUENCY** "What happens when a test fails in your pipeline? What gets blocked?"
- **HIGH FREQUENCY** "How do you handle secrets in CI?"
- **HIGH FREQUENCY** "Tell me about a time a deployment failed. What did you do?"
- **NICE TO KNOW** "How do you handle flaky tests in CI?"
- **NICE TO KNOW** "What is a deployment artifact and where do you store it?"
- **NICE TO KNOW** "How would you roll back a bad deploy?"
- **NICE TO KNOW** "Why is OIDC preferable to long-lived AWS keys for CI?"

### Weak vs. Solid Answer — CI vs CD distinction

**Weak:**
> "CI/CD means automated testing and deployment. They go together."

That answer tells the interviewer you've heard the buzzword but can't distinguish the three. Almost every senior interviewer asks this exactly to filter.

**Solid:**
> "Continuous Integration is the practice of merging code frequently into `main` with automated build and test on every push — its job is to keep the trunk green. Continuous Delivery extends that: every passing build produces a deployable artifact that *could* go to prod with one button press, but a human gates the release. Continuous Deployment removes the human — every green build on main automatically goes to production. The trade-off is risk vs. velocity: delivery is the right default for most teams because it lets you batch up risky changes for a deploy window or a feature-flag flip; full deployment requires a strong test suite, feature flags, and good observability so a bad deploy auto-rolls-back or gets caught in seconds."

### Weak vs. Solid — "What happens when tests fail?"

**Weak:**
> "The pipeline goes red and I look at the logs."

**Solid:**
> "In our GitHub Actions workflow, a failed test step short-circuits the job — the deploy job has `needs: [test]` so it never runs. The PR gets a red check and is blocked from merging by a required status check on `main`. For flaky tests we don't auto-retry — that hides bugs; instead we quarantine the test, file a ticket, and investigate. We also pin our Postgres/Redis service container versions so we don't get surprised by a base-image bump. The build artifact (a tagged Docker image with the Git SHA) only gets pushed to ECR if every test and lint stage passes — that means we can `docker pull` any green commit's image and roll back in seconds."

### Common Traps

1. **Saying CI/CD is one thing** — interviewers want to hear you can separate the three.
2. **Auto-retrying flaky tests** — hides bugs. Quarantine + investigate.
3. **Secrets in workflow YAML** — must use GitHub Actions Secrets (or org-level secrets, or OIDC). Never paste an AWS key into a `.yml`.
4. **Building image after deploy decision** — image should be built once, tagged with the SHA, promoted across environments. Building per-environment means "works in staging, breaks in prod."
5. **No rollback story** — if you can't articulate "we tag images with git SHA and can re-deploy any previous SHA," you don't sound like you've shipped.
6. **Treating CI as a "tests-only" pipeline** — production CI also runs `python manage.py check --deploy`, `makemigrations --check --dry-run` (fail if anyone forgot to commit a migration), linting (ruff/black), type checks (mypy), and security scans (`pip-audit`, `bandit`, `gitleaks`).

### One Line That Signals Real Production Experience

> *"Our pipeline tags every image with the Git SHA and pushes to ECR, so rollback is just `kubectl set image ...` or re-deploying the previous tag — never a 'git revert and rebuild.' I also added `python manage.py makemigrations --check --dry-run` as a required job so the build fails if someone forgets to commit a migration file."*

(The migrations-commit check in CI is a specific, painful lesson — almost nobody adds it until they've been bitten by a deploy where the model changed but the migration file didn't make the commit.)

---

## TOPIC 3 — Database Migrations

This is the topic where mid-level candidates routinely fail and where production experience is hardest to fake.

### Real Interview Questions

- **HIGH FREQUENCY** "Walk me through how you'd add a new non-nullable column to a 50-million-row table in production."
- **HIGH FREQUENCY** "What's the difference between a schema migration and a data migration? When would you use each?"
- **HIGH FREQUENCY** "Have you ever had a migration cause downtime? Walk me through it."
- **HIGH FREQUENCY** "What's your pre-migration checklist before running migrate in production?"
- **HIGH FREQUENCY** "What does `python manage.py sqlmigrate <app> <migration_number>` give you?"
- **NICE TO KNOW** "What's the expand-contract pattern?"
- **NICE TO KNOW** "How do you roll back a migration that included a `RunPython`?"
- **NICE TO KNOW** "Why can `RunPython` lock a table for the entire migration?"
- **NICE TO KNOW** "What's `SeparateDatabaseAndState` and when would you reach for it?"
- **NICE TO KNOW** "Why is `db_default` preferred over `default` for new not-null columns?"

### Weak vs. Solid Answer — Adding a non-nullable column to a huge table

**Weak:**
> "I add the field to the model, run `makemigrations`, and run `migrate` on production."

This answer ends the interview at any production-serious shop. PostgreSQL's `ALTER TABLE ... ADD COLUMN ... NOT NULL` acquires an `ACCESS EXCLUSIVE` lock — no reads, no writes, until the column is added and backfilled on every row. On a 50M-row table this is many minutes of downtime.

**Solid (the expand-contract pattern):**
> "I do it in at least three deploys. Deploy 1: add the column as nullable with `null=True`, no default — that's a metadata-only change in Postgres 11+ and takes milliseconds. Deploy 2: backfill in batches via a management command or a data migration that uses `update()` in chunks of, say, 5,000 rows in its own transaction each — never a single `UPDATE` over the whole table, and never inside the schema migration itself because Django wraps migrations in a transaction and you'll hold locks the entire time. Deploy 3: once the backfill is verified complete, add the `NOT NULL` constraint. On Postgres I'd use `ALTER TABLE ... ADD CONSTRAINT ... CHECK (col IS NOT NULL) NOT VALID` followed by `VALIDATE CONSTRAINT` — `NOT VALID` skips the full-table scan, and `VALIDATE` only takes a `SHARE UPDATE EXCLUSIVE` lock that allows concurrent reads/writes. Then the next deploy can convert the check constraint into a proper `NOT NULL`. Throughout, the application code stays backward-compatible — old code can write NULL during the migration window. From Django 5+ I'd prefer `db_default` over `default` because `default` is applied by the ORM in Python and would force a rewrite on every row, whereas `db_default` is a real database-level default that doesn't lock the table."

### Pre-Migration Checklist (memorize this)

1. `python manage.py sqlmigrate <app> <num>` — eyeball the actual SQL before it runs.
2. `python manage.py makemigrations --check --dry-run` — fail CI if a model changed without a migration committed.
3. Run on staging with a recent prod-data dump — time it.
4. Snapshot the prod database (or confirm point-in-time recovery is enabled).
5. Check the migration is reversible — every `RunPython` has a reverse function (even if it's `migrations.RunPython.noop`).
6. Apply migrations *before* the new code if the change is purely additive (new nullable column, new table); apply *after* the new code if the change removes something the old code references.
7. Have the rollback command ready: `python manage.py migrate <app> <previous_migration_name>`.

### Common Traps

1. **Combining schema change + data backfill in the same migration** — the table lock is held for the entire backfill.
2. **`RunPython` that imports models directly** — historical models change shape; always use `apps.get_model("app", "Model")`.
3. **`makemigrations` not committed** — the model change ships but the migration file doesn't, prod blows up on startup.
4. **`RunPython` without a reverse function** — you've made the migration irreversible and can't roll back. Always pass `migrations.RunPython.noop` if there's nothing to do.
5. **Renaming a column in one deploy** — old workers running the old code reference the old column name; either two-deploy it (add new, dual-write, deprecate old) or just don't rename — use `db_column='old_name'` and rename the Python attribute only.
6. **Deleting a model in one deploy** — same problem in reverse. Two-phase: stop using it in code, then delete in a later migration.
7. **Atomic migrations on huge index creation** — wrap large `CREATE INDEX` in a non-atomic migration with `atomic = False` and use `CREATE INDEX CONCURRENTLY` (Postgres) via a `RunSQL` so reads/writes continue.

### One Line That Signals Real Production Experience

> *"I once shipped a migration that combined a `RunPython` backfill with an `AlterField` to NOT NULL in the same file — because Django wraps each migration in a transaction, the ACCESS EXCLUSIVE lock queued behind the backfill and effectively froze writes on the orders table for ~45 minutes during business hours. Postmortem outcome: we now split every non-trivial schema change into add-nullable → backfill in a management command in batches → constraint-with-NOT-VALID-then-VALIDATE, and we time every migration on a staging copy of prod data before it ships. We also added a 5-second statement-timeout to our deploy migration runner so a runaway lock kills itself instead of blocking traffic."*

(The numbers, the lock type, the specific fix, and the statement-timeout are all things you only know from being on the wrong side of a real incident. Sentry's own developer docs codify this bar: "Deployment migrations are expected to finish quickly and all statements must complete within 5 seconds.")

---

## TOPIC 4 — Secrets & Environment Variables

### Real Interview Questions

- **HIGH FREQUENCY** "Where do you store your `SECRET_KEY` and database credentials?"
- **HIGH FREQUENCY** "What's the difference between a `.env` file, platform environment variables, and a secrets manager?"
- **HIGH FREQUENCY** "What do you do if you accidentally commit an AWS access key?"
- **HIGH FREQUENCY** "How do you give your CI pipeline access to AWS without storing long-lived keys?"
- **NICE TO KNOW** "Walk me through AWS Secrets Manager vs HashiCorp Vault. When would you pick which?"
- **NICE TO KNOW** "Why is `git rm` insufficient to remove a leaked secret?"
- **NICE TO KNOW** "What's GitHub push protection and how can it fail?"

### Weak vs. Solid Answer — Where do you keep secrets?

**Weak:**
> "I put them in `settings.py` and add `settings.py` to `.gitignore`." or "I have a `.env` file in the repo so the team can use it."

Both are immediate disqualifiers. The first means real secrets live in a tracked file. The second means secrets live in git history, which is effectively forever — `git rm` doesn't remove anything from history, and automated scanners scrape public repos in seconds. Comparitech's honeypot study put a hard number on this: "It took just one minute for attackers to find and start abusing the exposed AWS secret key."

**Solid:**
> "Three layers. Local development: `.env` file that is in `.gitignore`, plus a committed `.env.example` listing variable names but no values, loaded via `django-environ`. CI/CD: pipeline secrets stored in GitHub Actions Secrets (or org-level secrets), injected as environment variables at job time, never logged. Production: actual secrets live in AWS Secrets Manager (or SSM Parameter Store, or HashiCorp Vault depending on the stack), the application's IAM role grants `secretsmanager:GetSecretValue` on just its own secret, and the values are fetched at container startup and exported as env vars to the Django process. The key principle is *identity-based access*: the app proves who it is via its IAM role and gets the secret, instead of a shared long-lived password sitting somewhere. For CI accessing AWS we use OIDC federation — GitHub Actions presents a short-lived OIDC token, assumes a role in AWS, and gets temporary credentials, so there's no long-lived `AWS_ACCESS_KEY_ID` in our secrets at all."

### How Secrets Actually Leak (memorize this list)

1. **Committed `.env`** — most common. Push protection catches it now on GitHub, but a `git push --no-verify` bypasses it.
2. **Hardcoded in source** "just to test."
3. **In Docker images** — `ENV AWS_SECRET_KEY=...` in a `Dockerfile`, then the image is pushed to a public registry.
4. **In CI logs** — secret accidentally echoed in a script; GitHub Actions masks known secrets but not derivatives.
5. **In error pages** — `DEBUG=True` in production exposes settings, environment, traceback locals.
6. **In Sentry / log aggregation** — request bodies and tracebacks captured by error tracking can include passwords, tokens. Configure scrubbing.
7. **In screenshots / Slack / Jira** — non-trivial fraction of real leaks happen here.
8. **Force-pushed git history** — GitHub retains "oops commits"; researchers have built tools that scrape them.

### Common Traps

1. **Thinking `git rm` deletes from history** — it doesn't. Once pushed, treat as compromised; rotate immediately.
2. **Not knowing the rotation playbook** — for an AWS key: revoke in IAM, audit CloudTrail for that principal, rotate any dependent services. AWS auto-applies `AWSCompromisedKeyQuarantine` policy on detected-leaked keys.
3. **Storing secrets in environment variables on a shared host** — visible to any process via `/proc/<pid>/environ` on Linux. For high-sensitivity, secrets manager + fetch-at-startup is better.
4. **One giant secrets blob** — if every developer/service has the same secret, blast radius is huge. Per-service IAM roles + per-service secrets.
5. **Never rotating** — secrets without rotation policy become forever-credentials.

### One Line That Signals Real Production Experience

> *"We had an AWS access key end up in a commit — GitHub push protection caught it, but a teammate had pushed with `--no-verify`. Within minutes AWS auto-applied the `AWSCompromisedKeyQuarantine` policy, we rotated the key, audited CloudTrail for everything the IAM principal had touched, and moved that workload to OIDC-federated short-lived credentials. We then made push protection org-required and removed the per-user bypass."*

(Specific: knows push protection exists, knows it can be bypassed, knows AWS's automatic quarantine, knows the CloudTrail audit step, knows OIDC federation is the structural fix. As an industry anchor: in May 2026, a Nightwing contractor's public "Private-CISA" GitHub repo exposed admin credentials to three AWS GovCloud accounts plus plaintext browser passwords in a file literally named `AWS-Workspace-Firefox-Passwords.csv`; GitGuardian's Guillaume Valadon, who discovered it, called it "the worst leak that I've witnessed in my career," and the exposed AWS keys were reported to still be valid 48 hours after the repo was taken down. Referencing this recent incident in an interview signals you're paying attention to industry security news.)

---

## TOPIC 5 — Logging & Monitoring

### Real Interview Questions

- **HIGH FREQUENCY** "Production has a bug a user is reporting but you can't reproduce locally. Walk me through how you debug it."
- **HIGH FREQUENCY** "How is Sentry different from regular logging?"
- **HIGH FREQUENCY** "What's structured logging? Why would you use JSON logs over plain text?"
- **HIGH FREQUENCY** "How would you investigate a sudden spike in 5xx errors?"
- **NICE TO KNOW** "What's the difference between logs, metrics, and traces?"
- **NICE TO KNOW** "What's a Sentry breadcrumb?"
- **NICE TO KNOW** "How do you keep Sentry costs under control?"
- **NICE TO KNOW** "What's the RED method? The USE method?"

### Weak vs. Solid Answer — "Production has a bug, how do you debug?"

**Weak:**
> "I check the logs and try to reproduce locally."

**Solid:**
> "First I look at Sentry for the issue — it groups duplicate exceptions, so I can see frequency, first-seen and last-seen timestamps, which release it appeared in, affected users, and the breadcrumbs leading up to the exception (the previous SQL queries, the last few HTTP requests, log statements). If the exception started after a specific release, that's usually the smoking gun and I look at the diff. If it's not in Sentry, I go to the structured logs in CloudWatch / Loki / wherever — because they're JSON I can filter by `request_id`, `user_id`, `endpoint`, and trace the user's request through every service. If we have distributed tracing, I'd pull up the trace ID from the Sentry event to see exactly which downstream call was slow or errored. Last resort: replicate prod state in staging with a redacted DB dump. The thing I would *not* do is grep raw text logs hoping for a needle in a haystack — that's a sign the logs aren't structured well, and the fix is to invest in JSON logging plus a request-ID middleware, not to grep harder."

### Sentry Integration — the Production-Sensible Version

```python
# settings.py
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.celery import CeleryIntegration

sentry_sdk.init(
    dsn=env("SENTRY_DSN"),
    integrations=[DjangoIntegration(), CeleryIntegration()],
    environment=env("ENV"),                      # 'production' / 'staging'
    release=env("GIT_SHA"),                       # ties errors to a deploy
    traces_sample_rate=0.1,                        # 10% performance traces, not 100%
    profiles_sample_rate=0.1,
    send_default_pii=False,                       # GDPR — be deliberate
    before_send=scrub_sensitive_data,             # custom scrubber for tokens/etc.
)
```

The release tag is the highest-leverage move — without it, when Sentry tells you an error spiked, you don't know which deploy introduced it. With it, every Sentry issue links to a specific commit and you can see "first seen in release abc123" instantly.

### Structured Logging (the actually-useful version)

Plain text: `[2026-05-21 14:22:01] ERROR Payment failed for order` — ungreppable, can't filter by user, can't aggregate.

Structured JSON via `structlog` or `python-json-logger`:
```json
{"ts":"2026-05-21T14:22:01Z","level":"error","event":"payment_failed",
 "order_id":12345,"user_id":678,"request_id":"abc-123","amount":42.99,
 "gateway":"stripe","error_code":"card_declined"}
```
Now you can query: "all `payment_failed` events for `gateway=stripe` in the last hour" in Loki/Datadog/CloudWatch Insights, build a dashboard, alert on it.

### Common Traps

1. **`traces_sample_rate=1.0` in production** — sends every request to Sentry as a transaction, burns through quota in days, costs a fortune.
2. **Not setting `release`** — every error looks like it could be from any deploy.
3. **`send_default_pii=True` without thought** — sends user emails, IPs, tokens. GDPR/SOC2 problems.
4. **Sentry alerting on /health endpoints** — health checks fail occasionally, you get woken up at 3am. Filter them out via `traces_sampler`.
5. **Plain-text logs in production** — un-queryable.
6. **Logging the entire request body** — passwords, card numbers, tokens end up in logs.
7. **Conflating logs / metrics / traces** — logs are events ("payment failed for order 1234"), metrics are numbers over time ("p99 latency = 230ms"), traces follow one request across services. They answer different questions; an interviewer asking "what's the difference?" wants to hear you don't lump them.

### One Line That Signals Real Production Experience

> *"After we shipped release `abc123` we got a Sentry alert spike — the release tag immediately told me which commit, the breadcrumbs showed every failing request had the same feature flag enabled, and the trace pointed at an N+1 in a `prefetch_related` we missed. We flipped the flag off in seconds, rolled the deploy back in minutes, and shipped the fix the next day. We also dropped `traces_sample_rate` from 1.0 to 0.1 because we were burning Sentry quota on `/health` and `/metrics`."*

(Knows about release tracking, breadcrumbs, feature flags as a faster rollback than redeploying, sampling, and noisy-endpoint filtering — all things you only learn after running Sentry in production for a while.)

---

## TOPIC 6 — Django Security Settings

### Real Interview Questions

- **HIGH FREQUENCY** "What changes do you make to `settings.py` before going to production?" (universal screening question)
- **HIGH FREQUENCY** "Why is `DEBUG=True` dangerous in production? What does it actually expose?"
- **HIGH FREQUENCY** "What does `ALLOWED_HOSTS` do? Why is `ALLOWED_HOSTS=['*']` bad?"
- **HIGH FREQUENCY** "How does Django protect against CSRF? Where could that protection fail?"
- **HIGH FREQUENCY** "How does Django prevent SQL injection? Where can a developer break it?"
- **NICE TO KNOW** "What does `SECURE_HSTS_SECONDS` do, and why should you start with a small value?"
- **NICE TO KNOW** "Why is `SECURE_PROXY_SSL_HEADER` something to set carefully?"
- **NICE TO KNOW** "What does `python manage.py check --deploy` do?"

### Weak vs. Solid Answer — "What do you change before going to production?"

**Weak:**
> "I set `DEBUG=False` and put the domain in `ALLOWED_HOSTS`."

Technically correct but bare minimum. Solid candidates rattle off the deployment checklist *and* explain *what each setting prevents*.

**Solid:**
> "First, `DEBUG=False` — with `DEBUG=True` Django renders a yellow error page on any unhandled exception that leaks the entire settings module (excluding values that match `SECRET|PASS|TOKEN`), the SQL queries it ran, the local variables in every frame, the installed apps — it's essentially a roadmap for an attacker. Second, `ALLOWED_HOSTS = ['mydomain.com', 'www.mydomain.com']` from an env var — never `['*']`, because that disables Host header injection protection, which Django uses to validate password-reset links. Third, `SECRET_KEY` from environment, never the default. Fourth, the HTTPS bundle: `SECURE_SSL_REDIRECT=True`, `SESSION_COOKIE_SECURE=True`, `CSRF_COOKIE_SECURE=True`, `SECURE_HSTS_SECONDS=31536000` with `SECURE_HSTS_INCLUDE_SUBDOMAINS=True` and `SECURE_HSTS_PRELOAD=True` — but I start HSTS at 300 seconds and ramp it up, because HSTS is sticky in browsers and a bad rollout can lock users out of HTTP for a year. Fifth, `X_FRAME_OPTIONS='DENY'` for clickjacking and `SECURE_CONTENT_TYPE_NOSNIFF=True`. Sixth, if Django is behind a load balancer that terminates TLS, `SECURE_PROXY_SSL_HEADER=('HTTP_X_FORWARDED_PROTO','https')` so `request.is_secure()` works — but only if the LB strips that header from client requests, otherwise an attacker can forge it. And I run `python manage.py check --deploy` in CI so a missing setting fails the build."

### Common Traps

1. **`ALLOWED_HOSTS = ['*']`** in production — disables Host header validation. Same severity as `DEBUG=True`.
2. **`SECURE_SSL_REDIRECT=True` behind Cloudflare** that already redirects — double-redirect, wastes a roundtrip and breaks some health checks. Set it to False there.
3. **`SECURE_HSTS_PRELOAD=True` from day one with a 1-year duration** — HSTS is sticky; once a browser caches it, you can't go back to HTTP for that duration. Ramp up.
4. **`SECURE_PROXY_SSL_HEADER` without the proxy stripping it** — attacker sets `X-Forwarded-Proto: https` in their request, Django thinks it's secure, you've made yourself vulnerable. Only set if your LB strips the header before forwarding.
5. **Using `.raw()` or `.extra()` with string formatting** — that's how you break Django's SQLi protection. Always parameterize: `Model.objects.raw("SELECT * FROM t WHERE id = %s", [user_id])`.
6. **CSRF: putting `@csrf_exempt` on an endpoint that takes side effects** — common shortcut for "make the AJAX call work" that's actually a CSRF hole. Use the CSRF token properly or move it to a session-authenticated DRF endpoint with `SessionAuthentication`.
7. **Not running `manage.py check --deploy`** — it tells you exactly what you're missing.
8. **Not upgrading Django** — almost every Django security release patches a CVE; running an EOL version of Django is itself a security misconfiguration.

### One Line That Signals Real Production Experience

> *"When I joined this team I ran `manage.py check --deploy` on the staging settings and it lit up — `DEBUG=True`, `ALLOWED_HOSTS=['*']`, no HSTS. I moved config to `django-environ`, put secrets in AWS Secrets Manager, set HSTS to 300 seconds first and ramped it to a year over a month, and added `check --deploy` as a required CI job so DEBUG can't slip into a prod build. We caught two pull requests that would have re-enabled it within the first month."*

(Knows `check --deploy` exists, knows HSTS needs to be ramped, knows to make this enforceable in CI rather than relying on discipline.)

---

## TOPIC 7 — Deployment

### Real Interview Questions

- **HIGH FREQUENCY** "How do you deploy your Django app?" (the universal opening question of every senior interview)
- **HIGH FREQUENCY** "Describe what happens between `git push` and the user seeing the change."
- **HIGH FREQUENCY** "What's the difference between blue-green and rolling deployment?"
- **HIGH FREQUENCY** "How do you do a zero-downtime deploy?"
- **HIGH FREQUENCY** "How would you roll back a bad deploy?"
- **HIGH FREQUENCY** "How would you choose between Heroku/Railway/Render/Fly.io vs Docker-on-a-VPS vs AWS ECS/EKS?"
- **HIGH FREQUENCY** "Why Gunicorn and not `runserver`? How many workers?"
- **NICE TO KNOW** "Static files — where do they live and who serves them?"
- **NICE TO KNOW** "What's a canary deploy and when would you reach for it?"
- **NICE TO KNOW** "How do you decide between WSGI and ASGI?"

### Weak vs. Solid Answer — "How do you deploy your app?"

**Weak:**
> "I push to GitHub and Heroku/Railway deploys it." (Stops there. Couldn't go deeper if pressed.)

**Solid:**
> "Depends on the stage. For a side project or MVP, Railway or Render — git push, managed Postgres, managed Redis, automatic SSL, $5–$25/month, zero ops time. The trade-off is vendor lock-in and the per-service price scales painfully past a few services.
>
> For my current production app I use AWS ECS Fargate behind an ALB. The flow: push to `main` triggers a GitHub Actions workflow that runs tests, runs `manage.py check --deploy` and `makemigrations --check`, builds a Docker image, tags it with the Git SHA, pushes to ECR. Then a deploy job: register a new ECS task definition pointing at the new image, update the service, ECS does a rolling deploy — spin up new tasks, wait for them to pass the ALB health check at `/health/`, drain connections from old tasks, kill them. Migrations run in a separate one-off ECS task *before* the new service tasks come up, so the DB is in the new state before any new code reads it — and migrations are always backward-compatible with the previous code release so old tasks keep working during the rolling phase.
>
> For rollback: re-deploy the previous Git SHA's image, which is one CLI command and finishes in ~90 seconds. If the migration was destructive we'd need a forward-fix rather than a rollback — which is why we use the expand-contract pattern and don't ship destructive schema changes alongside code changes.
>
> Static files go to S3 with `django-storages` + CloudFront — Django never serves them. For smaller deployments WhiteNoise plus Gunicorn is fine. I run Gunicorn with `--workers (2*CPU_cores+1)` as a starting point and tune from there based on the request mix; for I/O-heavy endpoints I'd switch to Uvicorn with async views."

### Platform Choice — Decision Framework

| Use case | Pick | Why |
|---|---|---|
| Side project / MVP / "want to ship today" | Railway or Render | Git-push deploy, managed Postgres, predictable pricing |
| EU data residency, low ops budget | Hetzner VPS + Coolify / Dokku | Cheap, full control, GDPR-clean |
| Need global low latency | Fly.io | Edge regions, Firecracker microVMs |
| Standard production app, AWS shop | ECS Fargate or App Runner | Managed containers, IAM, ALB, fits with RDS |
| Heavy scale, complex networking, multiple teams | EKS (Kubernetes) | Power tool — only when you have a platform team |
| Tiny budget, total control | Docker + docker-compose on a VPS (DigitalOcean / Hetzner) | $5–$20/mo, you wear the ops hat |

The trap is picking Kubernetes because it's resume-bait when you have one app and one engineer. The opposite trap is staying on Heroku-likes long after their pricing or limits stop fitting; have a migration path.

### Blue-Green vs. Rolling — the Two-Sentence Version

- **Rolling**: replace instances one batch at a time on the same infrastructure. Old and new versions coexist briefly; cheap; rollback is slow (another rolling deploy in reverse). The default for Kubernetes/ECS.
- **Blue-Green**: two identical full environments; deploy to idle one, validate, flip the load balancer. Double the infrastructure cost; rollback is one traffic switch. The default when releases are big/risky or schema changes are destructive.

The trap is treating "blue-green" as magic that solves migrations. It doesn't — a destructive schema change still breaks the blue environment after the cutover, so you need the same expand-contract discipline regardless.

### Common Traps

1. **"I use `runserver` on the server"** — instant disqualifier. Gunicorn (WSGI) or Uvicorn (ASGI) behind Nginx or an ALB.
2. **No mention of static files** — interviewer is waiting to hear S3+CDN or WhiteNoise. "I run `collectstatic` and Nginx serves them" is solid; not knowing what `collectstatic` does is not.
3. **No health check endpoint** — your load balancer needs `/health/` returning 200 (and ideally checking DB + cache) to know when to route to a new container.
4. **Conflating WSGI and ASGI** — Django supports both; WSGI (Gunicorn) is fine for 95% of apps. Reach for ASGI (Uvicorn/Daphne) when you have websockets, server-sent events, or many slow upstream calls per request you want to handle concurrently in one worker.
5. **No rollback story** — "we'd revert the PR and redeploy" takes 10+ minutes. "We re-deploy the previous image tag" takes under 2.
6. **"We just deploy on Fridays at 5pm"** — interviewers laugh, sometimes hire anyway, sometimes not.
7. **Not separating migration deploy from code deploy** — the source of most "zero downtime" failures.

### One Line That Signals Real Production Experience

> *"Our first blue-green deploy failed because the new code expected a column the migration hadn't applied yet — we'd put the migration in the same release as the code change. Postmortem: we split migrations into a pre-deploy phase that runs before traffic shifts, made all code changes backward-compatible with the previous release for one cycle, and added a smoke test step that runs `manage.py migrate --check` and `collectstatic --dry-run` plus hits `/health/` on the new color before the load balancer flip. We haven't had a deploy-induced outage since."*

(Specific failure mode, specific fix, mentions `--check` and `--dry-run` and `/health/` — all things you only string together after you've broken production.)

---

## Cross-Cutting Patterns: Why Candidates Fail These Interviews

From hiring-manager blogs and code-review postmortems across multiple Django shops, the common red flags that immediately downgrade a candidate:

1. **No specific stories.** "I've used Docker" with no story. "I've done migrations" with no incident. Stories are memorable, buzzwords are forgettable. If you can't name a specific bug, file, error code, or row count, the interviewer assumes you read about it instead of doing it.
2. **No numbers.** "It was slow" → solid candidates say "P95 was 1.2 seconds, we got it to 180ms by adding `select_related` and an index on `(user_id, created_at)`."
3. **Tools over outcomes.** "We used Kubernetes and Sentry and Datadog" doesn't tell the interviewer what *you* did. Replace tool names with verbs and outcomes.
4. **Vague about own role.** When asked what you specifically built on a team project, "we did X" is a red flag. "I owned X" is what's being listened for.
5. **Can't read an error.** "Exit code 137? Not sure, I just restart the container" — fail. "OOMKilled, check memory limits" — pass.
6. **No mental model of failure.** "What happens when X fails?" — if you've only built the happy path, you've only built half the system.

## Recommendations — Staged Action Plan

**Week 1 — Mechanical fluency**
- Write a Dockerfile from scratch for a Django app without copying. Run it. Break it. Read every exit code.
- Set up a GitHub Actions workflow with test → build → push-image stages on a personal project.
- Configure Sentry on a personal project. Trigger a deliberate exception. Look at the breadcrumbs.

**Week 2 — Production fluency**
- Build a Django app with a model. Add a `null=True` field, backfill via management command, then make it `NOT NULL` — three deploys. Time each migration on 100k+ rows.
- Move all settings to `django-environ`. Add a `.env.example`. Make sure `python manage.py check --deploy` passes.
- Deploy the same app to two platforms (e.g., Railway *and* a Hetzner VPS with docker-compose). Compare cost, deploy time, rollback flow.

**Week 3 — Interview rehearsal**
- Pick three of your projects. For each, write down: one Docker story, one migration story, one logging/Sentry story, one secret/config story, one deploy/incident story.
- Time yourself answering each "How do you deploy?" / "Tell me about a migration that went wrong" question in 90 seconds. If you can't compress it that tight, you'll ramble in the interview.
- Memorize the production-tell lines from each section above and find a way to drop one naturally in your own words — the *content* of the line matters more than the exact phrasing.

**Benchmarks that change the recommendation**
- If you're getting offers below $3,500 but with senior responsibilities → raise rate, the demand is there.
- If you're getting screen-stage rejections → you're failing the "tell me about a real production incident" question. Build something, break it, fix it, write it up.
- If you're getting final-round rejections → it's usually fit, communication, or async/written work; rate practice is interviewing in English with someone who'll give honest feedback.

## Caveats

- Question frequency varies by company stage: early-stage startups care more about velocity and full-stack scope than blue-green vocabulary; scale-ups care intensely about migrations and observability; agencies care most about Docker portability and deployment automation. Calibrate which topic to lean into based on the role.
- Sources for the question lists above are aggregated from public interview question repositories (InterviewBit, Adaface, Final Round AI, Hirist), engineering blogs (PostHog handbook, Sentry developer docs, Vinta Software, Buildsmart Engineering), and reported interview experiences (DEV.to retros, Glassdoor, hiring-manager guides at Digiqt, Full Scale, and Soft Suave). Aggregator-site "model answers" are generic and were *not* used as a basis for the solid answers — those were synthesized from first-party engineering writing and real incident postmortems.
- The "production tells" are explicitly written to *sound* like real war stories. Don't recite them verbatim — adapt them to your actual projects. An interviewer who senses memorization is worse than an interviewer who senses inexperience.
- Salary calibration is current as of mid-2026 per Lemon.io's Django rate calculator: the global mid-level Django rate sits at $30/hr+ and senior median at $48/hr, so $3,500/month (~$22/hr) is actually below Lemon.io's stated mid-level floor. The implication for candidates targeting this range: you may be competing in a buyer's-market segment where employers expect mid-level *output* at junior pricing, which is exactly why nailing the "production fluency" signal matters more than your years-of-experience number.
- The CISA AWS GovCloud key leak (May 2026) and the Comparitech honeypot study (AWS keys exploited "in just one minute") are strong, citable anchors for any secrets-management story — referencing them shows you read current industry security writing, which itself is a signal interviewers pick up on.