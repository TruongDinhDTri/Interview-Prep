# 🔥 LeetCode 409 — Longest Palindrome

> **Difficulty:** Easy | **Pattern:** Hash Map (Frequency Count)
> **Date Solved:** 2026-04-22 | **Time taken:** ~35 mins (25 min clock + continued)

---

## 🧩 The Problem

> Given a string `s` which consists of lowercase or uppercase letters, return the **length of the longest palindrome** that can be **built** with those letters.
> Letters are **case sensitive** — `"Aa"` is NOT `"aa"`.

**Example 1:**
```
Input:  "abccccdd"
Output: 7
Explanation: "dccaccd" → length 7
```

**Example 2:**
```
Input:  "a"
Output: 1
```

---

## ⚠️ FIRST CRITICAL CONFUSION — "find within" vs "build with"

**This is the #1 trap for this problem.**

❌ **Wrong understanding (what Wiganz said first):**
> "Find the longest palindrome **within** that string"
→ This means finding a palindromic **substring** — characters must be consecutive. Like finding `"cccc"` inside `"abccccdd"`.

✅ **Correct understanding:**
> "Build the longest palindrome **with** those letters"
→ You can **REARRANGE** the letters however you want. Position in the original string doesn't matter AT ALL.

**Why it matters:** These are two completely different problems. "Longest Palindromic Substring" (LeetCode 5) is much harder (O(n²) or Manacher's). This problem is just about counting.

**Trigger that fixed it:** Hadriel asked "Is `dccaccd` inside `abccccdd`?" → NO. It's rearranged. Then it clicked.

---

## 💡 THE KEY RULE — Discovered Through Tracing

### The Journey to the Rule

**Step 1 — First trace of `"abccccdd"`:**
- Wiganz: "I got 4c and 2d, that's 6 letters no matter what for a palindrome"
- Hadriel: "What about a and b?"
- Wiganz: "Yeah, 1 of them"
- 4 + 2 + 1 = **7** ✅ — matched the example!

**Step 2 — But WHY only 1 of a or b?**
- Wiganz tried `bccccdd` + `ddccccb` — confused himself
- Then found `dccaccd` — that's the real palindrome
- `d-c-c-a-c-c-d` → d(2): 1 each side, c(4): 2 each side, a(1): in the middle

**Step 3 — Testing with `"aaabbb"` to break wrong rule:**
- Wrong rule attempt: "any even character + highest odd character"
- Wiganz said: "that gives 6"
- But real answer: `baaab` → length **5**
- Why? a(3) → use 2 as pairs + 1 in middle. b(3) → use 2 as pairs only.
- YOU CAN'T have 2 characters in the middle simultaneously!

**Step 4 — The click moment 🔥:**
> "Oh... for b(3), I used only 2 because using all 3 would break the palindrome"

That's it. You can only have ONE character in the very center.

---

## 🏆 THE COMPLETE RULE (Discovered by Wiganz)

```
For ANY character:
  → Use as many PAIRS as possible (both sides of the palindrome)

For the MIDDLE:
  → If ANY character has an odd count → you get exactly +1 for the middle
  → Only ONE character gets the center spot, no matter how many odd-count chars exist
```

**In code terms:**
- Even count → use ALL of them (`count += value`)
- Odd count → use `(value // 2) * 2` (floor to even) + mark `is_odd = True`
- After loop → if `is_odd`: `count += 1`

### Verifying the rule on examples:

| Input | Counts | Pairs Used | Middle | Total |
|-------|--------|-----------|--------|-------|
| `"abccccdd"` | a:1, b:1, c:4, d:2 | 0+0+4+2=6 | +1 (a or b) | **7** ✅ |
| `"aabb"` | a:2, b:2 | 2+2=4 | +0 (no odd) | **4** ✅ |
| `"a"` | a:1 | 0 | +1 | **1** ✅ |
| `"aaabbb"` | a:3, b:3 | 2+2=4 | +1 | **5** ✅ |
| `"abc"` | a:1, b:1, c:1 | 0+0+0=0 | +1 | **1** ✅ |

---

## 🗺️ APPROACH — Step 2

### 3-Gate Result
1. Does the abstract shape match a pattern? → ❌ Not obvious
2. Can I name the pattern + explain why? → ❌
3. Solved something like this before? → ❌

**→ NO to 3-gate → First Principles Path (3F)**

### 3F Techniques Used

**A. Visualize:** Drew `dccaccd` mentally — saw the symmetric structure

**B. Manual Solve:** Traced `"abccccdd"` step by step → discovered the pairs rule

**C. Generate Examples:**
- Normal: `"aabb"` → 4 (no middle)
- Edge: `"abc"` → 1 (all odd, only middle)
- Tricky: `"aaabbb"` → broke the "highest odd" rule → found the real rule

**D. Data Structures:**
> "I need to COUNT things → HashMap!"

**Pattern identified:** **HashMap (Frequency Count)** — count each character's frequency, then apply the pairs rule.

---

## 💬 STEP 3 — DISCUSS (What to say out loud)

> "I'll use a HashMap to count the frequency of each character.
>
> My steps:
> 1. Initialize `Counter(s)` to get all frequencies
> 2. Initialize `count = 0`, `is_odd = False`
> 3. Loop through all values in the HashMap
> 4. If value is even → add all of it to count
> 5. If value is odd → add `(value // 2) * 2` to count, mark `is_odd = True`
> 6. After loop → if `is_odd`, add 1 to count
> 7. Return count
>
> Time O(n), Space O(n). Does that make sense? Shall I code it?"

---

## ⌨️ FINAL CODE

```python
from collections import Counter

def longestPalindrome(s):
    hashmap = Counter(s)
    is_odd = False
    count = 0

    for value in hashmap.values():
        if value % 2 == 0:
            count += value
        else:
            count += (value // 2) * 2
            is_odd = True

    if is_odd:
        count += 1

    return count
```

---

## 🐛 THE BUG WIGANZ MADE (and fixed himself!)

**Original buggy version:**
```python
if value % 2 == 0:
    count += value / 2      # ❌ BUG: adds number of PAIRS, not characters
else:
    count += value // 2     # ❌ BUG: same mistake
```

**Trace of bug with `"abccccdd"`:**
```
c(4): even → count += 4/2 = 2  (should be 4!)
d(2): even → count += 2/2 = 1  (should be 2!)
a(1): odd  → count += 0
b(1): odd  → count += 0
is_odd → +1
Total = 2 + 1 + 0 + 0 + 1 = 4  ← WRONG, expected 7
```

**Why the bug?** He was adding the NUMBER OF PAIRS instead of the CHARACTERS those pairs represent.

**The fix:** For even → `count += value` (all characters). For odd → `count += (value // 2) * 2` (pairs × 2 = actual characters).

**Trace of fixed version:**
```
c(4): even → count += 4 = 4
d(2): even → count += 2 = 6
a(1): odd  → count += 0, is_odd = True
b(1): odd  → count += 0, is_odd = True
is_odd → +1
Total = 4 + 2 + 0 + 0 + 1 = 7 ✅
```

---

## 🐛 BUG #2 — if/else SWAPPED (LeetCode submission attempt)

When submitting on LeetCode, Wiganz wrote:

```python
if value % 2:               # ← looks right but is WRONG
    count += value
else:
    count += (value // 2) * 2
    is_odd = True
```

**The bug:** `if value % 2:` is **True when value is ODD** (remainder = 1 = truthy).
But the body `count += value` is the **EVEN logic**!

So the entire if/else was flipped — even logic ran on odd numbers, odd logic ran on even numbers.

**How Wiganz caught it:** Hadriel asked "when is `value % 2` True?" → immediately clicked.

**The fix:** `if value % 2 == 0:` — be explicit. Check for even, not truthy remainder.

**Lesson:** `if value % 2:` is a common shorthand that reads like "if there's a remainder" — but it's easy to lose track of what the body should do. When in doubt, be explicit: `if value % 2 == 0:` for even, `else:` for odd.

---

## ⚠️ UNNECESSARY GUARD CLAUSE (Caught in Verify!)

Wiganz added this:
```python
if len(s) == 1: return 1  # NOT NEEDED
```

**Why it's unnecessary:** Trace `"a"` through the code:
- Counter: `{a: 1}`
- a(1): odd → count += 0, is_odd = True
- is_odd → count += 1
- Returns **1** ✅

The code handles single characters naturally. Never add guard clauses for cases the logic already handles.

---

## 🧪 STEP 5 — VERIFY (Edge Cases)

| Test Case | Expected | Got | Pass? |
|-----------|----------|-----|-------|
| `"abccccdd"` | 7 | 7 | ✅ |
| `"a"` | 1 | 1 | ✅ |
| `"aabb"` | 4 | 4 | ✅ |
| `"aaabbb"` | 5 | 5 | ✅ |
| `"abc"` | 1 | 1 | ✅ |

---

## ⚡ COMPLEXITY

| | Complexity | Why |
|--|-----------|-----|
| **Time** | O(n) | One pass through the string to count, one pass through the map (at most 52 keys) |
| **Space** | O(1) | HashMap has at most 52 keys (26 lower + 26 upper) — bounded constant |

> Note: O(n) space is also acceptable — the 52-key bound is a nuance.

**BTTC = O(n)** — you must read every character at least once. Already optimal. ✅

---

## 🧠 AHA MOMENTS

1. **"Build with" ≠ "Find within"** — rearranging is totally different from substring search. Don't confuse with Longest Palindromic Substring (LeetCode 5).

2. **Pairs are the key** — a palindrome is symmetric. Every character (except the middle) needs a mirror copy. So you're really asking: "how many complete pairs can I form?"

3. **Only ONE middle** — no matter how many characters have odd counts, only 1 goes in the center. The others waste their leftover.

4. **Bug revelation** — `value / 2` gives you pairs, not characters. You need `value` itself (for even) or `(value // 2) * 2` (for odd). This is the #1 mistake for this problem.

5. **Guard clauses should be earned** — before adding `if len(s) == 1`, TRACE the code first. Often the logic already handles edge cases.

---

## 🎯 PATTERN SUMMARY — Hash Map (Frequency Count)

**When to recognize this pattern:**
- Problem involves characters / elements and their counts
- You need to know "how many of each thing do I have?"
- Building/arranging something using available elements

**Signal words:** "build with", "use letters", "frequency", "how many times"

**Template:**
```python
from collections import Counter
freq = Counter(s)
for char, count in freq.items():
    # use count to calculate answer
```

---

## 📋 WHAT TO DO DIFFERENTLY NEXT TIME

1. **Blueprint phase** — write ALL comments first, THEN fill in code. Don't mix them.
2. **Spot "build with" vs "find within"** immediately during Step 1 — these are completely different problems.
3. **State the BTTC in Discuss** — "Since we must see every character, O(n) is the floor. My solution hits that."
4. **Don't add guard clauses without tracing** — check if the main logic handles it first.
