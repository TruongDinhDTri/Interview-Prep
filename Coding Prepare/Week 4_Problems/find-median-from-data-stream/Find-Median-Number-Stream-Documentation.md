# Find the Median of a Number Stream

**Pattern:** Two Heaps (Median Maintenance)
**Difficulty:** Medium
**Source:** Current conversation session

---

## 1. Problem Explanation

**What it asks:**
Design a data structure that accepts numbers one at a time and can return the median at any point.

Two methods:
- `insertNum(num)` — store a new number
- `findMedian()` — return the current median of all stored numbers

**Inputs:** Integers arriving one by one (a stream)
**Outputs:** The median, as a float

**What "median" actually means:**
- Odd count of numbers → the single middle number
- Even count → the **average** of the two middle numbers

**Common trap:** The median does NOT have to be a number that exists in the stream. Example: `[1, 2, 3, 5, 8, 9]` → median = (3+5)/2 = **4**. There is no 4 in the data. The median is a *position* concept (where is the middle?), not a *value* concept (which number is in the middle?). This is why the return type is float.

---

## 2. Phase Analysis (Full Thinking Log)

> This is a replay of what actually happened during the solving session — including confusion, wrong assumptions, and the moments things clicked.

### Phase 1 — Learning the Concept (Before Any Code)

The session started with a request to understand the Two Heaps pattern from scratch. The initial explanation covered:
- Two buckets (Left = smaller half, Right = larger half)
- Two invariants (order and balance)
- When to use it (stream + median)

**What didn't work:** Abstract language. Phrases like *"the roots stop being the median"* and *"it's the one that belongs on the other side"* caused confusion. Rules stated without grounding don't land.

**What worked:** Shifting to concrete number examples. Showing sorted lists split in half. Pointing at specific positions. Proving by elimination which number can move. The concept clicked when it became visual and position-based.

---

### Phase 2 — Three Confusions That Had to Be Resolved

#### Confusion 1: "Why is the median between the two roots?"

**What was asked:** If we have Left and Right buckets, why does the median sit between their roots?

**How it was resolved:** By showing the sorted list split exactly in half:
```
Sorted: [1, 2, 3, 5, 8, 9]

Left half     Right half
[1, 2, 3]    [5, 8, 9]
      ↑        ↑
   biggest   smallest
   in Left   in Right
      └──── median lives here ────┘
```
The two numbers at the cut ARE the biggest-in-Left and smallest-in-Right. Those are the roots. So the median is between them — by definition of where the cut is.

#### Confusion 2: "Why is the extra element in Left the median?" (asked twice)

**What was asked:** When Left has one extra element, why is Left's root the median?

**First attempt (didn't click):** Explained that "Left covers up to and including the middle." Too abstract.

**Second attempt (clicked):** Showed positions explicitly:
```
5 numbers:  [1, 2, 3, 4, 5]
             1   2   3   4   5   ← positions

Middle = position 3 = value 3

Split: Left covers positions 1, 2, 3
       Right covers positions 4, 5

Left = [1, 2, 3]  →  the LAST number in Left (3) IS the middle
                      the LAST number is the BIGGEST
                      the BIGGEST is the root
```
Key insight: Left always covers from the start **up to and including the middle**. The middle is the last (biggest) number in Left. The biggest is the root. So root = middle = median.

#### Confusion 3: "The median doesn't exist in the stream?"

**What was asked:** For `[1, 2, 3, 5, 8, 9]`, the median is 4. But 4 doesn't exist in the data. Is that correct?

**How it was resolved:** Yes, 4 is correct. Median is a statistical measure — the balance point — not necessarily a data point. Simple example: two test scores, 60 and 80. Neither person scored 70. The median is still 70. For even counts, the median is always the average of the two middle numbers, and that average may not exist in the stream. This is why the return type is `float`.

---

### Phase 3 — Manual Tracing (Before Writing Code)

The learner traced through the problem's example step by step, answering questions independently at each stage:

```
Start:        Left=[]         Right=[]

insertNum(3): Left is empty → goes Left
              Left=[3]        Right=[]

insertNum(1): 1 ≤ 3 → goes Left.  Left=[1,3], Right=[]
              Left too big (2 vs 0) → move 3 to Right
              Left=[1]        Right=[3]

findMedian(): Equal size → (1 + 3) / 2 = 2.0  ✓

insertNum(5): 5 > 1 → goes Right. Left=[1], Right=[3,5]
              Right too big (1 vs 2) → move 3 to Left
              Left=[1,3]      Right=[5]

findMedian(): Left has extra → 3.0  ✓

insertNum(4): 4 > 3 → goes Right. Balanced (2 vs 2).
              Left=[1,3]      Right=[4,5]

findMedian(): Equal size → (3 + 4) / 2 = 3.5  ✓
```

Every step was worked out by the learner independently. No answers were given until the learner attempted first. The learner also correctly predicted where numbers go and when rebalancing happens by the end of the trace.

---

### Phase 4 — Writing the Code

The learner wrote the full solution independently. The **overall structure was correct on the first attempt** — the class setup, the routing logic, the rebalance conditions, and the findMedian logic were all conceptually right. The bugs were syntax and implementation level, not logic level (see Section 5).

One sub-session was spent on `if` vs `elif` vs `else` — the learner didn't initially understand why two `if` statements caused a double-push. This was resolved by showing both branches executing for the same input.

---

## 3. Step-by-Step Guidance (How to Think)

### Recognizing the Pattern
- **Signal:** "stream" or "dynamic" + "median" or "middle"
- **Ask yourself:** "Do I need the whole sorted list, or just the middle?"
- If just the middle → Two Heaps.

### Setting Up
- Left bucket = max-heap (smaller half). In Python: negate values, use `heapq` (min-heap).
- Right bucket = min-heap (larger half). Use `heapq` as-is.
- You only ever need to see the **root** of each heap. That's the whole point.

### When a Number Arrives — 3 Steps, In This Order

**Step 1 — Route it:**
- Left is empty? → push to Left (default, no comparison possible)
- `num ≤ Left root`? → push to Left
- `num > Left root`? → push to Right

**Why handle empty first?** If Left is empty, there's no root to compare against. Must handle that case before the comparison.

**Step 2 — Rebalance:**
- Left has 2+ more than Right? → move Left's root to Right
- Right has more than Left? → move Right's root to Left

**Why move the root specifically?** The root is the number closest to the boundary. It's the only number from one side that can go to the other without breaking the order rule (Left ≤ Right). This was proven during the session by elimination: trying to move any other number from `Left=[1,2,3,5]` to `Right=[8,9]` breaks the order. Only 5 (the root) works.

**Step 3 — Read the median:**
- Equal sizes → `(Left root + Right root) / 2`
- Left has +1 → `Left root`

**Why Left gets the extra:** It's a design choice. We could give Right the extra instead — then we'd read Right's root for odd counts. We chose Left. Be consistent. The important thing is the rule stays the same every time.

### Why This Order Matters (Route → Rebalance → Read)
- You must **insert before rebalancing** — the number needs to be in a heap to potentially move.
- You must **rebalance before reading** — if sizes are off, the roots aren't the middle numbers anymore.

---

## 4. Final Solution

```python
from heapq import *

class Solution:
    def __init__(self):
        self.left  = []   # max-heap (negated values)
        self.right = []   # min-heap

    def insertNum(self, num):
        # ① route to the right bucket
        if self.left == []:
            heappush(self.left, -num)
        elif num <= -self.left[0]:
            heappush(self.left, -num)
        else:
            heappush(self.right, num)

        # ② rebalance sizes
        if len(self.left) - len(self.right) > 1:
            heappush(self.right, -heappop(self.left))
        elif len(self.left) < len(self.right):
            heappush(self.left, -heappop(self.right))

    def findMedian(self):
        # ③ read the median
        if len(self.right) == len(self.left):
            return ((-self.left[0]) + (self.right[0])) / 2
        return -self.left[0] / 1.0
```

**Time Complexity:**
- `insertNum`: O(log n) — at most 2 heap operations (one push + one rebalance pop/push)
- `findMedian`: O(1) — just reading the roots

**Space Complexity:** O(n) — all numbers stored across both heaps

> Note: Time and space complexity were not actively discussed during the solving session. Added here for completeness.

---

## 5. Errors, Misunderstandings & Mistakes

### Error 1 — `self = self`
- **What:** Wrote `self = self` in `__init__`
- **Why:** Unclear. Possibly a habit or misunderstanding of how `self` works.
- **Rule:** `self` is passed automatically by Python. You use it to set attributes (`self.x = value`). Never assign it to itself.

### Error 2 — `heapq.push(...)` — function doesn't exist
- **What:** Wrote `heapq.push(...)` throughout the code
- **Why:** Confused the module name (`heapq`) with the function name. The function is `heappush`, not `push`.
- **Rule:** `from heapq import *` → use `heappush()` directly. `import heapq` → use `heapq.heappush()`. There is **no** `heapq.push`.

### Error 3 — `heapqpush` — words smashed together
- **What:** When told to fix `heapq.push`, removed the dot but left `heapq` attached → `heapqpush`
- **Why:** Misread the correction. Thought removing the dot was enough. Didn't realize the whole `heapq.` prefix needed to go.
- **Rule:** The function name is `heap` + `push` = `heappush`. Two p's. Spell it out: `h-e-a-p-p-u-s-h`.

### Error 4 — Missing negation on the first push
- **What:** In the `if self.left == []` branch, wrote `heappush(self.left, num)` instead of `heappush(self.left, -num)`
- **Why:** The empty-left case was handled as a separate branch, and the negation rule was forgotten for that specific branch.
- **Rule:** Left is **always** a max-heap. Every single push to Left must negate. No exceptions — including the very first number.

### Error 5 — `if` instead of `elif` (double push bug)
- **What:** The empty-left check and the comparison check were both `if` statements. When the first number arrived, it got pushed to Left by the first `if`, then the second `if` also executed and pushed it again.
- **Why:** Didn't realize that after the first `if` ran, execution continued to the second `if`. Both checked independently. Both were true. Double push.
- **Rule:** Ask yourself: "Are these choices mutually exclusive? Can a number only go to one place?" If yes → use `elif`. The `if`/`elif`/`else` chain guarantees exactly one branch runs.

### Misunderstanding 1 — "The median must be a number in the stream"
- **What:** Questioned whether median = 4 is valid for `[1, 2, 3, 5, 8, 9]` since 4 doesn't exist in the data
- **Why:** Natural assumption — the median "should" be one of the actual numbers
- **Correction:** Median is a position concept. For even counts, it's the average of the two middle numbers. That average may not exist in the data. The return type is `float` precisely because of this.

### Misunderstanding 2 — "Why is the extra in Left the median?"
- **What:** Didn't understand why Left root = median when Left has one extra element
- **Why:** The connection between "Left covers positions up to the middle" and "the middle is the root" was not obvious from abstract descriptions
- **Correction:** Think in positions. Left covers the first half + the middle. The middle is the last number in Left. The last number is the biggest. The biggest is the root. So: root = middle = median.

---

## Pattern & Related Problems

**Pattern:** Two Heaps (Median Maintenance)

**When to use:** Any problem where you need the median (or a middle value) from a dynamically changing dataset. Signal words: *stream*, *dynamic*, *median*, *middle*.

**Related problems:**
- Sliding Window Median
- K-th Largest Element in a Stream
- Find the Smallest Number Greater Than or Equal to Target

> **Note:** Alternative approaches (sorted list with binary search, order-statistic trees) were not discussed during the session.
