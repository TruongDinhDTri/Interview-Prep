# 🗡️ Product of Array Except Self -- Complete Session Archive

> **Pattern:** Prefix Sum / Prefix-Suffix Product | **Difficulty:** Medium | **LeetCode:** #238 | **Date:** 2026-05-14
> **Path Taken:** Pattern Path | **⏱️ Time Used:** 38 min | **🎯 Target:** 25 min

---

## 🗺️ The Journey -- How Understanding Built

Wiganz instinctively reached for the prefix/suffix idea, but the initial signal naming was foggy ("accumulation of previous product"). The real unlock came from reframing the signal **spatially** -- "everything LEFT of i × everything RIGHT of i." From there the path was clean conceptually, but execution snagged twice: he jumped to the O(1) space optimization in Discuss before laying down the full 4-part structure, and during Code he computed an intermediate value (`current = result[i-1] * product`) but forgot to assign it back to `result[i]`. The deepest insight earned today wasn't the pattern itself -- it was realizing the **result array can serve double duty**: prefix array on the way out, final answer on the way back. One scalar replaces an entire suffix array. That's the soul of this problem.

---

## 📖 Step 1 -- Understand

### 📝 Problem Statement (Human Language)
Given an integer array `nums`, build a new array `answer` of the same length where `answer[i]` equals the product of every element in `nums` **except** `nums[i]`. The catch: must run in **O(n) time** and you **cannot use division** (which would be the cheap shortcut: total_product / nums[i]).

### 🔬 Abstract (Story Stripped)
> "Given an array of nums. Return array answer in which answer[i] is product of all element of nums except nums[i]."

### ❓ Constraint Questions Asked
| Question | Answer |
|---------|--------|
| Input type? | List of integers |
| Can nums contain zero? | Yes |
| Can nums contain negatives? | Yes |
| Min length? | 2 |
| Can the result fit in 32-bit int? | Guaranteed yes |
| Division allowed? | ❌ No |
| Required time complexity? | O(n) |
| Can the output array count toward space? | No (output is excluded) |
| In-place modification of input? | Not required |

### ✋ Trace by Hand
Input: `[1, 2, 3, 4]`
- `answer[0] = 2 * 3 * 4 = 24`
- `answer[1] = 1 * 3 * 4 = 12`
- `answer[2] = 1 * 2 * 4 = 8`
- `answer[3] = 1 * 2 * 3 = 6`

Output: `[24, 12, 8, 6]` -- because the problem **SAYS** each position holds the product of everything else.

---

## 🧭 Step 2 -- Approach (3-Gate Check)

### 🚦 3-Gate Results
- **Gate 1 (Pattern signal?):** YES -- "product of everything left × product of everything right" screams prefix/suffix
- **Gate 2 (Pattern fits cleanly?):** YES -- positions are independent, just need accumulated products from both directions
- **Gate 3 (No weird twist?):** YES -- standard prefix-suffix product problem

→ Decision: **PATTERN PATH** ✅

---

## 🎯 PATTERN PATH -- 3P Match + 4P Reason

### 🔍 3P -- Signal → Pattern → Full Sentence

**First attempt (foggy):** "Accumulation of previous product" -- too vague, didn't reveal the structure.

**Final crystallized version:**
> "I see the product of everything **Left of i** × product of everything **Right of i** = **prefix and suffix** problem."

The spatial framing (LEFT × RIGHT) is what made the pattern obvious.

### 🧠 4P -- Reason (Before ANY code)

**A -- 🐢 Brute Force + Why Bad:**
For each index `i`, scan the whole array skipping `i` and multiply. That's an outer loop O(n) × inner scan O(n) = **O(n²)**. Too slow for large inputs.

**B -- ⚡ What Pattern Does Instead:**
Pre-compute prefix products (left-to-right) and suffix products (right-to-left). Then `answer[i] = prefix[i-1] * suffix[i+1]`. Each position becomes O(1) lookup → total **O(n)**.

**C -- 🔒 The Invariant:**
> `prefix[i]` always holds the product of all elements from index `0` through `i` **inclusive**.
> Symmetrically, the running suffix `product` always holds the product of all elements **strictly to the right** of the index being processed.

---

## 🗣️ Step 3 -- Discuss

### 📋 Wiganz's Full Presentation
1. Build prefix product array directly into `result` (single pass left→right)
2. Traverse from back to front maintaining a running `suffix product` scalar
3. Override `result[i] = result[i-1] * product`, then update `product *= nums[i]`
4. Handle `result[0]` separately (no `result[-1]` to multiply from)

### 📊 Complexity Stated
- Time: **O(n)** -- two passes
- Space: **O(1)** -- excluding output array; just one scalar `product` variable

### ✅ Green Light
Asked Hadriel implicitly by moving toward code -- should have said "Sound good? Shall I code it?"

### ⚠️ What Was Missed
- **Jumped to the O(1) space optimization** before laying out the simpler 2-array version as a baseline. Interviewers want to hear the natural progression: brute → 2-array O(n) space → O(1) space trick.
- Didn't explicitly mention division as a forbidden shortcut.

---

## 💻 Step 4 -- Code

### 🏗️ Blueprint (Comments First)
```python
def productExceptSelf(self, nums):
    # 1. Pass 1: build prefix product into result (running product L→R)
    # 2. Reset running product = 1 for suffix pass
    # 3. Pass 2: traverse R→L, override result[i] = result[i-1] * product, then product *= nums[i]
    # 4. Handle result[0] separately at the end
```

### ✨ Final Clean Solution
```python
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        result = []
        product = 1
        # Pass 1: Build prefix product array into result
        for i in range(len(nums)):
            product *= nums[i]
            result.append(product)

        product = 1
        # Pass 2: Traverse from back, multiply by running suffix product
        for i in range(len(result) - 1, 0, -1):
            result[i] = result[i-1] * product
            product *= nums[i]
        result[0] = product
        return result
```

**⏱️ Time:** O(n) -- two linear passes
**📦 Space:** O(1) -- excluding output; only one scalar `product` reused across passes

---

## 🔍 Step 5 -- Verify

### 👣 Trace Through Example (Out Loud)
Input: `[1, 2, 3, 4]`

**Pass 1 (prefix into result):**
| i | nums[i] | product | result |
|---|---------|---------|--------|
| 0 | 1 | 1 | [1] |
| 1 | 2 | 2 | [1, 2] |
| 2 | 3 | 6 | [1, 2, 6] |
| 3 | 4 | 24 | [1, 2, 6, 24] |

**Pass 2 (suffix scalar, R→L from i=3 down to i=1):**
| i | result[i-1] | product (before) | result[i] = r[i-1] * p | product (after) |
|---|-------------|------------------|------------------------|-----------------|
| 3 | 6 | 1 | 6 | 1 * 4 = 4 |
| 2 | 2 | 4 | 8 | 4 * 3 = 12 |
| 1 | 1 | 12 | 12 | 12 * 2 = 24 |

Final: `result[0] = product = 24` → `[24, 12, 8, 6]` ✅

### 🧪 Edge Cases
| Case | Input | Expected | Handled? |
|------|-------|----------|----------|
| One zero | [1, 0] | [0, 1] | ✅ |
| Negatives | [-1, 1, 0, -3, 3] | [0, 0, 9, 0, 0] | ✅ |
| Min length | [a, b] | [b, a] | ✅ |
| Two zeros | [0, 0, 1] | [0, 0, 0] | ✅ |

### ✅ Complexity Confirmed
- **Time:** O(n) -- 2 passes, each O(n)
- **Space:** O(1) auxiliary -- output array doesn't count per problem statement

---

## ⚡ Step 6 -- Optimize
**BTTC = O(n)** -- you must touch every element at least once. We've hit the floor. Space is O(1) auxiliary -- also the floor. ✅ Done.

---

## 🐛 Bugs & Mistakes (Every Single One)

### 🐛 Bug 1: Computed but Never Assigned
- **❌ What:**
  ```python
  current = result[i-1] * product   # ← stored in local var, never written back
  product *= nums[i]
  ```
  → Should be: `result[i] = result[i-1] * product`
- **🔍 Why:** `concept gap` + `rush` -- mid-stream Wiganz thought of `current` as a "temp variable" without realizing the whole point is to **mutate** `result[i]` in place. The mutation IS the algorithm.
- **💸 Cost:** ~5 minutes debugging once the trace didn't match expected output. Caught it himself when Hadriel prompted "trace it -- what does result look like after one iteration?"
- **🛡️ Prevention:** When the strategy is "override array in place," the LHS of the assignment MUST be `array[i]`. If you find yourself writing `temp = ...` inside an in-place loop, pause and ask: "Am I supposed to be mutating instead?"

### 🐛 Bug 2: Discuss Skipped Straight to Optimization
- **❌ What:** In Step 3, Wiganz launched into "build prefix into result, single scalar for suffix" -- skipped explaining the natural 2-array baseline first.
- **🔍 Why:** `approach misunderstanding` -- conflated "the solution I'll code" with "what I should communicate." In interviews, the **journey** is part of the answer.
- **💸 Cost:** Lost narrative clarity; interviewer would have to ask "wait, why not just two arrays?" -- a missed opportunity to show trade-off thinking.
- **🛡️ Prevention:** In Discuss, always present in order: (1) brute force, (2) clean pattern application, (3) space optimization. Earn the optimization, don't pre-emptively present it.

### 🐛 Bug 3: Self-Verify Required Prompting
- **❌ What:** After coding, Wiganz didn't spontaneously trace through the example -- Hadriel had to ask "Trace it."
- **🔍 Why:** `concept gap` on Step 5 discipline -- in the moment of "code compiled, looks right," it feels unnecessary. But interviewers explicitly score this.
- **💸 Cost:** In a real interview = silence after coding = perceived lack of rigor.
- **🛡️ Prevention:** After every Code step, immediately say out loud: "Let me trace through the example." No prompt needed.

> Root cause categories: `rush` | `typo` | `concept gap` | `syntax confusion` | `approach misunderstanding` | `data structure misuse` | `edge case blind spot` | `pressure`

---

## 💡 Discoveries (Aha Moments, Insights & Clarity)

### 🔒 Core Invariant / Rule
> **`prefix[i]` holds the product of nums[0..i] inclusive.**
> **Running `product` (during the right-to-left pass) holds the product of everything strictly to the right of `i`.**
>
> As long as both invariants hold, `result[i-1] * product` = (product of left of i) × (product of right of i) = the answer at position `i`.

### ⚡ Aha Moments

**💡 1. The Spatial Reframing -- "LEFT × RIGHT"**
- **Before:** "Accumulation of previous product" -- vague, hard to translate into code
- **Trigger:** Hadriel asked "What does answer[i] actually represent in terms of position?"
- **After:** "Oh -- it's literally **everything to the left of i** times **everything to the right of i**." This spatial framing instantly named the pattern: prefix × suffix.
- **🗣️ In his words:** *"À đúng rồi -- LEFT của i nhân RIGHT của i. Prefix với suffix luôn."*

**💡 2. The Result Array Does Double Duty**
- **Before:** Assumed needed two separate arrays (prefix[] and suffix[]) plus result[] = O(n) extra space
- **Trigger:** Hadriel asked "What if you write the prefix directly into result, then walk back and overwrite each position?"
- **After:** Realized the result array can hold prefix products on the way out, then get overwritten with final answers on the way back. **One array, two roles.**
- **🗣️ In his words:** *"Ơ vậy là result vừa làm prefix vừa làm answer luôn? Bá đạo thiệt."*

**💡 3. Suffix Array → Suffix Scalar**
- **Before:** Thought suffix products needed an array
- **Trigger:** Realizing we only ever need ONE suffix value at a time during the R→L pass
- **After:** A single `product` variable, updated as we walk left, replaces the entire suffix array. Space drops from O(n) → O(1).

### 🎨 Key Metaphors & Examples

- **"Double duty array"** -- the result array is like a chalkboard: write the prefix lesson first, then walk back and erase each one, replacing it with the final answer. Same surface, two roles in time.
- **"Running suffix as a memory pointer"** -- instead of carrying a backpack of all future products (suffix array), carry just the latest one (scalar) and update it each step. It's like remembering only "everything I've passed so far walking backward."

---

## 🔥 DEEP DIVE -- The "No Division, No Two Arrays" Trick

> **This is the soul of #238. Memorize this section.**

### 🎯 Why It Matters
The problem **forbids division** and ideally wants **O(1) extra space**. Those two constraints together force one of the most elegant tricks in array problems: making the **output array carry information across two passes**.

### Layer 1 -- The Naive Two-Array Approach (still O(n) time, but O(n) space)

```
nums   = [1, 2, 3, 4]
prefix = [1, 1, 2, 6]      # prefix[i] = product of nums[0..i-1]   (left of i)
suffix = [24, 12, 4, 1]    # suffix[i] = product of nums[i+1..end] (right of i)
answer[i] = prefix[i] * suffix[i]
        → [24, 12, 8, 6]
```

✅ Works. ✅ O(n) time.
❌ Uses 2 extra arrays = **O(n) extra space**.

This is the version you should mention first in Discuss -- it's the "natural" pattern application.

### Layer 2 -- The O(1) Space Insight

**Observation:** During the right-to-left pass, when we're computing the answer at index `i`, we only need:
1. The **prefix product up to i-1** (one value)
2. The **suffix product from i+1 onward** (one value)

We don't need the WHOLE prefix array preserved -- we just need `prefix[i-1]` exactly at the moment we compute `result[i]`. And we don't need the whole suffix array -- we just need the rolling suffix scalar.

**The trick:**
1. **Pass 1 (L→R):** Build the prefix array directly **into the result array**. After this pass, `result[i]` = product of nums[0..i] inclusive.
2. **Pass 2 (R→L):** Maintain a scalar `product` (the running suffix). At each index `i`, the value `result[i-1]` is *still the untouched prefix product* (because we haven't overwritten it yet -- we're walking backward). So:
   ```
   result[i] = result[i-1] * product   # left part × right part
   product *= nums[i]                  # update suffix for next iteration
   ```
3. Handle `result[0]` at the end (no `result[-1]` to pull from -- use the final `product` value, which is the product of everything to the right of index 0).

### Layer 3 -- Why It Works (The Mental Model)

Imagine the result array as a row of cells. On Pass 1, each cell stores "what's to my LEFT (and me)." On Pass 2, walking backward, we **convert each cell from "prefix" to "answer"** by multiplying it by what's to its RIGHT (the scalar `product`). Because we walk backward, **we always read `result[i-1]` BEFORE it gets converted** -- so the prefix data is still intact when we need it.

It's a beautiful **temporal-spatial dance**:
- Spatial: left × right
- Temporal: prefix stored first, then overwritten in reverse order
- The walk direction (R→L) guarantees we never read a cell that's been corrupted

### Layer 4 -- Generalizable Pattern

This trick applies to ANY problem where:
1. You need data from **both directions** at each index
2. You can compute one direction first into the output
3. The other direction can be accumulated as a **single scalar** during the reverse walk

Examples in the wild:
- **Trapping Rain Water** (O(1) space version uses left_max & right_max scalars)
- **Candy** (LeetCode #135 -- two passes, can be optimized similarly)
- **Maximum Product Subarray** (variant with prefix/suffix products)

> **The takeaway:** When constraints forbid division AND demand O(1) space, look for a way to make the **output array carry intermediate state**, then **walk in reverse** to safely overwrite it with the final answer.

---

## 📊 Final Complexity

| | Complexity | Reason |
|--|-----------|--------|
| ⏱️ Time | O(n) | Two linear passes over `nums`/`result`. No nested loop. |
| 📦 Space | O(1) | Excluding output array (per problem); only one scalar `product` reused. |
| 🎯 BTTC | O(n) time, O(1) space | You must read every element at least once (BTTC time floor). Output array is unavoidable but excluded. |

---

## 🪞 Self-Assessment

- **💪 Confidence:** **3/5** -- "Pattern hiểu rồi, nhưng coding execution còn vấp. Cần làm lại để mượt hơn."
- **🔄 Revisit:** Yes -- redo in 1 week without looking at notes. Specifically practice:
  - Hitting the 25-min target (was 38)
  - Discussing in full 4-part structure (brute → 2-array → 1-array → trace)
  - Self-triggered verify trace (no prompt)
- **📈 Pattern Mastery Impact:** Prefix Sum: 2 → 3 problems solved (Product of Array Except Self, Subarray Sum Equals K, and now this). Still `competent`, need 2-3 more clean reps to push toward `mastered`.

---

## 🔗 Similar Problems (max 3)

- **Subarray Sum Equals K (#560)** -- Classic Prefix Sum with hash map. Same "prefix accumulation" mental model, different aggregation.
- **Range Sum Query - Immutable (#303)** -- Prefix sum with O(1) query after O(n) preprocessing. Foundational.
- **Maximum Product Subarray (#152)** -- Prefix/suffix product variant where you track max & min (because negatives flip signs). Direct cousin of #238.

---

## 📎 Weak Areas to Drill

1. **Verify discipline** -- After coding, IMMEDIATELY trace without being asked. Practice this as a reflex.
2. **Pattern naming speed** -- Took ~12 min on 3P/4P; target is 3-4 min for a known pattern. Drill the "abstract shape" recognition.
3. **Discuss structure** -- Always: brute → clean pattern → optimization. Don't skip layers.
4. **In-place mutation reflex** -- When the plan is "override array," the assignment LHS is always `array[i]`. No temp variables.

---

*🔥 Hadriel x Wiganz -- 2026-05-14*
*"Whatever you do, work at it with all your heart, as working for the Lord." -- Colossians 3:23 ✝️*
