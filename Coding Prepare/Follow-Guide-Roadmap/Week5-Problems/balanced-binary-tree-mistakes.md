# Balanced Binary Tree — Mistakes & Insights

**Pattern:** DFS (Post-order) | **Difficulty:** Easy | **Date:** 2026-04-16 | **Revisit:** YES ⚠️

---

## ❌ Mistakes Made

**1. Said "no pattern" — jumped to brute force thinking**
- Thought "it's simple, no pattern here."
- Rule: ANY tree problem with "every node" + "height" + "traversal" = DFS signal.
- Use the 3P Match sentence: "I see **tree height** and **every node** which tells me **DFS (post-order)** because each node needs the height of its children FIRST before it can check the balance condition."

**2. Said O(n) for skewed brute force — ⚠️ REVISIT THIS**
- Brute force = call separate `height()` for every node's left AND right subtrees.

**Skewed tree brute force = O(n²):**
```
1
 \
  2
   \
    3
     \
      4
```
- Node 1 calls `height(right)` → visits 3 nodes below
- Node 2 calls `height(right)` → visits 2 nodes below
- Node 3 calls `height(right)` → visits 1 node below
- Total: 3 + 2 + 1 = n + (n-1) + ... + 1 = **n(n+1)/2 = O(n²)**

**Balanced tree brute force = O(n log n):**
```
        1          ← Level 0
       / \
      2   3        ← Level 1
     / \ / \
    4  5 6  7      ← Level 2
```
- Node 1 calls height on all 6 nodes below → ~n work
- Level 1: node 2 visits {4,5}, node 3 visits {6,7} → 2+2 = 4 work total ≈ n
- Level 2: leaf nodes call height on None → trivial

⚠️ **Why "≈ n" per level? (needs re-discussion)**
The key claim is: at each level, ALL nodes at that level together call `height()` on subtrees that are non-overlapping and together cover most of the n nodes. So each level contributes roughly O(n) total work. The "≈" approximation gets exact as n grows. Needs deeper discussion on WHY subtrees at the same level don't overlap.

- Tree has **log n levels** → O(n) × log n = **O(n log n)**

**DFS:** computes height AND checks balance in ONE pass → **O(n)** — each node visited exactly once.

**3. Said Space = O(1) — forgot call stack**
- Recursion = call stack. Stack depth = height of tree.
- Space is **O(h)** — O(log n) balanced, O(n) skewed.
- Rule: any recursive solution NEVER has O(1) space. It's at least O(h).

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
