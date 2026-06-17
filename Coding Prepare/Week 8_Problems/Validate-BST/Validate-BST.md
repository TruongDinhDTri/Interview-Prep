# 🗡️ Validate Binary Search Tree — Complete Session Archive

> **Pattern:** DFS / Tree Validation | **Difficulty:** Medium | **LeetCode:** #98 | **Date:** 2026-05-20
> **Path Taken:** Pattern Path | **⏱️ Time Used:** N/A | **🎯 Target:** 25 min

---

## 🗺️ The Journey — How Understanding Built

The naive approach — only comparing each node to its direct parent — feels correct but breaks on ancestor violations. The key insight arrived through understanding WHY the local parent check is insufficient: a node inherited from a left subtree must be less than its grandparent, not just its parent. The solution is elegant: pass `(min_val, max_val)` bounds that tighten at every recursive step, propagating the full BST contract down every path. Space complexity reasoning sharpened too — `O(h)` is more precise than `O(n)`, and knowing WHY (call stack depth = path length = height) signals tree structure understanding to the interviewer.

---

## 📖 Step 1 — Understand

### 📝 Problem Statement (Human Language)
Given the root of a binary tree, determine whether it is a valid Binary Search Tree. A valid BST means:
- Every node in the **left subtree** has a value **strictly less than** the node's value.
- Every node in the **right subtree** has a value **strictly greater than** the node's value.
- Both left and right subtrees must themselves be valid BSTs.

The trap: "strictly less than the parent" is NOT enough. A node deep in the right subtree must also be greater than ALL of its ancestors on the left side of the path.

**Input:** root of a binary tree
**Output:** `True` if valid BST, `False` otherwise

### 🔬 Abstract (Story Stripped)
> "Given a binary tree, verify that for every node, all nodes in its left subtree are strictly less than it, and all nodes in its right subtree are strictly greater — propagated across the entire tree, not just to direct children."

### ❓ Constraint Questions
| Question | Answer |
|---|---|
| Can the tree be empty? | Yes — `None` is a valid BST, return `True` |
| Are duplicate values allowed? | No — strict inequality (< and >) |
| Are values bounded? | Values fit in 32-bit integer range |
| Is there only one valid answer? | Yes — either valid or not |
| Can we modify the tree? | Not needed |
| Input structure? | Binary tree (not guaranteed to be BST — that's what we're checking) |

### ✋ Trace by Hand
```
    5
   / \
  1   4
     / \
    3   6
```
Output: `False`.
Definition WHY: Node 4 is in the right subtree of 5, so it must be greater than 5. It is not (4 < 5). The problem's BST rule is violated — not by checking parent/child, but because 4 fails the constraint inherited from ancestor 5.

---

## 🧭 Step 2 — Approach (3-Gate Check)

### 🚦 3-Gate Results
- Gate 1 (abstract shape recognition): ✅ — tree traversal where each node needs context from ancestors
- Gate 2 (can name pattern + explain why): ✅ — DFS with propagated bounds
- Gate 3 (solved something like this): ✅ — post-order DFS pattern (Balanced BT, Diameter, LCA)

→ Decision: **PATTERN PATH**

---

## 🎯 3P Match + 4P Reason

### 🔍 3P — Signal → Pattern → Full Sentence
> "I see a binary tree traversal where each node's validity depends on constraints inherited from ALL ancestors above it, which tells me DFS with propagated bounds — because DFS naturally passes parent context into each child call via function parameters."

### 🧠 4P — Reason

**A — 🐢 Brute Force + Why Bad:**
For every node, collect all nodes in its left subtree and verify each is smaller; collect all nodes in its right subtree and verify each is larger. That's `O(n²)` — each node's subtree scan visits potentially all `n` nodes again.

**B — ⚡ What DFS with Bounds Does Instead:**
Pass a `(min_val, max_val)` window into each recursive call. The window starts as `(-∞, +∞)` at the root. Going left narrows the upper bound: the child must be `< parent.val`. Going right narrows the lower bound: the child must be `> parent.val`. Each node is visited exactly once → `O(n)`.

**C — 🔒 The Invariant:**
Every node must satisfy `min_val < node.val < max_val` — where these bounds encode the full constraint imposed by ALL ancestors on the path from root to this node, not just the direct parent. This is the contract that makes the check globally correct.

---

## 🗣️ Step 3 — Discuss

### 📋 Wiganz's Presentation
1. The naive check (compare only to parent) fails — a node can violate a grandparent's constraint.
2. Solution: pass `(min_val, max_val)` bounds down with each recursive call.
3. At root: bounds are `(-∞, +∞)`.
4. Going left: upper bound tightens to `parent.val` (left child must be less than parent).
5. Going right: lower bound tightens to `parent.val` (right child must be greater than parent).
6. At each node: check `min_val < node.val < max_val`. Fail immediately if not.
7. A `None` node passes — empty subtree is always valid.
8. Time `O(n)`, Space `O(h)`.

### 📊 Complexity Stated
- Time: `O(n)` — every node visited exactly once ✅
- Space: `O(h)` — call stack depth equals tree height ✅

### ✅ Green Light
Green light confirmed before coding.

### ⚠️ What Was Missed
- Mentioning the brute force explicitly before the optimal (brief mention earns Problem Solving rubric points).
- Clarifying the `O(h)` vs `O(n)` distinction upfront in Discuss, not just after — showing you already know the nuance signals tree mastery to the interviewer.

---

## 💻 Step 4 — Code

### 🏗️ Blueprint (Comments First)
```python
def isValidBST(self, root):
    def validate(node, min_val, max_val):
        # Base: empty node is valid
        # Check: node.val must be strictly inside (min_val, max_val)
        # Recurse left: tighten max to node.val
        # Recurse right: tighten min to node.val
    return validate(root, float('-inf'), float('inf'))
```

### ✨ Final Clean Solution
```python
class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        def validate(root, min_val, max_val):
            if root is None:
                return True
            if not (min_val < root.val < max_val):
                return False
            return (
                validate(root.left, min_val, root.val) and
                validate(root.right, root.val, max_val)
            )
        return validate(root, float('-inf'), float('inf'))
```

**⏱️ Time:** O(n) — visits every node exactly once
**📦 Space:** O(h) — call stack depth mirrors the root-to-leaf path

---

## 🔍 Step 5 — Verify

### 👣 Trace Through the Invalid Example
```
    5
   / \
  1   4
     / \
    3   6
```

| Call | min_val | max_val | node.val | Check | Result |
|---|---|---|---|---|---|
| validate(5, -∞, +∞) | -∞ | +∞ | 5 | -∞ < 5 < +∞ ✅ | recurse |
| validate(1, -∞, 5) | -∞ | 5 | 1 | -∞ < 1 < 5 ✅ | recurse children |
| validate(None, -∞, 1) | — | — | None | ✅ base case | True |
| validate(None, 1, 5) | — | — | None | ✅ base case | True |
| validate(4, 5, +∞) | 5 | +∞ | 4 | 5 < 4 < +∞ ❌ | **False** |

Returns `False` at node 4. Correct.

### 👣 Trace Through a Valid Example
```
    2
   / \
  1   3
```

| Call | min_val | max_val | node.val | Check | Result |
|---|---|---|---|---|---|
| validate(2, -∞, +∞) | -∞ | +∞ | 2 | ✅ | recurse |
| validate(1, -∞, 2) | -∞ | 2 | 1 | ✅ | True |
| validate(3, 2, +∞) | 2 | +∞ | 3 | ✅ | True |

Returns `True`. ✅

### 🧪 Edge Cases
| Case | Input | Expected | Handled? |
|---|---|---|---|
| Empty tree | `root = None` | `True` | ✅ base case |
| Single node | `root.val = 5` | `True` | ✅ both children None |
| Ancestor violation | Node 3 in right subtree of 2 but left of 4, in tree where 2's ancestor says max=2 | `False` | ✅ bounds propagate |
| Duplicate values | Node equal to parent | `False` | ✅ strict `<` not `<=` |
| Left-skewed tree | Long left chain | valid BST check | ✅ DFS follows each path |
| `INT_MIN` / `INT_MAX` values | node.val = -2^31 | Handled correctly | ✅ float('-inf') beats any int |

### ✅ Complexity Confirmed
- Time `O(n)` — single DFS pass, each node visited once.
- Space `O(h)` — max call stack depth is the height of the tree.

---

## 🐛 Bugs & Mistakes

### 🐛 Bug 1: Naive Parent-Only Check
- **❌ What:** Checking `node.val > node.left.val and node.val < node.right.val` at every node — without passing any inherited bounds.
- **🔍 Why:** `approach misunderstanding` — the BST definition sounds local (parent vs child) but the constraint is global (node vs ALL ancestors on its path).
- **💸 Cost:** Would pass invalid trees like the example above where node 4 is only checked against its parent (itself), not its grandparent 5.
- **🛡️ Prevention:** BST validity = ancestral contract, not local contract. The moment you think "compare to parent," upgrade the mental model to "compare against the full inherited range."

> Root cause category: `approach misunderstanding`

---

## 💡 Discoveries (Aha Moments)

### 🔒 Core Invariant / Rule
> **Every node must satisfy `min_val < node.val < max_val`, where those bounds encode the full accumulated constraint from every ancestor above it on its root-to-node path.**

The bounds are not static — they narrow as you go deeper. Going left: ceiling drops to parent's value. Going right: floor rises to parent's value. The recursive call signature itself enforces this tightening.

### ⚡ Aha Moments

**💡 1. The Ancestor Violation Problem**
- **Before:** BST check = compare node to its direct parent. Feels right.
- **Trigger:** The example tree — node 4 passes its local parent check (4 < right-of-5 ✅) but violates the grandparent rule (4 must be > 5 ❌).
- **After:** BST validity is a constraint inherited from the entire ancestor chain, not just the direct parent. A node in the right subtree of 5 must be `> 5` forever, no matter how deep it goes.

**💡 2. Propagating Bounds = Propagating the Contract**
- **Before:** Unclear how to check ancestor constraints without a separate traversal.
- **Trigger:** Passing `(min_val, max_val)` as parameters — the call itself carries the accumulated constraint forward.
- **After:** Each recursive call hands down "your valid range" to its children. Going left narrows max. Going right narrows min. The function parameter IS the inherited contract.

**💡 3. Space Complexity is O(h), Not O(n)**
- **Before:** "Space is O(n) for the recursion."
- **Trigger:** Call stack depth = path length from current node to root = tree height h.
- **After:** O(h) is more precise. For a balanced tree h = log(n). For a skewed tree h = n. Saying O(h) — not O(n) — shows the interviewer you understand how call stack depth maps to tree structure.

### 🎨 Key Metaphors & Examples
- **The Border Crossing Metaphor:** Each level of the tree is a border checkpoint. The checkpoint doesn't invent new rules — it hands you a slightly narrower passport (range) and says "within this range only." Your range at any node is the intersection of all checkpoints you passed through from root to here.
- **The Ancestor Violation Example:** `[5, 1, 4, null, null, 3, 6]` — node 4 sitting in 5's right subtree but being smaller than 5. The local check (4 vs its children 3 and 6) passes. The global check (4 must be > 5) fails. This is the canonical trap.

---

## 📊 Final Complexity

| | Complexity | Reason |
|--|-----------|--------|
| ⏱️ Time | O(n) | Every node is visited exactly once in a single DFS pass. No node is ever re-examined. |
| 📦 Space | O(h) | Call stack depth = length of the current root-to-node path = tree height h. Balanced tree: h = O(log n). Skewed tree (all left or all right): h = O(n). |
| 🎯 BTTC | O(n) | Must check every node — can't skip any without potentially missing a violation. Already at floor. |

---

## 🪞 Self-Assessment

- **💪 Confidence:** 4/5 — The approach and invariant are solid. The bounds-propagation pattern clicks cleanly. Minor shaky area: articulating the `O(h)` vs `O(n)` distinction confidently unprompted in Discuss.
- **🔄 Revisit:** Practice stating the space complexity nuance (`O(h)`, not `O(n)`, and why) as part of the standard Discuss script for any tree DFS problem.
- **📈 Pattern Mastery Impact:** Strengthens DFS pattern — adds the "bounds propagation" sub-technique alongside post-order DFS (Diameter, Balanced BT) and ancestor-tracking DFS (LCA). Tree DFS toolkit is growing.

---

## 🔗 Similar Problems

- **Lowest Common Ancestor of BST (#235)** — also navigates BST structure using inherited range logic (if val < both → go left, if val > both → go right).
- **Kth Smallest Element in BST (#230)** — in-order DFS on BST naturally produces sorted order; same tree structure awareness.
- **Range Sum of BST (#938)** — prune subtrees using BST property, same idea of inherited bounds to skip whole branches.

---

*🔥 Hadriel x Wiganz — 2026-05-20*
*"Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go." — Joshua 1:9 ✝️*
