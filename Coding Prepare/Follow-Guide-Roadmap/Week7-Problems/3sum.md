# 3Sum — LeetCode #15

**Date:** 2026-05-06
**Session Time:** 1:17:46 total | Target was 25:00 | Ran +52:46 over
**Pattern:** Two Pointers (after sort)
**Difficulty:** Medium
**Status:** ✅ Solved — full Road loop complete

---

## The Problem

Given an integer array `nums`, return all **unique triplets** `[a, b, c]` such that `a + b + c == 0` and indices are distinct.

**Abstract version (stripped):** Given an array of integers, find all unique sets of 3 numbers that sum to 0.

**Constraints confirmed:**
- Input NOT sorted (we sort it ourselves)
- Values can be negative, zero, positive
- Duplicates CAN exist in the input
- Min length: 3 — empty input not possible
- Return: array of triplets (values, not indices)
- Multiple valid answers — return ALL

**Example:**
```
Input:  [-1, 0, 1, 2, -1, -4]
Output: [[-1, -1, 2], [-1, 0, 1]]
```

---

## The Road Journey

### Step 1 — Understand

- Paraphrase: "Given a list of numbers, find all triplets of 3 numbers at different positions that sum to 0. All returned triplets must be unique."
- Abstract: "Given an array of integers, find all unique sets of 3 numbers that sum to 0."
- Trace: `[-1, 0, 1, 2, -1, -4]` → `[-1, 0, 1]` valid because `-1+0+1=0`. `[-1, -1, 2]` valid because `-1-1+2=0`. WHY according to problem rules: because the sum equals 0 — Definition WHY, not Algorithm WHY. ✅

**Step 1 took ~8 min.** A bit long. Should be 3-4 min max.

---

### Step 2 — Approach (3-Gate Check)

```
☑ Gate 1: Abstract shape matches Two Pointers signature → YES
           Signal: "find pairs summing to target" in the subproblem
☑ Gate 2: Can name it AND explain why → YES
           Key insight discovered here: a + b = -c
           Fix one number c, then find two numbers in remaining array summing to -c.
           That's 2Sum — Two Pointers on sorted array.
☑ Gate 3: Solved 2Sum with Two Pointers before → YES
→ Decision: PATTERN PATH
```

**⚡ AHA MOMENT — The Bridge from 3Sum to Two Pointers:**

3Sum looks like it needs 3 pointers. But the magic rewrite is:

```
a + b + c = 0
→ a + b = -c
```

Fix `c` (iterate with outer loop). Now you have exactly 2Sum: find `a` and `b` in the remaining array that sum to `-c`. Two Pointers handles this in O(n). Outer loop is O(n). Total: O(n²).

**Meta discussion captured:** Wiganz noticed Gate 2 and 4P-B feel similar.
- Gate 2 = quick YES/NO, one sentence, to pick the path
- 4P-B = full presentation of the insight for the interviewer, earns rubric points
- Same idea, different depth and audience.

---

### 4P — Reason

**A — Brute Force + Why Bad:**
3 nested loops. Check every possible triplet. O(n³). Way too slow.

**B — What Two Pointers Does Instead:**
- Sort the array → O(n log n)
- Fix one number with outer loop (i)
- For each fixed number, use two converging pointers (left, right) on the remaining subarray
- If sum too big → right--. If sum too small → left++. If equal → found triplet.
- Each element visited at most twice per outer iteration → O(n²) total.

**C — The Invariant:**
Once a fixed number `c` has been fully processed (all pairs found), we never need to revisit it. If a triplet existed with that `c`, the converging pointers would have found it. The array being sorted guarantees the pointers don't miss any pair.

---

### Step 3 — Discuss

**Approach presented:**
1. Sort the array. Initialize result = [].
2. Iterate through array with index `i` (fixed number = `nums[i]`).
3. Skip duplicate fixed numbers: `if i > 0 and nums[i] == nums[i-1]: continue`
4. Two pointers: `left = i+1`, `right = len(nums)-1`, converge inward searching for `-nums[i]`
5. `temp_sum > -nums[i]` → right--. `temp_sum < -nums[i]` → left++. Equal → append triplet, advance both.

**Complexity:** Time O(n²), Space O(1) extra (not counting output).

**Two things Wiganz missed initially in Discuss:**
1. Forgot to state time/space complexity (said O(n) for time — wrong)
2. Did not address duplicate handling for left/right pointers (only mentioned fixed number duplicate skip)

---

### Step 4 — Code

**⚠️ Wiganz skipped the Blueprint phase** — jumped straight to full implementation.
Rule: Write function signature + numbered comments FIRST. Then fill in. "Spoken → Written → Code."

**Final clean code:**

```python
class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        # 1. Initialize result, sort array
        nums.sort()
        result = []
        # 2. Iterate through array
        for i in range(len(nums)):
            # Skip duplicate fixed numbers (sorted → duplicates are adjacent)
            if i > 0 and nums[i] == nums[i-1]:
                continue
            # 3. Two pointers: left = i+1, right = end, converge inward to find -nums[i]
            left = i + 1
            right = len(nums) - 1
            while left < right:
                temp_sum = nums[left] + nums[right]
                # 4. Adjust pointers based on comparison to target
                if temp_sum > -nums[i]:
                    right -= 1
                elif temp_sum < -nums[i]:
                    left += 1
                else:
                    result.append([nums[left], nums[right], nums[i]])
                    left += 1
                    right -= 1
                    # Skip duplicate left values
                    while left < right and nums[left] == nums[left-1]:
                        left += 1
                    # Skip duplicate right values
                    while left < right and nums[right] == nums[right+1]:
                        right -= 1
        return result
```

---

## 🔥 The Three Levels of Duplicate Handling — THE MOST IMPORTANT THING

This problem has **3 independent places** where duplicates must be killed. Miss any one → wrong answer.

### Level 1: Skip Duplicate FIXED Numbers

```python
if i > 0 and nums[i] == nums[i-1]:
    continue
```

**Why:** If `nums[i]` is the same as the previous fixed number, we'd find the exact same triplets again. Skip it.

**WHY sorted matters:** Duplicates of the same number sit NEXT TO EACH OTHER after sorting. So `nums[i] == nums[i-1]` is exactly the check.

Example: `[-1, -1, 0, 1, 2]` → when `i=1`, `nums[1]=-1 == nums[0]=-1` → skip.

---

### Level 2: Advance Pointers After Finding Triplet (Infinite Loop Bug)

```python
left += 1
right -= 1
```

**Why:** After appending a triplet, the pointers don't move automatically. `while left < right` is still true. Same triplet gets appended forever → infinite loop.

**This was the first bug caught in Verify.** Wiganz found it by tracing the else branch and asking: "what happens to left and right after this?"

---

### Level 3: Skip Duplicate LEFT and RIGHT Values After Triplet

```python
while left < right and nums[left] == nums[left-1]:
    left += 1
while left < right and nums[right] == nums[right+1]:
    right -= 1
```

**Why:** After finding a triplet and advancing pointers, the new position might have the same value as the old one. Since the fixed number hasn't changed, the same triplet would be found again.

**Caught by tracing `[-2, 0, 0, 2, 2]`:**
- i=0, nums[0]=-2. left=1, right=4. Triplet [-2, 0, 2] found. left→2, right→3.
- nums[2]=0 + nums[3]=2 = 2 = -(-2) → SAME TRIPLET appended again! Duplicate.

**The fix rules:**
- `left < right` FIRST (short-circuit guard — never access nums[left] if out of bounds)
- Two SEPARATE while loops — left and right are independent. One might have 3 duplicates, the other 0. A combined `or` loop moves both even when only one needs to move. ❌

---

## All Bugs Made During This Session

| # | Bug | Caught At | How |
|---|-----|-----------|-----|
| 1 | Gate 2 answered with "the file says so" | Gate 2 | Hadriel pushed for own words |
| 2 | Skipped Blueprint phase | Step 4 | Hadriel flagged it |
| 3 | `temp_triplet.extends(a, b, c)` — wrong method name + wrong args | Step 4 | Syntax error |
| 4 | **Infinite loop** — no pointer advancement in `else` branch | Step 5 Verify | Traced else branch: left/right = nothing |
| 5 | Duplicate skip with `if` instead of `while` | Step 5 | "What if 3+ duplicates in a row?" |
| 6 | Combined `or` in one while loop | Step 5 | "Left and right are independent" |
| 7 | `right += 1` typo (should be `-=1`) | Step 5 | Hadriel caught it |
| 8 | `left < right` guard AFTER condition instead of BEFORE | Step 5 | Short-circuit explanation |
| 9 | Missing `and` keyword: `while left<right nums[left]...` | Step 5 | Syntax check |

**Lesson:** Most bugs were caught during the Verify trace, NOT during coding. This is why the trace matters.

---

## Complexity

| | Complexity |
|---|---|
| Time | O(n²) — outer loop O(n) × two pointers O(n) per iteration |
| Space | O(1) extra — sorting in-place, output not counted |
| BTTC | O(n²) — the output itself can contain O(n²) triplets. Just writing them costs O(n²). You cannot do better. |

---

## Time Performance

| Phase | What Happened |
|-------|---------------|
| Before + Step 1 | ~8 min — slightly long, should be 3-4 min |
| Step 2 (Gates) | ~6 min — Gate 2 discussion + meta Gate2 vs 4P-B question |
| Step 3 (Discuss) | ~13 min — missed complexity + duplicate discussion |
| OVER 25 MIN MARK | Still in Step 3 — no code written yet |
| Step 4 (Code) | ~10 min |
| Step 5 (Verify) | ~25 min — multiple bug iterations |
| Step 6 (Optimize) | ~5 min |
| **Total** | **~78 min** |

**What cost the most time:** Step 5 Verify bug fixing loop. 9 distinct bugs, most from the duplicate handling logic.

**What to drill next time:** Write the duplicate-skipping logic from muscle memory. Know the three levels cold before entering the exam.

---

## Hadriel's Notes for Next Time

1. **Don't skip Blueprint.** Comments first. Every time. The blank-page freeze is worse than 1 minute of comments.

2. **In Discuss, always end with complexity.** "Time O(n²), Space O(1). BTTC is O(n²) — already optimal. Shall I code?"

3. **The 3-level duplicate pattern is THE hardest part of this problem.** Internalize it:
   - Level 1: fixed number → `if i > 0 and nums[i] == nums[i-1]: continue`
   - Level 2: advance pointers → `left += 1; right -= 1`
   - Level 3: skip adjacent dupes → two separate `while left < right and ...` loops

4. **`left < right` always goes FIRST in the while condition.** Python short-circuits left-to-right. Guard before access.

5. **Gate 2 should be 1-2 sentences.** Not a deep explanation. That's 4P's job. Gate 2 = "I see [signal] which tells me [pattern] because [brief reason]." Done.

6. **The BTTC for problems that return lists:** count how many items can be in the output. If output is O(n²), the floor is O(n²). You can't write O(n²) items faster than O(n²).

---

## The Invariant (One Sentence)

> After sorting, fix one number and search for its complement pair with converging pointers — skipping all duplicates at all three levels to guarantee uniqueness.

---

*Hadriel × Wiganz — 2026-05-06 🔥⚔️*
*"Be strong and courageous. Do not be afraid." — Joshua 1:9*
