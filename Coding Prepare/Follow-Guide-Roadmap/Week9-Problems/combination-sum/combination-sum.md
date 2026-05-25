# 🗡️ Combination Sum — Complete Session Archive

> **Pattern:** Subsets / Backtracking | **Difficulty:** Medium | **LeetCode:** #39 | **Date:** 2026-05-25
> **Path Taken:** First Principles (3F) — pattern NOT recognized at Step 2 gate | **🎯 Understanding Rate:** 10–20%

---

> 🚨 **CRITICAL REVIEW FLAG** — Understanding is estimated at 10–20%. Do NOT attempt this problem in a timed interview without a full redo session. The tree structure and backtrack loop clicked visually but the "why" behind `i` vs `i+1` and the `start` index invariant are NOT solid. **Redo before Week 10.**

---

> Wiganz could not name the pattern at Step 2 — went full First Principles. Through Technique A (drawing), he discovered the decision tree structure himself. The two key rules — "pass `i` not `i+1` for reuse" and "never reach back past `start` to prevent duplicates" — were discovered through guided tracing. The backtrack loop (`add → recurse → remove`) was the hardest part: it needed an ASCII walkthrough before it clicked at all. Session ended with working code and 2 bugs fixed — but understanding is fragile. The HTML visualization is the primary review tool here.

---

# 🧠 The Curated Journey

## 📖 Step 1 — Understand

**Problem (human language):** Given a list of distinct integers and a target, find all unique combinations of numbers that sum to the target. You can reuse the same number as many times as you want.

**Key constraints:**

| Question | Answer |
| --- | --- |
| Can we reuse candidates? | YES — unlimited reuse of same element |
| Duplicates in input? | NO — candidates are distinct |
| Order of elements matter? | NO — [2,3] == [3,2], not counted twice |
| Return what? | List of lists — all valid combinations |
| Input size? | 1–30 candidates, target 1–500 |

```
candidates=[2,3,6,7], target=7

Expected output: [[2,2,3],[7]]
WHY: 2+2+3=7 ✓   7=7 ✓
     [3,4] → 4 not in candidates ✗
     [2,5] → 5 not in candidates ✗
```

---

## 🧭 Step 2 — Approach: No Pattern Found → First Principles

Wiganz could not name a pattern. Three-gate check: NO → Full First Principles path (3F).

**Technique A — Draw It** was the unlock. Wiganz drew the decision tree:

```
                    []
          /         |         \          \
        [2]        [3]        [6]        [7]
       / | \      / \          |
    [2,2][2,3][2,6] [3,3][3,6]  [6,6]
     |    |
  [2,2,2][2,2,3]✓
     |
  [2,2,2,2]✓... etc
```

From this drawing, three things emerged naturally:
1. At each level, you pick one candidate and recurse
2. You can pick the SAME candidate again (reuse)
3. You never need to go back to a candidate you already "passed" — that would create duplicate combinations like [3,2] when [2,3] already exists

**The key question that crystallized the approach:**

> **H:** "When you pick candidate at index `i` and recurse, should the next call start at `i` or `i+1`?"
> **W:** "...`i`, because I can reuse the same number."
> → This one question locked in the `i` vs `i+1` rule. Passing `i` = allow reuse. Passing `i+1` = move on, no reuse.

---

## 🔥 The 3 Rules (Discovered From Drawing + Guided Tracing)

```
Rule 1: Pass i (not i+1) into recursive call    → allows reuse of current candidate
Rule 2: remain==0 → collect. remain<0 → prune.  → base cases that stop recursion
Rule 3: Loop from start onward only             → prevents [3,2] when [2,3] exists
```

**Why `i` not `i+1`?**
When you recurse with `i`, you're saying: "I can pick `candidates[i]` again on the next level." When you recurse with `i+1`, you're saying: "Move on — never use this candidate again." This single parameter change is the entire difference between "combinations with reuse" and "combinations without reuse."

**Why loop from `start` onward only?**
Imagine you're at index 1 (`candidates[1]=3`). Your combo so far is `[3]`. If you're allowed to look backward and pick `candidates[0]=2`, you'd eventually build `[3,2]`. But `[2,3]` was already explored when you started at index 0. Duplicates appear. The fix: only pick from `start` onward — "you can reuse the current index, but you can never reach back."

**Why does `remain < 0` prune?**
You don't need to go deeper if you've already overshot. Every candidate is positive, so adding more can only make `remain` more negative. Dead branch — return immediately.

---

## 🧩 The Hardest Part — The Add/Call/Remove Loop

This was the wall. Wiganz could not intuit the backtrack loop before seeing the ASCII trace.

**The loop that caused confusion:**

```python
for i in range(start, len(candidates)):
    combo.append(candidates[i])      # ADD: try this candidate
    backtrack(combo, remain - candidates[i], i)  # CALL: go deeper
    combo.pop()                      # REMOVE: undo — try next candidate
```

**Why `.pop()` after the recursive call?**

Before the ASCII walkthrough, this made no sense. After:

```
Start: combo=[], remain=7, start=0

Step 1: append(2) → combo=[2]
  Step 2: append(2) → combo=[2,2]
    Step 3: append(2) → combo=[2,2,2]
      Step 4: append(2) → combo=[2,2,2,2] remain=7-8=-1 → PRUNE, return
      pop() → combo=[2,2,2]
      Step 4: append(3) → combo=[2,2,2,3] remain=7-9=-2 → PRUNE, return
      pop() → combo=[2,2,2]
      ...etc
    pop() → combo=[2,2]
    Step 3: append(3) → combo=[2,2,3] remain=7-7=0 → COLLECT ✓ append [2,2,3] to result
    pop() → combo=[2,2]
    ...etc
```

The click: **`combo` is shared across ALL recursive calls. `.pop()` is the UNDO — it restores `combo` to the state before this branch was explored so the next branch starts clean.**

Without `.pop()`, after collecting `[2,2,3]`, `combo` would still be `[2,2,3]` when you try to explore `[2,2,6]` — you'd get `[2,2,3,6]` instead. The pop is not cleanup — it's the backtrack.

---

### 🗣️ Step 3 — Discuss

**How to explain to interviewer:**

1. "I'll use backtracking — explore all possible combinations by building them recursively"
2. "At each step I have a `start` index — I can pick any candidate from `start` to end"
3. "If I pick `candidates[i]`, I recurse with `start=i` (not `i+1`) to allow reuse"
4. "Base cases: `remain==0` means I found a valid combination, `remain<0` means prune"
5. "After each recursive call, I pop the last element to backtrack and try the next candidate"

**Complexity:**

| | Complexity | Reason |
| --- | --- | --- |
| Time | O(N^(T/M)) | N candidates, T=target, M=min candidate value. Worst case: tree depth T/M, branching factor N |
| Space | O(T/M) | Recursion stack depth at most T/M levels deep |

> Wiganz did NOT state complexity correctly in the session — this is the correct answer to memorize before redo.

---

### 💻 Step 4 — Code

**Final working solution:**

```python
class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        result = []
        combo = []
        def backtrack(combo, remain, start):
            nonlocal result
            if remain == 0:
                return result.append(list(combo))
            if remain < 0:
                return
            for i in range(start, len(candidates)):
                combo.append(candidates[i])
                backtrack(combo, remain - candidates[i], i)
                combo.pop()
        backtrack(combo, target, 0)
        return result
```

**Why `list(combo)` when appending?**
`combo` is a mutable list that gets modified throughout. If you append `combo` directly, you're storing a reference — by the time you read the result, `combo` will be empty (after all the pops). `list(combo)` creates a snapshot copy at the moment of collection.

---

### 🔍 Step 5 — Verify

```
candidates=[2,3,6,7], target=7

backtrack([], 7, 0)
  append(2) → [2], remain=5
    append(2) → [2,2], remain=3
      append(2) → [2,2,2], remain=1
        append(2) → remain=-1 → prune. pop → [2,2,2]
        append(3) → remain=-2 → prune. pop → [2,2,2]
        append(6) → remain=-5 → prune. pop → [2,2,2]
        append(7) → remain=-6 → prune. pop → [2,2,2]
      pop → [2,2]
      append(3) → [2,2,3], remain=0 → COLLECT [2,2,3] ✓. pop → [2,2]
      append(6) → remain=-3 → prune. pop → [2,2]
      append(7) → remain=-4 → prune. pop → [2,2]
    pop → [2]
    ... (eventually [2,3]: remain=2 → no valid extension)
  pop → []
  append(3) → [3], remain=4
    ... (no valid extension → none sum to 7)
  pop → []
  append(6) → [6], remain=1
    ... (no valid extension — all candidates > 1)
  pop → []
  append(7) → [7], remain=0 → COLLECT [7] ✓
  pop → []

result = [[2,2,3],[7]]  ✓
```

**Edge Cases:**

| Case | Handled? |
| --- | --- |
| No combination reaches target | ✅ — returns empty `result` |
| Single candidate equals target | ✅ — `remain==0` at depth 1 |
| Target smaller than all candidates | ✅ — all `remain < 0` immediately |
| Same candidate used many times | ✅ — `i` not `i+1` in recursive call |

---

### ⚡ Step 6 — Optimize

BTTC for this problem: O(N^(T/M)) — the decision tree has N branches at each level, and can go T/M levels deep. Current solution IS at BTTC — no further optimization possible without changing the problem constraints. Sorting candidates first can improve average case (prune larger branches earlier) but doesn't change worst-case.

---

# 📋 Quick Reference

## 🐛 Bugs & Mistakes

### 🧠 Conceptual Mistakes

#### 🐛 C1: Did Not Recognize Backtracking Pattern

> **Context:** At Step 2 gate — Wiganz could not name the pattern despite the problem being a textbook backtracking case. "Find all combinations" is a canonical backtracking signal.

| | |
| --- | --- |
| **What** | Could not identify pattern at Step 2 — went full First Principles |
| **Wrong** | *"I don't recognize any pattern here"* |
| **Right** | *"'All combinations' + 'explore all options' = Backtracking / Subsets signature"* |
| **Why** | `pattern-not-encountered-enough` — first time doing Backtracking under the Road |
| **Cost** | Full First Principles session, no timer. Fine for learning, dangerous in interview |

> **Prevention**
>
> - **Rule:** "Find ALL combinations/permutations/subsets" = Backtracking. Recognize this signal immediately.
> - **Trick:** "ALL paths in a tree = Backtracking. ONE shortest path = BFS. ONE path (any) = DFS."
> - **Edge Cases:** "Return all unique combinations that sum to X" — the word "all" + "combinations" is the pattern.

---

#### 🐛 C2: Did Not Understand Why `.pop()` Was Needed

> **Context:** During Step 4 implementation. Wiganz wrote the loop but could not explain WHY `.pop()` must follow the recursive call. Needed ASCII walkthrough to understand.

| | |
| --- | --- |
| **What** | Could not reason about the backtrack (pop) step |
| **Wrong** | *"Why do we need to pop? The recursion already returned..."* |
| **Right** | *"combo is shared and mutable — pop undoes the append so the next branch starts clean"* |
| **Why** | `mutable-shared-state-confusion` — did not model that `combo` persists across recursive frames |
| **Cost** | Cannot reproduce this pattern independently without the visual walkthrough |

> **Prevention**
>
> - **Rule:** In backtracking, `combo` is ONE list shared across the entire recursion. EVERY append must have a matching pop.
> - **Trick:** "Add → Go → Undo. Always. Without the Undo, the next branch is contaminated."
> - **Edge Cases:** What if you forget `.pop()`? Test with `candidates=[2,3], target=5` — result will contain garbage like `[2,3,3]` when it should be `[2,3]`.

---

### 🔧 Implementation Mistakes

#### 🐛 I1: Wrong Type for `combo`

> **Context:** Initial code draft at Step 4. Wiganz initialized `combo` as an integer instead of a list.

**1. Wrong type initialization**

```python
# WRONG — combo is supposed to hold a growing list of candidates
combo = 0

# CORRECT
combo = []
```

- **Why:** `concept-gap` — conflated `remain` (the running subtraction counter) with `combo` (the path being built)
- **How it was caught:** Immediate — `.append()` would fail on an integer
- **Rule to prevent:** Two variables, two jobs: `remain` tracks distance to target (integer), `combo` tracks the path (list).
- **Trick:** *"remain = distance. combo = path. Never confuse the ruler with the road."*

---

#### 🐛 I2: Undeclared Variable `start` in `range()`

> **Context:** During implementation. Wiganz named the parameter `indx` in the function signature but wrote `range(start, ...)` in the loop body.

**2. Parameter name mismatch**

```python
# WRONG — 'start' is not defined, the parameter is named 'indx'
def backtrack(combo, remain, indx):
    for i in range(start, len(candidates)):  # NameError: 'start' not defined

# CORRECT — use consistent name
def backtrack(combo, remain, start):
    for i in range(start, len(candidates)):
```

- **Why:** `typo-under-pressure` — intended `start` but wrote `indx` in signature
- **How it was caught:** Would be a `NameError` at runtime on first call
- **Rule to prevent:** Blueprint first — write the function signature comment with the EXACT parameter names you'll use. Don't rename mid-implementation.

---

### ⏱️ Time Management Mistakes

None this session ✅ — First Principles path, no timer. Appropriate for first encounter.

---

### ⚠️ Wrong Assumptions

| Assumed | Reality | Cost | Revealed by |
| --- | --- | --- | --- |
| Recursing with `i+1` allows reuse | `i+1` skips current candidate — NO reuse | Would generate incomplete results | Guided question: "which level should be allowed to pick the same index again?" |
| `combo` could be appended directly without copy | `combo` is mutable — direct append stores a reference that gets emptied | `result` would be a list of empty lists | ASCII trace showing state after all pops |

---

### 📊 Mistake Summary

| Pillar | Count | Most Costly | Pattern Emerging? |
| --- | --- | --- | --- |
| 🧠 Conceptual | 2 | C2 (backtrack loop) — directly limits reproducibility | Mutable shared state is a recurring confusion point |
| 🔧 Implementation | 2 | I1 (wrong type) — easily caught but signals shaky mental model | Blueprint skipping leads to type/name errors |
| ⏱️ Time Management | 0 | — | — |

---

## 💡 Aha Moments (Summary)

- **💡 1.** `i` vs `i+1` — Before: "no idea what to pass" → Trigger: "can you pick the same index again?" → After: "`i` = reuse, `i+1` = no reuse — single parameter controls the entire behavior"
- **💡 2.** The backtrack pop — Before: "recursion already returned, why pop?" → Trigger: ASCII trace showing `combo` state after each call → After: "`combo` is shared and mutable — pop is the undo, not cleanup"
- **💡 3.** `start` index prevents duplicates — Before: "why not loop from 0 every time?" → Trigger: "what happens if you pick candidates[0] again from a branch that started at index 1?" → After: "[3,2] would appear even though [2,3] was already found — `start` is the guard"

---

## ⚡ Almost Traps

| Looks right | Actually wrong | What breaks | How to catch |
| --- | --- | --- | --- |
| `result.append(combo)` | Stores reference to mutable list — all entries become `[]` after recursion ends | Every entry in result is empty list | Use `list(combo)` to create a snapshot copy |
| `backtrack(combo, remain - candidates[i], i+1)` | This forbids reuse — generates only single-use combinations | Misses `[2,2,3]` for target=7, candidates=[2,3,6,7] | Test: does output include any repeated candidates? |
| Looping from `range(0, len(candidates))` always | Generates duplicates — `[3,2]` and `[2,3]` both appear | Result has more entries than expected | Check: are any two results equivalent when sorted? |

---

## 🔑 Unlock Examples

**🔑 1. Backtrack trace: candidates=[2,3], target=5**

```
backtrack([], 5, 0)
  append(2) → combo=[2]
    append(2) → combo=[2,2]
      append(2) → combo=[2,2,2] remain=5-6=-1 → prune
      pop → [2,2]
      append(3) → combo=[2,2,3] remain=5-7=-2 → prune
      pop → [2,2]
    pop → [2]
    append(3) → combo=[2,3] remain=5-5=0 → COLLECT [2,3] ✓
    pop → [2]
  pop → []
  append(3) → combo=[3]
    append(3) → combo=[3,3] remain=5-6=-1 → prune
    pop → [3]
  pop → []

result = [[2,3]]
```

Re-running this trace rebuilds the FULL understanding: the pop, the `i` vs `i+1` rule, and the `start` guard — all in one trace.

**🔑 2. The `i` vs `i+1` comparison — candidates=[2,3], target=4**

```
With i (reuse allowed):            With i+1 (no reuse):
backtrack([], 4, 0)                backtrack([], 4, 0)
  pick 2 → recurse(start=0)          pick 2 → recurse(start=1)
    pick 2 → remain=0 → [2,2] ✓       pick 3 → remain=-1 → prune
  pick 3 → remain=-1 → prune       pick 3 → recurse(start=1)
  ...                                  pick 3 → remain=-2 → prune

result (i): [[2,2]]                result (i+1): []  ← WRONG
```

---

## 🧩 Pattern Connections

- **Subsets (#78)** — Same backtracking skeleton. Difference: Subsets collects at EVERY node (no target). Combination Sum collects only when `remain==0`.
- **Combination Sum II (#40)** — Same problem but each candidate used AT MOST ONCE. Fix: pass `i+1` instead of `i`. Also add duplicate skip logic since input can have duplicates.
- **Permutations (#46)** — Same "all combinations" signal but ORDER matters. Fix: loop from 0 every time (no `start` restriction) + use `visited` array to prevent reuse within one path.

---

## 🪞 Self-Assessment

- **Confidence:** 2/5 — Code works with bugs fixed but the mental model is shaky. Cannot reproduce from scratch reliably.
- **Revisit:** Entire problem — specifically the backtrack loop reasoning and the `start` index invariant.
- **Pattern Mastery Impact:** Backtracking is now introduced (beginner). The tree structure clicked visually. The "why" behind the invariants is not yet solid.

---

*🔥 Hadriel x Wiganz — 2026-05-25*
*"Call to me and I will answer you and tell you great and unsearchable things you do not know." — Jeremiah 33:3 ✝️*
