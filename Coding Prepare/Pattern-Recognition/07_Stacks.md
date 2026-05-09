# Stacks & Monotonic Stacks

## Spot It

| Signal                                              | Pattern         |
| --------------------------------------------------- | --------------- |
| "matching" / "balanced" / "valid parentheses"       | Regular Stack   |
| "next greater/smaller" / "previous greater/smaller" | Monotonic Stack |
| "days until" / "span" / "temperatures"              | Monotonic Stack |
| "pending items" / "wait" / "evaluate in order" / "operator fires on previous" | Regular Stack |
| "postfix / RPN / evaluate expression"               | Regular Stack   |

---

## Why It Works

- **Regular**: Stack holds "pending" items waiting for their match. `(` waits for `)`. Numbers wait for their operator (RPN).
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

---

## Regular Stack — RPN Pattern (LeetCode #150)

```python
ops = {
    "+": lambda a, b: a + b,
    "-": lambda a, b: a - b,
    "*": lambda a, b: a * b,
    "/": lambda a, b: int(a / b),  # truncate toward zero, NOT //
}
stack = []
for token in tokens:
    if token not in ops:
        stack.append(int(token))
    else:
        first_num = stack.pop()   # RIGHT operand
        second_num = stack.pop()  # LEFT operand
        stack.append(ops[token](second_num, first_num))  # LEFT op RIGHT ← order matters!
return stack.pop()
```

**Critical traps:**
- `isdigit()` fails on `"-11"` → use `token not in ops`
- Operand order: `second_num op first_num` (LEFT op RIGHT), NOT reversed
- Division: `int(a/b)` truncates toward zero. `a//b` is floor — different for negatives
- Use `list`, not `deque` — `.append()` + `.pop()` is O(1) stack
