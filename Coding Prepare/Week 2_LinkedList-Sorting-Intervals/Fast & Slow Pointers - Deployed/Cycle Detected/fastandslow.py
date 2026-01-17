# LeetCode #141: Linked List Cycle
# Pattern: Fast & Slow Pointers
# Difficulty: Easy

# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def hasCycle(self, head):
        """
        Detect if linked list has a cycle using Fast & Slow pointers.

        Args:
            head: Head of the linked list

        Returns:
            True if cycle exists, False otherwise

        Time Complexity: O(n)
        Space Complexity: O(1)
        """
        # Initialize both pointers at head
        slow = head
        fast = head

        # Keep moving while fast can move 2 steps
        while fast and fast.next:
            # Move slow 1 step
            slow = slow.next

            # Move fast 2 steps
            fast = fast.next.next

            # If they meet, cycle exists!
            if fast == slow:
                return True

        # If we exit loop, fast hit None → no cycle
        return False


# ═══════════════════════════════════════════════════════════════
# KEY INSIGHTS 💡
# ═══════════════════════════════════════════════════════════════

# 1. WHY move BEFORE checking?
#    - If we check first, they'd always be equal at start (both at head)
#    - Moving first ensures meeting only happens IN the cycle

# 2. WHY the gap closes by 1 each iteration?
#    - Slow moves: +1 position
#    - Fast moves: +2 positions
#    - Relative speed: 2 - 1 = 1 position closer per iteration
#    - Gap: K → K-1 → K-2 → ... → 0 (MEET!)

# 3. WHY check "fast and fast.next"?
#    - Need to ensure fast.next exists before doing fast.next.next
#    - If fast = None → no cycle
#    - If fast.next = None → no cycle

# 4. TIME: O(n) even with cycle?
#    - Getting to cycle: O(n-k) where k = cycle size
#    - Meeting inside cycle: O(k) max
#    - Total: O(n)

# 5. SPACE: O(1)
#    - Only 2 pointers, no extra data structures
