# 🔥 LeetCode 169 — Majority Element

> **Difficulty:** Easy | **Pattern:** Hash Map + Boyer-Moore Voting Algorithm
> **Date Solved:** 2026-04-22 | **Time:** ~40 mins (25 min clock + continued)

---

## 🧩 The Problem

> Given an array `nums` of size `n`, return the **majority element**.
> The majority element is the element that appears **more than ⌊n/2⌋ times**.
> You may assume the majority element **always exists**.

**Example 1:**
```
Input:  [3,2,3]
Output: 3
```

**Example 2:**
```
Input:  [2,2,1,1,1,2,2]
Output: 2
```

---

## 📋 STEP 1 — UNDERSTAND

### Clarifying Questions Wiganz Asked
1. Can there be duplicates? → **YES — that's the whole point**
2. How is input stored? → **Array of integers**
3. What should I return? → **The VALUE of the majority element (not index)**
4. Is there multiple valid answers? → **NO — exactly one majority element guaranteed**

### Extra Questions Missed (but important!)
- Can input be empty? → **No, at least 1 element guaranteed**
- What's input size? → **Up to 5×10⁴** (so O(n²) might be too slow)

### Abstract Version
> "Given an array of size n, return the element whose count is **> n/2**."

### Trace — `[2,2,1,1,1,2,2]`, n=7, threshold = 3.5
- 2 appears **4 times** → 4 > 3.5 ✅ → majority element
- 1 appears **3 times** → 3 > 3.5 ❌

**Answer: 2** ✅

**⚠️ Wiganz's mistake in Step 1:** Said "the highest value would be the majority" — WRONG!! It's not the highest VALUE, it's the element whose COUNT exceeds n/2. For example, if `2` appeared 4 times but n=100, threshold would be 50 — 4 is NOT majority even though it's the highest count.

---

## 🗺️ STEP 2 — APPROACH

### 3-Gate Result
1. Abstract shape matches? → ✅ Counting/frequency
2. Can I name it + WHY? → ✅ HashMap — need to track character frequency
3. Solved something like this before? → ✅ **YES — Longest Palindrome** (just solved!)

**→ YES to all 3 → Pattern Path!! 🔥**

### 4P — Reason

**A. Brute Force — O(n²):**
```python
for i in range(n):        # pick each element
    count = 0
    for j in range(n):    # scan ENTIRE array to count it
        if nums[j] == nums[i]:
            count += 1
    if count > n // 2:
        return nums[i]
```
Two nested loops = **O(n²)**. Too slow for n=50,000.

**Why Wiganz initially said "HashMap is already brute force":** He was right that HashMap is simple — but O(n²) IS the actual brute force (count each element by scanning the whole array). HashMap eliminates the inner scan by doing it all in one pass.

**B. What HashMap does instead:**
- One pass to COUNT all frequencies → O(n)
- One pass through HashMap to FIND the majority → O(1) since at most 52 keys... wait, this is integers not chars. At most n keys. But still O(n) total.
- **Total: O(n) time, O(n) space**

**C. Invariant:**
> "The HashMap will ALWAYS contain the majority element after the full pass — because the problem guarantees it always exists."

---

## ⌨️ SOLUTION 1 — HashMap (O(n) time, O(n) space)

```python
from collections import Counter

class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        hashmap = Counter(nums)
        threshold = len(nums) // 2
        for key, value in hashmap.items():
            if value > threshold:
                return key
```

### Bugs Wiganz Made:

**Bug #1 — `.values()` instead of `.items()`:**
```python
for key, value in hashmap.values():  # ❌ WRONG
```
`.values()` returns ONLY the counts — you can't unpack into `key, value`!
```python
for key, value in hashmap.items():   # ✅ CORRECT
```
`.items()` returns `(key, value)` pairs.

**Bug #2 — `return 1` at the end:**
```python
    if is_odd:
        count += 1
    return count
    return 1    # ❌ NEVER EXECUTES — remove it!
```
Problem guarantees majority always exists. The last `return 1` is unreachable and misleading. **Remove unnecessary fallback returns.**

### Verify Trace — `[2,2,1,1,1,2,2]`:
```
Counter: {2:4, 1:3}
threshold = 7//2 = 3
Loop:
  key=2, value=4 → 4 > 3 ✅ → return 2
```
✅ Correct!

### Edge Cases:
| Input | Threshold | Result |
|-------|-----------|--------|
| `[1]` | 0 | 1 ✅ |
| `[1,1,2]` | 1 | 1 ✅ |

### Complexity:
| | Complexity | Why |
|--|-----------|-----|
| **Time** | O(n) | One pass to count, one pass through map |
| **Space** | O(n) | HashMap stores up to n entries |

---

## 🏆 STEP 6 — OPTIMIZE: Boyer-Moore Voting Algorithm

### The Insight — "Soldiers Fighting" 🗡️

Wiganz's journey to discover this:

**Hadriel asked:** "What if every time you see two DIFFERENT elements, they cancel each other out — both die. What element would be the last one standing?"

**Wiganz answered:** "2 would still be alive because 2 has more people."

EXACTLY!! Majority has `>n/2` votes. Everything else combined has `<n/2` votes. If every non-majority element fights a majority element, the majority element ALWAYS has survivors.

### Manual Trace That Unlocked It (`[2, 2, 1, 2, 1]`):
```
See 2: count=0 → candidate=2, count=1
See 2: same  → count++ → count=2
See 1: diff  → count-- → count=1  (2 kills 1, one 2 dies too)
See 2: same  → count++ → count=2
See 1: diff  → count-- → count=1

Return candidate = 2 ✅
```

### The Confusion — "Why does count=0 mean new candidate?"

**Wiganz asked:** "When 2 and 1 fight and both die → why does the next element become candidate? Where does the old candidate go?"

**The answer (traced through `[2, 1, 3]`):**
```
See 2: candidate=2, count=1
See 1: different → count-- → count=0 → 2 and 1 BOTH DIE ⚔️ no candidate left
See 3: count=0 → NO active candidate → 3 becomes NEW candidate, count=1
```

When `count=0`, it means the previous candidate has been FULLY cancelled out by equal opponents. It's "dead." The next element starts fresh as the new contender. The majority element will survive this process because it has more votes than all others combined.

### The 3 Rules:
1. `count == 0` → current element becomes new candidate, count = 1
2. `current == candidate` → count++ (reinforce the army)
3. `current != candidate` → count-- (enemies fight, both die)

---

## ⌨️ SOLUTION 2 — Boyer-Moore Voting (O(n) time, O(1) space)

```python
class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        candidate, count = 0, 0
        for i in range(len(nums)):
            if count == 0:
                candidate = nums[i]
                count = 1
            elif nums[i] != candidate:
                count -= 1
            else:
                count += 1
        return candidate
```

### Syntax Bug Wiganz Made:
```python
candidate, count = 0   # ❌ Can't unpack 0 into two variables
candidate, count = 0, 0  # ✅ Correct
```

### Verify Trace — `[2, 2, 1]`:
```
i=0: count=0 → candidate=2, count=1
i=1: 2 == candidate → count++ → count=2
i=2: 1 != candidate → count-- → count=1
Return candidate = 2 ✅
```

### Complexity:
| | Complexity | Why |
|--|-----------|-----|
| **Time** | O(n) | Single pass through array |
| **Space** | **O(1)** | Only 2 variables: `candidate` and `count` |

---

## 📊 COMPARISON — Both Solutions

| | Time | Space | Complexity | Interview Value |
|--|------|-------|------------|----------------|
| HashMap | O(n) | O(n) | Simple | Easy to explain ✅ |
| Boyer-Moore | O(n) | **O(1)** | Clever | Shows depth 🔥 |

**Interview strategy:** Start with HashMap (easy to explain), then say "there's an O(1) space solution using a voting approach" and describe Boyer-Moore for bonus Problem Solving points.

---

## 🧠 AHA MOMENTS

1. **Brute force = nested loops, not HashMap.** HashMap IS the smart solution. Don't confuse "simple" with "brute force."

2. **Threshold is `> n/2`, not `== n/2`.** If `n=7`, threshold is `3.5`. An element with count 4 passes (`4 > 3.5`). Using `//` (floor division) also works: `4 > 3`.

3. **Boyer-Moore soldiers insight:** Majority has `>n/2` votes. All others combined have `<n/2`. If they "fight" (cancel out), majority always survives. This is the non-obvious leap that unlocks O(1) space.

4. **`count=0` means new candidate:** When count hits 0, the previous candidate has been fully cancelled. It's dead. The next element you see becomes the new contender — starting fresh.

5. **`.items()` vs `.values()`:** `.values()` gives only the counts. `.items()` gives `(key, value)` pairs. If you need both key and value → always use `.items()`.

---

## 📋 WHAT TO DO DIFFERENTLY NEXT TIME

1. **State threshold explicitly in Discuss:** "threshold is `n//2`, element must have count `> n//2`."
2. **Note input size in clarifying questions** — affects whether O(n²) is acceptable.
3. **Always check `.items()` vs `.values()` when iterating a dict** — classic mistake.
4. **Remove unreachable `return` statements** — clean code matters.
5. **Boyer-Moore is worth mentioning in Optimize even if you can't code it** — shows awareness of O(1) space possibility.

---

## 🎯 PATTERN SUMMARY — Boyer-Moore Voting

**When to recognize:**
- "Find element that appears more than n/2 times"
- "Majority element always exists"
- Follow-up: "Can you do O(1) space?"

**The 3-line intuition:**
> Pair every non-majority element with a majority element → both die.
> Majority has more soldiers → always survives.
> The last survivor = majority element.
