# Linear DP

## Spot It

| Signal | Linear DP |
|--------|-----------|
| "how many ways / distinct ways" | ✓ count DP |
| "minimum steps / coins / operations" | ✓ optimize DP |
| "can you reach / is it possible?" | ✓ reachability DP |
| answer for n depends on smaller n | ✓ overlapping subproblems |
| "climb / jump / tile / decode" | ✓ classic linear DP |
| "generate all" / "list all" | ✗ → Backtracking instead |

**Key:** You have **overlapping subproblems** — the same sub-answer is needed multiple times. Reuse it instead of recomputing.

**DP vs Backtracking:**
- Backtracking: GENERATES paths. Signal = "generate all", "list all"
- DP: COUNTS/OPTIMIZES using stored results. Signal = "how many", "min/max"
- Wiganz's rule: *"reuse the old result"* = DP

---

## Why It Works

The recurrence `f(n) = f(n-1) + f(n-2)` comes from asking: **"What's the LAST decision that got me here?"**

The allowed moves define the recurrence:
- "take 1 or 2 steps" → `f(n) = f(n-1) + f(n-2)`
- "take 1, 2, or 3 steps" → `f(n) = f(n-1) + f(n-2) + f(n-3)`
- "take 1 or k steps" → `f(n) = f(n-1) + f(n-k)`

**This is the core of ALL Linear DP:** don't solve the big problem directly — ask what subproblems feed into it.

---

## The Core

**Template 1: Space-Optimized (O(1) space) — preferred**
```python
def climbingStairs(n: int) -> int:
    if n == 1: return 1
    prev1 = 1   # f(1)
    prev2 = 2   # f(2)
    for i in range(3, n + 1):   # range(3, n+1) — include n!
        curr = prev1 + prev2
        prev1 = prev2
        prev2 = curr
    return prev2
# Time: O(n) | Space: O(1)
```

**Template 2: Tabulation with Full Array (O(n) space)**
```python
def climbingStairs(n: int) -> int:
    if n == 1: return 1
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
# Time: O(n) | Space: O(n)
```

**Template 3: Memoization (Top-Down)**
```python
from functools import lru_cache

@lru_cache(maxsize=None)
def climbingStairs(n: int) -> int:
    if n == 1: return 1
    if n == 2: return 2
    return climbingStairs(n-1) + climbingStairs(n-2)
# Time: O(n) | Space: O(n) for cache + call stack
```

**Bottom-Up vs Tabulation vs Loop+Reuse — Same Thing, Different Words:**
| Term | Meaning |
|---|---|
| Bottom-up | start from base cases, build up to n |
| Tabulation | fill a table (dp array) cell by cell |
| Loop + reuse | what it looks like in code |
| Space-optimized tabulation | tabulation but only keep last K values |
All of these refer to the same approach. Top-down = recursion + cache (memoization).

---

## Traps

**1. Off-by-one in range**
```python
# WRONG — for n=3, range(3,3) is empty!
for i in range(3, n):
    ...
# CORRECT
for i in range(3, n + 1):
    ...
```

**2. Wrong swap order**
```python
# WRONG — loses prev1 before using it
curr = prev1 + prev2
prev1 = prev2   # ← prev1 overwritten!
prev2 = curr

# CORRECT
curr = prev1 + prev2
prev2 = prev1   # save old prev1 first
prev1 = curr
```
OR: keep first swap but `return prev2` (both work — be consistent).

**3. Submitting pure recursion as DP**
```python
# WRONG — this is O(2^n), NOT DP (no memoization)
return f(n-1) + f(n-2)
```
DP requires either a cache (memoization) or a loop (tabulation). Plain recursion = brute force.

**4. Missing base case guard**
- n=1 needs a guard: without it, `range(3, 2)` is empty → returns `prev2=2` (wrong, should be 1)
- n=2 does NOT need a guard: `range(3, 3)` is empty → returns `prev2=2` (correct)

**5. Confusing DP with Backtracking**
- If you're about to write "generate all paths" → stop. That's Backtracking.
- If the question says "how many ways" → DP. Count, don't enumerate.

---

## Classic Problems

| Problem | Recurrence | Notes |
|---|---|---|
| Climbing Stairs | `f(n) = f(n-1) + f(n-2)` | base: f(1)=1, f(2)=2 |
| Fibonacci Number | `f(n) = f(n-1) + f(n-2)` | base: f(0)=0, f(1)=1 |
| House Robber | `f(n) = max(f(n-1), f(n-2) + nums[n])` | can't rob adjacent |
| Min Cost Climbing Stairs | `f(n) = min(f(n-1)+cost[n-1], f(n-2)+cost[n-2])` | take min path |
