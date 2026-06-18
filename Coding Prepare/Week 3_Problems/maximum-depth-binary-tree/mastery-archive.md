# LeetCode 104: Maximum Depth of Binary Tree (Easy)

**Status:** ✅ Solved & Archived
**Date:** Jan 20, 2026
**Pattern:** DFS (Depth-First Search) - Recursion
**Tags:** #Tree #DFS #Recursion #Depth

---

# 1. The Problem

Given the `root` of a binary tree, return its **maximum depth**.
A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

**Input:**
```
      3
     / \
    9  20
      /  \
     15   7
```

**Output:** `3`

**Explanation:** The path `3 -> 20 -> 15` (or `3 -> 20 -> 7`) has 3 nodes.

---

# 2. Phase Analysis (Thinking Log)

### Phase 1: From Breadth to Depth
After mastering BFS (which processes the tree level-by-level), I transitioned to **DFS (Depth-First Search)**. 
- BFS would have worked (counting levels), but DFS is more natural for "depth" because it dives deep into a path before coming back.

### Phase 2: The Delegation Mindset (Aha! Moment)
I realized that calculating the depth of a tree is a recursive task. 
- If I am a node, my depth depends on my children. 
- I don't need to know the whole tree. I just need to ask my left child: "What's your height?" and my right child: "What's your height?".
- **The formula:** My height = `1` (counting myself) + `max(left_height, right_height)`.

### Phase 3: The Base Case
Recursion needs an exit. 
- What happens if a node is empty (`None`)?
- An empty node contributes `0` to the depth. This is the foundation upon which the height is built.

---

# 3. Step-by-Step Guidance (How to Think)

1.  **Bottom-Up Thinking:** In tree recursion, think about what the leaves return to their parents.
2.  **Base Case First:** Always handle `if not root` first. It prevents errors and stops the recursion.
3.  **Recursive Leap of Faith:** Assume `self.maxDepth(child)` correctly gives you the height of that subtree. 
4.  **Combining Results:** The parent's job is to take the maximum of both children and add 1 for itself.

---

# 4. Final Solution

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        # 1. Base Case: If the node is empty, depth is 0.
        if root is None:
            return 0
        
        # 2. Recursive Step: 
        # Ask children for their heights, take the max, and add 1 (for current node).
        left_height = self.maxDepth(root.left)
        right_height = self.maxDepth(root.right)
        
        return 1 + max(left_height, right_height)
```

**Complexity Analysis:**
- **Time Complexity:** `O(N)` - We visit every node exactly once.
- **Space Complexity:** `O(H)` where `H` is the height of the tree. This is the memory used by the recursion stack. In the worst case (a skewed tree), it's `O(N)`.

---

# 5. Errors, Misunderstandings & Mistakes

- **Initial Thought:** I initially thought about using BFS. While correct, it requires more code (`deque`, loops).
- **Aha! Realization:** The recursive DFS solution is elegant because it mirrors the mathematical definition of height.
- **Mistake Avoided:** I correctly identified `None` returns `0`. Returning `1` for `None` would have shifted all results by +1.

---
*Created by Hadriel for Wiganz's Mastery Archive* 🔥
