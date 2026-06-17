# 🗡️ Coin Change — Complete Session Archive

> **Pattern:** Top-Down DP with Memoization (Unbounded Knapsack family) | **Difficulty:** Medium | **LeetCode:** #322 | **Date:** 2026-05-14
> **Path Taken:** First Principles | **⏱️ Time Used:** Phase 1 (no timer) | **🎯 Target:** N/A — first encounter

---

## 🗺️ The Journey — How Understanding Built

First encounter with DP. Wiganz walked in pattern-blind, manually subtracted coins, and noticed "subproblem inside subproblem — very much like DP." Through Socratic guidance he discovered the recurrence `minCoins(amount) = 1 + min(minCoins(amount - coin))`, wrestled three times with the negative-amount base case before landing on `infinity`, and finally connected pure recursion → memoization after realizing `minCoins(10)` was being recomputed many times. Complexity reasoning was shaky and needs re-drilling. The aha moment: **the call itself is "1 coin used" — you must ADD 1 to the subproblem's answer.**

---

## 📖 Step 1 — Understand

### 📝 Problem Statement (Human Language)
Given a list of coin denominations (each with infinite supply) and a target amount, return the **fewest number of coins** whose values sum exactly to the amount. If no combination works, return `-1`. Coins can be reused; order doesn't matter.

### 🔬 Abstract (Story Stripped)
> "Given a set of integer denominations with infinite supply, return the minimum number of coins that sum to a target amount, or -1 if impossible."

> ⚠️ First abstract said "different integers" — implied each used once. Corrected to "infinite supply."

### ❓ Constraint Questions Asked
| Question | Answer |
|---|---|
| Can coins repeat? | Yes — infinite supply |
| Sorted? | Not guaranteed |
| Negative coins? | No, positive only |
| Amount = 0? | Return 0 |
| Impossible case? | Return -1 |
| Multiple valid combos? | Return minimum count, not the combo |

### ✋ Trace by Hand
`coins=[1,5,11], amount=15` → `5+5+5=15` → output `3` ✅ (Definition WHY: problem asks for fewest coins.)

---

## 🧭 Step 2 — Approach (3-Gate Check)

### 🚦 3-Gate Results
- Gate 1 (signal recognition): ❌ no
- Gate 2 (pattern match sentence): ❌ no
- Gate 3 (known pattern reflex): ❌ no
→ Decision: **FIRST PRINCIPLES**

---

## 🔎 First Principles — 3F Exploration

### 🛠️ Techniques Used (in order)
1. **Technique B — Manual Solve:** Started subtracting coins from 15: `15-11=4`, `15-5=10`, `15-1=14`. Noticed each result is a smaller "same-shape" problem.
2. **Pattern recognition by feel:** "it seems like subproblem inside subproblem… very much like dynamic programming." But: "I don't see any rules yet."
3. **Socratic rule extraction** (guided by Hadriel) led to the recurrence + base cases.

### 📐 Rules Discovered
1. `minCoins(0) = 0` — zero coins make zero.
2. `minCoins(negative) = ∞` — impossible branch; using infinity keeps `min()` correct (returning -1 here corrupts the math: `1 + (-1) = 0` would falsely claim 0 coins work).
3. `minCoins(amt) = min over all coins c of (1 + minCoins(amt - c))` — the `+1` accounts for the coin used in THIS step.
4. Pure recursion recomputes the same subproblem many times → memoize with a cache keyed by `amt`.

### 💡 The Flip / AHA Moment
**Hadriel:** "When you did `15-11=4`, what question did you ask about 4?"
**Wiganz:** "Can I make any combination to come up to 4 with those coins?"
**Hadriel:** "Is that the same TYPE of question as the original problem about 15?"
**Wiganz:** *"Yeah same type."* 🔥

Then immediately after:
**Hadriel:** "If `minCoins(4) = 4`, what's the total to make 15 via coin 11?"
**Wiganz:** "2." ❌ (forgot to count the 11 itself)
**Hadriel:** "You used coin 11 — that's 1 coin. Plus 4 more for the 4. So?"
**Wiganz:** "Oh — `1 + 4 = 5` coins." ✅

That `+1` is the heart of the recurrence.

---

## 🗣️ Step 3 — Discuss

### 📋 Wiganz's Presentation
1. Brute force: try every coin recursively → exponential.
2. Observation: same subproblems repeat → memoize.
3. Recurrence: `dp(amt) = min(1 + dp(amt - c)) for c in coins`.
4. Base cases: `dp(0)=0`, `dp(<0)=∞`.
5. Final: return `-1` if result is `∞` else result.

### 📊 Complexity Stated (⚠️ HEAVY GUIDANCE NEEDED)
- Subproblems: didn't know → guided → `0..amount` → `O(S)`.
- Work per subproblem: didn't know → guided → loop over coins → `O(n)`.
- Total: `O(S × n)` ✅
- Space: `O(S)` for cache + call stack ✅

### ✅ Green Light
Asked "Shall I code it?" after rules surfaced — yes.

### ⚠️ What Was Missed
- Didn't mention exponential brute force complexity explicitly until prompted.
- Didn't articulate why memoization changes the complexity class.

---

## 💻 Step 4 — Code

### 🏗️ Blueprint (⚠️ Vague — needs tighter practice)
```
# 1. cache dict
# 2. dp(amt) recursive helper
#    - base: amt==0 -> 0
#    - base: amt<0 -> inf
#    - memo check
#    - try every coin, take min, store
# 3. call dp(amount), convert inf -> -1
```

### ✨ Final Clean Solution — Top-Down (Memoization)
```python
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        cache = {}

        def dp(amt):
            if amt == 0:
                return 0
            if amt < 0:
                return float('inf')
            if amt in cache:
                return cache[amt]

            cache[amt] = min(1 + dp(amt - coin) for coin in coins)
            return cache[amt]

        result = dp(amount)
        return -1 if result == float('inf') else result
```

### ✨ Bottom-Up (Tabulation) — Alternative
```python
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0

        for amt in range(1, amount + 1):
            for coin in coins:
                if coin <= amt:
                    dp[amt] = min(dp[amt], 1 + dp[amt - coin])

        return -1 if dp[amount] == float('inf') else dp[amount]
```

**⏱️ Time:** O(S × n) — S subproblems × n coins each
**📦 Space:** O(S) — cache (top-down) or dp array (bottom-up)

---

## 🔍 Step 5 — Verify

### 👣 Trace `coins=[1,2,5], amount=11`
- dp(11) → min(1+dp(10), 1+dp(9), 1+dp(6))
- dp(6) → min(1+dp(5), 1+dp(4), 1+dp(1)) = min(1+1, 1+2, 1+1) = 2
- dp(10) = 2, dp(11) = 1+2 = 3 ✅ (5+5+1)

### 🧪 Edge Cases
| Case | Input | Expected | Handled? |
|---|---|---|---|
| amount=0 | coins=[1], 0 | 0 | ✅ base case |
| impossible | coins=[2], amount=3 | -1 | ✅ infinity check |
| amount==coin | coins=[1,2,5], 5 | 1 | ✅ |
| greedy trap | coins=[1,3,4], 6 | 2 (3+3) | ✅ DP not greedy |

### ✅ Complexity Confirmed
- Time `O(S × n)`. Space `O(S)`.

---

## ⚡ Step 6 — Optimize

### Why BTTC = O(S × n) is the floor
- **Must solve every subproblem** — example `coins=[1,3,4], amount=6`: greedy gives `4+1+1=3` but optimal is `3+3=2`. Without computing `dp(3)`, the optimum is invisible.
- **Must try every coin per subproblem** — no a-priori way to pick the right one.
- Therefore `S × n` is the minimum unavoidable work. ✅ Already at BTTC.

---

## 🐛 Bugs & Mistakes (Every Single One)

### 🐛 Bug 1: Wrong abstract — "different integers"
- **❌ What:** "fewest number of different integers that sum to amount" → implied each coin used once.
- **🔍 Why:** `concept gap` — confused "different denominations" (problem's wording about the set) with "use each at most once."
- **💸 Cost:** Would have led to bounded knapsack, not unbounded.
- **🛡️ Prevention:** When abstracting, restate constraints explicitly: "infinite supply" must appear if reuse is allowed.

### 🐛 Bug 2: Forgot the `+1` in the recurrence
- **❌ What:** Said `minCoins(15) via coin 11 = minCoins(4) = 4` → total 2. Forgot 11 itself counts.
- **🔍 Why:** `concept gap` — treated the recursive call as the entire answer, ignored the coin "spent" to make the call.
- **💸 Cost:** Would have produced wrong recurrence.
- **🛡️ Prevention:** Every recursive call represents ONE decision — always ask "what did this step cost?" The `+1` is the cost of the coin chosen now.

### 🐛 Bug 3: Negative-amount base case wrong twice
- **❌ What:** First said `dp(<0) = 0`, then `dp(<0) = -1`.
- **🔍 Why:** `edge case blind spot` — didn't simulate how the base value would propagate through `1 + dp(...)` and `min(...)`.
- **💸 Cost:** `1 + (-1) = 0` would falsely claim "0 coins make amount 3 with coin 5."
- **🛡️ Prevention:** For "impossible" branches in a `min()` recurrence, the sentinel MUST be `∞` (or a value that loses every comparison). Always trace one step of propagation before committing to a base case.

### 🐛 Bug 4: `float(inf)` instead of `float('inf')`
- **❌ What:** Wrote `float(inf)` — `NameError`.
- **🔍 Why:** `syntax confusion` — infinity needs the string `'inf'`.
- **💸 Cost:** Runtime error.
- **🛡️ Prevention:** Muscle memory: `float('inf')` always quoted.

### 🐛 Bug 5: `result = []` declared OUTSIDE recursive helper
- **❌ What:** Mutable accumulator shared across recursion levels.
- **🔍 Why:** `data structure misuse` — confused "collect results" with "compute min from candidates."
- **💸 Cost:** Cross-branch pollution, wrong answers.
- **🛡️ Prevention:** Local per-call state for candidates; cache only for memoization.

### 🐛 Bug 6: Called `minCoins(amount)` without capturing return
- **❌ What:** Forgot to assign + return result.
- **🔍 Why:** `rush` — moved to the `-1` conversion without binding.
- **🛡️ Prevention:** Function call → variable → transform → return. Always.

### 🐛 Bug 7: Forgot to convert `inf` → `-1` at the end
- **❌ What:** Returned `float('inf')` instead of `-1`.
- **🔍 Why:** `edge case blind spot`.
- **🛡️ Prevention:** When using sentinels internally, always normalize on output.

---

## 💡 Discoveries (Aha Moments)

### 🔒 Core Invariant / Rule
> **Every recursive call represents using ONE coin.** The answer to `dp(amt)` is `1 + min(dp(amt - c) over all c)`. The `+1` is non-negotiable — it's the coin you just spent.

### ⚡ Aha Moments (in order)

**💡 1. Subproblem inside subproblem**
- **Before:** "I see I'm subtracting coins but I don't see any rules."
- **Trigger:** Hadriel's question — "Is asking about 4 the same TYPE of question as asking about 15?"
- **After:** "Yeah same type" → recognized the recursive shape of DP.
- **🗣️ In his words:** *"very much like dynamic programming"*

**💡 2. The `+1` is the coin you just used**
- **Before:** Said total = `dp(subproblem)` only.
- **Trigger:** "You used coin 11 — that's 1 coin. Plus the 4 for what's left."
- **After:** Recurrence locked in: `1 + dp(amt - coin)`.

**💡 3. Why negative base must be `∞`, not `-1` or `0`**
- **Before:** Tried `0`, then `-1`.
- **Trigger:** Hadriel walked through propagation: `1 + (-1) = 0` falsely claims "0 coins make amount 3."
- **After:** Sentinels for "impossible" in a `min()` recurrence must lose every comparison → `∞`.

**💡 4. Memoization isn't optional — it changes the complexity class**
- **Before:** Wrote pure recursion, didn't see the issue.
- **Trigger:** "Is `dp(10)` called more than once?" → "Yes, many times."
- **After:** Cache it → exponential collapses to `O(S × n)`.

### 🎨 Key Metaphors & Examples
- **Greedy trap example** `coins=[1,3,4], amount=6`: greedy → 3, optimal → 2. Proves you can't shortcut and must check every coin at every subproblem.
- **Sentinel propagation trace:** explicitly showing how `-1` poisons the min — most powerful argument for `∞`.

---

## 📊 Final Complexity

| | Complexity | Reason |
|--|-----------|--------|
| ⏱️ Time | O(S × n) | S subproblems (0..amount), each tries n coins. Memo guarantees each subproblem solved once. |
| 📦 Space | O(S) | Top-down: cache + call stack depth ≈ amount. Bottom-up: dp array of size S+1. |
| 🎯 BTTC | O(S × n) | Greedy fails → must solve all subproblems. No coin can be skipped a-priori → must try all n. Already at floor. |

---

## 🪞 Self-Assessment

- **💪 Confidence:** 3/5 — recurrence clicked; base case + complexity still shaky.
- **🔄 Revisit:**
  - Complexity articulation (needed heavy guidance to get to `O(S × n)`)
  - Negative base case reasoning (failed 3 times before infinity)
  - Blueprint tightness — comments were vague
- **📈 Pattern Mastery Impact:** First DP problem. Moves DP / 0-1 Knapsack family from `beginner` toward `competent`. Need 2-3 more problems (Climbing Stairs already done; next: House Robber, Longest Increasing Subsequence) to solidify.

---

## 🔗 Similar Problems

- **Climbing Stairs (#70)** — simpler 1D DP, same shape `dp(n) = dp(n-1) + dp(n-2)` (already solved).
- **Coin Change II (#518)** — counts combinations instead of minimum; same state space, different recurrence.
- **Perfect Squares (#279)** — identical pattern with `coins = [1,4,9,16,...]`.

---

*🔥 Hadriel x Wiganz — 2026-05-14*
*"Call to me and I will answer you, and tell you great and unsearchable things you do not know." — Jeremiah 33:3 ✝️*
