# 🗡️ K Closest Points to Origin -- Complete Session Archive

> **Pattern:** Top K Elements (Heap) | **Difficulty:** Medium | **LeetCode:** #973 | **Date:** 2026-05-04
> **Path Taken:** First Principles (Gate 3 failed -- first Top K problem) | **⏱️ Time Used:** 25 min | **🎯 Target:** 25 min

---

## 🗺️ The Journey -- How Understanding Built

Recognized the Top K pattern signature at Gate 1 and Gate 2, but Gate 3 failed (never solved a Top K problem before) -- forced onto the First Principles path. Through manual visualization and Rules Discovered from Technique B, independently confirmed the max-heap approach. Hit 3 bugs during coding -- all caught and fixed during the Step 5 scan. Discovered Python's list lexicographic comparison as a heap edge case. Missed the brute force mention in Discuss. Unlocked the O(n) theoretical floor and QuickSelect insight in teaching mode post-solve.

---

## 📖 Step 1 -- Understand

### 📝 Problem Statement (Human Language)

Given an array of points `[x, y]` and an integer `k`, return the `k` points closest to the origin `(0, 0)`. Distance is Euclidean: `sqrt(x^2 + y^2)`. Order of returned points does not matter.

Wiganz initially gave the general Euclidean formula `sqrt((x1-x2)^2 + (y1-y2)^2)`. Hadriel asked: "One of those points is always fixed -- what is it fixed to?" Answer: `(0,0)` -- simplifies to `sqrt(x^2 + y^2)`. For comparison purposes only, `x^2 + y^2` suffices (no need to compute the square root).

### 🔬 Abstract (Story Stripped)

> "Given n items each with a computed score -- return the k items with the smallest scores."

This took multiple iterations before geometry was fully stripped:
1. "Given an array of points, calculate the distance to 0,0 and return k closest" -- still has geometry
2. "Given an array of items. Calculate the score of each item. Return k smallest." -- fully abstract

### ❓ Constraint Questions Asked

| Question | Answer |
|---|---|
| Sorted? | No |
| Negative values? | Yes -- coordinates can be negative |
| Duplicates? | Yes -- two points can share the same coordinates |
| Empty input? | No -- at least k points exist |
| Modify input? | Yes |
| Expected input size? | 1 <= k <= points.length <= 10^4 |
| Return what? | The k closest points as `[[x,y],...]` -- order does not matter |
| How stored? | Array of `[x, y]` pairs |
| One valid answer? | Yes |

**Bonus edge case identified:** k = n means return all points -- no selection needed. Flagged for Step 5.

### ✋ Trace by Hand

```
points = [[1,3], [-2,2]],  k = 1
```

| Point | Distance squared | Score |
|---|---|---|
| [1,3] | 1^2 + 3^2 | 10 |
| [-2,2] | (-2)^2 + 2^2 | 8 |

k = 1 -- return the 1 point with the **smallest** score -- output: `[[-2,2]]`

The problem says "closest" = smallest distance = smallest score. Output is `[[-2,2]]` because its score (8) is smaller than [1,3]'s score (10).

---

## 🧭 Step 2 -- Approach (3-Gate Check)

### 🚦 3-Gate Results

| Gate | Question | Result |
|---|---|---|
| Gate 1 | Abstract shape matches a pattern? | YES -- "n items, return k smallest" = Top K Elements |
| Gate 2 | Name it AND explain WHY? | YES -- heap of size k is O(n log k) vs sort O(n log n) |
| Gate 3 | Solved something like this before? | NO -- first Top K problem ever |

**Gate 3 failed -- Decision: FIRST PRINCIPLES PATH (3F)**

---

## 🔎 3F -- First Principles Exploration

### 🛠️ Techniques Used

**Technique A -- Visualize:** Visualized each point as a dot on a grid and imagined computing distances. Confirmed the scoring formula: `x^2 + y^2`.

**Technique B -- Manual Solve (Rules Discovered):** Traced through the example by hand, step by step. Discovered three rules:

### 📐 Rules Discovered (from Technique B)

```
Rule 1: Maintain a max-heap of size k.
        If heap size > k → pop the largest (farthest point gets evicted).
        What remains after all n points processed = the k closest.

Rule 2: Python only has min-heap (heapq).
        Negate the distance to simulate a max-heap:
            dis = -(x^2 + y^2)
        Most negative value = largest original distance = gets popped first.

Rule 3: Push tuple (-distance, point) into the heap -- not just the distance.
        The problem asks to RETURN the actual points, not just distances.
```

Why Rule 2 works:
- Distance 10 stored as -10
- Distance 8 stored as -8
- Python pops the SMALLEST value: -10 < -8 so -10 pops first
- -10 corresponds to distance 10 = the FARTHEST point -- correctly evicted

### 💡 The AHA Moment

Gate 2 required Wiganz to explain WHY the heap fits -- not just name it. First attempt was circular:

> "Top K uses a heap because Top K uses a heap." -- rejected

Hadriel pushed: "What does a heap give you that sorting all n items doesn't?"

This unlocked the real insight: **you never need to sort all n items -- maintaining only k candidates is enough.**

Final Gate 2 sentence:

> "I see n items, return k smallest, which tells me Top K Elements because Top K allows me to use a heap of size k and the time would be O(n log k) instead of sorting O(n log n)."

---

## 🗣️ Step 3 -- Discuss

### 📋 Wiganz's Full Presentation

Named approach: Max-heap of size k with negated distances.

Numbered steps:
1. Initialize `maxheap = []`
2. Calculate distance: `dis = -(x*x + y*y)` (negated for max-heap simulation)
3. Push `(dis, x, y)` tuple onto heap
4. If `len(maxheap) > k` -- pop (evicts the farthest point)
5. Return all points from the heap

### 📊 Complexity Stated

- Time: `O(n log k)` -- n points, each heap operation is O(log k)
- Space: `O(k)` -- heap holds at most k points

### ✅ Green Light

Asked "Does that make sense? Shall I code it?" -- green light received.

### ⚠️ What Was Missed

**Brute force mention skipped.** In a real interview, even 10 seconds of "brute force would sort everything in O(n log n), but we can do better with a heap of size k" earns Problem Solving points. This is scored as "multiple solutions with trade-off analysis" -- an advanced signal. Never skip it even when you already know the optimal answer.

---

## 💻 Step 4 -- Code

### 🏗️ Blueprint (Comments First)

```python
class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        # 2.1 Initialize the heap
        # 2.2 Calculate the distance with -(x*x + y*y)
        # 2.3 Add the point and distance to maxheap
        # 2.4 If bigger than size k → pop
        # 2.5 Return the points from the heap
```

### ✨ Final Clean Solution

```python
import heapq

class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        maxheap = []
        for [x, y] in points:
            dis = -(x*x + y*y)
            heapq.heappush(maxheap, (dis, [x, y]))
            if len(maxheap) > k:
                heapq.heappop(maxheap)
        return [[x, y] for (_, [x, y]) in maxheap]
```

**⏱️ Time:** O(n log k) -- n points, each heappush/heappop costs O(log k)
**📦 Space:** O(k) -- heap holds at most k tuples at any time

---

## 🔍 Step 5 -- Verify

### 👣 Trace Through Example (Out Loud)

```
points = [[1,3], [-2,2]],  k = 1
```

| Step | Action | maxheap after |
|---|---|---|
| Init | `maxheap = []` | `[]` |
| Point [1,3] | push `(-10, [1,3])` | `[(-10, [1,3])]` |
| Size check | len=1, not > 1 | no pop |
| Point [-2,2] | push `(-8, [-2,2])` | `[(-10, [1,3]), (-8, [-2,2])]` |
| Size check | len=2 > k=1 -- pop | pops `-10` (most negative = farthest) |
| After pop | `[(-8, [-2,2])]` | |
| Return | `[[-2,2]]` | correct |

Why `-10` gets popped: Python min-heap pops the smallest value. `-10 < -8`, so `-10` pops first. `-10` corresponds to distance 10 = the farthest point. Farthest evicted, only closest remains.

### 🧪 Edge Cases

| Case | Input | Expected | Handled? |
|---|---|---|---|
| k = n | All points | Return all | Yes -- size never exceeds k, no pops |
| k = 1 | Any | Single closest | Yes -- only last survivor |
| Negative coordinates | `[-2, 2]` | Correct distance | Yes -- squaring removes sign |
| Equidistant points | Same `dis` value | Any valid k | Yes -- Python compares `[x,y]` lists lexicographically, no crash |

### ✅ Complexity Confirmed

- Time: O(n log k) -- each of n points triggers at most one push and one pop, each O(log k)
- Space: O(k) -- heap bounded to k entries

---

## ⚡ Step 6 -- Optimize

BTTC for this problem: O(n) average -- any algorithm must examine every point at least once since input is unsorted and any point could be in the top k. The theoretical floor is O(n).

Can we hit O(n)? Yes -- with **QuickSelect** (based on QuickSort's partition):
- Pick a pivot, partition: points closer than pivot | points farther
- Ask: "Are all k closest on the left side?" -- recurse only that side
- Average case: O(n). Worst case: O(n^2).

| Algorithm | Time | Guarantee |
|---|---|---|
| Sort all | O(n log n) | guaranteed |
| Heap of size k (this solution) | O(n log k) | guaranteed |
| QuickSelect | O(n) average | not guaranteed (O(n^2) worst case) |

**Decision:** Heap solution is the correct interview answer. QuickSelect is the impressive bonus if asked to optimize further. Current solution is not at BTTC, but the guaranteed O(n log k) is the right trade-off for interview reliability.

---

## 🐛 Bugs & Mistakes

### 🧠 Conceptual Mistakes

None this session ✅ — the heap approach was derived independently via First Principles and was conceptually correct from the start.

### 🔧 Implementation Mistakes

**1. `x` and `y` undefined in the loop**

```python
# WRONG — `point` binds to whole sublist [x, y], x and y never exist
for point in points:
    dis = -(x*x + y*y)   # NameError: x is not defined

# CORRECT — destructure on the loop header itself
for [x, y] in points:
    dis = -(x*x + y*y)
```

- **Why:** Iterating over `[[x,y], ...]` gives whole sublists, not the elements
- **How it was caught:** `NameError` on the first iteration
- **Rule to prevent:** When iterating over a list of pairs, ALWAYS destructure in the loop header — `for [x, y] in points`, never `for point in points` when you need both elements by name

**2. `heappush` argument order reversed**

```python
# WRONG attempt 1 — args reversed AND missing closing paren
heapq.heappush((dis, [x,y], maxheap)

# WRONG attempt 2 — paren fixed but order still wrong
heapq.heappush((dis, [x,y]), maxheap)

# CORRECT — heap is ALWAYS the first argument
heapq.heappush(maxheap, (dis, [x,y]))
```

- **Why:** Mirrored the mental model "push (item) onto (heap)" instead of actual signature `heappush(heap, item)`
- **How it was caught:** Two wrong attempts (~2-3 min lost) before landing on correct form
- **Rule to prevent:** Memorize as mantra — *"heap first, item second"*. Same pattern as `list.append(item)`: container always comes first

**3. `return` statement inside the `for` loop**

```python
# WRONG — return indented inside loop, fires after first point
for [x, y] in points:
    ...
    return [[x,y] for ...]   # ← processes only 1 point, silent wrong answer

# CORRECT — return dedented to function scope
for [x, y] in points:
    ...
return [[x,y] for ...]
```

- **Why:** `rush` — indentation error from copying mental structure without counting levels
- **How it was caught:** Silent wrong answer (no crash) — hardest category of bug to catch
- **Rule to prevent:** After writing any `return` statement, ask: *"Is this inside or outside the loop?"* — visually align `for` keyword and `return` keyword to confirm scope

### ⏱️ Time Management Mistakes

None this session ✅ — completed in exactly 25 min (at target).

### 📊 Mistake Summary

| Pillar | Count | Most Costly | Pattern Emerging? |
|--------|-------|-------------|-------------------|
| 🧠 Conceptual | 0 | — | First Principles path = clean reasoning |
| 🔧 Implementation | 3 | Bug 3 — silent wrong answer | All 3 bugs are syntax/scope — not algorithmic. Drill Python heap API + indentation discipline |
| ⏱️ Time Management | 0 | — | Hit 25-min target exactly |

---

## 💡 Discoveries

### 🔒 Core Invariant / Rule

**The heap is a bouncer of size k.** Every point tries to enter. If the heap exceeds k, the farthest point (the "worst" candidate) is immediately evicted. After all n points have been processed, only the k closest remain -- because every time someone "better" arrived, someone "worse" was thrown out.

Negation is what makes this work in Python: flip the score so the farthest point (highest real distance) has the lowest stored value and gets popped by Python's min-heap naturally.

### ⚡ Aha Moments

**💡 1. Strip the story -- the abstract shape unlocks the pattern**
- **Before:** Saw a geometry problem about Euclidean distance
- **Trigger:** Being pushed to restate in pure math terms -- "n items with scores, return k smallest"
- **After:** Pattern becomes immediately obvious once geometry is removed. The story hides the structure.

**💡 2. Gate 2 must explain WHY, not just name the pattern**
- **Before:** "Top K uses a heap because Top K uses a heap" -- circular, no insight
- **Trigger:** Hadriel's push: "What does a heap give you that sorting all n doesn't?"
- **After:** "Heap of size k processes each point in O(log k) -- you never need to sort all n items. O(n log k) vs O(n log n) -- that's the advantage."

**💡 3. Negate to simulate a max-heap in Python**
- **Before:** Unsure how to evict the FARTHEST point using Python's min-heap
- **Trigger:** Tracing manually: "If I store -10 and -8, which gets popped?" -- -10 pops, corresponds to distance 10, which IS the farthest
- **After:** Universal Python pattern -- negate any score you want to evict the largest of. `dis = -(x^2 + y^2)`.

**💡 4. Push tuple, not just the score**
- **Before:** Only thought about storing the distance
- **Trigger:** "What does the problem ask you to RETURN?"
- **After:** Must push `(dis, [x, y])` -- the key sorts the heap, the value is what you return. Always push full data, not just the key.

**💡 5. Python list comparison in heaps**
- **Before:** Assumed equal distances would cause a crash or error
- **After:** When two tuples have equal first elements, Python compares the second element. Lists compare lexicographically: `[1,0] vs [0,1]` compares element by element. No crash. For K Closest, any valid k points are acceptable on ties.

### 🎨 Key Metaphors & Examples

- **The Bouncer:** Heap is a club with exactly k VIP spots. Every point tries to enter. If the club is full, the person standing farthest from the door (farthest from origin) gets kicked out. After everyone has tried, the k people remaining ARE the k closest.
- **Negation trick as a disguise:** Turn the largest number into the smallest so Python's min-heap "sees" it as the most urgent to evict. A score of 10 becomes -10 -- the min-heap pops the most negative first, which corresponds to the largest original distance.

---

## 📊 Final Complexity

| | Complexity | Reason |
|--|-----------|--------|
| ⏱️ Time | O(n log k) | Touch every n point; each heappush/heappop = O(log k). k <= n so this is better than O(n log n). |
| 📦 Space | O(k) | Heap holds at most k tuples at any time -- enforced by the pop when size exceeds k. |
| 🎯 BTTC | O(n) average | Must examine every point at least once (unsorted input). QuickSelect achieves O(n) average; heap is O(n log k) with a stronger guarantee. |

---

## 🪞 Self-Assessment

- **💪 Confidence:** 4/5 -- Rules Discovered path was clean. Bugs were all caught in verify. Negate trick and tuple structure feel solid.
- **🔄 Revisit:** QuickSelect implementation (not required for interview, but worth knowing). Brute force mention discipline -- must become habit before coding, not an afterthought.
- **📈 Pattern Mastery Impact:** First Top K problem. Established the core template: max-heap of size k + negate for Python + push tuple not just score. Foundation for all Top K variants.

---

## 🔗 Similar Problems (max 3)

- **Top K Frequent Elements (#347)** -- same max-heap of size k pattern; frequency replaces Euclidean distance as the score
- **K Largest Elements in Array (#215)** -- same pattern; value itself is the score, simpler setup
- **Find K Pairs with Smallest Sums (#373)** -- harder variant; min-heap with pair sums, same "push tuple" principle

---

*🔥 Hadriel x Wiganz -- 2026-05-04*
*"Those who hope in the Lord will renew their strength." -- Isaiah 40:31 ✝️*
