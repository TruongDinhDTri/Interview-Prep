# 🗡️ 3Sum -- Complete Session Archive

> **Pattern:** Two Pointers (after sort) | **Difficulty:** Medium | **LeetCode:** #15 | **Date:** 2026-05-06
> **Path Taken:** Pattern Path | **⏱️ Time Used:** 78 min | **🎯 Target:** 25 min

---

## 🗺️ The Journey -- How Understanding Built

Wiganz correctly identified the Two Pointers pattern and nailed the key rewrite (`a+b+c=0 → a+b=-c`), but the session went 3x over target because of the Verify phase. Step 3 (Discuss) ran past the 25-minute mark before a single line of code was written. Then 9 bugs surfaced during the trace -- almost all in the three-level duplicate-skipping logic. The algorithm was understood. The implementation details were not. This session is a lesson in knowing the pattern vs. knowing every implementation trap inside it.

---

## 📖 Step 1 -- Understand

### 📝 Problem Statement (Human Language)
Given an integer array `nums`, return all unique triplets `[a, b, c]` where `a+b+c=0` and all three come from different positions. The result must contain no duplicate triplets.

```
Input:  [-1, 0, 1, 2, -1, -4]
Output: [[-1, -1, 2], [-1, 0, 1]]
```

### 🔬 Abstract (Story Stripped)
> "Given an array of integers, find all unique sets of 3 numbers that sum to zero."

### ❓ Constraint Questions Asked

| Question | Answer |
|----------|--------|
| Is input sorted? | No -- sort it yourself |
| Can values be negative / zero / positive? | Yes, all three |
| Can duplicates exist in input? | Yes |
| Can input be empty? | No -- min length is 3 |
| What to return? | Array of triplets (values, not indices) |
| Multiple valid answers? | Yes -- return ALL |

### ✋ Trace by Hand

`[-1, 0, 1, 2, -1, -4]`

- `[-1, 0, 1]` is valid because the problem says find triplets where `a+b+c=0` -- and `-1+0+1=0`. Definition WHY. ✅
- `[-1, -1, 2]` is valid because `-1+(-1)+2=0`. Definition WHY. ✅

Step 1 took ~8 min. Should be 3-4 min max.

---

## 🧭 Step 2 -- Approach (3-Gate Check)

### 🚦 3-Gate Results

| Gate | Check | Result |
|------|-------|--------|
| Gate 1: Abstract shape matches a pattern? | "find pairs summing to target" in the subproblem | ✅ YES |
| Gate 2: Can name it AND explain why? | Fixed number c → find a+b=-c → that's 2Sum via Two Pointers | ✅ YES |
| Gate 3: Solved something like this before? | Yes -- 2Sum with Two Pointers | ✅ YES |

→ **Decision: PATTERN PATH**

**⚡ The Bridge Insight (discovered at Gate 2):**

3Sum looks like it needs 3 pointers. The magic rewrite:
```
a + b + c = 0
→ a + b = -c
```
Fix `c` with an outer loop. Now you have 2Sum: find `a` and `b` in the remaining array summing to `-c`. Two Pointers handles this in O(n). Total: O(n²).

**Meta discussion captured:** Wiganz asked about Gate 2 vs. 4P-B feeling similar.
- Gate 2 = one sentence, quick YES/NO, picks the path
- 4P-B = full presentation for the interviewer, earns rubric points
- Same idea, different depth and audience.

---

## 🎯 3P Match + 4P Reason

### 🔍 3P -- Signal → Pattern → Full Sentence

> "I see 'sorted array' and 'find pairs summing to a target' in the subproblem, which tells me Two Pointers because once sorted, two converging pointers can find a pair sum in O(n) without revisiting elements."

### 🧠 4P -- Reason

**A -- 🐢 Brute Force + Why Bad:**
Three nested loops. Check every possible triplet. O(n³). Way too slow for any realistic input size.

**B -- ⚡ What Two Pointers Does Instead:**
- Sort the array: O(n log n)
- Fix one number with outer loop at index `i`
- For each fixed number, converge `left = i+1` and `right = end` inward, searching for a pair summing to `-nums[i]`
- Sum too big → `right--`. Sum too small → `left++`. Equal → found triplet, advance both
- Each element visited at most twice per outer iteration → O(n²) total

**C -- 🔒 The Invariant:**
Once a fixed number `c` has been fully processed, we never revisit it. If a triplet existed with that `c`, the converging pointers would have found it. The sorted order guarantees the pointers never miss a valid pair.

---

## 🗣️ Step 3 -- Discuss

### 📋 Wiganz's Full Presentation

1. Sort the array. Initialize `result = []`.
2. Iterate with index `i` (fixed number = `nums[i]`).
3. Skip duplicate fixed numbers: `if i > 0 and nums[i] == nums[i-1]: continue`
4. Two pointers: `left = i+1`, `right = len(nums)-1`, converge inward searching for `-nums[i]`
5. Sum too big → `right--`. Sum too small → `left++`. Equal → append triplet, advance both.

### 📊 Complexity Stated
- Stated O(n) for time initially -- **incorrect**. Correct is O(n²).

### ✅ Green Light
- This aspect was not fully explored during the session.

### ⚠️ What Was Missed
- Wrong time complexity stated (O(n) instead of O(n²))
- Did not address duplicate handling for left/right pointers in Discuss -- only mentioned the fixed-number skip
- Did not state BTTC or ask "Shall I code it?" explicitly
- Step 3 ran past the 25-minute total target before code was written

---

## 💻 Step 4 -- Code

### 🏗️ Blueprint (Comments First)

⚠️ **Blueprint was skipped.** Wiganz jumped straight to full implementation. This is flagged as a bug (see Bug 2 below). The correct blueprint would have been:

```python
def threeSum(self, nums):
    # 1. Sort array, initialize result
    # 2. Iterate i through nums (fixed number)
    # 3. Skip duplicate fixed numbers
    # 4. Two pointers: left = i+1, right = end
    # 5. Converge: adjust pointers, append triplet on match
    # 6. Skip duplicate left/right after match
    # 7. Return result
```

### ✨ Final Clean Solution

```python
class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        result = []
        for i in range(len(nums)):
            if i > 0 and nums[i] == nums[i-1]:
                continue
            left = i + 1
            right = len(nums) - 1
            while left < right:
                temp_sum = nums[left] + nums[right]
                if temp_sum > -nums[i]:
                    right -= 1
                elif temp_sum < -nums[i]:
                    left += 1
                else:
                    result.append([nums[left], nums[right], nums[i]])
                    left += 1
                    right -= 1
                    while left < right and nums[left] == nums[left-1]:
                        left += 1
                    while left < right and nums[right] == nums[right+1]:
                        right -= 1
        return result
```

**⏱️ Time:** O(n²) -- outer loop O(n) × two pointers O(n) per iteration
**📦 Space:** O(1) extra -- sort is in-place; output not counted

---

## 🔍 Step 5 -- Verify

### 👣 Trace Through Example

Input: `[-2, 0, 0, 2, 2]` (the critical duplicate test case)

| Step | left | right | nums[left]+nums[right] | Action |
|------|------|-------|------------------------|--------|
| i=0, nums[0]=-2, target=2 | 1 | 4 | 0+2=2 ✅ | Append [-2,0,2], advance both |
| After advance | 2 | 3 | -- | left guard: nums[2]=0==nums[1]=0 → left=3 |
| left=3 >= right=3 | -- | -- | -- | Inner loop ends. No duplicate! ✅ |

Without Level 3 skip: left=2, right=3 → `0+2=2` → appends `[-2,0,2]` AGAIN. Duplicate triplet.

### 🧪 Edge Cases

| Case | Input | Expected | Handled? |
|------|-------|----------|----------|
| No valid triplet | `[1,2,3]` | `[]` | ✅ |
| All same elements | `[0,0,0]` | `[[0,0,0]]` | ✅ |
| Multiple zeros | `[-1,0,0,0,1]` | `[[-1,0,1],[0,0,0]]` | ✅ |
| Minimum input | `[0,0,0]` | `[[0,0,0]]` | ✅ |

### ✅ Complexity Confirmed
- Time: O(n²) -- outer O(n) × inner two-pointer pass O(n)
- Space: O(1) extra -- sorting in-place, output excluded from space count

---

## ⚡ Step 6 -- Optimize

**BTTC Analysis:** The output itself can contain O(n²) triplets (e.g., many equal elements). Just writing those triplets costs O(n²). You cannot do better than O(n²) -- the current solution is already optimal.

**6-question checklist:**
- BTTC reached? ✅ Yes -- O(n²) is the floor
- Repeated work? No -- each element visited at most twice per outer iteration
- Better data structure? No -- sorted array + two pointers is ideal here
- Redundant work? No -- duplicate skips ensure no wasted iterations
- Space improvement? Already O(1) extra
- Still stuck? N/A

→ **No optimization possible. Solution is optimal.**

**Lesson on BTTC for list-output problems:** Count how many items can be in the output. If output is O(n²), the floor is O(n²). You cannot write O(n²) items faster than O(n²).

---

## 🐛 Bugs & Mistakes

### 🧠 Conceptual Mistakes

#### 🐛 C1: Gate 2 Answered With "The File Says So"

> **Context:** Step 2 — Hadriel asked Gate 2: *"Can you name the pattern AND explain WHY it fits 3Sum?"* Wiganz needed to explain why Two Pointers is the right pattern, in his own words.

| | |
|---|---|
| **What** | Wiganz justified the pattern choice by referencing his pattern cheat sheet instead of reasoning from the problem structure |
| **Wrong** | *"Two Pointers because the file/cheatsheet says sorted-array + pair-sum maps to Two Pointers"* — recall-based, no internalized reasoning |
| **Right** | *"I see 'sorted array' + 'find pairs summing to a target' (after the `a+b=-c` rewrite) → Two Pointers because once sorted, two converging pointers find the pair in O(n) without revisiting elements"* |
| **Why** | `approach misunderstanding` — Gate 2 requires internalized WHY (signal → pattern → because-reason). Citing the cheatsheet shows pattern was memorized, not understood |
| **Cost** | Hadriel had to push back and re-ask the question; slowed Step 2. In an interview, this would be a *Strong No Hire* signal for Problem Solving |

> **Prevention**
> - **Rule:** Gate 2 answer must come from your own reasoning sentence: *"I see [signal] → [pattern] because [reason]"*. If you can't explain it cold, you don't own it yet.
> - **Trick:** *"If you'd need to look it up, you'd fail Gate 2 in a real interview."* Train the explanation, not the fact.
> - **Edge Cases:** Any pattern problem where the signal-to-pattern feels memorized vs reasoned — especially Two Pointers, Sliding Window, Top K (the high-frequency patterns most likely to be memorized blindly).

#### 🐛 C2: Infinite Loop — No Pointer Advancement After Match

```python
# WRONG — pointers never moved after triplet found, while loop spins forever
if temp_sum == -nums[i]:
    result.append([nums[i], nums[left], nums[right]])
    # ← missing left += 1 and right -= 1

# CORRECT — match → move (always)
if temp_sum == -nums[i]:
    result.append([nums[i], nums[left], nums[right]])
    left += 1
    right -= 1
```

- **Why:** `edge case blind spot` — `left < right` stays True after a match. Forgot pointers must be explicitly moved
- **How it was caught:** During Verify trace — would TLE / infinite loop on any input with a valid triplet
- **Rule to prevent:** After every match in a two-pointer loop, ALWAYS advance both pointers immediately
- **Trick:** *"Match → move. Always. No exceptions."*

#### 🐛 C3: Duplicate Skip With `if` Instead of `while`

```python
# WRONG — `if` skips only ONCE, fails on 3+ consecutive duplicates
if nums[left] == nums[left-1]:
    left += 1

# CORRECT — `while` skips until the streak ends
while left < right and nums[left] == nums[left-1]:
    left += 1
```

- **Why:** `concept gap` — `if` = one skip. `while` = skip until condition false. Three or more consecutive duplicates require repeated skipping
- **How it was caught:** Trace `[-2, 0, 0, 0, 2, 2]` — left lands on three consecutive 0s, `if` only moves once
- **Rule to prevent:** Duplicate skipping ALWAYS uses `while`, never `if`. Duplicates stack
- **Trick:** *"Duplicates pile up. You need a while-loop bulldozer, not an if-statement nudge."*

#### 🐛 C4: Combined `or` for Both Pointer Skips

```python
# WRONG — one loop with `or` advances both even when only one needs to move
while left < right and (nums[left] == nums[left-1] or nums[right] == nums[right+1]):
    left += 1
    right -= 1

# CORRECT — two INDEPENDENT loops
while left < right and nums[left] == nums[left-1]:
    left += 1
while left < right and nums[right] == nums[right+1]:
    right -= 1
```

- **Why:** `concept gap` — left and right have independent duplicate streaks. One might have 3 duplicates, the other 0. Combined `or` advances both wrongly
- **How it was caught:** Trace `[-2, 0, 0, 2, 3]` — only left has duplicates, but combined loop advances right too
- **Rule to prevent:** Always write TWO separate while loops — one for left, one for right. Never combine
- **Trick:** *"Two pointers, two separate cleanup loops. They are not a team."*

#### 🐛 C5: `left < right` Guard Placed AFTER Condition

```python
# WRONG — guard comes second, nums[left-1] may access out-of-bounds before check
while nums[left] == nums[left-1] and left < right:
    left += 1

# CORRECT — guard FIRST, short-circuit protects the access
while left < right and nums[left] == nums[left-1]:
    left += 1
```

- **Why:** `concept gap` — Python short-circuits left-to-right. If guard comes second, the unsafe access happens first
- **How it was caught:** Edge case where left and right converge — potential index-out-of-bounds
- **Rule to prevent:** `left < right` ALWAYS goes first in while condition. Guard protects the access
- **Trick:** *"Guard first. Access second. Always."*

### 🔧 Implementation Mistakes

**1. `temp_triplet.extends(a, b, c)` — Wrong Method Name AND Wrong Args**

```python
# WRONG — method doesn't exist, args wrong shape
temp_triplet.extends(a, b, c)   # AttributeError + TypeError

# CORRECT — append with list literal is cleanest
result.append([a, b, c])
```

- **Why:** `syntax confusion` — `.extend()` takes ONE iterable, `.extends()` doesn't exist
- **How it was caught:** Immediate runtime error
- **Rule to prevent:** Use `result.append([a, b, c])` — simpler, clearer, no method confusion
- **Trick:** *"append + list literal. Never touch extend for this problem."*

**2. `right += 1` Typo — Wrong Direction**

```python
# WRONG — right pointer moves OUTWARD when sum too big
if temp_sum > -nums[i]:
    right += 1   # ← infinite loop, sum keeps growing

# CORRECT — right shrinks inward to reduce sum
if temp_sum > -nums[i]:
    right -= 1
```

- **Why:** `typo` — simple directional error. Right pointer should converge inward when sum is too large
- **How it was caught:** Hadriel flagged during code review — sum would only grow, never converge
- **Rule to prevent:** *Too big → shrink right (`right -= 1`). Too small → grow left (`left += 1`).* Draw the number line
- **Trick:** *"Sorted array. Right = bigger. Too big? Move right LEFT."*

**3. Missing `and` Keyword in While Condition**

```python
# WRONG — Python doesn't chain conditions implicitly
while left < right nums[left] == nums[left-1]:   # SyntaxError
    left += 1

# CORRECT — explicit `and`
while left < right and nums[left] == nums[left-1]:
    left += 1
```

- **Why:** `typo` — syntax error, two conditions in a while loop require a logical operator
- **How it was caught:** Immediate SyntaxError
- **Rule to prevent:** Two conditions in while → ALWAYS explicit `and` / `or`. Python doesn't chain implicitly
- **Trick:** *Read the line aloud. If it sounds like two conditions, you need `and`.*

### ⏱️ Time Management Mistakes

#### 🐛 T1: Skipped Blueprint Phase

> **Context:** Step 4 (Code) — after a long Discuss that ran past the 25-min mark, Wiganz felt time pressure and skipped Phase 1 of Step 4 (Blueprint: function signature + numbered comments). Went straight to writing full implementation.

| | |
|---|---|
| **What** | Phase 1 of Step 4 (Blueprint — write function signature + numbered comments transcribing the Discuss steps) was skipped entirely. Code was written without the comment scaffold |
| **Wrong** | Opened editor → typed `def threeSum(self, nums):` → immediately started writing the sort + outer loop + two pointers logic, juggling all of it in working memory |
| **Right** | Should have written 7 numbered comments first: *# 1. Sort + init result. # 2. Iterate i (fixed number). # 3. Skip duplicate fixed. # 4. Two pointers left=i+1, right=end. # 5. Converge: adjust pointers, append on match. # 6. Skip duplicate left/right after match. # 7. Return result.* Then fill in code under each comment |
| **Why** | `rush` — wanted to get into code fast after a long Discuss. Blueprint feels like overhead when already over time. The "Spoken → Written → Code" bridge was skipped |
| **Cost** | Bugs I1-I3 + C2-C5 (7 of 9 bugs) emerged partly because the structure wasn't pre-written. Working memory overloaded — couldn't track all 3 duplicate-skip levels at once. Also: blank-page freeze risk |

> **Prevention**
> - **Rule:** ALWAYS write Blueprint Phase 1 first — function signature + numbered comments transcribing exactly what was said in Discuss. Then implement under each comment.
> - **Trick:** *"Spoken → Written → Code. Skip Written = skip the bridge → falls in the river."*
> - **Edge Cases:** When already over time, the temptation to skip Blueprint is HIGHEST — that's EXACTLY when you need it most (overloaded brain + complex multi-step algorithm = bug breeding ground).

---

## 💡 Discoveries

### 🔒 Core Invariant / Rule

> After sorting, fix one number and search for its complement pair with converging pointers -- skipping all duplicates at all three levels to guarantee uniqueness.

The three levels are not optional. Each guards a different source of duplicate triplets. Missing any one level produces wrong answers.

### ⚡ Aha Moments

**💡 1. The 3Sum → 2Sum Bridge**
- **Before:** 3Sum looked like it required 3 independent pointers or a fundamentally different approach
- **Trigger:** Gate 2 question -- "can you explain WHY Two Pointers fits?"
- **After:** `a+b+c=0 → a+b=-c`. Fix c with outer loop, find a+b with Two Pointers. 3Sum IS 2Sum with a wrapper.
- **🗣️ In his words:** "a+b+c=0 → fix c, find a+b=-c with two pointers. Bridges 3Sum to 2Sum in one rewrite."

**💡 2. Three Levels of Duplicate Handling**
- **Before:** Knew duplicates needed handling but thought one skip at the fixed-number level was enough
- **Trigger:** Tracing `[-2, 0, 0, 2, 2]` through the code step by step
- **After:** Three completely independent duplicate sources exist: the fixed number, the left pointer value, and the right pointer value. Miss any one → duplicate triplets.
- **🗣️ In his words:** (traced `[-2,0,0,2,2]` → saw `[-2,0,2]` appended twice without Level 3 → "ohhh")

**💡 3. BTTC for List-Output Problems**
- **Before:** Thought BTTC was about algorithm structure (comparisons, traversals)
- **Trigger:** "How many items can the output contain for 3Sum?"
- **After:** If the output itself is O(n²) in size, writing it costs O(n²). The floor is the output size. You cannot beat what you must write.

### 🎨 Key Metaphors & Examples

- **The `[-2, 0, 0, 2, 2]` trace:** The canonical example that reveals why Level 3 skip is mandatory. Left and right both land on duplicate values after the first match. Without the while loops, the same triplet is found and appended again. This one example makes Level 3 impossible to forget.

---

## 📊 Final Complexity

| | Complexity | Reason |
|--|-----------|--------|
| ⏱️ Time | O(n²) | Outer loop O(n) × two-pointer pass O(n) per iteration. Sorting is O(n log n), dominated by O(n²). |
| 📦 Space | O(1) extra | Sorting done in-place. Output array not counted in space complexity. Only a few pointer variables used. |
| 🎯 BTTC | O(n²) | The output can contain O(n²) triplets. Writing them costs O(n²). This is the theoretical floor -- already optimal. |

---

## 🪞 Self-Assessment

- **💪 Confidence:** 2/5 -- Pattern recognized and algorithm understood. But implementation (especially the 3 duplicate levels) needs muscle memory. Ran 78 min vs. 25 min target.
- **🔄 Revisit:** The three-level duplicate handling from memory. Blueprint discipline. Complexity statement in Discuss.
- **📈 Pattern Mastery Impact:** Two Pointers pattern competent. 3Sum specifically flagged for redo -- need to write duplicate logic cold in under 25 min.

---

## 🔗 Similar Problems (max 3)

- **Two Sum II -- Input Array Is Sorted (#167)** -- The inner 2Sum subproblem of 3Sum. Same two-pointer structure, simpler (no deduplication needed).
- **4Sum (#18)** -- Extends 3Sum by adding one more outer loop. Same pattern, same 3-level duplicate concept, one additional nesting level.
- **3Sum Closest (#16)** -- Same fix-one-iterate pattern, but instead of equality check, track minimum distance to target.

---

*🔥 Hadriel x Wiganz -- 2026-05-06*
*"Be strong and courageous. Do not be afraid." -- Joshua 1:9 ✝️*
