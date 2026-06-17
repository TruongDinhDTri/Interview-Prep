# Sliding Window

## Spot It
**Subarray/Substring** + **Constraint** = Sliding Window

| Signal | Example |
|--------|---------|
| "longest substring with at most K distinct" | ✓ |
| "minimum length subarray with sum ≥ target" | ✓ |
| "longest substring without repeating" | ✓ |

**NOT Sliding Window**: "find pair summing to K" → Two Pointers

---

## Why It Works
Instead of checking every subarray O(n²), expand right → shrink left while invalid → each element enters/leaves once = **O(n)**.

---

## The Core
```python
def longestWithKDistinct(s, k):
    count = {}  # char -> frequency
    left = 0
    max_len = 0

    for right in range(len(s)):
        # Expand: add s[right]
        count[s[right]] = count.get(s[right], 0) + 1

        # Shrink: while constraint violated
        while len(count) > k:
            count[s[left]] -= 1
            if count[s[left]] == 0:
                del count[s[left]]
            left += 1

        # Update answer
        max_len = max(max_len, right - left + 1)

    return max_len
```

---

## Traps
1. **Shrink with `while`, not `if`** — may need multiple shrinks
2. **Delete key when count hits 0** — `len(dict)` tracks distinct
3. **"Fruits into baskets" = "K distinct" with K=2** — same pattern, different costume
