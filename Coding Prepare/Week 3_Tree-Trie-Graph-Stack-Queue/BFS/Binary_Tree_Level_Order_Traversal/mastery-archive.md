# LeetCode 102: Binary Tree Level Order Traversal (Medium)

**Status:** ✅ Solved & Archived
**Date:** Jan 20, 2026
**Pattern:** BFS (Breadth-First Search) - Level Separation
**Tags:** #Tree #BFS #Queue #LevelSeparation

---

# 1. The Problem

Given the `root` of a binary tree, return the **level order traversal** of its nodes' values.
(i.e., from left to right, level by level).

**Input:**

```
    3
   / \
  9  20
    /  \
   15   7
```

**Output:** `[[3], [9, 20], [15, 7]]`

**Constraints:**

- The number of nodes in the tree is in the range `[0, 2000]`.
- `-1000 <= Node.val <= 1000`.

---

# 2. Thinking Process (The "Aha!" Moments)

### Phase 1: The Initial Confusion (The Flat List Mistake)

My first instinct was a standard BFS using a queue:

1. Pop a node.
2. Add its children.
3. Repeat.

This successfully visited all nodes, but it produced a **flat list** (`[3, 9, 20, 15, 7]`). I lost the information about "which level is this node on?".

### Phase 2: The Logic Gap (The Selective Parent)

I also made a critical logic error in handling children:

```python
if current.left:
    queue.append(current.left)
else:  # <--- MISTAKE!
    queue.append(current.right)
```

This prevented the right child from being added if the left child existed. The correct logic must be independent: **"Add Left IF exists. THEN Add Right IF exists."**

### Phase 3: The Breakthrough (Level Separation)

The core challenge was: **How do I know when one level ends and the next begins?**

The queue naturally mixes everyone together.

* Level 2 nodes (9, 20) are in the queue.
* We process 9.
* We process 20 (and add 15, 7 to the back).
* The queue looks like `[15, 7]`.

**The Solution:**
Before processing *any* node of the current level, we must **measure the queue size** (`level_size = len(queue)`). Because when we're add floor 1. We capture floor 1 right ? Than in the process of processing those nodes in floor 1. We would append the floor's 2 citicent to the `queue ` but the problem is this new `queue` will be process on the next run. Which means before any iteration we already have the exact numbers of citicent in that floor
So `len(queue)` this number tells us *exactly* how many nodes belong to the current floor. We loop exactly that many times. Any children added during this loop effectively go to the "next floor" bucket.

---

# 3. Step-by-Step Guidance (How to Think)

When you see "Level Order" or "Level by Level", trigger this thought process:

1. **Queue is King:** BFS always uses a Queue (FIFO).
2. **Snapshot Strategy:** To keep levels separate, I must capture the queue size **before** iterating.
3. **Nested Loop Structure:**
   * `while queue`: Keep going until the tree is empty.
   * `for _ in range(level_size)`: Process ONLY the current level.
4. **Bucket per Level:** Create a new list `current_level = []` inside the `while` loop, not outside.

---

# 4. Final Solution

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

from collections import deque

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        # Edge Case: Empty tree
        if not root:
            return []

        queue = deque([root])
        result = []

        # Outer Loop: Traverses until no nodes left
        while queue:
            # 1. SNAPSHOT: Capture current level size
            level_size = len(queue)
            current_level = []

            # 2. Process ONLY this level's nodes
            for _ in range(level_size):
                current = queue.popleft()
                current_level.append(current.val)

                # 3. Add children for NEXT level
                if current.left:
                    queue.append(current.left)
                if current.right:
                    queue.append(current.right)
          
            # 4. Commit level to result
            result.append(current_level)
          
        return result
```

**Complexity Analysis:**

- **Time:** `O(N)` - We visit every node exactly once.
- **Space:** `O(N)` - In the worst case (full binary tree), the queue holds `N/2` nodes at the bottom level.

---

# 5. Errors & Mistakes Log (Learning from Failure)

### ❌ Mistake 1: The "Else" Trap

**Code:**

```python
if current.left: queue.append(current.left)
else: queue.append(current.right)
```

**Why it failed:** It treated children as mutually exclusive.
**Fix:** Always use two independent `if` statements.

### ❌ Mistake 2: Missing the Snapshot

**Thinking:** I tried to process the queue without capturing `len(queue)` first.
**Result:** I processed children immediately as part of the current level, mixing everything up.
**Fix:** Always write `level_size = len(queue)` as the first line inside the `while` loop for BFS level problems.

---

# 6. Related Patterns & Variations

- **Zigzag Level Order:** Use the exact same template, but add a flag `is_reverse` to reverse `current_level` before appending to result.
- **Level Averages:** Use the same template, but instead of `current_level = []`, use `current_sum = 0`, then append `current_sum / level_size`.
- **Right Side View:** Use the same template, but only add the *last* element of `current_level` to the result.

---

*Created by Hadriel for Wiganz's Mastery Archive* 🔥
