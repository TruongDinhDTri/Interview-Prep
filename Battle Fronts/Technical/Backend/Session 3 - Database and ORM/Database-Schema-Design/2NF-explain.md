# 2NF — Second Normal Form 📐
> Session ghi lại: Q&A flow, click moments, aha moments, examples đầy đủ

---

## 🧱 Bước 1 — 1NF là nền tảng

**Hadriel hỏi:** "Trước khi nói 2NF — em biết gì về 1NF không?"

**Wiganz trả lời:** *"every column should be atomic values, single value no array, no list no comma"*

✅ **Đúng!** 1NF = mỗi cột chỉ chứa **atomic value** — không array, không list, không comma-separated.

> 💡 **Tại sao hỏi 1NF trước?** Vì 2NF XÂY DỰNG trên nền 1NF. Không hiểu 1NF thì 2NF sẽ mơ hồ mãi.

---

## 🔍 Bước 2 — Khám phá Partial Dependency

**Hadriel đưa ra bảng:**

| **order_id** | **product_id** | **product_name** | **quantity** | **customer_name** |
|---|---|---|---|---|
| 1 | 101 | iPhone | 2 | Wiganz |
| 1 | 102 | AirPods | 1 | Wiganz |
| 2 | 101 | iPhone | 1 | Triết |

Primary Key ở đây là **composite**: `(order_id, product_id)` — cần **cả hai** để xác định 1 row.

---

**Hadriel hỏi:** "`product_name` phụ thuộc vào cả hai cột `order_id` + `product_id`, hay chỉ phụ thuộc vào MỘT trong hai thôi?"

**Wiganz trả lời:** *"product_name phụ thuộc vào product_id thôi là đủ rồi"*

✅ **ĐÚNG! Đây là AHA MOMENT #1** — `product_name` chỉ cần `product_id`, không cần `order_id`. Đây là **Partial Dependency**.

---

**Hadriel hỏi:** "`quantity` thì sao? Nó phụ thuộc vào `product_id` thôi, hay cần cả `order_id` + `product_id`?"

**Wiganz trả lời:** *"quantity thì nó cần phụ thuộc vào cả 2 mới được"*

✅ **ĐÚNG! AHA MOMENT #2** — order 1 mua 2 iPhone, order 2 mua 1 iPhone. Cùng product nhưng quantity khác nhau theo từng order → **Full Dependency**.

---

## ⚡ Definition — Tự khám phá ra từ ví dụ

```
2NF = 1NF + KHÔNG có Partial Dependency

Mọi non-key column phải phụ thuộc vào
TOÀN BỘ composite PK, không phải một phần.
```

---

## 💀 Bước 3 — Tại sao vi phạm 2NF lại tệ?

**Hadriel hỏi:** "Nếu iPhone đổi tên thành 'iPhone 15 Pro', phải update bao nhiêu rows?"

**Wiganz trả lời:** *"2 rows trên bảng đó hả?"*

✅ **Đúng!** Và nếu không phải 2 rows mà là 10,000 orders đều có iPhone → update 10,000 rows. Miss 1 row:

```
order 1   | iPhone 15 Pro  ← updated
order 500 | iPhone         ← missed!
order 999 | iPhone 15 Pro  ← updated
```

**Data inconsistency!** Cùng 1 product nhưng có 2 tên khác nhau trong DB. 💀

### 3 Anomalies của 2NF violation:

| Anomaly | Vấn đề cụ thể |
|---|---|
| **Update** | Đổi tên iPhone → update N rows thay vì 1 |
| **Delete** | Xóa order cuối của iPhone → mất luôn thông tin product |
| **Insert** | Không thể thêm product mới nếu chưa có order nào |

---

## ✅ Bước 4 — Fix: Tách bảng

**Hadriel hỏi:** "`product_name` chỉ cần `product_id` — vậy nó nên sống ở bảng nào?"

**Wiganz trả lời:** *"nó chỉ nên sống ở bảng product_id thôi đúng hong?"*

✅ **ĐÚNG! AHA MOMENT #3** — tách ra bảng riêng!

```
❌ BEFORE (vi phạm 2NF):
OrderItems: (order_id, product_id, product_name, quantity, customer_name)

✅ AFTER (đạt 2NF):
OrderItems: (order_id, product_id, quantity)
Products:   (product_id, product_name)
Orders:     (order_id, customer_name)
```

Giờ đổi tên iPhone → update **1 row** trong `Products`. Done. ✅

---

## 🐍 Bước 5 — Django Connection (ForeignKey = implement 2NF)

**Wiganz nói:** *"chưa hiểu cái ForeignKey với order_item.product.name lắm"*

**Giải thích cụ thể:**

```python
# ❌ Vi phạm 2NF — copy product_name vào luôn
class OrderItem(models.Model):
    order_id = ...
    product_id = ...
    product_name = "iPhone"  # copy thẳng vào — sai!
    quantity = 2
# Vấn đề: iPhone đổi tên → tìm và update MỌI OrderItem có product_name="iPhone"
```

```python
# ✅ 2NF đúng — chỉ lưu ForeignKey (product_id)
class Product(models.Model):
    name = models.CharField(max_length=200)  # tên sống ở đây

class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    # chỉ lưu ID, trỏ sang bảng Product — không copy data
    quantity = models.IntegerField()

# Lấy tên sản phẩm — Django tự JOIN sang bảng Product
order_item.product.name  # Django tự biết phải sang bảng Product lấy
```

**Metaphor:** ForeignKey = lưu "địa chỉ nhà" thay vì copy toàn bộ nội thất vào chỗ mình. 🏠

**Wiganz sau khi hiểu:** *"à hiểu"* ✅ **CLICK MOMENT #4**

---

## 🎯 Bước 6 — Wiganz tự tóm tắt 2NF

**Wiganz nói:** *"2NF có nghĩa là non-key phải phụ thuộc hoàn toàn vào composite key không được partial depen đúng không?"*

✅ **PERFECT! Đây là lúc 2NF thực sự được forge vào não.** 🔥

---

## 💡 Tất cả Click Moments tổng hợp

| # | Click Moment | Nội dung |
|---|---|---|
| 1 | `product_name` partial dep | Chỉ cần `product_id`, không cần `order_id` |
| 2 | `quantity` full dep | Cần cả 2 vì cùng product khác order → khác quantity |
| 3 | Fix = tách bảng | `product_name` sống trong bảng Products riêng |
| 4 | ForeignKey = 2NF trong Django | Lưu "địa chỉ" thay vì copy data |

---

## ⚡ Bonus Insights

- **2NF chỉ relevant khi có composite PK.** Bảng có single PK (`id` auto-increment) → tự động đạt 2NF.
- **Partial dependency = cột non-key chỉ cần 1 phần của composite PK** để xác định giá trị.
- **ForeignKey trong Django chính là hiện thực hóa 2NF** — trỏ sang bảng gốc, không copy data.

---

## 🎯 Tóm tắt 1 câu (Wiganz's own words)

> **"2NF có nghĩa là non-key phải phụ thuộc hoàn toàn vào composite key — không được partial dependency."**
