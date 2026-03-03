# Two Pointers

## Spot It
| Signal | Use Two Pointers |
|--------|------------------|
| **Sorted array** + find pair/triplet with target sum | ✓ |
| Palindrome check | ✓ |
| Remove duplicates in-place | ✓ |
| Container/area between two lines | ✓ |

**NOT Two Pointers**: "subarray with constraint" → Sliding Window

---

## Why It Works
Sorted array lets you eliminate candidates: sum too small → move left up, sum too big → move right down. **O(n)** instead of O(n²).

---

## The Core
```python
def twoSum(nums, target):  # nums is SORTED
    left, right = 0, len(nums) - 1

    while left < right:
        curr_sum = nums[left] + nums[right]
        if curr_sum == target:
            return [left, right]
        elif curr_sum < target:
            left += 1   # need bigger
        else:
            right -= 1  # need smaller

    return []
```

**3Sum**: Fix one, two-pointer on rest. Skip duplicates AFTER finding valid.

---

## Traps
1. **Must sort first** for sum problems (unless already sorted)
2. **Skip duplicates**: `while left < right and nums[left] == nums[left-1]: left += 1`
3. **Two pointers ≠ Sliding Window** — pointers can skip, window is contiguous
