# Two Heaps

## Spot It
"Find **median**" + "**streaming/dynamic** data"

**NOT Two Heaps**:
- "Kth largest" → single heap of size K
- Static data → just sort

---

## Why It Works
Median = boundary between smaller half and larger half.

- **Max-heap** for smaller half → gives largest of smalls
- **Min-heap** for larger half → gives smallest of larges
- Keep sizes balanced (differ by ≤ 1)

**Add: O(log n), Get median: O(1)**

---

## The Core
```python
import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # max-heap (NEGATE values)
        self.large = []  # min-heap

    def addNum(self, num):
        # Add to correct heap
        if not self.small or num <= -self.small[0]:
            heapq.heappush(self.small, -num)
        else:
            heapq.heappush(self.large, num)

        # Rebalance
        if len(self.small) > len(self.large) + 1:
            heapq.heappush(self.large, -heapq.heappop(self.small))
        elif len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2
```

---

## Traps
1. **Python has min-heap only** - negate for max-heap
2. **Compare with `-small[0]`** not `small[0]` (it's negated!)
3. **Check `if not self.small`** before comparing on first element
