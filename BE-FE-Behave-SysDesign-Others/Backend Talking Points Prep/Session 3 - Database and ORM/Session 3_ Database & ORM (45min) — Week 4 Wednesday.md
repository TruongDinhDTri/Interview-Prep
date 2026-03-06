
# PART 1: PRACTICE ANSWERING

## Q1: "How do you design database schema?"
**Câu trả lời mẫu:** "My process starts with **Business Requirements** first, not tables.
✅ **Câu trả lời chuẩn phỏng vấn**

> “I start by understanding the business requirements, then identify the core entities and their relationships.  
> I normalize the schema to reduce redundancy and maintain data integrity, usually up to 3NF.  
> If the system is read-heavy or performance-critical, I selectively denormalize certain fields.”

1. **Identify Entities & Relationships:** I map out the objects (Users, Products) and how they relate (One-to-Many, Many-to-Many).
    
2. **Normalization (1NF-3NF):** I strictly apply normalization rules initially to ensure data integrity and avoid redundancy.
    
3. **Data Types & Constraints:** Choosing correct types (Postgres JSONB vs Text) and enforcing constraints (Unique, Not Null) at the DB level.
    
4. **Optimization/Denormalization:** Finally, I look at access patterns. If a system is **read-heavy**, I might intentionally **denormalize** specific tables (like caching a count) to trade write speed for read performance."
### Example: Practice Question #1


#### 📌 **Ví dụ cụ thể**

#### 🧩 Bài toán (interviewer hay dùng)

> “Design a database for a job application system.”

---

#### 🪜 Step 1: Hiểu requirement (nói ra miệng)

- User có thể apply nhiều job
    
- Company đăng nhiều job
    
- Mỗi application thuộc về **1 user + 1 job**
    

---

#### 🧱 Step 2: Xác định entities

👉 Ta có 4 entity chính:

- **User**
    
- **Company**
    
- **Job**
    
- **Application**
    

---

#### 🗂️ Step 3: Thiết kế bảng (đã normalize)

#### 👤 User

|id|name|email|
|---|---|---|

---

#### 🏢 Company

|id|name|
|---|---|

---

#### 💼 Job

|id|title|company_id|
|---|---|---|

➡️ `company_id` là **ForeignKey**

---

#### 📄 Application

|id|user_id|job_id|status|created_at|
|---|---|---|---|---|

➡️ **Application là bảng trung gian**  
➡️ Không lặp user info, không lặp job info

---

#### ✅ Step 4: Áp dụng Normalization (nói cho interviewer)

- **1NF**:
    
    - Mỗi field là giá trị đơn (không list, không array)
        
- **2NF**:
    
    - Application phụ thuộc **đầy đủ** vào user + job
        
- **3NF**:
    
    - Không lưu company name trong Application
        

---

#### ⚡ Step 5: Denormalize (nếu cần performance)

Ví dụ:

- Trang dashboard hiển thị **số job user đã apply**
    
- Thay vì `COUNT(*)` mỗi lần → thêm:
    

`User - application_count`

👉 Interview line:

> “For read-heavy dashboards, I may denormalize some aggregated fields for performance.”

---

#### 🎯 Cuối cùng – CÂU TRẢ LỜI KÈM VÍ DỤ (rất mạnh)

> “For example, in a job application system, I model users, companies, jobs, and applications as separate tables.  
> Applications act as a join table between users and jobs.  
> I normalize the schema to avoid duplication, and only denormalize aggregated fields when performance requires it.”









## Q2: "How do you optimize slow queries?"

_(Câu này kiểm tra kỹ năng debugging & tools)_

**Câu trả lời mẫu:** "I follow a 'Measure, Don't Guess' approach:

1. **Identify Bottlenecks:** Use tools like **Django Debug Toolbar** (dev) or **Silk** (prod) to spot slow queries.
    
2. **Analyze Query Plan:** Use `EXPLAIN ANALYZE` in SQL to see if the DB is doing a full table scan or using indexes.
    
3. **Fix N+1 Problems:** Check if loops are triggering queries. Use `select_related` for FKs and `prefetch_related` for M2M.
    
4. **Indexing:** Ensure columns used in filtering/sorting are indexed.
    
5. **Refactor:** If ORM is generating bad SQL, I drop down to **Raw SQL** or restructure the query."

### Example
#### ✅ CÂU TRẢ LỜI CHUẨN (ông có thể nói y nguyên)

> “First, I identify the slow query using logs or profiling tools.  
> Then I reduce query cost by fixing N+1 problems, using proper ORM optimizations, and adding indexes where necessary.  
> Finally, for read-heavy cases, I consider caching.”

---

#### 🧠 GIỜ GIẢI THÍCH BẰNG VÍ DỤ (để ông HIỂU, không học vẹt)

##### 📌 Tình huống

Trang admin hiển thị:

- 100 applications
    
- Mỗi application cần hiển thị **user name**
    

---

##### ❌ Code chậm (N+1 queries)

```sql
applications = Application.objects.all()  
for app in applications:     
	print(app.user.name)  # mỗi vòng hit DB
```

👉 1 query lấy applications  
👉 +100 query lấy user  
👉 = **101 queries**

---

##### ✅ Fix chậm bằng ORM optimization

```sql
applications = Application.objects.select_related('user').all()  
for app in applications:     
	print(app.user.name)
```

👉 **1 query duy nhất** (JOIN)  
👉 Tốc độ tăng rõ rệt 🚀

---

#### 🧩 Các cách optimize (để ông nói trôi chảy)

1. **Detect**
    
    - Log
        
    - Debug toolbar
        
2. **Reduce number of queries**
    
    - Fix N+1
        
3. **Use ORM correctly**
    
    - `select_related`
        
    - `prefetch_related`
        
4. **Add indexes**
    
    - WHERE / ORDER BY
        
5. **Cache nếu cần**
    

---

#### 🎯 CÂU CHỐT ĂN ĐIỂM

> “I focus on reducing the number of database hits first, because that usually gives the biggest performance improvement.”


## Q3: "Explain your indexing strategy"

_(Câu này kiểm tra kiến thức về cost/benefit)_

**Câu trả lời mẫu:** "I don't index everything because indexes slow down **Write operations** (INSERT/UPDATE). My strategy is:

1. **Target High-Traffic Columns:** Index fields used frequently in `WHERE`, `ORDER BY`, and `JOIN` conditions.
    
2. **Foreign Keys:** Usually indexed by default, but I verify them.
    
3. **Composite Indexes:** For queries filtering by multiple columns (e.g., `status='active'` AND `created_at > date`), I create a composite index instead of two separate ones.
    
4. **Cardinality:** I avoid indexing low-cardinality columns (like Gender: M/F) unless combined with others, as the DB ignores them anyway."

> I add indexes to fields that are frequently used in filtering, sorting, and joins.  
> I avoid over-indexing because each index improves read performance but slows down write operations.

---

### 🧠 How I Think About Indexing

#### 📌 I usually add indexes for:

- Fields used in **`WHERE`** clauses (filtering)
    
- Fields used in **`ORDER BY`** (sorting)
    
- Fields used in **`JOIN`** conditions  
    _(Foreign Keys are auto-indexed in Django)_
    

---

### 🧪 Example (Realistic Scenario)

Filtering and sorting applications:

```python
Application.objects.filter(status="PENDING").order_by("-created_at")
```

### 👉 Recommended indexes:

- `status`
    
- `created_at`
    

---

### 🛠️ Django Model Example

```python
class Application(models.Model):
    status = models.CharField(max_length=20, db_index=True)
    created_at = models.DateTimeField(db_index=True)
```

---

### ⚖️ Why I Don’t Over-Index

- Each index speeds up **reads**
    
- But **slows down writes** (INSERT / UPDATE / DELETE)
    
- Consumes extra memory and storage
    

> Indexing is always a **trade-off**.

---

### 🎯 Strong Closing Line (Interview Gold)

> I design indexes based on real query patterns and usage, not assumptions.

---

### 🧠 Key Takeaways

- Index what you **filter**, **sort**, and **join**
    
- Foreign keys are auto-indexed
    
- Avoid indexing rarely-used or frequently-updated fields
    
- Always think in terms of **read vs write trade-offs**
    

---

> _“The plans of the diligent lead surely to abundance.” — Proverbs 21:5_ 🌿



## Q4: "What's the N+1 query problem and how do you solve it?"

_(Câu này buộc phải biết, trả lời ngắn gọn, súc tích)_

**Câu trả lời mẫu:** "The N+1 problem happens when the code fetches a list of parent objects (1 query), then iterates through them to fetch related child objects individually (N queries). This kills performance. **Solution:**

- I use **`select_related()`** for One-to-One and Foreign Keys (creates a SQL JOIN).
    
- I use **`prefetch_related()`** for Many-to-Many and Reverse Foreign Keys (does a separate lookup query and joins in Python)."

### Short Interview Answer (Model Answer)

> The N+1 query problem happens when the application runs one query to fetch a list of objects, and then N additional queries to fetch related data.  
> I solve it by using ORM optimizations like `select_related` for foreign keys and `prefetch_related` for many-to-many or reverse relationships.

---

### 🧠 What Is the N+1 Problem?

- **1 query** → fetch a list of objects
    
- **N queries** → fetch related data for each object
    

👉 Total queries = **1 + N**  
👉 Causes unnecessary database load and slow performance

---

### 🧪 Example (BAD – N+1 Queries)

```python
applications = Application.objects.all()

for app in applications:
    print(app.user.name)  # Hits the DB every loop
```

#### ❌ What happens?

- 1 query to get applications
    
- N queries to get each user
    
- Example: 100 applications → **101 queries**
    

---

### ✅ Solution #1: `select_related()`

> Use for **ForeignKey** and **OneToOne** relationships

```python
applications = Application.objects.select_related('user').all()

for app in applications:
    print(app.user.name)  # No extra DB queries
```

#### ✔️ Why it works

- Uses **SQL JOIN**
    
- Fetches related objects in **one query**
    

---

#### 🧪 Example (BAD – Reverse N+1)

```python
companies = Company.objects.all()

for company in companies:
    print(company.applications.count())  # Hits DB every time
```

---

### ✅ Solution #2: `prefetch_related()`

> Use for **ManyToMany** and **reverse ForeignKey** relationships

```python
companies = Company.objects.prefetch_related('applications').all()

for company in companies:
    print(company.applications.count())  # No extra DB queries
```

#### ✔️ Why it works

- Executes **2 queries total**
    
- Combines results in Python
    

---

### 🧠 When to Use Which?

|Relationship Type|Use|
|---|---|
|ForeignKey|`select_related()`|
|OneToOne|`select_related()`|
|ManyToMany|`prefetch_related()`|
|Reverse FK|`prefetch_related()`|

---

### 🎯 Strong Closing Line (Interview Gold)

> Fixing N+1 queries is often the fastest way to improve backend performance.

---

### 🧠 Key Takeaways

- N+1 = 1 query for list + N queries for related data
    
- Always watch query counts
    
- Use `select_related` and `prefetch_related` correctly
    
- Measure before and after fixing
    

---

> _“The prudent see danger and take refuge.” — Proverbs 22:3_ 🌿





# PART 2: KEY TALKING POINTS
Đây là phần ông dùng để đào sâu nếu họ hỏi thêm.

## 1. Normalization Principles (Nguyên tắc chuẩn hóa)

Khi họ hỏi sâu về Normalization, hãy nhớ 3 mốc này:

- **1NF (Atomic Values):**
    
    - _Ý chính:_ Một ô (cell) chỉ chứa một giá trị duy nhất. Không lưu danh sách dạng `comma-separated` (ví dụ: "red,blue,green") trong 1 cột.
        
    - _Tại sao:_ Để query và index được từng giá trị.
    
    - Each field should contain **atomic (indivisible) values**.
    - ❌ Bad example:

```text
tags = ["python", "django"]
```

✅ Good approach:

- Separate table
    
- Or Many-to-Many relationship
    

📌 Interview line:

> “In 1NF, every column should store a single value, not arrays or lists.”



        
- **2NF (No Partial Dependencies):**
    
    - _Ý chính:_ Tất cả các cột không phải khóa chính phải phụ thuộc vào _toàn bộ_ khóa chính (quan trọng với bảng có khóa chính ghép - composite PK).

> Non-key attributes must depend on the **entire primary key**.

- Mostly relevant with **composite primary keys**
    
- Avoid attributes depending on only part of the key
    

📌 Interview line:

> “2NF ensures that non-key fields fully depend on the whole primary key.”

---


        
- **3NF (No Transitive Dependencies):**
    
    - _Ý chính:_ Cột B phụ thuộc cột A, cột A phụ thuộc ID. -> Tách bảng ra. Ví dụ: Trong bảng `Order`, không lưu `CustomerAddress`, chỉ lưu `CustomerID`. Địa chỉ phải nằm ở bảng `Customer`.
 > Non-key attributes should depend **only on the primary key**, not on other non-key fields.

❌ Bad example:

```text
Application → company_id → company_name
```

✅ Good approach:

- Store `company_name` in `Company` table only
    

📌 Interview line:

> “3NF removes transitive dependencies to improve data integrity.”

---

        
- **Khi nào Denormalize (Phản chuẩn hóa)?**
    
    - Keyword: **Read-Heavy Systems**.
        
    - Ví dụ: Trang chủ Facebook load `Post`. Nếu mỗi lần load post phải `COUNT(*)` từ bảng `Comments` (hàng triệu dòng), DB sẽ chết.
        
    - Giải pháp: Thêm cột `comment_count` vào bảng `Post`. Update cột này mỗi khi có comment mới. Đọc cực nhanh, nhưng ghi chậm hơn xíu.

## 2. Query Optimization - The Big Two (Vũ khí chính)

Ông phải phân biệt rõ cơ chế hoạt động của 2 thằng này:

- **`select_related()` (Dùng cho **ForeignKey** and **OneToOne** relationships):**
    
    - **Cơ chế:** Dùng **SQL JOIN**. Nó gộp bảng lại trong 1 câu lệnh SQL duy nhất.
        
    - **Code:**
#### ❌ BAD — N+1 Queries

```python
applications = Application.objects.all()
for app in applications:
    print(app.user.name)
```

- 1 query for applications
    
- N queries for users
    
#### ✅ GOOD - Python Single JOIN Query
```python
        applications = Application.objects.select_related('user').all()
		for app in applications:
		    print(app.user.name)

```
📌 Interview line:

> “I use select_related to avoid N+1 queries for foreign key relationships.”   


- **`prefetch_related()` (ManyToMany** and **reverse ForeignKey** relationships):
    
    - **Cơ chế:** Thực hiện **2 Queries**.
        
        1. Lấy danh sách cha.
            
        2. Lấy danh sách con có ID nằm trong danh sách cha (`WHERE id IN (...)`).
            
        3. Django ghép (join) chúng lại bằng Python trong bộ nhớ RAM.
            
#### ❌ BAD — N+1 Queries

```python
companies = Company.objects.all()
for company in companies:
    print(company.applications.count())
```

#### ✅ GOOD — Optimized Queries

```python
companies = Company.objects.prefetch_related('applications').all()
for company in companies:
    print(company.applications.count())
```

✔ Executes **2 queries total**  
✔ Combines results in Python

📌 Interview line:

> “I use prefetch_related for many-to-many or reverse relationships.”


## 3. Indexing Strategy (Chiến thuật Index)

Nhớ kỹ 3 chỗ cần đặt Index:

1. **Filtering:** Các cột hay nằm sau chữ `WHERE` (ví dụ: `email`, `username`, `status`).
    
2. **Sorting:** Các cột hay nằm sau chữ `ORDER BY` (ví dụ: `created_at`).
    
3. **Joining:** Fields used in **JOIN** conditions  _(Foreign keys are auto-indexed in Django)

🛠️ Django Example

```python
class Application(models.Model):
    status = models.CharField(max_length=20, db_index=True)
    created_at = models.DateTimeField(db_index=True)
```


- **Lưu ý "Chết người":** Đừng index bừa bãi!
	- Each index speeds up **reads
    
    - Mỗi cái Index là một cấu trúc dữ liệu cây B-Tree tốn bộ nhớ.
        
    - Khi ông `INSERT` hoặc `UPDATE`, DB phải chạy đi sắp xếp lại cái cây đó -> Làm chậm hệ thống ghi.

> “Indexing is a trade-off between read performance and write cost.”

## 4. Many-to-Many Through Models (Mô hình trung gian)
> Use a through model when you need **extra data** in a many-to-many relationship.

Đây là câu hỏi để phân loại Junior và Senior.

- **Vấn đề:** Mặc định `ManyToManyField` của Django tạo một bảng ẩn chỉ có 2 cột ID.
    
- **Khi nào dùng `through`?** Khi mối quan hệ đó có **thông tin riêng**.
    
- **Ví dụ huyền thoại: `Enrollment` (Đăng ký học)**.
    
    - Sinh viên A học Lớp B.
        
    - Nhưng học lúc nào? (`enrolled_date`)
        
    - Được mấy điểm? (`grade`)
        
    - -> Những thông tin này không thuộc về Sinh viên, cũng không thuộc về Lớp học. Nó thuộc về **mối quan hệ** giữa hai bên.
        

Python

```python
class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    # Đây là lý do dùng through model:
    enrolled_date = models.DateField()
    grade = models.CharField(max_length=2)
```
> “I use through models when the relationship itself has attributes.”
### 🔁 Many-to-Many Through Models

> 

```python
class Enrollment(models.Model):
    student = models.ForeignKey(Student)
    course = models.ForeignKey(Course)
    enrolled_date = models.DateField()
    grade = models.CharField(max_length=2)
```
### 🧠 Final Mental Model (Interview Ready)

- Normalize first, denormalize when needed
    
- Fix N+1 before touching indexes
    
- Use `select_related` vs `prefetch_related` correctly
    
- Index based on real query patterns
    

> _“Acknowledge Him, and He’ll guide your path.” — Proverbs 3:6_ 🌿