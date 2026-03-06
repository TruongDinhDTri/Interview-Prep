
2026-01-16 16:17

Status 

Tags: [[be_talking_points]]

# 1.Practice Question

### 1️⃣ Câu hỏi 1: “How would you structure a Django REST API?”
🗣️ Cách trả lời mượt (interview-ready)

“I usually structure a Django REST API in a modular, app-based way.
Each app owns its models, serializers, views, and urls, which keeps the codebase scalable and easy to maintain.”
Modular Apps: Tôi tạo một folder apps/ để chứa các module (như users, payments). Việc này giúp cấu trúc gọn gàng và dễ dàng tách microservices sau này nếu cần.


🗂️ Ví dụ structure (chuẩn chỉnh)
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

💡 Điểm cộng

Tách settings theo môi trường 🌱 để tránh lộ bí mật (security mindset 🛡️).

Apps độc lập, dễ test, dễ scale

DRF-friendly

📌 One-liner để nhớ:

“One app, one responsibility.”




### 2️⃣ Câu hỏi 2: “Walk me through your Django / DRF experience”


“I’ve worked with Django and Django REST Framework to build APIs for authentication, CRUD systems, and integrations.
I usually use ModelViewSets with serializers, JWT authentication, and permission classes to secure endpoints.
What I like about Django is that it provides a clear structure and batteries-included approach, which helps me move fast while keeping the code clean.”




🧠 Tư duy Architect (Visualize Flow)
Hãy hình dung quy trình như một dây chuyền sản xuất: Database (Models) ➡️ Máy chuyển đổi (Serializers) ➡️ Bộ điều khiển (Views/ViewSets) ➡️ Cổng giao tiếp (URLs).



🗣️ Sample Answer (Văn mẫu - theo phong cách Solution Architect)
"Kinh nghiệm của tôi với DRF tập trung vào việc xây dựng các API chuẩn RESTful và tối ưu cho Frontend. Quy trình của tôi thường đi qua 4 bước:

Models First: Tôi bắt đầu bằng việc thiết kế Database Schema trong models.py, đảm bảo các quan hệ (Foreign Keys) chính xác.

Serialization: Đây là bước quan trọng nhất. Tôi dùng Serializers để validate dữ liệu đầu vào và format dữ liệu đầu ra (JSON) sao cho Frontend dễ consume nhất.

Logic Logic Layer (Views): Tùy vào nghiệp vụ, tôi sẽ chọn ViewSets cho các tác vụ CRUD nhanh, hoặc APIView cho các logic phức tạp tùy biến.

Routing: Cuối cùng là cấu hình urls.py để expose endpoints."


### 3️⃣ Câu hỏi 3: “Why Django over Flask or FastAPI?”


🧠 Tư duy so sánh (đừng dìm framework khác)
Django	Flask / FastAPI
Full-stack	Lightweight
ORM mạnh	Tự chọn ORM
Admin sẵn	Không có
Opinionated	Flexible
🗣️ Câu trả lời chuẩn chỉnh

“I prefer Django when building medium to large systems because it’s opinionated and comes with built-in features like ORM, authentication, and admin.
Flask or FastAPI are great for lightweight services, but Django helps me maintain consistency and scalability in long-term projects.”

📌 Key word cần nhấn:
Opinionated (là gì vậy ?) – Scalable – Maintainable



Đây không phải là câu hỏi "cái nào mạnh hơn", mà là "cái nào phù hợp hơn".


Hãy hình dung:

Flask/FastAPI: Giống như bạn mua gạch, xi măng, gỗ về để tự xây nhà. Bạn tự do tuyệt đối, nhưng bạn phải tự làm mọi thứ (auth, database connection, admin...). Tốt cho Microservices nhỏ, nhanh.

Django: Giống như bạn mua một căn hộ cao cấp đầy đủ nội thất (Fully Furnished). Vào là ở ngay. Nó có sẵn Bếp (ORM), Cửa khóa (Security), Quản lý tòa nhà (Admin Panel).

Lý do chọn Django: Khi dự án cần sự phức tạp, quản lý User, Admin dashboard, và cần ra mắt nhanh (Time-to-market), Django là vô địch.

🗣️ Sample Answer (Văn mẫu)
"Tôi chọn Django vì triết lý 'Batteries Included' của nó.

Tốc độ phát triển (Development Speed): Với Django, tôi không mất thời gian setup lại những thứ cơ bản như Authentication, ORM hay Admin Interface. Nó có sẵn mọi thứ.

Tính bảo mật (Security): Django tích hợp sẵn các lớp bảo vệ chống lại SQL Injection, XSS, CSRF... giúp hệ thống an toàn ngay từ đầu mà không cần config nhiều như Flask.

Cấu trúc chuẩn: Trong team work, Django buộc mọi người code theo một cấu trúc chuẩn, dễ maintain hơn là sự tự do quá mức của FastAPI."

### 4️⃣ Câu hỏi 4: “Explain ViewSets vs APIViews”



Câu này test xem bạn hiểu sâu về công cụ mình dùng hay chỉ "copy paste".

⚔️ So nhanh cho dễ nhớ
ViewSets	APIViews
CRUD chuẩn	Custom logic
Ít code	Linh hoạt
Router tự gen URL	Tự viết URL
Dùng 80% case	Dùng khi đặc biệt

🧠 Tư duy Architect (Automation vs. Control)
Hãy tưởng tượng lái xe:

ViewSets: Là xe số tự động (Automatic). 🚗

Bạn chỉ cần đạp ga (khai báo Model), xe tự sang số (tự tạo URL, tự tạo code Create/Read/Update/Delete).

Dùng khi: Làm các tính năng CRUD tiêu chuẩn, không có logic quái dị.

APIViews: Là xe số sàn (Manual). 🏎️

Bạn phải tự sang số (tự viết hàm get, post, tự define URL). Nhưng bạn kiểm soát được từng tí một.

Dùng khi: Cần xử lý logic phức tạp (VD: API Login, gửi OTP, tính toán report).

🗣️ Sample Answer (Văn mẫu)
"Sự khác biệt nằm ở mức độ trừu tượng (Abstraction) và kiểm soát (Control):

ViewSets: Tôi dùng ViewSets khi cần xây dựng nhanh các CRUD endpoints tiêu chuẩn cho một Resource (ví dụ: User, Product). Kết hợp với DefaultRouter, nó giúp tôi không phải viết lặp lại các đoạn code thừa và tự động hóa việc routing.

APIViews: Tôi dùng APIViews khi cần tùy biến cao. Ví dụ như một endpoint để change-password hay upload-file phức tạp không theo chuẩn RESTful thường, APIView cho tôi quyền kiểm soát hoàn toàn logic của từng method GET/POST."

🗣️ Trả lời interview

“I use ViewSets for standard CRUD operations because they reduce boilerplate and integrate well with routers.
I use APIView when I need custom behavior, like analytics or non-CRUD endpoints. for better control”

📌 Ví dụ vàng:

/api/users/ → ViewSet

/api/stats/ → APIView

#### 🔥 APIViews vs ViewSets — **HIỂU BẰNG VÍ DỤ THỰC TẾ**

Giả sử mình có **model đơn giản**:

```
# models.py
class Post(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
```

---

### 1️⃣ APIView — **TỰ TAY LÀM MỌI THỨ** 🛠️

👉 Dùng khi:

- Logic custom
    
- Không phải CRUD chuẩn
    
- Cần kiểm soát chi tiết từng method

```
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

### urls.py (phải tự viết)




```from django.urls import path
from .views import PostAPIView

urlpatterns = [
    path("posts/", PostAPIView.as_view()),
]
```


### 🧠 Nhận xét

- ✅ Rất rõ ràng
    
- ❌ Dài
    
- ❌ Viết lặp nhiều
    
- ❌ Không auto route
    

📌 **Mental note:**

> _APIView = full control, full responsibility_

### 2️⃣ ViewSet — **DRF LÀM GIÙM BẠN 80%** 🚀

👉 Dùng khi:

- CRUD chuẩn
    
- RESTful API
    
- Muốn code gọn, sạch
    

---

### 📌 Ví dụ: ModelViewSet (chuẩn chỉnh)


```# views.py
from rest_framework.viewsets import ModelViewSet
from .models import Post
from .serializers import PostSerializer

class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
```



### urls.py (Router auto magic ✨)

```
from rest_framework.routers import DefaultRouter 
from .views import PostViewSet  
router = DefaultRouter() router.register(r"posts", PostViewSet)  
urlpatterns = router.urls
```

### 🔗 Auto sinh ra những endpoint này:

```   
GET     /posts/        → list
POST    /posts/        → create
GET     /posts/{id}/   → retrieve
PUT     /posts/{id}/   → update
DELETE  /posts/{id}/   → destroy
```

📌 **Mental note:**

> _ViewSet = convention over configuration_



### 3️⃣ Khi nào **APIView thắng ViewSet**? 🥊

### 📊 Ví dụ: Endpoint thống kê (KHÔNG PHẢI CRUD)

```
class PostStatsAPIView(APIView):
    def get(self, request):
        total_posts = Post.objects.count()
        return Response({
            "total_posts": total_posts
        })
```

URL:

`path("posts/stats/", PostStatsAPIView.as_view())`

👉 ViewSet **không hợp** cho case này.

### 4️⃣ Khi nào **ViewSet thắng APIView**? 🏆

- Users
    
- Products
    
- Orders
    
- Posts
    
- Comments
    

👉 **CRUD 90% use-case**







# 2. Key Talking Points

### 1️⃣ Project Structure — **XƯƠNG SỐNG CỦA PROJECT**

Talking Point: "Modular apps, configuration, routing."
Django **không phải 1 app**, mà là **nhiều app ghép lại**.


```
my_project/
├── apps/
│   ├── users/      # Auth, profile, roles
│   ├── core/       # Common logic (utils, base models)
│   ├── api/        # API-specific logic (optional)
│
├── settings.py     # Config (dev / prod / env)
├── urls.py         # Global URL routing
└── wsgi.py         # Server entry point

```


- **`apps/` (Modular Apps):**
    
    - **Ý nghĩa:** Thay vì để các folder `users`, `products`, `orders` nằm lăn lóc ở thư mục gốc (root), ta gom hết vào folder `apps`.
        
    - **Architect Mindset:** Giúp dự án gọn gàng. Khi nhìn vào root folder, ta chỉ thấy cấu hình hệ thống. Muốn tìm logic nghiệp vụ? Vào `apps/`.
    - - Mỗi app = **1 domain**
    
	- Có `models`, `serializers`, `views`, `urls`
    
	- Dễ maintain, dễ scale
    

> 💡 Interviewer rất thích câu:  
> **“Each app owns its own business logic.”**
        
- **`settings.py`:**
    
    - **Ý nghĩa:** Trung tâm điều khiển (Database config, Secret keys, Installed apps).
        
    - **Lưu ý:** Trong môi trường chuyên nghiệp, file này thường được tách ra thành `base.py`, `dev.py`, `prod.py` (như mình đã bàn ở trên) để bảo mật.
        
- **`wsgi.py`:**
    
    - **Ý nghĩa:** Viết tắt của _Web Server Gateway Interface_. Đây là cái "cầu dao" để nối code Python của bạn với Server chạy web (như Gunicorn, Nginx). Bạn ít khi phải sửa file này, nhưng phải biết nó tồn tại để deploy.
    -
- **`urls.py`:**
	- Gom toàn bộ route
    
	- Mỗi app tự quản `urls.py` của nó
	    ```
path("api/users/", include("apps.users.urls"))
	    ```
		

#### 🗣️ Interview-ready answer

> “I structure Django projects in a modular app-based way, where each app encapsulates its own models, views, serializers, and URLs.  
> This makes the codebase easier to scale and maintain.”





### 2️⃣ Serializer (Bộ chuyển đổi & Kiểm soát)

Đây là "Người phiên dịch" và "Bảo vệ" của hệ thống. Frontend gửi JSON lên, Serializer kiểm tra (Validate) rồi chuyển thành Python Object. Server trả dữ liệu về, Serializer chuyển Python Object thành JSON.
👉 Serializer = **gatekeeper**

- Validate input
    
- Transform data
    
- Control output
####  2.1 - Model Serializer 
Là "máy photocopy". Nó copy y nguyên cấu trúc của Model trong Database ra JSON. Nhanh, gọn, lẹ.
```
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]

```
✅ Auto map field từ model  
✅ Nhanh – gọn – sạch

####  2 .2 - SerializerMethodField (Computed Fields - Cực hay dùng):
- **Ý nghĩa:** Tạo ra một trường dữ liệu **không có thật** trong Database, mà được tính toán (compute) ra khi chạy.
    
- **Ví dụ:** Trong Database bạn có `first_name` ("Nguyễn") và `last_name` ("Văn A"). Nhưng Frontend muốn hiển thị `full_name`.
```
class UserSerializer(serializers.ModelSerializer):
    # Khai báo trường tự tính toán
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'full_name']

    # Logic để tính toán (Bắt buộc phải có tên get_<field_name>)
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
```

#### 2.3 - Custom Serializer 
```
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

```
👉 Không gắn với model  

👉 Dùng cho:
- Login
- OTP
- Search
- Aggregation input
***
#### 🗣️ Interview-ready answer

> “Serializers act as the validation and transformation layer.  
> I use ModelSerializer for standard CRUD and custom serializers for more complex or non-model-based data.”


### 3️⃣ Authentication Methods — **AI VÀO ĐÂY RẤT THÍCH HỎI** 🔐
_Talking Point: "JWT vs Session vs Token."_

Là một Frontend Engineer, bạn sẽ yêu thích JWT nhất.

- **🍪 Session-based:**
    
    - **Cơ chế:** Server tạo ra session ID, lưu vào Cookie của trình duyệt.
        
    - **Nhược điểm:** Server phải tốn RAM để nhớ session. Khó scale (nếu có 1 triệu user login cùng lúc thì server mệt).
        
    - **Dùng khi:** Web truyền thống (Django render HTML), Admin page.
        
- **🔑 Token Auth:**
    
    - **Cơ chế:** Mỗi user có 1 chuỗi ký tự cố định (như API Key). Gửi kèm mỗi request header.
        
    - **Dùng khi:** API nội bộ, hoặc cho các Script/Bot chạy ngầm.
        
- **🔐 JWT (JSON Web Tokens) - The Architect's Choice:**
    
    - **Stateless (Không trạng thái):** Server **không lưu** gì cả. Mọi thông tin (User ID, Expire time) được mã hóa nén thẳng vào cái token. Server chỉ cần giải mã token là biết user là ai. -> **Scalable cực tốt**.
        
    - **Access Token (15p):** Chìa khóa vào nhà. Hết hạn nhanh để lỡ bị hacker chôm thì cũng chỉ dùng được 15p.
        
    - **Refresh Token (7 ngày):** Chìa khóa dự phòng (cất trong két sắt) để xin cấp lại Access Token mới mà user không cần nhập lại pass.
#### 🗣️ Interview-ready answer

> “I usually use JWT authentication for APIs because it’s stateless and scales well, especially for SPA or mobile clients.”



### 4️⃣ Permissions — **AI ĐƯỢC VÀO HAY KHÔNG?** 🚪

Talking Point: "IsAuthenticated, IsAdminUser, Custom logic."
#### 🧠 Tư duy

👉 Auth = _who you are_  
👉 Permission = _what you can do_

Sau khi biết "Bạn là ai" (Auth), hệ thống sẽ check "Bạn được phép làm gì" (Perm).
#### 🔹 Built-in permissions

`permission_classes = [IsAuthenticated]`

- `IsAuthenticated` : Có đăng nhập mới được xem. (Ví dụ: Xem trang Profile).
    
- `IsAdminUser` : Phải là Staff/Superuser mới được xem. (Ví dụ: Trang quản lý nhân sự).

**✨ Custom Permissions (Override `has_object_permission`):**

- Cái này quan trọng nhất để thể hiện trình độ.
    
- **Bài toán:** Ai cũng xem được bài đăng (Post), nhưng chỉ **tác giả** bài đăng mới được **Sửa/Xóa**.
    
- **Giải pháp:**
	- ``` 
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # 1. Nếu chỉ xem (GET, HEAD, OPTIONS) -> OK cho qua
        if request.method in permissions.SAFE_METHODS:
            return True

        # 2. Nếu muốn Sửa/Xóa (PUT, DELETE) -> Check xem user hiện tại có phải chủ sở hữu (obj.owner) không?
        return obj.owner == request.user
	  ```
📌 Dùng khi:

- User chỉ được sửa data của mình
    
- Object-level security

#### 🗣️ Interview-ready answer

> “I use permission classes to control access at both the view and object level, and I write custom permissions when business rules require it.”



## Tổng kết Session 1
- **Structure:** Gọn gàng với `apps/`. modular apps
    
- **Views:** Biết khi nào dùng ViewSet (nhanh - CRUD) vs APIView (custom).
    
- **Serializers:** validation + transformation biết cách "biến hình" dữ liệu với `SerializerMethodField`. Custom Serializer (complex data), `ModelSerializer = CRUD` 
    
- **Auth/Perm:** Permissions = access control, hiểu sâu về JWT và Custom Permission (IsOwner).

🌱 **Senior mindset (cực quan trọng):**

> Django không mạnh vì code ít  
> Django mạnh vì **structure rõ + rule rõ**

