# Hash Maps

## Spot It
| Signal | Hash Map For |
|--------|--------------|
| "find complement" / Two Sum (unsorted) | Store value → lookup complement |
| "count frequency" / anagrams | Count occurrences |
| "group by property" | Key = property, value = group |
| "subarray sum = K" | Prefix sum + hash map |

---

## Why It Works
O(1) lookup transforms O(n²) "check all pairs" into O(n) "store and lookup".

---

## The Core Patterns

**1. Two Sum (Complement Lookup)**
```python
def twoSum(nums, target):
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i  # store AFTER checking
    return []
```

**2. Subarray Sum = K (Prefix Sum + Hash)**
```python
def subarraySum(nums, k):
    prefix_count = {0: 1}  # prefix_sum -> count
    curr_sum = 0
    result = 0

    for num in nums:
        curr_sum += num
        # How many prefix sums = curr_sum - k?
        result += prefix_count.get(curr_sum - k, 0)
        prefix_count[curr_sum] = prefix_count.get(curr_sum, 0) + 1

    return result
```

---

## Traps
1. **Two Sum: lookup BEFORE storing** — don't use same element twice
2. **Anagrams: use `tuple(sorted(s))` or frequency tuple as key**
3. **Prefix sum problems need `{0: 1}` initial** — subarray starting from index 0
