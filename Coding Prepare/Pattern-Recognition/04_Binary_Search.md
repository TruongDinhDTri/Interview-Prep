# Binary Search

## Spot It
| Signal | Binary Search |
|--------|---------------|
| Sorted array + find element | ✓ |
| "minimum X that satisfies condition" | Search on answer space |
| "first/last occurrence" | Boundary search |
| Rotated sorted array | Modified binary search |

**Key**: Search space has **monotonic property** — one side all true, other all false.

---

## Why It Works
Eliminate half each step: n → n/2 → n/4 → 1 = **O(log n)**.

---

## The Core

**Find Exact**
```python
def binarySearch(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1
```

**Find Boundary (First True)**
```python
def firstTrue(nums, condition):
    left, right = 0, len(nums) - 1

    while left < right:
        mid = left + (right - left) // 2
        if condition(nums[mid]):
            right = mid      # mid could be answer
        else:
            left = mid + 1

    return left
```

**Search on Answer Space** (e.g., Koko Eating Bananas)
```python
def minSpeed(piles, h):
    left, right = 1, max(piles)

    while left < right:
        mid = left + (right - left) // 2
        if canFinish(piles, mid, h):  # can finish with speed mid?
            right = mid
        else:
            left = mid + 1

    return left
```

---

## Traps
1. **Overflow**: Use `mid = left + (right - left) // 2`
2. **`<=` vs `<`**: Exact search uses `<=`, boundary uses `<`
3. **`mid` vs `mid + 1`**: If `condition(mid)` true and mid could be answer → `right = mid`
