# Prefix Sum

## Spot It
| Signal | Prefix Sum |
|--------|------------|
| "range sum query" / "sum from i to j" | ✓ |
| "subarray sum equals K" | + Hash Map |
| "count subarrays with sum K" | + Hash Map |

**NOT Prefix Sum**: Array changes frequently → Segment Tree

---

## Why It Works
`prefix[i]` = sum of elements 0 to i-1.
Sum from i to j = `prefix[j+1] - prefix[i]`.

Precompute once O(n), query O(1).

---

## The Core

**Build Prefix Sum**
```python
def buildPrefix(nums):
    prefix = [0]
    for num in nums:
        prefix.append(prefix[-1] + num)
    return prefix

# Sum from index i to j (inclusive):
# prefix[j+1] - prefix[i]
```

**Count Subarrays with Sum = K**
```python
def subarraySum(nums, k):
    prefix_count = {0: 1}
    curr_sum = 0
    count = 0

    for num in nums:
        curr_sum += num
        # How many prefix sums = curr_sum - k?
        count += prefix_count.get(curr_sum - k, 0)
        prefix_count[curr_sum] = prefix_count.get(curr_sum, 0) + 1

    return count
```

---

## Traps
1. **Start with `{0: 1}`** — handles subarrays starting from index 0
2. **prefix[j+1] - prefix[i]** — careful with indices
3. **"Contiguous Array" (0s and 1s)**: Treat 0 as -1, find subarray sum = 0
