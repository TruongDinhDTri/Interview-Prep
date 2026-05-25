# 🗡️ Binary Tree Level Order Traversal -- Complete Session Archive

> **Pattern:** BFS -- Level Separation | **Difficulty:** Medium | **LeetCode:** #102 | **Date:** 2026-01-20 (reviewed 2026-05-06)
> **Path Taken:** Pattern Path | **⏱️ Time Used:** not recorded | **🎯 Target:** 25 min

---

## 🗺️ The Journey -- How Understanding Built

First instinct was plain BFS -- pop, add children, repeat -- which visited every node but lost all level information, producing a flat list. A second bug (if/else on children) silently dropped right children. The breakthrough came when Wiganz realized the queue is a shared pool with no floor markings, and that snapshotting `len(queue)` before any processing creates the exact boundary that separates one level from the next. Week 7 review added one more precision: `deque([root])` vs `deque(root)` and why the list wrapper is non-negotiable.

---

## 📖 Step 1 -- Understand

### 📝 Problem Statement (Human Language)

Given the root of a binary tree, return all node values grouped by depth -- left to right, one list per level. An empty tree returns an empty list. Nodes can number 0 to 2000; values range from -1000 to 1000.

**Input:** root of a binary tree
**Output:** `List[List[int]]` -- one inner list per level, values in left-to-right order

```
    3
   / \
  9  20
    /  \
   15   7
```

Output: `[[3], [9, 20], [15, 7]]`

### 🔬 Abstract (Story Stripped)

> "Group tree nodes by depth. Return as a list of lists, each inner list containing node values at that depth, left to right."

### ❓ Constraint Questions Asked

| Question | Answer |
|----------|--------|
| Can root be null/empty? | Yes -- return `[]` |
| Are values unique? | No constraint; can repeat |
| Can I modify the tree? | Not needed |
| Input size? | 0 to 2000 nodes |
| Value range? | -1000 to 1000 |
| Return type? | `List[List[int]]` -- values, not nodes |
| Is the tree balanced? | Not guaranteed |
| BFS or DFS preference? | Not specified |
| Multiple valid orderings? | No -- left before right is required |

### ✋ Trace by Hand

Using the example tree:

- Level 0: root is 3. The problem says group by depth. Depth 0 has one node: 3. Output so far: `[[3]]`
- Level 1: 3's children are 9 and 20, left before right. Output so far: `[[3], [9, 20]]`
- Level 2: 9 has no children. 20's children are 15 and 7. Output: `[[3], [9, 20], [15, 7]]`

This aspect was not fully explored during the session as a formal Step 1 trace, but the example output `[[3], [9, 20], [15, 7]]` was used throughout to validate the approach.

---

## 🧭 Step 2 -- Approach (3-Gate Check)

### 🚦 3-Gate Results

| Gate | Result | Reasoning |
|------|--------|-----------|
| Abstract shape matches a pattern signature? | YES | "Group nodes by depth, level by level" is the canonical BFS Level-Order signature |
| Can I name it AND explain why? | YES | BFS processes nodes in discovery order -- first found, first processed -- which matches left-to-right, top-to-bottom traversal |
| Solved something like this before? | YES | Number of Islands, 01 Matrix, Flood Fill -- all use BFS queue mechanics |

**Decision: PATTERN PATH**

---

## 🎯 3P Match + 4P Reason

### 🔍 3P -- Signal → Pattern → Full Sentence

> "I see 'level order' and 'left to right by depth' which tells me BFS because BFS processes nodes in the exact order they were discovered -- closest first, left before right -- which naturally maps to level-by-level output."

### 🧠 4P -- Reason (Before ANY code)

**A -- 🐢 Brute Force + Why Bad:**

DFS traversal carrying a depth parameter, appending to `result[depth]`. Time O(N) but requires full recursion with call stack overhead and less natural for interviewing on this pattern. Alternatively, brute force could mean naive re-scanning the tree for each level: O(N * L) where L = number of levels -- up to O(N²) for a skewed tree.

**B -- ⚡ What BFS Does Instead:**

A queue (FIFO) naturally processes all nodes at depth D before any node at depth D+1. No depth parameter needed. One pass, O(N) time. The challenge is separating levels inside the queue -- solved by the snapshot technique below.

**C -- 🔒 The Invariant:**

> "Before the inner loop begins, the queue holds EXACTLY the nodes from the current level -- no more, no less. The snapshot `level_size = len(queue)` freezes this count so new children added during processing are never mistaken for the current level."

---

## 🗣️ Step 3 -- Discuss

### 📋 Wiganz's Full Presentation

This aspect was not fully explored during the session as a formal Step 3 presentation (session notes record the solve itself, not the interview narration). Based on the code and comments written, the implied steps were:

1. Guard: if `not root`, return `[]`
2. Initialize `queue = deque([root])`, `result = []`
3. While queue is not empty -- there are nodes left to process:
   a. Snapshot `level_size = len(queue)` -- count of nodes in this level
   b. Create empty `level = []`
   c. Loop `level_size` times: pop left, append value, enqueue left and right children (independently)
   d. Append `level` to `result`
4. Return `result`

### 📊 Complexity Stated

- Time: O(N) -- every node visited exactly once
- Space: O(N) -- worst case (complete tree), bottom level holds ~N/2 nodes in the queue

### ✅ Green Light

This aspect was not fully explored during the session.

### ⚠️ What Was Missed

- Formal brute force mention before presenting the optimal approach
- Explicit green light request before coding
- Complexity reasoning stated out loud with the "because" (not just the O-notation)

---

## 💻 Step 4 -- Code

### 🏗️ Blueprint (Comments First)

```python
def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
    # Guard: empty tree → return []
    # Initialize queue with root, result list
    # While queue has nodes:
    #   1. Snapshot level_size = len(queue)  ← current level boundary
    #   2. Create empty level bucket
    #   3. Loop level_size times:
    #      - popleft current node
    #      - append current.val to level
    #      - if left child: enqueue left
    #      - if right child: enqueue right (independent if, never if/else)
    #   4. Append level to result
    # Return result
```

### ✨ Final Clean Solution

```python
from collections import deque
from typing import Optional, List

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []

        queue = deque([root])
        result = []

        while queue:
            level = []
            level_size = len(queue)

            for _ in range(level_size):
                current = queue.popleft()
                level.append(current.val)

                if current.left:
                    queue.append(current.left)
                if current.right:
                    queue.append(current.right)

            result.append(level)

        return result
```

**⏱️ Time:** O(N) -- every node visited exactly once
**📦 Space:** O(N) -- queue holds at most the widest level (~N/2 nodes in a complete tree)

---

## 🔍 Step 5 -- Verify

### 👣 Trace Through Example (Out Loud)

Input tree: root=3, left=9, right=20; 20.left=15, 20.right=7

| Iteration | queue before | level_size | inner loop | level | result |
|-----------|-------------|------------|------------|-------|--------|
| 1 | [3] | 1 | pop 3, enqueue 9 and 20 | [3] | [[3]] |
| 2 | [9, 20] | 2 | pop 9 (no children), pop 20, enqueue 15 and 20.right=7 | [9, 20] | [[3],[9,20]] |
| 3 | [15, 7] | 2 | pop 15 (no children), pop 7 (no children) | [15, 7] | [[3],[9,20],[15,7]] |
| -- | [] | -- | while exits | -- | return [[3],[9,20],[15,7]] ✅ |

### 🧪 Edge Cases

| Case | Input | Expected | Handled? |
|------|-------|----------|----------|
| Empty tree | root=None | `[]` | ✅ guard clause |
| Single node | root=1 | `[[1]]` | ✅ level_size=1, no children |
| Only left children (skewed) | 1→2→3 | `[[1],[2],[3]]` | ✅ right if never triggers |
| Only right children (skewed) | 1→→2→→3 | `[[1],[2],[3]]` | ✅ left if never triggers |
| Complete binary tree | balanced | correct grouping | ✅ |

### ✅ Complexity Confirmed

- Time O(N): the while loop runs once per level; inner loop runs once per node in that level. Total work = N node pops + N enqueue operations = O(N).
- Space O(N): the queue at its largest holds the bottom level of a complete tree -- approximately N/2 nodes.

---

## ⚡ Step 6 -- Optimize

BTTC for this problem is O(N) -- every node must be visited at least once to include its value in the output. The current solution is already at BTTC.

Space could theoretically be reduced with iterative DFS carrying a depth index, but the queue size for BFS on a balanced tree is unavoidable if level separation is required. No further optimization applies.

---

## 🐛 Bugs & Mistakes

### 🧠 Conceptual Mistakes

#### 🐛 C1: Lost Level Information (Flat List)

> **Context:** Step 4 (Code) — Wiganz wrote plain BFS for the tree `[3, 9, 20, null, null, 15, 7]`. Output came out as a flat list — all nodes correct, but no level separation. The `List[List[int]]` return type was violated.

| | |
|---|---|
| **What** | Plain BFS loop with no mechanism to detect level boundaries. Code processed nodes correctly but appended values into one flat result list |
| **Wrong** | Output: `[3, 9, 20, 15, 7]` — flat list, all nodes mixed together |
| **Right** | Output: `[[3], [9, 20], [15, 7]]` — grouped by depth via `level_size = len(queue)` snapshot before processing each level |
| **Why** | `concept gap` — knew BFS traversal but not the snapshot technique. The queue naturally MIXES nodes from multiple levels (children added during current-level processing land right after their parents in the queue). Without `level_size = len(queue)` snapshot before the inner loop, there's no marker showing where one level ends and the next begins |
| **Cost** | Entire approach functionally broken — correct node order, wrong structure. Required discovering the snapshot insight before any working code existed |

> **Prevention**
> - **Rule:** For any level-grouping BFS, `level_size = len(queue)` is ALWAYS the first line inside the `while` loop. Then `for _ in range(level_size): ...`. Non-negotiable.
> - **Trick:** *"Snapshot before you process."* The photo is taken before the party starts — latecomers (children added during the loop) are not in this shot.
> - **Edge Cases:** Any tree with more than one level fails without this. Single-node trees accidentally pass (one level = one snapshot)

#### 🐛 C2: Selective Parent (if/else on Children)

```python
# WRONG — right child only added when left doesn't exist
if current.left:
    queue.append(current.left)
else:
    queue.append(current.right)

# CORRECT — two INDEPENDENT if statements
if current.left:
    queue.append(current.left)
if current.right:
    queue.append(current.right)
```

- **Why:** `concept gap` — misread children as mutually exclusive, as if a node has left OR right. A binary tree node can have both, one, or neither — fully independent
- **How it was caught:** Tree `[3,9,20,null,null,15,7]` — node 20 has both 15 and 7; if/else silently dropped 7. Output `[[3],[9,20],[15]]` looks plausible but wrong
- **Rule to prevent:** Children = two INDEPENDENT `if` statements. Never `if left ... else right`
- **Trick:** Two doors on a house — they open independently. Check Door A AND check Door B. Don't skip Door B because Door A was unlocked

### 🔧 Implementation Mistakes

**1. Appending Node Instead of Value**

```python
# WRONG — appends TreeNode object, wrong return type
level.append(current)

# CORRECT — appends the value
level.append(current.val)
```

- **Why:** Return type is `List[List[int]]` — integers required. `current` is a `TreeNode` object
- **How it was caught:** Output `[[<TreeNode>], [<TreeNode>, <TreeNode>], ...]` — wrong type, fails comparison against expected
- **Rule to prevent:** When building level lists for this problem, ALWAYS `.val` — `level.append(current.val)`
- **Trick:** *"Deliver the package, not the truck."* The node is the vehicle; `.val` is the cargo

**2. `deque(root)` instead of `deque([root])`**

```python
# WRONG — TreeNode is not iterable, raises TypeError
queue = deque(root)

# CORRECT — wrap in list so deque can unpack it
queue = deque([root])
```

- **Why:** `deque(x)` iterates over `x`. TreeNode is not iterable → `TypeError: 'TreeNode' object is not iterable`
- **How it was caught:** Immediate runtime crash before any traversal. Clarified during Week 7 review
- **Rule to prevent:** Single starting node → ALWAYS `deque([node])`. Multiple starting nodes → `deque(list_of_nodes)`
- **Trick:** *`deque` needs a bag to open. `[root]` is the bag. `root` alone has no zipper.*

### ⏱️ Time Management Mistakes

None this session ✅

### 📊 Mistake Summary

| Pillar | Count | Most Costly | Pattern Emerging? |
|--------|-------|-------------|-------------------|
| 🧠 Conceptual | 2 | C1 — entire approach broken | Level-grouping BFS needs snapshot technique drilled. C2 if/else trap recurring in tree problems |
| 🔧 Implementation | 2 | Both immediate crashes | Python deque + TreeNode `.val` extraction — both atomic facts, drill once and own forever |
| ⏱️ Time Management | 0 | — | Clean execution |

---

## 💡 Discoveries

### 🔒 Core Invariant / Rule

> "Before the inner loop begins, the queue holds EXACTLY the nodes from the current level. `level_size = len(queue)` is the fence post: process exactly this many, and everything added after belongs to the next level."

The queue is like a building with no floor labels. The snapshot `level_size = len(queue)` stamps a label on the current floor before anyone moves. Process exactly that many occupants. Everyone who arrives as a child moves into the unmarked section -- they get their own stamp next iteration.

---

### ⚡ Aha Moments

**💡 1. The Snapshot -- How to Separate Floors**

- **Before:** Knew BFS visits nodes in breadth-first order but had no mechanism to know when one level ended and the next began. Queue mixes all nodes together.
- **Trigger:** Asking "how do you know when one level ends?" while tracing: when you start processing `[9, 20]`, you add `[15, 7]` to the queue. But the queue now has all four mixed. How do you stop at exactly two?
- **After:** Snapshot the queue length BEFORE processing. That number is the exact count of current-level nodes. Everything added during the inner loop is a child -- it lands after the snapshot boundary.
- **🗣️ In his words:** "When we add floor 1 nodes to the queue, we capture floor 1 right? Then in the process of processing those nodes, we append floor 2's nodes to the queue. But the problem is this new queue will be processed on the NEXT run. Which means before any iteration we already have the exact number of citizens in that floor."

**💡 2. deque([root]) -- The List Wrapper**

- **Before:** `deque(root)` -- seemed natural to pass the root directly.
- **Trigger:** Week 7 review question: "Why `deque([root])` and not `deque(root)`?"
- **After:** `deque(x)` iterates `x`. A TreeNode is not iterable -- it has no `__iter__`. Wrapping in `[root]` makes a one-element list that deque unpacks into one element correctly.
- **🗣️ In his words:** (Week 7 review, May 2026) -- understood via the contrast: `deque([1,2,3])` unpacks a list into 3 elements; `deque("abc")` unpacks a string into 3 chars; `deque(root)` tries to unpack a TreeNode -- TypeError.

---

### 🎨 Key Metaphors & Examples

- **The Building with No Floor Labels:** The queue does not know about floors. Every time a new outer loop starts, you stamp the current floor: "there are exactly `level_size` people on this floor." Process them. Their children move to an unstamped zone -- they get their own stamp next time.
- **The Snapshot Contract:** `level_size = len(queue)` is a contract, not a variable. "There are exactly this many nodes from the current level. Process exactly this many. No more."

---

## 📊 Final Complexity

| | Complexity | Reason |
|--|-----------|--------|
| ⏱️ Time | O(N) | Every node is enqueued once and dequeued once. Inner loop total across all outer iterations = N. |
| 📦 Space | O(N) | Queue holds at most one full level. In a complete binary tree the bottom level has ~N/2 nodes → O(N). `result` also holds all N values. |
| 🎯 BTTC | O(N) | Must visit every node to include its value in the output. Cannot do better than O(N). Already optimal. |

---

## 🪞 Self-Assessment

- **💪 Confidence:** 4/5 -- Template is solid. Can reproduce from memory. Snapshot trick is internalized.
- **🔄 Revisit:** Variations -- Zigzag Level Order (reverse on odd levels), Right Side View (last element per level), Level Averages (sum/count per level). All use the same template with one changed line.
- **📈 Pattern Mastery Impact:** This problem is the BFS level-separation template. Mastering it means every level-order variant (Right Side View, Zigzag, Min/Max Depth) is one changed line away.

---

## 🔗 Similar Problems (max 3)

- **Binary Tree Right Side View (#199)** -- Same template. Change: `result.append(level[-1])` instead of `result.append(level)`. Last element per level = rightmost visible node.
- **Binary Tree Zigzag Level Order (#103)** -- Same template. Change: reverse `level` before appending on odd-numbered levels.
- **Maximum Depth of Binary Tree (#104)** -- Same BFS structure. Change: `return len(result)` instead of returning result. Number of levels = max depth.

---

*🔥 Hadriel x Wiganz -- 2026-05-23*
*"Those who hope in the Lord will renew their strength." -- Isaiah 40:31 ✝️*
