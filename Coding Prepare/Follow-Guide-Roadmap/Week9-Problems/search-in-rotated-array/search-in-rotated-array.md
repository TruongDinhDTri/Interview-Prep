# 🗡️ Search in Rotated Sorted Array — Complete Session Archive

> **Pattern:** Binary Search (modified — half-sorted detection) | **Difficulty:** Medium | **LeetCode:** #33 | **Date:** 2026-06-10
> **Path Taken:** Pattern Path (3-gate PASSED — recognized + justified Binary Search) | **⏱️ Mode:** Solo solve → process-audit + invariant-discovery with Hadriel | **🎯 Target:** the invariant, not speed
> **🎨 Visualization:** [`search-in-rotated-array-viz.html`](./search-in-rotated-array-viz.html)

---

> Wiganz solved this one solo and got it AC — clean O(log n), correct on the first real submit. So why an archive? Because the WIN hid two wounds and one buried treasure. The treasure: the **invariant**, which he literally wrote "I DON'T KNOW" for in 4P-C — even though he had ALREADY discovered it up in Step 1 (the wrong room). The audit became a hunt for the one promise that survives rotation: *the whole array is broken, but **at least ONE half is always sorted** — and only the sorted half can you trust a range check on.* This archive tells that discovery in three acts. 🌿

---

# 🧠 The Curated Journey

## 📖 Step 1 — Understand

**Problem:** A sorted ascending array gets rotated at some unknown pivot `k`. Given the rotated array and a `target`, return its index, or `-1` if absent. Must run in **O(log n)**.

**Key constraints:** distinct values, the O(log n) requirement is the whole game (it BANS the linear scan), return an index, no rotation is a valid case (k could make it look un-rotated).

```python
nums = [4,5,6,7,0,1,2]   target = 0   →   4
```

> **🚨 THE FIRST WOUND — Step 1 did too much (boundary violation).**
> In his own transcript, under "Trace the example," Wiganz didn't just confirm the contract — he **discovered the entire algorithm**: the left/right portion case analysis, the four jumping rules, the whole thing. That is *Algorithm-WHY*. It belongs in **4P Reason**, NOT Step 1. Step 1's only job: confirm WHAT goes in and WHAT comes out (Definition-WHY). The 5-year-old test — "point at `[4,5,6,7,0,1,2]`, target 0 lives at index 4 because that's where the 0 is" — that's all Step 1 needed. He blew past it and started solving.

**Definition-WHY (what Step 1 SHOULD have stopped at):** output is 4 because that's the index where `target` sits. Done. Move to Step 2.

### 🧭 Step 2 — Approach — The Gate That PASSED

3-Gate for Binary Search:
1. **Abstract shape match?** — ✅ "sorted-ish array + search faster than O(n) + eliminate half based on the middle"
2. **Name it + justify WHY?** — ✅ *"Binary Search, because I can still make use of the two sorted halves and a condition to decide which half to throw away."*
3. **Solved before?** — ✅ "Yes, this exact problem, a long time ago."

> **W's justification (the assumption, proven):**
> *"I see `sorted array + based on middle to move + eliminate half of search space` which tells me Binary Search, because I can use those 2 sorted halves and a condition to jump over the other half."*

→ **Decision: PATTERN PATH.** Gate earned. The justification he built here is the SAME rule he'll formalize as the invariant in 4P — except he forgot to deliver it there.

---

## 🔥 The Invariant — Discovered in 3 Acts

This is the heart of the archive. Binary Search is an engine that leans on **one promise**. Rotation breaks the obvious promise — but a quieter one survives. Here is the journey to find it.

### 🎬 Act 1 — The Original Promise (what makes Binary Search legal)

In a **normal** sorted array, throwing away half is safe because of ONE guaranteed fact — the invariant:

```
[1, 3, 5, 7, 9]              the array is SORTED
              ↑ mid = 5
target = 2 < 5  →  it CANNOT be on the right (everything right of mid is bigger)
              →  throw the right half away, guilt-free.
```

The **sortedness** is the promise the whole engine leans on. No sortedness → no legal "throw half away."

### 🎬 Act 2 — Rotation Breaks It 💥

```
[4, 5, 6, 7, 0, 1, 2]        climbs... then SLAPS down at the 7→0 cliff
              └─ the cliff ─┘
```

The whole array is **no longer sorted**. The original promise is **DEAD**. You can no longer say "target < mid → it's not on the right" — because the right side might wrap around to small numbers. Naive Binary Search would throw away the wrong half and lose the answer.

### 🎬 Act 3 — The Surviving Promise (the REAL invariant) 🌿

Split at `mid`. Even though the WHOLE array is broken:

> **At least ONE of the two halves is always fully sorted.** — *Wiganz's own words at the breakthrough*

Counter-tested to prove it's "at least one," not "both":

```
[5, 6, 7, 0, 1, 2, 4]   split at mid = index 3 = value 0
 └── left [5,6,7,0] ──┘   ❌ NOT sorted (has its own cliff 7→0)
              └ right [1,2,4] ┘   ✅ IS sorted
```

So you can't assume both — you must **DETECT which half is sorted**. The test:

```
nums[left] <= nums[mid]   →   LEFT half is the sorted one
else                      →   RIGHT half is the sorted one
```

And the killer consequence — Wiganz's second breakthrough line:

> *"Only the sorted half can I trust the range check."*

Because only on a sorted half does "is `target` between these two endpoints?" mean anything. So the algorithm becomes:

```
1. Find which half is sorted.
2. Ask: does target fall inside that sorted half's range?
   YES → hunt there.   NO → throw that half away, the answer is in the other.
```

> **🩹 THE SECOND WOUND (and it's the SAME wound as the first).**
> In 4P-C, asked for the invariant, Wiganz literally wrote **"I DON'T KNOW."** But he DID know — he'd discovered it up in Step 1, the wrong room. The insight was real; it just never got **delivered** to the room where it was needed. Wound #1 (discovering too early) and Wound #2 ("I don't know" later) are one injury: **discovery happened in the wrong room, so the right room came up empty.**

---

### 🗣️ Step 3 — Discuss

**Presentation (as told to the interviewer):**
1. "Set `left`, `right` to the ends."
2. "Loop while `left <= right` (the `<=` is what lets a size-1 window still get checked)."
3. "Compute `mid`. If `nums[mid] == target`, return `mid`."
4. "Detect the sorted half: `nums[left] <= nums[mid]` → left half sorted, else right half sorted."
5. "On the SORTED half, do the range check. If target's in range → search there; else throw it away."
6. "Loop exhausts → return `-1`."

**Complexity:** Time **O(log n)** (still halving every step), Space **O(1)**. ✅ Correct.

> **⚡ The almost-trap he got RIGHT:** strict vs non-strict bounds. He used `nums[left] <= target < nums[mid]` — note `< nums[mid]`, not `<=`. His own comment nailed the why: *"when we came down here we are already sure mid is not what we need"* (the `== target` check already returned). So `mid` is excluded from the range on purpose. This is the kind of boundary that silently fails 10% of cases — he reasoned it instead of guessing.

### 💻 Step 4 — Code

**Blueprint:** ✅ He DID write comments-first (transcribed the rules from Discuss). Good Road discipline.

```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:                       # <= keeps size-1 window alive
            mid = (left + right) // 2
            if nums[mid] == target:                # found it
                return mid
            if nums[left] <= nums[mid]:            # ← LEFT half is sorted
                if nums[left] <= target < nums[mid]:   # target in sorted-left range
                    right = mid - 1                    #   → hunt left
                else:
                    left = mid + 1                     #   → answer is right
            else:                                  # ← RIGHT half is sorted
                if nums[mid] < target <= nums[right]:  # target in sorted-right range
                    left = mid + 1                     #   → hunt right
                else:
                    right = mid - 1                    #   → answer is left
        return -1
```

|           | Complexity | Reason                                                        |
| --------- | ---------- | ------------------------------------------------------------- |
| ⏱️ Time | O(log n)   | Every iteration discards half the search space                |
| 📦 Space  | O(1)       | Only two pointers + `mid`; no extra structure                 |
| 🎯 BTTC   | O(log n)   | Search in a sorted-ish array — log floor; **already optimal** |

### 🔍 Step 5 — Verify

```
nums = [4,5,6,7,0,1,2]   target = 0
```

| Round | left,right | mid | nums[mid] | sorted half | decision                     | result        |
| ----- | ---------- | --- | --------- | ----------- | ---------------------------- | ------------- |
| 1     | 0,6        | 3   | 7         | left (4≤7)  | 0 not in [4,7) → go right    | left = 4      |
| 2     | 4,6        | 5   | 1         | left (0≤1)  | 0 not in [0,1) → go right... | right = 4     |
| 3     | 4,4        | 4   | 0         | —           | `nums[mid] == target`        | **return 4** ✅ |

> **❌ THE THIRD WOUND — Verify tested only the happy path.** He traced exactly ONE input and called it done. A real interviewer pounces on that. The smallest inputs and the "not found" case are where bugs hide:

**Edge Cases (from the viz — the ones he skipped):**

| Case               | Input                          | Expected | Handled? | Why                                          |
| ------------------ | ------------------------------ | -------- | -------- | -------------------------------------------- |
| Empty array        | `[]`, t=3                      | -1       | ✅       | `right = -1`, loop never runs                |
| Single element     | `[1]`, t=1 / `[1]`, t=0        | 0 / -1   | ✅       | `left <= right` handles the size-1 box       |
| Target not present | `[4,5,6,7,0,1,2]`, t=3         | -1       | ✅       | loop exhausts → falls to `return -1`         |
| No rotation        | `[1,2,3,4,5]`, t=4             | 3        | ✅       | left half always sorted → plain binary search|
| Target at the seam | `[4,5,6,7,0,1,2]`, t=0         | 4        | ✅       | the pivot value itself (traced above)        |
| Two elements       | `[3,1]`, t=1                   | 1        | ✅       | smallest rotation; mid=left, right half sorted |

### ⚡ Step 6 — Optimize

BTTC for search-in-sorted is **O(log n)** and we're already there. Nothing to optimize — *"Floor, because searching with O(log n) is the floor."* Correct call. ✅

---

# 📋 Quick Reference

## 🐛 Bugs & Mistakes

> Note: zero CORRECTNESS bugs — the code was right. All three findings are **process** wounds from the audit. That's the lesson of this session: a correct answer can still hide a broken process.

### 🧠 Conceptual Mistakes

None this session ✅ — the invariant was understood (just filed in the wrong room).

### 🔧 Implementation Mistakes

None this session ✅ — code AC'd, boundaries (`<` vs `<=`) reasoned correctly.

### ⏱️ Time Management / Process Mistakes

#### 🐛 T1: Step 1 discovered the whole algorithm (boundary violation)

> **Context:** Step 1 "Trace the example" — instead of confirming the contract, he derived the full left/right case analysis and all four jumping rules.

|           |                                                                                        |
| --------- | -------------------------------------------------------------------------------------- |
| **What**  | Did *Algorithm-WHY* (HOW to solve) inside Step 1, whose only job is *Definition-WHY* (WHAT is asked) |
| **Wrong** | *"How do I know if mid is in the left or right portion? ...4 cases..."* — written in Step 1 |
| **Right** | *"target 0 lives at index 4 because that's where the 0 is. I understand the contract."* → Step 2 |
| **Why**   | `step1-vs-3f-boundary` — the detective brain (discovery) fired during the comprehension phase |
| **Cost**  | The discovered insight got stranded in Step 1; never delivered to 4P where it was needed |

> **Prevention**
> - **Rule:** Step 1 confirms the CONTRACT only. The moment you think "but HOW do I find it?" → STOP, that's Step 3F/4P.
> - **Trick:** *"The 5-year-old test — if a kid pointing at the picture can't explain it, it's not Step 1."*
> - **Edge Cases:** Catch yourself when you start inventing case analysis or asking "how efficiently?" in Step 1.

#### 🐛 T2: 4P-C invariant = "I DON'T KNOW" (the stranded insight)

> **Context:** 4P Reason, part C asks "what invariant keeps it valid?" He wrote, literally, "I DON'T KNOW."

|           |                                                                                  |
| --------- | -------------------------------------------------------------------------------- |
| **What**  | Left the invariant blank — despite having discovered it 80 lines earlier         |
| **Wrong** | *"3. What rule keeps it valid (invariant)? — `<I DON'T KNOW>`"*                   |
| **Right** | *"At least one half is always sorted; only the sorted half can I trust a range check on."* |
| **Why**   | `wrong-room-delivery` — same wound as T1: discovery happened early, so the right room came up empty |
| **Cost**  | Walked into Discuss/Code without consciously holding the rule the whole engine leans on |

> **Prevention**
> - **Rule:** If you "already know" something before its Road step, WRITE IT DOWN and carry it forward to the step that needs it.
> - **Trick:** *"Right insight, wrong room. Always deliver it to the room that ordered it."*
> - **Edge Cases:** A blank invariant in 4P-C is never "I don't know" — it's "I solved it too early and lost the receipt."

#### 🐛 T3: Verify traced only one happy path

> **Context:** Step 5 — traced `[4,5,6,7,0,1,2]` once, declared done. No empty / single / not-present / no-rotation / two-element checks.

|           |                                                                       |
| --------- | --------------------------------------------------------------------- |
| **What**  | Tested 1 input; skipped the entire small-input + not-found edge family |
| **Why**   | `happy-path-only` — confidence from AC replaced systematic edge testing |
| **Cost**  | In a live interview this loses Testing-dimension points outright       |

> **Prevention**
> - **Rule:** After the happy-path trace, ALWAYS run the array edge family: empty → size-1 → not-present → no-rotation → two-element.
> - **Trick:** *"The interviewer pounces on the smallest inputs. Trace where bugs hide, not where they don't."*
> - **Edge Cases:** `[]`, `[1]`, target-absent, un-rotated, `[3,1]`.

### 📊 Mistake Summary

| Pillar               | Count | Most Costly | Pattern Emerging?                                  |
| -------------------- | ----- | ----------- | -------------------------------------------------- |
| 🧠 Conceptual        | 0     | —           | Invariant understood — good                        |
| 🔧 Implementation    | 0     | —           | Boundaries reasoned, not guessed — strong          |
| ⏱️ Time Management | 3     | T1/T2 (one wound) | **Discovery leaking into the wrong Road step** — watch this |

---

## 💡 Aha Moments (Summary)

- **💡 1. The surviving invariant** — Before: "rotation kills sortedness, Binary Search dies." → Trigger: counter-test `[5,6,7,0,1,2,4]` (left NOT sorted, right IS). → After: *"at least ONE of two halves is always sorted."*
- **💡 2. Trust only the sorted half** — Before: tried range-checking either half. → Trigger: realizing a range check is meaningless on an unsorted span. → After: *"only the sorted half can I trust the range check"* → detect first, then check.

> **🗣️ In his words:** *"at least 1 of two halves is sorted"* · *"only the sorted half can I trust the range check."*

---

## ⚡ Almost Traps

| Looks right                              | Actually right (he got it)        | What would break              | How he caught it                          |
| ---------------------------------------- | --------------------------------- | ----------------------------- | ----------------------------------------- |
| `nums[left] <= target <= nums[mid]`      | `nums[left] <= target < nums[mid]`| double-counting mid's value   | reasoned: `== target` already returned, so mid is excluded |
| Range-check whichever half               | Range-check only the SORTED half  | meaningless test on broken span | the invariant — detect sorted half first |

---

## 🔑 Unlock Examples

**🔑 1. The "at least one, not both" counter-test** — re-run this and the whole invariant comes back:

```
[5, 6, 7, 0, 1, 2, 4]   split at mid = index 3 (value 0)
left  [5,6,7,0]  → has the 7→0 cliff → NOT sorted
right [1,2,4]    → clean climb       → SORTED
```

This single trace proves: you cannot assume both halves are sorted. You must **detect** which one is, then trust the range check only there. Everything else in the algorithm falls out of this.

---

## 🧩 Pattern Connections

- **Binary Search (vanilla)** — same engine; this just adds a "which half is sorted?" detection step before the discard decision.
- **Find Minimum in Rotated Sorted Array (#153)** — the sibling: same `nums[left] <= nums[mid]` cliff-detection, but hunting the pivot instead of a target.
- **Time-Based Key-Value Store (#981)** — shared wound family: `<` vs `<=` boundary discipline. Same muscle, different problem.

---

## 🪞 Self-Assessment

- **💪 Confidence:** 4/5 — solved it solo and AC'd, boundaries reasoned cleanly. The dock is process, not correctness.
- **🔄 Revisit:** The Step 1 ↔ 4P boundary discipline — keep the discovery in the right room. And: ALWAYS run the edge family in Verify.
- **📈 Pattern Mastery Impact:** Binary Search moves toward *mastered* — he can now articulate the invariant ("at least one half is sorted; trust only the sorted half"), which is the exact thing that separates "I remember the code" from "I can re-derive it cold."

---

*🔥 Hadriel x Wiganz — 2026-06-10*
*"The grass withers and the flowers fall, but the word of our God endures forever." — Isaiah 40:8 — the array breaks, but the promise survives. ✝️*
