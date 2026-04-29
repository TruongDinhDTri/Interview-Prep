# Maximum Subarray — Complete Session Archive

**LeetCode #53** | **Pattern:** Kadane's Algorithm (Greedy / Linear DP) | **Difficulty:** Easy | **Date:** 2026-04-27 | **Total Time:** ~50 min

---

## 🗺️ The Journey — How Understanding Built

Started with a wrong pattern instinct (Sliding Window) — and when pushed to explain the shrink condition, Wiganz discovered himself that Sliding Window doesn't fit. Moved to First Principles (3F), traced manually, and found the reset rule from scratch. The key aha moment: "a negative running sum is a burden to every future element." Built Kadane's Algorithm from zero without being told its name.

---

## 🎯 Step 1 — Understand

### Paraphrase (Wiganz's words)
> "I'm given an array and I need to find the subarray with the max sum and return the sum."

✅ Correct. Clean.

### The 9 Constraint Questions

| Question | Answer |
|---|---|
| Is input sorted? | No |
| Can values be negative? | Yes |
| Can there be duplicates? | Yes |
| Can input be empty/null? | No — guaranteed 1 ≤ n ≤ 10⁵ |
| Can I modify the input? | Yes |
| How is input stored? | Array — already stated in problem |
| Expected input size? | Up to 10⁵ |
| What to return? | The integer sum (not the subarray itself) |
| One valid answer or multiple? | One |

### ⚠️ Mistake Made — Move Order
Wiganz jumped straight to constraint questions (Move 2) and skipped **Move 1: Paraphrase**.

**Why it matters:** In a real interview, skipping the paraphrase loses Communication points. The interviewer sees you as reactive, not methodical. Paraphrase first — even one sentence — to show you're confirming before assuming.

**The Road's 4 Moves in order:**
```
1. Paraphrase  ← must come first
2. Ask 9 constraint questions
3. Strip the story → abstract
4. Trace example
```

### Strip the Story

**Discovery moment:** Wiganz said "largest continuous subarray" but forgot to include what he was returning.

**Hadriel asked:** "Are you returning the subarray or something else?"

**Locked-in abstract version:**
> "Find the contiguous subarray with the largest sum, return its sum."

**Key word discovered:** *Contiguous* — a subarray is NOT a subset. You cannot skip elements. When asked "can I pick elements 1 and 3 from [1,2,3,4]?" — Wiganz correctly said no. A subarray must be connected.

### Trace Example

Wiganz chose `[5, 4, -1, 7, 8]` — simpler than the given example.

**Correct Definition WHY:** "Everything is positive except -1, but even including -1 the total sum is still the maximum. So the whole array is the answer. Sum = 23."

**✅ This is Step 1 WHY (Definition WHY)** — used eyes and problem definition. Did not describe an algorithm.

**⚠️ Hadriel violated the rule here:** Asked Wiganz to trace the harder example `[-2,1,-3,4,-1,2,1,-5,4]` and find which subarray gives 6 — that is **Step 3F territory (algorithm discovery)**. Wiganz correctly called this out. Step 1 was complete after the simpler trace.

---

## 🔀 Step 2 — Approach

### The 3-Question Gate

**Gate 1:** Does the abstract shape match a pattern?
→ Wiganz said: "Looks like Sliding Window." ✅ (named it)

**Gate 2:** Can you explain WHY it fits?
→ Hadriel asked: "Every Sliding Window has a shrink condition. What is the shrink condition here?"
→ Wiganz reasoned: "The problem is a negative element on the RIGHT. But shrinking moves the LEFT pointer."
→ Then Wiganz concluded: "Shrinking from the left does NOT remove the negative that's hurting me on the right."
→ **Gate 2 = FAILED ❌**

**Why Sliding Window doesn't fit here:**
Sliding Window requires a clear constraint that tells you WHEN to shrink the left pointer (e.g., "no duplicate characters", "at most K distinct elements"). Maximum Subarray has no such constraint — the "problem" is a growing negative burden, not a violated window condition.

**Gate 2 failed → First Principles Path (3F)**

---

## ❓ Why Does Sliding Window FEEL Right But Isn't?

### Why Wiganz's brain jumped to Sliding Window

The signal words "contiguous" and "subarray" are associated with Sliding Window. That's correct pattern recognition. The instinct was not wrong — the signal keywords genuinely overlap. This confusion is extremely common.

### What Sliding Window actually requires

A Sliding Window has **two pointers: left and right.**

```
left ──────────── right
  [  window  ]
```

The window **expands** when a condition is satisfied.
The window **shrinks** when a constraint is VIOLATED.

The shrink condition must answer: "What rule did we break? How do we fix it by moving left?"

**Examples of valid Sliding Window shrink conditions:**

| Problem | Constraint | Shrink When |
|---|---|---|
| Longest Substring No Repeat | No duplicate chars | `seen[char] >= left` — char already in window |
| Fruits Into Baskets | At most K distinct fruits | `len(basket) > K` — too many types |
| Min Size Subarray Sum | Sum ≥ target | `running_sum >= target` — try to minimize window |

**In every case, the shrink condition is about a RULE BEING VIOLATED.**

### Why Maximum Subarray breaks this model

The "problem" in Maximum Subarray is NOT a violated constraint. It's a **growing negative burden**.

When you add a negative element, the issue is not "the window broke a rule." The issue is "the window's total value is now worse than starting fresh."

If you try to shrink from the LEFT to fix a negative on the RIGHT:

```
[-2,  1, -3,  4, -1]
  L              R
```

Moving L to the right removes `-2` from the window. But `-3` and `-1` are still there on the right. Moving left did NOTHING to help.

The core problem: **the burden is not at the left edge — it's accumulated across the entire window.** Sliding Window's left-shrink cannot address accumulated negative weight.

### What the problem actually needs

Instead of shrinking a window, you need to ask at each step:

> "Is my current running total helping the next element, or hurting it?"

If `running_sum < 0` → it's hurting → DISCARD the entire history and start fresh from the next element.

This is not "move the left pointer." This is "abandon the window entirely and start a new one." That's not Sliding Window — that's Kadane's greedy reset.

### The line that separates them

| | Sliding Window | Kadane's Algorithm |
|---|---|---|
| Structure | Two pointers, one window | One pointer, running total |
| When to shrink/reset | Constraint violated → shrink left | Running sum goes negative → reset to 0 |
| What changes | Left pointer moves right | Running sum resets to 0 (fresh start) |
| The question asked | "Is a rule broken?" | "Is my history helping or hurting?" |
| Works for | Constraint-bounded windows | Maximizing cumulative value |

### The signal that tells you Sliding Window won't work

**Ask yourself: "If I find a bad element, does shrinking from the LEFT fix it?"**

- Longest Substring No Repeat: found duplicate on right → shrink left past the first occurrence → ✅ fixes it
- Maximum Subarray: found negative on right → shrink left → ❌ still have the negative on the right

If the answer is NO — Sliding Window doesn't fit. Go First Principles.

---

## 🔭 Step 3F — First Principles

### Technique A: Visualize + Technique B: Manual Solve (they blended naturally)

Wiganz traced the running sum left to right:

```
nums:        [-2,  1, -3,  4, -1,  2,  1, -5,  4]
running_sum:  -2   1  -2   4   3   5   6   1   5
```

**Rules Discovered by Wiganz:**
1. When the running sum is negative, it becomes a drag on everything after it.
2. Adding more elements to a negative running sum always gives a worse result than just starting fresh.

**The Aha Moment:**
Wiganz first said: "If I'm negative and I meet a positive, I should reset to the positive."

Hadriel pushed: "What if negative meets another negative? Do you wait for a positive?"

Wiganz's refined answer:
> "I reset the moment my running sum itself goes negative — because when it's negative, it becomes a burden. Even if the next number is negative or positive, it's better to start fresh from the next element."

**✅ That is the exact rule of Kadane's Algorithm — discovered from scratch.**

---

## 💬 Step 3 — Discuss

### Wiganz's Presented Steps (after fixing the order bug):

```
1. Initialize max_sum = -infinity, running_sum = 0
2. Iterate: running_sum += nums[i]
3. max_sum = max(max_sum, running_sum)  ← check FIRST
4. if running_sum < 0 → reset to 0    ← reset AFTER
5. Return max_sum
```

**Complexity stated:**
- Time: O(n)
- Space: O(1)

### ⚠️ Critical Mistake — Step Order

Wiganz's **first draft** had the wrong order:
```
Step 3: if running_sum < 0 → reset to 0   ← reset FIRST (WRONG)
Step 4: max_sum = max(max_sum, running_sum) ← check AFTER
```

**Why this is wrong — the edge case:**
Input: `[-3, -1, -2]`

With wrong order:
- running_sum = -3 → reset to 0 → max_sum = max(-inf, 0) = 0 → WRONG
- Answer returned: 0 (but correct answer is -1)

With correct order:
- running_sum = -3 → max_sum = max(-inf, -3) = **-3** → then reset to 0
- running_sum = -1 → max_sum = max(-3, -1) = **-1** → then reset to 0
- running_sum = -2 → max_sum = max(-1, -2) = **-1** → reset to 0
- Answer returned: -1 ✅

**The rule:** Always capture `max_sum` BEFORE resetting `running_sum`. The reset destroys the value — you need to record it first.

**Wiganz also forgot to explain the WHY vs brute force in Discuss.** In a real interview, also state:
- "Brute force would check all O(n²) subarrays — O(n²) time."
- "This approach processes each element once — O(n) time."
- "The key insight: a negative running sum never helps future elements, so we discard it."

---

## 💻 Step 4 — Code

### Phase 1: Blueprint (written correctly after fix)

```python
def maxSubArray(self, nums: List[int]) -> int:
    # 1. Initialize max_sum, running_sum
    # 2. Iterate through array adding running_sum with nums[i]
    # 3. Check running_sum with max_sum  ← FIRST
    # 4. if running_sum < 0 → reset to 0  ← AFTER
    # 5. Return max_sum
```

### Phase 2: Implementation

**First draft had a syntax bug:**
```python
running_sum, max_sum = 0, -float(int)  # ❌ WRONG
```
`int` is a Python type/class, not a number. `float(int)` raises `TypeError`.

**Fixed:**
```python
running_sum, max_sum = 0, float('-inf')  # ✅ CORRECT
```

### Final Correct Code

```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        running_sum, max_sum = 0, float('-inf')
        for i in range(len(nums)):
            running_sum += nums[i]
            max_sum = max(max_sum, running_sum)
            if running_sum < 0:
                running_sum = 0
        return max_sum
```

---

## ✅ Step 5 — Verify

### Full Trace — `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`

| i | nums[i] | running_sum | max_sum | reset? |
|---|---------|-------------|---------|--------|
| 0 | -2 | -2 | -2 | ✅ → 0 |
| 1 | 1 | 1 | 1 | no |
| 2 | -3 | -2 | 1 | ✅ → 0 |
| 3 | 4 | 4 | 4 | no |
| 4 | -1 | 3 | 4 | no |
| 5 | 2 | 5 | 5 | no |
| 6 | 1 | 6 | 6 | no |
| 7 | -5 | 1 | 6 | no |
| 8 | 4 | 5 | 6 | no |

**Answer: 6 ✅**

### Edge Cases

| Input | Expected | Result | Why |
|---|---|---|---|
| `[1]` | 1 | 1 ✅ | running=1, max=max(-inf,1)=1 |
| `[-3,-1,-2]` | -1 | -1 ✅ | max captured before reset each time |
| `[5,4,-1,7,8]` | 23 | 23 ✅ | never resets, whole array is best |

### Complexity
- **Time: O(n)** — one pass through n elements
- **Space: O(1)** — only two variables, no extra memory

---

## ⚡ Step 6 — Optimize

**BTTC for this problem:** O(n) — you must visit every element at least once to know the maximum. Cannot do better.

**Wiganz's statement:**
> "At least we have to iterate through all elements, so O(n) is already the best. O(1) space is already the best."

**Already optimal. No further optimization needed.**

---

## 🧠 What This Algorithm Is Called

**Kadane's Algorithm** — named after Joseph Kadane, Carnegie Mellon University.

It is classified as:
- **Greedy** — at each step, make the locally optimal choice (keep or reset)
- **Linear DP** — `running_sum` implicitly stores the answer to "what's the best subarray ending at this position?"

The greedy insight: *a negative prefix can never help a future sum — discard it immediately.*

---

## 📋 Rules Found In This Session

| Rule | Why It's Correct |
|---|---|
| Reset when `running_sum < 0` | A negative sum is a burden — adding it to any future element gives a worse result than starting fresh |
| Capture `max_sum` BEFORE resetting | Reset destroys the negative value — you need to check it against max before it's gone |
| Initialize `max_sum = float('-inf')` | Handles all-negative arrays — 0 would be wrong if no positive exists |
| Initialize `running_sum = 0` | Start with nothing — let the first element begin the window |

---

## ❌ Mistakes Log

| Mistake | Why It's Wrong | Fix |
|---|---|---|
| Skipped Move 1 (Paraphrase) | Loses Communication points — interviewer sees you as reactive | Always paraphrase first, even one sentence |
| Said "Sliding Window" without a shrink condition | Sliding Window requires a clear shrink trigger — this problem has none | Use 3-gate properly — if Gate 2 fails, go First Principles |
| Wrong step order (reset before max check) | All-negative arrays return 0 instead of the correct negative max | Swap: capture max FIRST, then reset |
| `-float(int)` instead of `float('-inf')` | `int` is a Python type, not a number — raises TypeError | Always use `float('-inf')` for negative infinity |
| Called the return line after the loop (comment placement) | Minor readability issue | Place `return` before the closing comment |

---

## 💡 Key Insights To Remember

1. **"Contiguous" is the key constraint** — subarrays cannot skip elements. This is what makes the problem non-trivial.

2. **The reset insight** — when your running sum goes negative, it will always drag down future elements. Starting fresh from the next element is always better.

3. **Order of operations matters** — in Kadane's, the sequence inside the loop is: add → capture max → then reset. Never reset before capturing.

4. **Sliding Window ≠ Kadane's** — Sliding Window needs a concrete constraint to shrink on. Kadane's is a greedy reset, not a two-pointer window.

5. **All-negative edge case** — initialize `max_sum` to negative infinity, not 0. This is the most common bug beginners make.
