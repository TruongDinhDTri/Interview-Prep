# Binary Tree Level Order Traversal - Solution
# LeetCode 102

from collections import deque
from typing import Optional, List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        # Edge case: Empty tree
        if not root:
            return []

        queue = deque([root])
        result = []

        # Loop while there are nodes to process
        while queue:
            # 1. Capture the size of the CURRENT level
            level_size = len(queue)
            current_level = []

            # 2. Process ONLY nodes in the current level
            for _ in range(level_size):
                current = queue.popleft()
                current_level.append(current.val)

                # 3. Add children for the NEXT level
                if current.left:
                    queue.append(current.left)
                if current.right:
                    queue.append(current.right)
            
            # 4. Add the finished level to the final result
            result.append(current_level)
            
        return result

# --- Test Case ---
if __name__ == "__main__":
    #      3
    #     / \
    #    9  20
    #      /  \
    #     15   7
    root = TreeNode(3)
    root.left = TreeNode(9)
    root.right = TreeNode(20)
    root.right.left = TreeNode(15)
    root.right.right = TreeNode(7)

    sol = Solution()
    print(f"Output: {sol.levelOrder(root)}")
    # Expected: [[3], [9, 20], [15, 7]]
