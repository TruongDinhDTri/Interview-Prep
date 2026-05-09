# Longest Substring Without Repeating Characters — Complete Session Archive

**Pattern:** Sliding Window + HashSet | **Difficulty:** Medium | **LeetCode:** #3 | **Date:** 2026-05-04
**Path Taken:** Pattern Path (all 3 Gates passed) + Code Investigation (bugs found + fixed) | **Time Used:** Review session — code brought to Hadriel for investigation

---

## 🗺️ The Journey — How Understanding Built

This was NOT a first solve — problem was previously completed September 1, 2025 (Notion row #7). This was a review session: Wiganz wrote the solution from memory, then brought it to Hadriel with the question *"Is it correct?"*

The code had 2 bugs — both subtle, both caused by the same root misunderstanding about window state. Through Socratic questioning (one trace question per bug), Wiganz discovered both bugs independently and fixed them. No answer was given directly.

**Root cause of both bugs:** confusing when to READ the window state vs when to WRITE to it.

---

## 🎯 Step 1 — Understand

### Problem Statement
```
Given a string s, find the length of the longest substring without repeating characters.
```

### Abstract (Story Stripped)
> **"Find the longest contiguous slice of a sequence where all elements are unique."**

### Constraint Questions

| Question | Answer |
|---|---|
| Sorted? | No |
| Empty input? | Yes — return 0 |
| Character set? | ASCII (or Unicode — handle both) |
| Return what? | Length (integer) — not the substring itself |
| Duplicates possible? | Yes — that's the whole constraint |
| One valid answer? | Yes |

### Trace — Example

```
s = "abcabcbb"
```

| Substring | Unique? | Length |
|---|---|---|
| "a" | ✓ | 1 |
| "ab" | ✓ | 2 |
| "abc" | ✓ | 3 |
| "abca" | ✗ duplicate 'a' | — |
| "bca" | ✓ | 3 |
| "bcab" | ✗ duplicate 'b' | — |
| ... | ... | ... |

**Answer: 3** ("abc" or "bca")

---

## 🔵 Step 2 — Approach

### 3-Gate Check

```
3-Gate Check:
☑ Gate 1: Abstract shape matches? → YES — "longest contiguous slice with uniqueness constraint" = Sliding Window
☑ Gate 2: Name it AND explain WHY? → YES — SW avoids checking all O(n²) substrings by maintaining a live window
☑ Gate 3: Solved something like this before? → YES — previously solved Sep 2025

→ Decision: PATTERN PATH (3P + 4P)
```

### Gate 2 Full Sentence

> "I see 'substring' + 'contiguous' + 'constraint on uniqueness' — that's a Sliding Window signature because the pattern lets me maintain one active window and adjust it instead of checking every possible substring from scratch. O(n) instead of O(n²)."

---

## 🗣️ Step 3 — Discuss

**Named approach:** Sliding Window with HashSet

**4P Reasoning:**

**A — Brute Force:**
> Check every possible substring (O(n²) of them), verify each for uniqueness (O(n) each) → O(n³). Too slow.

**B — What Sliding Window Does Instead:**
> Maintain a window `[left, right]`. Expand right one step at a time. If `s[right]` is already in the window → shrink from the left until it's not. Each character is touched at most twice → O(n).

**C — The Invariant:**
> The window must contain only unique characters at ALL times. The moment a character repeats, shrink from the left. This ensures we check every valid window without revisiting old substrings.

**Numbered Steps:**
1. Initialize `left = 0`, `seen = set()`, `max_length = 0`
2. Expand `right` through the string
3. If `s[right]` already in `seen` → shrink: remove `s[left]` and move `left` forward until clear
4. Add `s[right]` to `seen`
5. Update `max_length = max(max_length, right - left + 1)`
6. Return `max_length`

**Complexity:**
- Time: `O(n)` — each character enters and leaves `seen` at most once
- Space: `O(k)` — where k = character set size (at most 26 for lowercase, 128 for ASCII)

---

## ⌨️ Step 4 — Code Investigation

### The Code Brought to Hadriel

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        max_length = 0 
        seen = set()
        left, right = 0, 0 

        for right in range(len(s)):
            seen.add(s[right])          # ← Bug 1 lives here
            while s[right] in seen:
                seen.remove(s[right])   # ← Bug 2 lives here
                left += 1
            max_length = max(max_length, right - left + 1)
        return max_length
```

The code is syntactically valid. It runs without errors. But the output is always wrong — `max_length` never exceeds 0 for most inputs.

---

## 🐛 The Two Bugs — Root Cause Analysis

### Bug 1 — State Contamination: Adding BEFORE Checking

**The wrong code:**
```python
seen.add(s[right])          # Step 1: drop s[right] into the box
while s[right] in seen:     # Step 2: ask "is s[right] in the box?"
```

**The question the while loop needs to answer:**

> *"Was `s[right]` ALREADY in the window before I arrived?"*

That's the only question that matters. A real duplicate = it was there from a previous step.

**What your code actually does:**

You drop `s[right]` into the box. Then you look inside and ask "is it in there?"

**Of course it is. You just dropped it in.**

The while loop cannot tell if `s[right]` was there from before — or if YOU just put it there one line ago. That information is gone. You destroyed the "before" state by writing first.

**One line proof:**
```python
seen = set()
seen.add('a')
print('a' in seen)   # True → ALWAYS. Forever. No matter what.
```

The while check has the exact same problem. It reads something you just wrote. It will always be True — not because there's a real duplicate, but because you put it there yourself.

**What this does to a string with ZERO duplicates:**

```python
# "abc" → expected: 3, actual: 0
right=0: seen.add('a') → seen={'a'}
         while 'a' in seen: → FIRES (you just added it!)
         seen.remove... left=1
         max_length = max(0, 0-1+1) = 0  ← window is nonsense

right=1: seen.add('b') → seen={'b'}
         while 'b' in seen: → FIRES again
         max_length = 0

# Returns 0. A string with no duplicates at all.
```

A string with no duplicates returns 0. That's how completely broken this ordering is.

**The correct order restores the question:**
```python
while s[right] in seen:   # ask BEFORE the box is touched
    seen.remove(s[left])
    left += 1
seen.add(s[right])        # NOW drop it in
```

Now when the while fires, you know for certain `s[right]` was in there from a **previous step** — not from you. That's a real duplicate. That's when you shrink.

---

### Bug 2 — Wrong Eviction Target: Removing RIGHT Instead of LEFT

**The wrong code:**
```python
while s[right] in seen:
    seen.remove(s[right])   # removing the NEW character, not the OLD one
    left += 1
```

**Why this is wrong:**

The duplicate character is `s[right]` — the new arrival. The character that should be EVICTED is `s[left]` — the oldest character in the window.

When you shrink a sliding window, you kick out the left boundary, not the right boundary. The right pointer is expanding (adding). The left pointer is the eviction door.

**The mental error that causes this:**

`s[right]` is the one causing the violation — it's the duplicate. It feels intuitive to remove the "problem element." But you don't remove the new arrival. You remove the oldest element on the left and move the window forward until the new arrival is no longer a duplicate.

**Analogy:**

Imagine a corridor where no two people can have the same name. A new person named "Alice" tries to enter. There's already an "Alice" inside.

Do you send the new Alice away? **No.** She's the right pointer — she WILL enter. You push out the person at the left end of the corridor, one by one, until the old Alice exits. THEN the new Alice walks in.

```
Corridor: [Alice, Bob, Charlie]
New arrival: Alice (duplicate!)

Wrong: Remove the new Alice, advance left. 
       → "Alice" is gone from seen but left moved wrongly.

Right: Remove s[left] = old Alice, left++.
       → [Bob, Charlie], left moves forward.
       → Still duplicate? No → add new Alice.
       → [Bob, Charlie, Alice] ✓
```

**The correct code:**
```python
while s[right] in seen:
    seen.remove(s[left])    # evict the LEFT boundary
    left += 1
```

---

## ✅ Final Correct Code

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        max_length = 0
        seen = set()
        left = 0

        for right in range(len(s)):
            # Shrink window if s[right] already in window (check BEFORE adding)
            while s[right] in seen:
                seen.remove(s[left])    # evict left boundary
                left += 1
            # Safe to add — window is clean
            seen.add(s[right])
            max_length = max(max_length, right - left + 1)
        return max_length
```

**Two fixes:**
1. `seen.add(s[right])` moved to AFTER the while loop
2. `seen.remove(s[right])` → `seen.remove(s[left])`

---

## 🧪 Step 5 — Verify

### Trace

```
s = "abcabcbb", k = 1
```

| right | s[right] | seen before add | while fires? | action | seen after | left | window | max_len |
|---|---|---|---|---|---|---|---|---|
| 0 | 'a' | {} | No | add 'a' | {'a'} | 0 | [0,0]="a" | 1 |
| 1 | 'b' | {'a'} | No | add 'b' | {'a','b'} | 0 | [0,1]="ab" | 2 |
| 2 | 'c' | {'a','b'} | No | add 'c' | {'a','b','c'} | 0 | [0,2]="abc" | 3 |
| 3 | 'a' | {'a','b','c'} | Yes → remove s[0]='a', left=1 | add 'a' | {'b','c','a'} | 1 | [1,3]="bca" | 3 |
| 4 | 'b' | {'b','c','a'} | Yes → remove s[1]='b', left=2 | add 'b' | {'c','a','b'} | 2 | [2,4]="cab" | 3 |
| 5 | 'c' | {'c','a','b'} | Yes → remove s[2]='c', left=3 | add 'c' | {'a','b','c'} | 3 | [3,5]="abc" | 3 |
| 6 | 'b' | {'a','b','c'} | Yes → remove s[3]='a', left=4 → remove s[4]='b', left=5 | add 'b' | {'c','b'} | 5 | [5,6]="cb" | 3 |
| 7 | 'b' | {'c','b'} | Yes → remove s[5]='c', left=6 → remove s[6]='b', left=7 | add 'b' | {'b'} | 7 | [7,7]="b" | 3 |

**Final `max_length = 3`** ✓

### Edge Cases

| Edge Case | Input | Expected | What Happens |
|---|---|---|---|
| Empty string | "" | 0 | Loop never runs → return 0 ✅ |
| All unique | "abcd" | 4 | while never fires → window grows full length ✅ |
| All same | "aaaa" | 1 | while fires every step → window stays size 1 ✅ |
| Single char | "z" | 1 | One iteration, no while → return 1 ✅ |
| Two char window | "au" | 2 | No duplicate → max stays 2 ✅ |

### Complexity

| | Complexity | Reason |
|---|---|---|
| Time | O(n) | Each character enters `seen` once (right++) and leaves once (left++) — total 2n operations |
| Space | O(k) | `seen` holds at most k distinct characters. k = 26 (lowercase) or 128 (ASCII) or 256 (extended) |
| BTTC | O(n) | Must examine every character at least once — already at the floor |

---

## 💡 Key Insights & Aha Moments

### 1. The "Add Before Check" Bug — State Contamination

```python
seen.add(s[right])      # ← sets the state
while s[right] in seen: # ← reads the state you just set → ALWAYS true
```

The question "is it already in the window?" can only be answered BEFORE you add it. Once you add it, "yes it's in the window" is trivially true — you put it there. This is the most common Sliding Window bug.

**The rule:**
> Check → Shrink until clean → Add

### 2. Eviction Direction — Always Remove LEFT

When shrinking a sliding window, the eviction target is ALWAYS `s[left]`. The right pointer is expanding — it's trying to enter, not leave. When a duplicate appears at `right`, you push the left boundary forward, one character at a time, until the duplicate is gone from the window. Then the right character safely enters.

### 3. Set vs HashMap — Two Valid Approaches

**Set (this solution):** O(1) membership check, O(k) space, while loop shrinks one step at a time.
```python
while s[right] in seen:
    seen.remove(s[left])
    left += 1
seen.add(s[right])
```

**HashMap (optimized):** Store char → last index. Jump `left` directly to the offending position instead of stepping one-by-one. Avoids the while loop entirely.
```python
if s[right] in seen and seen[s[right]] >= left:
    left = seen[s[right]] + 1
seen[s[right]] = right
```

HashMap version is O(n) guaranteed with no while loop. Set version is O(n) amortized (while loop fires, but total removals ≤ n). Both are valid. HashMap is slightly cleaner for interview.

### 4. The Invariant — One Sentence

> "At every point in the loop, `seen` contains exactly the characters in `s[left..right-1]` — no more, no less."

This invariant only holds if you shrink BEFORE adding. If you add before shrinking (Bug 1), `seen` contains characters from outside the current window. The invariant breaks → the solution is wrong.

---

## ⚠️ Common Mistakes to Avoid

1. **`seen.add()` before the while check** — the most natural-feeling order, always wrong. Check → Shrink → Add.
2. **`seen.remove(s[right])` in the while loop** — removing the newcomer instead of the leftmost. Always remove `s[left]`.
3. **Not advancing `left`** — removing from seen but forgetting `left += 1` → the window size never shrinks correctly.
4. **Using index instead of character** — `seen` stores characters (`s[left]`), not indices. Don't put `left` in the set.
5. **Updating `max_length` inside the while loop** — update AFTER the while exits, when the window is valid.

---

## 🔄 Decision Points to Remember

1. **Set chosen over HashMap** — simpler, but requires while loop. HashMap version jumps `left` in O(1) without looping.
2. **Order: Check → Shrink → Add** — this is the universal Sliding Window pattern for "constraint on window content."
3. **Eviction target: s[left]** — when the window must shrink, always remove the left boundary character.
4. **`max_length` after while** — only update when the window is clean (invariant holds).

---

## 📊 Final Complexity

| | Complexity | Reason |
|---|---|---|
| Time | O(n) | Each char enters seen once (right advances) and leaves once (left advances) — 2n total |
| Space | O(k) | k = size of character set. k ≤ n always |
| BTTC | O(n) | Must read every character — already optimal |

---

## 🔗 Similar Problems

- **Longest Substring with K Distinct Characters (#340)** — same pattern, shrink when distinct count > K
- **Fruits Into Baskets (#904)** — same as above with K=2 (2 baskets = 2 distinct types)
- **Minimum Window Substring (#76)** — harder variant, shrink to find minimum valid window
- **Permutation in String (#567)** — fixed-size window, check anagram condition
