# Add Binary — Complete Session Archive

**Pattern:** String Simulation (First Principles) | **Difficulty:** Easy | **LeetCode:** #67 | **Date:** 2026-04-25

---

## 🗺️ The Journey — How Understanding Built

No pattern was recognized at Step 2. Went full First Principles path (3F). Through manual tracing, the key rules were discovered organically — leading to a clean O(n) / O(1) solution. The most important aha moment: **auxiliary space vs output space**, and why the result array doesn't count as extra memory.

---

## 🎯 Step 1 — Understand

### Paraphrase
*"Given two binary strings `a` and `b`, add them together and return the result as a binary string."*

### Abstract (Story Stripped)
> **"Simulate binary addition with carry — return result as a string."**

The key abstraction: this is **not** about binary strings as a concept. It's about adding two numbers digit-by-digit from the right, propagating a carry, and collecting the result.

### Constraint Questions Asked

| Question | Answer |
|---|---|
| Only one valid answer? | Yes |
| What to return? | Binary sum as a **string** |
| Input ever empty? | No — length 1 to 10,000 |
| Leading zeros in input? | No (except `"0"` itself) |
| Leading zeros in output? | No (except `"0"`) |
| Input size? | Up to 10^4 characters |

### Trace — Example 1: `a = "11"`, `b = "1"`

```
Position (right to left):
  Step 1: a[1]=1, b[0]=1 → 1+1=2 → write 2%2=0, carry 2//2=1
  Step 2: a[0]=1, b exhausted → 1+0+carry(1)=2 → write 2%2=0, carry 2//2=1
  Step 3: both exhausted, carry=1 → 0+0+1=1 → write 1%2=1, carry 1//2=0
  result collected (right→left): ['0','0','1']
  reversed: ['1','0','0'] → "100" ✓
```

---

## 🔵 Step 2 — Approach: First Principles Path

**3-Gate result:** NO to all three → First Principles (3F)

- No known pattern signature recognized
- Could not name a pattern + explain why
- Never solved something like this before

### Technique B — Manual Solve (Key aha moment)

Tracing the example by hand revealed 5 concrete rules:

---

## 🔥 The 5 Rules (Discovered From First Principles)

```
Rule 1: temp_sum = digit_a + digit_b + carry
Rule 2: current_digit = temp_sum % 2     → what we WRITE to result
Rule 3: carry        = temp_sum // 2     → what we BRING OVER to next step
Rule 4: loop while (i >= 0 OR j >= 0 OR carry > 0)
Rule 5: two pointers starting from the BACK of both strings
```

**Why from the back?** Binary addition works right-to-left (just like decimal addition on paper). Carry propagates leftward.

**Why `% 2` and `// 2`?** In binary, any position holds 0 or 1. If the sum is 2, we write 0 and carry 1. If 3, we write 1 and carry 1. `% 2` extracts the bit, `// 2` extracts the carry.

---

## 🗣️ Step 3 — Discuss

**Approach name:** Two-pointer simulation from the back with carry

**Numbered steps presented:**
1. Initialize `i = len(a)-1`, `j = len(b)-1`, `result = []`, `remain = 0`
2. While loop: `while i >= 0 or j >= 0 or remain`
3. `total = remain` (bring carry into this round)
4. If `i >= 0`: add `int(a[i])` to total, decrement i
5. If `j >= 0`: add `int(b[j])` to total, decrement j
6. Append `str(total % 2)` to result, set `remain = total // 2`
7. Return `''.join(result[::-1])`

**Complexity stated:**
- Time: O(max(n, m)) — where n, m are lengths of a and b
- Space: O(1) auxiliary ← **see aha moment below**

---

## 💡 Aha Moment — Output Space vs Auxiliary Space

**The question:** Does the `result` array count as O(n) space?

**The Socratic question that unlocked it:**
> *"If someone asked you to solve this and return nothing — would you still need the result array?"*

**The answer:** No. The result array only exists because the problem **forces** us to return it. It is **output space**, not auxiliary space. The algorithm itself only needs `i`, `j`, `total`, `remain` — which are all O(1).

**Defensible statement for the interview:**
> *"Space is O(1) auxiliary. The result array is output space — it only exists because the problem requires a return value, not because the algorithm needs extra memory to think."*

**When interviewers may disagree:** Some count output space and say O(max(n,m)). Both answers are defensible — just state your reasoning clearly.

---

## ⌨️ Step 4 — Code (Blueprint → Implementation)

```python
def addBinary(self, a: str, b: str) -> str:
    # 1. Initialize i, j, result, remain
    i = len(a) - 1
    j = len(b) - 1
    result = []
    remain = 0

    # 2. While loop: either string has digits OR carry exists
    while i >= 0 or j >= 0 or remain:
        # 3. Start total with the carry from previous round
        total = remain

        # 4. Add a's digit if a still has characters
        if i >= 0:
            total += int(a[i])
            i -= 1

        # 5. Add b's digit if b still has characters
        if j >= 0:
            total += int(b[j])
            j -= 1

        # 6. Write current bit, update carry
        result.append(str(total % 2))
        remain = total // 2

    # 7. Reverse collected digits and return
    return ''.join(result[::-1])
```

---

## 🧪 Step 5 — Verify

### Trace: `a = "11"`, `b = "1"`

| Loop | i | j | total | result | remain |
|------|---|---|-------|--------|--------|
| 1 | 1→0 | 0→-1 | 0+1+1=2 | ['0'] | 1 |
| 2 | 0→-1 | -1 | 1+1=2 | ['0','0'] | 1 |
| 3 | -1 | -1 | 1+0=1 | ['0','0','1'] | 0 |

`result[::-1]` = `['1','0','0']` → `"100"` ✓

### Edge Cases

| Case | Input | Expected | Verified |
|---|---|---|---|
| Both zero | `a="0"`, `b="0"` | `"0"` | total=0, result=['0'], remain=0 → "0" ✓ |
| Very different lengths | `a="1"`, `b="1111111111"` | handles correctly | while condition keeps loop alive; `if i>=0` guard prevents crash when a exhausted ✓ |

### Two Lines That Protect Unequal Lengths

```python
while i >= 0 or j >= 0 or remain:   # LINE 1: keeps loop alive even after one string exhausted
    if i >= 0: ...                   # LINE 2: guards a — prevents index-out-of-bounds crash
    if j >= 0: ...                   # LINE 3: guards b — same protection
```

---

## 📊 Final Complexity

| | Complexity | Reason |
|---|---|---|
| Time | O(max(n, m)) | Loop runs as long as the longer string (or carry) |
| Space | O(1) auxiliary | Only i, j, total, remain — all constant extra variables |

---

## 🔄 Decision Points to Remember

1. **Go from the back** — binary addition is right-to-left, same as decimal
2. **Separate the two `if` guards** — don't use `elif`, both strings can have digits in the same loop
3. **`total = remain` at loop start** — this is how carry propagates cleanly into each round
4. **Collect into list, reverse at end** — cleaner than prepending strings (prepending is O(n²))
5. **While condition includes `remain`** — handles the final carry even after both strings are exhausted

---

## ⚠️ Common Mistakes to Avoid

- Using `elif` instead of two separate `if` statements for a and b
- Forgetting `or remain` in the while condition → drops the final carry
- Trying to add characters directly without `int()` conversion
- Prepending to string in loop → O(n²) time instead of O(n)
- Saying "space is O(n)" without distinguishing auxiliary vs output space

---

## 📖 Pattern Classification

This is a **String Simulation** problem — not a classic LeetCode pattern like Sliding Window or BFS. It requires:
- Simulating a real-world process (binary addition) step by step
- Managing state across iterations (the carry)
- Handling asymmetric inputs (different string lengths)

Similar problems: Add Strings (#415), Multiply Strings (#43), Plus One (#66)
