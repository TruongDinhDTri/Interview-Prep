
# PART 1: PRACTICE ANSWERING

## Q1: "How do you design database schema?"
### ✨ 🗣️ YOUR INTERVIEW ANSWER (Clean + Strong)

> “A good REST API is consistent, predictable, and easy to use.  
> It follows RESTful conventions like proper HTTP methods and status codes, uses clear resource naming, and returns structured responses.  
> It should also handle errors consistently, support pagination for large datasets, and be versioned to avoid breaking clients.”

### 🧭 1. Consistency — “Don’t make people think”

Imagine you’re using someone else’s API…

You try this:

`GET /applications/`

Cool, it works 👍

Then you guess:

`GET /applications/123/`

Boom — also works ✅

👉 Your brain goes:

> “Ahhh I see the pattern 😌”

---

### ❌ Now imagine chaos


```GET /getApplications  
POST /fetchApp  
GET /retrieveApplicationById?id=123
```

💀💀💀

Your brain:

> “WHAT IS THIS SYSTEM 😭”

---

### 💡 The truth

Consistency = **predictable patterns**

Once I learn **one endpoint**,  
I can **guess all others without docs**

That’s POWER ⚡


### 🧱 2. Resource-Based Design — “Think in THINGS, not ACTIONS”

This is the part that unlocks everything 🔓

---

### ❌ Wrong mindset (verbs)
```/getApplications  
/createApplication  
/deleteApplication
```


👉 You’re describing **actions**

---

### ✅ Correct mindset (nouns)

`/applications/`

👉 You’re describing a **resource (thing)**

---

### 🎯 Then how do we do actions?

👉 **HTTP method handles the action**

|Action|Endpoint|Method|
|---|---|---|
|Get all|`/applications/`|GET|
|Get one|`/applications/123/`|GET|
|Create|`/applications/`|POST|
|Update|`/applications/123/`|PUT/PATCH|
|Delete|`/applications/123/`|DELETE|

---

### 🧠 The mental shift (THIS IS THE KEY)

Instead of thinking:

> “What function do I call?”

Think:

> “What **resource** am I working with?”

---

### 🎨 Real-world analogy (this will lock it in)

Think of API like a **library 📚**

- `/books/` → the shelf
    
- `/books/123/` → a specific book
    

You don’t say:

- ❌ `/getBook`
    
- ❌ `/deleteBook`
    

You just:

- Go to the book
    
- Decide what to do with it
    

---

### 🔥 Why this matters (interview gold)

Because it gives:

- **Consistency**
    
- **Scalability**
    
- **Clean mental model**
    

---

### 🎯 Super simple way to remember

> **URL = noun (thing)**  
> **HTTP method = verb (action)**

That’s it. That’s REST.

---

### 🌿 A little truth for you

This is the difference between:

- Writing code that _works_  
    vs
    
- Designing systems that feel _beautiful to use_
    

And you… you’re clearly aiming for the second one 🎹⚙️

> “Whatever you do, do it for the glory of God.” — 1 Corinthians 10:31 ✨

Even APIs can carry elegance.

### 🧱 Step 1: Explain Your Naming Convention (Nói ra miệng) 🗣️

Make it clear that you don't just guess; you follow strict rules.

- **Plural Nouns:** Always use plurals for resources.
    
    - ✅ **GOOD:** `/applications/`
        
    - ❌ **BAD:** `/application/`
        
- **Hyphens for Multi-word:** Use hyphens, not camelCase.
    
    - ✅ **GOOD:** `/job-applications/`
        
    - ❌ **BAD:** `/jobApplications/`
        
- **Nested Resources (When it makes sense):** Show relationships clearly.
    
    - 🔗 `/companies/123/applications/`
        

---

### 🔀 Step 2: Show You Master HTTP Methods (RESTful Conventions) 🛠️

Don't use `POST` for everything! Show them you know how to use the verbs properly.

| **HTTP Method** | **Endpoint**             | **Action**       |
| --------------- | ------------------------ | ---------------- |
| 🟢 **GET**      | `/api/applications/`     | List all         |
| 🟡 **POST**     | `/api/applications/`     | Create new       |
| 🔵 **GET**      | `/api/applications/123/` | Get one          |
| 🟠 **PUT**      | `/api/applications/123/` | Update (full)    |
| 🟣 **PATCH**    | `/api/applications/123/` | Update (partial) |
| 🔴 **DELETE**   | `/api/applications/123/` | Delete           |

### 🚦 Step 3: Speak the Language of Status Codes 📡

A good API communicates clearly when things go right _and_ when they go wrong.


```Not:

Something went wrong

But:

{  
  "error": "Application not found",  
  "code": "NOT_FOUND"  
}
```

- 🟢 **200 OK:** Successful GET, PUT, PATCH.
    
- 🟢 **201 Created:** Successful POST.
    
- 🟢 **204 No Content:** Successful DELETE.
    
- 🔴 **400 Bad Request:** Validation error.
    
- 🔴 **401 Unauthorized:** Not authenticated.
    
- 🔴 **403 Forbidden:** Authenticated but no permission.
    
- 🔴 **404 Not Found:** Resource doesn't exist.
    
- 🔴 **500 Internal Server Error:** Server error.

### 4. 📦 Structured Responses

Always predictable:

```{
  "data": {...},
  "error": null
}
```
### 6. 📄 Pagination (for scalability)

Never return 10,000 rows 💀

---

### 7. 🔄 Versioning (protect the future)

So you don’t break clients later.

---

### 🎯 Strong Closing Line (this hits HARD in interviews)

> “Ultimately, a good REST API is one that other developers can use without needing documentation for every endpoint, a good REST API acts as a clear contract between the frontend and backend. By strictly adhering to these conventions, I ensure that any developer consuming my API can understand and integrate it rapidly.”

🔥 That line = senior energy.

## Q2: "How do you version your APIs?" 🤔
"I always version my APIs from day one because business requirements will inevitably change, and we cannot break existing clients. My preferred approach is **URL versioning** for its simplicity and visibility. However, I am also familiar with **Header versioning** if the team prefers keeping the URIs strictly representing resources rather than versions."“I usually use URL versioning, like `/api/v1/...`, because it’s simple, explicit, and easy to manage.  
It allows us to introduce breaking changes without affecting existing clients.  
When we make major changes, we release a new version like `/v2/` while keeping the old version stable.”

### 🛣️ Step 1: Phân tích URL Versioning (The Most Common & Clear)

Đây là cách dễ nhất và phổ biến nhất. Interviewer rất thích sự thực tế này.

- **Cách làm:** Đưa version thẳng vào đường dẫn (URI).
    
    - ✅ `GET /api/v1/applications/`
        
    - ✅ `GET /api/v2/applications/`

### 🎯 The Problem

Imagine you already deployed:

`GET /api/applications/`

Clients are using it.

---

Then later… you change response:
```{  
  "id": 1,  
  "status": "pending"  
}

➡️ becomes:

{  
  "id": 1,  
  "application_status": "pending"  
}

💀 Boom — frontend breaks
```



---

### Versioning = Protecting your users

Instead of breaking things:
```/api/v1/applications/  
/api/v2/applications/
```


👉 Old clients → still use v1  
👉 New clients → move to v2

Peace restored 🕊️

---

### 🧱 3 Main Strategies

#### 1. ✅ URL Versioning (BEST — use this)

/api/v1/applications/  
/api/v2/applications/

✔ Easy to see  
✔ Easy to debug  
✔ Easy in Django (just route it)


#### 2: Nhắc đến Header Versioning (The "Pure REST" Way)

Để lấy điểm Senior/Mid-level, ông nên nhắc đến cách này để chứng tỏ mình hiểu sâu về chuẩn REST.

- **Cách làm:** Gửi version thông qua HTTP Headers (thường là `Accept` header).
    
    - ✅ `Accept: application/vnd.api+json; version=1`
        
- **Tại sao (Why):** URL trông sạch sẽ hơn vì nó chỉ trỏ đến "Resource" (tài nguyên) chứ không chứa "phiên bản". Tuy nhiên, nó khó test nhanh trên trình duyệt hơn (phải dùng Postman/cURL để nhét header vào).


#### 🛑 Step 3: Chỉ ra cách KHÔNG NÊN DÙNG (Query Parameter)

Nói ra cái dở để chứng minh mình có kinh nghiệm thực chiến.

- **Cách làm:** Dùng dấu `?` ở cuối URL.
    
    - ❌ `/api/applications/?version=1`
        
- **Tại sao nên tránh (Avoid):** Nhìn rất lộn xộn (messy) và dễ xung đột với các query params khác dùng để filter (như `?status=pending`).

#### 🎯 Cuối cùng – CÂU CHỐT ĂN ĐIỂM (Strong Closing) 💥

> "In a real-world scenario, I usually advocate for **URL versioning** like `/api/v1/` because it's developer-friendly and easy to route at the infrastructure level, like in an API Gateway or Load Balancer. I only introduce a new API version when there are breaking changes, to ensure backward compatibility and avoid disrupting existing clients."



## Q3: "Explain your error handling strategy"

**✅ Câu trả lời chuẩn phỏng vấn (Interview Ready Answer):**

> "My strategy revolves around predictability and providing actionable feedback. First, I always return the correct HTTP status code so the client application knows exactly what category of error occurred. Second, I return a consistent, structured JSON payload that includes a machine-readable error code, a brief summary, and specific details on what went wrong so the client can easily debug or display a helpful message to the user.", “I follow a consistent error handling strategy where I return structured error responses with clear messages, error codes, and appropriate HTTP status codes.  
This helps clients understand what went wrong and how to handle it programmatically.”

### ❌ Bad API error (we’ve all seen this 😭)
```
{ 
  "error": "Something went wrong"  
}
```


👉 Useless. No direction. No clarity.

---

### ✅ Good API error (this is what you aim for)
```{  
  "error": "Application not found",  
  "code": "NOT_FOUND",  
  "detail": "Application with id 123 does not exist"  
}
```


---

### 🛡️ Step 1: Speak in HTTP Status Codes (Phân loại lỗi)

When things break, the first line of defense is the HTTP status code. You want to show you know the difference between a client mistake and a server crash.

- 🟡 **400 Bad Request:** Use this when the client sends invalid data (e.g., a missing required field).
    
- 🟠 **401 Unauthorized:** The user needs to log in (missing or invalid token).
    
- 🔴 **403 Forbidden:** The user is logged in, but they don't have permission to do this specific action.
    
- 🟣 **404 Not Found:** The resource (like a specific job application ID) doesn't exist.
    
- 💥 **500 Internal Server Error:** My code broke (a backend bug or database failure).
    

---

### 📦 Step 2: The Standard Error Format (Cấu trúc trả về đồng nhất)

This is where you show you think like an architect. Never just return a plain text string. Always return a structured JSON object.

**Ví dụ (Show them this structure in your explanation):**

JSON

```
{
    "error": "Application not found", 
    "code": "NOT_FOUND",
    "detail": "Application with id 123 does not exist"
}
```

- 👉 **`error`:** A short, human-readable summary.
    
- 👉 **`code`:** A constant string (`NOT_FOUND`, `INVALID_EMAIL`) that the frontend can write `if/else` logic against.
    
- 👉 **`detail`:** The exact context of why it failed so the developer can fix it fast.

### 📦 Step 3: Clear and meaning full message
Not: `❌ Invalid Request`
But: `✅ Email fiedl is required`

"A good error response shouldn't just say 'Something went wrong.' It should tell the client exactly _what_ failed, _why_ it failed, and give enough context to fix it without having to ask the backend team to check the server logs."

	



## Q4: "How do you handle pagination"?
**✅ Câu trả lời chuẩn phỏng vấn (The Confident, Senior-Level Answer):**

> "I always implement pagination for list endpoints because returning massive datasets all at once kills performance, spikes memory usage, and ruins the user experience.
> 
> For standard use cases, I use **Page-based pagination**, returning a fixed page size along with metadata like the total count and the 'next' and 'previous' URL links. This makes it incredibly easy for the frontend to navigate. However, if I am dealing with millions of records or an infinite-scroll feature, I will switch to **Cursor-based pagination** to ensure the database queries remain lightning-fast and we don't skip or duplicate data."

---

### TALKING POINTS 💬

If the interviewer digs deeper, you hit them with these structured blocks.

### 💥 1. The "Why" (Xác định Vấn Đề)

Always remind them _why_ we do this before showing _how_.

- **Without Pagination:** `GET /applications/` returns 10,000 records. 💀 (Slow response, high server memory, terrible frontend UX).
    
- **The Mental Model (Say this out loud!):** 🎨 _"Pagination is like scrolling Instagram. You don’t load the entire database into the app at once; you load just enough for the screen, then fetch the next chunk when the user continues."_📱
    

### ⚙️ 2. The DRF Implementation (Vũ khí của ông 🐍)

Show them you know exactly how to set this up cleanly in your stack without writing messy boilerplate code.

Python

```
# settings.py - Global DRF Pagination Configuration
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}
```

### 📦 3. The Expected Payload (Giao tiếp với Frontend)

Explain what the client actually receives. You MUST return these 3 metadata fields:

1. 🔢 **`count`**: Total records in the database.
    
2. ➡️ **`next`**: The exact URL for the next page (e.g., `/api/applications/?page=2`).
    
3. ⬅️ **`previous`**: The exact URL for the previous page.
    
4. 📝 **`results`**: The actual array of JSON objects (capped at 20).
    

### 🧠 4. The Senior Flex: Knowing the Types of Pagination

This is where you show you aren't just memorizing code; you are making architectural decisions.

- ✅ **Page-based (Offset):** Standard, easy to implement (`/?page=2`). Great for admin dashboards. _Drawback:_ Gets slow if the user jumps to page 10,000 because the database still scans the first 9,999 records.
    
- ⚡ **Limit + Offset:** Very flexible (`/?limit=20&offset=40`). Great for data tables where the user controls how many items they want to see.
    
- 🚀 **Cursor-based:** The absolute best for large, real-time systems (`/?cursor=abc123`). The database jumps directly to the last known item. It is extremely fast for massive datasets and prevents duplicate data if items are added while the user is scrolling.
    

---

### 🎯 Cuối cùng – CÂU CHỐT ĂN ĐIỂM (Strong Closing) 💥

> "Ultimately, pagination is about respecting the system's resources and the user's time. I default to Page-based for its simplicity and interview-friendly nature, but I always keep Cursor-based in my back pocket for data-heavy, infinite-scroll architectures."

```REST_FRAMEWORK = {  
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',  
    'PAGE_SIZE': 20  
}
```


👉 This = global default  
👉 But… we can go **much deeper** 🔥

---

### ⚙️ 1. 🎯 Create Custom Pagination Class (MOST IMPORTANT)

This is how real projects do it.
```from rest_framework.pagination import PageNumberPagination  
  
class CustomPagination(PageNumberPagination):  
    page_size = 20  
    page_size_query_param = 'page_size'   # allow client to control size  
    max_page_size = 100                   # protect server  
    page_query_param = 'page'             # default, but can rename
```



---

### 🧠 What each thing does

|Setting|Meaning|
|---|---|
|`page_size`|Default items per page|
|`page_size_query_param`|Client can do `?page_size=50`|
|`max_page_size`|Prevent abuse (VERY important)|
|`page_query_param`|Rename `page` → e.g. `p`|

---

### 🔥 Use it globally

```REST_FRAMEWORK = {  
    'DEFAULT_PAGINATION_CLASS': 'your_app.pagination.CustomPagination',  
}
```


---

### ⚡ 2. Override Response Format (🔥 SENIOR MOVE)

You can reshape the response completely:
```class CustomPagination(PageNumberPagination):  
    page_size = 20  
  
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



---

### 🎯 Result becomes:
```
{  
  "meta": {  
    "total": 100,  
    "page": 1,  
    "page_size": 20  
  },  
  "links": {  
    "next": "...",  
    "prev": null  
  },  
  "data": [...]  
}
```


💥 This is **production-level API design**

---

### 🧩 3. Per-View Pagination (flexibility)

Not everything should use same pagination.

```from rest_framework.generics import ListAPIView  
  
class ApplicationListView(ListAPIView):  
    queryset = Application.objects.all()  
    serializer_class = ApplicationSerializer  
    pagination_class = CustomPagination
```


---

👉 You can even disable it:

pagination_class = None

---

### 🚀 4. Switch to LimitOffsetPagination

```'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination'

Client:

GET /applications/?limit=20&offset=40
```


---

### 🧠 5. CursorPagination (BIG SYSTEMS)
```from rest_framework.pagination import CursorPagination  
  
class CursorPaginationExample(CursorPagination):  
    page_size = 20  
    ordering = '-created_at'
```



👉 Best for:

- infinite scroll
    
- large datasets
    
- real-time feeds
    

---

### 🎯 Interview Upgrade Line (this is gold)

> “I usually start with page-based pagination, but for large-scale or real-time systems, I switch to cursor-based pagination to ensure consistency and performance.”
