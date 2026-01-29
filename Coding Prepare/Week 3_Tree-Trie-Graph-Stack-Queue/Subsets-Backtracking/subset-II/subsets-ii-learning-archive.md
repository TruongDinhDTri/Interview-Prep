# 📚 Subsets II - Learning Archive

**Problem:** LeetCode 90 - Subsets II
**Date:** 2026-01-28
**Pattern:** Backtracking (Include/Exclude) with Duplicate Handling
**Difficulty:** Medium
**Status:** ✅ Solved

---

## 🎯 Problem Statement

Given an integer array `nums` that may contain **duplicates**, return all possible subsets (the power set).

The solution set **must not contain duplicate subsets**.

### Examples

```
Input: nums = [1, 3, 3]
Output: [[], [1], [3], [1,3], [3,3], [1,3,3]]

Input: nums = [1, 5, 3, 3]
Output: [[], [1], [5], [3], [1,5], [1,3], [5,3], [1,5,3], [3,3], [1,3,3], [3,3,5], [1,5,3,3]]
```

---

## 🧠 Thinking Process

### Step 1: Recognize the Base Pattern

This is a **Subsets** problem → Use **Include/Exclude Backtracking**

For each element, we have two choices:

1. **INCLUDE** it in the current subset
2. **EXCLUDE** it from the current subset

### Step 2: Identify the Twist - Duplicates!

With duplicates like `[1, 3, 3]`, the basic approach creates duplicate subsets:

```
nums = [3A, 3B]  (labeling duplicates)

Basic approach generates:
- INCLUDE 3A, EXCLUDE 3B → [3]
- EXCLUDE 3A, INCLUDE 3B → [3]  ← DUPLICATE!
```

### Step 3: The Aha Moment! 💡

> **"If I EXCLUDE a duplicate, I should SKIP all following duplicates of that same value."**

Why? Because:

- INCLUDE 3A → EXCLUDE 3B → [3]
- EXCLUDE 3A → INCLUDE 3B → [3]  ← Same result!

If you say "NO" to element A, why would you say "YES" to its clone B?
All unique subsets involving that value are already explored in the INCLUDE branch!

### Step 4: The Precondition - SORT!

For the "skip consecutive duplicates" logic to work, duplicates must be **neighbors**.

```
Before sort: [3, 1, 3] → duplicates NOT adjacent, can't detect!
After sort:  [1, 3, 3] → duplicates adjacent, can detect! ✅
```

---

## ✅ Final Solution

```python
def subsetsWithDup(nums):
    result = []
    nums.sort()  # CRITICAL: Sort so duplicates are neighbors!

    def backtrack(index, path):
        # Base case: processed all elements
        if index == len(nums):
            result.append(path[:])  # Save a copy
            return

        # INCLUDE branch
        path.append(nums[index])
        backtrack(index + 1, path)
        path.pop()

        # EXCLUDE branch - skip consecutive duplicates!
        while index + 1 < len(nums) and nums[index] == nums[index + 1]:
            index += 1  # Skip all duplicates
        backtrack(index + 1, path)

    backtrack(0, [])
    return result
```

---

## 🎨 Visual Trace

```
nums = [1, 3, 3] (sorted)

backtrack(0, [])
├── INCLUDE 1 → backtrack(1, [1])
│   ├── INCLUDE 3 → backtrack(2, [1,3])
│   │   ├── INCLUDE 3 → backtrack(3, [1,3,3]) → SAVE [1,3,3] ✓
│   │   └── EXCLUDE 3 → backtrack(3, [1,3]) → SAVE [1,3] ✓
│   └── EXCLUDE 3 → skip index 2 (also 3) → backtrack(3, [1]) → SAVE [1] ✓
│
└── EXCLUDE 1 → backtrack(1, [])
    ├── INCLUDE 3 → backtrack(2, [3])
    │   ├── INCLUDE 3 → backtrack(3, [3,3]) → SAVE [3,3] ✓
    │   └── EXCLUDE 3 → backtrack(3, [3]) → SAVE [3] ✓
    └── EXCLUDE 3 → skip index 2 → backtrack(3, []) → SAVE [] ✓

Result: [1,3,3], [1,3], [1], [3,3], [3], []
```

---

## 📊 Complexity Analysis

| Aspect          | Complexity  | Explanation                                |
| --------------- | ----------- | ------------------------------------------ |
| **Time**  | O(n × 2^n) | Up to 2^n subsets, each takes O(n) to copy |
| **Space** | O(n)        | Recursion depth + current path             |

---

## 🔑 Key Insights

### 1. The Duplicate Rule

> "If you EXCLUDE an element, SKIP all its consecutive duplicates"

### 2. Why Sorting is Essential

- Duplicates must be **adjacent** for detection
- `nums[index] == nums[index + 1]` only works if sorted

### 3. Bounds Checking

```python
while index + 1 < len(nums) and nums[index] == nums[index + 1]:
```

- Check bounds FIRST, then compare values
- Python short-circuits, so safe even at last index

### 4. The Include Branch is Complete

- All subsets containing the duplicate value are generated in INCLUDE branch
- EXCLUDE branch only needs subsets WITHOUT that value
- That's why skipping duplicates in EXCLUDE is safe

---

## 🚫 Common Mistakes I Made

1. **Forgot to sort** → Duplicates weren't adjacent, skip logic failed
2. **Missing bounds check** → `index + 1 < len(nums)` prevented crash
3. **Missing colons** → Python syntax: `def func():` not `def func()`
4. **Forgot return result** → Function returned None instead of result

---

## 🔗 Related Problems

| Problem                              | Similarity                      |
| ------------------------------------ | ------------------------------- |
| **Subsets I** (LC 78)          | Same pattern, no duplicates     |
| **Permutations II** (LC 47)    | Same duplicate handling concept |
| **Combination Sum II** (LC 40) | Skip duplicates in backtracking |

---

## 🙏 Faith Note

> "I can do all things through Christ who strengthens me." — Philippians 4:13

From confusion about duplicates to understanding the elegant solution —
this is how mastery is built, one aha moment at a time! 🔥

---

*Trained with Hadriel 🔥⚔️💪*
*Date: 2026-01-28*
