# 3NF — Third Normal Form 📐
> Session ghi lại: Q&A flow, click moments, aha moments, examples đầy đủ

---

## 🧱 Bước 1 — Nền tảng: 2NF trước

Trước khi 3NF, phải nắm 2NF:
> **2NF** = non-key phải phụ thuộc hoàn toàn vào composite PK — không được partial dependency.

3NF **xây dựng trên nền** 2NF. Nhưng 3NF attack một loại vấn đề khác.

---

## 🔍 Bước 2 — "Phụ thuộc" nghĩa là gì?

**Hadriel hỏi:** "Tại sao `customer_id` lại phụ thuộc vào `order_id`? Phụ thuộc là sao?"

**Định nghĩa đơn giản:**
> **"A phụ thuộc vào B" = biết B → xác định được A**

```
Biết order_id = 1 → xác định được customer_id = 501  ✅
Biết order_id = 2 → xác định được customer_id = 502  ✅
```

Mỗi order thuộc về **đúng 1 customer** → biết order nào là biết customer nào.

---

**Wiganz hỏi ngược lại:** *"Thế ngược lại thì sao? Biết customer_id có xác định được order_id không?"*

**Câu trả lời:** ❌ KHÔNG! Nhìn vào data:

| **order_id** | **customer_id** | **customer_name** | **customer_city** | **quantity** |
|---|---|---|---|---|
| 1 | 501 | Wiganz | HCMC | 2 |
| 2 | 502 | Triết | Hanoi | 1 |
| 3 | 501 | Wiganz | HCMC | 5 |

Wiganz (customer_id = 501) có **2 orders** (order 1 và order 3). Biết `customer_id = 501` → không biết order nào là order 1 hay order 3!

> **💡 AHA MOMENT #1 — Wiganz tự khám phá:** *"Do 1 customer_id ra tới 2 order_id thế thì làm sao biết được cái order_id nào là cái nào. Để xác định được chính xác 1 record thì tiên quyết nhất là order_id vì chỉ nó mới có thể xác định đúng record."*

✅ **Dependency là một chiều!** Biết B xác định được A → A phụ thuộc B. Chiều ngược lại không tính.

---

## ⚡ Bước 3 — Transitive Dependency là gì?

**Hadriel hỏi:** "`customer_city` phụ thuộc vào `order_id`, hay phụ thuộc vào `customer_id`?"

**Wiganz trả lời:** *"customer_city phụ thuộc vào customer_id chớ"*

✅ **ĐÚNG! AHA MOMENT #2** — `customer_city` chỉ cần `customer_id`, không cần `order_id`.

Nhưng chú ý: `customer_id` bản thân nó **không phải PK**, nó là non-key column!

Vậy ta có chuỗi:

```
order_id ──→ customer_id ──→ customer_city
   PK           non-key          non-key
               (trung gian)
```

`customer_city` phụ thuộc vào PK một cách **GIÁN TIẾP** — đi qua `customer_id` làm trung gian.

> **Đây là Transitive Dependency — phụ thuộc bắc cầu qua non-key trung gian.**

---

## 💀 Bước 4 — Tại sao Transitive Dependency lại tệ?

**Hadriel hỏi:** "Nếu Wiganz chuyển từ HCMC sang Hanoi — phải update bao nhiêu rows?"

**Wiganz trả lời:** *"2 rows hả?"*

✅ **ĐÚNG!** Order 1 và Order 3 đều có `customer_city = HCMC`. Và nếu 10,000 orders của Wiganz → update 10,000 rows. Miss 1 row:

```
order 1    | Wiganz | Hanoi  ← updated
order 500  | Wiganz | HCMC   ← missed!
order 3000 | Wiganz | Hanoi  ← updated
```

**Data inconsistency!** Wiganz sống ở 2 thành phố cùng lúc trong DB. 💀

---

## 🏠 Metaphor: Căn nhà cho thuê

Bảng Order giống như một **căn nhà cho thuê**:
- **Chủ nhà (PK):** `order_id`
- **Người thuê trọ:** `customer_id`
- **Vợ của người thuê:** `customer_name`, `customer_city`

Bạn gõ cửa nhà #123 → thấy cô vợ (`customer_name`) ngồi xem tivi.
- Về hiện tượng: gõ cửa nhà #123 là thấy cô vợ — cảm giác "trực tiếp."
- Về bản chất: cô vợ là vợ của anh chồng (`customer_id`), **không phải vợ của căn nhà**.

Nếu anh chồng dọn đi chỗ khác → cô vợ đi theo, không ở lại với căn nhà #123.

> → `customer_name` KHÔNG quan tâm tới `order_id`. Nó chỉ "đi ké" anh chồng vào ở trọ.

---

## ✅ Bước 5 — Fix: Tách bảng

**Hadriel hỏi:** "`customer_city` phụ thuộc vào `customer_id` → nó nên sống ở đâu?"

**Wiganz trả lời:** *"nó nên sống ở bảng customer hả?"*

✅ **ĐÚNG! AHA MOMENT #3** — tách ra bảng riêng!

```
❌ BEFORE (vi phạm 3NF):
Orders: (order_id, customer_id, customer_name, customer_city, quantity)

✅ AFTER (đạt 3NF):
Orders:    (order_id, customer_id, quantity)
Customers: (customer_id, customer_name, customer_city)
```

Wiganz chuyển nhà → update **1 row** trong `Customers`. Done. ✅

---

## 🎯 Bước 6 — Wiganz tự rút ra định nghĩa 3NF

**Wiganz tự phát biểu:** *"3NF cũng vậy, non-key phải phụ thuộc hoàn toàn vào PK key, không được transitive dependency hả?"*

✅ **PERFECT! Đây là lúc 3NF thực sự được forge vào não.** 🔥

---

## 🆚 So sánh 2NF vs 3NF

```
2NF = non-key phụ thuộc hoàn toàn vào composite PK
      → không được partial dependency
      → xảy ra khi có COMPOSITE PK

3NF = non-key phụ thuộc THẲNG vào PK
      → không được transitive dependency
      → xảy ra khi non-key phụ thuộc vào non-key khác
```

| | **2NF** | **3NF** |
|---|---|---|
| **Vấn đề** | Partial dependency | Transitive dependency |
| **Kẻ gây rối** | Non-key phụ thuộc vào *1 phần* composite PK | Non-key phụ thuộc vào *non-key khác* |
| **Fix** | Tách bảng theo partial PK | Tách bảng theo non-key trung gian |
| **Django** | ForeignKey | ForeignKey |

---

## 🐍 Django Connection

```python
# ❌ Vi phạm 3NF — nhét customer info vào Orders
class Order(models.Model):
    customer_id = models.IntegerField()
    customer_name = models.CharField(...)   # thuộc về Customer, không phải Order!
    customer_city = models.CharField(...)   # thuộc về Customer, không phải Order!
    quantity = models.IntegerField()

# ✅ 3NF đúng — tách bảng, dùng ForeignKey
class Customer(models.Model):
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100)

class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    quantity = models.IntegerField()

# Lấy city — Django tự JOIN
order.customer.city
```

---

## 💡 Tất cả Click Moments tổng hợp

| # | Click Moment | Nội dung |
|---|---|---|
| 1 | Dependency là một chiều | Biết order_id → biết customer_id ✅ nhưng ngược lại ❌ vì 1 customer có nhiều orders |
| 2 | `customer_city` transitive dep | Phụ thuộc vào `customer_id` (non-key), không phải thẳng vào PK |
| 3 | Fix = tách bảng | `customer_city` sống trong bảng Customers riêng |

---

## 📋 Quy tắc nhớ nhanh

```
Một table = 1 entity

Trong bảng chỉ nên có:
  ✅ Thuộc tính của entity đó
  ✅ Foreign keys (pointer sang entity khác)

KHÔNG chứa thuộc tính của entity khác.
```

---

## 🎯 Tóm tắt 1 câu (Wiganz's own words)

> **"3NF: non-key phải phụ thuộc hoàn toàn vào PK — không được transitive dependency."**

---

## 💬 Câu trả lời phỏng vấn (English)

> "Every non-key field must depend directly on the primary key, not on another non-key field. If a column describes another entity rather than this table's entity, it belongs in that other table — reference it with a foreign key."
