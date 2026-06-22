# Database Indexing — Cơ chế, Strategy, Trade-offs, Django 📐
> Toàn bộ hành trình thấu hiểu — Q&A, click moments, aha moments, ví dụ, metaphors

---

## 🧱 Bước 1 — Indexing là gì? Metaphor Phụ lục sách

**Hadriel hỏi:** "Em có 1 cuốn sách 1000 trang. Muốn tìm chữ 'Django'. Cách 1: lật từng trang từ 1→1000. Cách 2: mở phụ lục → thấy 'Django — trang 347, 521, 890' → lật thẳng đến đó. Cách nào nhanh hơn?"

**Wiganz trả lời:** *"ohhh cách 2 ngon á. Phụ lục đúng hong"*

> 💡 **AHA MOMENT #1 — Phụ lục = Index trong Database!**

```
Phụ lục sách:          Index trong DB:
Django → trang 347     "Wiganz" → row 347
React  → trang 521     "Triết"  → row 521
Python → trang 890     "Nam"    → row 890
```

**Không có index** → DB phải scan từng row từ đầu đến cuối → **Full Table Scan** 💀
**Có index** → DB nhảy thẳng đến đúng row ✅

---

## 🔍 Bước 2 — Phụ lục được sort thế nào?

**Hadriel hỏi:** "Phụ lục sách được sắp xếp theo thứ tự gì?"

**Wiganz trả lời:** *"hong biết? phụ lục sách được sắp xếp theo kiểu... chương? alphabet? ko biết nữa"*

**Alphabet đúng rồi!** Vì khi tìm "Django" — biết ngay nhảy thẳng đến chữ D, không cần đọc A, B, C!

```
A
  Arrays → trang 12
  Authentication → trang 45
B
  Binary Search → trang 78
D
  Database → trang 120
  Django → trang 347   ← nhảy thẳng vào đây!
```

Database index hoạt động y chang — nhưng dùng cấu trúc gọi là **B-Tree (Balanced Tree)**.

---

## 🌳 Bước 3 — B-Tree hoạt động thế nào?

**Hadriel show B-Tree đơn giản:**

```
                [50]
               /    \
           [25]      [75]
          /    \    /    \
       [10]  [30] [60]  [90]
```

**Hadriel hỏi:** "Em muốn tìm số 60 — đi theo con đường nào?"

**Wiganz trả lời:** *"50, 75, 60"*

> 💡 **AHA MOMENT #2 — B-Tree chỉ cần 3 bước thay vì scan 7 nodes!**

```
50 → 60 > 50, đi PHẢI → 75
75 → 60 < 75, đi TRÁI → 60 ✅
```

**Độ phức tạp: O(log n)**
```
1 triệu rows → chỉ ~20 bước
Full Table Scan → 1 triệu bước 💀
```

---

## 🌳 Bước 4 — B-Tree của Customer.name trông như thế nào?

**Wiganz hỏi:** *"Ví dụ như customer mà index thì cái B-Tree trông như thế nào? Bự hơn xíu"*

Data:
```
id=1, name="Minh"
id=2, name="Wiganz"
id=3, name="An"
id=4, name="Bình"
id=5, name="Triết"
id=6, name="Huy"
id=7, name="Lan"
```

**Wiganz hỏi:** *"Sao Wiganz > Minh? Theo alphabet kiểu gì?"*

**Alphabet theo vị trí chữ cái đầu tiên:**
```
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
1 2 3 4 5 6 7 8 9 ...       13          20       23
```

```
An      → A (vị trí 1)  ← nhỏ nhất
Bình    → B (vị trí 2)
Huy     → H (vị trí 8)
Lan     → L (vị trí 12)
Minh    → M (vị trí 13)
Triết   → T (vị trí 20)
Wiganz  → W (vị trí 23) ← lớn nhất
```

B-Tree index trên `name`:
```
                        [Minh→id:1]
                       /            \
            [Bình→id:4]              [Triết→id:5]
           /            \            /            \
      [An→id:3]      [Huy→id:6]  [Lan→id:7]   [Wiganz→id:2]
```

**Query `WHERE name = "Wiganz"`:**
```
Minh   → "Wiganz" > "Minh"   → đi PHẢI  (W=23 > M=13)
Triết  → "Wiganz" > "Triết"  → đi PHẢI  (W=23 > T=20)
Wiganz → TÌM THẤY! → row id=2 ✅
```
3 bước thay vì scan 7 rows! 🎯

**Query `WHERE name = "An"`:**
```
Minh → "An" < "Minh" → đi TRÁI  (A=1 < M=13)
Bình → "An" < "Bình" → đi TRÁI  (A=1 < B=2)
An   → TÌM THẤY! → row id=3 ✅
```

---

## ⚖️ Bước 5 — Trade-off: Read vs Write

**Hadriel hỏi:** "Nếu index nhanh vậy, tại sao không index tất cả mọi cột? Hint: phụ lục sách — khi sách được tái bản thêm trang mới, phụ lục phải làm gì?"

**Wiganz trả lời:** *"Phải viết lại phụ lục hả?"*

> 💡 **AHA MOMENT #3 — Mỗi lần write phải cập nhật index!**

```
✅ READ nhanh hơn   → có index, nhảy thẳng đến row
❌ WRITE chậm hơn   → INSERT/UPDATE/DELETE phải cập nhật B-Tree

Không có index:
INSERT row mới → chỉ thêm vào bảng  → nhanh ✅

Có index:
INSERT row mới → thêm vào bảng
              + rebuild B-Tree index  → chậm hơn ❌
```

**Càng nhiều index → INSERT/UPDATE/DELETE càng chậm!**

---

## 🎯 Bước 6 — Khi nào nên index?

**Hadriel hỏi:** "Khi nào nên tạo index, khi nào không? Hint: app của em đọc nhiều hay ghi nhiều?"

**Wiganz trả lời:** *"đọc nhiều mới index"*

> 💡 **AHA MOMENT #4 — Wiganz tự rút ra được rule!**

```
Đọc nhiều  → index! (query nhanh hơn)
Ghi nhiều  → cẩn thận với index (mỗi write phải update index)
```

| App | Đọc/Ghi | Index? |
|---|---|---|
| Blog (nhiều người đọc) | Đọc nhiều | ✅ Index `title`, `created_at` |
| Log system (ghi liên tục) | Ghi nhiều | ⚠️ Index ít thôi |
| E-commerce (search sản phẩm) | Đọc nhiều | ✅ Index `name`, `price`, `category` |
| Analytics (insert mỗi click) | Ghi nhiều | ⚠️ Cẩn thận |

---

## 🐍 Bước 7 — Index trong Django

**Cách 1 — index thẳng trên field:**
```python
class Product(models.Model):
    name = models.CharField(max_length=200, db_index=True)  # ← db_index=True
    price = models.DecimalField(...)
    category = models.CharField(max_length=100)
```

**Cách 2 — index trong Meta (cách pro hơn):**
```python
class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(...)
    category = models.CharField(max_length=100)

    class Meta:
        indexes = [
            models.Index(fields=['name']),                   # index 1 cột
            models.Index(fields=['category', 'price']),      # composite index!
        ]
```

---

## 🔥 Composite Index — Leftmost Prefix Rule

**Composite index `['category', 'price']`** — B-Tree được xây theo thứ tự **category trước, price sau:**

```
B-Tree index:
Electronics/100
Electronics/200
Electronics/500   ← sort by category FIRST, then price
Clothing/50
Clothing/150
Clothing/300
```

**Query 1:** `WHERE category='Electronics' AND price=200`
```
→ Biết category → nhảy thẳng vào Electronics
→ Biết price → tìm 200 trong Electronics
✅ Dùng được index!
```

**Query 2:** `WHERE price=200` (không có category)
```
→ Không biết category nào
→ B-Tree không biết nhảy vào chỗ nào
→ Phải scan hết! 💀
❌ Index vô dụng!
```

**Metaphor danh bạ điện thoại** — sort theo **Họ → Tên**:
```
Nguyễn An
Nguyễn Bình
Trần An
Trần Bình
```
- Tìm "Nguyễn Bình" → nhảy vào "Nguyễn" trước → tìm "Bình" ✅
- Tìm "Bình" (không biết họ) → đọc hết danh bạ 💀

> 💡 **Leftmost Prefix Rule:** Composite index chỉ work khi query **theo đúng thứ tự từ trái**. Bỏ cột đầu tiên → index vô dụng.

---

## 🤖 Django tự động index những gì?

**Wiganz hỏi:** *"ForeignKey có tự động tạo index không, hay phải tự thêm?"*

| Field | Tự động index? | Lý do |
|---|---|---|
| `ForeignKey` | ✅ Có | Luôn dùng để JOIN và filter |
| `OneToOneField` | ✅ Có | Tương tự ForeignKey |
| `primary_key` | ✅ Có | PK luôn được index |
| `unique=True` | ✅ Có | Cần check duplicate nhanh khi INSERT |
| `CharField` thường | ❌ Phải tự thêm | Django không biết em có query field này không |
| `IntegerField` thường | ❌ Phải tự thêm | Tương tự |

> 💡 **Insight về `unique=True`:** Khi INSERT row mới, DB phải kiểm tra "email này đã tồn tại chưa?" → Không có index → scan hết bảng 💀 → Có index → tìm trong B-Tree ngay ✅. Nên `unique=True` **bắt buộc phải có index** để check duplicate nhanh. `unique=True` vừa enforce constraint vừa **tặng kèm index miễn phí!**

---

## 📊 Tóm tắt Trade-offs

| | **Có Index** | **Không có Index** |
|---|---|---|
| **SELECT/READ** | ✅ O(log n) — nhanh | ❌ O(n) — Full Table Scan |
| **INSERT** | ❌ Chậm hơn (rebuild B-Tree) | ✅ Nhanh |
| **UPDATE** | ❌ Chậm hơn | ✅ Nhanh |
| **DELETE** | ❌ Chậm hơn | ✅ Nhanh |
| **Storage** | ❌ Tốn thêm disk | ✅ Không tốn thêm |

---

## 💡 Tất cả Click Moments tổng hợp

| # | Click Moment | Nội dung |
|---|---|---|
| 1 | Phụ lục = Index | Không cần scan hết — nhảy thẳng đến data |
| 2 | B-Tree = O(log n) | 3 bước tìm ra 60 trong 7 nodes |
| 3 | Write phải cập nhật index | Thêm page mới → viết lại phụ lục |
| 4 | Đọc nhiều mới index | Wiganz tự rút ra rule! |
| 5 | Leftmost prefix rule | Composite index vô dụng nếu bỏ cột đầu tiên |
| 6 | unique=True tặng index miễn phí | Cần check duplicate nhanh → phải có index |

---

## 🎯 Tóm tắt 1 câu

> **Index = phụ lục B-Tree giúp DB tìm data O(log n) thay vì O(n). Trade-off: READ nhanh hơn nhưng WRITE chậm hơn vì phải cập nhật index. Dùng khi đọc nhiều hơn ghi.**

---

## 💬 Câu trả lời phỏng vấn (English)

> "A database index is a B-Tree data structure that allows the database to find rows in O(log n) instead of a full O(n) table scan. The trade-off is that writes become slower because every INSERT, UPDATE, and DELETE must also update the index. Use indexes on columns you frequently filter or JOIN on, especially in read-heavy applications. Be cautious in write-heavy systems — too many indexes can slow down writes significantly."
