# prefetch_related vs select_related 📐
> Toàn bộ hành trình thấu hiểu — Q&A, click moments, aha moments, tranh luận, ví dụ, metaphors

---

## 🧱 Nền tảng — Đã biết trước khi vào topic này

Từ N+1 battle trước:
- `select_related` = dùng **JOIN**, fix N+1 cho ForeignKey (1→1)
- Nhưng khi relationship là **1→N** (1 customer nhiều orders) thì sao?

---

## 🔍 Bước 1 — Vấn đề của select_related với 1→N

**Hadriel đặt câu hỏi:** "Nếu 1 customer có NHIỀU orders, `select_related` có dùng được không?"

```python
customers = Customer.objects.all()
for customer in customers:
    print(customer.orders.all())  # mỗi customer có N orders
```

**Hadriel show kết quả JOIN:**

```
| customer_id | customer_name | order_id | quantity |
|-------------|---------------|----------|----------|
| 501         | Wiganz        | 1        | 2        |
| 501         | Wiganz        | 3        | 5        |  ← Wiganz bị duplicate!
| 502         | Triết         | 2        | 1        |
```

**Wiganz trả lời:** *"ko sao, ổ 1 customer có nhiều order mà"*

**Hadriel giải thích thêm:** Về data thì không sao — nhưng nếu Wiganz có **1000 orders**:

```
| customer_name | customer_city | order_id | quantity |
|---------------|---------------|----------|----------|
| Wiganz        | HCMC          | 1        | 2        |  ← Wiganz lần 1
| Wiganz        | HCMC          | 2        | 5        |  ← Wiganz lần 2
| Wiganz        | HCMC          | 3        | 1        |  ← Wiganz lần 3
... × 1000 lần  ← "Wiganz", "HCMC" bị copy 1000 lần trong RAM! 💀
```

> 💡 **Click Moment #1:** `customer_name`, `customer_city` — toàn bộ customer data bị **copy vào mỗi row order**. 1000 orders = waste RAM × 1000.

---

## 🔍 Bước 2 — prefetch_related giải quyết bằng 2 queries

`prefetch_related` không JOIN — chạy **2 queries riêng**:

```sql
-- Query 1: lấy tất cả customers
SELECT * FROM customers

-- Query 2: lấy tất cả orders của những customers đó
SELECT * FROM orders WHERE customer_id IN (501, 502, ...)
```

**Wiganz hỏi:** *"Vậy khi nào dùng cái nào?"*

→ Hadriel giải thích thêm về cơ chế trước.

---

## 🔍 Bước 3 — "2 query đó có ý nghĩa gì? Kết quả ra sao?"

**Wiganz hỏi:** *"Chưa hiểu 2 cái query đó có ý nghĩa gì, tại sao lại query 2 cái đó và kết quả trả về của 2 query đó có ý nghĩa gì? Tại sao nó vẫn bị duplicate mà?"*

> 💡 **Câu hỏi VÀNG** — nhìn Query 2 thấy `customer_id 501` xuất hiện 2 lần, tưởng vẫn duplicate!

**Giải thích bằng metaphor 2 tờ giấy:**

```
📄 Tờ 1 — CUSTOMER LIST (Query 1):
┌─────────────────────────────┐
│ 501 | Wiganz | HCMC | ...  │  ← full info, 1 lần duy nhất!
│ 502 | Triết  | Hanoi | ... │  ← full info, 1 lần duy nhất!
└─────────────────────────────┘

📄 Tờ 2 — ORDER LIST (Query 2):
┌──────────────────────────┐
│ order 1 | 501 | qty: 2  │  ← chỉ lưu SỐ 501 (integer nhỏ)
│ order 2 | 502 | qty: 1  │  ← chỉ lưu SỐ 502
│ order 3 | 501 | qty: 5  │  ← chỉ lưu SỐ 501 (integer nhỏ)
└──────────────────────────┘
```

**Wiganz nhận ra:** *"cái vụ tờ tờ này có vẻ ổn rồi đó"* ✅

> 💡 **Click Moment #2 — Metaphor "2 tờ giấy":**
> - Tờ 2 có `501` xuất hiện 2 lần — nhưng `501` chỉ là **1 con số (integer)**, cực kỳ nhỏ!
> - Customer's full data (`name`, `city`, `email`...) chỉ sống **1 lần trên Tờ 1**
> - So với `select_related` — full Wiganz data bị copy vào MỌI row order 💀

---

## 🔍 Bước 4 — "Django tự lưu 2 list object hả?"

**Wiganz hỏi:** *"Sau khi chạy 2 cái query đó thì Django sẽ tự lưu 2 list object hả? Nói lại và đưa ví dụ lại 2 cái query đó xem"*

**Đúng!** Sau khi `Customer.objects.prefetch_related('orders')`, Django có **2 lists trong RAM**:

```python
# List 1 — từ Query 1:
customers_in_ram = [
    Customer(id=501, name="Wiganz", city="HCMC"),
    Customer(id=502, name="Triết",  city="Hanoi"),
]

# List 2 — từ Query 2:
orders_in_ram = [
    Order(id=1, customer_id=501, quantity=2),
    Order(id=2, customer_id=502, quantity=1),
    Order(id=3, customer_id=501, quantity=5),
]
```

> 💡 **AHA MOMENT #3:** `prefetch_related` = Django chạy 2 queries → lưu 2 lists riêng biệt trong RAM. Không merge, không JOIN.

---

## 🔍 Bước 5 — "Vòng for chạy thế nào? Có query DB không?"

**Wiganz hỏi:** *"Cái này thì sao? `customer.orders.all()` — nó vào trong orders xong tìm hết customer_id mà có id = gì đó hả? Kiểu SELECT * FROM ORDER WHERE ORDER = id (customer_id)??"*

**Đúng hướng!** Nhưng không query DB — **filter trong RAM**:

```python
for customer in customers:
    customer.orders.all()

# Django làm thế này TRONG RAM:

# customer = Wiganz (id=501)
# Django lọc orders_in_ram tìm customer_id == 501:
→ [Order(id=1, qty=2), Order(id=3, qty=5)]  ✅ từ RAM, 0 query DB!

# customer = Triết (id=502)
# Django lọc orders_in_ram tìm customer_id == 502:
→ [Order(id=2, qty=1)]  ✅ từ RAM, 0 query DB!
```

Giống `WHERE customer_id = 501` — nhưng **filter trong Python list**, không gõ cửa DB! 🎯

> 💡 **Click Moment #4:** `customer.orders.all()` trong vòng for **không chạy SQL**. Django đã có orders trong RAM từ trước — chỉ filter list Python.

---

## 🔍 Bước 6 — "select_related cũng thế à?"

**Wiganz hỏi:** *"À hiểu, ok vậy cái select_related cũng thế à?"*

**Cùng idea — nhưng cơ chế khác!**

```python
# select_related — 1 JOIN query, 1 list trong RAM:
orders_in_ram = [
    Order(id=1, quantity=2, customer=Customer(id=501, name="Wiganz")),
    Order(id=2, quantity=1, customer=Customer(id=502, name="Triết")),
    Order(id=3, quantity=5, customer=Customer(id=501, name="Wiganz")),
    #                                         ↑ Wiganz object được tạo LẠI — duplicate!
]

# prefetch_related — 2 queries, 2 lists trong RAM:
customers_in_ram = [Customer(id=501...), Customer(id=502...)]  # mỗi customer 1 lần!
orders_in_ram    = [Order(id=1, customer_id=501), ...]         # chỉ lưu ID
```

---

## 📊 So sánh đầy đủ

| | **select_related** | **prefetch_related** |
|---|---|---|
| **SQL** | 1 JOIN query | 2 queries riêng |
| **RAM** | 1 merged list | 2 separate lists |
| **Customer data** | Copy vào mỗi order row | Chỉ tồn tại 1 lần |
| **Vòng for** | Đọc từ RAM (customer gắn sẵn) | Filter RAM list theo customer_id |
| **Dùng khi** | ForeignKey / OneToOne (1→1) | ManyToMany / reverse FK (1→N) |
| **Vấn đề nếu dùng sai** | Duplicate RAM với 1→N | Không sai, nhưng kém hiệu quả với 1→1 |

---

## 🐍 Code thực tế

```python
# ForeignKey — order thuộc về 1 customer → select_related
orders = Order.objects.select_related('customer')
for order in orders:
    print(order.customer.name)  # 0 query thêm

# Reverse FK — customer có nhiều orders → prefetch_related
customers = Customer.objects.prefetch_related('orders')
for customer in customers:
    print(customer.orders.all())  # 0 query thêm

# ManyToMany — book có nhiều authors → prefetch_related
books = Book.objects.prefetch_related('authors')
for book in books:
    print(book.authors.all())  # 0 query thêm
```

---

## 🎯 Flow đầy đủ prefetch_related

```
Step 1: Customer.objects.prefetch_related('orders')
        → Query 1: SELECT * FROM customers
        → Query 2: SELECT * FROM orders WHERE customer_id IN (501, 502)
        → Django lưu 2 lists vào RAM

Step 2: for customer in customers:
        → customer.orders.all()
        → Django filter orders_in_ram WHERE customer_id = customer.id
        → Trả về từ RAM, 0 query DB
```

---

## 💡 Tất cả Click Moments tổng hợp

| # | Click Moment | Nội dung |
|---|---|---|
| 1 | select_related duplicate RAM | Customer full data bị copy vào mỗi order row với 1→N |
| 2 | Metaphor "2 tờ giấy" | Tờ 1 = customer data (1 lần). Tờ 2 = chỉ lưu ID (integer nhỏ) |
| 3 | Django tự lưu 2 lists | prefetch_related → 2 SQL → 2 lists riêng trong RAM |
| 4 | Vòng for filter RAM | `customer.orders.all()` = filter Python list, không gõ DB |

---

## 🎯 Khi nào dùng cái nào (1 câu nhớ mãi)

```
1 order → 1 customer    (ForeignKey, 1→1)  →  select_related
1 customer → N orders   (reverse FK, 1→N)  →  prefetch_related
Book ↔ Author           (ManyToMany)        →  prefetch_related
```

---

## 💬 Câu trả lời phỏng vấn (English)

> "Both fix the N+1 problem by loading data into RAM before the loop. `select_related` uses a SQL JOIN — best for ForeignKey and OneToOne relationships. `prefetch_related` fires two separate queries then stitches results in Python — best for ManyToMany and reverse ForeignKey, avoiding duplicate data in memory."
