# Find Peak Element - Solution & Mistakes

## Problem: LeetCode #162 - Find Peak Element

---

## Key Insight: Tại sao "đi về phía cao" chắc chắn tìm được peak?

### Logic:
Khi so sánh `nums[mid]` với `nums[mid+1]`, có 2 trường hợp:

**Trường hợp 1: `nums[mid] < nums[mid+1]` (Bên phải cao hơn)**
```
Có 2 khả năng:
1. Slope tiếp tục tăng đến cuối mảng → Phần tử cuối là peak (boundary = -∞)
2. Slope tăng rồi giảm → Sẽ gặp peak ở giữa

→ Cả 2 trường hợp đều CÓ peak ở bên phải!
```

**Trường hợp 2: `nums[mid] >= nums[mid+1]` (Bên trái cao hơn)**
```
→ mid có thể là peak, hoặc peak ở bên trái
→ Phải giữ mid lại: right = mid
```

---

## Ví dụ chi tiết:

### Ví dụ 1: `nums = [1, 2, 3, 1]`

```
Chỉ số:  0  1  2  3
Giá trị: 1  2  3  1

Bước 1: left=0, right=3, mid=1
  nums[1]=2, nums[2]=3
  2 < 3 → Bên phải cao hơn
  → left = mid + 1 = 2
  → Loại bỏ bên trái: [1, 2] (thấp hơn)
  → Giờ chỉ tìm trong: [3, 1]

Bước 2: left=2, right=3, mid=2
  nums[2]=3, nums[3]=1
  3 > 1 → Bên trái cao hơn
  → right = mid = 2
  → Loại bỏ bên phải: [1] (thấp hơn)
  → Giờ chỉ còn: [3]

Kết quả: left=2, right=2 → Peak tại index 2!
```

### Visual:
```
Ban đầu:    [1, 2, 3, 1]
             █ █ █ █

Sau bước 1: [1, 2, 3, 1]
             · · █ █  (loại trái)

Sau bước 2: [1, 2, 3, 1]
             · · █ ·  (loại phải)

Kết quả: Còn 1 phần tử → PEAK!
```

---

## Understanding Check - Conversation:

### Question: Tại sao "đi về phía cao" → Khi left == right là peak?

**Giải thích ngắn gọn:**

```
nums = [1, 2, 3, 1]
        ↑     ↑
      thấp  cao

Bước 1: mid = 1 (giá trị 2)
- So sánh: 2 < 3 → Bên phải cao hơn
- Loại bỏ bên trái (vì thấp hơn) → left = mid + 1
- Giờ chỉ tìm trong: [3, 1]

Bước 2: mid = 2 (giá trị 3)
- So sánh: 3 > 1 → Bên trái cao hơn
- Loại bỏ bên phải (vì thấp hơn) → right = mid
- Giờ chỉ còn: [3]

Kết quả: left = 2, right = 2 → Chỉ còn 1 phần tử → Đó là peak!
```

**Tại sao CHẮC CHẮN là peak?**

Vì ta đã:
- **Loại bỏ** hết phần BÊN TRÁI (vì thấp hơn ở Bước 1)
- **Loại bỏ** hết phần BÊN PHẢI (vì thấp hơn ở Bước 2)

→ Còn lại 1 phần tử → Nó CAO HƠN cả 2 bên → **Đó là peak!**

### Visual ngắn:
```
Ban đầu: [1, 2, 3, 1]
           █ █ █ █

Bước 1: Loại trái (thấp)
           · · █ █

Bước 2: Loại phải (thấp)
           · · █ ·

Kết quả: Còn 1 phần tử = PEAK!
```

---

## Hiểu đúng về thuật toán:

**Câu hỏi:** "Có nghĩa là lúc nào left hay right cũng phải bước ít nhất 1 bước đúng không? Nếu mid < mid+1 → đi về phía cao hơn, left = mid + 1 → loại bỏ bên trái. Xong 3 > 1 → right bước 1 bước → right = mid → vì cái mid đó nó lớn hơn mid+1 nên nó có thể là peak nên không bỏ nó được?"

**✅ ĐÚNG RỒI!**

```python
if nums[mid] < nums[mid + 1]:
    left = mid + 1
    # ↑ KHÔNG giữ mid (vì mid thấp hơn, không phải peak)
    # ↑ Loại bỏ bên trái

else:  # nums[mid] >= nums[mid + 1]
    right = mid
    # ↑ GIỮ mid (vì mid cao hơn, có thể là peak!)
    # ↑ Loại bỏ bên phải
```

**Điểm quan trọng:**

✅ **Khi đi phải:** `left = mid + 1` → BỎ mid (vì nó thấp)
✅ **Khi đi trái:** `right = mid` → **GIỮ mid** (vì nó có thể là peak)

→ Cuối cùng `left == right` → Đó là phần tử cao nhất còn lại → **PEAK!**

---

## Tại sao `while left < right` thay vì `while left <= right`?

### `while left <= right`:
```python
# Loop chạy qua cả trường hợp left == right
# → PHẢI tự tìm và return peak TRONG loop
# → Phải check nums[mid-1] và nums[mid+1]
# → Dễ bị out of bounds!

while left <= right:
    mid = ...
    if nums[mid-1] < nums[mid] > nums[mid+1]:  # ❌ Dễ bug
        return mid
```

### `while left < right`:
```python
# Loop dừng KHI left == right
# → KHÔNG cần tìm peak trong loop
# → Khi loop kết thúc, left == right = peak!
# → KHÔNG lo boundary!

while left < right:
    mid = ...
    if nums[mid] < nums[mid + 1]:
        left = mid + 1
    else:
        right = mid
return left  # ✓ Đơn giản, ít bug
```

---

## Mistakes từ lần đầu code:

### Mistake #1: Dùng `while left <= right` và check peak sai
```python
# ❌ WRONG
while left <= right:
    mid = ...
    if nums[mid-1] < nums[mid] and nums[mid] > nums[mid+1]:
        return mid
```

**Vấn đề:**
- Khi `mid = 0` → `nums[mid-1]` = `nums[-1]` (phần tử cuối!) ❌
- Khi `mid = len-1` → `nums[mid+1]` out of bounds! ❌

### Mistake #2: Không hiểu tại sao phải `right = mid` (không phải `mid-1`)
```python
# ❌ WRONG
else:
    right = mid - 1  # Có thể bỏ lỡ peak tại mid!

# ✅ CORRECT
else:
    right = mid  # Giữ mid vì nó có thể là peak
```

---

## Key Points để nhớ:

1. **Luôn đi về phía CAO hơn** → Chắc chắn gặp peak
2. **`left = mid + 1`** → BỎ mid (vì nó thấp hơn)
3. **`right = mid`** → GIỮ mid (vì nó có thể là peak)
4. **`while left < right`** → Khi loop kết thúc, `left == right` = peak
5. **Không cần check boundary** với cách này!

---

## Complexity:
- **Time:** O(log n) - Binary search
- **Space:** O(1) - Chỉ dùng vài biến
