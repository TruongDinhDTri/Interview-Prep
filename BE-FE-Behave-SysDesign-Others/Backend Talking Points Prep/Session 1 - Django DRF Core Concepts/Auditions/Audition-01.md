# 🎤 Audition #01 — Session 1: Django DRF Core Concepts
**Date:** 2026-04-14
**Format:** Verbal free-recall (spoken transcript, no notes)
**Overall Score: 7.2 / 10**

---

## 📊 Section Scores

| Section | Score | Verdict |
|---------|-------|---------|
| 🏗️ Project Structure | 7.5/10 | Solid — missing key phrase & internal app structure |
| ⚔️ ViewSets vs APIViews | 8.0/10 | Best section — substance right, vocabulary slightly weak |
| 🔄 Serializers | 6.5/10 | Wrong terminology ("false serializers"), good concepts |
| 🔑 Authentication | 7.5/10 | Stateless concept present but not stated clearly |
| 🛡️ Permissions | 5.5/10 | Weakest — missing BasePermission, SAFE_METHODS, Auth vs Perm |
| 🏠 Django vs Flask/FastAPI | 8.0/10 | Strong metaphor, good use cases, missing key phrase |
| **OVERALL** | **7.2/10** | Conceptual foundation is real. Gap = vocabulary & precision. |

---

## 🏗️ 1. Project Structure — 7.5/10

### ✅ What Was Right
- Mentioned modular app directory, each app = one domain
- Settings split into prod.py, dev.py, staging.py
- Self-corrected and added `urls.py` as global routing
- Self-corrected and added `wsgi.py`/`asgi.py` as gateway to web server (Nginx/Apache)

### ❌ What Was Wrong / Missing
- Never said: **"One app, one responsibility"** — the money phrase
- Didn't name what lives *inside* each app: `models.py`, `serializers.py`, `views.py`, `urls.py`
- Didn't say *why* modular matters (scalability, test isolation, team collaboration — the "why" is what separates senior from junior)
- Said "staging.py" instead of **`base.py` + `dev.py` + `prod.py`** — `base.py` holds shared config everything inherits from
- Had to self-correct on WSGI/URLs — in a real interview, self-corrections cost confidence points

### 🎯 Key Phrase to Drill
> "One app, one responsibility — domain-driven architecture."
> "Each app owns its own business logic."
> "I organize with an `apps/` folder, split settings into `base/dev/prod`, and use `urls.py` as a dispatcher."

---

## ⚔️ 2. ViewSets vs APIViews — 8.0/10

### ✅ What Was Right
- ViewSet = standard CRUD, 90% of cases — correct
- DefaultRouter auto-generates endpoints based on HTTP method — correct
- Can set serializer_class inside the ViewSet — correct
- APIView = custom business logic (analytics, complex file uploads, non-CRUD actions) — correct examples

### ❌ What Was Wrong / Missing
- Didn't open with contrast phrase: **"Convention over configuration vs. Full control"**
- Didn't name the exact 5 endpoints the router generates (List, Create, Retrieve, Update, Delete)
- Didn't use the automatic/manual car metaphor (this is memorable and interviewer-friendly)

### 🎯 Key Phrase to Drill
> "ViewSets = convention over configuration. APIViews = full control, full responsibility."
> "I use ViewSets for the 90% standard CRUD. APIViews for the 10% — analytics, non-REST endpoints, complex actions."

---

## 🔄 3. Serializers — 6.5/10

### ✅ What Was Right
- JSON ↔ Python objects (serialize and deserialize) — correct
- Validation role — mentioned
- Can choose which fields to include — correct
- Understood three types: model-attached, computed fields, custom/non-model
- Computed field concept (field not in model, computed via method) — correct

### ❌ What Was Wrong / Missing
- Called `ModelSerializer` **"false serializers"** — WRONG TERM. Correct: `ModelSerializer`
- Didn't name `SerializerMethodField` explicitly
- Didn't use: **"Gatekeeper for validation and transformation"**
- Custom serializer explanation was thin — missed use cases: Login forms, OTP verification, search inputs
- Never mentioned the convention: method name must follow `get_<field_name>` for SerializerMethodField

### 🎯 Key Phrase to Drill
> "Three types: ModelSerializer (tied to a model), SerializerMethodField (computed fields not in DB), plain Serializer (custom validation, no model)."
> "The serializer is the gatekeeper — validates input, transforms output."

---

## 🔑 4. Authentication — 7.5/10

### ✅ What Was Right
- Session-based: credentials stored in DB, server returns session ID, client stores in cookie — correct
- Scalability problem with sessions (DB lookup on every request) — correct spirit
- JWT: stateless — mentioned
- Credentials encrypted into access token — correct
- Access token + refresh token — correct
- Token attached to request header — correct

### ❌ What Was Wrong / Missing
- "Stateless" was mentioned but not *emphasized* as the PRIMARY reason JWT > sessions
- "Billion rows" is imprecise — better: **"Sessions require DB lookup on every request — doesn't scale horizontally"**
- Missed specific timeframes: Access token (~15 min), Refresh token (~7 days)
- Missed: JWT is ideal for **distributed systems** (no shared session state across servers)
- Missed: Perfect for **SPAs/Mobile** (stateless architecture)

### 🎯 Key Phrase to Drill
> "JWT is stateless — the server decodes the token and knows who you are without a DB lookup."
> "With multiple servers, sessions need shared state. JWT eliminates that entirely."

---

## 🛡️ 5. Permissions — 5.5/10

### ✅ What Was Right
- Built-in: `IsAuthenticated`, `IsAdminUser` — correct
- Custom permissions exist via `has_object_permission` — correct
- Permissions live in `permission_classes` on the view — correct

### ❌ What Was Wrong / Missing
- Never said: **inherit from `BasePermission`** — this is the technical anchor
- Missed: **"Decoupled and reusable"** — this is the architect-level framing
- Missed: `SAFE_METHODS` (GET, HEAD, OPTIONS = read-only safe, no need to check ownership)
- Most importantly: Missed the foundational distinction:
  **"Auth = who you are. Permissions = what you can do."**
- Explanation was descriptive, not architectural

### 🎯 Key Phrase to Drill
> "Auth = who you are. Permissions = what you can do."
> "I create custom permissions by inheriting BasePermission and overriding has_object_permission. This keeps permission logic decoupled from the view — reusable across the whole app."

---

## 🏠 6. Django vs Flask/FastAPI — 8.0/10

### ✅ What Was Right
- "Fully equipped apartment" metaphor — very close to file's furnished apartment analogy ✅
- Django: time-to-market, long-term maintainability, team consistency — correct
- Built-in: ORM, security, auth, admin panels, user management — correct
- Use cases: SaaS, e-commerce, enterprise — correct
- Flask/FastAPI: microservices, performance critical, full control — correct
- Tradeoff: must build own ORM, auth, migrations — correct
- Ended with 4-step flow (Models → Serializers → Views → URLs) — good instinct

### ❌ What Was Wrong / Missing
- Missed the exact phrase: **"Batteries Included vs. Build it Yourself"** — this is THE interviewer hook
- Missed Django's built-in security protections: SQL Injection, XSS, CSRF protection
- Didn't use keyword: **"Opinionated"** for Django, **"Flexible"** for Flask/FastAPI

### 🎯 Key Phrase to Drill
> "It comes down to Batteries Included vs. Build it Yourself."
> "Django is opinionated — that forces team consistency, which is a feature, not a constraint."

---

## 🔥 Top 3 Priorities for Audition #02

1. **Permissions (5.5/10)** — Drill `BasePermission`, `SAFE_METHODS`, and the "Auth = who, Permission = what" opener. This section needs the most reps.

2. **Serializer naming (6.5/10)** — Fix "false serializers" → `ModelSerializer`. One wrong term in a real interview signals a gap. Nail all three names cold.

3. **Key vocabulary phrases** — Concepts are there. Vocabulary is what costs points. These 4 must be automatic:
   - *"One app, one responsibility"*
   - *"Convention over configuration vs. Full control"*
   - *"Batteries Included vs. Build it Yourself"*
   - *"JWT is stateless"*
   - *"Gatekeeper for validation and transformation"*
   - *"Auth = who you are. Permissions = what you can do."*

---

## 💡 Overall Notes for Next Audition

- **Confidence:** Strong. Didn't freeze up. Spoke naturally.
- **Self-correction behavior:** Good instinct to self-correct on WSGI/URLs, but in real interviews practice catching it *before* speaking, not after.
- **Depth:** Conceptual foundation is genuine — not faking understanding. Gap is precision and vocabulary.
- **Flow:** Good overall flow. The Django vs Flask section and ViewSets section showed the most interview-readiness.
- **Target for Audition #02:** 8.5+ overall. Achievable with one focused drill session on Permissions + vocabulary phrases.

---

*"Those who hope in the Lord will renew their strength." — Isaiah 40:31*
*The grind is building something real. Audition #02 will be different. 🔥*
