# 📝 Key Talking Points: Django/DRF Core Concepts

**Goal:** Speak like an Architect. Move beyond "how to code" to "how to design."

---

## 1. Project Structure — **XƯƠNG SỐNG CỦA PROJECT** 🏗️

**Talking Point:** "Modular apps, configuration, routing."

Django **không phải 1 app**, mà là **nhiều app ghép lại**.

### 🗂️ Production-Ready Structure

```
my_project/
├── apps/
│   ├── users/      # Auth, profile, roles
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── tests.py
│   ├── core/       # Common logic (utils, base models)
│   ├── api/        # API-specific logic (optional)
│   ├── payments/   # Payment domain
│
├── settings/
│   ├── base.py     # Shared config
│   ├── dev.py      # Debug=True, Local DB
│   ├── prod.py     # Debug=False, S3, Sentry, strict security
│
├── urls.py         # Global URL routing (dispatcher)
├── wsgi.py         # Server entry point
└── asgi.py         # Async server entry point
```

### Key Components Explained

#### 🗂️ `apps/` Folder (Modular Apps)

**Ý nghĩa:** Thay vì để các folder `users`, `products`, `orders` nằm lăn lóc ở thư mục gốc (root), ta gom hết vào folder `apps`.

**Architect Mindset:** Giúp dự án gọn gàng. Khi nhìn vào root folder, ta chỉ thấy cấu hình hệ thống. Muốn tìm logic nghiệp vụ? Vào `apps/`.

**Core Principles:**
- Mỗi app = **1 domain** (One app, one responsibility)
- Có `models`, `serializers`, `views`, `urls` riêng
- Dễ maintain, dễ scale
- Apps độc lập, dễ test, dễ scale
- DRF-friendly

**💡 Key Principle:** **"One app, one responsibility"** (domain-driven architecture)

**💡 Interviewer rất thích câu:** **"Each app owns its own business logic."**

**Why this matters:**
- **Scalability:** Khi project lớn, có thể tách app thành microservice riêng
- **Testing:** Mỗi app test độc lập
- **Team work:** Nhiều người làm nhiều app không conflict
- **Clear boundaries:** Ranh giới rõ ràng giữa các domain

#### ⚙️ Settings Splitting (`settings/`)

**Ý nghĩa:** Trung tâm điều khiển (Database config, Secret keys, Installed apps).

**Never use a single `settings.py`. Use a package:**

**Structure:**
```python
settings/
├── base.py      # Common settings (INSTALLED_APPS, MIDDLEWARE, etc.)
├── dev.py       # Development settings
│                # DEBUG = True
│                # SQLite database
│                # Email to console
│                # Verbose error pages
│
└── prod.py      # Production settings
                 # DEBUG = False
                 # PostgreSQL database
                 # AWS S3 for media/static
                 # Sentry for error tracking
                 # Strict security headers
```

**Example `settings/dev.py`:**
```python
from .base import *

DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

**Example `settings/prod.py`:**
```python
from .base import *

DEBUG = False
ALLOWED_HOSTS = ['myapp.com']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': '5432',
    }
}

# Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

**🛡️ Security mindset:** Tách settings theo môi trường để tránh lộ bí mật.

**Why this approach:**
- **Security:** Secrets never committed to git
- **Flexibility:** Different configs for different environments
- **Clarity:** Easy to see what changes between dev/prod

#### 🌐 `urls.py` (Global Routing)

**The entry point** - should delegate to app-specific `urls.py`:

Gom toàn bộ route. Mỗi app tự quản `urls.py` của nó.

**Example Global `urls.py`:**
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('apps.users.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/', include('apps.api.urls')),  # General API routes
]
```

**Why this pattern:**
- **Separation of concerns:** Each app controls its own routing
- **Readability:** Easy to see all top-level routes
- **Scalability:** Adding new app = adding one line

#### 🔌 `wsgi.py` / `asgi.py` (Web Server Gateway Interface)

**Ý nghĩa:** Viết tắt của _Web Server Gateway Interface_. Đây là cái "cầu dao" để nối code Python của bạn với Server chạy web (như Gunicorn, Nginx).

**The "bridge" between Python code and web servers.**

- **WSGI:** Synchronous (traditional)
- **ASGI:** Asynchronous (WebSockets, async views)

Bạn ít khi phải sửa file này, nhưng phải biết nó tồn tại để deploy.

Rarely modified, but critical for deployment understanding.

**Why you should know this:**
- **Deployment:** You need to point Gunicorn to this file
- **Async support:** ASGI enables WebSockets and async views
- **Production readiness:** Shows you understand the full stack

---

### 🗣️ Interview-ready Answer

> "I structure Django projects in a modular app-based way, where each app encapsulates its own models, views, serializers, and URLs. This makes the codebase easier to scale and maintain."

> "I usually structure a Django REST API in a modular, app-based way. Each app owns its models, serializers, views, and urls, which keeps the codebase scalable and easy to maintain."

> "I organize projects with an `apps/` folder for all business logic, split `settings/` into `base.py`, `dev.py`, and `prod.py` for environment-specific configs, and use `urls.py` as a dispatcher that delegates to app-level routing."

**Key phrase to drop:** "One app, one responsibility" – this shows domain-driven thinking.

---

## 2. ViewSets vs. APIViews — **The "When to use what" Check** ⚔️

**Talking Point:** "ViewSets for CRUD, APIViews for custom logic."

Câu này test xem bạn hiểu sâu về công cụ mình dùng hay chỉ "copy paste".

### Mental Models 🧠 (Automation vs. Control)

Hãy tưởng tượng lái xe:

#### ViewSet = "Convention over configuration" 🚗 (Automatic car)

- **The Concept:** Bạn chỉ cần đạp ga (khai báo Model), xe tự sang số (tự tạo URL, tự tạo code Create/Read/Update/Delete).
- Just declare the model and serializer, DRF auto-generates everything
- Like automatic transmission: step on gas, it shifts gears for you
- **Dùng khi:** Làm các tính năng CRUD tiêu chuẩn, không có logic quái dị.
- **Philosophy:** Convention over configuration – DRF makes the decisions for you

#### APIView = "Full control, full responsibility" 🏎️ (Manual car)

- **The Concept:** Bạn phải tự sang số (tự viết hàm get, post, tự define URL). Nhưng bạn kiểm soát được từng tí một.
- You write every handler method (`get`, `post`, `put`, `delete`)
- Like manual transmission: you control every gear shift
- **Dùng khi:** Cần xử lý logic phức tạp (VD: API Login, gửi OTP, tính toán report).
- **Philosophy:** Full control – You make every decision

### ⚔️ Quick Comparison

| Aspect | ViewSets | APIViews |
|--------|----------|----------|
| Use Case | CRUD chuẩn | Custom logic |
| Code Amount | Ít code (3 lines) | Nhiều code (manual methods) |
| URL Generation | Router tự gen URL | Tự viết URL |
| Usage | 80-90% use cases | 10-20% special cases |
| Flexibility | Structured | Total freedom |
| Best For | REST resources | Non-REST endpoints |

---

### 📘 ViewSets (`ModelViewSet`) — **DRF LÀM GIÙM BẠN 80%** 🚀

**Use when:** Standard CRUD on a database model (90% of use cases)

**Why:** Gives you List, Create, Retrieve, Update, Delete for free

**Router Magic:** `DefaultRouter` auto-generates 5 endpoints:

```
GET     /posts/        → list all
POST    /posts/        → create new
GET     /posts/{id}/   → retrieve one
PUT     /posts/{id}/   → update one
PATCH   /posts/{id}/   → partial update
DELETE  /posts/{id}/   → delete one
```

#### Complete Code Example (ViewSet - Chuẩn chỉnh):

**1. Model:**
```python
# models.py
class Post(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
```

**2. Serializer:**
```python
# serializers.py
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'created_at']
```

**3. ViewSet (chỉ 3 dòng!):**
```python
# views.py
from rest_framework.viewsets import ModelViewSet
from .models import Post
from .serializers import PostSerializer

class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
```

**4. URL Routing (Router auto magic ✨):**
```python
# urls.py
from rest_framework.routers import DefaultRouter
from .views import PostViewSet

router = DefaultRouter()
router.register(r"posts", PostViewSet)

urlpatterns = router.urls
```

**🎯 What you get automatically:**
- `GET /posts/` → List all posts (with pagination!)
- `POST /posts/` → Create new post
- `GET /posts/1/` → Get post by ID
- `PUT /posts/1/` → Full update
- `PATCH /posts/1/` → Partial update
- `DELETE /posts/1/` → Delete post

**📌 Mental note:**
> _ViewSet = convention over configuration_

**When ViewSet wins:**
- Users
- Products
- Orders
- Posts
- Comments
- Any standard REST resource

👉 **CRUD 90% use-case**

---

### 📘 APIViews (`APIView`) — **TỰ TAY LÀM MỌI THỨ** 🛠️

**Use when:** Non-CRUD endpoints or complex custom logic

**Why:** Granular control over each HTTP method

**Examples of when to use:**
- `/api/users/` → ViewSet (CRUD resource)
- `/api/stats/` → APIView (custom analytics, no model)
- `/api/trigger-report/` → APIView (action, not resource)
- `/api/upload-file/` → APIView (complex custom logic)
- `/api/login/` → APIView (custom authentication flow)
- `/api/search/` → APIView (complex query logic)

#### Complete Code Example (APIView - Full Control):

**Scenario: Basic CRUD (manual way):**

```python
# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Post
from .serializers import PostSerializer

class PostAPIView(APIView):
    """
    List all posts or create a new post.
    """
    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

```python
# urls.py (phải tự viết)
from django.urls import path
from .views import PostAPIView

urlpatterns = [
    path("posts/", PostAPIView.as_view()),
]
```

**🧠 Nhận xét:**
- ✅ Rất rõ ràng, full control
- ✅ Custom logic easily added
- ❌ Dài, viết lặp nhiều
- ❌ Không auto route
- ❌ Must manually handle each method

**📌 Mental note:**
> _APIView = full control, full responsibility_

---

#### When APIView Wins — **Non-CRUD Examples** 🥊

**Example 1: Stats Endpoint (No underlying model):**
```python
class PostStatsAPIView(APIView):
    def get(self, request):
        total_posts = Post.objects.count()
        recent_posts = Post.objects.filter(
            created_at__gte=timezone.now() - timedelta(days=7)
        ).count()

        return Response({
            "total_posts": total_posts,
            "recent_posts": recent_posts,
            "average_per_day": recent_posts / 7
        })

# URL: path("posts/stats/", PostStatsAPIView.as_view())
```

**Example 2: Custom Action Endpoint:**
```python
class TriggerReportAPIView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        # Trigger background task
        generate_report_task.delay()
        return Response({
            "message": "Report generation started"
        }, status=status.HTTP_202_ACCEPTED)
```

**Example 3: Complex Upload Logic:**
```python
class FileUploadAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file_obj = request.FILES.get('file')

        # Custom validation
        if file_obj.size > 10 * 1024 * 1024:  # 10MB
            return Response(
                {"error": "File too large"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Process file
        process_file(file_obj)

        return Response({"message": "File uploaded successfully"})
```

👉 ViewSet **không hợp** cho các case này vì chúng không phải REST resource với CRUD operations.

---

### 🗣️ Interview-ready Answer

> "The difference comes down to **abstraction level** and **control**:
>
> **ViewSets:** I use ViewSets for standard CRUD operations because they reduce boilerplate and integrate well with routers. Combined with `DefaultRouter`, it auto-generates routing and all five REST operations. I use this for about 80-90% of my endpoints - anything that maps to a database resource like Users, Products, or Posts.
>
> **APIViews:** I use APIView when I need custom behavior that doesn't fit REST resource patterns. Examples include analytics endpoints, action triggers, complex file uploads, or authentication flows. APIViews give me full control over each HTTP method handler, which is essential for non-standard endpoints."

> "I use ViewSets for 80% of resources to keep code DRY and consistent. I switch to APIViews when the endpoint doesn't fit REST resource patterns or requires complex custom logic."

**📌 Ví dụ vàng để drop trong interview:**
- `/api/users/` → ViewSet (standard CRUD)
- `/api/stats/` → APIView (custom analytics)

---

## 3. Serializers & Data Layer — **Bộ Chuyển Đổi & Kiểm Soát** 🔄

**Talking Point:** "Serializers act as the validation and transformation layer."

Đây là "Người phiên dịch" và "Bảo vệ" của hệ thống.

### The Flow:

**Incoming Request:**
Frontend gửi JSON lên → Serializer kiểm tra (Validate) → chuyển thành Python Object → Saved to Database

**Outgoing Response:**
Database returns Python Object → Serializer chuyển thành JSON → Sent to Frontend

### Core Concept

**Serializer = "Gatekeeper"** 🚪

👉 Serializer = **gatekeeper**

**Three Critical Jobs:**
1. **Validates incoming data** (POST/PUT requests)
   - Check required fields
   - Validate data types
   - Run custom validation logic

2. **Transforms Python objects → JSON** (outgoing responses)
   - Query results to JSON
   - Hide sensitive fields
   - Add computed fields

3. **Controls what fields are exposed** to the client
   - Whitelist specific fields
   - Different serializers for different views
   - Nested relationships

---

### Types of Serializers

#### 3.1 ModelSerializer — **"Máy Photocopy"** 📋

**Concept:** Là "máy photocopy". Nó copy y nguyên cấu trúc của Model trong Database ra JSON. Nhanh, gọn, lẹ.

**Use for:** Standard CRUD operations (90% of cases)

**Basic Example:**
```python
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]
```

**✅ Advantages:**
- Auto map field từ model
- Nhanh – gọn – sạch
- Automatic validation based on model field types
- Built-in create() and update() methods

**Advanced Example - Controlling Fields:**
```python
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        # OR use __all__ for all fields
        # fields = '__all__'

        # Exclude sensitive fields
        # exclude = ['password', 'is_staff']

        # Read-only fields (can't be modified via API)
        read_only_fields = ['id', 'created_at']
```

**When to use:**
- Standard CRUD endpoints
- Model maps 1:1 to API response
- Minimal custom logic needed

---

#### 3.2 SerializerMethodField — **Computed Fields (Cực hay dùng!)** ⭐

**CRITICAL FEATURE.** Computed fields that don't exist in the database.

**Ý nghĩa:** Tạo ra một trường dữ liệu **không có thật** trong Database, mà được tính toán (compute) ra khi chạy.

**Ví dụ:** Trong Database bạn có `first_name` ("Nguyễn") và `last_name` ("Văn A"). Nhưng Frontend muốn hiển thị `full_name`.

**Complete Example:**
```python
class UserSerializer(serializers.ModelSerializer):
    # Khai báo trường tự tính toán
    full_name = serializers.SerializerMethodField()
    post_count = serializers.SerializerMethodField()
    is_premium = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'full_name',      # Computed
            'post_count',     # Computed
            'is_premium'      # Computed
        ]

    # Logic để tính toán (Bắt buộc phải có tên get_<field_name>)
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def get_post_count(self, obj):
        return obj.posts.count()

    def get_is_premium(self, obj):
        return obj.subscription_end_date > timezone.now()
```

**📌 Pattern:** Method name MUST be `get_<field_name>`

**When to use:**
- Combining multiple fields
- Counting related objects
- Conditional logic based on object state
- Any calculation that doesn't belong in the database

**Why this is powerful:**
- Frontend gets exactly what it needs
- No extra API calls needed
- Logic centralized in one place
- Database stays clean (no redundant fields)

---

#### 3.3 Custom Serializer — **Non-Model-Bound** 📝

Use when data doesn't map to a model.

**👉 Không gắn với model**

**👉 Dùng cho:**
- Login forms
- OTP verification
- Search input
- Aggregation queries
- Multi-step form data

**Example 1: Login Serializer**
```python
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User not found")
        return value
```

**Example 2: Search Input Serializer**
```python
class SearchSerializer(serializers.Serializer):
    query = serializers.CharField(max_length=200, required=True)
    category = serializers.ChoiceField(
        choices=['posts', 'users', 'products'],
        required=False
    )
    limit = serializers.IntegerField(default=10, min_value=1, max_value=100)
```

**Example 3: OTP Verification**
```python
class OTPVerifySerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)
    otp_code = serializers.CharField(max_length=6)

    def validate_otp_code(self, value):
        if len(value) != 6 or not value.isdigit():
            raise serializers.ValidationError("OTP must be 6 digits")
        return value
```

**When to use:**
- Authentication/Authorization flows
- Input validation for complex operations
- Multi-source data aggregation
- Form data that doesn't map to a single model

---

### Validation — **The Gatekeeper Logic** 🛡️

Keep business logic validation in `validate_<field>` or object-level `validate()`.

**Field-level validation:**
```python
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'age']

    def validate_age(self, value):
        if value < 18:
            raise serializers.ValidationError("Must be 18 or older")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username taken")
        return value
```

**Object-level validation:**
```python
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['start_date', 'end_date', 'room']

    def validate(self, data):
        if data['start_date'] >= data['end_date']:
            raise serializers.ValidationError(
                "End date must be after start date"
            )
        return data
```

---

### 🗣️ Interview-ready Answer

> "Serializers act as the validation and transformation layer. I use `ModelSerializer` for standard CRUD and custom serializers for more complex or non-model-based data like authentication flows."

> "I think of serializers as the gatekeeper of my API. They validate incoming data, transform database objects to JSON, and control exactly what fields are exposed to the client. I use `ModelSerializer` for 80% of cases where there's a 1:1 mapping to a model, `SerializerMethodField` for computed fields that don't exist in the database, and custom `Serializer` classes for non-model-bound data like login forms or search inputs."

**Key phrase:** "Serializers = validation + transformation + access control"

---

## 4. Authentication Methods — **AI VÀO ĐÂY RẤT THÍCH HỎI** 🔐

**Talking Point:** "JWT vs Session vs Token."

Là một Frontend Engineer hoặc API Developer, bạn sẽ yêu thích JWT nhất.

### Authentication (Who are you?) — Three Approaches

---

#### 🍪 Session-based Auth — **The Traditional Way**

**Cơ chế:** Server tạo ra session ID, lưu vào Cookie của trình duyệt.

**How it works:**
1. User logs in with credentials
2. Server creates session ID, stores it in database
3. Session ID sent to browser as cookie
4. Browser automatically sends cookie with every request
5. Server looks up session in database to identify user

**Type:** **Stateful** (Server remembers you via database)

**Nhược điểm:**
- Server phải tốn RAM/Database để nhớ session
- Khó scale (nếu có 1 triệu user login cùng lúc thì server mệt)
- Database lookup required for every request
- Harder to scale horizontally (session sharing across servers)

**Dùng khi:**
- Web truyền thống (Django render HTML)
- Admin page
- Monolithic applications
- When you need server-side control over sessions

---

#### 🔑 Token Auth — **Simple Token-Based**

**Cơ chế:** Mỗi user có 1 chuỗi ký tự cố định (như API Key). Gửi kèm mỗi request header.

**How it works:**
1. User gets a token (usually on registration or login)
2. Token stored in database, linked to user
3. Client sends token in `Authorization` header
4. Server looks up token in database

**Example header:**
```
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

**Dùng khi:**
- API nội bộ
- Script/Bot chạy ngầm
- Long-lived API access
- Service-to-service communication

**Limitations:**
- Still requires database lookup
- No expiration built-in
- Less secure than JWT for user-facing apps

---

#### 🔐 JWT (JSON Web Tokens) — **The Architect's Choice** ⭐

**Best for React/Mobile. Stateless (server doesn't store anything). Highly scalable.**

**Stateless (Không trạng thái):** Server **không lưu** gì cả. Mọi thông tin (User ID, Expire time) được mã hóa nén thẳng vào cái token. Server chỉ cần giải mã token là biết user là ai. → **Scalable cực tốt**.

### How JWT Works (Step-by-Step):

**1. User Login:**
```python
# User sends: POST /api/token/
{
    "username": "user@example.com",
    "password": "password123"
}
```

**2. Server Generates TWO Tokens:**
```python
# Server responds:
{
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  # 15 min
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  # 7 days
}
```

**3. Client Stores Tokens:**
```javascript
// In React/Vue
localStorage.setItem('access_token', response.data.access);
localStorage.setItem('refresh_token', response.data.refresh);
```

**4. Client Sends Access Token with Every Request:**
```python
# Request header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**5. Token Refresh Flow (when access expires):**
```python
# POST /api/token/refresh/
{
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

# Server responds with NEW access token:
{
    "access": "NEW_ACCESS_TOKEN_HERE..."
}
```

### The Two Token Types Explained:

**Access Token (15 phút):**
- **Purpose:** Chìa khóa vào nhà. Used for API requests.
- **Lifespan:** Short (5-15 minutes)
- **Why short:** Hết hạn nhanh để lỡ bị hacker chôm thì cũng chỉ dùng được 15p
- **Security:** Limited damage if stolen
- **Stored:** Client-side (localStorage or memory)

**Refresh Token (7 ngày):**
- **Purpose:** Chìa khóa dự phòng (cất trong két sắt) để xin cấp lại Access Token mới mà user không cần nhập lại pass
- **Lifespan:** Long (7-30 days)
- **Why long:** Better UX - user stays logged in
- **Security:** Stored securely (httpOnly cookie preferred)
- **Can be revoked:** Server can blacklist refresh tokens

### Why JWT is Superior for APIs:

**1. Stateless = Scalable:**
```
Session-based:
Request → Server checks database → Response
(Database hit on EVERY request)

JWT:
Request → Server verifies signature → Response
(NO database hit needed!)
```

**2. Perfect for Distributed Systems:**
- Multiple servers can verify tokens without sharing session state
- No sticky sessions needed
- Easy to scale horizontally

**3. Mobile/SPA Friendly:**
- Works seamlessly with React, Vue, React Native, Flutter
- No cookie management needed
- Works across different domains

**4. Contains User Info:**
```python
# JWT payload (decoded):
{
    "user_id": 123,
    "username": "john_doe",
    "email": "john@example.com",
    "exp": 1234567890,  # Expiration timestamp
    "iat": 1234567800   # Issued at timestamp
}
```

**🛡️ Security Built-in:** Django protects against SQL Injection, XSS, CSRF attacks out of the box.

---

### 🗣️ Interview-ready Answer

> "I usually use JWT authentication for APIs because it's stateless and scales well, especially for SPA or mobile clients."

> "JWT is stateless, which means the server doesn't need to track sessions in memory or database, making it ideal for distributed systems."

> "I prefer JWT for API authentication because it's stateless and highly scalable. The server doesn't need to store any session data - all user information is encoded in the token itself, and the server just verifies the signature. This is perfect for modern architectures with multiple backend servers. I use the two-token approach: short-lived access tokens (15 minutes) for API requests, and long-lived refresh tokens (7 days) for obtaining new access tokens, which provides a good balance between security and user experience."

**Key comparison to mention:**
> "Session-based auth requires a database lookup on every request, while JWT just verifies a signature. For high-traffic APIs, this difference is massive."

---

## 5. Permissions — **AI ĐƯỢC VÀO HAY KHÔNG?** 🚪

**Talking Point:** "IsAuthenticated, IsAdminUser, Custom logic."

### 🧠 Core Concept

**Critical distinction:**

👉 **Auth = _who you are_** (Identity)
👉 **Permission = _what you can do_** (Authorization)

Sau khi biết "Bạn là ai" (Auth), hệ thống sẽ check "Bạn được phép làm gì" (Perm).

**Example Flow:**
```
1. Request comes in with JWT token
2. Authentication: "This is user John (ID: 123)"
3. Permission: "Can John access this resource?"
4. If yes → Process request
   If no → 403 Forbidden
```

---

### 🔹 Built-in Permissions

**Most Common:**

```python
from rest_framework.permissions import (
    IsAuthenticated,
    IsAdminUser,
    AllowAny
)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]  # Must be logged in
```

**1. `AllowAny` (Default)**
- Anyone can access
- No authentication required
- **Use for:** Public endpoints like landing pages, public posts

**2. `IsAuthenticated`**
- Có đăng nhập mới được xem
- **Use for:** Xem trang Profile, User-specific data
- Most common permission

```python
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"user": request.user.username})
```

**3. `IsAdminUser`**
- Phải là Staff/Superuser mới được xem
- **Use for:** Trang quản lý nhân sự, Admin operations
- Checks `user.is_staff == True`

```python
class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]
```

**4. `IsAuthenticatedOrReadOnly`**
- Anyone can read (GET)
- Must be authenticated to modify (POST, PUT, DELETE)
- **Use for:** Blog posts, comments

---

### ✨ Custom Permissions — **Critical for Interviews** 🌟

**Override `has_object_permission`** — Cái này quan trọng nhất để thể hiện trình độ.

#### The Problem Statement

**Bài toán:** Ai cũng xem được bài đăng (Post), nhưng chỉ **tác giả** bài đăng mới được **Sửa/Xóa**.

**Real-world scenario:**
- Anyone can view a blog post (GET)
- Only the author can edit/delete it (PUT, DELETE)
- Admins can edit/delete any post

#### The Solution: IsOwnerOrReadOnly

**Giải pháp:**
```python
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # 1. Nếu chỉ xem (GET, HEAD, OPTIONS) -> OK cho qua
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # 2. Nếu muốn Sửa/Xóa (PUT, DELETE) -> Check ownership
        # Write permissions are only allowed to the owner of the object.
        return obj.owner == request.user
```

**Usage:**
```python
class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
```

**What happens:**
- `GET /posts/` → ✅ Anyone authenticated can view
- `GET /posts/1/` → ✅ Anyone authenticated can view
- `PUT /posts/1/` → ✅ Only if `request.user == post.owner`
- `DELETE /posts/1/` → ✅ Only if `request.user == post.owner`

---

#### Advanced: IsOwnerOrAdmin

**More sophisticated version:**
```python
class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Allow access to:
    - Owners (for any action)
    - Admins (for any action)
    - Everyone else (read-only)
    """

    def has_object_permission(self, request, view, obj):
        # Read-only for everyone
        if request.method in permissions.SAFE_METHODS:
            return True

        # Admin can do anything
        if request.user.is_staff:
            return True

        # Owner can do anything to their object
        return obj.owner == request.user
```

---

#### Multiple Permissions

**Combine multiple permission classes:**
```python
from rest_framework.permissions import IsAuthenticated, IsAdminUser

class SensitiveDataView(APIView):
    # User must satisfy BOTH conditions
    permission_classes = [IsAuthenticated, IsAdminUser]
```

**Custom OR logic:**
```python
class IsOwnerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        # Must be authenticated
        if not request.user.is_authenticated:
            return False

        # Either admin OR owner
        return request.user.is_staff or self.is_owner(request, view)
```

---

### 📌 Use Cases Summary

| Permission | Use Case |
|------------|----------|
| `AllowAny` | Public data, landing pages |
| `IsAuthenticated` | User-specific data, protected endpoints |
| `IsAdminUser` | Admin operations, user management |
| `IsAuthenticatedOrReadOnly` | Blog posts, comments (read public, write protected) |
| `IsOwnerOrReadOnly` | User can only edit their own data |
| `IsOwnerOrAdmin` | Owner OR admin can modify |

---

### 🗣️ Interview-ready Answer

> "I use permission classes to control access at both the view and object level, and I write custom permissions when business rules require it."

> "I prefer to keep permission logic decoupled from the view logic. I create custom permission classes by inheriting from `BasePermission`. This makes the permission reusable across any view in the application just by adding it to the `permission_classes` list, keeping my views clean and focused only on data handling."

> "I distinguish between authentication - who you are - and permissions - what you can do. For most endpoints, I use built-in classes like `IsAuthenticated` or `IsAdminUser`. But for object-level permissions like 'only the post author can edit this post', I create custom permission classes that override `has_object_permission`. This keeps the logic reusable and my views clean."

**Key phrase:** "Auth = who you are, Permissions = what you can do"

---

## 6. Django vs. Flask/FastAPI — **When to Choose What** 🏗️

**Talking Point:** "Batteries Included vs. Build it Yourself."

Đây không phải là câu hỏi "cái nào mạnh hơn", mà là "cái nào phù hợp hơn".

### The Metaphor 🏗️ (Paint the Picture)

Hãy hình dung:

#### Flask/FastAPI = **Building from Bricks** 🧱

**The Image:** Giống như bạn mua gạch, xi măng, gỗ về để tự xây nhà.

- You buy raw materials (SQLAlchemy, Alembic, Auth system, etc.)
- Total control, but you wire everything manually
- Bạn tự do tuyệt đối, nhưng bạn phải tự làm mọi thứ (auth, database connection, admin...)
- Every decision is yours
- Flexible but time-consuming

**What you have to build yourself:**
- ORM setup (SQLAlchemy)
- Database migrations (Alembic)
- Authentication system
- Admin interface
- Security middleware (CSRF, XSS protection)
- Form validation
- File uploads
- Email sending

**Best for:**
- Microservices nhỏ, nhanh
- Lightweight APIs
- When you want minimal footprint
- When you have specific needs Django doesn't fit
- When you want to choose every component

#### Django = **Fully Furnished Apartment** 🏠

**The Image:** Giống như bạn mua một căn hộ cao cấp đầy đủ nội thất (Fully Furnished). Vào là ở ngay.

- Kitchen (ORM)
- Security locks (CSRF/XSS protection)
- Building management (Admin panel)
- Nó có sẵn Bếp (ORM), Cửa khóa (Security), Quản lý tòa nhà (Admin Panel)
- Move in and start coding business logic immediately
- Everything integrated out of the box

**What you get for free:**
- Powerful ORM (models, relationships, migrations)
- Built-in Admin interface
- Authentication & Authorization system
- Form validation & rendering
- Security middleware (SQL injection, XSS, CSRF protection)
- Template engine
- Internationalization (i18n)
- Caching framework
- Email sending
- File uploads
- Session management

**Best for:**
- Medium-to-large systems
- Rapid development
- Team consistency
- Long-term maintainability
- When time-to-market is critical
- Khi dự án cần sự phức tạp, quản lý User, Admin dashboard, và cần ra mắt nhanh

---

### Quick Comparison Table

| Aspect | Django | Flask / FastAPI |
|--------|--------|-----------------|
| **Type** | Full-stack | Lightweight |
| **ORM** | Built-in (powerful) | Tự chọn (SQLAlchemy) |
| **Admin** | Built-in (beautiful) | None (build yourself) |
| **Philosophy** | Opinionated (Convention) | Flexible (Freedom) |
| **Learning Curve** | Steeper (more features) | Easier (minimal) |
| **Development Speed** | Faster (batteries included) | Slower (build from scratch) |
| **Flexibility** | Less flexible (structured) | Highly flexible |
| **Best For** | Full apps, MVPs, teams | Microservices, small APIs |

---

### When to Choose Django ⭐

**Time-to-market is critical** (startup environment)
- You need to launch quickly
- No time to build infrastructure
- Focus on business logic, not plumbing

**Need standard features:**
- User management & authentication
- Admin dashboard for content management
- Complex database relationships
- Form handling & validation

**Team consistency matters**
- Opinionated structure prevents architectural chaos
- New team members onboard faster
- Less decision fatigue
- Code reviews easier (everyone follows same patterns)

**Long-term maintainability** over flexibility
- Established patterns and best practices
- Large ecosystem & community
- Mature, battle-tested code
- Security patches & updates

**Examples of Django-perfect projects:**
- SaaS applications
- E-commerce platforms
- Content management systems
- Social networks
- Enterprise applications

---

### When to Choose Flask/FastAPI

**Microservices architecture**
- Small, focused services
- Each service does one thing
- Minimal overhead needed

**Performance is critical**
- FastAPI is async-first (faster than Django)
- Minimal framework overhead
- Fine-tuned performance control

**You want full control**
- Choose exactly what you need
- No "magic" happening behind the scenes
- Understanding every component

**Learning/Experimentation**
- Understand how frameworks work
- Build from ground up
- Educational purposes

---

### 🗣️ Interview-ready Answer

> "I prefer Django when building medium to large systems because it's opinionated and comes with built-in features like ORM, authentication, and admin. Flask or FastAPI are great for lightweight services, but Django helps me maintain consistency and scalability in long-term projects."

> "It comes down to **'Batteries Included' vs. 'Build it Yourself'**. Django lets me focus on business logic, not infrastructure."

> "The choice depends on the project context. For a full-stack application with user management, admin needs, and complex business logic, I choose Django because it provides everything out of the box - ORM, admin interface, authentication, security middleware. This lets me focus on building features, not infrastructure. For a lightweight microservice or when I need maximum performance, I'd choose FastAPI. For a startup MVP where time-to-market is critical, Django wins because I can launch in weeks, not months."

### 📌 Key words cần nhấn trong interview:

**Opinionated** – **Scalable** – **Maintainable** – **Time-to-market** – **Batteries Included**

---

## 7. The Architect's 4-Step Flow — **Models → Serializers → Views → URLs** 🧠

**Talking Point:** "The layered approach to building Django REST APIs."

### Tư duy Architect (Visualize Flow)

Hãy hình dung quy trình như một dây chuyền sản xuất:

**Database (Models)** ➡️ **Máy chuyển đổi (Serializers)** ➡️ **Bộ điều khiển (Views/ViewSets)** ➡️ **Cổng giao tiếp (URLs)**

### The 4-Step Flow (Detailed):

#### Step 1: **Models First** — Database Schema Design 🗄️

**Purpose:** Thiết kế Database Schema trong `models.py`, đảm bảo các quan hệ (Foreign Keys) chính xác.

**What you define:**
- Table structure
- Field types & constraints
- Relationships (ForeignKey, ManyToMany)
- Indexes & unique constraints
- Model methods & properties

**Example:**
```python
# models.py
class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['author', '-created_at']),
        ]

    def __str__(self):
        return self.title
```

**Why this first:**
- Data structure drives everything else
- Get relationships right from the start
- Migrations lock in your schema
- Harder to change later

---

#### Step 2: **Serialization** — The Critical Layer 🔄

**Purpose:** Đây là bước quan trọng nhất. Dùng Serializers để validate dữ liệu đầu vào và format dữ liệu đầu ra (JSON) sao cho Frontend dễ consume nhất.

**What you define:**
- Which fields to expose
- Validation rules
- Computed fields
- Nested relationships
- Read-only vs writable fields

**Example:**
```python
# serializers.py
class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'content',
            'author',
            'author_name',  # Computed
            'comment_count', # Computed
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_comment_count(self, obj):
        return obj.comments.count()

    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Title too short")
        return value
```

**Why this is critical:**
- Controls what Frontend sees
- Validates incoming data
- Transforms complex objects to JSON
- Single source of truth for API structure

---

#### Step 3: **Logic Layer (Views)** — Business Logic 🎯

**Purpose:** Tùy vào nghiệp vụ, chọn ViewSets cho các tác vụ CRUD nhanh, hoặc APIView cho các logic phức tạp tùy biến.

**What you decide:**
- ViewSet (80% of cases) or APIView (custom logic)
- Permission classes
- Authentication classes
- Filtering, pagination, ordering
- Custom actions

**Example (ViewSet):**
```python
# views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response

class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        # Auto-assign author to current user
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """Custom action: Like a post"""
        post = self.get_object()
        post.likes.add(request.user)
        return Response({'status': 'post liked'})
```

**Why this layer:**
- Handles HTTP request/response
- Applies permissions & authentication
- Contains business logic
- Orchestrates serializers

---

#### Step 4: **Routing** — Exposing Endpoints 🌐

**Purpose:** Cuối cùng là cấu hình `urls.py` để expose endpoints.

**What you define:**
- URL patterns
- Router registration (for ViewSets)
- API versioning
- URL namespaces

**Example:**
```python
# urls.py (app level)
from rest_framework.routers import DefaultRouter
from .views import PostViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')

urlpatterns = router.urls

# Auto-generates:
# GET    /posts/          → list
# POST   /posts/          → create
# GET    /posts/1/        → retrieve
# PUT    /posts/1/        → update
# DELETE /posts/1/        → destroy
# POST   /posts/1/like/   → custom action
```

**Example (Global urls.py):**
```python
# project/urls.py
from django.urls import path, include

urlpatterns = [
    path('api/v1/', include([
        path('posts/', include('apps.posts.urls')),
        path('users/', include('apps.users.urls')),
        path('auth/', include('apps.authentication.urls')),
    ])),
]
```

**Why routing last:**
- Everything else must exist first
- URL structure exposes your API
- Versioning strategy matters
- Clean URLs = good API design

---

### The Complete Flow Visualized

```
1. Request: GET /api/posts/1/
              ↓
2. URL Router: "This goes to PostViewSet.retrieve()"
              ↓
3. View:
   - Check permissions (IsAuthenticated?)
   - Get Post object from database
   - Pass to serializer
              ↓
4. Serializer:
   - Convert Post model to Python dict
   - Add computed fields (author_name, comment_count)
   - Format dates
              ↓
5. Response:
   {
     "id": 1,
     "title": "My Post",
     "content": "...",
     "author_name": "john_doe",
     "comment_count": 5,
     "created_at": "2024-01-20T10:30:00Z"
   }
```

---

### 💡 Key Phrase to Remember:

**"Models → Serializers → Views → URLs. Each layer has a clear responsibility."**

### 🗣️ Interview-ready Answer:

> "I follow a four-layer approach when building Django REST APIs. First, I design the database schema in Models, ensuring relationships are correct. Second, I create Serializers to define what data the API exposes and how it's validated. Third, I implement the business logic in Views - choosing ViewSets for standard CRUD or APIViews for custom logic. Finally, I configure URLs to expose the endpoints. This layered approach keeps each component focused on its responsibility and makes the codebase maintainable."

**Key insight to drop:**
> "The serializer layer is the most critical because it's the contract between your database and your frontend. Getting it right prevents a lot of issues down the line."

---

## 🎯 Tổng Kết Session 1

| Topic | Key Points |
|-------|------------|
| **Structure** | Gọn gàng với `apps/`. Modular apps. "One app, one responsibility". Settings split (base/dev/prod) |
| **Views** | ViewSet = CRUD automation (80-90%), APIView = full control (10-20%). Know when to use each. |
| **Serializers** | Gatekeeper: validation + transformation. `ModelSerializer` (CRUD), Custom (complex), `SerializerMethodField` (computed) |
| **Auth** | JWT (stateless, scalable, perfect for APIs), Session (traditional web), Token (service-to-service) |
| **Permissions** | Auth = who, Permission = what. Built-in classes + Custom (`IsOwnerOrReadOnly`) for object-level security |
| **Django vs Flask** | Batteries Included vs Build Yourself. Django = speed + consistency, Flask/FastAPI = flexibility + control |
| **Flow** | Models → Serializers → Views → URLs. Layered architecture with clear responsibilities. |

---

### 🌱 Senior Mindset (cực quan trọng):

> Django không mạnh vì code ít
> Django mạnh vì **structure rõ + rule rõ**

> "Choose the right tool for the job. Django for full apps, Flask/FastAPI for microservices, but know WHY you're choosing."

> "The mark of a senior developer is knowing when NOT to use Django, not just when to use it."

---

## 📌 Quick Reference: Key Phrases for Interview

| Concept | Key Phrase |
|---------|------------|
| Project Structure | "One app, one responsibility" |
| ViewSets | "Convention over configuration - 80% of my endpoints" |
| APIViews | "Full control for custom logic that doesn't fit REST" |
| Serializers | "The gatekeeper: validation, transformation, access control" |
| Authentication | "JWT for stateless, scalable API auth" |
| Permissions | "Auth = who you are, Permissions = what you can do" |
| Django Philosophy | "Batteries included - focus on business logic, not infrastructure" |
| Architecture | "Models → Serializers → Views → URLs - layered responsibilities" |

---

