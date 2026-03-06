# 🗣️ Practice Questions & Answers: Django/DRF Core

**Instructions:**
1.  Read the question.
2.  Answer out loud (record yourself if possible).
3.  Compare with the "Strong Answer."

---

## Q1: "How would you structure a Django REST API?"

**Weak Answer:**
"I just use `django-admin startproject`. I have a settings file and a urls file. I put my apps in the main folder."

**🔥 Strong Answer (Architect Level):**
"I usually structure a Django REST API in a modular, app-based way.
Each app owns its models, serializers, views, and urls, which keeps the codebase scalable and easy to maintain."

**Key Points to Mention:**
- **Modular Apps:** Tôi tạo một folder `apps/` để chứa các module (như `users`, `payments`). Việc này giúp cấu trúc gọn gàng và dễ dàng tách microservices sau này nếu cần.
- **Settings Splitting:** Tách settings theo môi trường để tránh lộ bí mật (security mindset).
- **Apps độc lập:** Dễ test, dễ scale, DRF-friendly.

### 🗂️ Example Structure (chuẩn chỉnh)
```
my_project/
├ apps/
│   ├ users/
│   │   ├ models.py
│   │   ├ serializers.py
│   │   ├ views.py
│   │   ├ urls.py
│   ├ core/
│   ├ api/
├ settings/
│   ├ base.py
│   ├ dev.py
│   ├ prod.py
├ urls.py
├ wsgi.py
```

**💡 Điểm cộng:**
- Tách settings theo môi trường 🛡️ (security mindset)
- Apps độc lập, dễ test, dễ scale
- DRF-friendly

**📌 One-liner để nhớ:**
> "One app, one responsibility."

---

## Q2: "Walk me through your Django/DRF experience and approach."

**Weak Answer:**
"I know Django and DRF. I use models, serializers, and views. I've built APIs before."

**🔥 Strong Answer (Solution Architect Level):**
"I've worked with Django and Django REST Framework to build APIs for authentication, CRUD systems, and integrations.
I usually use ModelViewSets with serializers, JWT authentication, and permission classes to secure endpoints.
What I like about Django is that it provides a clear structure and batteries-included approach, which helps me move fast while keeping the code clean."

### 🧠 Tư duy Architect (Visualize Flow)
Hãy hình dung quy trình như một dây chuyền sản xuất:
**Database (Models)** ➡️ **Máy chuyển đổi (Serializers)** ➡️ **Bộ điều khiển (Views/ViewSets)** ➡️ **Cổng giao tiếp (URLs)**

### 🗣️ Detailed Answer (theo phong cách Solution Architect):
"Kinh nghiệm của tôi với DRF tập trung vào việc xây dựng các API chuẩn RESTful và tối ưu cho Frontend. Quy trình của tôi thường đi qua 4 bước:

**1. Models First:** Tôi bắt đầu bằng việc thiết kế Database Schema trong `models.py`, đảm bảo các quan hệ (Foreign Keys) chính xác.

**2. Serialization:** Đây là bước quan trọng nhất. Tôi dùng Serializers để validate dữ liệu đầu vào và format dữ liệu đầu ra (JSON) sao cho Frontend dễ consume nhất.

**3. Logic Layer (Views):** Tùy vào nghiệp vụ, tôi sẽ chọn ViewSets cho các tác vụ CRUD nhanh, hoặc APIView cho các logic phức tạp tùy biến.

**4. Routing:** Cuối cùng là cấu hình `urls.py` để expose endpoints."

**💡 Key Phrase to Remember:**
> "Models → Serializers → Views → URLs. Each layer has a clear responsibility."

---

## Q3: "Why would you choose Django over Flask or FastAPI?"

**Weak Answer:**
"Because I know Python and Django is popular. It has a lot of features."

**🔥 Strong Answer (CTO Level):**
"It comes down to **'Batteries Included' vs. 'Build it Yourself'**.

I prefer Django when building medium to large systems because it's opinionated and comes with built-in features like ORM, authentication, and admin.
Flask or FastAPI are great for lightweight services, but Django helps me maintain consistency and scalability in long-term projects."

### 🧠 Tư duy so sánh (đừng dìm framework khác)

| Aspect | Django | Flask / FastAPI |
|--------|--------|-----------------|
| Type | Full-stack | Lightweight |
| ORM | ORM mạnh (built-in) | Tự chọn ORM |
| Admin | Admin sẵn | Không có |
| Philosophy | Opinionated | Flexible |

### 🏗️ The Metaphor

Đây không phải là câu hỏi "cái nào mạnh hơn", mà là "cái nào phù hợp hơn".

Hãy hình dung:

- **Flask/FastAPI:** Giống như bạn mua gạch, xi măng, gỗ về để tự xây nhà. Bạn tự do tuyệt đối, nhưng bạn phải tự làm mọi thứ (auth, database connection, admin...). Tốt cho Microservices nhỏ, nhanh.

- **Django:** Giống như bạn mua một căn hộ cao cấp đầy đủ nội thất (Fully Furnished). Vào là ở ngay. Nó có sẵn Bếp (ORM), Cửa khóa (Security), Quản lý tòa nhà (Admin Panel).

**Lý do chọn Django:** Khi dự án cần sự phức tạp, quản lý User, Admin dashboard, và cần ra mắt nhanh (Time-to-market), Django là vô địch.

### 🗣️ Sample Answer (Văn mẫu):
"Tôi chọn Django vì triết lý 'Batteries Included' của nó.

**Tốc độ phát triển (Development Speed):** Với Django, tôi không mất thời gian setup lại những thứ cơ bản như Authentication, ORM hay Admin Interface. Nó có sẵn mọi thứ.

**Tính bảo mật (Security):** Django tích hợp sẵn các lớp bảo vệ chống lại SQL Injection, XSS, CSRF... giúp hệ thống an toàn ngay từ đầu mà không cần config nhiều như Flask.

**Cấu trúc chuẩn:** Trong team work, Django buộc mọi người code theo một cấu trúc chuẩn, dễ maintain hơn là sự tự do quá mức của FastAPI."

**📌 Key words cần nhấn:**
**Opinionated** – **Scalable** – **Maintainable**

---

## Q4: "Explain the difference between ViewSets and APIViews. When do you use which?"

**Weak Answer:**
"ViewSets write less code. APIViews are for when you want to write functions. I use ViewSets mostly."

**🔥 Strong Answer (Senior Dev Level):**
"The difference comes down to **abstraction level (mức độ trừu tượng)** and **control (kiểm soát)**:

**ViewSets = 'Convention over configuration'** (like an automatic car 🚗):
- You declare the model and serializer, and DRF auto-generates all CRUD operations
- The `DefaultRouter` automatically creates 5 endpoints: List, Create, Retrieve, Update, Delete
- I use this for **90% of standard REST resources** like Users, Products, Posts
- **Example:** `/api/users/` endpoint with full CRUD

**APIViews = 'Full control, full responsibility'** (like a manual car 🏎️):
- You manually write each HTTP method handler (`get`, `post`, `put`, `delete`)
- Best for non-CRUD endpoints that don't map to a database resource
- **Examples:**
  - `/api/stats/` → Custom analytics (no underlying model)
  - `/api/trigger-report/` → Action endpoint (not a resource)
  - `/api/upload-file/` → Complex custom logic

**In short:** ViewSets for CRUD resources, APIViews for everything else that doesn't fit REST conventions."

### 🧠 Tư duy Architect (Automation vs. Control)

Hãy tưởng tượng lái xe:

- **ViewSets:** Là xe số tự động (Automatic). 🚗
  - Bạn chỉ cần đạp ga (khai báo Model), xe tự sang số (tự tạo URL, tự tạo code Create/Read/Update/Delete).
  - **Dùng khi:** Làm các tính năng CRUD tiêu chuẩn, không có logic quái dị.

- **APIViews:** Là xe số sàn (Manual). 🏎️
  - Bạn phải tự sang số (tự viết hàm get, post, tự define URL). Nhưng bạn kiểm soát được từng tí một.
  - **Dùng khi:** Cần xử lý logic phức tạp (VD: API Login, gửi OTP, tính toán report).

### ⚔️ Quick Comparison

| Aspect | ViewSets | APIViews |
|--------|----------|----------|
| Use Case | CRUD chuẩn | Custom logic |
| Code Amount | Ít code | Linh hoạt |
| URL Generation | Router tự gen URL | Tự viết URL |
| Usage | 80-90% use cases | Khi đặc biệt |

### 🔥 Code Examples — HIỂU BẰNG VÍ DỤ THỰC TẾ

**Giả sử có model đơn giản:**
```python
# models.py
class Post(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
```

---

#### 1️⃣ APIView — TỰ TAY LÀM MỌI THỨ 🛠️

👉 **Dùng khi:** Logic custom, không phải CRUD chuẩn, cần kiểm soát chi tiết từng method

```python
# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Post
from .serializers import PostSerializer

class PostAPIView(APIView):

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
- ✅ Rất rõ ràng
- ❌ Dài
- ❌ Viết lặp nhiều
- ❌ Không auto route

**📌 Mental note:**
> _APIView = full control, full responsibility_

---

#### 2️⃣ ViewSet — DRF LÀM GIÙM BẠN 80% 🚀

👉 **Dùng khi:** CRUD chuẩn, RESTful API, muốn code gọn, sạch

**ModelViewSet (chuẩn chỉnh):**
```python
# views.py
from rest_framework.viewsets import ModelViewSet
from .models import Post
from .serializers import PostSerializer

class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
```

```python
# urls.py (Router auto magic ✨)
from rest_framework.routers import DefaultRouter
from .views import PostViewSet

router = DefaultRouter()
router.register(r"posts", PostViewSet)

urlpatterns = router.urls
```

**🔗 Auto sinh ra những endpoint này:**
```
GET     /posts/        → list
POST    /posts/        → create
GET     /posts/{id}/   → retrieve
PUT     /posts/{id}/   → update
DELETE  /posts/{id}/   → destroy
```

**📌 Mental note:**
> _ViewSet = convention over configuration_

---

#### 3️⃣ Khi nào APIView thắng ViewSet? 🥊

**📊 Ví dụ: Endpoint thống kê (KHÔNG PHẢI CRUD)**
```python
class PostStatsAPIView(APIView):
    def get(self, request):
        total_posts = Post.objects.count()
        return Response({
            "total_posts": total_posts
        })
```

URL: `path("posts/stats/", PostStatsAPIView.as_view())`

👉 ViewSet **không hợp** cho case này.

---

#### 4️⃣ Khi nào ViewSet thắng APIView? 🏆

- Users
- Products
- Orders
- Posts
- Comments

👉 **CRUD 90% use-case**

---

### 🗣️ Interview-ready Answer:

> "I use ViewSets for standard CRUD operations because they reduce boilerplate and integrate well with routers.
> I use APIView when I need custom behavior, like analytics or non-CRUD endpoints for better control."

**📌 Ví dụ vàng:**
- `/api/users/` → ViewSet
- `/api/stats/` → APIView

---

## Q5: "How do you handle custom permissions in DRF?"

**Weak Answer:**
"I just check `if user.is_authenticated` inside the view function."

**🔥 Strong Answer:**
"I prefer to keep permission logic decoupled from the view logic.
I create custom permission classes by inheriting from `BasePermission`.
For example, an `IsOwner` permission that overrides `has_object_permission` to check if `obj.owner == request.user`.
This makes the permission reusable across any view in the application just by adding it to the `permission_classes` list, keeping my views clean and focused only on data handling."

### 🧠 Core Concept

👉 **Auth = _who you are_**
👉 **Permission = _what you can do_**

Sau khi biết "Bạn là ai" (Auth), hệ thống sẽ check "Bạn được phép làm gì" (Perm).

### 🔹 Built-in Permissions

```python
permission_classes = [IsAuthenticated]
```

- `IsAuthenticated`: Có đăng nhập mới được xem. (Ví dụ: Xem trang Profile).
- `IsAdminUser`: Phải là Staff/Superuser mới được xem. (Ví dụ: Trang quản lý nhân sự).

### ✨ Custom Permissions (Override `has_object_permission`)

Cái này quan trọng nhất để thể hiện trình độ.

**Bài toán:** Ai cũng xem được bài đăng (Post), nhưng chỉ **tác giả** bài đăng mới được **Sửa/Xóa**.

**Giải pháp:**
```python
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # 1. Nếu chỉ xem (GET, HEAD, OPTIONS) -> OK cho qua
        if request.method in permissions.SAFE_METHODS:
            return True

        # 2. Nếu muốn Sửa/Xóa (PUT, DELETE) -> Check xem user hiện tại có phải chủ sở hữu (obj.owner) không?
        return obj.owner == request.user
```

**📌 Dùng khi:**
- User chỉ được sửa data của mình
- Object-level security

### 🗣️ Interview-ready Answer:

> "I use permission classes to control access at both the view and object level, and I write custom permissions when business rules require it."

> "This keeps permission logic decoupled from views and reusable across the entire app."

---

## Q6: "What are the different types of serializers and when do you use each?"

**Weak Answer:**
"I use ModelSerializer mostly. It maps to the model."

**🔥 Strong Answer:**
"Serializers act as the validation and transformation layer. I use different types based on the use case:

**1. ModelSerializer:** For standard CRUD operations. It auto-maps model fields to JSON, making it fast and clean.

**2. SerializerMethodField:** For computed fields that don't exist in the database. The method name must follow the pattern `get_<field_name>`. Example: combining `first_name` and `last_name` into `full_name`.

**3. Custom Serializer:** For non-model-bound data like Login forms, OTP verification, Search inputs, or Aggregation queries."

### 📌 Code Examples:

**ModelSerializer:**
```python
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]
```

**SerializerMethodField:**
```python
class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'full_name']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
```

**Custom Serializer:**
```python
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
```

---

## Q7: "Explain JWT authentication. Why use it over sessions?"

**Weak Answer:**
"JWT is a token. It's more modern than sessions."

**🔥 Strong Answer:**
"JWT (JSON Web Tokens) is my go-to for API authentication because it's **stateless**.

**How it works:** The server doesn't store anything. All user info (User ID, expiration time) is encoded directly into the token. The server just decodes it to know who the user is.

**Two token types:**
- **Access Token (15 minutes):** Short-lived, used for API requests. If stolen, limited damage window.
- **Refresh Token (7 days):** Stored securely, used to obtain new Access Tokens without re-login.

**Why JWT over Sessions:**
- **Scalability:** No server-side session storage needed. With 1 million concurrent users, sessions would overload server memory.
- **Perfect for SPAs/Mobile:** Stateless architecture works great with React, Vue, or mobile apps.
- **Distributed systems:** No need to share session state across servers."

**🗣️ Interview-ready Answer:**
> "JWT is stateless, which means the server doesn't need to track sessions in memory or database, making it ideal for distributed systems."

---

## Q8: "What is WSGI and why should you know about it?"

**Weak Answer:**
"I've seen wsgi.py but I've never touched it."

**🔥 Strong Answer:**
"WSGI stands for Web Server Gateway Interface. It's the bridge between your Python code and the web server (like Gunicorn, Nginx).

While you rarely modify `wsgi.py` directly, understanding it is critical for deployment. It's the entry point that allows web servers to communicate with your Django application."

---

## Summary: Key Phrases to Remember

| Question | Key Phrase |
|----------|------------|
| Project Structure | "One app, one responsibility" |
| DRF Experience | "Models → Serializers → Views → URLs" |
| Django vs Flask | "Batteries Included vs. Build it Yourself" |
| ViewSets vs APIViews | "Convention over configuration vs. Full control" |
| Permissions | "Decoupled, reusable permission classes" |
| Serializers | "Gatekeeper for validation and transformation" |
| JWT | "Stateless, scalable, ideal for distributed systems" |
