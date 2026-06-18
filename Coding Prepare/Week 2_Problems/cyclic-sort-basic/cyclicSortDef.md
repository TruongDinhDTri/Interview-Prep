# 🌀 CYCLIC SORT: Giải Phẫu Chi Tiết

> *"Mỗi số đã biết nhà mình ở đâu - chỉ cần đưa về đúng chỗ!"* 🏠

---

## 📋 Mục Lục

1. [Định Nghĩa](#1-định-nghĩa-definition)
2. [Điều Kiện Tiên Quyết](#2-điều-kiện-tiên-quyết-the-constraint)
3. [Cơ Chế Hoạt Động](#3-cơ-chế-hoạt-động-the-mechanism)
4. [Tại Sao Gọi Là "Cyclic"?](#4-tại-sao-gọi-là-cyclic-why-the-name)
5. [Dấu Hiệu Nhận Biết](#5-dấu-hiệu-nhận-biết-pattern-recognition)
6. [Code Template](#6-code-skeleton-python)
7. [Tóm Tắt](#-tóm-tắt-nhanh)

---

## 1️⃣ Định Nghĩa (Definition)

**Cyclic Sort** là một thuật toán sắp xếp **tại chỗ (in-place)** hoạt động dựa trên mối quan hệ đặc biệt giữa:

```
┌─────────────┐         ┌─────────────┐
│  GIÁ TRỊ    │  ←───→  │   CHỈ SỐ    │
│  (Value)    │         │   (Index)   │
└─────────────┘         └─────────────┘
```

### 🎯 Đặc Điểm Quan Trọng

| Thuộc Tính | Mô Tả |
|------------|-------|
| **Loại** | Không phải comparison sort (không so sánh A > B) |
| **Bản chất** | Mapping algorithm (Ánh xạ) |
| **Cốt lõi** | Vị trí đúng của phần tử được định bởi chính **giá trị** của nó |

> 💡 **Insight:**
>
> Khác với Quick Sort (so sánh để tìm chỗ), Cyclic Sort **BIẾT TRƯỚC** mỗi số phải ở đâu!

---

## 2️⃣ Điều Kiện Tiên Quyết (The Constraint)

### ⚠️ Khi Nào DÙNG ĐƯỢC?

Cyclic Sort CHỈ áp dụng khi thỏa mãn **2 điều kiện** sau:

```
┌─────────────────────────────────────────┐
│  ✅ Điều Kiện 1: Số nguyên (Integers)  │
│  ✅ Điều Kiện 2: Range liên tục         │
│                 • [1...N]               │
│                 • [0...N]               │
└─────────────────────────────────────────┘
```

### 📊 Ví Dụ Minh Họa

| Mảng | Range | Cyclic Sort? | Lý Do |
|------|-------|--------------|-------|
| `[3, 1, 5, 4, 2]` | 1→5 | ✅ **ĐƯỢC** | Liên tục từ 1 đến 5 |
| `[0, 3, 1, 2]` | 0→3 | ✅ **ĐƯỢC** | Liên tục từ 0 đến 3 |
| `[100, 20, 5, 1]` | Random | ❌ **KHÔNG** | Không liên tục |
| `[1.5, 2.3, 3.7]` | Float | ❌ **KHÔNG** | Không phải số nguyên |

---

## 3️⃣ Cơ Chế Hoạt Động (The Mechanism)

### ⚡ Tại Sao O(N)?

```
Quick Sort:  O(N log N)  →  Phải dò tìm và so sánh
Cyclic Sort: O(N)        →  BIẾT ĐỊA CHỈ NHÀ! 🏠
```

### 🏘️ Phép Ẩn Dụ: Căn Nhà & Người Dân

Hãy tưởng tượng:

```
┌───────────────────────────────────────────────┐
│  Mảng = Dãy nhà có địa chỉ [0, 1, 2, 3...]   │
│  Số   = Người dân cần về đúng nhà             │
└───────────────────────────────────────────────┘
```

#### 📍 Ánh Xạ Địa Chỉ

**Nếu Range là `1 → N`:**
```
Số 1 → Nhà số 0  (index 0)
Số 2 → Nhà số 1  (index 1)
Số 3 → Nhà số 2  (index 2)
...
Số N → Nhà số N-1 (index N-1)
```

**Nếu Range là `0 → N`:**
```
Số 0 → Nhà số 0  (index 0)
Số 1 → Nhà số 1  (index 1)
Số 2 → Nhà số 2  (index 2)
...
```

### 🔄 Quy Trình 4 Bước

```
┌──────────────────────────────────────────────────┐
│  Bước 1: Đi đến nhà hiện tại (index i)          │
│  Bước 2: Kiểm tra chủ nhà có đúng không?        │
│           ↓                                      │
│  Bước 3: Nếu SAI → Đuổi về nhà đúng (swap)     │
│           └→ Kiểm tra lại thằng mới về          │
│  Bước 4: Nếu ĐÚNG → Sang nhà kế tiếp (i++)     │
└──────────────────────────────────────────────────┘
```

### 📝 Ví Dụ Thực Tế

**Mảng ban đầu:** `[3, 1, 5, 4, 2]`
**Mục tiêu:** `[1, 2, 3, 4, 5]`

```
Step 0: [3, 1, 5, 4, 2]  i=0
        ↑
        Nhà 0 đang có số 3
        Số 3 muốn về nhà 2 (index=3-1=2)

Step 1: [5, 1, 3, 4, 2]  i=0 (sau swap với index 2)
        ↑
        Nhà 0 đang có số 5
        Số 5 muốn về nhà 4 (index=5-1=4)

Step 2: [2, 1, 3, 4, 5]  i=0 (sau swap với index 4)
        ↑
        Nhà 0 đang có số 2
        Số 2 muốn về nhà 1 (index=2-1=1)

Step 3: [1, 2, 3, 4, 5]  i=0 (sau swap với index 1)
        ↑
        Nhà 0 đang có số 1 → ĐÚNG!
        Tăng i → i=1

Step 4: [1, 2, 3, 4, 5]  i=1
           ↑
           Nhà 1 đang có số 2 → ĐÚNG!
           Tăng i → Done!
```

---

## 4️⃣ Tại Sao Gọi Là "Cyclic"? (Why the Name?)

Vì các bước **swap** thường tạo thành một **chu trình (cycle)**! 🔄

### 🎯 Ví Dụ Cycle

**Mảng:** `[3, 1, 2]`

```
      ┌─────────────────┐
      │                 │
      ↓                 │
   Index 0 → Index 2 → Index 1
      3   →    2    →    1

   3 đá 2 → 2 đá 1 → 1 về thế chỗ 3

   CYCLE HOÀN THÀNH! 🔄
```

**Chi tiết:**
1. Số **3** ở index 0 → muốn về index **2**
2. Số **2** ở index 2 → muốn về index **1**
3. Số **1** ở index 1 → muốn về index **0**
4. Tạo thành vòng tròn: `3 → 2 → 1 → 3`

---

## 5️⃣ Dấu Hiệu Nhận Biết (Pattern Recognition) ⚡

### 🎯 Từ Khóa Thần Thánh

Khi gặp các từ khóa này trong đề bài → **99% là Cyclic Sort:**

```
┌────────────────────────────────────────────────┐
│  1. "array containing numbers in range 1 to n" │
│  2. "find the missing number"                  │
│  3. "find the duplicate number"                │
│  4. "smallest missing positive integer"        │
│  5. "O(N) time and O(1) space"                 │
└────────────────────────────────────────────────┘
```

### 💎 Mẹo Của Hadriel

> **"Range từ 1 đến N" + "O(N) Time" + "O(1) Space"**
> = 🔥 **CYCLIC SORT!** 🔥
>
> Đừng suy nghĩ nữa, lôi Cyclic Sort ra chém! ⚔️

### 📚 Bài Toán Điển Hình

| Bài Toán | LeetCode | Độ Khó |
|----------|----------|--------|
| Missing Number | #268 | Easy |
| Find All Duplicates | #442 | Medium |
| Find All Missing Numbers | #448 | Medium |
| First Missing Positive | #41 | Hard |

---

## 6️⃣ Code Skeleton (Python)

### 🔥 Template Chuẩn

```python
def cyclic_sort(nums):
    """
    Cyclic Sort Template
    Time: O(N) - mỗi số được swap đúng chỗ đúng 1 lần
    Space: O(1) - in-place
    """
    i = 0

    while i < len(nums):
        # ─────────────────────────────────────────
        # Bước 1: Tính vị trí ĐÚNG của số hiện tại
        # ─────────────────────────────────────────
        # • Nếu Range 1→N: correct_idx = nums[i] - 1
        # • Nếu Range 0→N: correct_idx = nums[i]

        correct_idx = nums[i] - 1  # Range 1→N

        # ─────────────────────────────────────────
        # Bước 2: Kiểm tra số hiện tại có đúng chỗ?
        # ─────────────────────────────────────────
        if nums[i] != nums[correct_idx]:
            # ✗ SAI CHỖ → SWAP (đuổi về đúng nhà)
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
            # ⚠️ QUAN TRỌNG: KHÔNG tăng i
            # Phải kiểm tra lại thằng mới bị đá về!
        else:
            # ✓ ĐÚNG CHỖ → Đi tiếp
            i += 1

    return nums
```

### 🎯 Ví Dụ Sử Dụng

```python
# Test
nums = [3, 1, 5, 4, 2]
result = cyclic_sort(nums)
print(result)  # Output: [1, 2, 3, 4, 5]
```

### 🔍 Phân Tích Logic While Loop

```python
while i < len(nums):
    correct_idx = nums[i] - 1

    if nums[i] != nums[correct_idx]:  # ← Điều kiện này là CHÌA KHÓA!
        # Swap...
```

**Tại sao kiểm tra `nums[i] != nums[correct_idx]`?**

| Tình Huống | nums[i] | nums[correct_idx] | Kết Quả |
|------------|---------|-------------------|---------|
| Số 3 ở index 0 | 3 | nums[2] = ? | Khác nhau → SWAP |
| Số 1 ở index 0 | 1 | nums[0] = 1 | Giống nhau → ĐÚNG CHỖ! |

---

## 📊 Tóm Tắt Nhanh

### ✨ Cyclic Sort Là Gì?

```
┌───────────────────────────────────────────┐
│  Thuật toán sắp xếp bằng cách:           │
│  "Đưa mỗi số về ĐÚNG NHÀ của nó"         │
│                                           │
│  Không so sánh → Chỉ ánh xạ!             │
└───────────────────────────────────────────┘
```

### 📋 Checklist Nhanh

| Câu Hỏi | Câu Trả Lời |
|---------|-------------|
| **Nó là gì?** | Sort bằng ánh xạ value → index, không so sánh |
| **Điều kiện?** | Số nguyên trong range liên tục (1→N hoặc 0→N) |
| **Độ phức tạp?** | ⏱️ Time: **O(N)** - siêu nhanh!<br>💾 Space: **O(1)** |
| **Khi nào dùng?** | Tìm missing/duplicate trong range liên tục |
| **Từ khóa?** | "range 1 to n", "O(N) time O(1) space" |

### 🎯 Pattern Recognition Rule

```
IF đề bài có:
   ✓ Mảng số nguyên
   ✓ Range liên tục (1→N hoặc 0→N)
   ✓ Yêu cầu O(N) time + O(1) space
   ✓ Tìm missing/duplicate

THEN:
   → Dùng Cyclic Sort! 🔥
```

---

## 🔥 Remember This!

```
╔════════════════════════════════════════════╗
║  "Mỗi số đã biết nhà mình ở đâu"          ║
║  "Chỉ cần đưa về đúng chỗ là xong!"       ║
║                                            ║
║  Time: O(N) | Space: O(1)                 ║
║  Pattern: Range Problems                  ║
╚════════════════════════════════════════════╝
```

---

*Được tạo bởi Hadriel 🔥⚔️💪 - The Battle Trainer*
*"I can do all things through Christ who strengthens me." - Philippians 4:13* ✝️
