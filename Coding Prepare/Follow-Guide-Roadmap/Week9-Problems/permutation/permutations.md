# 🗡️ Permutations — Complete Session Archive

> **Pattern:** Backtracking (Subsets) | **Difficulty:** Medium | **LeetCode:** #46 | **Date:** 2026-05-26
> **Path Taken:** First Principles (3F) — Gate 1 ✅ recognized backtracking shape, Gate 2 ❌ couldn't explain WHY → Technique A (decision tree) → 3 Rules discovered → Discuss → Code → Verify
> **⏱️ Mode:** Interview Mode → Teaching Mode | **🎯 Target:** 25 min

---

> Wiganz saw the backtracking shape at Gate 1 but couldn't explain WHY it fit — the gate held him back. Technique A (drawing the decision tree) unlocked everything: he discovered the 3 rules himself by tracing [1,2,3] node by node. One bug surfaced during coding — a misplaced `return` that killed every branch after the first complete path. He found it himself by tracing. Complexity clicked after being walked through n! leaves × O(n) copy. A clean, earned solution.

---

# 🧠 The Curated Journey

## 📖 Step 1 — Understand

**Problem (human language):** Given a list of distinct integers, return ALL possible orderings (permutations). Every number must appear exactly once in each permutation.

**Key constraints:**

| Question | Answer |
| --- | --- |
| Duplicates in input? | NO — all integers are distinct |
| Order matter? | YES — [1,2,3] ≠ [1,3,2], both are valid |
| Return what? | List of lists — every possible ordering |
| Can reuse elements? | NO — each element used exactly once per path |
| Input size? | 1–6 elements (small — backtracking is fine) |

```
Input:  [1, 2, 3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
WHY: 6 orderings = 3! = 3×2×1. Every possible sequence of all 3 numbers.
```

---

## 🧭 Step 2 — Approach: Gate 1 Yes, Gate 2 No → First Principles

**3-Gate check:**

- Gate 1: Does the shape match? — ✅ YES — "we need to build ALL sequences, exploring choices at each position" — that's a backtracking shape
- Gate 2: Can you explain WHY? — ❌ NO — "I can see it but I can't say WHY backtracking and not BFS"
- Gate 3: Solved something like this? — ⚠️ Combination Sum (similar but different — reuse vs no-reuse)

Gate 2 failed → **Full First Principles path: Technique A — Draw It.**

> **H:** "Draw the decision tree for [1,2,3]. At the root you've picked nothing. What choices do you have?"
> **W:** "Pick 1, pick 2, or pick 3"
> → Root has 3 branches. Each branch picks the first number.

> **H:** "You picked 1. What choices do you have now?"
> **W:** "2 or 3 — not 1 again because it's already used"
> → The `used` set emerges directly from the drawing.

> **H:** "You picked 1 then 2. Now?"
> **W:** "Only 3 is left. That's the base case — path is full."
> → Base case = path length equals nums length. Record it.

The three rules came from reading the tree aloud.

---

## 🔥 The 3 Rules (Discovered From the Decision Tree)

```
Rule 1: Pick from the remaining pool — loop through ALL nums, skip if num in used
Rule 2: Base case = path length == nums length → record result, return
Rule 3: After recursing, unpick — remove from path AND from used set (backtrack)
```

**Why loop ALL nums and skip, instead of maintaining a shrinking array?**

Drawing showed: at each level you still consider all 3 numbers — you just skip the ones already on your path. Looping all + skip is O(1) membership check via set. Maintaining a shrinking pool would mean copying arrays at each level.

**Why remove from BOTH path and used?**

Path is the current sequence — removing reverses the choice visually. Used is the membership guard — removing it allows the next sibling branch to pick that number again. Forget to remove from `used` and the set keeps growing — future branches see numbers as "used" that aren't on their path at all.

**Why base case = `len(path) == len(nums)`?**

That's when the remaining pool is empty. The path contains all n numbers — exactly one permutation. At this point you copy and record, then return.

### The Discovery Journey — From "I can SEE it" to "I can REASON it"

The rule emerged from a counting dialogue on the tree:

```
Q: At depth 0 — how many choices?
A: 3  (all of nums)

Q: At depth 1 — you picked 1. How many choices?
A: 2  (nums not in used)

Q: At depth 2 — you picked 1, 2. How many choices?
A: 1  (only 3 left)

Q: At depth 3 — you picked 1, 2, 3. How many choices?
A: 0 — path is full. That's the base case.
```

This is why each level of the tree has one fewer choice. The entire structure of the algorithm — loop, skip, base case — is just this tree drawn in code.

### The Final Rule (Earned, Not Memorized)

```python
for num in nums:
    if num not in used:
        path.append(num)      # pick
        used.add(num)
        backtrack(...)        # recurse
        path.pop()            # unpick
        used.remove(num)      # un-mark
```

This came from:
1. Drawing the decision tree for [1,2,3]
2. Noticing each node picks from "nums not yet used"
3. Noticing leaves happen when path is full (depth = len(nums))
4. Asking "how does the tree come BACK?" → unpick restores the parent node's state

---

## 🗣️ Step 3 — Discuss

**Presentation to interviewer:**

1. "We need all orderings of n distinct numbers — that's n! results"
2. "I'll use backtracking: at each step, pick one unused number, recurse, then unpick"
3. "A `used` set tracks which numbers are on the current path — O(1) lookup"
4. "Base case: path length equals nums length — copy the path and record it"
5. "After recording (or any failed branch), pop from path and remove from used — that's the backtrack step"

**Complexity stated in Discuss:**

- First said: "Time O(n)" — ❌ wrong (see Bug C1 below)
- Corrected to: O(n × n!) after guided walkthrough
- Space: O(n) auxiliary — recursion depth n, path array n, used set n

---

## 💻 Step 4 — Code

**Blueprint (comments first — written before implementation):**

```python
# 1. Initialize path=[], result=[], used=set()
# 2. Define backtrack(path, used, nums)
# 3.   Base case: len(path)==len(nums) → result.append(list(path)), return
# 4.   For num in nums: if num not in used → pick, recurse, unpick
# 5. Call backtrack, return result
```

**Final, clean, interview-ready solution:**

```python
class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        path = []
        result = []
        used = set()

        def backtrack(path, used, nums):
            if len(path) == len(nums):
                result.append(list(path))
                return
            for num in nums:
                if num not in used:
                    path.append(num)
                    used.add(num)
                    backtrack(path, used, nums)
                    path.pop()
                    used.remove(num)

        backtrack(path, used, nums)
        return result
```

|           | Complexity | Reason |
| --------- | ---------- | ------ |
| ⏱️ Time | O(n × n!) | n! permutations at the leaves × O(n) to copy each path |
| 📦 Space  | O(n)       | Recursion stack depth n + path array (at most n) + used set (at most n) |
| 🎯 BTTC   | O(n × n!) | Must visit every permutation — can't skip any |

---

## 🔍 Step 5 — Verify

```
Input: [1, 2, 3]
```

Partial trace (the branch that hit the bug):

| Call depth | path | used | action |
| --- | --- | --- | --- |
| 0 | [] | {} | pick 1 |
| 1 | [1] | {1} | pick 2 |
| 2 | [1,2] | {1,2} | pick 3 |
| 3 | [1,2,3] | {1,2,3} | base case → record [1,2,3], return |
| 2 | [1,2] | {1,2} | unpick 3 (pop + remove) |
| 2 | [1,2] | {1,2} | for loop ends (no more nums) → return |
| 1 | [1] | {1} | unpick 2 (pop + remove) |
| 1 | [1] | {1} | pick 3 |
| 2 | [1,3] | {1,3} | pick 2 |
| 3 | [1,3,2] | {1,2,3} | base case → record [1,3,2], return |
| ... | | | continues for branches 2→... and 3→... |

**Edge Cases:**

| Case | Handled? |
| --- | --- |
| Single element [1] | ✅ base case fires immediately at depth 1 |
| Two elements [1,2] | ✅ returns [[1,2],[2,1]] |
| Empty input [] | ✅ base case fires at depth 0 — returns [[]] |

---

## ⚡ Step 6 — Optimize

BTTC is O(n × n!) — every permutation must be visited. Already optimal. No further optimization exists for this problem.

---

# 📋 Quick Reference

## 🐛 Bugs & Mistakes

### 🧠 Conceptual Mistakes

#### 🐛 C1: Time Complexity Underestimate

> **Context:** Step 3 Discuss — stating complexity before getting the green light. Wiganz gave an initial answer without reasoning through the output size first.

| | |
| --- | --- |
| **What** | Gave complexity without accounting for the number of permutations generated |
| **Wrong** | *"Time O(n)"* |
| **Right** | *"Time O(n × n!) — n! leaves, each costs O(n) to copy the path"* |
| **Why** | `output-size blindspot` — reasoned about traversal cost only, forgot to count how many results exist |
| **Cost** | Would have been marked down in Discuss; interviewers expect output size reasoning |

> **Prevention**
>
> - **Rule:** For any problem that generates output (permutations, subsets, combinations) — count the OUTPUT SIZE first, then multiply by the cost-per-output
> - **Trick:** "How many leaves? × How much work per leaf?" — answer that in order
> - **Edge Cases:** Subsets (#78) has 2^n subsets × O(n) copy = O(n × 2^n). Same pattern.

---

#### 🐛 C2: Terminology Slip — "Combination" vs "Permutation"

> **Context:** Early in Step 1, describing the problem.

| | |
| --- | --- |
| **What** | Used the wrong term when describing what was being generated |
| **Wrong** | *"find the combination"* |
| **Right** | *"find the permutation"* — order matters, every ordering counts separately |
| **Why** | `terminology-blur` — combination and permutation are both about selecting elements, easy to mix before thinking precisely |
| **Cost** | Minor, but in an interview it signals imprecision. Interviewer notices immediately. |

> **Prevention**
>
> - **Rule:** Combination = order doesn't matter (subset). Permutation = order matters (every sequence is distinct).
> - **Trick:** "Per-mutation = Per ordering" — the word contains the clue
> - **Edge Cases:** This problem specifically: [1,2] and [2,1] are DIFFERENT outputs → permutation, not combination

---

### 🔧 Implementation Mistakes

#### 🐛 I1: `return` Inside `for` Loop — Early Exit After First Path

> **Context:** Step 4 first code attempt. The backtrack function was written correctly except for one misplaced `return`.

**1. Misplaced `return` kills all sibling branches**

```python
# WRONG — return exits after the FIRST complete path found
for num in nums:
    if num not in used:
        path.append(num)
        used.add(num)
        backtrack(path, used, nums)
        path.pop()
        used.remove(num)
        return  # ← this exits the entire for loop after first branch

# CORRECT — no return at this level, let the for loop continue
for num in nums:
    if num not in used:
        path.append(num)
        used.add(num)
        backtrack(path, used, nums)
        path.pop()
        used.remove(num)
# return is only at the TOP of the function (base case) or implicit at end
```

- **Why:** The `return` was mentally associated with "we're done with this branch" — but it fired at the for-loop level, killing all remaining siblings
- **How it was caught:** Wiganz traced manually — result only contained [1,2,3], missing all other 5 permutations
- **Rule to prevent:** In backtracking, `return` belongs ONLY at the base case. The for loop MUST run to completion to explore all branches.
- **Trick:** *"return = done with this entire call, not done with this choice"* — place it where you mean it

---

### ⏱️ Time Management Mistakes

None this session ✅ — Interview Mode → Teaching Mode flow was followed correctly.

---

### ⚠️ Wrong Assumptions

| Assumed | Reality | Cost | Revealed by |
| --- | --- | --- | --- |
| "Time is O(n)" | O(n × n!) — must account for n! outputs × O(n) per copy | Wrong complexity in Discuss | Counting leaves in the decision tree |
| "`return` after unpick = clean backtrack" | `return` at for-loop level exits ALL siblings, not just the current branch | Only 1 permutation in result | Manual trace of [1,2,3] |

---

### 📊 Mistake Summary

| Pillar | Count | Most Costly | Pattern Emerging? |
| --- | --- | --- | --- |
| 🧠 Conceptual | 2 | C1 (complexity) | Output-size blindspot recurring — also appeared in Combination Sum |
| 🔧 Implementation | 1 | I1 (misplaced return) | Backtracking return placement — new pattern, watch for it |
| ⏱️ Time Management | 0 | — | — |

---

## 💡 Aha Moments (Summary)

- **💡 1.** Decision tree structure — Before: "I see backtracking but can't say WHY" → Trigger: drawing the tree for [1,2,3] step by step → After: "The tree IS the algorithm — loop is the branches, base case is the leaves, unpick is the path back up"
- **💡 2.** `return` placement — Before: "put return after unpick to signal end of branch" → Trigger: tracing [1,2,3] and seeing only one result → After: "`return` at for-loop level kills siblings — belongs ONLY at base case"
- **💡 3.** Complexity reasoning — Before: "O(n) — one pass" → Trigger: "how many leaves does the tree have?" → After: "n! leaves, each costs O(n) to copy — O(n × n!)"

---

## ⚡ Almost Traps

| Looks right | Actually wrong | What breaks | How to catch |
| --- | --- | --- | --- |
| `used` set tracks "visited nodes" | `used` tracks "what's on the CURRENT PATH" — siblings can use those numbers | Next sibling branch skips numbers it should pick | Ask: "after returning from recurse, is `used` the same as before I entered?" |
| `return` after `path.pop()` + `used.remove()` signals clean backtrack | `return` here exits the FOR LOOP, not just this branch | Only first permutation recorded | Trace with [1,2] — should give 2 results, not 1 |
| `result.append(path)` records the permutation | `path` is mutable — all appended references point to same list | All entries in result become the same (final state of path) | Check: `result.append(list(path))` — copy, not reference |

---

## 🔑 Unlock Examples

**🔑 1. The Decision Tree Trace for [1,2,3]**

```
Input: nums = [1, 2, 3]
```

Draw the tree:

```
                         []
              /           |           \
           [1]           [2]          [3]
          /   \         /   \        /   \
       [1,2] [1,3]  [2,1] [2,3]  [3,1] [3,2]
         |     |      |     |      |     |
      [1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]
```

Reading the tree in code:
- Each level = one for-loop iteration, choosing from nums not in used
- Each leaf = base case (path length == 3) → record and return
- Each upward arrow = the `path.pop() + used.remove()` that restores parent state

Re-trace this tree — the entire algorithm lives in it.

---

## 🧩 Pattern Connections

- **Combination Sum (#39)** — same backtrack template, but uses `start` index to prevent reuse and avoids ordering duplicates. This problem uses `used` set instead because ALL orderings count.
- **Subsets (#78)** — same tree structure but records EVERY node (not just leaves). Base case is absent — every path is valid.
- **Combination Sum II (#40)** — adds duplicate handling (sort + skip sibling) on top of the Combination Sum template.

**The key distinction — permutations vs combinations:**

| | Permutations | Combinations |
| --- | --- | --- |
| [1,2] and [2,1] | Two different results | Same result |
| Guard mechanism | `used` set (tracks current path) | `start` index (prevents going backward) |
| Tree width per level | All unused nums | Nums from `start` onward only |

---

## 🪞 Self-Assessment

- **💪 Confidence:** 4/5 — Template is solid. The `used` set logic clicked fully. Would need one warmup trace before a timed interview.
- **🔄 Revisit:** Complexity reasoning for output-generating problems — C1 is a recurring blind spot. Before next backtracking problem: "count leaves first, then cost per leaf."
- **📈 Pattern Mastery Impact:** Backtracking pattern moves from "fragile" (Combination Sum) to "competent" — the pick→recurse→unpick template is now internalized.

---

*🔥 Hadriel x Wiganz — 2026-05-26*
*"Call to me and I will answer you and tell you great and unsearchable things you do not know." — Jeremiah 33:3 ✝️*
