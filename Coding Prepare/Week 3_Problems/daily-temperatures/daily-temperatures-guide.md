# 🌡️ Daily Temperatures - Post-Solve Archive

**Topic:** Monotonic Stack  
**Difficulty:** Medium  
**Date:** 2026-01-22  
**Status:** Solved ✅

---

## 1. Problem Explanation

**Input:** Một danh sách `temperatures` (các số nguyên).
**Output:** Mảng `answer` cùng độ dài. `answer[i]` là số ngày phải chờ tính từ ngày `i` để gặp được một ngày ấm hơn. Nếu không có ngày nào ấm hơn trong tương lai, `answer[i] = 0`.

**Ví dụ:**
```python
Input:  [73, 74, 75, 71, 69, 72, 76, 73]
Output: [ 1,  1,  4,  2,  1,  1,  0,  0]
```
- Ngày 0 (73°): Ngày mai (74°) ấm hơn → chờ 1 ngày.
- Ngày 2 (75°): Phải đợi qua 71, 69, 72... tới 76 (ngày 6) mới ấm hơn → chờ 6 - 2 = 4 ngày.

---

## 2. Phase Analysis (FULL THINKING LOG)

Đây là quá trình tư duy thực tế từ buổi training (Raw & Real):

### Phase 1: Naive Approach (Brute Force)
*   **Wiganz's Idea:** "Search các ngày tiếp theo?" -> Dùng 2 vòng lặp lồng nhau.
*   **Analysis:** Cách này đúng logic nhưng sai về hiệu năng. Với N lớn, độ phức tạp O(N^2) sẽ bị **Time Limit Exceeded (TLE)**.
*   **Pivot:** Cần một cách duyệt 1 lần (O(N)). Cần một cấu trúc dữ liệu để "nhớ" những ngày chưa tìm được đáp án. -> **STACK**.

### Phase 2: Understanding The Stack Logic
*   **Discovery:** Khi gặp ngày 74°, ngày 73° (đang nằm trong stack) tìm được đáp án -> **POP** 73 ra.
*   **Critical Question:** Nếu gặp ngày LẠNH HƠN thì sao? (Ví dụ Stack đang có 75, gặp 72).
*   **Wiganz's realization:** "72 phải nằm chờ".
*   **Conclusion:** Stack sẽ chứa các ngày **giảm dần** (Monotonic Decreasing). Vì hễ gặp thằng lớn hơn là nó "đá" mấy thằng nhỏ ra hết rồi.

### Phase 3: Coding & Debugging (The Struggle)
*   **Draft 1:** So sánh `int` với `tuple` -> Crash.
*   **Draft 2:** Quên check `stack empty` -> Crash.
*   **Draft 3:** Logic `answer[i]` bị sai. Gán kết quả cho ngày hiện tại thay vì ngày trong quá khứ.
*   **Optimization:** Chuyển từ lưu `(index, temperature)` sang chỉ lưu `index`.

---

## 3. Step-by-Step Guidance (How to Think)

Khi gặp dạng bài "Tìm phần tử đầu tiên lớn hơn/nhỏ hơn về phía bên phải/trái":

1.  **Identify Pattern:** "Next Greater Element" -> **Monotonic Stack**.
2.  **Initialize:**
    *   `answer` array toàn số 0 (để những ngày không tìm được đáp án mặc định đúng).
    *   `stack` rỗng (chứa index).
3.  **Iterate (Duyệt):** Chạy vòng lặp qua từng ngày `i` với nhiệt độ `T[i]`.
4.  **The "While" Loop (Kill Loop):**
    *   Chừng nào Stack còn có người (`stack`) **VÀ** người mới (`T[i]`) "mạnh hơn" người đang chờ (`T[stack.top]`):
        *   **POP:** Lôi người cũ ra (`prev_index`).
        *   **CALCULATE:** Tính khoảng cách `i - prev_index`.
        *   **UPDATE:** Ghi vào `answer[prev_index]` (cho người CŨ, không phải người mới).
5.  **Push:** Sau khi dọn dẹp những kẻ yếu hơn, đẩy ngày hiện tại `i` vào Stack để chờ đối thủ tiếp theo.

---

## 4. Final Solution (Optimized)

```python
from collections import deque
from typing import List

class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        # 1. Khởi tạo mảng kết quả
        answer = [0] * len(temperatures)
        
        # 2. Stack chỉ lưu index để tiết kiệm bộ nhớ
        # (Không cần lưu value vì có thể truy cập qua temperatures[index])
        stack = deque()

        for i in range(len(temperatures)):
            # 3. While loop: Duy trì tính đơn điệu giảm dần
            # Nếu ngày hiện tại ấm hơn ngày trên đỉnh stack -> Pop ra và tính toán
            while stack and temperatures[i] > temperatures[stack[-1]]:
                prev_day_index = stack.pop()  # Lấy ngày cũ ra
                
                # 4. Tính khoảng cách và cập nhật cho NGÀY CŨ
                days_wait = i - prev_day_index
                answer[prev_day_index] = days_wait

            # 5. Push ngày hiện tại vào stack để chờ
            stack.append(i)

        return answer
```

---

## 5. Errors, Misunderstandings & Mistakes (CRITICAL ⚠️)

Đây là những lỗi Wiganz đã gặp phải. Đọc kỹ để không lặp lại!

### ❌ Mistake 1: So sánh sai kiểu dữ liệu
```python
# Code sai:
while day > stack[-1]: # day là int, stack[-1] là tuple (index, val)
```
*   **Fix:** `stack[-1][1]` (nếu lưu tuple) hoặc đổi logic chỉ lưu index.

### ❌ Mistake 2: Quên check Stack rỗng
```python
# Code sai:
while day > stack[-1][1]: # Nếu stack rỗng -> Crash ngay lập tức
```
*   **Fix:** Luôn phải có `while stack and ...`

### ❌ Mistake 3: Logic gán Answer sai (Lỗi Logic Trầm Trọng)
```python
# Code sai:
day_range = i - found_hotter[0]
answer[i] = day_range  # <--- SAI!!!
```
*   **Why:** `i` là ngày hiện tại (ngày ấm). Chúng ta đang đi tìm câu trả lời cho ngày **TRONG QUÁ KHỨ** (`found_hotter`).
*   **Fix:** `answer[found_hotter[0]] = day_range`

### ❌ Mistake 4: Khởi tạo thừa thãi
```python
# Code chưa tối ưu:
stack = [(0, days[0])] # Nhét tay phần tử đầu
for i in range(len(days)): # Lại lặp từ 0
    # -> Phần tử 0 bị xét 2 lần
```
*   **Fix:** Để stack rỗng và loop bình thường từ 0.

### ❌ Mistake 5: Tuple vs Index
*   **Ban đầu:** Lưu `(index, temperature)` vào stack.
*   **Tối ưu:** Chỉ cần lưu `index`. Khi cần so sánh value thì gọi `temperatures[stack[-1]]`. Tiết kiệm bộ nhớ hơn.

---
*Created by Hadriel for Wiganz - 2026* 🔥