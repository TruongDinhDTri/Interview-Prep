# LeetCode 199: Binary Tree Right Side View (Medium)

**Status:** ✅ Solved & Archived
**Date:** Jan 20, 2026
**Pattern:** BFS (Breadth-First Search) - Level Traversal
**Tags:** #Tree #BFS #Queue #RightSideView

---

# 1. The Problem

Given the `root` of a binary tree, imagine yourself standing on the **right side** of it. Return the values of the nodes you can see ordered from top to bottom.

**Input:**
```
      1            <--- 1
     / \
    2   3          <--- 3
     \   \
      5   4        <--- 4
```

**Output:** `[1, 3, 4]`

**Key Insight:** The "Right Side View" is simply the **last node** of each level in a BFS traversal.

---

# 2. Thinking Process (The "Aha!" Moments)

### Phase 1: The "Golden Template" Confidence
Coming from "Level Order Traversal", I immediately knew BFS was the right tool.
- I need to traverse level by level.
- I need the queue snapshot trick (`level_size = len(queue)`).

### Phase 2: The "Last Node" Challenge
The problem wasn't traversing; it was **selecting**.
- How do I pick ONLY the rightmost node?
- My first thought: Is it always the right child?
- **Correction:** No! If the right child is missing, I see the left child (like node 5 in the example).
- **True Logic:** It's simply the **last node processed** in the current level loop.

### Phase 3: The Index Logic Bug
I knew I had a loop: `for i in range(level_size):`.
I needed to check if `i` was the last index.
- **My Mistake:** I thought `if i == level_size`.
- **The Catch:** Python (and most languages) are 0-indexed. If size is 5, the indices are 0,1,2,3,4.
- **The Fix:** `if i == level_size - 1`.

---

# 3. Step-by-Step Guidance (How to Think)

1.  **Recognize the Pattern:** "Right side view" = "Last element of each level".
2.  **Deploy BFS Template:**
    *   Initialize Queue with Root.
    *   While Queue is not empty...
    *   **SNAPSHOT:** `size = len(queue)`
3.  **The Selection Logic:**
    *   Loop `i` from `0` to `size - 1`.
    *   If `i` hits the end (`size - 1`), this is the "visible" node. Add to result.
4.  **Standard Propagation:**
    *   Add left child.
    *   Add right child.

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
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        # Edge Case
        if not root:
            return []

        queue = deque([root])
        result = []

        while queue:
            # SNAPSHOT: Capture exact number of nodes in this level
            level_size = len(queue)

            # Loop through exactly this level's nodes
            for i in range(level_size):
                current = queue.popleft()

                # THE KEY LOGIC:
                # If this is the last node in the current level loop,
                # it means it's the rightmost node visible.
                if i == level_size - 1: 
                    result.append(current.val)
                
                # Standard BFS: Add children for next level
                if current.left:
                    queue.append(current.left)
                if current.right:
                    queue.append(current.right)
                    
        return result
```

**Complexity Analysis:**
- **Time:** `O(N)` - We visit every node exactly once.
- **Space:** `O(N)` - Queue holds at most `N/2` nodes (width of tree).

---

# 5. Errors & Mistakes Log (Learning from Failure)

### ❌ Mistake 1: Off-by-One Error
**Thinking:** "If I have 5 items, I want item number 5."
**Code:** `if i == level_size:`
**Why it failed:** `range(5)` produces `0, 1, 2, 3, 4`. `i` never reaches 5.
**Fix:** `if i == level_size - 1:`

### ❌ Mistake 2: Unused Variable (Clean Code)
**Code:** `level = []` inside the while loop.
**Insight:** In the previous problem, we needed to collect the whole level. Here, we append directly to `result`, so `level = []` was dead code. Deleted it for cleanliness.

---

# 6. Related Patterns & Variations

- **Left Side View:** Same logic, but check `if i == 0`.
- **Largest Value in Each Row:** Instead of index check, track `max_val` inside the `for` loop and append it after the loop.
- **Connect Right Pointers:** Instead of adding to result, set `current.next = queue[0]` (if `i < size - 1`).

---
*Created by Hadriel for Wiganz's Mastery Archive* 🔥

```