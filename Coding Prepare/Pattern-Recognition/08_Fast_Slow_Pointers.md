# Fast & Slow Pointers

## Spot It
| Signal | Fast & Slow |
|--------|-------------|
| "cycle in linked list" | ✓ |
| "find middle of linked list" | ✓ |
| "happy number" (digit cycle) | ✓ |
| "find duplicate" (array as linked list) | ✓ |

---

## Why It Works
Fast moves 2x, slow moves 1x. If cycle exists, fast catches slow (gains 1 per step). No cycle = fast hits null.

---

## The Core

**Detect Cycle**
```python
def hasCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```

**Find Cycle Start**
```python
def cycleStart(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            # Reset one to head, both move at speed 1
            slow = head
            while slow != fast:
                slow = slow.next
                fast = fast.next
            return slow  # cycle start
    return None
```

**Find Middle**
```python
def findMiddle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow  # middle (or second middle if even)
```

---

## Traps
1. **Check `fast AND fast.next`** before moving fast
2. **Cycle start needs TWO phases** — detect, then find start
3. **Middle of even-length list**: This gives second middle; adjust if needed
