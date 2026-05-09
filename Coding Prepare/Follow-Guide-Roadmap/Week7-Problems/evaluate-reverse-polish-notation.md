# Evaluate Reverse Polish Notation — LeetCode #150

**Date:** 2026-05-08
**Session Time:** 25 min (timed interview) + Teaching Mode debrief
**Pattern:** Stack
**Difficulty:** Medium
**Status:** ✅ Solved — full Road loop complete

---

## The Problem

Given an array of strings `tokens` representing an arithmetic expression in Reverse Polish Notation — evaluate it and return an integer.

**Abstract version (stripped):**
"Given an array of tokens — numbers wait, operator fires on the two before it, result replaces them. Return final result."

**Constraints confirmed:**
- Input NOT sorted — order matters, don't touch it
- Stored as array of strings
- Up to 10^4 tokens
- Duplicates possible
- Zero possible
- **Negative numbers possible** (e.g. `"-11"`) ← key trap
- No floating point — integers only
- Input guaranteed valid — never empty, no division by zero
- Division truncates toward zero (NOT floor)
- Answer + all intermediate calculations fit in 32-bit integer → no overflow concern
- Return: one integer — the final evaluated result

---

## 🔑 Vocabulary (Vietnamese) — Giải thích từng từ

**arithmetic expression** = Biểu thức toán học. VD: `2 + 1`, `13 / 5 + 4`

**expression** = Công thức tính ra được 1 giá trị. `2 + 1` = expression, kết quả = `3`

**Reverse Polish Notation (RPN):**
```
Bình thường (Infix):  2 + 1       ← toán tử ở GIỮA
RPN (Postfix):        2 1 +       ← toán tử ở SAU
```
Toán tử luôn đứng SAU hai số của nó. Máy tính thích RPN vì không cần ngoặc, không cần ưu tiên toán tử.

**evaluate** = Tính toán ra kết quả. `Evaluate "2 1 +"` = tính `2+1` = `3`

**operand** = Con số trong phép tính (đối lập với operator `+ - * /`)
```
2 + 1
↑   ↑  ← operand
  ↑    ← operator
```
"may be another expression" = operand có thể là kết quả của phép tính trước đó

**truncates toward zero** = Cắt phần thập phân, kéo về phía 0:
```
 7 / 2 =  3.5 → truncate →  3
-7 / 2 = -3.5 → truncate → -3
```
`int()` trong Python = truncate toward zero. Chặt thẳng tay, không làm tròn.

**intermediate calculations** = Các phép tính trung gian (kết quả chưa phải final). 32-bit = không lo overflow.

---

## 💡 Tại Sao Stack? (Pattern Recognition)

**Signal nhận ra Stack:**
> "Numbers WAIT. Operator fires on the two BEFORE it."

Từ khóa **"wait" + "pending items" + "retrieved later in order"** = Stack signature.

**Kết nối với bài đã làm:** Valid Parentheses — `(` waits for `)`. Cùng cơ chế: items pending, retrieved khi điều kiện xảy ra.

**3-Gate check:**
```
Gate 1: Abstract shape match? → YES — "pending items" = Stack signal
Gate 2: Name it + WHY?       → Stack vì numbers phải "chờ" đến khi operator xuất hiện
Gate 3: Solved before?       → YES — Valid Parentheses (#26)
→ PATTERN PATH ✅
```

**Invariant:**
> "At any point while scanning tokens, the stack always holds the most recent values not yet consumed by an operator."

---

## ⚠️ Mistakes Made This Session

### Bug 1 — Wrong variable name
```python
# ❌ BAD
for i in range(len(tokens)):
    if nums[i].isdigit():  # nums không tồn tại! Parameter là tokens

# ✅ FIX
for token in tokens:
    if token not in ops:
```

### Bug 2 — isdigit() fails on negative numbers
```python
"-11".isdigit()  # → False ❌ bị treat như operator!
"11".isdigit()   # → True ✅
```
`isdigit()` và `isnumeric()` đều fail với số âm vì `-` không phải digit.

### Bug 3 — Wrong return variable
```python
# ❌ BAD
return int(result.pop())  # result là int, không có .pop()

# ✅ FIX
return int(stack.pop())   # stack là list
```

### Bug 4 — Operand order reversed ← CRITICAL
```python
first_num  = stack.pop()  # popped FIRST = RIGHT operand (pushed last)
second_num = stack.pop()  # popped SECOND = LEFT operand (pushed first)

# ❌ BAD — works for + and * (commutative) but BREAKS for - and /
result = ops[token](first_num, second_num)   # 5/13 = 0.38 ❌

# ✅ FIX — LEFT op RIGHT
result = ops[token](second_num, first_num)   # 13/5 = 2 ✅
```
**Tại sao?** Stack LIFO — thứ push sau thì pop ra trước. Số push trước là LEFT operand, số push sau là RIGHT operand. Phép tính = LEFT op RIGHT = second_num op first_num.

### Bug 5 — Division produces float, corrupts intermediate results
```python
# ❌ operator.truediv → float trong stack → sai kết quả
"/": operator.truediv      # 7/2 = 3.5 (float stored in stack)
# Sau đó: 3.5 * 3 = 10.5 → int(10.5) = 10 ❌ (đúng phải là 9)

# ✅ Truncate tại chỗ — integer trong stack
"/": lambda a, b: int(a / b)   # 7/2 → int(3.5) = 3 → 3*3 = 9 ✅
```
**Key insight:** Truncation phải xảy ra TẠI BƯỚC CHIA, không phải chỉ ở cuối.

---

## 💥 Aha Moments

**Moment 1 — RPN click:**
Wiganz không hiểu RPN. Hadriel hỏi: "Nhìn `["2","1","+"]` — `+` đứng sau `2` và `1`. Khi gặp `+` thì bro làm gì?"
→ "Do operation on 2 previous" → CLICK. RPN = toán tử fires on 2 numbers before it.

**Moment 2 — Stack recognition tự mình tìm ra:**
Không cần hint. Wiganz nhìn vào abstract "numbers wait, pending items" → tự nói "kinda looks like Valid Parentheses... a Stack I believe." 🔥

**Moment 3 — isdigit() vs not in ops:**
`"-11".isdigit()` → False. Wiganz tự hỏi "wait, nếu token not in ops thì nó là số." Clean insight tự tìm.

**Moment 4 — int() = truncate toward zero:**
"So `int()` là truncate toward zero hả?" → Đúng chính xác. Chặt phần thập phân, kéo về 0. Luôn luôn.

**Moment 5 — Division bug proof:**
```python
["7","2","/","3","*"]
operator.truediv: 7/2=3.5 → 3.5*3=10.5 → int=10  ❌
int(a/b):         7/2→3   → 3*3=9                  ✅
```
Thấy bằng code, không cần tin mù.

---

## 📚 Các Cách Map Operator (3 cách chính)

### Cách 1 — Lambda dict ✅ (Best for interview)
```python
ops = {
    "+": lambda a, b: a + b,
    "-": lambda a, b: a - b,
    "*": lambda a, b: a * b,
    "/": lambda a, b: int(a / b),  # truncate toward zero
}
```

### Cách 2 — operator module ⚠️ (Cẩn thận division)
```python
import operator
ops = {
    "+": operator.add,
    "-": operator.sub,
    "*": operator.mul,
    "/": operator.truediv,  # ❌ returns float! Phải wrap int() riêng
}
```

### Cách 3 — if/elif ✅ (Verbose nhưng OK)
```python
def calculate(a, op, b):
    if op == "+": return a + b
    elif op == "-": return a - b
    elif op == "*": return a * b
    elif op == "/": return int(a / b)
```

**❌ KHÔNG dùng `eval()`** — nguy hiểm, chạy bất kỳ code nào từ input.

---

## 📚 Các Cách Check Token Là Số

| Cách | `"2"` | `"-11"` | `"+"` | Verdict |
|---|---|---|---|---|
| `isdigit()` | ✅ | ❌ | ❌ | ❌ Fail với âm |
| `isnumeric()` | ✅ | ❌ | ❌ | ❌ Fail với âm |
| `token not in ops` | ✅ | ✅ | ✅ | ✅ Cleanest |
| `try: int(token)` | ✅ | ✅ | ✅ | ✅ Works |
| `lstrip('-').isdigit()` | ✅ | ✅ | ✅ | ✅ Verbose |

**Best:** `token not in ops` — O(1) dict lookup, no exception, no edge case.

---

## ✅ Final Clean Solution

```python
class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        ops = {
            "+": lambda a, b: a + b,
            "-": lambda a, b: a - b,
            "*": lambda a, b: a * b,
            "/": lambda a, b: int(a / b),  # truncate toward zero, not floor
        }
        stack = []
        for token in tokens:
            if token not in ops:
                stack.append(int(token))
            else:
                first_num = stack.pop()   # RIGHT operand (pushed last)
                second_num = stack.pop()  # LEFT operand (pushed first)
                stack.append(ops[token](second_num, first_num))  # LEFT op RIGHT
        return stack.pop()
```

**Why no `deque`?** Python `list` với `.append()` và `.pop()` IS a stack — O(1) cả hai. `deque` dùng cho queue (popleft). Đừng over-import.

**Why no `int()` on return?** Stack chỉ chứa integers (numbers được `int(token)` khi push, division được `int(a/b)` ngay tại chỗ). Final value đã là int rồi.

---

## 📊 Complexity

| | Complexity | Why |
|---|---|---|
| **Time** | O(n) | One pass through tokens |
| **Space** | O(n) | Stack worst case: all numbers, one operator at end |

**BTTC:** O(n) — phải visit every token ít nhất một lần. Đã optimal.

---

## 🔄 Python Division — 3 cách, 3 kết quả khác nhau

```python
-7 / 2   = -3.5  # float
-7 // 2  = -4    # floor (về phía -∞) ← SAI cho bài này
int(-7/2)= -3    # truncate toward zero ← ĐÚNG
```

`int()` = cái kéo ✂️ — chặt phần thập phân, kéo về 0. Với positive thì giống floor. Với negative thì KHÁC — đây là điểm LeetCode test.

---

## 📅 Session Notes

- Bắt đầu không hiểu RPN gì cả → decode qua trace example → click
- Pattern tự nhận ra (Stack) — không cần hint 🔥
- Code trong 25 phút, 4 bugs found + fixed in Teaching Mode
- Operand order bug là critical nhất — silent wrong answer, không crash
- Division float bug là subtle nhất — chỉ sai với negative intermediate division
