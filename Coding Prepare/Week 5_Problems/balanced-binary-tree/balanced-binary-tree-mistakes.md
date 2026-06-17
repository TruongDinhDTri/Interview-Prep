# Balanced Binary Tree — Mistakes & Insights

**Pattern:** DFS (Post-order) | **Difficulty:** Easy | **Date:** 2026-04-16 | **Revisit:** ✅ DONE (2026-05-09 — Time & Space complexity fully understood)

---

## ❌ Mistakes Made

**1. Said "no pattern" — jumped to brute force thinking**
- Thought "it's simple, no pattern here."
- Rule: ANY tree problem with "every node" + "height" + "traversal" = DFS signal.
- Use the 3P Match sentence: "I see **tree height** and **every node** which tells me **DFS (post-order)** because each node needs the height of its children FIRST before it can check the balance condition."

**2. Said O(n) for skewed brute force — ✅ UNDERSTOOD**

### 🔑 Brute Force là gì trong bài này?

Brute force = với MỖI node trong cây, gọi hàm `height()` RIÊNG cho subtree trái VÀ phải, rồi so sánh.

```python
def isBalanced(root):
    if root is None:
        return True
    left_h  = height(root.left)     # ← gọi height() RIÊNG
    right_h = height(root.right)    # ← gọi height() RIÊNG
    if abs(left_h - right_h) > 1:
        return False
    return isBalanced(root.left) and isBalanced(root.right)
    #      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    #      rồi LẠI đi vào con trái, con phải
    #      mà ở đó LẠI gọi height() RIÊNG CHO NÓ NỮA!!
```

**Vấn đề:** Hàm `height()` KHÔNG nhớ kết quả. Mỗi lần gọi, nó phải **đi xuống đếm lại từ đầu**.
`isBalanced(node2)` sẽ gọi `height()` LẠI TỪ ĐẦU cho subtree của node 2 — dù node 1 đã đếm qua node 2 rồi!

Tưởng tượng: Mỗi quản lý tầng trong tòa nhà đều phải TỰ ĐI BỘ XUỐNG để đếm số tầng bên dưới mình. Không ai nhớ kết quả cho người khác.

### 🔴 Skewed Tree Brute Force = O(n²) — VÌ ĐẠP LÊN NHAU

```
1  gọi height() → đếm [2, 3, 4, 5]     = 4 bước
 \
  2  gọi height() → đếm [3, 4, 5]      = 3 bước  ← TRÙNG 3,4,5!
   \
    3  gọi height() → đếm [4, 5]       = 2 bước  ← TRÙNG 4,5!
     \
      4  gọi height() → đếm [5]        = 1 bước  ← TRÙNG 5!
       \
        5  leaf                         = 0 bước
```

**Các node bị đếm LẶP LẠI nhiều lần:**
- Node 5 bị đếm **4 LẦN** (bởi node 1, 2, 3, 4)
- Node 4 bị đếm **3 LẦN** (bởi node 1, 2, 3)
- Node 3 bị đếm **2 LẦN** (bởi node 1, 2)

**Tại sao đạp lên nhau?** Vì mỗi level chỉ có 1 node, và node đó phải đếm GẦN HẾT cây bên dưới. Node tiếp theo cũng đếm gần hết cây bên dưới NÓ — mà cây bên dưới nó TRÙNG với cây mà node trước đã đếm!

**Tổng = 4 + 3 + 2 + 1 + 0 = 10**

Tổng quát với n nodes: `(n-1) + (n-2) + ... + 1 = n(n-1)/2 = O(n²)`

Kiểm tra: n=5 → (5-1)×5/2 = 4×5/2 = 10 ✅

### 🟢 Balanced Tree Brute Force = O(n log n) — VÌ CHIA NHAU, KHÔNG TRÙNG

```
        1              ← Level 0
       / \
      2   3            ← Level 1
     / \ / \
    4  5 6  7          ← Level 2 (leaf)
```

Đếm từng node gọi height() đi qua mấy node:

```
Node 1: height() đi qua [2,3,4,5,6,7]  = 6 bước
Node 2: height() đi qua [4,5]           = 2 bước
Node 3: height() đi qua [6,7]           = 2 bước
Node 4: leaf                             = 0
Node 5: leaf                             = 0
Node 6: leaf                             = 0
Node 7: leaf                             = 0
```

**Cộng theo TỪNG LEVEL:**

```
Level 0:  Node 1 làm 6 bước                        → tổng = 6  ≈ n(7)
Level 1:  Node 2 làm 2 + Node 3 làm 2              → tổng = 4  ≈ n
Level 2:  4 leaf nodes × 0                          → tổng = 0
```

**Tại sao mỗi level ≈ n?** Vì các node cùng level có subtree RIÊNG, KHÔNG TRÙNG:

```
Level 1:
  Node 2 "sở hữu" nửa TRÁI:  đếm [4, 5]   ← subtree riêng
  Node 3 "sở hữu" nửa PHẢI:  đếm [6, 7]   ← subtree riêng
                                               ──────────────
                                   KHÔNG AI ĐẠP LÊN AI!
                                   Cộng lại = 4 nodes ≈ n ✅
```

Kiểm chứng với cây lớn hơn (15 nodes, 4 levels):

```
              1                              ← Level 0
           /     \
         2         3                         ← Level 1
        / \       / \
       4   5     6   7                       ← Level 2
      /\ / \   / \ / \
     8 9 10 11 12 13 14 15                   ← Level 3 (leaf)

Level 0: Node 1 → đi qua 14 nodes                        = 14  ≈ n(15)
Level 1: Node 2 → [4,5,8,9,10,11]=6  +  Node 3 → [6,7,12,13,14,15]=6  = 12  ≈ n
Level 2: Node 4→[8,9]=2 + Node 5→[10,11]=2 + Node 6→[12,13]=2 + Node 7→[14,15]=2 = 8  ≈ n
Level 3: 8 leaves × 0                                     = 0
```

Mỗi level ≈ n. Cây balanced có **log(n) levels**.
→ Tổng = n × log(n) = **O(n log n)**

### 🔥 AHA MOMENT — Sự khác biệt cốt lõi: ĐẠP LÊN vs CHIA NHAU

```
┌─────────────────────────────────────────────────────────────────────┐
│  SKEWED:   Mỗi level 1 node → node đó đếm GẦN HẾT cây           │
│            Node kế tiếp cũng đếm gần hết → TRÙNG LẶP/ĐẠP LÊN    │
│            n levels × giảm dần = 1+2+...+(n-1) = O(n²)            │
│                                                                     │
│  BALANCED: Mỗi level nhiều nodes → mỗi node đếm PHẦN RIÊNG       │
│            KHÔNG TRÙNG → cộng lại ≈ n                              │
│            log(n) levels × ~n mỗi level = O(n log n)               │
└─────────────────────────────────────────────────────────────────────┘
```

### ⚡ So sánh 3 approaches — Time Complexity

| Approach | Skewed Tree | Balanced Tree | Lý do |
|----------|------------|---------------|-------|
| Brute force | O(n²) | O(n log n) | Gọi height() riêng cho mỗi node, đếm lại từ đầu |
| DFS (optimal) | O(n) | O(n) | Tính height + check balance trong 1 lần duy nhất |

**DFS optimal O(n):** Mỗi node thăm ĐÚNG 1 LẦN. height() truyền kết quả NGƯỢC LÊN cho cha — không ai đếm lại.

---

**3. Said Space = O(1) — forgot call stack — ✅ UNDERSTOOD**

### Recursion = Call Stack = Chồng đĩa

Mỗi lần gọi đệ quy `dfs(node)`, máy tính xếp 1 "stack frame" (đĩa) lên call stack. Khi hàm return, bỏ đĩa ra. **Space = số đĩa chồng lên nhau CÙNG LÚC cao nhất.**

### 🟢 Cây Balanced — Stack cao tối đa log(n)

```
        1
       / \
      2   3
     / \ / \
    4  5 6  7

DFS trace:
dfs(1)          Stack: [1]              1 đĩa
  dfs(2)        Stack: [1, 2]           2 đĩa
    dfs(4)      Stack: [1, 2, 4]        3 đĩa  🔴 CAO NHẤT
      dfs(None) return
    bỏ đĩa 4    Stack: [1, 2]          ← QUAY LẠI, bỏ đĩa ra!
    dfs(5)      Stack: [1, 2, 5]        3 đĩa  🔴
      return
    bỏ đĩa 5    Stack: [1, 2]
  bỏ đĩa 2      Stack: [1]             ← bỏ đĩa ra trước khi đi nhánh phải!
  dfs(3)        Stack: [1, 3]           2 đĩa
    dfs(6)      Stack: [1, 3, 6]        3 đĩa  🔴
    ...

Stack cao nhất = 3 = height = log₂(7) ≈ 3 ✅
```

**Cây balanced có chỗ "rẽ nhánh" → DFS đi xuống rồi QUAY LẠI, bỏ đĩa ra trước khi đi nhánh khác → stack không bao giờ quá cao.**

### 🔴 Cây Skewed — Stack cao tối đa n

```
1
 \
  2
   \
    3
     \
      4
       \
        5

DFS trace:
dfs(1)    Stack: [1]                1 đĩa
  dfs(2)  Stack: [1, 2]            2 đĩa
    dfs(3) Stack: [1, 2, 3]        3 đĩa
      dfs(4) Stack: [1, 2, 3, 4]   4 đĩa
        dfs(5) Stack: [1, 2, 3, 4, 5]  5 đĩa  🔴 = n!

Stack cao nhất = 5 = n (KHÔNG CÓ CHỖ QUAY LẠI, cứ chồng đĩa mãi!)
```

**Cây skewed KHÔNG có chỗ rẽ → DFS cứ đi thẳng xuống → stack chồng hết n đĩa lên.**

### 🔥 AHA MOMENT — Tại sao Space = O(h)

**h = chiều cao cây = đường đi SÂU NHẤT từ root xuống leaf.**

Stack chỉ giữ các node **trên đường đi hiện tại** từ root xuống node đang xét. Đường đi dài nhất = h.

```
┌──────────────────────────────────────────────────────┐
│  Space = O(h) vì stack = đường đi từ root → node    │
│                                                       │
│  Balanced: h = log(n)  → Space = O(log n)            │
│  Skewed:   h = n       → Space = O(n)                │
│                                                       │
│  Rule: Recursive DFS KHÔNG BAO GIỜ là O(1) space.   │
│        Tối thiểu luôn là O(h).                       │
└──────────────────────────────────────────────────────┘
```

### ⚡ So sánh Space — Balanced vs Skewed

| | Balanced Tree | Skewed Tree |
|--|--------------|-------------|
| Height (h) | log(n) | n |
| Stack cao nhất | log(n) đĩa | n đĩa |
| Space | O(log n) | O(n) |
| Lý do | Có rẽ nhánh → bỏ đĩa ra trước khi đi nhánh khác | Không rẽ → chồng đĩa mãi |

**4. Returned `False` instead of using -1 sentinel**
- Original instinct: return False when unbalanced.
- Problem: the function needs to return height (int) to the parent. Mixing int + bool = messy type checking.
- Fix: use **-1 as a sentinel** — impossible as a real height, so parent knows "broken below."

**5. Missing outer wrapper — returned int instead of bool**
- `isBalanced()` signature requires `-> bool` but the DFS helper returns int.
- Fix: wrap with `return dfs(root) != -1`

---

## 💡 The -1 Sentinel Trick — How It Was Derived

**The problem:** each node needs to return TWO pieces of info to its parent:
1. My height (int)
2. Whether I (or anything below me) is unbalanced (bool)

**Option A:** Use a global variable / nonlocal flag — works but ugly.

**Option B:** Return False sometimes, int sometimes — messy type checking.

**Option C (cleanest):** Pick an impossible height value to signal "broken."
- Real heights are always ≥ 0 (a None node returns 0, a leaf returns 1)
- **-1 is impossible as a real height** → safe to use as "unbalanced detected"
- Parent just checks: `if left == -1 or right == -1: return -1` — one condition, clean propagation

This is a classic pattern: **piggyback two signals into one return value** using a sentinel.

---

## 📊 The 3 Return Rules

```python
# Rule 1: If left == -1 OR right == -1 → return -1 (propagate unbalanced UP)
# Rule 2: If |left - right| > 1        → return -1 (THIS node is unbalanced)
# Rule 3: Otherwise                    → return 1 + max(left, right)  (report height up)
```

**Rule 1 — deep dive (the propagation rule):**
- When `dfs(node.left)` returns `-1`, it means SOMEWHERE deep in the left subtree, a node had `|left - right| > 1` (Rule 2 fired there).
- That `-1` bubbled up through every ancestor via Rule 1.
- At THIS node, you check `if left_height == -1` BEFORE doing `abs(left - right)`.
- Why check BEFORE? Because `-1` is a fake height. If you did `abs(-1 - 2) = 3 > 1` you'd accidentally trigger Rule 2 again — but the reason is wrong (the real reason is a node far below).
- Rule 1 must fire FIRST: "I don't need to check balance at THIS node — I already know something below is broken. Short-circuit and return -1 immediately."
- This is the **early exit** that makes DFS efficient — once broken, no more checking needed anywhere above.

**Rule 2 — the actual balance check:**
- Only runs if BOTH subtrees returned real heights (not -1).
- Uses the heights returned by children to check THIS node's balance condition.
- `abs(left_height - right_height) > 1` → THIS node is the problem.

**Rule 3 — report height to parent:**
- `1 + max(left_height, right_height)` — the +1 counts THIS node itself.
- Parent will use this value to do its own Rule 2 check.

---

## 🔍 Concrete Trace — Unbalanced Tree

```
    1
   / \
  2   3
 / \
4   5  ← left height=1, right height=2 → diff=1 ✅ (node 2 is OK)
     \
      6  ← but what if 5 had TWO more children? Then diff > 1 at node 2
```

**Actual unbalanced trace:**
```
    1
   / \
  2   3
 / \
4   5
     \
      6
       \
        7   ← now node 5 height = 3, node 4 height = 1 → diff = 2 → UNBALANCED at node 2
```

- `dfs(4)` → returns `1` (leaf)
- `dfs(7)` → returns `1` (leaf)
- `dfs(6)` → left=0, right=1 → diff=1 ✅ → returns `2`
- `dfs(5)` → left=0, right=2 → diff=2 ❌ → returns `-1`
- `dfs(2)` → right=-1 → Rule 1 fires → returns `-1`
- `dfs(1)` → left=-1 → Rule 1 fires → returns `-1`
- `isBalanced` → `-1 != -1` is `False` → **NOT balanced** ✅

---

## ✅ Clean Solution

```python
class Solution:
    def isBalanced(self, root: Optional[TreeNode]) -> bool:
        def dfs(node):
            if node is None:
                return 0
            left_height = dfs(node.left)
            right_height = dfs(node.right)

            if left_height == -1 or right_height == -1:
                return -1
            if abs(left_height - right_height) > 1:
                return -1
            return 1 + max(left_height, right_height)

        return dfs(root) != -1
```

**Time:** O(n) — each node visited exactly once | **Space:** O(h) — call stack depth = tree height

---

## 💡 Key Insights

- **Abstract version:** "At every node, check if left subtree height and right subtree height differ by more than 1. If any node fails, the whole tree is unbalanced."
- **Signal → Pattern:** "tree height" + "every node" → DFS (post-order)
- **Post-order is mandatory:** you MUST know children's heights before checking the current node. Process bottom-up.
- **Brute force vs DFS:**
  - Brute force: separate `height()` call per node → O(n²) worst case, O(n log n) balanced
  - DFS: compute height AND check balance in one pass → O(n)
- **The -1 sentinel:** piggybacks height (int) + validity (bool) into one return value. Parent checks one condition to propagate failure.
- **Wrapper pattern:** inner `dfs()` returns int (height or -1). Outer `isBalanced()` converts to bool with `!= -1`.
- **Space:** always O(h) for recursive DFS — never O(1). O(log n) balanced, O(n) skewed.
- **Why `None` returns 0:** an empty subtree has height 0 — this is the base case that terminates recursion.
