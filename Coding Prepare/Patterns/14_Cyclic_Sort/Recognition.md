# Cyclic Sort

## Spot It
All THREE must be true:
1. Array size N
2. Numbers in range [1,N] or [0,N-1]
3. "Find missing" or "find duplicate"

**NOT Cyclic Sort**: Range is huge (10^9), numbers can be negative, can't modify array.

---

## Why It Works
Number X belongs at index X-1. Swap each number to its home. After sorting, wrong positions reveal missing/duplicates.

**O(N)**: Each number swapped at most once to correct position.

---

## The Core
```python
def cyclicSort(nums):
    i = 0
    while i < len(nums):
        correct = nums[i] - 1  # where it should be

        if nums[i] != nums[correct]:  # not home AND target different
            nums[i], nums[correct] = nums[correct], nums[i]
            # DON'T increment - check swapped element
        else:
            i += 1

    # Scan for mismatches
    for i in range(len(nums)):
        if nums[i] != i + 1:
            # i+1 is missing, nums[i] is duplicate
```

---

## Index Formula
| Range | Formula |
|-------|---------|
| [1, N] | correct = num - 1 |
| [0, N-1] | correct = num |

---

## Traps
1. **Don't increment i after swap** - must check swapped-in element
2. **Use `nums[i] != nums[correct]`** not `nums[i] != i+1` - handles duplicates, avoids infinite loop
3. **First Missing Positive**: Filter to [1,N] first with `if 1 <= nums[i] <= n`
