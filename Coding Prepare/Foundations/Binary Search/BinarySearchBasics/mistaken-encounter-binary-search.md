# Binary Search Mistakes

## Problem: LeetCode #704 - Binary Search

### Mistake #1: Mid not recalculated inside loop
```python
# ❌ WRONG
mid = (right + left) // 2  # Calculated ONCE before loop

while left < right:
    if nums[mid] == target:  # mid never changes!
        return mid
```

**Result:** Infinite loop. `mid` stays the same even as `left` and `right` change.

**Fix:** Calculate `mid` inside the loop
```python
# ✅ CORRECT
while left <= right:
    mid = left + (right - left) // 2  # Recalculated each iteration
```

---

### Mistake #2: Wrong loop condition
```python
# ❌ WRONG
while left < right:  # Misses edge case
```

**Result:** Fails when `nums = [5]`, `target = 5`
- `left = 0, right = 0`
- `left < right` is False → loop doesn't run → returns -1 ❌

**Fix:** Use `<=` to include single element case
```python
# ✅ CORRECT
while left <= right:  # Handles all cases including left == right
```

---

### Mistake #3: Wrong right boundary
```python
# ❌ WRONG
right = len(nums)  # Index out of bounds!
```

**Fix:**
```python
# ✅ CORRECT
right = len(nums) - 1  # Last valid index
```

---

## Key Takeaways
- Always recalculate `mid` inside the loop
- Use `while left <= right` for inclusive search
- Set `right = len(nums) - 1` for valid array index
