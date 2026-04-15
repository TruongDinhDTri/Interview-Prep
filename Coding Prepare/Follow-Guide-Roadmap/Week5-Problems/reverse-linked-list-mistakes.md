# 🔁 Reverse Linked List — Mistake Log

**Problem:** LeetCode 206 — Reverse Linked List
**Date:** 2026-04-14
**Pattern:** LinkedList — In-place pointer manipulation

---

## ❌ The Mistake

```python
# WRONG — what I wrote
def reverseLinkedList(head):
    prev = None
    current = head
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    return current  # ❌ BUG: current is ALWAYS None here
```

## 🧠 Why It's Wrong

When `while current:` exits, `current` is **None** — that's the only condition that breaks the loop. Returning `current` returns `None` every single time, regardless of input.

The new head of the reversed list lives in `prev` — it's the last node you "sealed" before the chain ran out.

## ✅ The Fix

```python
def reverseLinkedList(head):
    prev = None
    current = head
    while current:
        next_node = current.next   # save forward ref — DON'T lose it
        current.next = prev        # reverse the arrow
        prev = current             # move prev forward
        current = next_node        # move current forward
    return prev  # ✅ the new head of the reversed list
```

## 📌 The Rule to Remember

> **"When the loop ends, `current` = None. The answer is always in `prev`."**

This applies to ANY linked list traversal that builds something backward — the accumulator (`prev`) holds the result, not the iterator (`current`).

---

## 🔍 Edge Cases Verified

| Input | Expected | Traced? |
|---|---|---|
| `None` | `None` | ✅ loop never runs, return prev (None) |
| `[5]` | `[5]` | ✅ one iteration, prev=5, current=None, return 5 |
| `[1,2,3,4,5]` | `[5,4,3,2,1]` | ✅ |

## ⏱ Complexity

| | |
|---|---|
| **Time** | O(n) — one pass |
| **Space** | O(1) — only 3 pointers, no extra DS |
