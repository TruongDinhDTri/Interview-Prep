# Climbing Stairs — Complete Session Archive

**Pattern:** Linear DP (Bottom-Up) | **Difficulty:** Easy | **Date:** 2026-04-21

---

## 🗺️ The Journey — How Understanding Built

This problem started with a wrong instinct ("generate all permutations") and ended with a deep understanding of WHY `f(n) = f(n-1) + f(n-2)` — built from first principles by thinking about what stair you could have stepped from. The bottom-up vs tabulation confusion was NOT fully resolved in this session and needs more attention.

---

## 🎯 Step 1 — Understand

### Paraphrase (Wiganz → refined)

First instinct: *"I need to generate all permutations of 1s and 2s that sum to n"*

Correction: **You don't generate. You COUNT.**

Order matters (1,2 ≠ 2,1) → **Permutation** (not combination).

**Locked-in abstract version:**

> "Given n, count the number of distinct ordered sequences of 1s and 2s that sum to n."

### Constraint Questions Asked

- Is there only 1 valid answer? → YES — one integer
- What to return? → Integer — the count of distinct ways
- No negatives? → YES — n ≥ 1 always
- Empty/null? → NO — n always valid positive int
- n range? → 1 ≤ n ≤ 45 (small! fits easily in memory)
- Can take only 1 or 2 steps? → YES — constraint locks to exactly these two

### Trace by Hand

```
n=1: [1]                           → 1 way
n=2: [1,1], [2]                    → 2 ways
n=3: [1,1,1], [1,2], [2,1]        → 3 ways
n=4: [1,1,1,1], [1,1,2], [1,2,1], [2,1,1], [2,2]  → 5 ways
```

f(1)=1, f(2)=2, f(3)=3, f(4)=5... → Looks like **Fibonacci**!

---

## 🧠 Building the Recurrence — The Aha Journey

### Why f(n) = f(n-1) + f(n-2)?

**Wiganz's first instinct:** "Seems like Fibonacci?" ✅ Correct feeling, but WHY?

**Hadriel's question:** "To land on stair 3, where could you have stepped FROM?"

**Wiganz:** "Stair 2 and stair 1?" ✅

**Why that gives f(n-1) + f(n-2) — the worked example:**

f(2) = 2. Ways to reach stair 2:

```
[1, 1]
[2]
```

Take EACH path, add +1 step → reach stair 3:

```
[1, 1] → +1 → [1, 1, 1]  ✅
[2]    → +1 → [2, 1]     ✅
```

→ That's f(2) = 2 paths.

f(1) = 1. Ways to reach stair 1:

```
[1]
```

Take that path, add +2 step → reach stair 3:

```
[1] → +2 → [1, 2]  ✅
```

→ That's f(1) = 1 path.

**f(3) = f(2) + f(1) = 3 ✅**

### The KEY Insight Wiganz Derived Himself

> *"The steps that took 1 last step to reach me = f(n-1). The steps that took 2 last steps to reach me = f(n-2)."*

### Why ONLY n-1 and n-2?

**The constraint locks it.** The problem says you can ONLY take 1 or 2 steps. So to land on stair n, the last step was either 1 or 2. That means you came from n-1 or n-2. No other option exists.

> If the problem said "1, 2, OR 3 steps" → f(n) = f(n-1) + f(n-2) + f(n-3)
> **The allowed moves define the recurrence — always.**

### f(4) Traced (Same Logic)

f(3) = 3 ways: `[1,1,1]`, `[1,2]`, `[2,1]`

Add +1 to each → reach stair 4:

```
[1,1,1] → [1,1,1,1]  ✅
[1,2]   → [1,2,1]    ✅
[2,1]   → [2,1,1]    ✅
```

f(2) = 2 ways: `[1,1]`, `[2]`

Add +2 to each → reach stair 4:

```
[1,1] → [1,1,2]  ✅
[2]   → [2,2]    ✅
```

**f(4) = f(3) + f(2) = 3 + 2 = 5 ✅**

---

## 🧠 Step 2 — Approach

### DP vs Backtracking — The Critical Distinction

**Question Wiganz asked:** "How is this different from 'generate all subsets' — that's backtracking right?"

|              | Backtracking                   | Linear DP                             |
| ------------ | ------------------------------ | ------------------------------------- |
| What it does | **Generates** every path | **Counts** using stored results |
| Reuse?       | ❌ No — explores new branches | ✅ Yes — f(n-1) already computed     |
| Signal       | "generate all", "list all"     | "how many", "min/max"                 |

**Wiganz's own words:** *"reuse the old result"* — that IS the exact key.

Backtracking says: *"let me FIND all paths"*
DP says: *"I already KNOW f(n-1) — just add it"*

### DP Signal Keywords

| Signal                            | Means                         |
| --------------------------------- | ----------------------------- |
| "how many ways / distinct ways"   | count DP                      |
| "min/max steps/coins/operations"  | optimize DP                   |
| "can you reach / is it possible?" | reachability DP               |
| answer for n depends on smaller n | overlapping subproblems → DP |
| "climb / jump / tile / decode"    | classic Linear DP problems    |

### 3P Match Sentence

> "I see 'how many distinct ways' + f(n) depends on f(n-1) and f(n-2) — that's **Linear DP** because we have overlapping subproblems we can reuse instead of recomputing."

### 4P Reason (A, B, C)

**A — Brute force + why bad:**

> Pure recursion: `return f(n-1) + f(n-2)`. Each call branches into 2 more calls. Call tree has 2^n nodes → O(2^n) time. For n=45, that's trillions of calls. Way too slow.

**B — What DP does instead:**

> Bottom-up: compute each f(i) ONCE, starting from f(1) and f(2), building up to f(n). Each value computed exactly once → O(n) time. Only the last two values needed at any step → O(1) space.

**C — The invariant:**

> `f(i) = f(i-1) + f(i-2)` holds for every i from 3 to n. Base cases f(1)=1, f(2)=2 anchor the chain. No value is ever recomputed.

---

## 🔄 Bottom-Up vs Tabulation vs Memoization — NEEDS MORE STUDY ⚠️

**Wiganz explicitly said he still doesn't understand this. Revisit this section.**

### Three Flavors of the Same Idea

**1. Memoization (Top-Down + Cache)**

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def climbingStairs(n):
    if n == 1: return 1
    if n == 2: return 2
    return climbingStairs(n-1) + climbingStairs(n-2)
```

- Recursive, but caches results so each f(i) computed only once
- Time O(n), Space O(n) for cache + call stack

**2. Tabulation (Bottom-Up with Full Array)**

```python
def climbingStairs(n):
    if n == 1: return 1
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]   # fill the table
    return dp[n]
```

- Loop filling a dp[] array cell by cell from bottom to top
- Time O(n), Space O(n) for the array
- "Tabulation" = filling a TABLE. That's all it means.

**3. Space-Optimized (What We Used)**

```python
def climbingStairs(n):
    if n == 1: return 1
    prev1 = 1   # f(i-2)
    prev2 = 2   # f(i-1)
    for i in range(3, n + 1):
        curr = prev1 + prev2
        prev1 = prev2
        prev2 = curr
    return prev2
```

- Same loop as tabulation, but only keep last two values
- Time O(n), Space O(1)
- **This IS tabulation**, just optimized to not store the full array

**Why "bottom-up + tabulation" and "loop + reuse" are the same thing:**

- "Bottom-up" = start from f(1), build up to f(n)
- "Tabulation" = fill results into a table (array or variables)
- "Loop + reuse" = what it looks like in code
- Same concept. Different vocabulary.

**Memory trick:** Top-down = recursion + cache. Bottom-up = loop + table.

---

## 💡 The "Moving Forward" Analogy

**Wiganz connected this to Reverse Linked List — SAME intuition!**

```
prev2 → prev1 → curr
  ↑       ↑      ↑
 f(i-2) f(i-1)  f(i)

After each step:
prev2 = prev1   (slide forward)
prev1 = curr    (slide forward)
```

Two variables sliding forward, each step consuming the previous two. Same muscle memory as two-pointer "moving forward" pattern. 🔥

---

## ❌ Mistakes Made

**1. Brute force submitted as DP**

```python
# WRONG — this is O(2^n) pure recursion, NOT DP
def climbingStairs(n):
    if n == 1: return 1
    if n == 2: return 2
    return climbingStairs(n-1) + climbingStairs(n-2)
```

- No memoization = recomputes same subproblems exponentially
- This IS the brute force we said was too slow

**2. Wrong swap order**

```python
# WRONG swap
curr = prev1 + prev2
prev1 = prev2   # prev1 gets old prev2 (going backwards!)
prev2 = curr

# CORRECT swap
curr = prev1 + prev2
prev2 = prev1   # prev2 gets old prev1
prev1 = curr    # prev1 gets curr
```

OR: keep wrong swap but `return prev2` instead of `return prev1`. Both work.

**3. range(3, n) off-by-one**

```python
# WRONG — for n=3, range(3,3) = [] — loop never runs!
for i in range(3, n):
    ...

# CORRECT — include n itself
for i in range(3, n+1):
    ...
```

- **How caught:** Wiganz traced n=3 and got wrong answer
- `range(3, n)` = `[3, 4, ..., n-1]` — excludes n
- `range(3, n+1)` = `[3, 4, ..., n]` — includes n ✅

**4. Skipped Blueprint (comments-first phase)**

- Went straight to code without writing numbered comments first
- Rule: Spoken → Written → Code. Always comments before implementation.

---

## ✅ Clean Solution

```python
def climbingStairs(n: int) -> int:
    if n == 1: return 1
    prev1 = 1   # f(1)
    prev2 = 2   # f(2)
    for i in range(3, n + 1):
        curr = prev1 + prev2
        prev1 = prev2
        prev2 = curr
    return prev2
```

**Time:** O(n) — one pass from 3 to n
**Space:** O(1) — only two variables regardless of n

---

## 🔥 Edge Cases

| Case         | n  | Expected   | What Happens                             | Handled?                |
| ------------ | -- | ---------- | ---------------------------------------- | ----------------------- |
| Single stair | 1  | 1          | guard clause fires                       | ✅`if n==1: return 1` |
| Two stairs   | 2  | 2          | loop empty (range(3,3)), returns prev2=2 | ✅                      |
| Three stairs | 3  | 3          | loop runs once, curr=3, returns prev2=3  | ✅ after range fix      |
| Large n      | 45 | 1836311903 | O(n) handles easily                      | ✅                      |

**Key insight for n=2:** No guard clause needed. `range(3, 3)` is empty → loop never runs → returns `prev2 = 2` naturally. ✅

**Why n=1 DOES need a guard:** `range(3, 2)` is empty → returns `prev2 = 2` → WRONG (should be 1). ❌

---

## 📚 Key Concepts for Recall

1. **The recurrence:** f(n) = f(n-1) + f(n-2) — because you can ONLY reach stair n from n-1 or n-2
2. **The allowed moves define the recurrence** — always
3. **DP vs Backtracking:** DP counts by reusing, Backtracking generates by exploring
4. **Bottom-up = loop from base cases up** — same thing as tabulation
5. **"Moving forward" = sliding two variables** — same pattern as two pointers
6. **range(3, n+1) not range(3, n)** — include n itself
7. **n=1 guard is necessary, n=2 guard is NOT needed**
