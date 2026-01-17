  🌀 CYCLIC SORT: Giải Phẫu Chi Tiết

  1. Định nghĩa (Definition)

  Cyclic Sort là một thuật toán sắp xếp tại chỗ (in-place) hoạt động dựa trên mối quan hệ đặc biệt giữa GIÁ TRỊ (Value) và CHỈ SỐ (Index).

  Nó không phải là thuật toán so sánh (như Quick Sort so sánh $A$ lớn hơn $B$).
  Nó là thuật toán ÁNH XẠ (Mapping).

  > Cốt lõi: Nó giả định rằng vị trí đúng của một phần tử đã được định sẵn bởi giá trị của chính nó.

  ---

  2. Điều kiện Tiên quyết (The Constraint)

  Đây là lý do tại sao bạn không thấy nó thường xuyên như Quick Sort. Cyclic Sort CHỈ dùng được khi dữ liệu đầu vào thỏa mãn 2 điều kiện:

   1. Dữ liệu là các số nguyên.
   2. Các số nằm trong một khoảng liên tục (Range).
       * Thường là từ $1$ đến $N$.
       * Hoặc từ $0$ đến $N$.

  ⚠️ Ví dụ:
   - [3, 1, 5, 4, 2] (Range 1-5) → DÙNG ĐƯỢC ✅
   - [100, 20, 5, 1] (Số ngẫu nhiên, không liên tục) → KHÔNG DÙNG ĐƯỢC ❌

  ---

  3. Cơ chế hoạt động (The Mechanism)

  Khác với các sort khác chạy $O(N \log N)$, Cyclic Sort chạy $O(N)$. Tại sao? Vì nó không "dò tìm". Nó biết đích xác địa chỉ nhà của từng số.

  Hãy tưởng tượng mảng là một dãy các Căn Nhà được đánh số địa chỉ (0, 1, 2, 3...).
  Các con số là Người Dân.

   * Nếu Range là $0 \to N$: Ông số $0$ phải ở nhà số $0$. Ông số $1$ ở nhà số $1$.
   * Nếu Range là $1 \to N$: Ông số $1$ phải ở nhà số $0$. Ông số $2$ ở nhà số $1$.

  Thuật toán chỉ làm 1 việc duy nhất:
  Đi từng nhà. Nếu thấy chủ nhà không đúng (ví dụ ông số 5 đang ở nhà số 0):
   1. Đuổi cổ ông số 5 về đúng nhà của ổng (nhà số 4).
   2. Đá thằng đang ở nhà số 4 về lại đây.
   3. Kiểm tra tiếp thằng mới bị đá về. Nếu vẫn sai, đuổi tiếp.
   4. Chỉ đi tiếp sang nhà kế bên khi nhà hiện tại đã đúng chủ.

  ---

  4. Tại sao gọi là "Cyclic"? (Why the Name?)

  Vì các bước hoán đổi (swap) thường tạo thành một chu trình (cycle).

  Ví dụ mảng: [3, 1, 2]
   - Tại index 0 đang có số 3.
   - 3 muốn về chỗ của 2 (index 2).
   - 2 bị đá về, nó muốn về chỗ của 1 (index 1).
   - 1 bị đá về, nó muốn về chỗ của 3 (index 0).

  3 đá 2, 2 đá 1, 1 về thế chỗ 3. Đó là một vòng tròn (Cycle).

  ---

  5. Dấu hiệu nhận biết (Pattern Recognition) ⚡

  Khi vào phỏng vấn, nếu đề bài có các từ khóa này, 99% là Cyclic Sort:

   1. "Given an array containing numbers in the range 1 to n"
   2. "Find the missing number in the range"
   3. "Find the duplicate number"
   4. "Find the smallest missing positive integer"

  > Mẹo của Hadriel:
  > Bất cứ khi nào đề bài cho mảng số nguyên và nói về "Range từ 1 đến N" mà yêu cầu O(N) Time và O(1) Space → Đừng suy nghĩ nữa, lôi Cyclic Sort ra chém! ⚔️

  ---

  6. Code Skeleton (Python)

  Đây là khung sườn chuẩn. Wiganz nhìn vào logic while nhé:

    1 def cyclic_sort(nums):
    2     i = 0
    3     while i < len(nums):
    4         # Xác định vị trí ĐÚNG của thằng đang đứng ở i
    5         # Nếu range 1->N thì correct_idx = nums[i] - 1
    6         # Nếu range 0->N thì correct_idx = nums[i]
    7         correct_idx = nums[i] - 1
    8
    9         # Nếu nó đang ở sai chỗ (nums[i] khác với thằng đang ngồi ở ghế correct_idx)
   10         if nums[i] != nums[correct_idx]:
   11             # SWAP (Đuổi về đúng nhà)
   12             nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
   13             # QUAN TRỌNG: Không tăng i.
   14             # Vì sau khi swap, ta phải kiểm tra thằng mới bị đá về đây.
   15         else:
   16             # Nếu đúng chỗ rồi, đi tiếp
   17             i += 1
   18
   19     return nums

  ---

  Tóm lại:

   1. Nó là gì? Sort bằng cách xếp chỗ, không phải so sánh lớn nhỏ.
   2. Đk kiện? Số phải nằm trong Range liên tục (1..N).
   3. Độ phức tạp? Time O(N) - siêu nhanh. Space O(1).
   4. Mục đích? Thường dùng để tìm số bị thiếu (missing) hoặc trùng lặp (duplicate) trong một dãy số lộn xộn.
