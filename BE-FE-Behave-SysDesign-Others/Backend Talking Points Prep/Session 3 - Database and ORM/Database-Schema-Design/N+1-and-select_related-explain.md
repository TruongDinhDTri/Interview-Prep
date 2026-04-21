# N+1 Query Problem & select_related 📐
> Session ghi lại: Q&A flow, click moments, aha moments, examples đầy đủ

---

## 🔍 Bước 1 — Khám phá N+1 từ code thực tế

**Hadriel đưa ra đoạn code:**

```python
orders = Order.objects.all()
for order in orders:
    print(order.customer.name)
```

**Hadriel hỏi:** "Đoạn code này thực thi bao nhiêu câu SQL query nếu có 100 orders?"

**Wiganz trả lời:** *"1 câu query để lấy được 100 orders đúng hong? Xong đó với mỗi order thì sẽ query 1 câu là order.customer.name => là tổng 101 câu nhỉ?"*

> 💡 **AHA MOMENT #1 — Wiganz tự khám phá N+1!**
> Không cần giải thích — em tự trace ra 101 queries từ code.

```
1 query lấy tất cả orders    → 1
100 queries lấy customer.name → 100
──────────────────────────────────
TỔNG:                          101 queries  ← đây là N+1!
```

---

## ⚡ N+1 là gì?

```
N+1 Problem = 1 query lấy list
            + N queries cho từng item trong list

Với 100 orders   → 101 queries
Với 1000 orders  → 1001 queries
Với 10000 orders → 10001 queries  💀
```

---

## 💀 Tại sao N+1 tệ?

**Hadriel hỏi:** "Tại sao 101 queries lại tệ hơn 1 query?"

**Wiganz trả lời:** *"thì đơn giản là 101 nhiều lần hơn 1"*

✅ Đúng! Và cụ thể hơn — mỗi query là 1 lần Django phải **"gõ cửa" database**:

```
❌ N+1 — gõ cửa 101 lần:
"Cho tôi orders!"           → DB xử lý → trả về
"Tên customer order 1?"     → DB xử lý → trả về
"Tên customer order 2?"     → DB xử lý → trả về
... × 100 lần

✅ 1 query — gõ cửa 1 lần:
"Cho tôi orders + customers luôn!" → DB xử lý → trả về hết 1 lần
```

Giống đi chợ mua 100 món — đi **100 chuyến** vs đi **1 chuyến** mang hết về. 🛒

> 💡 **Insight quan trọng:** N+1 là bug **im lặng** — code chạy đúng, kết quả đúng, nhưng chậm dần theo data. 10 orders? Ổn. 10,000 orders? Server die. 💀 Django không tự warn về N+1 — phải tự nhận ra.

---

## 🔍 Bước 2 — Tại sao `order.customer.name` lại query thêm?

**Wiganz hỏi:** *"select * from customer where id = 1 vậy thì liên quan gì order?"*

**Giải thích:** Khi em viết `order.customer.name` — Django **tự động** chạy câu query này bên dưới:

```sql
SELECT * FROM customers WHERE id = [customer_id của order đó]
```

Mỗi order có `customer_id` khác nhau nên:
```
order 1 có customer_id = 5  → SELECT * FROM customers WHERE id = 5
order 2 có customer_id = 12 → SELECT * FROM customers WHERE id = 12
order 3 có customer_id = 5  → SELECT * FROM customers WHERE id = 5  (lại!)
```

Django không biết trước em sẽ cần customer — nên **lazy load**: hỏi DB từng cái một khi cần. 😅

> 💡 **Click Moment #2:** `order.customer.name` trông vô hại nhưng bên dưới Django đang âm thầm bắn SQL mỗi lần loop. Đây là lý do N+1 "im lặng" — nhìn code không thấy gì sai.

---

## ✅ Bước 3 — Fix với select_related

**Wiganz đoán:** *"JOIN đơn giản thôi hả? Kiểu 2 bảng đó có liên hệ, query 1 câu lấy 2 cột luôn?"*

> 💡 **AHA MOMENT #3 — Wiganz tự nghĩ ra JOIN là solution!**

**Đúng!** Và Django có `select_related()` để làm đúng cái đó:

```python
# ❌ N+1 — 101 queries chạy
orders = Order.objects.all()
# SQL: SELECT * FROM orders
for order in orders:
    print(order.customer.name)
    # SQL: SELECT * FROM customers WHERE id = 1
    # SQL: SELECT * FROM customers WHERE id = 2
    # SQL: SELECT * FROM customers WHERE id = 3
    # ... × 100 lần

# ✅ select_related — CHỈ 1 query chạy
orders = Order.objects.select_related('customer').all()
# SQL: SELECT orders.*, customers.*
#      FROM orders
#      JOIN customers ON orders.customer_id = customers.id
for order in orders:
    print(order.customer.name)
    # Không query gì thêm — data đã có sẵn trong RAM rồi!
```

---

## 🤔 Bước 4 — "Ủa 2 cái code nhìn y chang nhau mà?"

**Wiganz hỏi:** *"Ủa rồi cái này nó y chang câu trên mà ta — select_related con mẹ gì đó liên quan gì???"*

> 💡 **Câu hỏi VÀNG!** Nhìn bề ngoài code y chang — nhưng SQL bên dưới hoàn toàn khác!

**Khác nhau ở SQL chạy bên dưới:**

| | `Order.objects.all()` | `Order.objects.select_related('customer').all()` |
|---|---|---|
| **Queries** | 1 + N | 1 |
| **Cơ chế** | Lazy load: hỏi DB từng cái khi cần | Eager load: JOIN trước, load hết vào RAM |
| **Vòng for** | Mỗi `order.customer.name` → query DB | Đọc từ RAM, 0 query thêm |

---

## 🤔 Bước 5 — "SELECT orders.*, customers.* là gì?"

**Wiganz hỏi:** *"Hỏi syntax của cái SELECT á — là những gì sẽ hiện ra sau khi kết quả trả về đúng không? orders.*, customers.* là trả về cả 2 bảng đúng không?"*

**Đúng!** `*` = **tất cả cột** của bảng đó:

```sql
SELECT orders.*, customers.*
--     ^^^^^^^^  ^^^^^^^^^^
--     tất cả    tất cả
--     cột của   cột của
--     orders    customers
```

Kết quả trả về 1 row **gộp luôn cả 2 bảng**:

```
| order_id | quantity | customer_id | customer_name | customer_city |
|----------|----------|-------------|---------------|---------------|
| 1        | 2        | 501         | Wiganz        | HCMC          |
| 2        | 1        | 502         | Triết         | Hanoi         |
| 3        | 5        | 501         | Wiganz        | HCMC          |
```

Django load cái bảng này vào **RAM 1 lần** → `order.customer.name` chỉ đọc cột `customer_name` từ RAM. Không hỏi DB nữa! ✅

> 💡 **Click Moment #4:** `select_related` không thay đổi cách em viết code trong vòng for — nó chỉ thay đổi **cách Django fetch data trước khi vào vòng for**.

---

## 🐍 Raw SQL tương đương

**Wiganz viết (sai):**
```sql
SELECT customer_name, order
FROM customer
WHERE customer.customer_name = order.customer_name
```

**Sửa lại đúng:**
```sql
-- ✅ Đúng — JOIN dựa trên ID (foreign key), không phải tên!
SELECT orders.*, customers.name
FROM orders
JOIN customers ON orders.customer_id = customers.id
```

> ⚠️ JOIN dựa trên **ID** (foreign key), không phải tên — vì tên có thể **trùng nhau**!

---

## 📊 Tóm tắt so sánh

| | **N+1** | **select_related** |
|---|---|---|
| **Queries** | 1 + N | 1 |
| **Cơ chế** | Lazy load | Eager load (JOIN) |
| **SQL** | SELECT + N × SELECT | SELECT + JOIN |
| **RAM** | Load từng cái | Load hết 1 lần |
| **Code vòng for** | Giống nhau bề ngoài | Giống nhau bề ngoài |
| **Khi nào tệ** | Data càng nhiều càng chết | Ổn với mọi kích thước |

---

## 💡 Tất cả Click Moments tổng hợp

| # | Click Moment | Nội dung |
|---|---|---|
| 1 | Tự tính ra 101 queries | 1 query list + N queries từng item = N+1 |
| 2 | `order.customer.name` lazy load | Django âm thầm bắn SQL mỗi lần gọi `.customer` |
| 3 | Tự nghĩ ra JOIN là fix | `select_related` = JOIN 2 bảng trong 1 query |
| 4 | Code nhìn y chang nhưng SQL khác | Sự khác biệt nằm ở SQL bên dưới, không phải code bề ngoài |
| 5 | `SELECT *` trả về merged table | Kết quả gộp 2 bảng, load vào RAM 1 lần |

---

## 🎯 Tóm tắt 1 câu

> **N+1 = lazy load từng item trong vòng for → N queries thừa. Fix bằng `select_related` để Django JOIN trước, load hết vào RAM 1 lần.**
