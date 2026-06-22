# ❓ Practice Questions & Answers: API Design & REST Principles

**How to use:** Read the question → close the file → answer out loud for 2 minutes → compare.

---

## Q1: "How do you design a good REST API?"

> **❌ Weak Answer:** "I follow REST conventions and use proper HTTP methods with clear endpoint naming."

> **✅ Strong Opening Line:**

"A good REST API is **consistent, predictable, and easy to use**. It follows RESTful conventions like proper HTTP methods and status codes, uses clear resource naming, and returns structured responses. It should also handle errors consistently, support pagination for large datasets, and be versioned to avoid breaking clients."

### 🧭 1. Consistency — "Don't make people think"

❌ **Inconsistent API (chaos):**
```
GET /getApplications
POST /fetchApp
GET /retrieveApplicationById?id=123
```
Your brain: "WHAT IS THIS SYSTEM 😭"

✅ **Consistent API (predictable):**
```
GET /applications/
GET /applications/123/
POST /applications/
DELETE /applications/123/
```
Learn ONE endpoint → guess ALL others ⚡

### 🧱 2. Resource-Based Design — "Think in THINGS, not ACTIONS"

> **💡 The Mental Shift (THIS IS THE KEY):**
>
> `URL = noun (thing) | HTTP method = verb (action)`
>
> Instead of "What function do I call?" → Think "What **resource** am I working with?"

| Action | Endpoint | Method |
|--------|----------|--------|
| Get all | `/applications/` | **GET** |
| Get one | `/applications/123/` | **GET** |
| Create | `/applications/` | **POST** |
| Update (full) | `/applications/123/` | **PUT** |
| Update (partial) | `/applications/123/` | **PATCH** |
| Delete | `/applications/123/` | **DELETE** |

### 🚦 3. Status Codes — Speak the language

| Code | Meaning | When |
|------|---------|------|
| **200 OK** | Success | GET, PUT, PATCH |
| **201 Created** | Resource created | POST |
| **204 No Content** | Success, no body | DELETE |
| **400 Bad Request** | Validation error | Invalid payload |
| **401 Unauthorized** | Not authenticated | Missing/invalid token |
| **403 Forbidden** | No permission | Authenticated but no access |
| **404 Not Found** | Resource missing | ID doesn't exist |
| **500 Server Error** | Backend bug | Unhandled exception |

### 🎯 Strong Closing Line (Senior Energy)

"Ultimately, a good REST API is one that other developers can use **without needing documentation for every endpoint** — a clear contract between frontend and backend. By strictly adhering to conventions, any developer consuming my API can understand and integrate it rapidly."

---

## Q2: "How do you version your APIs?"

> **❌ Weak Answer:** "I usually use URL versioning like `/api/v1/...` because it's simple."

> **✅ Strong Opening — Frame the problem first:**

"I always version my APIs **from day one** because business requirements will inevitably change, and we cannot break existing clients. My preferred approach is **URL versioning** for its simplicity and visibility."

### 🎯 The Problem Versioning Solves

> **⚠️ Scenario:** You deploy `GET /api/applications/` returning `"status": "pending"`. Clients depend on it. Later, you rename the field to `"application_status"`. **Frontend breaks. 💀**
>
> Versioning = protecting your users from breaking changes.

### 🧱 3 Main Strategies

**Strategy 1 — ✅ URL Versioning (BEST — use this)**
```
/api/v1/applications/
/api/v2/applications/
```
Easy to see, easy to debug, easy to route in Django. Old clients → `v1`. New clients → `v2`. Peace restored.

**Strategy 2 — Header Versioning (Pure REST — mention this for senior signal)**
```
Accept: application/vnd.api+json; version=1
```
Cleaner URLs — resource URLs don't contain versioning. Harder to test in browser. Worth mentioning to show depth.

**Strategy 3 — ❌ Query Parameter (Avoid this)**
```
/api/applications/?version=1
```
Messy. Conflicts with filter params like `?status=pending`. Avoid in interviews.

> **Strong Answer:**
>
> "In a real-world scenario, I advocate for **URL versioning** like `/api/v1/` because it's developer-friendly and easy to route at the infrastructure level — like in an API Gateway. I only introduce a new version when there are **breaking changes**, to ensure backward compatibility."

---

## Q3: "Explain your error handling strategy"

> **❌ Weak Answer:** "I return structured error responses with messages and status codes."

> **✅ Strong Answer:**

"My strategy revolves around **predictability and actionable feedback**. First, I always return the correct HTTP status code. Second, I return a consistent, structured JSON payload that includes a machine-readable error code, a brief summary, and specific details on what went wrong."

### The Error Response Structure

❌ **Bad API error:**
```json
{
  "error": "Something went wrong"
}
```
Useless. No direction. No clarity.

✅ **Good API error:**
```json
{
  "error": "Application not found",
  "code": "NOT_FOUND",
  "detail": "Application with id 123 does not exist"
}
```

### Each Field's Purpose

| Field | Purpose | Example |
|-------|---------|---------|
| `error` | Human-readable summary | "Application not found" |
| `code` | Machine-readable constant for if/else logic | `NOT_FOUND`, `INVALID_EMAIL` |
| `detail` | Exact context — which ID, which field | "Application with id 123 does not exist" |

> **🎯 Gold line:** "A good error response shouldn't just say 'Something went wrong.' It should tell the client exactly *what* failed, *why* it failed, and give enough context to fix it without having to ask the backend team to check server logs."

---

## Q4: "How do you handle pagination?"

> **❌ Weak Answer:** "I use Django's built-in pagination."

> **✅ Strong Answer:**

"I always implement pagination for list endpoints because returning massive datasets all at once **kills performance, spikes memory usage, and ruins user experience**. For standard use cases, I use **Page-based pagination**. For millions of records or infinite-scroll, I switch to **Cursor-based pagination** to ensure queries remain lightning-fast."

### 💥 The Problem Without Pagination

> **📱 The Mental Model:** "Pagination is like scrolling Instagram. You don't load the entire database into the app at once — you load just enough for the screen, then fetch the next chunk when the user continues."

### The 3 Pagination Types

**✅ Page-Based (Offset) — Standard for most apps**

The default, easy to implement. Returns `count`, `next`, `previous`, `results`.

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}
```

**Drawback:** Gets slow if user jumps to page 10,000 — database still scans first 9,999 records.

**Best for:** Admin dashboards, standard list views.

**⚡ Limit + Offset — Flexible for data tables**

```
GET /applications/?limit=20&offset=40
```

Very flexible — frontend controls how many items to see. Great for data tables where user adjusts page size.

```python
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination'
}
```

**🚀 Cursor-Based — Best for large real-time systems**

The absolute best for large, real-time systems. Database jumps directly to the last known item — **no scanning**. Prevents duplicate data if items are added while scrolling.

```python
from rest_framework.pagination import CursorPagination

class CursorPaginationExample(CursorPagination):
    page_size = 20
    ordering = '-created_at'
```

**Best for:** Infinite scroll, large datasets, real-time feeds.

### The Custom Pagination Class (Senior Move 🔥)

```python
from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'   # allow client to control size
    max_page_size = 100                    # protect server ← IMPORTANT
    page_query_param = 'page'

    def get_paginated_response(self, data):
        return Response({
            'meta': {
                'total': self.page.paginator.count,
                'page': self.page.number,
                'page_size': self.page_size,
            },
            'links': {
                'next': self.get_next_link(),
                'prev': self.get_previous_link()
            },
            'data': data
        })
```

> **💥 Note:** This is **production-level API design** — restructured response with `meta` and `links` instead of flat fields.

> **Closing:**
>
> "Ultimately, pagination is about respecting the system's resources and the user's time. I default to **Page-based for its simplicity**, but I always keep **Cursor-based** in my back pocket for data-heavy, infinite-scroll architectures."

---

## ⚡ Key Phrases to Remember

| Situation | What to Say |
|-----------|------------|
| Starting REST API design | "Consistent, predictable — URL is noun, HTTP method is verb" |
| API versioning | "Version from day one — URL versioning is my default for simplicity and visibility" |
| Error handling | "HTTP status code first, then structured JSON with error, code, and detail fields" |
| Pagination choice | "Page-based for simplicity, cursor-based for large real-time systems" |
| Closing any REST question | "A good API is a clear contract — developers use it without reading docs for every endpoint" |

> **⏱️ Timing Drill:** Answer Q1 in under 90 seconds — include: resource-based design, HTTP methods, status codes, versioning mention, pagination mention. Then expand on whichever the interviewer probes.
