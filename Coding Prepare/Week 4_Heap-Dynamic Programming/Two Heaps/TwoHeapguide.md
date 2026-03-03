# Two Heaps Pattern — Complete Guide

> Use this guide anytime you look at a problem and wonder: "Is this Two Heaps?"
> Covers: what it is → why it works → the 3 steps → how to recognize it → the code → common traps.

---

## 1. The One Question This Pattern Answers

> **"Numbers keep arriving one by one. At any point, someone asks: what's the median right now? How do I answer that without sorting every time?"**

Two Heaps is the answer. Everything below is just explaining why.

---

## 2. The Mental Model — Two Buckets

Forget "heaps" for a second. Think about this first:

You have numbers. You split them into **two buckets**. One rule:

```
Everything in Left is SMALLER than everything in Right.

    Left bucket          Right bucket
    (small numbers)      (big numbers)
    [1, 2, 3]           [5, 8, 9]
```

Now — you don't care about the order inside each bucket. You only care about **one number from each**:

```
    Left  → the BIGGEST number in it    →  3
    Right → the SMALLEST number in it   →  5
                                            ↑↑
                        median lives between these two
```

That's the whole idea. Two buckets. Track one number from each. Median is right there.

---

## 3. So What Are the Heaps?

A heap is just a data structure that keeps the one number you care about **at the top — instantly**.

```
    Left bucket  → Max-Heap  → root always shows the BIGGEST   →  3
    Right bucket → Min-Heap  → root always shows the SMALLEST  →  5
```

That's why two heaps. Not because heaps are magic. Because you need **two specific numbers fast**, and each heap gives you one of them in O(1).

### The Layout

```
┌─────────────────────────────────────────────────┐
│              Two Heaps Layout                    │
│                                                 │
│   Max-Heap (Left)        Min-Heap (Right)       │
│   smaller half           larger half            │
│                                                 │
│        [5]                   [8]                │
│       /   \                 /   \               │
│     [3]   [4]            [9]   [12]             │
│    /                                            │
│  [1]                                            │
│                                                 │
│   Root = 5 ←── boundary ──→ Root = 8            │
│      (max of left)      (min of right)          │
└─────────────────────────────────────────────────┘
```

---

## 4. The Two Rules (Invariants)

After EVERY insert, these must stay true:

```
    Rule 1 — ORDER:   Left root  ≤  Right root
                      (nothing on Left is bigger than anything on Right)

    Rule 2 — SIZE:    |Left| == |Right|
                      OR
                      |Left| == |Right| + 1    (Left can have ONE extra)
```

If either rule breaks → rebalance by moving a root. That's the only active logic in the whole pattern.

---

## 5. The 3 Steps — Every Time a Number Arrives

```
┌─────────────────────────────────────────────┐
│  NUMBER ARRIVES                             │
│                                             │
│  1. ROUTE — Put it in the right bucket      │
│     Left is empty?   →  goes Left           │
│     num ≤ Left root  →  goes Left           │
│     num >  Left root →  goes Right          │
│                                             │
│  2. REBALANCE — Fix the sizes               │
│     Left has 2+ more than Right?            │
│       → move Left root to Right             │
│     Right has more than Left?               │
│       → move Right root to Left             │
│                                             │
│  3. READ — Get the median                   │
│     Equal size  →  (Left root + Right root) / 2 │
│     Left is +1  →  Left root                │
└─────────────────────────────────────────────┘
```

### Why This Order Matters

- Must **insert before rebalancing** — the number needs to be in a heap to potentially move.
- Must **rebalance before reading** — if sizes are off, the roots aren't the middle numbers anymore.

---

## 6. Deep Dive: WHY Do We Rebalance?

Watch what happens if we **don't** rebalance:

```
    Left=[1,2,3,5]   Right=[8,9]       ← Left has 4, Right has 2
    Left root = 5,   Right root = 8

    We'd say: median = (5+8)/2 = 6.5

    But sorted list is [1, 2, 3, 5, 8, 9]
    Real median = (3+5)/2 = 4

    ❌ We got 6.5
    ✅ Should be 4
```

The cut drifted away from the middle. The "biggest in Left" is no longer near the center — it's too far right. So the roots stopped being the two middle numbers.

Fix it — move 5 over:

```
    Left=[1,2,3]   Right=[5,8,9]      ← equal, cut is back in the middle
    Left root = 3, Right root = 5

    Median = (3+5)/2 = 4  ✅
```

**The size rule exists for one reason only: to keep the cut in the middle.**

---

## 7. Deep Dive: WHY Do We Always Move the Root?

Left is too big. We need to move one number from Left to Right. Which one? Let's try them all:

```
    Left=[1, 2, 3, 5]   Right=[8, 9]
    Rule: everything in Left must be SMALLER than everything in Right

    Move 1?  →  Left=[2,3,5]   Right=[1, 8, 9]
               1 is sitting in Right with 8 and 9
               but 1 is NOT bigger than them
               ❌ breaks the rule

    Move 2?  →  Left=[1,3,5]   Right=[2, 8, 9]
               same problem. 2 doesn't belong with 8 and 9
               ❌ breaks the rule

    Move 3?  →  Left=[1,2,5]   Right=[3, 8, 9]
               3 < 8 and 3 < 9, order is fine
               BUT Left root is now 5, Right root is 3
               5 > 3 ← Left has a bigger number than Right
               ❌ breaks the rule

    Move 5?  →  Left=[1,2,3]   Right=[5, 8, 9]
               5 < 8 and 5 < 9  ✅
               Left root=3, Right root=5, and 3 < 5  ✅
               Everything works  ✅
```

**5 is the only number that can move.** It's the biggest in Left — the number closest to the boundary. It's the only one that fits into Right without breaking anything.

**That's why we use a max-heap on the left** — not just to show us the biggest number, but so we can grab it and move it in O(1) when we rebalance.

---

## 8. Live Trace — Watch It Happen

Stream: **5, 2, 8, 1, 9**

```
Start: Left=[]  Right=[]

① 5 arrives
   Left is empty → goes Left
   Left=[5]  Right=[]
   Median = 5

② 2 arrives  →  2 ≤ 5, goes Left
   Left=[2,5]  Right=[]
   ❗ Left is too big → move biggest (5) to Right
   Left=[2]  Right=[5]
   Median = (2+5)/2 = 3.5

③ 8 arrives  →  8 > 2, goes Right
   Left=[2]  Right=[5,8]
   ❗ Right is bigger → move smallest (5) to Left
   Left=[2,5]  Right=[8]
   Median = 5  (Left has extra → Left root)

④ 1 arrives  →  1 ≤ 5, goes Left
   Left=[1,2,5]  Right=[8]
   ❗ Left is too big → move biggest (5) to Right
   Left=[1,2]  Right=[5,8]
   Median = (2+5)/2 = 3.5

⑤ 9 arrives  →  9 > 2, goes Right
   Left=[1,2]  Right=[5,8,9]
   ❗ Right is bigger → move smallest (5) to Left
   Left=[1,2,5]  Right=[8,9]
   Median = 5  (Left has extra → Left root)
```

**Notice:** 5 keeps bouncing between buckets. That's not a bug — that's the rebalance working. The number closest to the median gets shuttled back and forth as new data comes in. It's always the root that moves because it's always the one closest to the boundary.

---

## 9. The Problem Trace (Find Median from Data Stream)

```
insertNum(3)  →  Left is empty → goes Left
                 Left=[3]         Right=[]

insertNum(1)  →  1 ≤ 3 → goes Left
                 Left=[1,3]       Right=[]
                 ❗ Left too big → move 3 to Right
                 Left=[1]         Right=[3]

findMedian()  →  Equal size → (1+3)/2 = 2.0  ✅

insertNum(5)  →  5 > 1 → goes Right
                 Left=[1]         Right=[3,5]
                 ❗ Right bigger → move 3 to Left
                 Left=[1,3]       Right=[5]

findMedian()  →  Left has extra → root = 3.0  ✅

insertNum(4)  →  4 > 3 → goes Right
                 Left=[1,3]       Right=[4,5]
                 Balanced. No move needed.

findMedian()  →  Equal size → (3+4)/2 = 3.5  ✅
```

---

## 10. Why the Median Doesn't Have to Exist in the Stream

Common confusion: `[1, 2, 3, 5, 8, 9]` → median = 4. But there's no 4 in the data. Is that wrong?

**No.** Think about test scores:

```
    You:    60
    Friend: 80

    Median = (60 + 80) / 2 = 70
```

Neither of you scored 70. But 70 IS the middle. It's the balance point between the two scores.

```
    Odd count  →  middle number exists in the data      →  return it
    Even count →  middle falls BETWEEN two numbers      →  average them
```

The median is a **position concept** (where is the middle of this data?) — not a **value concept** (which number is in the middle?). That's why the return type is `float`.

---

## 11. Why Left Gets the Extra Element

Odd count means one side MUST have one extra. We chose Left. Here's why it's clean:

```
5 numbers sorted:  [1, 2, 3, 4, 5]
position:           1   2   3   4   5
                            ↑
                         middle = position 3

Split → Left gets 3, Right gets 2:

    position:  1    2    3  │  4    5
    value:    [1,   2,   3] │ [4,   5]
                        ↑
                     LAST number in Left
                     = BIGGEST in Left
                     = the ROOT
                     = the MIDDLE of the whole list
```

Same with 3 numbers:

```
    position:  1    2  │  3
    value:    [2,   3] │ [4]
                    ↑
                 LAST number in Left = MIDDLE of the whole list = ROOT
```

**The pattern:**

```
    Left always covers from the start UP TO the middle.
    The middle is the LAST number in Left.
    The LAST number in Left = the BIGGEST in Left = the root.

    So: root = middle = median.  Every time.
```

We could have given Right the extra instead — then we'd read Right's root for odd counts. We just chose Left. Pick one rule, stick with it. Everything works.

---

## 12. The Signal — How to Recognize Two Heaps

### Signal Words

```
┌──────────────────────────────────────────────────┐
│           🔔 SIGNAL WORDS / PHRASES              │
├──────────────────────────────────────────────────┤
│                                                  │
│  1. "median"                    ← strongest      │
│  2. "middle element"            ← strongest      │
│  3. "stream" + "median"         ← instant        │
│  4. "k-th smallest at any time" ← strong         │
│  5. "sliding window median"     ← instant        │
│  6. "split into two groups"     ← moderate       │
│  7. "balance" + "partition"     ← moderate       │
│                                                  │
└──────────────────────────────────────────────────┘
```

### The Decision Question

> "Do I need to track a **middle point** or **k-th position** in data that keeps changing?"
>
> If YES → Two Heaps.

### Two Heaps vs. Similar Patterns

```
    "Find median of a stream"            → Two Heaps
    "Find top K elements"                → Single Heap (Top K)
    "Find K-th smallest overall"         → Single Min-Heap
    "Median in a sliding WINDOW"         → Two Heaps + lazy deletion
    "Sort this data"                     → Just sort
```

### Key difference from Top K:

```
    Top K:      "I need the K best things"        → 1 heap, size K
    Two Heaps:  "I need the MIDDLE of everything" → 2 heaps, balanced
```

---

## 13. The 4 Classic Problems

```
┌─────────────────────────────────────────────────────────────┐
│  #1  Find Median from Data Stream                           │
│      Signal: "stream" + "median"                            │
│      The base problem. You solved this one.                 │
├─────────────────────────────────────────────────────────────┤
│  #2  Sliding Window Median                                  │
│      Signal: "window" + "median"                            │
│      Same core idea + numbers also LEAVE the heaps          │
│      (adds a "remove" step — the hardest variant)           │
├─────────────────────────────────────────────────────────────┤
│  #3  Maximize Capital (IPO)                                 │
│      Signal: "maximize profit" + "pick k projects"          │
│      Two heaps partition on a CONSTRAINT, not just value    │
├─────────────────────────────────────────────────────────────┤
│  #4  Find Median of Two Sorted Arrays                       │
│      Signal: "median" + "two sorted arrays"                 │
│      Same partition idea, optimized with binary search      │
└─────────────────────────────────────────────────────────────┘
```

---

## 14. The Code (Annotated)

```python
from heapq import *

class Solution:
    def __init__(self):
        self.left  = []   # max-heap (negate values — Python only has min-heap)
        self.right = []   # min-heap

    def insertNum(self, num):
        # ① ROUTE — which bucket?
        if self.left == []:              # empty → default Left
            heappush(self.left, -num)
        elif num <= -self.left[0]:       # ≤ Left root → Left
            heappush(self.left, -num)    # negate! Left is max-heap
        else:                            # > Left root → Right
            heappush(self.right, num)

        # ② REBALANCE — fix sizes
        if len(self.left) - len(self.right) > 1:      # Left too big
            heappush(self.right, -heappop(self.left))  # move Left root → Right
        elif len(self.left) < len(self.right):         # Right too big
            heappush(self.left, -heappop(self.right))  # move Right root → Left

    def findMedian(self):
        # ③ READ — get median from roots
        if len(self.right) == len(self.left):          # even count
            return ((-self.left[0]) + (self.right[0])) / 2
        return -self.left[0] / 1.0                     # odd count → Left root
```

### Why the negation?

Python's `heapq` is **min-heap only**. To simulate max-heap:

```
    Push -num instead of num.
    The smallest negative = the largest original number.
    So heapq root = most negative = largest number = what we want on top.

    Example: push 3, 5, 1 as -3, -5, -1
    heapq sorts: [-5, -3, -1]
    Root = -5  →  negate back →  5  →  the max. Correct.
```

---

## 15. Common Bugs & Traps

| # | Bug | What happened | The Rule |
|---|-----|--------------|----------|
| 1 | `self = self` | Does nothing | `self` is auto-passed. Use it to SET attributes: `self.x = value`. Never assign it to itself. |
| 2 | `heapq.push()` | Doesn't exist | `from heapq import *` → use `heappush()` directly. No module prefix. |
| 3 | `heapqpush` | Words smashed together | It's `heappush`. h-e-a-p-p-u-s-h. Two p's. `heap` + `push`. |
| 4 | Missing `-num` on first push | First number not negated | Left is ALWAYS max-heap. EVERY push to Left must negate. No exceptions — including the very first number. |
| 5 | `if` instead of `elif` | Double push | A number can only go to ONE place. Choices are mutually exclusive → use `elif`. |

### The if vs elif trap (Bug #5 — the sneaky one):

```python
# ❌ BUG — both ifs check independently
if self.left == []:
    heappush(self.left, -num)      # runs: pushes 3

if num <= -self.left[0]:           # ALSO checks. 3 ≤ 3 = True.
    heappush(self.left, -num)      # pushes 3 AGAIN. Double push.

# ✅ FIXED — elif stops after first match
if self.left == []:
    heappush(self.left, -num)      # runs: pushes 3

elif num <= -self.left[0]:         # SKIPPED. First if was True.
    heappush(self.left, -num)      # never runs.
```

**Rule:** "Are these choices mutually exclusive?" → If yes → `if/elif/else`.

---

## 16. Complexity

| Operation | Time | Why |
|-----------|------|-----|
| insertNum | O(log n) | At most 2 heap operations (push + rebalance) |
| findMedian | O(1) | Just reading the two roots |
| Space | O(n) | All numbers stored across both heaps |

### Why not just sort each time?

| Approach | Insert | Find Median |
|----------|--------|-------------|
| Sort every time | O(n log n) | O(1) |
| Two Heaps | **O(log n)** | **O(1)** |

Sorting rebuilds everything. Two Heaps only touches what changed.

---

## Quick Reference Card

```
  🔔 See "median" + "stream/dynamic"  →  Think Two Heaps

  🏗️  Setup:
       Left  = Max-Heap (smaller half)   ← root = BIGGEST of small
       Right = Min-Heap (larger half)    ← root = SMALLEST of large

  ⚙️  Each insert:   Route → Rebalance → Read
  📏  Invariant:     |Left| == |Right|  OR  |Left| == |Right| + 1
  📍  Median:        Between the two roots (or Left root if odd)

  ⏱️  Time:  insert O(log n)  |  median O(1)
  📦  Space: O(n)
```
