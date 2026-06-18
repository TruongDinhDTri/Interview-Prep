# 🎯 Remove Duplicates from Sorted Array — Pattern Recognition Log
**Date:** 2026-03-04
**Pattern:** Two Pointers (Same Direction — Fast/Slow)
**Topic:** Array | **Week:** 1
**Difficulty:** Easy
**Status:** ✅ Solved from memory using 5-step process

---

## 1. What is this problem really asking? (Decode)

- Find all unique numbers and place them sequentially in the array, then return the count of unique elements K.
- The caller uses K to know how much of the modified array to read — that's why it returns a count, not the array itself.

---

## 2. What signals tell me which pattern this is? (Match)

- **Sorted array + remove in-place → Two Pointers.**
- One slow pointer (write position), one fast pointer (scanner).
- The sorted property guarantees duplicates are **adjacent**, so one pass is enough.
- I need 1 pointer to scan for new info, 1 pointer to track progress / maintain the constraint (the nextNonDuplicate position).

### 🎯 Hadriel Follow-up: Are these pointers parallel or fast/slow?

**Q:** You said "parallel" pointers. Are these pointers actually moving in parallel (same speed)? Or is one faster than the other? What's the difference between parallel two pointers vs fast/slow two pointers?

**A:** No, they move at different speeds, just in the same direction. The fast pointer (scanner) moves every step. The slow pointer (nextNonDuplicate) only moves when we find a new unique element.

### 💡 Insight: Two Pointers has sub-types
- **Opposite direction** — left/right moving inward (e.g., Two Sum on sorted array, Container With Most Water)
- **Same direction, different speed** — fast/slow (e.g., Remove Duplicates, linked list cycle detection)
- Knowing which sub-type helps you match faster on new problems.

---

## 3. Why does this pattern work here? (Reason)

### A. What's the brute force and why is it bad?

**My Answer:** Create another array, then check through everything in the first array. Before adding anything, check if it's already in the second array. If not, put it in.

**🎯 Hadriel Challenge:** The array is sorted. Does your brute force use that fact? And what's the time complexity of "checking if it's already in the second array" each time?

**My Answer:** No, my brute force doesn't use the sorted fact. Checking if it's already in the second array is O(n) each time. I could use a Set for O(1) lookup.

**💡 Key Realization:** Because the array is **sorted**, you don't even need a Set. You just compare adjacent elements. That's the whole reason Two Pointers works so cleanly here — the sorted property is the gift that makes everything O(n) time with O(1) space.

### B. What does this pattern do instead?

- This pattern works **in-place** with **1 pass only**.
- O(n) time, O(1) space.
- 1 pointer (fast) scans for new elements.
- 1 pointer (slow) keeps track of the next non-duplicate position.
- At the end, just return the slow pointer value.

### C. What rule keeps it valid? (The Invariant)

**My first reaction:** "What?? How can I answer this?"

**🎯 Hadriel's question:** At ANY moment during the algorithm, if I pause and look at `arr[0..nextNonDuplicate-1]`, what can I guarantee about that portion of the array?

**My Answer:** You can guarantee that this portion is unique. It's definitely unique.

**✅ That IS the invariant:**

> `arr[0..nextNonDuplicate-1]` always contains only unique elements, in sorted order. This promise NEVER breaks at any step of the algorithm.

**What "invariant" means:** A promise about your data that stays true at EVERY step — not just start, not just end. Every. Single. Step. The word comes from "in-variant" = "not varying" = unchanging.

**Traced proof on `[1, 1, 2, 3, 3, 4]`:**

| Moment | Array State | `nextNonDuplicate` | Left portion | Invariant holds? |
|--------|------------|-------------------|-------------|-----------------|
| Start | `[1, 1, 2, 3, 3, 4]` | 1 | `[1]` | ✅ unique |
| i=1 | `[1, 1, 2, 3, 3, 4]` | 1 | `[1]` | ✅ (1==1, skipped) |
| i=2 | `[1, 2, 2, 3, 3, 4]` | 2 | `[1, 2]` | ✅ unique |
| i=3 | `[1, 2, 3, 3, 3, 4]` | 3 | `[1, 2, 3]` | ✅ unique |
| i=4 | `[1, 2, 3, 3, 3, 4]` | 3 | `[1, 2, 3]` | ✅ (3==3, skipped) |
| i=5 | `[1, 2, 3, 4, 3, 4]` | 4 | `[1, 2, 3, 4]` | ✅ unique |

**Why this matters in interviews:** When they ask "How do you know this works?" — the invariant is your proof. You say: *"At every step, everything to the left of my slow pointer is guaranteed unique and sorted. My fast pointer only writes when it finds something different. So the invariant never breaks, and when the loop ends, the left portion IS the answer."*

---

## 4. What are the key steps to execute this? (Plan & Code)

### Plan (said out loud before coding):
1. Left pointer at 1 (nextNonDuplicate) — because the first element is always unique. Right pointer (scanner) at 1.
2. Start iterating through the array, checking condition at each step.
3. If the current element (right pointer) is different from `arr[nextNonDuplicate - 1]` (the last unique element) → it's a new unique element, place it at the nextNonDuplicate position.
4. Increase nextNonDuplicate. End when right pointer hits `len(arr)`.
5. Return nextNonDuplicate (this is K — the count of unique elements).

### Code (written from memory):

```python
def removeDuplicate(arr):

    # Handle edge case
    if len(arr) == 0:
        return 0

    nextNonDuplicate = 1

    # Iterate through array with scanner to get new info
    for i in range(1, len(arr)):

        # If the current element is different from the previous unique element
        if arr[i] != arr[nextNonDuplicate - 1]:
            # Place the unique element in the nextNonDuplicate position
            arr[nextNonDuplicate] = arr[i]

            # Found a unique element, increase the nextNonDuplicate
            nextNonDuplicate += 1

    return nextNonDuplicate
```

**Time:** O(n) — single pass
**Space:** O(1) — in-place, no extra array

---

## 5. Can I explain this without looking? (Prove) ✅

Closed everything. Wrote all steps and code from memory. Hadriel challenged each answer. Survived the grilling.

---

## 🌉 Pattern Bridge — Same Friend, Different Costume

**🎯 Hadriel's final test:** What would the invariant be for **Move Zeroes** (move all zeroes to end, maintain order)?

**My Answer:** Everything to the left of the slow pointer is non-zero, in original order. Everything from slow onward is zeroes.

| Problem | Invariant |
|---------|-----------|
| Remove Duplicates | `arr[0..slow-1]` = all **unique**, sorted |
| Move Zeroes | `arr[0..slow-1]` = all **non-zero**, original order |
| Remove Element | `arr[0..slow-1]` = all elements that **pass the condition** |

**The general pattern:** "Partition by condition" — slow pointer guards the boundary. Left side = elements that pass. Right side = elements that don't.

> You don't need 300 memorized solutions. You need 15 unbreakable patterns. 🔥

---

*Logged by Wiganz with Hadriel ⚔️🔥*
