# 🔥 Problem: Find Missing Number (Cyclic Sort)

## 1. Giải Thích Đề Bài (The Mission) 📜

**Input:** Một mảng chứa `n` số nguyên phân biệt (distinct).
**Range:** Các số nằm trong khoảng từ `0` đến `n`.
**Vấn đề:** Vì range từ `0` đến `n` có tổng cộng `n+1` số, mà mảng chỉ chứa `n` số 👉 Chắc chắn có **1 số bị thiếu**.

**Nhiệm vụ:** Tìm số đó.

**Ví dụ:**
- Input: `[3, 0, 1]` ($n=3$)
- Range đầy đủ: `0, 1, 2, 3`
- Số bị thiếu: **2**

---

## 2. Phase Analysis (Phân Tích Chiến Thuật) 🧠

### 🕵️‍♂️ Tại sao dùng Cyclic Sort?
- Dữ liệu là số nguyên.
- Nằm trong Range liên tục (`0` đến `n`).
- Yêu cầu giải quyết nhanh gọn ($O(N)$).

### 🏠 Luật "Nhà Ở" (The House Rules) - TẠI SAO LẠI KHÁC NHAU?

Tại sao bài trước (Range 1-N) công thức là `nums[i] - 1`, còn bài này (Range 0-N) lại là `nums[i]`?

**Lý do:** Trong lập trình, mảng (Array) luôn bắt đầu từ **Index 0**.

#### 🆚 Trường Hợp 1: Range 1 đến N (Bài toán cũ)
Giả sử Range là 1 đến 5 (gồm các số: 1, 2, 3, 4, 5). Mảng độ dài 5 (Index 0-4).

Bây giờ ta xếp chỗ:
*   Nếu Ông số 1 muốn ngồi ghế số 1 ➔ OK.
*   ...
*   Nếu Ông số 5 muốn ngồi ghế số 5 ➔ **BÙM! Lỗi `IndexOutOfBound`!** (Vì ghế to nhất chỉ là 4).
*   Và cái ghế số 0 sẽ bị bỏ trống, không ai ngồi.

👉 **Giải pháp:** Dịch chuyển tất cả lùi lại 1 bước.
*   Ông số 1 ➔ Ngồi ghế 0 (`1 - 1`)
*   Ông số 5 ➔ Ngồi ghế 4 (`5 - 1`)
*   **Công thức:** `correct_index = nums[i] - 1`

#### 🆚 Trường Hợp 2: Range 0 đến N (Bài toán này)
Các số: 0, 1, 2, 3... n. Mảng độ dài n (Index từ 0 đến n-1).

*   Ông số 0 ➔ Ngồi ghế 0. (Chuẩn men!)
*   Ông số 1 ➔ Ngồi ghế 1.
*   Ông số `n` ➔ Muốn ngồi ghế `n`. **Lại BÙM!** (Vì ghế to nhất là `n-1`).

👉 **Kết luận:**
*   Luật nhà ở là: **Ông số `X` về ghế `X`**.
*   **NGOẠI TRỪ** ông số `n`. Ông này không có nhà (vì mảng không đủ chỗ). Ông ta là kẻ vô gia cư, chúng ta phải "Kệ cha nó" (Ignore) trong lúc sort.
*   **Công thức:** `correct_index = nums[i]`

---

### 🧐 Vấn đề: "Thiếu Thằng To Đầu Nhất" (The Missing Giant)

Sau khi sort xong, có một trường hợp đặc biệt khiến nhiều người lúng túng.

**Ví dụ:**
- $n = 3$. Range đầy đủ: `{0, 1, 2, 3}`.
- Mảng đầu vào: `nums = [0, 1, 2]`.

Sau khi Sort xong, mảng vẫn là `[0, 1, 2]`.
Giờ mình đi điểm danh (Loop check):
- Index 0: Có số 0. (Khớp ✅)
- Index 1: Có số 1. (Khớp ✅)
- Index 2: Có số 2. (Khớp ✅)

Hết mảng rồi! Không tìm thấy cái ô nào bị "lệch" cả (không có ô nào mà `nums[i] != i`).

**Vậy số nào đang vắng mặt?**
Nhìn vào tập đầy đủ: `{0, 1, 2, 3}`. Trong mảng có: `{0, 1, 2}`.
👉 Thằng thiếu chính là **số 3** (tức là số $n$).

#### 💡 Quy tắc "Mặc định"
Khi bạn đi kiểm tra từng căn nhà (từ index 0 đến n-1):
1.  Nếu bạn thấy nhà nào đó có người lạ (sai số) ➔ **Bắt được ngay thằng thiếu là cái index đó.**
2.  Nếu bạn kiểm tra hết tất cả các nhà mà ai cũng đúng ➔ **Thì thằng thiếu chắc chắn là thằng $n$.**

(Vì thằng $n$ không có nhà riêng trong mảng này, nên nếu các nhà khác đều đủ, thì chắc chắn là thiếu ổng).

**Ví dụ dễ hiểu:**
Lớp có 4 học sinh: A, B, C, D.
Phòng thi chỉ có 3 bàn: Bàn 1, Bàn 2, Bàn 3.
*   Nếu Bàn 1 có A, Bàn 2 có B, Bàn 3 có C.
*   Hỏi ai vắng? 👉 **Chắc chắn là D.**

---

## 3. Step-by-Step Guidance (Các Bước Thực Hiện) 👣

### 🔥 Phase 1: Dọn Nhà (Sorting)
Mục tiêu: Đưa tất cả những ai "có nhà" về đúng nhà của họ.

**Tại mỗi vị trí `i`:**
1.  **Check:** Thằng đang đứng ở đây (`nums[i]`) có phải kẻ vô gia cư (`n`) không?
    -   Nếu là `n` 👉 Kệ nó, đi tiếp (`i++`).
2.  **Check:** Thằng này có đang ngồi đúng nhà chưa? (`nums[i] == i`)?
    -   Nếu đúng rồi 👉 Đi tiếp (`i++`).
3.  **Check:** Nếu nó đang ngồi sai chỗ VÀ có nhà để về (`nums[i] < n`):
    -   **ACTION:** Đuổi nó về đúng nhà (`swap`).
    -   **QUAN TRỌNG:** Sau khi swap, **ĐỪNG** đi tiếp. Phải ở lại kiểm tra thằng mới bị đá về đây xem nó là ai.

### 🔍 Phase 2: Điểm Danh (Scanning)
Mục tiêu: Tìm xem nhà nào đang chứa "người lạ".

1.  Chạy vòng lặp từ `0` đến `n-1`.
2.  Tại mỗi Index `i`, hỏi: *"Mày có phải là ông số `i` không?"*
    -   Nếu `nums[i] != i` 👉 **BẮT ĐƯỢC!** Số bị thiếu chính là `i`.
3.  **Trường hợp đặc biệt:**
    -   Nếu vòng lặp kết thúc mà không return gì (tất cả đều đúng chỗ).
    -   Return `n`.

---

## 4. Solution (The Code) 💻

```python
def findMissingNumber(nums):
    i = 0 
    n = len(nums)
    
    # --- PHASE 1: Dọn Nhà (Cyclic Sort) ---
    while i < n:
        correct_idx = nums[i] # Nhà đúng của nó là chính giá trị của nó
        
        # Điều kiện để SWAP:
        # 1. nums[i] < n: Nó phải nhỏ hơn n (để có nhà mà về, né thằng n ra)
        # 2. nums[i] != nums[correct_idx]: Nó đang ngồi sai chỗ
        if nums[i] < n and nums[i] != nums[correct_idx]:
            # Swap: Đưa nó về đúng nhà
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
            # KHÔNG tăng i, để kiểm tra thằng mới bị đá về
        else:
            # Nếu đúng chỗ rồi HOẶC là thằng n vô gia cư -> Đi tiếp
            i += 1
            
    # --- PHASE 2: Điểm Danh (Scanning) ---
    for i in range(n):
        # Nếu nhà số i mà không phải ông số i ngồi -> i là số thiếu
        if nums[i] != i: 
            return i     
            
    # Nếu kiểm tra hết mà ai cũng đúng -> Thằng thiếu là thằng n
    return n
```

---

## 5. Wiganz's Battle Scars (Lỗi Cần Khắc Cốt Ghi Tâm) 🩸

Trong lần thử đầu tiên, Warrior Wiganz đã dính vài vết thương (lỗi) sau đây. Hãy nhớ kỹ để không lặp lại!

### ❌ 1. Syntax Error: `while i < len(n)`
- **Lỗi:** `n` là một số nguyên (integer), ví dụ `n=3`. Bạn không thể dùng hàm `len()` cho một số nguyên.
- **Sửa:** `while i < n` hoặc `while i < len(nums)`.

### ❌ 2. Variable Scope (Lỗi Tầm Vực Biến)
- **Lỗi:** Bạn khai báo `correct_index = nums[i]` ở **bên ngoài** vòng lặp `while`.
- **Hậu quả:** Giá trị `correct_index` không bao giờ được cập nhật sau khi swap hoặc tăng `i`. Nó bị "chết cứng" ở giá trị đầu tiên.
- **Sửa:** Phải tính `correct_index` **bên trong** vòng lặp.

### ❌ 3. Logic "Return Sớm" (Premature Return)
- **Lỗi:**
  ```python
  for i in range(len(nums)):
      if i != nums[i]:
          return i
      else:
          return len(nums) + 1  # <--- SAI CHỖ NÀY
  ```
- **Tại sao sai?** Cái `else return` này sẽ làm vòng lặp dừng ngay lập tức ở **Index 0**.
    - Nếu Index 0 đúng (`0 == 0`), nó nhảy vào `else` và trả về `n+1` luôn. Nó KHÔNG thèm kiểm tra index 1, 2, 3...
- **Sửa:** Chỉ return trong vòng lặp khi tìm thấy lỗi. Còn nếu đúng thì cứ im lặng đi tiếp. Return cuối cùng để ở ngoài vòng lặp.

### ❌ 4. Logic Swap Rối Rắm
- **Lỗi:** Cấu trúc `if/elif/else` quá phức tạp làm logic bị phân tán.
- **Sửa:** Gộp điều kiện SWAP lại (`if val < n and val != nums[val]`). Tất cả các trường hợp còn lại gom vào `else: i += 1`.

---
*Created by Hadriel for Wiganz - The Interview Warrior* ⚔️
