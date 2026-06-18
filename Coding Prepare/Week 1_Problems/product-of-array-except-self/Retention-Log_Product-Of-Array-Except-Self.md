# Retention Log: Product of Array Except Self

**Date:** 2026-03-14
**Pattern:** Prefix Product (Prefix Sum variant)
**Category:** Week 1 — Array, String, HashMap, Prefix Sum
**Difficulty:** Medium
**LeetCode:** #238

---

## PRE-SOLVE: RETENTION CHECK

**Q: Can you remember the approach?**
A: Use a left (prefix) array and right (suffix) array. Left stores cumulative product from start→end. Right stores cumulative product from end→start. The formula: `output[i] = left[i-1] * right[i+1]`. Boundary cases: `output[0] = right[1]`, `output[n-1] = left[n-2]`. Naive approach uses O(n) extra space (two arrays). Optimized: store left in output, compute right on-the-fly with a single running variable → O(1) extra space.

**Q: Why doesn't the output array count as extra space?**
A: The problem requires returning an array — every solution must allocate it. It's the **required delivery truck**, not optional. "O(1) extra space" means: beyond what the problem forces you to allocate, how much MORE did you need?

- **Naive:** output (required) + left + right = **O(n) extra**
- **Optimal:** output (required) + one `product` variable = **O(1) extra**

**Q: Why pick this problem?**
A: Still felt uncertain about it. Wanted to hit 3 distinct categories from Week 1.

---

## SOLVE PROCESS

### STEP 1: DECODE — "What is this problem REALLY asking?"

A: Given a nums array, return answer[i] where answer[i] is the **product of ALL elements except nums[i]**.

Example: `nums = [1,2,3,4]` → `output[2] = 1 * 2 * 4 = 8` (everything except `nums[2] = 3`)

**Pattern Signals:** Range product, Array, Precomputation

> **Error caught:** Initially said "product from 0 up to i" — that's what the prefix product IS, not what the problem asks. The problem asks for product of everything EXCEPT i.

---

### STEP 2: MATCH — "What signals tell me which pattern?"

A: Need to efficiently compute product of ranges → **Prefix Product** pattern. Precomputing cumulative products avoids recalculating from scratch each time. Week 1: Array, String, HashMap, Prefix Sum.

---

### STEP 3: REASON — "WHY does this pattern work?"

#### 3.1 Brute force & why it's bad

For each element, multiply all n-1 other elements. Nested loop → **O(n^2)**. Problem requires O(n).

#### 3.2 What does the pattern do instead?

**First, understand the concept with TWO separate arrays:**

We need "product of everything except i." Split that into two halves:

- **Left array:** `left[i]` = product of all elements from index 0 to i (inclusive)
- **Right array:** `right[i]` = product of all elements from index i to n-1 (inclusive)

For `nums = [1, 2, 3, 4]`:

- `left  = [1, 2, 6, 24]` → cumulative product going right (NOT sum — product!)
- `right = [24, 24, 12, 4]` → cumulative product going left

Now the formula becomes obvious — to get "everything except i," take everything LEFT of i × everything RIGHT of i:

- `output[i] = left[i-1] × right[i+1]`
- `output[0] = right[1] = 24` (nothing on the left)
- `output[1] = left[0] × right[2] = 1 × 12 = 12`
- `output[2] = left[1] × right[3] = 2 × 4 = 8`
- `output[3] = left[2] = 6` (nothing on the right)

This works, but uses O(n) extra space (two arrays).

**Now, the optimization — eliminate the right array:**

Store the left array directly in `output`. Then traverse backward with a single running variable `product` that accumulates the suffix product on-the-fly:

- **Phase 1 (Left→Right):** Build prefix product in output. `output = [1, 2, 6, 24]`
- **Phase 2 (Right→Left):** `product` starts at 1, replaces the right array:
  - i=3: output[3] = output[2] × 1 = 6, then product = 1 × 4 = 4
  - i=2: output[2] = output[1] × 4 = 8, then product = 4 × 3 = 12
  - i=1: output[1] = output[0] × 12 = 12, then product = 12 × 2 = 24
  - output[0] = product = 24
- **Result: [24, 12, 8, 6]** — same answer, O(1) extra space!

The running `product` variable IS the right array, computed one element at a time.

> **Error caught:** Initially wrote `[4, 6, 8, 10]` as prefix array — that's prefix SUM, not prefix PRODUCT. Correct is `[1, 2, 6, 24]`.

#### 3.3 The Invariant

`output[i] = output[i-1] * product` where `product` accumulates the suffix product from the right. `output[0] = product`. This rule never breaks at any step.

---

### STEP 4: PLAN & CODE

**Plan:**

1. Build left (prefix product) array in output using `append`
2. Reset `product = 1` for the running suffix
3. Traverse backward: `output[i] = output[i-1] * product`, then `product *= nums[i]`
4. Handle `output[0] = product` separately
5. Return output

**Corrected Code:**

```python
def product_of_array_except_itself(nums):
    product = 1
    n = len(nums)
    output = []

    # Phase 1: Build left (prefix) array in output
    for i in range(n):
        product *= nums[i]
        output.append(product)    # append, NOT output[i] = ...

    # Phase 2: Apply formula with running right product
    product = 1
    for i in range(n - 1, 0, -1):
        output[i] = output[i-1] * product
        product *= nums[i]
    output[0] = product

    return output
```

> **Error caught:** Originally used `output[i] = start` on an empty list → `IndexError`. Must use `output.append()` when building from scratch.

---

### STEP 5: PROVE — Verified from memory with new input

**Trace: `nums = [2, 3, 4, 5]`**

Phase 1: `output = [2, 6, 24, 120]`

Phase 2:

- i=3: product=1, output[3] = 24 * 1 = 24, product = 5
- i=2: product=5, output[2] = 6 * 5 = 30, product = 20
- i=1: product=20, output[1] = 2 * 20 = 40, product = 60
- output[0] = 60

**Final: [60, 40, 30, 24]**

Verification: 3×4×5=60, 2×4×5=40, 2×3×5=30, 2×3×4=24. **All correct.**

> **Error caught:** Initially wrote 24×5=100 instead of 120. Arithmetic slip, not conceptual.

---

## ERRORS LOG

| # | Error                                | Type       | Correction                                                                       |
| - | ------------------------------------ | ---------- | -------------------------------------------------------------------------------- |
| 1 | Decode said "product from 0 to i"    | Conceptual | That's prefix product, not the problem. Problem = product of everything EXCEPT i |
| 2 | Wrote `[4,6,8,10]` as prefix array | Conceptual | Used addition not multiplication. Correct:`[1,2,6,24]`                         |
| 3 | `output[i]=` on empty list         | Code bug   | Must use `output.append()` to build from empty                                 |
| 4 | 24 × 5 = 100                        | Arithmetic | 24 × 5 = 120                                                                    |

---

## COMPLEXITY

- **Time:** O(n) — Two passes
- **Space:** O(1) extra — One running `product` variable (output doesn't count)

---

## KEY TAKEAWAYS

1. **Formula:** `output[i] = left[i-1] × right[i+1]`, boundaries: `output[0] = right[1]`, `output[n-1] = left[n-2]`
2. **Optimization:** Store left in output, compute right on-the-fly with running product
3. **Invariant:** `output[i] = output[i-1] * product`, `output[0] = product`
4. **Watch out:** `append` vs indexing empty lists; prefix PRODUCT (multiply) not prefix SUM (add)

---
