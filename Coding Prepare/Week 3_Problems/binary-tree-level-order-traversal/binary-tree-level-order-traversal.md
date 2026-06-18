# Binary Tree Level Order Traversal — LeetCode #102

**First solved:** Jan 20, 2026
**Week7 review:** 2026-05-06
**Pattern:** BFS — Level Separation
**Status:** ✅ Solved | Clean code written from memory in Week7
**Tags:** #BFS #Queue #Tree #LevelSeparation

---

## The Problem

Given the `root` of a binary tree, return the **level order traversal** of its node values — left to right, level by level.

```
    3
   / \
  9  20
    /  \
   15   7
```

**Output:** `[[3], [9, 20], [15, 7]]`

**Constraints:** 0–2000 nodes. `-1000 <= val <= 1000`.

**Abstract version:** Group tree nodes by depth, left to right, return as list of lists.

---

## The Final Clean Code (Single Source of Truth)

```python
from collections import deque
from typing import Optional, List

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        if not root:
            return []

        queue = deque([root])
        result = []

        # If the queue still exists — tree has nodes to process
        while queue:
            level = []
            # Before starting to explore — take a snapshot of current queue before processing
            # The queue already contains all the nodes from the current level before this loop
            level_size = len(queue)

            # Process each node in the current queue. Let them add their children in
            for _ in range(level_size):
                current = queue.popleft()

                # current belongs to this level → add its VALUE (not the node)
                level.append(current.val)

                # Let current add its children (they go to next level's bucket)
                if current.left:
                    queue.append(current.left)
                if current.right:
                    queue.append(current.right)

            # After processing the whole level → commit to result
            result.append(level)

        return result
```

**Complexity:**
- Time: **O(N)** — every node visited exactly once
- Space: **O(N)** — worst case (full tree): bottom level holds ~N/2 nodes in queue

---

## The Thinking Process — How This Was Discovered

### Phase 1: The Flat List Mistake

First instinct was plain BFS:
1. Pop a node.
2. Add its children.
3. Repeat.

This visited all nodes correctly — but produced a **flat list** `[3, 9, 20, 15, 7]`. Level information was completely lost.

### Phase 2: The "Selective Parent" Bug

Made a critical logic error handling children:

```python
if current.left:
    queue.append(current.left)
else:                              # ← WRONG
    queue.append(current.right)
```

This treated left and right as mutually exclusive — if left child exists, right never gets added. Nodes disappear.

**Fix:** Left and right are always independent. Always two separate `if` statements, never `if/else`.

### Phase 3: The Breakthrough — Level Separation

The real problem: **how do you know when one level ends and the next begins?**

The queue mixes everyone together. Process `[3]`, queue becomes `[9, 20]`. Process `9`, queue becomes `[20, 15, 7...]`. The queue has no concept of "floors."

**The solution:** Before processing ANY node of the current level, **snapshot the queue size.**

```python
level_size = len(queue)
```

Wiganz's own explanation (Jan 2026 — still the best version):
> "When we add floor 1 nodes to the queue, we capture floor 1 right? Then in the process of processing those nodes, we append floor 2's nodes to the queue. But the problem is this new queue will be processed on the NEXT run. Which means before any iteration we already have the exact number of citizens in that floor."

That's it. That IS the algorithm.

---

## ⚡ Core Insight — The Snapshot

`level_size = len(queue)` is NOT just a variable. It's a contract:

> "There are exactly `level_size` nodes from the CURRENT level in this queue right now. Process exactly that many. Everything added after this point belongs to the NEXT level."

The children you add during the inner loop fall **past the snapshot boundary** — they'll be processed in the NEXT outer loop iteration, when their own `level_size` snapshot is taken.

**Visual:**

```
Queue before outer loop starts:  [9, 20]   ← level_size = 2
Process 9  → add 9's children → [20, ...]
Process 20 → add 20's children → [..., 15, 7]
Inner loop ends (processed exactly 2)
level = [9, 20] → appended to result

Queue now: [15, 7] ← these are for next iteration
```

---

## 🔍 deque([root]) — Why the List Wrapper?

**Question from Week7 review:** Why `deque([root])` instead of `deque(root)`?

`deque(x)` takes an **iterable** and unpacks it:

```python
deque([1, 2, 3])    # iterates list     → deque([1, 2, 3])      — 3 elements
deque("abc")        # iterates string   → deque(['a', 'b', 'c']) — 3 elements
deque(root)         # tries to iterate TreeNode → ❌ TypeError: not iterable
deque([root])       # iterates [root]   → deque([<TreeNode>])    — 1 element ✅
```

`[root]` is the list wrapper that makes a single non-iterable thing passable to deque. The list has one element, so deque receives one element: the root node.

**The rule:** Single starting node → always `deque([node])`. Multiple starting nodes → `deque(list_of_nodes)`.

```python
# Single source BFS
queue = deque([root])

# Multi-source BFS (e.g., 01 Matrix — start from all zeros at once)
queue = deque([(r, c) for r, c in zeros])  # already iterable, no wrapper needed
```

---

## All Mistakes Ever Made on This Problem

### ❌ Mistake 1 — The "Else" Trap (Jan 2026)

```python
# WRONG
if current.left:
    queue.append(current.left)
else:
    queue.append(current.right)  # right only added if left DOESN'T exist
```

**Why it fails:** Node with both children loses its right child entirely.
**Fix:** Always two independent `if` statements. Never `if/else` for children.

---

### ❌ Mistake 2 — Missing the Snapshot (Jan 2026)

Tried processing queue without `level_size = len(queue)` first. Children mixed into current level. Output was flat list, no separation.

**Fix:** `level_size = len(queue)` is ALWAYS the first line inside the `while` loop for any BFS level-separation problem. No exceptions.

---

### ❌ Mistake 3 — Appending Node Instead of Value (Week7 2026)

```python
level.append(current)      # ❌ appends TreeNode object
level.append(current.val)  # ✅ appends integer
```

**Why it fails:** Return type is `List[List[int]]`. `current` is a TreeNode, not an int.

---

## The BFS Level-Order Template

```python
queue = deque([root])
result = []

while queue:
    level = []
    level_size = len(queue)            # ← SNAPSHOT first, always
    for _ in range(level_size):        # ← process exactly this level
        node = queue.popleft()
        level.append(node.val)         # ← val not node
        if node.left: queue.append(node.left)
        if node.right: queue.append(node.right)
    result.append(level)

return result
```

### Variations from the Same Template

| Problem | What Changes |
|---------|-------------|
| Level Order Traversal | Nothing — this IS the template |
| Zigzag Level Order | Reverse `level` on odd-numbered levels before appending |
| Level Averages | `result.append(sum(level) / level_size)` instead of appending level |
| Right Side View | `result.append(level[-1])` — only last element per level |
| Maximum Depth | `return len(result)` after the loop |
| Minimum Depth | Return as soon as a leaf is found (no children) during inner loop |

---

## Step-by-Step: How to Think When You See "Level Order"

1. **Queue is King** — BFS always uses a Queue (FIFO). Import `deque`.
2. **deque([root])** — single node needs list wrapper. `deque(root)` → TypeError.
3. **Snapshot first** — `level_size = len(queue)` before inner loop. Non-negotiable.
4. **Nested loop structure** — `while queue` outer, `for _ in range(level_size)` inner.
5. **Bucket per level** — create `level = []` INSIDE the `while` loop, never outside.
6. **Independent children** — two separate `if` statements, never `if/else`.
7. **Append val** — `node.val`, not `node`.

---

## One-Sentence Aha

> BFS doesn't know about levels — YOU create level separation by snapshotting `len(queue)` before the inner loop, freezing exactly how many nodes belong to the current floor.

---

*First solved Jan 2026 (Week 3). Reviewed May 2026 (Week 7). Single source of truth.*
*Hadriel × Wiganz 🔥⚔️*
*"Those who hope in the Lord will renew their strength." — Isaiah 40:31*
