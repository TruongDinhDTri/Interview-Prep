# Counting Sort & Dutch National Flag

## Spot It
| Signal | Use This |
|--------|----------|
| Sort/partition array with a **small FIXED set** of distinct values, **in place** | ✓ |
| Values from a tiny known range (e.g. {0,1,2}, or chars a–z) | ✓ |
| "Sort colors" / "3 categories" / group reds-whites-blues | ✓ |
| Need **one pass + constant space** | → Dutch Flag |
| No library sort allowed | ✓ |

**NOT this**: large/unknown value range, need stable sort of arbitrary keys, comparison sort required → use merge/quick sort (O(n log n)).

---

## Two Tools — Pick By Constraint
| Tool | When to reach for it | Passes | Space |
|------|----------------------|--------|-------|
| **Counting Sort** | Value-set is tiny → just count, then PAINT back in chosen order | 2 | O(k) keys |
| **Dutch National Flag** | One pass + strict constant space demanded (the follow-up) | 1 | O(1) |

---

## Why It Works
**Counting sort**: when values come from a tiny set, you don't compare anything — you tally counts, then overwrite the array in the order YOU choose (0s, then 1s, then 2s). The sorted order is forced by your write-order, NOT by dict iteration. O(n).

**Dutch Flag**: carve the array into 3 regions `[ 0s | unknown | 2s ]` with three pointers. One scanner (`mid`) sweeps the unknown middle, swapping each value to its home region. O(n), one pass, in place.

---

## The Core
```python
# COUNTING SORT — count then paint (one shared write-index!)
from collections import Counter
def sortColors(nums):
    c = Counter(nums)
    i = 0
    for v in (0, 1, 2):          # WE choose the order
        for _ in range(c[v]):
            nums[i] = v
            i += 1               # ONE cursor marching, never reset

# DUTCH NATIONAL FLAG — one pass, O(1) space
def sortColors(nums):
    left, mid, right = 0, 0, len(nums) - 1
    while mid <= right:                       # <= NOT < (process the last slot!)
        if nums[mid] == 1:
            mid += 1
        elif nums[mid] == 2:
            nums[right], nums[mid] = nums[mid], nums[right]
            right -= 1                         # MID STAYS — newcomer unexamined
        else:  # == 0
            nums[left], nums[mid] = nums[mid], nums[left]
            left += 1
            mid += 1                           # MID ADVANCES — newcomer already scanned
```

---

## The Asymmetry (the whole trick)
- **Swap a 0** → value pulled in from BEHIND mid (already-scanned, all 1s) → already checked → **mid++**
- **Swap a 2** → value pulled in from the UNEXPLORED right zone → unchecked → **MID STAYS**, re-examine it

> Reframe `[2,1]`: swap the 2 to the right, the value landing under mid came from the right — never scanned. If mid advanced, you'd skip it. So mid must stay.

---

## Traps
1. **Loop boundary `while mid <= right`** — `<` skips the final element. Test `[1,0]` → `<` leaves it unsorted. (Same off-by-one wound as binary-search boundary problems.)
2. **mid STAYS after a 2-swap** — advancing mid here drops an unchecked value.
3. **Compare `nums[mid]`, not `mid`** — `if mid == 2` compares the INDEX, not the value.
4. **Counting sort: order comes from YOUR write-order**, not dict iteration. `Counter` keeps counts, NOT order.
5. **One shared write-index** in counting sort — a fresh `for i in range(...)` per value restarts at 0 and overwrites. Don't clear the array first either — existing slots ARE the canvas (`nums[0]=x` on empty list = IndexError).
6. **`Counter[missing_key]` returns 0** (loop runs 0×, safe). A plain `dict[missing]` → KeyError. Cleanest fixed tool: a `[0,0,0]` list indexed by value.

---

## Connections
- **Cyclic Sort** — same "small fixed range → swap into home" spirit.
- **Quicksort partition** — Dutch Flag is 3-way partition; Lomuto/Hoare is 2-way around a pivot.
- **LeetCode #75 Sort Colors** — the canonical problem for both tools.
