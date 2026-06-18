# ⚠️ Error Log: Search in Rotated Sorted Array

## 1. Syntax Error
- **Mistake:** Used `=<` for "less than or equal".
- **Fix:** Python uses `<=`.

## 2. Logic Error (Critical) ☠️
- **Mistake:** In the `else` block (Right Sorted portion), when target was *outside* the sorted range (meaning it's in the left unsorted part), I wrote `right = mid + 1`.
- **Why it's wrong:** This moves the pointer *right* instead of *left*, pushing the search away from the target and potentially causing an infinite loop.
- **Fix:** `right = mid - 1` to correctly search the left side.

## 3. Code Optimization
- **Observation:** `if target == nums[mid]` was repeated in both branches.
- **Improvement:** Moved it to the top of the loop to check immediately. Cleaner code, less repetition.
