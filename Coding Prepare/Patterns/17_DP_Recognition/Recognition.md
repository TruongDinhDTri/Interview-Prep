# DP Recognition — The Triage Card

> **This card answers two questions, fast:** *"Is this DP?"* and *"Which DP shape am I looking at?"*
> It does **not** teach DP theory (→ [Foundations](../../Foundations/Dynamic%20Programming/Dynamic%20Programming.html)) and it does **not** teach any single shape in depth (→ the shape's own folder, or the [Deep-Guide](Deep-Guide.html)).

---

## STEP 1 — Is this DP? (30 seconds, no theory)

Don't re-derive the definitions in the room. Just run these three, in order:

| # | Do this | If yes |
|---|---|---|
| 1 | **Write the plain recursion** — the obvious brute force, no storage. Can you? | continue |
| 2 | **Does it recompute the same argument?** Trace two levels: does `f(3)` get called from more than one branch? | overlapping subproblems ✓ |
| 3 | **Do you only need the child's RESULT** to build the parent — not the details inside it? | optimal substructure ✓ |

**All three → DP.** Any one fails → not DP.

**Fastest single tell:** *"the answer for `n` depends on the answer for smaller `n` — and those smaller `n`'s repeat."*

> 🧠 Fuzzy on **why** those two conditions are the requirement? That's theory — go back to
> **[Foundations → Dynamic Programming](../../Foundations/Dynamic%20Programming/Dynamic%20Programming.html)**.
> This card assumes you already know, and just want to check a real problem quickly.

---

## STEP 2 — What kind of DP question is it?

Which *flavour* the problem asks for. This decides the operation you'll join branches with:

| The problem asks… | Flavour | Join branches with |
|---|---|---|
| "how many **ways** / **distinct** paths" | Count DP | `+` |
| "**minimum** / **maximum** cost, steps, coins" | Optimize DP | `min` / `max` |
| "**can you reach** / is it possible" | Reachability DP | `or` |
| "**generate all** / list all" | ✗ **not DP** | → Backtracking |

*(Why `+` for counting and `max` for optimizing — the reasoning is in [16 — Linear DP](../16_Linear_DP/Recognition.html), and it applies to every shape below.)*

---

## STEP 3 — How many indices does one subproblem need?

**This is the question that picks the shape.** List two or three subproblems, ask what differs between them, and count how many numbers it takes to name one.

```
ONE number  → 1D  → dp[i]
TWO numbers → 2D  → dp[i][j]
```

| Structure you see | Numbers to name a subproblem | Shape |
|---|---|---|
| One sequence, a decision at each step ("take 1 or 2 steps", "rob or skip") | 1 — position `i` | **[Linear DP → 16](../16_Linear_DP/Recognition.html)** |
| Items with weight + a capacity limit, each item used **once** | 2 — (item, capacity) | **[0/1 Knapsack → 11](../11_Knapsack_01_DP/Recognition.html)** |
| Items **reusable** without limit (coins, rod cuts, tiles) | 2 — (item, amount) | **Unbounded Knapsack** → [Deep-Guide](Deep-Guide.html#unbounded) |
| Two strings/sequences compared, aligned, transformed | 2 — (pos in s1, pos in s2) | **String DP** → [Deep-Guide](Deep-Guide.html#stringdp) |
| A grid, moving through cells (right/down) | 2 — (row, col) | **2D Grid DP** → [Deep-Guide](Deep-Guide.html#grid) |

> Unbounded Knapsack, String DP and 2D Grid DP don't have their own pattern folders yet — they live in **[this pattern's Deep-Guide](Deep-Guide.html)**, in the Shapes half.

---

## Decision flowchart

```
Is it DP?  (STEP 1 — recursion repeats + child's result is enough)
              │
    ┌─────────┴──────────┐
 1 sequence          2 sequences
   or 1 axis           (strings)
    │                     │
    ├─ decision per step  └─→ STRING DP  (LCS, Edit Distance)
    │  → LINEAR DP · 16
    │
    ├─ items + capacity, each once
    │  → 0/1 KNAPSACK · 11
    │
    ├─ items + capacity, reuse allowed
    │  → UNBOUNDED KNAPSACK
    │
    └─ grid movement (right/down)
       → 2D GRID DP
```

---

## Master signal table

| Signal keyword | Shape |
|---|---|
| climb stairs / jump game / decode ways | Linear DP · [16](../16_Linear_DP/Recognition.html) |
| rob houses / max profit skipping adjacent | Linear DP · [16](../16_Linear_DP/Recognition.html) |
| subset sum / partition equal subset | 0/1 Knapsack · [11](../11_Knapsack_01_DP/Recognition.html) |
| items with weights, pick each at most once | 0/1 Knapsack · [11](../11_Knapsack_01_DP/Recognition.html) |
| coin change / rod cutting (reuse allowed) | Unbounded Knapsack |
| "minimum number of" + "unlimited supply" + hit a target | Unbounded Knapsack |
| greedy looks right but fails on a counter-example | DP — usually Unbounded Knapsack |
| LCS / edit distance / align two strings | String DP |
| palindrome subsequence / longest palindrome | String DP |
| unique paths / min path sum in a grid | 2D Grid DP |
| largest square / dungeon game | 2D Grid DP |

---

## Universal DP traps

1. **Plain recursion ≠ DP** — `f(n-1) + f(n-2)` with no cache and no loop is O(2ⁿ) brute force. DP requires memoization **or** tabulation; without one, nothing is reused.
2. **"Generate all" → Backtracking** — if the answer is a *list of solutions* rather than a count/min/max, you're in the wrong family entirely.
3. **Wrong loop direction in Knapsack** — 0/1 goes **backward**, Unbounded goes **forward**. Get this backwards and 0/1 silently allows reuse (or vice versa).
4. **String DP needs 2D** — one axis per string. Flatten it to 1D too early and you lose the cross-string relationship.
5. **Off-by-one on table size** — `dp = [0] * (n + 1)`, not `n`, because index 0 holds a base case.
6. **Greedy feels right but fails** — if you can build a counter-example where the locally best pick blocks the globally best result (`coins=[1,3,4], amount=6` → greedy 4+1+1=3, DP 3+3=2), greedy is wrong. Reach for DP.
7. **Deciding the shape before defining the state** — the shape *follows* from how many indices the state needs. Write `"dp[…] is …"` as a full sentence first; the shape falls out of it.

---

## Where this sits

| | |
|---|---|
| 🧠 **[Foundations — Dynamic Programming](../../Foundations/Dynamic%20Programming/Dynamic%20Programming.html)** | The theory this card assumes: what DP is, the 2 conditions, memoization vs tabulation, the 4-question skeleton, deciding 1D vs 2D. |
| 🗺️ **[This pattern's Deep-Guide](Deep-Guide.html)** | Triage walked through slowly, plus full mini-guides for the three shapes with no folder of their own: Unbounded Knapsack, String DP, 2D Grid DP. |
| 📏 **[16 — Linear DP](../16_Linear_DP/Recognition.html)** | The 1D shape: one sequence, `dp[i]`, one row. |
| 🎒 **[11 — 0/1 Knapsack](../11_Knapsack_01_DP/Recognition.html)** | The classic 2D shape: (item, capacity), each item used at most once. |
