# Lowest Common Ancestor of a BST — Mistakes & Insights

**Pattern:** DFS / BST Property | **Difficulty:** Medium | **Date:** 2026-04-16

---

## ❌ Mistakes Made

**1. Returned `current.val` instead of `current`**
```python
# Wrong
return current.val

# Correct
return current
```
- The function signature is `-> 'TreeNode'` — it expects a **node**, not an integer.
- `current.val` is an `int`. Returning it caused `AttributeError: 'int' object has no attribute 'val'` when the driver tried to call `.val` on the result.
- Rule: always re-read the return type in the function signature before writing `return`.

**2. Stated time complexity as O(log n) instead of O(h)**
- O(log n) is only true for a **balanced** BST.
- A skewed BST (every node has only one child) has height = n → O(n) worst case.
- Correct answer: **O(h)** where h = height of the tree. Then clarify: O(log n) if balanced, O(n) if skewed.

**3. Typo — `curren.val` instead of `current.val`**
```python
# Wrong
elif q.val > curren.val and p.val > current.val:

# Correct
elif q.val > current.val and p.val > current.val:
```
- Caught during Step 5: Verify scan. Always do a silent read-through before tracing.

---

## ✅ Clean Solution

```python
def lowestCommonAncestor(root, p, q):
    current = root
    while current:
        if p.val > current.val and q.val > current.val:
            current = current.right
        elif p.val < current.val and q.val < current.val:
            current = current.left
        else:
            return current
    return None
```

**Time:** O(h) — h = height of tree (O(log n) balanced, O(n) skewed) | **Space:** O(1)

---

## 💡 Key Insights

- **Abstract version:** "Find the last node where p and q are still on the same side"
- **BST property is the key:** left < root < right — use it to navigate without visiting every node
- **3 rules discovered from tracing:**
  - Both < current → go left
  - Both > current → go right
  - Split (or one equals current) → this IS the LCA, return immediately
- **Why `while current:` doesn't need an explicit None check:** p and q are guaranteed to exist in the BST, so the `else` branch always triggers before `current` becomes None
- **No recursion needed:** iterative loop is cleaner and O(1) space vs O(h) call stack for recursive version
- **Stopping condition insight:** "I stop when p and q are not both smaller or both bigger than me" — the split point is the answer
