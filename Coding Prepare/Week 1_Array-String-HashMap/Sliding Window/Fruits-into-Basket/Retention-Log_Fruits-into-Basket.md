# Retention Log: Fruits into Baskets

**Date:** 2026-03-14
**Pattern:** Sliding Window
**Category:** Week 1 — Array, String, HashMap, Sliding Window
**Difficulty:** Medium
**LeetCode:** #904

---

## PRE-SOLVE: RETENTION CHECK

**Q: Can you remember the approach?**
A: The approach is Longest Subarray with K Distinct Elements. Use a sliding window with a hashmap to count fruit types. Expand right to explore, shrink left when distinct types exceed K (2 baskets). Delete hashmap keys when count drops to 0 (zombie key cleanup). Track max_length throughout.

**Q: Why pick this problem?**
A: Retention session — covering 3 distinct categories (Prefix Sum, Sliding Window, HashMap/Array). This is the Sliding Window representative.

---

## SOLVE PROCESS

### STEP 1: DECODE — "What is this problem REALLY asking?"

A: Find the **longest subarray with at most K distinct elements** (K=2 for this problem).

Strip the story: No fruits. No baskets. No trees. Just "longest subarray, ≤ K distinct."

**Pattern Signals:** Subarray, constraint on distinct elements, longest/maximum

---

### STEP 2: MATCH — "What signals tell me which pattern?"

A: Longest range + constraint → **Sliding Window**.

Trigger: "When I see [subarray + constraint] → I think [Sliding Window]"

---

### STEP 3: REASON — "WHY does this pattern work?"

#### 3.1 Brute force & why it's bad

Check every possible subarray that contains at most 2 fruit types. At each fruit, run another loop to find all valid subarrays starting from that position → **O(n²)**. Too slow.

#### 3.2 What does the pattern do instead?

Sliding window slides across the array in one pass — **O(n)**. Use a hashmap to store the count of each fruit type. Expand right to explore new fruits. When distinct count exceeds K, shrink from left. Since we allow many fruits of the same type, we track counts — when a count drops to 0, delete the key from the hashmap.

#### 3.3 The Invariant

The window must always have **≤ K distinct fruit types**. The moment it doesn't, shrink from the left until it does. This rule never breaks at any step.

---

### STEP 4: PLAN & CODE

**Plan:**

1. Left pointer at 0, hashmap for counts, max_length = 0
2. Right pointer expands, add fruit to map
3. Constraint check: if `len(hashmap) > 2` → shrink from left, remove leftmost fruit count, delete key if count == 0, increment left
4. After window is valid again, update `max_length = max(max_length, right - left + 1)`
5. Return max_length

**Code:**

```python
from collections import defaultdict

def fruit_into_basket(fruits):
    fruits_map = defaultdict(int)
    max_length = 0
    left = 0
    for right in range(len(fruits)):
        current_fruit = fruits[right]
        fruits_map[current_fruit] += 1

        while len(fruits_map) > 2:
            # Shrink from left
            left_fruit = fruits[left]
            fruits_map[left_fruit] -= 1

            if fruits_map[left_fruit] == 0:
                del fruits_map[left_fruit]
            left += 1

        # Window is valid, check max_length
        max_length = max(max_length, right - left + 1)
    return max_length
```

---

### STEP 5: PROVE — Verified from memory with new input

**Trace: `fruits = [1, 2, 3, 2, 2]`**

| i (right) | left | fruits_map        | Action                          | max_length |
|-----------|------|-------------------|---------------------------------|------------|
| 0         | 0    | {1: 1}            | Add 1                           | 1          |
| 1         | 0    | {1: 1, 2: 1}     | Add 2, 2 distinct = valid       | 2          |
| 2         | 1    | {2: 1, 3: 1}     | Add 3, 3 distinct → shrink, del 1 | 2       |
| 3         | 1    | {2: 2, 3: 1}     | Add 2, 2 distinct = valid       | 3          |
| 4         | 1    | {2: 3, 3: 1}     | Add 2, 2 distinct = valid       | 4          |

**Final: max_length = 4** (subarray `[2, 3, 2, 2]`)

**Verified correct.**

---

## ERRORS LOG

| # | Error                              | Type     | Correction                                      |
|---|------------------------------------|----------|--------------------------------------------------|
| 1 | `defaultdict()` without factory    | Code bug | Must use `defaultdict(int)` for counting         |
| 2 | `length()` instead of `len()`      | Syntax   | Python built-in is `len()`, not `length()`       |
| 3 | `return` indented inside for loop  | Code bug | Must be at function level, not inside the loop   |

---

## COMPLEXITY

- **Time:** O(n) — One pass with sliding window
- **Space:** O(K) — HashMap stores at most K+1 entries before cleanup (K=2 here, so O(1))

---

## KEY TAKEAWAYS

1. **Abstract problem:** Longest subarray with ≤ K distinct elements
2. **Pattern trigger:** Subarray + constraint → Sliding Window
3. **Invariant:** Window must always have ≤ K distinct types
4. **Zombie key trap:** When a fruit count drops to 0, you MUST `del` the key — otherwise `len(hashmap)` stays inflated and the window shrinks forever
5. **`defaultdict(int)`:** The `int` is a factory function — `int()` returns `0`, perfect default for counting

---
