# Cycle Detection Guide 🔥

## Problem: Detect if a Linked List has a Cycle

**LeetCode #141** - Easy

---

## 🎯 Pattern: Fast & Slow Pointers

### The Strategy:
- 🐢 **Slow pointer:** Moves 1 step at a time
- 🐇 **Fast pointer:** Moves 2 steps at a time
- **If there's a cycle:** They WILL meet
- **If there's NO cycle:** Fast hits `None` first

---

## 📝 Solution Template:

```python
def hasCycle(head):
    slow = head
    fast = head

    while fast and fast.next:
        slow = slow.next        # Move 1 step
        fast = fast.next.next   # Move 2 steps

        if fast == slow:        # They met!
            return True

    return False  # Fast hit None, no cycle
```

---

## 💡 The KEY Insight - Why Gap Decreases by 1

**Think about it BACKWARDS:**

**Imagine Fast is K steps BEHIND Slow in the cycle.**

### Each iteration:
1. Slow runs 1 step → Distance should become `K + 1`
2. BUT Fast runs 2 steps → Catches up 2 positions
3. **Net result:** `(K + 1) - 2 = K - 1`

**The gap decreases by EXACTLY 1 each time!**

### Example:
```
Initial gap = 5
After iteration 1: gap = 4
After iteration 2: gap = 3
After iteration 3: gap = 2
After iteration 4: gap = 1
After iteration 5: gap = 0 → MEET! 🎉
```

---

## ⚡ Why This Works:

### 1. **Relative Speed**
- Slow speed: 1 node/iteration
- Fast speed: 2 nodes/iteration
- **Relative speed:** 2 - 1 = **1 node/iteration**

Fast closes the gap by 1 position each iteration → **Guaranteed to meet!**

---

### 2. **Why NOT 3 steps?**
If fast moved 3 steps:
- Gap decreases by 2 each time
- Could jump OVER slow: `5 → 3 → 1 → -1` (MISSED!)

With 2 steps:
- Gap decreases by exactly 1
- **MUST hit 0** (guaranteed meeting!)

---

## 🔍 Step-by-Step Example:

**Cycle:** `3 → 4 → 5 → 6 → 7 → 8 → (back to 3)`

| Iteration | Slow | Fast | Gap | Status |
|-----------|------|------|-----|--------|
| 0 | 3 | 3 | 0 | Start |
| 1 | 4 | 5 | 1 | Separated |
| 2 | 5 | 7 | 2 | Gap grows |
| 3 | 6 | 3 | 3 | Fast looped |
| 4 | 7 | 5 | 4 | Still chasing |
| 5 | 8 | 7 | 5 | Max gap |
| 6 | 3 | 3 | 0 | **MEET!** 🎉 |

---

## ⚠️ Critical Details:

### Loop Condition:
```python
while fast and fast.next:  # Must check BOTH!
```

**Why?**
- Check `fast` exists → safe to access `fast.next`
- Check `fast.next` exists → safe to do `fast.next.next`

### Move BEFORE Checking:
```python
slow = slow.next
fast = fast.next.next
if fast == slow:  # Check AFTER moving!
```

**Why?** If we check first, they're always equal at start (both at head)

---

## 📊 Complexity Analysis:

### Time: O(n)
- **No cycle:** Fast reaches end in n/2 steps → O(n)
- **Has cycle:**
  - Getting to cycle: O(n - k) where k = cycle size
  - Meeting inside: O(k) max
  - Total: O(n)

### Space: O(1)
- Only 2 pointers
- No extra data structures

---

## 🎯 When to Use This Pattern:

✅ Detecting cycles in linked lists
✅ Finding middle of linked list
✅ Finding cycle start position
✅ Finding if linked list is palindrome

**Core idea:** Two pointers moving at different speeds!

---

## 🔥 Pro Tips:

1. **Always move pointers BEFORE checking if they meet**
2. **Loop condition must check BOTH fast and fast.next**
3. **Think about relative speed, not absolute positions**
4. **This pattern is O(1) space - huge advantage!**

---

*Date: 2026-01-14*
*Pattern: Fast & Slow Pointers*
*Mastery: ✅ Understood*
