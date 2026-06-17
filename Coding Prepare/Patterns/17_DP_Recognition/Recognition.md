# Dynamic Programming — Problem Spotting

> **Use this BEFORE choosing a DP sub-type.**
> It answers: "Is this DP?" and "Which DP shape am I looking at?"
> Specific sub-types → see `11_Knapsack_01_DP.md`, `16_Linear_DP.md`

---

## LAYER 1 — Is This DP?

The two mandatory properties. **Both must be true.** If either is missing → not DP.

| Property | What It Means | How to Spot It |
|---|---|---|
| **Overlapping Subproblems** | The same sub-answer is needed multiple times | "I'm computing f(3) inside f(5) AND inside f(4)" → reuse instead of recompute |
| **Optimal Substructure** | The best answer to the whole = built from best answers to parts | "The min cost path through node N uses the min cost path to reach N" |

**Quick gut-check:** Can you write a plain recursion that solves it?
→ YES → Check if it recomputes the same args → YES → DP opportunity.

---

## LAYER 2 — The 5 DP Question Signals

| If the problem asks... | DP signal | Type |
|---|---|---|
| "How many **ways** / **distinct** paths" | ✓ Count DP | Linear or 2D |
| "**Minimum** / **maximum** cost, steps, coins" | ✓ Optimize DP | Linear, Knapsack, or 2D |
| "**Can you reach** / **is it possible**" | ✓ Reachability DP | Linear or Knapsack |
| "**Take or skip** each item, limited **capacity**" | ✓ Knapsack DP | 0/1 or Unbounded |
| "Compare / align **two strings/sequences**" | ✓ String DP | LCS / Edit Distance |
| "**Generate all** / **list all**" | ✗ → Backtracking instead | — |

**The single clearest signal:** *"answer for n depends on answer for smaller n — and those smaller n's overlap."*

---

## LAYER 3 — Which DP Shape?

Once you know it's DP, pick the shape from the problem's structure:

```
One sequence, decisions at each step
  ├─ "take 1 or 2 steps", "rob or skip", Fibonacci-style
  └─ → LINEAR DP (see 16_Linear_DP.md)

Items with weight + capacity limit, each item once
  └─ → 0/1 KNAPSACK (see 11_Knapsack_01_DP.md)

Items can be REUSED (coins, tiles)
  └─ → UNBOUNDED KNAPSACK ↓

Two strings or sequences being COMPARED / ALIGNED
  └─ → STRING DP (LCS, Edit Distance) ↓

Grid — move through cells (right/down)
  └─ → 2D GRID DP ↓
```

---

## Shape: Unbounded Knapsack

**Signal:** items can be reused indefinitely + capacity/target exists

| Classic Problem | Signal phrase |
|---|---|
| Coin Change (min coins) | "any denomination, unlimited supply, make amount" |
| Coin Change II (ways) | "how many ways to make amount" |
| Cutting Rod | "cut into pieces of any length, maximize value" |

**Key difference from 0/1:** inner loop goes **FORWARD** (allows reuse), not backward.

```python
def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for a in range(coin, amount + 1):   # FORWARD → allows reuse
            dp[a] = min(dp[a], dp[a - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
# Time: O(amount × coins) | Space: O(amount)
```

**Trap:** Using backward loop (0/1 pattern) on an unbounded problem → each coin used at most once → WRONG.

---

### Example Deep Dive — Coin Change (#322)

**Problem:** Given coins of any denomination with unlimited supply, find the minimum number of coins to make `amount`. Return -1 if impossible.

#### Signals that point to DP (how to read the problem)

| Signal you see | What it tells you |
|---|---|
| "minimum number of" + "combinations/selections" | Optimize DP — not counting, not reachability |
| Infinite supply of items + reach a target | Unbounded Knapsack — items can be reused |
| Subproblem inside subproblem of the SAME type | Classic DP shape: `minCoins(15)` → `minCoins(10)` → same question |
| Overlapping subproblems | `minCoins(10)` is called from multiple paths: from 15 via coin 5, from 11 via coin 1, etc. |

#### Why greedy fails here

Greedy (always pick the largest coin that fits) gives the **wrong answer** on certain inputs:

```
coins = [1, 3, 4], amount = 6
Greedy: 4 + 1 + 1 = 3 coins  ❌
DP:     3 + 3     = 2 coins  ✅
```

Greedy fails because a locally optimal choice (coin 4) blocks the globally optimal path (two 3s). Any time greedy fails → DP is the tool.

#### Recurrence

```
dp(amt) = min(1 + dp(amt - coin)  for each coin in coins)
```

Read it as: "To make `amt`, try subtracting each coin, recurse on the remainder, add 1 for the coin used. Take the minimum."

**Base cases:**
- `dp(0) = 0` — zero coins needed to make amount 0
- `dp(negative) = float('inf')` — impossible; don't count this path

#### Two implementations

**Top-Down (recursion + HashMap memoization):**
```python
def coinChange(coins, amount):
    memo = {}
    def dp(amt):
        if amt == 0: return 0
        if amt < 0:  return float('inf')
        if amt in memo: return memo[amt]
        memo[amt] = min(1 + dp(amt - c) for c in coins)
        return memo[amt]
    result = dp(amount)
    return result if result != float('inf') else -1
# Time: O(amount × coins) | Space: O(amount)
```

**Bottom-Up (tabulation — the interview default):**
```python
def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for a in range(coin, amount + 1):   # FORWARD → allows reuse
            dp[a] = min(dp[a], dp[a - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
# Time: O(amount × coins) | Space: O(amount)
```

**When to use which:**
- Top-Down: easier to reason about — write the recurrence, add a cache, done
- Bottom-Up: slightly faster in practice (no recursion overhead), preferred in interviews once you understand the pattern

#### Complexity
- **Time:** O(amount × len(coins)) — for each amount from 1 to amount, try every coin
- **Space:** O(amount) — dp array of size amount + 1

---

## Shape: String DP (LCS / Edit Distance)

**Signal:** two strings s1, s2 — compare, align, transform, or find commonality

| Classic Problem | Signal phrase | dp[i][j] means |
|---|---|---|
| Longest Common Subsequence | "longest subsequence in both" | LCS of s1[:i] and s2[:j] |
| Edit Distance | "min operations to transform s1 → s2" | min edits for s1[:i] → s2[:j] |
| Longest Common Substring | "contiguous common portion" | length of common substr ending at i,j |
| Is Subsequence | "can s1 be found in s2 in order?" | reachability DP |

**LCS recurrence — the template:**
```python
def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1    # chars match → extend
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])   # skip one char
    return dp[m][n]
# Time: O(m×n) | Space: O(m×n)
```

**Trap:** String DP is almost always 2D — `dp[i][j]` where i indexes s1 and j indexes s2. If you try to flatten it to 1D, you lose the cross-string relationship.

---

## Shape: 2D Grid DP

**Signal:** grid/matrix — move from top-left to bottom-right, count paths or minimize cost

| Classic Problem | Signal phrase | Note |
|---|---|---|
| Unique Paths | "how many ways to reach bottom-right" | only right/down moves |
| Min Path Sum | "minimum cost path, right/down only" | grid values are costs |
| Triangle Min Path | "min path from top to bottom" | pyramid shape |
| Maximal Square | "largest square of all 1s" | grid of 0/1 |

**Unique Paths recurrence:**
```python
def uniquePaths(m, n):
    dp = [[1] * n for _ in range(m)]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]   # from above + from left
    return dp[m-1][n-1]
# Time: O(m×n) | Space: O(m×n) → can optimize to O(n)
```

**Space optimization:** Grid DP with only top/left dependency → keep only previous row.

---

## Decision Flowchart (Interview Use)

```
Problem spotted as DP? (overlapping subproblems + optimal substructure)
              │
    ┌─────────┴────────────┐
    │                      │
 1 sequence            2 sequences
 or 1D                  (strings)
    │                      │
    ├─ Fibonacci-style      └─ STRING DP
    │  (take/skip 1 step)     (LCS/Edit Distance)
    │  → LINEAR DP
    │
    ├─ Items + capacity, each once
    │  → 0/1 KNAPSACK
    │
    ├─ Items + capacity, reuse ok
    │  → UNBOUNDED KNAPSACK
    │
    └─ Grid movement (right/down)
       → 2D GRID DP
```

---

## Master Signal Table

| Signal Keyword | DP Type |
|---|---|
| climb stairs / jump game / decode ways | Linear DP |
| rob houses / max profit (skip adjacent) | Linear DP |
| coin change / rod cutting (reuse) | Unbounded Knapsack |
| "minimum number of" + "unlimited supply" + reach target | Unbounded Knapsack |
| greedy fails (local best ≠ global best) | DP required — check Unbounded Knapsack |
| subset sum / partition equal subset | 0/1 Knapsack |
| LCS / edit distance / align two strings | String DP |
| unique paths / min path sum in grid | 2D Grid DP |
| largest square / dungeon game | 2D Grid DP |
| palindrome subsequence / longest palindrome | String DP |

---

## Universal DP Traps

1. **Plain recursion ≠ DP** — you MUST add memoization or tabulation. `f(n-1) + f(n-2)` alone is O(2ⁿ).
2. **"Generate all" → Backtracking** — if the answer is a list of solutions, not a count/min/max.
3. **Wrong loop direction for Knapsack** — 0/1 = backward, Unbounded = forward.
4. **String DP needs 2D** — one dimension per string. Don't flatten prematurely.
5. **Off-by-one on dp size** — `dp = [0] * (n + 1)` not `n`, because dp[0] = base case.
6. **Greedy feels right but fails** — if you can construct a counter-example where the locally optimal pick leads to a globally worse result (e.g., `coins=[1,3,4], amount=6`), greedy is wrong. Reach for DP.
