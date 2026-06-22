# 📝 Key Talking Points: API Design & REST Principles

**Goal:** Design APIs that other developers can use without reading the docs — the mark of a clean, senior-level REST architect.

---

## 1. REST Principles — The Foundation 🌐

> **Core Talking Point:** "A good REST API is **consistent, predictable, and easy to use** — another developer can guess the next endpoint without reading documentation."

### The Mental Shift — Think in RESOURCES, not ACTIONS

❌ **Wrong mindset (verbs):**
- `/getApplications`
- `/createApplication`
- `/deleteApplication`

You're describing **actions**.

✅ **Correct mindset (nouns):**
- `/applications/`
- `/applications/123/`
- `/companies/1/applications/`

You're describing a **resource (thing)**.

> **💡 The Golden Rule:** `URL = noun (thing) | HTTP method = verb (action)`
>
> That's it. That's REST.

### 🎨 Real-World Analogy — The Library

Think of an API like a **library 📚**:
- `/books/` → the shelf
- `/books/123/` → a specific book
- You don't say `/getBook` — you just go to the book and decide what to do with it

---

## 2. Naming Conventions — The Style Guide 📏

> **Talking Point:** "I follow strict naming rules so the API is self-documenting. When you learn one endpoint, you can predict all the others."

| Rule | ✅ Good | ❌ Bad |
|------|---------|--------|
| **Plural nouns** | `/applications/` | `/application/` |
| **Hyphens for multi-word** | `/job-applications/` | `/jobApplications/` |
| **Lowercase always** | `/users/123/` | `/Users/123/` |
| **Nested for relationships** | `/companies/1/applications/` | `/getApplicationsByCompany?id=1` |
| **No trailing verbs** | `GET /users/123` | `/users/123/getDetails` |

> **💡 Nested resource rule:** Use nesting when the relationship is natural and meaningful: `/companies/1/applications/` — but stop at 2 levels deep. Deeper than that becomes unwieldy.

---

## 3. HTTP Methods — The Verbs 🛠️

> **Talking Point:** "I never use POST for everything. Each HTTP method has a specific, well-defined purpose — using them correctly is what separates a REST API from just an HTTP API."

| Method | Endpoint | Action | Idempotent? |
|--------|----------|--------|-------------|
| 🟢 **GET** | `/api/applications/` | List all | ✅ Yes |
| 🟡 **POST** | `/api/applications/` | Create new | ❌ No |
| 🔵 **GET** | `/api/applications/123/` | Get one | ✅ Yes |
| 🟠 **PUT** | `/api/applications/123/` | Update (full) | ✅ Yes |
| 🟣 **PATCH** | `/api/applications/123/` | Update (partial) | ✅ Yes |
| 🔴 **DELETE** | `/api/applications/123/` | Delete | ✅ Yes |

> **🧠 PUT vs PATCH:**
>
> - **PUT** = full replacement. You send the entire object. Missing fields become null/default.
> - **PATCH** = partial update. You send only the fields you want to change. Everything else stays the same.
>
> In practice: most APIs use PATCH for updates since clients rarely need to replace the entire resource.

---

## 4. Status Codes — The Language 📡

> **Talking Point:** "Status codes are the API's way of speaking. A client should never have to parse the response body to know if a request succeeded — the status code tells the story."

| Code | Meaning | When to use |
|------|---------|-------------|
| 🟢 **200 OK** | Success | Successful GET, PUT, PATCH |
| 🟢 **201 Created** | Resource created | Successful POST |
| 🟢 **204 No Content** | Success, no body | Successful DELETE |
| 🔴 **400 Bad Request** | Client error | Validation error, malformed request |
| 🔴 **401 Unauthorized** | Not authenticated | Missing or invalid token |
| 🔴 **403 Forbidden** | Not authorized | Authenticated but no permission |
| 🔴 **404 Not Found** | Resource missing | ID doesn't exist |
| 🔴 **429 Too Many Requests** | Rate limited | Client is sending too many requests |
| 💥 **500 Internal Server Error** | Server crashed | Unhandled exception, bug |

> **💡 401 vs 403 — The Common Confusion:**
>
> - **401 Unauthorized** = "I don't know who you are" (not authenticated)
> - **403 Forbidden** = "I know who you are, but you can't do this" (not authorized)
>
> Think: 401 = no ID card. 403 = wrong clearance level.

---

## 5. API Versioning — Protecting Your Users 🔄

> **Talking Point:** "I always version my APIs from day one because business requirements will inevitably change — and we cannot break existing clients."

### The Problem — Why Versioning Exists

```
# You deployed this endpoint and clients are using it:
GET /api/applications/
# Returns: {"id": 1, "status": "pending"}

# Later you rename the field:
# Returns: {"id": 1, "application_status": "pending"}

# 💥 Frontend breaks — the field name changed
```

### 3 Versioning Strategies

**Strategy 1 — URL Versioning (Recommended ✅)**

Put the version in the URL path:
```
/api/v1/applications/
/api/v2/applications/
```
✔ Easy to see, easy to debug, easy to route at infrastructure level (API Gateway, Nginx)

**Strategy 2 — Header Versioning (Pure REST)**

Version in Accept header:
```
Accept: application/vnd.api+json; version=1
```
✔ Keeps URLs clean | ❌ Hard to test in browser, requires Postman/cURL

**Strategy 3 — Query Parameter (Avoid ❌)**

```
/api/applications/?version=1
```
❌ Messy, conflicts with filter params, not cache-friendly

> **🏆 Strong Closing Line:** "I advocate for URL versioning like `/api/v1/` because it's developer-friendly and easy to route at the infrastructure level. I only introduce a new version when there are **breaking changes**, to ensure backward compatibility."

---

## 6. Error Handling — Structured Responses 🛡️

> **Talking Point:** "My strategy revolves around predictability and actionable feedback. A good error response shouldn't say 'Something went wrong' — it should tell the client exactly *what* failed, *why* it failed, and give enough context to fix it."

❌ **Bad error response:**
```json
{
  "error": "Something went wrong"
}
```
Useless. No direction. No clarity.

✅ **Good error response:**
```json
{
  "error": "Application not found",
  "code": "NOT_FOUND",
  "detail": "Application with id 123 does not exist"
}
```

### The 3-Field Error Structure

- **`error`** — Short, human-readable summary
- **`code`** — Machine-readable constant (`NOT_FOUND`, `INVALID_EMAIL`) that the frontend can write `if/else` logic against
- **`detail`** — Exact context of why it failed so the developer can fix it fast

> **💡 DRF Exception Handler:** In Django REST Framework, create a custom exception handler to ensure all errors — including validation errors — return this consistent format globally.

---

## 7. Pagination — Respecting Scale 📄

> **Talking Point:** "Pagination is about respecting the system's resources and the user's time. I always implement pagination for list endpoints — returning massive datasets all at once kills performance."

### Type 1: Page-Based Pagination (Most Common)

**How it works:** Client requests a specific page number with a fixed page size.

```
GET /api/applications/?page=2&page_size=20

# Response:
{
  "count": 100,
  "next": "/api/applications/?page=3",
  "previous": "/api/applications/?page=1",
  "results": [...]
}
```

**DRF setup:**
```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}
```

- ✅ Simple, frontend-friendly
- ❌ Gets slow on very large datasets (database scans from page 1 to find page 10,000)

### Type 2: Limit-Offset Pagination

```
GET /api/applications/?limit=20&offset=40
# Returns items 41-60
```

- ✅ Flexible — client controls how many items to fetch
- ✅ Great for data tables where user controls page size
- ❌ Same slow-offset problem for very large tables

### Type 3: Cursor-Based Pagination (Large / Real-Time Systems)

```
GET /api/applications/?cursor=abc123
# Database jumps directly to the last known item
```

```python
from rest_framework.pagination import CursorPagination

class ApplicationCursorPagination(CursorPagination):
    page_size = 20
    ordering = '-created_at'
```

- ✅ Extremely fast for massive datasets — O(1) lookup
- ✅ No duplicate data if items added while scrolling (infinite scroll)
- ❌ No "jump to page 50" — sequential only

> **🏆 Interview Gold Line:** "I default to page-based pagination for its simplicity and interview-friendly nature. But for data-heavy, infinite-scroll architectures, I switch to cursor-based pagination to ensure consistency and O(1) performance."

---

## 📌 Summary — Key Phrases for Interview

| Concept | Key Phrase |
|---------|------------|
| REST Philosophy | "URL = noun, HTTP method = verb — that's it, that's REST" |
| Naming | "Plural nouns, hyphens, nested only when meaningful" |
| HTTP Methods | "PUT = full replace, PATCH = partial update" |
| Status Codes | "401 = don't know who you are, 403 = know who you are, wrong permissions" |
| Versioning | "URL versioning from day one, new version only for breaking changes" |
| Error Handling | "Structured JSON: error, code, detail — never 'Something went wrong'" |
| Pagination | "Page-based default, cursor-based for large/real-time systems" |

---

*"Whatever you do, do it for the glory of God." — 1 Corinthians 10:31 ✨ Even APIs can carry elegance.*
