# Top K Elements

## Spot It
| Signal | Top K (Heap) |
|--------|--------------|
| "K largest" / "K smallest" | ✓ |
| "K most frequent" | ✓ |
| "Kth largest element" | ✓ |

**NOT Top K**: "find median" → Two Heaps

---

## Why It Works
Keep heap of size K. Root = worst of top K (the gatekeeper). New element beats root? Kick root out.

**Top K Largest → Min-heap** (root = smallest of large ones)
**Top K Smallest → Max-heap** (root = largest of small ones)

**O(n log K)** — better than sorting when K << n.

---

## The Core
```python
import heapq

def topKLargest(nums, k):
    heap = []  # min-heap

    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)  # kick out smallest

    return heap  # contains K largest
```

**Kth Largest** = heap root after processing all:
```python
def kthLargest(nums, k):
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]  # root = Kth largest
```

**Top K Frequent**:
```python
def topKFrequent(nums, k):
    count = Counter(nums)
    return heapq.nlargest(k, count.keys(), key=count.get)
```

---

## Traps
1. **K Largest uses MIN-heap, K Smallest uses MAX-heap** — counterintuitive!
2. **Python only has min-heap** — negate values for max-heap
3. **Frequency problems: count first, then top K**
