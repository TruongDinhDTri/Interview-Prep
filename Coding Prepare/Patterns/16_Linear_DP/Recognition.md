# Linear DP

## What Linear DP Actually Is

**Linear DP = the DP whose table needs only ONE row.** One index — `dp[i]` — is enough to name any subproblem.

That's the entire definition, and "linear" means it literally: the table lies along a **line**, not a grid.

```
Linear DP — Climbing Stairs          2D DP — Unique Paths
                                          c0   c1   c2
      i=1  i=2  i=3  i=4  i=5       r0  │ 1 │ 1 │ 1 │
dp = [ 1    2    3    5    8 ]      r1  │ 1 │ 2 │ 3 │
      ↑ ONE index → ONE row         r2  │ 1 │ 3 │ 6 │
                                          ↑ TWO indices → a grid
```

Everything else in DP-land needs two numbers to name a subproblem — Unique Paths needs (row, col), Knapsack needs (item, capacity), String DP needs (position in s1, position in s2). Those are all 2D. Linear DP is the one that needs just one.

**The test:** try to finish the sentence *"`dp[i]` is ..."* out loud. If one index says it completely → Linear DP. If you find yourself needing a second number → it's a different shape (→ [DP Recognition](../17_DP_Recognition/Recognition.html) to find which).

---

## Why These Problems Share a Folder

Climbing Stairs, Fibonacci, House Robber, Min Cost Climbing Stairs — they look like completely unrelated problems (stairs? burglary?). They're grouped for exactly **one** reason:

> **One sequence, and the answer at position `n` is built from answers at smaller positions.**

That's it. That's the whole criterion. **The formula inside is a separate question** — some of these add, some take a max. Don't expect the four problems to look alike; expect them to have the same *shape of dependency*.

---

## Spot It

| Signal | Linear DP |
|--------|-----------|
| "how many ways / distinct ways" | ✓ counting DP |
| "minimum steps / coins / cost to reach" | ✓ optimizing DP |
| "can you reach / is it possible?" | ✓ reachability DP |
| answer at `i` depends on `i-1`, `i-2`, `i-k` | ✓ overlapping subproblems |
| "climb / jump / tile / decode / rob" | ✓ classic linear DP |
| you can say `"dp[i] is ..."` with **one** index | ✓ it's 1D → Linear |
| naming a subproblem needs **two** numbers | ✗ → 2D shape, see DP Recognition |
| "generate all" / "list all" | ✗ → Backtracking instead |

**DP vs Backtracking:** Backtracking **generates** the paths themselves ("list all"). DP **counts or optimizes** using stored results ("how many", "min/max"). Wiganz's rule: *"reuse the old result" = DP*.

---

## Finding the Recurrence — One Question

Don't memorize `f(n) = f(n-1) + f(n-2)`. Ask:

> ### **"What was the LAST move that got me to `i`?"**

List every possibility, then join them. That's the whole method.

**Climbing Stairs, moves of 1 or 2:** the last move landed here either from `i-1` (a 1-step) or from `i-2` (a 2-step). Two possibilities:
```
dp[i] = dp[i-1] + dp[i-2]
```

**Change the rules — moves of 1, 2, or 3:** now the last move came from `i-1`, `i-2`, **or** `i-3`. Three possibilities:
```
dp[i] = dp[i-1] + dp[i-2] + dp[i-3]
```

**Moves of 1 or k:**
```
dp[i] = dp[i-1] + dp[i-k]
```

The formula changes; the question doesn't. **The allowed moves ARE the recurrence.**

---

## Counting vs Optimizing — Why Some Add and Some Take Max

This is the part that trips people. Both are Linear DP, both look at `dp[i-1]` and `dp[i-2]` — but one adds them and the other picks one and throws the rest away. The difference isn't arbitrary:

### Counting → `+`

The branches are **distinct valid paths, and every one of them counts**. Reaching step 4 via "…then a 1-step" and reaching it via "…then a 2-step" are two *different* sets of routes, both real. Add them to get the total.

```
Climbing Stairs:  dp[i] = dp[i-1] + dp[i-2]
Fibonacci:        dp[i] = dp[i-1] + dp[i-2]
```

### Optimizing → `max` / `min`

The branches are **competing alternatives for the same single plan**. You cannot both rob and not-rob house 3 in one night — those aren't two routes you're tallying, they're two proposals and you pick the better one. Keep the winner, discard the loser.

```
House Robber:  dp[i] = max( dp[i-1],  dp[i-2] + nums[i] )
                        └ skip house i   └ rob it, so skip i-1
```

**Walk it — houses `[2, 7, 9, 3, 1]`:**

```
house 1 (2đ):  only one house         → dp = 2
house 2 (7đ):  can't take both 1 & 2  → max(2, 7)      = 7
house 3 (9đ):  rob it → 9 + dp[1] = 11
               skip it → dp[2] = 7    → max(11, 7)     = 11
house 4 (3đ):  rob it → 3 + dp[2] = 10
               skip it → dp[3] = 11   → max(10, 11)    = 11
house 5 (1đ):  rob it → 1 + dp[3] = 12
               skip it → dp[4] = 11   → max(12, 11)    = 12  ✅
```

If you'd *added* `11 + 7` at house 3 you'd get 18 — a number that corresponds to no possible night of burglary. That's the tell: **in an optimizing problem, adding the branches produces a meaningless number.**

| Question asks | Join with | Because |
|---|---|---|
| "how many ways" | `+` | every branch is a separate valid route; total them |
| "max / min / best" | `max` / `min` | branches compete for one plan; keep the winner |
| "can you reach it" | `or` | any one working branch is enough |

---

## The Four Questions (from [Foundations](../../Foundations/Dynamic%20Programming/Dynamic%20Programming.html))

Every DP problem, Linear or not, is these four answers. On Climbing Stairs:

| | Question | Climbing Stairs |
|---|---|---|
| 1 | **State** — what does `dp[i]` mean? | number of ways to reach step `i` |
| 2 | **Recurrence** — how do smaller cells build it? | `dp[i] = dp[i-1] + dp[i-2]` |
| 3 | **Base case** — which cells are filled by hand? | `dp[1] = 1`, `dp[2] = 2` |
| 4 | **Answer** — which cell do I return? | `dp[n]` — the last one |

If you can't say #1 as a complete sentence, you don't have the problem yet. Everything else fails downstream from a vague state.

---

## Is It Really DP? (both must hold)

- **Overlapping subproblems** — plain recursion recomputes the same `f(k)` from several branches. Draw the Climbing Stairs recursion tree: it's Fibonacci-shaped, `f(3)` shows up under both `f(5)` and `f(4)`. ✓
- **Optimal substructure** — to build `f(5)` you only need the **result numbers** of `f(4)` and `f(3)`, not the individual routes inside them. ✓

---

## The Core — Three Templates

**Template 1: Space-optimized (O(1) space) — preferred**
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

**Template 2: Tabulation, full array (O(n) space)** — keep the whole row when you need to look back further than 2, or when debugging.
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

**Template 3: Memoization (top-down)** — the recurrence written literally, plus a cache.
```python
from functools import lru_cache

@lru_cache(maxsize=None)
def climbingStairs(n: int) -> int:
    if n == 1: return 1
    if n == 2: return 2
    return climbingStairs(n-1) + climbingStairs(n-2)
# Time: O(n) | Space: O(n) for cache + call stack
```

**Same thing, different words:**

| Term | Meaning |
|---|---|
| Bottom-up | start from base cases, build up to n |
| Tabulation | fill a table (dp array) cell by cell |
| Loop + reuse | what it looks like in code |
| Space-optimized tabulation | tabulation, but only keep the last K values |

All four name the same approach. **Top-down** = recursion + cache (memoization) — the other direction.

---

## Traps

**1. Off-by-one in range**
```python
for i in range(3, n):       # WRONG — for n=3, range(3,3) is empty
for i in range(3, n + 1):   # CORRECT
```

**2. Wrong swap order**
```python
# WRONG — prev1 is overwritten before it's used
curr = prev1 + prev2
prev1 = prev2
prev2 = curr

# CORRECT
curr = prev1 + prev2
prev2 = prev1
prev1 = curr
```
Or keep the first swap and `return prev2` — both work, just be consistent.

**3. Plain recursion submitted as DP**
```python
return f(n-1) + f(n-2)   # O(2ⁿ) — this is brute force, not DP
```
DP needs a cache (memoization) **or** a loop (tabulation). Without one of those, nothing is being reused.

**4. Missing base case guard** — `n=1` needs a guard (without it `range(3, 2)` is empty → returns `prev2=2`, wrong). `n=2` does not (`range(3, 3)` is empty → returns `prev2=2`, correct).

**5. Adding when you should be maximizing** — see Counting vs Optimizing above. If the branches are competing plans, `+` gives a number that means nothing.

**6. Confusing DP with Backtracking** — about to write "generate all paths"? Stop, that's Backtracking. "How many ways" → DP: count, don't enumerate.

---

## Classic Problems

| Problem | Recurrence | Type | Notes |
|---|---|---|---|
| Climbing Stairs | `f(n) = f(n-1) + f(n-2)` | counting | base: f(1)=1, f(2)=2 |
| Fibonacci Number | `f(n) = f(n-1) + f(n-2)` | counting | base: f(0)=0, f(1)=1 |
| House Robber | `f(n) = max(f(n-1), f(n-2) + nums[n])` | optimizing | can't rob adjacent |
| Min Cost Climbing Stairs | `f(n) = min(f(n-1)+cost[n-1], f(n-2)+cost[n-2])` | optimizing | take the cheaper path |

---

## Where This Sits

- **[Foundations — Dynamic Programming](../../Foundations/Dynamic%20Programming/Dynamic%20Programming.html)** — what DP is at all, the 2 conditions, memoization vs tabulation, the 4-question skeleton, deciding 1D vs 2D.
- **[17 — DP Recognition](../17_DP_Recognition/Recognition.html)** — the map. Given a fresh problem: is it DP, and which of the five shapes? Linear DP is one branch of that tree.
- **[11 — 0/1 Knapsack](../11_Knapsack_01_DP/Recognition.html)** — the sibling shape, for when one index isn't enough.
