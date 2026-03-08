
2026-02-05 19:56

Status 

Tags: 

# 🧠 Dynamic Programming (Quy hoạch động)

> _Dynamic Programming is not about code first — it’s about **thinking in subproblems**_ ✨

---

## 📌 Dynamic Programming là gì?

**Dynamic Programming (DP)** là một **kỹ thuật thuật toán** dùng để giải **bài toán tối ưu**, bằng cách:

- Chia bài toán lớn thành **những bài toán con nhỏ hơn**
    
- Nhận ra rằng **lời giải tối ưu của bài toán lớn** phụ thuộc vào **lời giải tối ưu của các bài toán con**
    

> 🔑 **Keyword**: _Break → Solve → Store → Reuse_

---

## 🔢 Ví dụ kinh điển: Fibonacci

### 📈 Dãy Fibonacci

Mỗi số bằng **tổng của hai số liền trước**:

```
0, 1, 1, 2, 3, 5, 8, ...
```

### 📐 Công thức

```
Fib(n) = Fib(n-1) + Fib(n-2),  với n > 1
```

➡️ Để tính **Fib(n)** cần:

- **Fib(n-1)**
    
- **Fib(n-2)**
    

➡️ Nghĩa là bài toán lớn đã được **chia thành 2 bài toán con nhỏ hơn**  
➡️ Đây chính là dấu hiệu có thể dùng **Dynamic Programming**

---

## ✅ Khi nào một bài toán dùng được DP?

Một bài toán **PHẢI** có **2 đặc điểm** sau 👇

---

## 1️⃣ Overlapping Subproblems (Bài toán con bị lặp)

📌 **Bài toán con** = phiên bản nhỏ hơn của bài toán gốc

Một bài toán có **overlapping subproblems** nếu:

> Khi giải, ta phải **tính lại cùng một bài toán con nhiều lần**

### 🧩 Ví dụ: Fib(4)

- Fib(4)
    
    - Fib(3)
        
        - Fib(2)
            
            - Fib(1)
                
            - Fib(0)
                
        - Fib(1)
            
    - Fib(2)
        
        - Fib(1)
            
        - Fib(0)
            

👉 Quan sát:

- **Fib(2)** bị tính **2 lần**
    
- **Fib(1)** bị tính **3 lần**
    

➡️ Đây chính là **overlapping subproblems**

---

## 2️⃣ Optimal Substructure (Cấu trúc con tối ưu)

Một bài toán có **optimal substructure** nếu:

> Lời giải tối ưu của bài toán lớn **được xây dựng từ** lời giải tối ưu của các bài toán con

### Với Fibonacci:

```
Fib(n) = Fib(n-1) + Fib(n-2)
```

➡️ Bài toán kích thước `n`  
➡️ được giảm thành bài toán kích thước `n-1` và `n-2`

✔️ Fibonacci **có optimal substructure**

---

## 🧩 Hai chiến lược giải DP phổ biến

---

## 🔽 1. Top-down + Memoization

### 🧠 Ý tưởng

- Giải bài toán **từ trên xuống**
    
- Sử dụng **đệ quy**
    
- Khi đã giải xong một bài toán con → **lưu kết quả lại**
    
- Lần sau gặp lại → **dùng lại**, không tính lại nữa
    

📌 Kỹ thuật lưu kết quả này gọi là **Memoization**

---

### ❌ Đệ quy thuần (không DP)

```python
class Solution:
  def calculateFibonacci(self, n):
    if n < 2:
      return n
    return self.calculateFibonacci(n - 1) + self.calculateFibonacci(n - 2)
```

⛔ Nhược điểm:

- Tính lặp rất nhiều
    
- Độ phức tạp ~ `O(2^n)`
    

---

### ✅ Memoization (DP)

```python
class Solution:
  def calculateFibonacci(self, n):
    memoize = [-1 for _ in range(n + 1)]
    return self.recur(memoize, n)

  def recur(self, memoize, n):
    if n < 2:
      return n

    if memoize[n] != -1:
      return memoize[n]

    memoize[n] = self.recur(memoize, n - 1) + self.recur(memoize, n - 2)
    return memoize[n]
```

✔️ Độ phức tạp: `O(n)`
- `memoize[i]` lưu Fib(i)
    
- Nếu Fib(i) đã tính rồi → trả về ngay
    
- Không tính lại nữa
    

➡️ Giảm thời gian từ **O(2^n)** xuống **O(n)**

---

## 🔼 2. Bottom-up + Tabulation

### 🧠 Ý tưởng

- **Không dùng đệ quy**
    
- Giải bài toán **từ nhỏ lên lớn**
    
- Lưu kết quả vào **bảng (table / array)**
    

📌 **Tabulation = làm bảng từ dưới lên**

---

### ✅ Tabulation với Fibonacci

Vì:

```
Fib(n) = Fib(n-1) + Fib(n-2)
```


➡️ Ta tính:

- Fib(0)
    
- Fib(1)
    
- Fib(2)
    
- Fib(3)

```python
class Solution:
  def calculateFibonacci(self, n):
    dp = [0, 1]
    for i in range(2, n + 1):
      dp.append(dp[i - 1] + dp[i - 2])
    return dp[n]
```

✔️ Nhanh  
✔️ Không lo stack overflow
✔️ Dễ debug
✔️ Rất phổ biến trong interview

---

## ⚖️ Memoization vs Tabulation

| Tiêu chí    | Memoization | Tabulation |
| ----------- | ----------- | ---------- |
| Hướng       | Top-down    | Bottom-up  |
| Dùng đệ quy | Có          | Không      |
| Cách lưu    | Khi cần     | Tính hết   |
| Debug       | ✅ Dễ        | Rõ ràng    |

---

## 🧭 Chiến lược giải DP chuẩn

> 🪜 **Always start from brute force**

1. Viết **đệ quy thuần** (brute-force)
    
2. Xác định:
    
    - 🔁 Overlapping subproblems
        
    - 🧩 Optimal substructure
        
3. Áp dụng:
    
    - Memoization
        
    - Tabulation
        
1️⃣ Đây là cách học DP đúng đắn nhất
## 🧠 Mental Model (Rất quan trọng)

> **Dynamic Programming = Đệ quy + Bộ nhớ (nhớ lại kết quả) **

📌 Hãy hỏi: _"Bài toán con là gì? Có bị lặp không?"_
Muốn xài DP, bài toán phải:

- 🔁 Có bài toán con bị lặp
    
- 🧩 Có cấu trúc con tối ưu

---

✨ _Once you see subproblems — DP becomes obvious._


## References 












***
#### Linked mentioned

