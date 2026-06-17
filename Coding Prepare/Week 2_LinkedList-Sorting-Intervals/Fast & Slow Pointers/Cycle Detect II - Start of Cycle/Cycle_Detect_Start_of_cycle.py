from typing import Optional

# Definition for singly-linked list.
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

def detectCycle(head: Optional[ListNode]) -> Optional[ListNode]:
    """
    Detects a cycle in a linked list and returns the node where the cycle begins.
    Returns None if no cycle exists.
    """
    slow = fast = head
    
    # ---------------------------------------------------------
    # Phase 1: Determine if a cycle exists (Tortoise & Hare)
    # ---------------------------------------------------------
    while fast and fast.next:
        slow = slow.next          # Move 1 step (🐢)
        fast = fast.next.next     # Move 2 steps (🐇)
        
        if slow == fast:          # Collision detected!
            break
    else:
        return None               # Fast reached the end; no cycle.

    # ---------------------------------------------------------
    # Phase 2: Find the Cycle Start (Entry Node)
    # ---------------------------------------------------------
    # Reset slow to head. Keep fast at the collision point.
    slow = head
    
    # Move both 1 step at a time until they meet again.
    while slow != fast:
        slow = slow.next
        fast = fast.next
        
    return slow  # They meet exactly at the cycle start.
