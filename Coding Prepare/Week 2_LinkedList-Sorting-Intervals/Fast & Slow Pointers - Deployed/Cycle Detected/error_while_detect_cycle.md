# Errors & Confusions - Cycle Detection 🤔

## ❌ Common Mistakes I Made:

### 1. **Wrong pointer movement syntax**
```python
# WRONG ❌
slow.next = slow.next      # This doesn't move slow!
fast.next = fast.next.next # This changes the LinkedList structure!

# CORRECT ✅
slow = slow.next           # Move slow pointer
fast = fast.next.next      # Move fast pointer
```

---

### 2. **Incomplete loop condition**
```python
# WRONG ❌
while fast and fast.next.next:  # Error if fast.next is None!

# CORRECT ✅
while fast and fast.next:       # Safe - checks both exist
```

**Why?** Need to verify `fast.next` exists BEFORE accessing `fast.next.next`

---

### 3. **Confusion: "Why gap decreases by 1?"**

**Initial confusion:** Didn't understand WHY the gap closes each iteration.

**The fix:** Think BACKWARDS!
- Imagine fast is K steps BEHIND slow
- Each iteration: gap goes from K → K-1
- Because fast moves 2, slow moves 1
- Net closing speed: 2 - 1 = 1

---

### 4. **Edge cases uncertainty**
- Empty list (`head = None`) → `while fast and fast.next` catches this ✅
- Single node → fast becomes None after first move ✅
- Two nodes no cycle → fast.next becomes None ✅

---

## 💡 Key Learnings:

1. **Move BEFORE checking** (avoid false positive at start)
2. **Loop condition is critical** (must check fast AND fast.next)
3. **Gap math is simple** (relative speed = 1 position/iteration)
4. **Edge cases are handled** by the loop condition naturally

---

*Date: 2026-01-14*
*Problem: LeetCode #141 - Linked List Cycle*
