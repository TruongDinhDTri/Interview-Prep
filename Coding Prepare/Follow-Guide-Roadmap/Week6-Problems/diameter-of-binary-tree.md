# Diameter of Binary Tree — Complete Session Archive

**Pattern:** DFS / Tree Traversal (First Principles) | **Difficulty:** Easy | **LeetCode:** #543 | **Date:** 2026-04-25

---

## 🗺️ The Journey — How Understanding Built

No pattern recognized at Step 2. Went full First Principles. Through counting edges one-by-one in the trace, discovered the core rule: **diameter at any node = left height + right height**. Then connected that to DFS naturally. Hit 4 bugs during coding — fixed all of them. Discovered the Python `nonlocal` keyword. Space complexity O(h) flagged for deeper discussion.

---

## 🎯 Step 1 — Understand

### Problem Statement
```
Given the root of a binary tree, return the length of the diameter.
Diameter = longest path between any two nodes, measured in EDGES.
Path may or may not pass through the root.
```

### Abstract (Story Stripped)
> **"For each node in the tree, compute left_height + right_height. Return the maximum across all nodes."**

### Constraint Questions Asked

| Question | Answer |
|---|---|
| Values negative? | Yes (-100 to 100) — irrelevant, we count edges not values |
| How is input stored? | Binary tree — each node has `val`, `left`, `right` |
| Expected size? | 1 to 10,000 nodes |
| One valid answer? | Yes |
| Return what? | Integer — number of **edges** in the longest path |

### Trace — Example 1

```
        1
       / \
      2   3
     / \
    4   5
```

**Counting edges step by step (how the answer 3 was discovered):**

| Segment | Edges |
|---|---|
| 4 → 2 | 1 |
| 2 → 1 | 1 |
| 1 → 3 | 1 |
| **Total** | **3** |

**Key observation from the trace:**
- From node `1`: left side goes down 2 edges (1→2→4 or 1→2→5)
- From node `1`: right side goes down 1 edge (1→3)
- **2 + 1 = 3** = the diameter

---

## 🔑 The Core Rule — HOW We Discovered It (Full Process)

```
diameter at any node = left_height + right_height
```

**This was NOT handed to us. Here is the exact thinking process that led here.**

---

### The problem at Step 1

After tracing Example 1, Wiganz said:
> *"I can SEE that the longest path is 4→2→1→3. But I can't REASON it. I just saw it with my eyes."*

That's the honest moment. Seeing the answer is not the same as understanding it. So we slowed down and counted — one edge at a time.

---

### The counting dialogue (how the rule emerged)

```
Q: How many edges between node 4 and node 2?
A: 1

Q: How many edges between node 2 and node 1?
A: 1

Q: How many edges between node 1 and node 3?
A: 1

Q: Add them. What is the total?
A: 3  ← matches the expected output
```

At this point the trace was done — but the rule wasn't stated yet. So the next question was:

```
Q: From node 1 — how many edges go DOWN on the LEFT side,
   all the way to the deepest node?
A: 2  (1→2→4 or 1→2→5)

Q: From node 1 — how many edges go DOWN on the RIGHT side?
A: 1  (1→3)

Q: Add them.
A: 3  ← same answer again
```

**That second addition is where the rule lives.**

Left side of node 1 = 2 edges going down = **left height**
Right side of node 1 = 1 edge going down = **right height**
2 + 1 = 3 = **the diameter**

---

### Why this generalizes to ANY node

The longest path through a node is the farthest you can go LEFT + the farthest you can go RIGHT.

"Farthest you can go left" = left subtree height.
"Farthest you can go right" = right subtree height.

So at **any** node in the tree:

```
diameter_through_this_node = left_height + right_height
```

But the problem asks for the maximum diameter across the **entire tree** — not just at the root. The path might pass through node 2, or node 4, or any node — not necessarily root. So the rule must be checked at every node, and we take the maximum.

```
answer = max(left_height + right_height)  across all nodes
```

---

### Why the path doesn't always go through the root

Imagine a tree like:
```
        1
       /
      2
     / \
    4   5
   /
  6
```

The longest path here is 6→4→2→5 — it goes through node 2, NOT the root. If we only checked at root 1, we'd miss it. That's why we check at every single node.

---

### The final rule (earned, not memorized)

```
diameter at any node = left_height + right_height
```

This came from:
1. Counting real edges in a real example
2. Noticing left side + right side = the answer
3. Asking "does this generalize?" → yes, to any node
4. Asking "which node gives the max?" → we don't know, so check all of them

---

## 🔵 Step 2 — Approach: First Principles Path

**3-Gate result:** NO to all three.

**3F Technique D — Data Structures scan:**

The rule says: compute left_height + right_height at **every node**. To visit every node in a tree → **DFS**.

**Why DFS fits:**
> *"We have to travel to the deepest node of each left/right subtree, then report back the height."*

That is post-order DFS — children compute first, then the parent uses their results.

---

## 🗣️ Step 3 — Discuss

**Approach:** Post-order DFS. At each node compute left_height + right_height, track global max.

**Numbered steps:**
1. Initialize `max_diameter = 0`
2. Base case: if `node is None`, return `0`
3. Recurse left → get `left_height`
4. Recurse right → get `right_height`
5. Update: `max_diameter = max(max_diameter, left_height + right_height)`
6. Return `1 + max(left_height, right_height)` — height back to parent
7. After DFS completes, return `max_diameter`

**Complexity corrected during discussion:**

| | Wiganz's first answer | Corrected |
|---|---|---|
| Time | O(h) | **O(n)** — DFS visits every node once |
| Space | O(1) | **O(h)** — recursive call stack depth = tree height |

**Space O(h) deeper discussion (flagged, not fully resolved):**
- Balanced tree: h = log n → O(log n) space
- Skewed tree (worst case): h = n → O(n) space
- We say **O(h)**, worst case **O(n)**

---

## ⚠️ NEEDS DEEPER DISCUSSION — Space & Time Complexity

### Time: Why O(n) and not O(h)?

In session, Wiganz first said O(h). Corrected to O(n). But the reasoning was quick:
> *"DFS visits all nodes → O(n)"*

**What needs to be discussed:**
- WHY does DFS visit exactly n nodes (not more, not less)?
- In a recursive DFS, do we ever visit a node twice?
- How do we prove to an interviewer that it's O(n) and not O(n²)?
- What changes if the tree is unbalanced — is it still O(n)?

---

### Space: Why O(h) and not O(n)?

In session, Wiganz said O(n) for space. Corrected to O(h). But this was also quick.

**What needs to be discussed:**
- The call stack holds the CURRENT PATH from root to the node being visited — not all nodes
- At any moment, how many stack frames are active? Exactly h (the depth of the current call)
- Why does the stack NOT hold all n nodes at once?
- Draw it out: what does the call stack look like at the moment dfs(4) is running?
  - Stack: dfs(1) → dfs(2) → dfs(4) ← only 3 frames for a tree of height 3
- Worst case: completely skewed tree (each node has only one child) → h = n → O(n) space
- Best case: perfectly balanced → h = log n → O(log n) space
- How to say this confidently in interview: *"Space is O(h) where h is the height of the tree. In the worst case, a skewed tree, h = n, so worst case O(n). For a balanced tree, O(log n)."*

**Needs hands-on exercise:** Draw the call stack frame by frame for a skewed tree of 5 nodes. Count how many frames are alive at the deepest point. Answer should be 5 = n = h.

---

---

## ⌨️ Step 4 — Code: All Bugs Encountered

### Bug 1 — Scope: Python creates a local variable when you assign inside nested function

**Wrong:**
```python
def diameterOfBinaryTree(self, root):
    max_diameter = 0
    def dfs(root):
        # Python sees the assignment below and treats max_diameter as LOCAL
        max_diameter = max(max_diameter, left_height + right_height)  # UnboundLocalError!
```

**Why it fails:** Python sees `max_diameter = ...` inside `dfs` and decides it's a **local variable**. Then when it tries to READ `max_diameter` on the right side of `max(...)`, the local doesn't exist yet → `UnboundLocalError: local variable 'max_diameter' referenced before assignment`.

**Fix:** Use `nonlocal`:
```python
def dfs(root):
    nonlocal max_diameter   # ← tells Python: use the outer variable, don't create a new local
```

### Bug 2 — Return type mismatch (during a different attempt)

**Wrong version (passing max_diameter as param):**
```python
def dfs(root, max_diameter):
    if root is None:
        return 0             # ← returns int
    ...
    return height, max_diameter  # ← returns tuple
# Unpacking fails when base case hits
```

**Why it fails:** Base case returns `int`, recursive case returns `tuple`. Unpacking `left_height, max_diameter = dfs(root.left, max_diameter)` crashes when it hits `None`.

### Bug 3 — Returning height instead of max_diameter

**Wrong:**
```python
dfs(root)
return dfs(root)   # ← returns height (int from 1 + max(left,right)), NOT max_diameter
```

**Fix:**
```python
dfs(root)
return max_diameter
```

### Bug 4 — Never calling dfs at all

**Wrong:**
```python
max_diameter = 0
def dfs(root): ...
return max_diameter   # ← dfs was never called, returns 0 always
```

**Fix:**
```python
dfs(root)         # ← call it first
return max_diameter
```

---

## ✅ Final Correct Code

```python
class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        max_diameter = 0

        def dfs(node):
            nonlocal max_diameter          # use outer variable, not local
            if node is None:
                return 0                   # base case: height of None = 0
            left_height = dfs(node.left)
            right_height = dfs(node.right)
            max_diameter = max(max_diameter, left_height + right_height)  # update global max
            return 1 + max(left_height, right_height)  # return height to parent

        dfs(root)
        return max_diameter
```

---

## 🧪 Step 5 — Verify (Partial Trace)

```
        1
       / \
      2   3
     / \
    4   5
```

| Call | Node | left_h | right_h | max_diameter | returns |
|------|------|--------|---------|--------------|---------|
| dfs(4) | 4 | 0 | 0 | max(0, 0+0)=0 | 1 |
| dfs(5) | 5 | 0 | 0 | max(0, 0+0)=0 | 1 |
| dfs(2) | 2 | 1 | 1 | max(0, 1+1)=**2** | 2 |
| dfs(3) | 3 | 0 | 0 | max(2, 0+0)=2 | 1 |
| dfs(1) | 1 | 2 | 1 | max(2, 2+1)=**3** | 3 |

**Final `max_diameter = 3`** ✓

---

## 💡 Key Insights to Remember

### 1. The Core Rule
```
diameter at node = left_height + right_height
```
The function returns HEIGHT (for the parent to use), but updates DIAMETER (the answer) as a side effect.

### 2. Two different things tracked
- `dfs` **returns** height — so the parent can compute its own diameter
- `max_diameter` **stores** the answer — updated at every node

These are different. Confusing them causes bugs.

### 3. Python `nonlocal` keyword
```python
x = 0
def outer():
    x = 10          # creates LOCAL x, doesn't touch outer x
    
def outer_fixed():
    nonlocal x
    x = 10          # NOW updates outer x
```
Use `nonlocal` whenever a nested function needs to **assign** to an outer variable.

### 4. Post-order DFS pattern
```
compute left → compute right → use both results at current node
```
This is post-order. The pattern works because children know their heights before the parent needs them.

### 5. Why `return dfs(root)` is wrong
`dfs` returns **height**, not **diameter**. Always separate:
```python
dfs(root)         # run the traversal (side effect updates max_diameter)
return max_diameter  # return the actual answer
```

---

## ⚠️ Common Mistakes to Avoid

1. **Forgetting `nonlocal`** → always returns 0 silently — hardest bug to spot
2. **`return dfs(root)`** instead of `dfs(root); return max_diameter` → returns height not diameter
3. **Forgetting to call `dfs(root)`** → max_diameter never updated, returns 0
4. **Inconsistent return types** in base case vs recursive case when passing max_diameter as param
5. **Confusing height and diameter** — they are different things tracked differently

---

## 📊 Final Complexity

| | Complexity | Reason |
|---|---|---|
| Time | O(n) | DFS visits every node exactly once |
| Space | O(h) | Call stack depth = height of tree. Worst case O(n) for skewed tree, O(log n) for balanced |

---

## 🔄 Decision Points to Remember

1. **First Principles path** — the rule was discovered by manually counting edges, not by pattern matching
2. **DFS chosen because** we need to go deep first (to get heights), then report back up
3. **Track two things separately** — height (return value) and diameter (nonlocal variable)
4. **Call order matters** — `dfs(root)` then `return max_diameter`, never combined

---

## 🔗 Similar Problems
- Maximum Depth of Binary Tree (#104) — same DFS height pattern, simpler
- Longest Univalue Path (#687) — same nonlocal + post-order pattern
- Binary Tree Maximum Path Sum (#124) — harder version of the same idea
