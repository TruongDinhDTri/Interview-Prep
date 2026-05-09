# K Closest Points to Origin — Complete Session Archive

**Pattern:** Top K Elements (Heap) | **Difficulty:** Medium | **LeetCode:** #973 | **Date:** 2026-05-04
**Path Taken:** First Principles (Gate 3 failed — first time solving Top K) | **Time Used:** 25 min (overtime — solve completed)

---

## 🗺️ The Journey — How Understanding Built

Recognized the Top K pattern at Step 2 (Gates 1 & 2 passed), but failed Gate 3 (never solved a Top K problem before) → forced into First Principles path. Through manual visualization and Rules Discovered, confirmed the heap approach independently. Hit 3 bugs during coding — all fixed in Step 5 scan. Discovered Python's list lexicographic comparison as an edge case. Missed brute force mention in Discuss (flagged). Unlocked the O(n) floor / QuickSelect insight in Teaching Mode.

---

## 🎯 Step 1 — Understand

### Problem Statement
```
Given an array of points where points[i] = [xi, yi] and an integer k,
return the k closest points to the origin (0, 0).
Distance = √(x² + y²)
```

### Distance Formula Discovery
Wiganz initially gave the general Euclidean formula: `√((x1-x2)² + (y1-y2)²)`

Hadriel: *"One of those points is always fixed — what is it fixed to?"*
Answer: `(0, 0)` → simplifies to `√(x² + y²)` → for comparison, just `x² + y²` suffices.

### Abstract (Story Stripped)
> **"Given n items each with a computed score — return the k items with the smallest scores."**

This took multiple iterations:
1. "Given an array of points, calculate the distance between each point to 0,0 and return k closest" → still has geometry
2. "Given an array of items. Calculate the score of each item. Return K smallest" → ✅ fully abstract

### Constraint Questions Asked (9/9)

| Question | Answer |
|---|---|
| Sorted? | No |
| Negative values? | Yes — coordinates can be negative |
| Duplicates? | Yes — two points can share same coordinates |
| Empty input? | No — at least k points exist |
| Modify input? | Yes |
| Expected input size? | 1 ≤ k ≤ points.length ≤ 10⁴ |
| Return what? | The k closest points as `[[x,y],...]` — order doesn't matter |
| How stored? | Array of `[x, y]` pairs |
| One valid answer? | Yes |

**Bonus edge case identified:** k = n → return all points (no selection needed). Not a 10th question — an edge case for Step 5.

### Trace — Example

```
points = [[1,3], [-2,2]],  k = 1
```

| Point | Distance² | Score |
|---|---|---|
| [1,3] | 1² + 3² | 10 |
| [-2,2] | (-2)² + 2² | 8 |

k = 1 → return the 1 point with **smallest** score → `[[-2,2]]`

**⚠️ Mistake Made:** Wiganz initially said `return [[1,3]]` — confused "closest" with "largest distance." Caught through Socratic questioning: *"Which score is smaller?"*

---

## 🔑 Rules Discovered — 3F Technique B

These rules came from manually tracing through the algorithm. They ARE the blueprint for the code.

```
Rule 1: Maintain a max-heap of size k.
        If heap size > k → pop the largest (farthest point gets evicted).
        What remains after all n points = the k closest.

Rule 2: Python only has min-heap (heapq).
        Negate the distance to simulate a max-heap:
        dis = -(x² + y²)
        Most negative value = largest distance = gets popped first. ✅

Rule 3: Push a tuple (-distance, x, y) into the heap — not just the distance.
        The problem asks to RETURN the actual points, not just the distances.
```

**Why Rule 2 works:**
- Distance 10 → stored as -10
- Distance 8 → stored as -8
- Python's heapq pops the SMALLEST value → -10 is smaller → farthest point evicted ✅

---

## 🔵 Step 2 — Approach

### 3-Gate Check

```
3-Gate Check:
☑ Gate 1: Abstract shape matches? → YES — "n items, return k smallest" = Top K Elements
☑ Gate 2: Name it AND explain WHY? → YES — heap of size k = O(n log k) vs sort O(n log n)
✗ Gate 3: Solved something like this before? → NO — first Top K problem

→ Decision: FIRST PRINCIPLES PATH (3F)
```

### Gate 2 Full Sentence (earned through iteration)

First attempt (circular):
> "Top K uses a heap because Top K uses a heap" ❌

Hadriel pushed: *"What does a heap give you that sorting all n doesn't?"*
Answer evolved to:

> "I see n items, return k smallest which tells me Top K Elements because Top K allows me to use a heap of size K and the time would be O(n log k) instead of sorting O(n log n)" ✅

The key insight: **you never need to sort all n items** — maintaining k candidates is enough.

---

## 🗣️ Step 3 — Discuss

**Named approach:** Max-heap of size k with negated distances

**Numbered steps:**
1. Initialize `maxheap = []`
2. Calculate distance: `dis = -(x*x + y*y)` (negated for max-heap simulation)
3. Push `(dis, x, y)` tuple onto heap
4. If `len(maxheap) > k` → pop (evicts the farthest point)
5. Return all points from the heap

**Complexity:**
- Time: `O(n log k)` — n points, each heap op = O(log k)
- Space: `O(k)` — heap holds at most k points

**Green light asked ✅**

**⚠️ Missed:** Brute force mention.
In a real interview, even 10 seconds of *"brute force would be sort everything in O(n log n), but we can do better with a heap"* earns Problem Solving points. Never skip the brute force mention even when you know the optimal answer.

---

## ⌨️ Step 4 — Code: Blueprint → Implementation

### Blueprint (Spoken → Written → Code)

```python
class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        # 2.1 Initialize the heap
        # 2.2 Calculate the distance with -(x*x + y*y)
        # 2.3 Add the point and distance to maxheap
        # 2.4 If bigger than size k → pop
        # 2.5 Return the points from the heap
```

### Bugs Encountered

**Bug 1 — `x` and `y` undefined**

```python
# ❌ Wrong
for point in points:
    dis = -(x*x + y*y)   # x and y never defined!

# ✅ Fixed
for [x, y] in points:
    dis = -(x*x + y*y)
```

**Bug 2 — `heappush` argument order wrong + syntax error**

```python
# ❌ Wrong (argument order reversed + missing paren)
heapq.heappush((dis, [x,y], maxheap)

# ❌ Still wrong (order still reversed)
heapq.heappush((dis, [x,y]), maxheap)

# ✅ Fixed — heap first, item second
heapq.heappush(maxheap, (dis, [x,y]))
```

`heapq.heappush(heap, item)` — the heap is always the first argument.

**Bug 3 — `return` inside the for loop**

```python
# ❌ Wrong — returns after processing first point only!
for [x, y] in points:
    ...
    return [[x,y] for ...]   # ← inside the loop

# ✅ Fixed — return AFTER the loop completes
for [x, y] in points:
    ...
return [[x,y] for ...]       # ← outside the loop
```

---

## ✅ Final Correct Code

```python
import heapq

class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        # 2.1 Initialize the heap
        maxheap = []
        # 2.2 Calculate the distance with -(x*x + y*y)
        for [x, y] in points:
            dis = -(x*x + y*y)
            # 2.3 Add the point and distance to maxheap
            heapq.heappush(maxheap, (dis, [x, y]))
            # 2.4 If bigger than size k → pop
            if len(maxheap) > k:
                heapq.heappop(maxheap)
        # 2.5 Return the points from the heap
        return [[x, y] for (_, [x, y]) in maxheap]
```

---

## 🧪 Step 5 — Verify

### Trace

```
points = [[1,3], [-2,2]],  k = 1
```

| Step | Action | maxheap after |
|---|---|---|
| Init | `maxheap = []` | `[]` |
| Point [1,3] | push `(-10, [1,3])` | `[(-10, [1,3])]` |
| Size check | len=1, not > 1 | no pop |
| Point [-2,2] | push `(-8, [-2,2])` | `[(-10, [1,3]), (-8, [-2,2])]` |
| Size check | len=2 > k=1 → pop | pops `-10` (most negative = farthest) |
| After pop | `[(-8, [-2,2])]` | |
| Return | `[[-2,2]]` | ✅ |

**Why `-10` gets popped:** Python's min-heap pops the SMALLEST value. `-10 < -8`, so `-10` pops first. `-10` corresponds to distance 10 = the FARTHEST point. Farthest evicted → only closest remains. ✅

### Edge Cases

| Edge Case | What Happens |
|---|---|
| `k = n` | All points pushed, none popped (size never exceeds k) → all points returned |
| `k = 1` | Only the single closest point remains after all pops |
| Negative coordinates | `(-2)² = 4` — squaring removes the sign. Formula still correct. |
| Equidistant points | `dis` values equal → Python compares `[x,y]` lists lexicographically (element by element). No crash. Any valid k points accepted. |

### Complexity

| | Complexity | Reason |
|---|---|---|
| Time | O(n log k) | Touch every n point; each heap push/pop = O(log k) |
| Space | O(k) | Heap holds at most k points at any time |

---

## 💡 Key Insights & Aha Moments

### 1. The Abstract Shape Unlocks the Pattern
> "n items with scores → return k smallest"

Once you strip the geometry, the pattern is obvious. "Points" and "Euclidean distance" hide what this problem is really asking. Strip the story first.

### 2. The Negate Trick — Max-Heap in Python
Python only has `heapq` (min-heap). To simulate a max-heap:
```python
dis = -(x*x + y*y)   # negate the score
heapq.heappush(heap, dis)
heapq.heappop(heap)  # pops the most negative = largest original distance
```
This is a universal Python pattern for Top K problems where you want to evict the LARGEST.

### 3. Push Tuple, Not Just Score
```python
heapq.heappush(maxheap, (dis, [x, y]))  # ✅ need the point to return it
heapq.heappush(maxheap, dis)             # ❌ loses the original point
```
The problem asks to return the actual points — always push the full data, not just the key.

### 4. Python List Comparison in Heaps
When two tuples have equal first elements (`dis` values), Python compares the second element. Lists compare lexicographically:
- `[1, 0] vs [0, 1]` → compare first elements: 1 vs 0 → `[1,0] > [0,1]`
- No crash — Python handles it gracefully
- For K Closest, any valid k points are accepted for ties, so this is fine.

### 5. The O(n) Floor — QuickSelect
**Why O(n) is the theoretical floor:**
Any algorithm MUST examine every point at least once (input is unsorted, any point could be in the k closest). So minimum work = O(n).

**Can we actually hit O(n)?** YES — with **QuickSelect**:
- Based on QuickSort's partition step
- Pick a pivot, partition array: points closer than pivot | points farther
- Ask: "Are all k closest on the left?" → recurse only that side
- Average case: O(n). Worst case: O(n²).

| Algorithm | Time | Guarantee |
|---|---|---|
| Sort all | O(n log n) | guaranteed |
| **Heap (this solution)** | **O(n log k)** | **guaranteed** |
| QuickSelect | O(n) avg | not guaranteed (O(n²) worst) |

**In interview:** Heap solution is the right answer. QuickSelect is the impressive bonus.

---

## ⚠️ Common Mistakes to Avoid

1. **Confusing "k closest" with "k largest scores"** — closest = SMALLEST distance, not largest
2. **heapq.heappush argument order** — always `(heap, item)`, never `(item, heap)`
3. **return inside the for loop** — you process all n points first, THEN return
4. **Pushing only the score** — you lose the original point; push `(score, point)` tuple
5. **Skipping brute force mention** — always say "sort would be O(n log n), but..." even 10 seconds earns points
6. **Gate 2 circular reasoning** — don't say "Top K because Top K"; say WHY (O(n log k) efficiency)

---

## 🔄 Decision Points to Remember

1. **Gate 3 failed → First Principles** — even when you recognize the pattern, Gate 3 (prior experience) determines the path. The First Principles exploration confirmed the same heap approach independently.
2. **Max-heap of size k chosen** — not min-heap of all n; size k keeps space O(k) not O(n)
3. **Negation trick** — Python-specific. In Java/C++ you'd use a comparator directly.
4. **Tuple structure** — `(dis, [x,y])` stores both key and value. The key sorts; the value returns.

---

## 📊 Final Complexity

| | Complexity | Reason |
|---|---|---|
| Time | O(n log k) | n points × O(log k) per heap operation |
| Space | O(k) | heap holds at most k points |
| BTTC | O(n) avg | QuickSelect achieves this — heap is O(n log k) |

---

## 🔗 Similar Problems

- **Top K Frequent Elements (#347)** — same max-heap of size k pattern, frequency as score
- **K Largest Elements in Array (#215)** — same pattern, simpler scoring (value itself)
- **Find K Pairs with Smallest Sums (#373)** — harder variant, min-heap with pair sums
- **K Closest Points (QuickSelect version)** — O(n) average, same problem different algorithm
