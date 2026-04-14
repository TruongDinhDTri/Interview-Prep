# Stacks & Monotonic Stacks

## Spot It

| Signal                                              | Pattern         |
| --------------------------------------------------- | --------------- |
| "matching" / "balanced" / "valid parentheses"       | Regular Stack   |
| "next greater/smaller" / "previous greater/smaller" | Monotonic Stack |
| "days until" / "span" / "temperatures"              | Monotonic Stack |

---

## Why It Works

- **Regular**: Stack holds "pending" items waiting for their match. `(` waits for `)`.
- **Monotonic**: Stack holds unresolved elements. When bigger element arrives, it "answers" all smaller ones waiting. (I need more on this explain)

**O(N)**: Each element pushed once, popped once.

---

## Monotonic Stack Core

```python
def nextGreater(nums):
    result = [-1] * len(nums)
    stack = []  # indices

    for i, num in enumerate(nums):
        while stack and num > nums[stack[-1]]:
            result[stack.pop()] = num
        stack.append(i)
    return result
```

**Cheat sheet:**

| Want         | Stack Order | Pop when   |
| ------------ | ----------- | ---------- |
| Next Greater | Decreasing  | curr > top |
| Next Smaller | Increasing  | curr < top |

---

## Traps

1. **Store INDICES, not values** - you'll need positions
2. **Always check `stack and`** before comparing
3. **Greater → Decreasing stack, Smaller → Increasing stack**
