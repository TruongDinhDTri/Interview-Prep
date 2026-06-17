# 0/1 Knapsack DP

## Spot It

| Signal                                   | 0/1 Knapsack        |
| ---------------------------------------- | ------------------- |
| Items with weight/value + capacity limit | ✓                  |
| Each item used **at most once**   | ✓                  |
| "Can we reach exactly sum X?"            | ✓ (Subset Sum)     |
| "Partition into two equal subsets"       | ✓ (target = sum/2) |

**NOT 0/1**: Items can be reused → Unbounded Knapsack

---

## Why It Works

For each item: take it or leave it. `dp[i][w]` = best value with first i items and capacity w.

```
dp[i][w] = max(
    dp[i-1][w],                        # don't take
    dp[i-1][w-weight[i]] + value[i]    # take (if fits)
)
```

---

## The Core (1D Space-Optimized)

```python
def knapsack(weights, values, capacity):
    dp = [0] * (capacity + 1)

    for i in range(len(weights)):
        # MUST go backwards to avoid using same item twice
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])

    return dp[capacity]
```

**Subset Sum** (can we reach target?):

```python
def canPartition(nums):
    total = sum(nums)
    if total % 2: return False
    target = total // 2

    dp = [False] * (target + 1)
    dp[0] = True

    for num in nums:
        for t in range(target, num - 1, -1):
            dp[t] = dp[t] or dp[t - num]

    return dp[target]
```

---

## Traps

1. **Loop capacity BACKWARDS** in 1D DP — prevents reusing same item
2. **0/1 vs Unbounded**: 0/1 = backwards, Unbounded = forwards
3. **Partition Equal Subset = "Can we reach sum/2?"**
