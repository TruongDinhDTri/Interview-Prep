# Evaluate Reverse Polish Notation -- Complete Session Archive

> **Pattern:** Stack | **Difficulty:** Medium | **LeetCode:** #150 | **Date:** 2026-05-08
> **Path Taken:** Pattern Path | **Time Used:** 25 min (timed) + Teaching Mode debrief | **Target:** 25 min

---

## The Journey -- How Understanding Built

Wiganz entered this session without knowing what RPN even was. Through a single guiding question from Hadriel, he decoded the notation from scratch -- and then, without any hint, recognized the Stack pattern himself by connecting it to Valid Parentheses. The code came in within the target time, but Teaching Mode uncovered five real bugs: a wrong variable name, a negative-number trap with `isdigit()`, a wrong return target, a silent operand-order reversal, and a float-corruption bug that only surfaces with intermediate division. The hardest lesson of the session was that the most dangerous bugs are the ones that compile and run fine -- they just silently return the wrong answer.

---

## Step 1 -- Understand

### Problem Statement (Human Language)

Given an array of string tokens representing a math expression in Reverse Polish Notation (postfix), evaluate it and return the integer result.

RPN means operators come AFTER their two operands. So `["2","1","+"]` means `2 + 1 = 3`. When you see an operator, it fires on the two numbers that came just before it.

- Input: `tokens: List[str]` -- a mix of number strings and operator strings (`"+"`, `"-"`, `"*"`, `"/"`)
- Output: one integer -- the final evaluated result
- Division truncates toward zero (not floor): `int(-7/2) = -3`, not `-4`

### Abstract (Story Stripped)

> "Given an array of tokens -- numbers wait in place, operator fires on the two before it, result replaces them. Return the final value."

### Constraint Questions Asked

| Question | Answer |
|----------|--------|
| Is the input sorted? | No -- order matters, do not touch it |
| Can values be negative? | Yes -- e.g. `"-11"` is a valid token |
| Can values be zero? | Yes |
| Can there be duplicates? | Yes |
| Can the input be empty? | No -- guaranteed valid, never empty |
| How is the input stored? | Array of strings |
| What's the input size? | Up to 10^4 tokens |
| What to return? | One integer -- the final result |
| Division truncation direction? | Toward zero (not floor) -- `int()` in Python |

### Trace by Hand

Input: `["2","1","+","3","*"]`

- See `"2"` -- it's a number. Wait.
- See `"1"` -- it's a number. Wait.
- See `"+"` -- operator fires. 2 + 1 = 3. Replace both with 3.
- See `"3"` -- it's a number. Wait.
- See `"*"` -- operator fires. 3 * 3 = 9. Replace both with 9.
- Output: `9`. Because the problem says postfix operators consume the two values before them.

---

## Step 2 -- Approach (3-Gate Check)

### 3-Gate Results

| Gate | Question | Answer |
|------|----------|--------|
| Gate 1 | Does the abstract shape match a pattern signature? | YES -- "numbers wait, pending items retrieved later" = Stack signal |
| Gate 2 | Can I name it AND explain why it fits? | YES -- Stack because numbers must be held pending until an operator arrives |
| Gate 3 | Have I solved something like this before? | YES -- Valid Parentheses (#26) -- same "item waits, retrieved on trigger" mechanic |

Decision: PATTERN PATH

---

## 3P Match + 4P Reason

### 3P -- Signal to Pattern

Signal seen: **"numbers wait"** + **"pending items"** + **"retrieved later in order"**

> "I see 'numbers waiting to be consumed by operators' which tells me Stack because items that wait and are retrieved when a condition triggers is the classic Stack signature. Valid Parentheses had `(` waiting for `)` -- same mechanic here."

### 4P -- Reason

**A -- Brute Force + Why Bad:**

Scan the array, find the leftmost operator, pop the two numbers before it, compute, replace, repeat. This requires shifting the array on every operation -- O(n) per operation, O(n^2) total. Too slow for 10^4 tokens.

**B -- What Stack Does Instead:**

Push numbers onto a stack as we scan left to right. When we hit an operator, pop two numbers, compute, push the result back. Each token is visited exactly once -- O(n).

**C -- The Invariant:**

> "At any point while scanning tokens, the stack always holds the most recent values not yet consumed by an operator."

This is the rule that keeps the solution correct at every step. The stack IS the "waiting room" -- numbers sit there until an operator claims them.

---

## Step 3 -- Discuss

### Wiganz's Presentation

1. Use a Stack (Python list)
2. Scan tokens left to right
3. If the token is a number -- push it
4. If the token is an operator -- pop two numbers, apply the operator, push the result
5. At the end, the stack contains exactly one value -- return it

### Complexity Stated

- Time: O(n) -- one pass through all tokens
- Space: O(n) -- worst case all tokens are numbers with one operator at the end

### Green Light

This aspect was not fully explored during the session -- whether Wiganz explicitly asked "Shall I code it?" was not recorded.

### What Was Missed

- Wiganz did not mention the brute force approach before presenting the optimized solution
- The operand order issue (LEFT op RIGHT) was not flagged before coding -- it surfaced as a bug during testing

---

## Step 4 -- Code

### Blueprint (Comments First)

```python
def evalRPN(self, tokens: List[str]) -> int:
    # 1. Build operator map: token -> lambda(a, b)
    # 2. Initialize empty stack
    # 3. For each token:
    #    - If NOT an operator -> push int(token)
    #    - If operator -> pop two, apply op (LEFT op RIGHT), push result
    # 4. Return stack.pop()
```

### Final Clean Solution

```python
class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        ops = {
            "+": lambda a, b: a + b,
            "-": lambda a, b: a - b,
            "*": lambda a, b: a * b,
            "/": lambda a, b: int(a / b),  # truncate toward zero, not floor
        }
        stack = []
        for token in tokens:
            if token not in ops:
                stack.append(int(token))
            else:
                first_num = stack.pop()   # RIGHT operand (pushed last)
                second_num = stack.pop()  # LEFT operand (pushed first)
                stack.append(ops[token](second_num, first_num))  # LEFT op RIGHT
        return stack.pop()
```

**Time:** O(n) -- one pass through all tokens
**Space:** O(n) -- stack holds at most all operands

**Why no `deque`?** Python `list` with `.append()` and `.pop()` is already a stack -- both O(1). `deque` is for queues (popleft). Do not over-import.

**Why no `int()` on the return?** Numbers are converted with `int(token)` on push, and division uses `int(a/b)` immediately at the step. The stack only ever holds integers -- the final `.pop()` is already an int.

---

## Step 5 -- Verify

### Trace Through Example

Input: `["2","1","+","3","*"]`

| Token | Action | Stack After |
|-------|--------|-------------|
| `"2"` | push int("2") | [2] |
| `"1"` | push int("1") | [2, 1] |
| `"+"` | first=1 (RIGHT), second=2 (LEFT), 2+1=3, push 3 | [3] |
| `"3"` | push int("3") | [3, 3] |
| `"*"` | first=3 (RIGHT), second=3 (LEFT), 3*3=9, push 9 | [9] |

Return `stack.pop()` = 9. Correct.

### Edge Cases

| Case | Input | Expected | Handled? |
|------|-------|----------|----------|
| Single number | `["5"]` | 5 | Yes -- push, return pop |
| Negative number token | `["-11","2","+"]` | -9 | Yes -- `token not in ops` catches `-11` |
| Division truncating positive | `["7","2","/"]` | 3 | Yes -- `int(7/2) = 3` |
| Division truncating negative | `["-7","2","/"]` | -3 | Yes -- `int(-7/2) = -3`, not `-4` |
| Intermediate float corruption | `["7","2","/","3","*"]` | 9 | Yes -- truncate at division step, not end |

### Complexity Confirmed

- Time O(n): one pass, each token processed once
- Space O(n): stack worst case holds all n/2 operands before the single operator fires

---

## Step 6 -- Optimize

BTTC for this problem is O(n) -- every token must be visited at least once to evaluate the expression. The solution is already at the floor. No optimization path exists.

The lambda dict approach is cleaner than `if/elif` chains and avoids the float-return trap of `operator.truediv`. No further optimization needed.

---

## 🐛 Bugs & Mistakes

### 🧠 Conceptual Mistakes

#### 🐛 C1: Operand Order Reversed (CRITICAL — silent wrong answer)

```python
# WRONG — first popped used as LEFT operand
first_num = stack.pop()
second_num = stack.pop()
stack.append(ops[token](first_num, second_num))   # LEFT=first_pop ❌

# CORRECT — second popped is LEFT
first_num = stack.pop()        # RIGHT operand (LIFO: last pushed = first popped)
second_num = stack.pop()       # LEFT operand
stack.append(ops[token](second_num, first_num))   # LEFT=second_pop ✅
```

- **Why:** `concept gap` — forgot that stack LIFO means LAST pushed = FIRST popped. Left operand was pushed before right, so it sits deeper
- **How it was caught:** Commutative ops (`+`, `*`) silently pass. Only `-` and `/` reveal the bug — test `["13","5","/"]` returning 0 instead of 2
- **Rule to prevent:** *first_pop = RIGHT, second_pop = LEFT*. Always write `ops[token](second_num, first_num)`
- **Trick:** *"Second is left"* — the second thing you pop is the left side of the expression

#### 🐛 C2: `isdigit()` Fails on Negative Number Tokens

```python
# WRONG — isdigit() returns False for "-11"
if token.isdigit():
    stack.append(int(token))
else:
    # ... negative numbers wrongly fall here, KeyError on ops[token]

# CORRECT — operators are the only non-numbers
if token not in ops:
    stack.append(int(token))
else:
    # ... only real operators here
```

- **Why:** `concept gap` — `isdigit()` requires ALL chars be digits. `-` is not a digit char → `"-11".isdigit()` is False
- **How it was caught:** Any expression with negative tokens produces KeyError crash
- **Rule to prevent:** NEVER use `isdigit()` / `isnumeric()` to identify number tokens when input can include negatives. Use `token not in ops` — O(1) dict lookup, handles all cases
- **Trick:** *"Not in ops = is a number"* — the four operators are the only non-numbers. Everything else is pushable

#### 🐛 C3: Division Float Corrupts Intermediate Results

```python
# WRONG — operator.truediv returns float, corrupts stack
ops = { '/': operator.truediv, ... }
# ["7","2","/","3","*"]: 7/2=3.5 → 3.5*3=10.5 → int(10.5)=10 ❌

# CORRECT — truncate AT the division step
ops = { '/': lambda a, b: int(a / b), ... }
# ["7","2","/","3","*"]: 7/2→3 → 3*3=9 ✅
```

- **Why:** `concept gap` — assumed `int(stack.pop())` at the end was enough. Not — intermediate floats poison every later operation
- **How it was caught:** Traced `["7","2","/","3","*"]` both ways and saw the divergence
- **Rule to prevent:** Truncate AT the division step, not at the end. Stack must ALWAYS hold integers — one float in stack poisons everything downstream
- **Trick:** *"`int()` at the slash, not at the end."*

### 🔧 Implementation Mistakes

**1. Wrong Variable Name (`tokens` vs `nums`)**

```python
# WRONG — used non-existent `nums`
for i in range(len(tokens)):
    if nums[i].isdigit():   # NameError: nums is not defined

# CORRECT — iterate directly, match variable to array
for token in tokens:
    if token not in ops:
```

- **Why:** `typo` — mental model had array as `nums`, parameter was `tokens`
- **How it was caught:** NameError on first run
- **Rule to prevent:** Iterate directly — `for token in tokens`. Eliminates wrong-variable risk AND off-by-one risk from `range(len(...))`

**2. Wrong Return Target (`result` vs `stack`)**

```python
# WRONG — result is an int (the computed value), not the stack list
return int(result.pop())    # AttributeError: 'int' has no .pop()

# CORRECT — return from the stack itself
return stack.pop()
```

- **Why:** `typo` — variable name mismatch between stack and a temp result variable
- **How it was caught:** AttributeError
- **Rule to prevent:** Name the stack `stack`. Never call the stack `result`

### ⏱️ Time Management Mistakes

None this session ✅ — solved within the 25-minute target.

### 📊 Mistake Summary

| Pillar | Count | Most Costly | Pattern Emerging? |
|--------|-------|-------------|-------------------|
| 🧠 Conceptual | 3 | C1 — silent wrong answer (commutative ops mask it) | Stack mechanics + Python type pitfalls (`isdigit`, `truediv` returning float). Drill *"second_pop is LEFT"* + *"`int()` at slash"* as atomic facts |
| 🔧 Implementation | 2 | Both immediate crashes | Variable naming discipline — match loop var to array, name stack `stack` |
| ⏱️ Time Management | 0 | — | Hit target |

---

## Discoveries

### Core Invariant / Rule

> "At any point while scanning tokens, the stack always holds the most recent values not yet consumed by an operator."

The stack is a waiting room. Numbers wait in it silently. The moment an operator arrives, it claims the two most recent waiters, computes, and sends the result back into the waiting room. This continues until one value remains.

### Aha Moments

**1. RPN Decoded**

- Before: Wiganz did not understand what RPN meant.
- Trigger: Hadriel asked -- "Nhin `["2","1","+"]` -- `+` dung sau `2` va `1`. Khi gap `+` thi bro lam gi?"
- After: "Do operation on 2 previous." RPN = operator always fires on the two numbers directly before it. The format exists because machines love it -- no parentheses, no precedence rules needed.

**2. Stack Pattern Self-Recognition**

- Before: Had not yet named a pattern.
- Trigger: Wiganz saw "numbers wait, pending items" in the abstract description.
- After: Without any hint -- "kinda looks like Valid Parentheses... a Stack I believe." Connected a new problem to a solved one through the abstract shape alone.
- In his words: "kinda looks like Valid Parentheses... a Stack I believe."

**3. isdigit() vs token not in ops**

- Before: Used `isdigit()` to identify number tokens.
- Trigger: Wiganz himself asked -- "wait, neu token not in ops thi no la so." Traced the logic himself.
- After: `token not in ops` is the cleanest check. O(1) dict lookup, handles negatives, handles any future edge case.

**4. int() = truncate toward zero**

- Before: Vague understanding of division truncation.
- Trigger: Hadriel explained and Wiganz confirmed -- "So `int()` la truncate toward zero ha?"
- After: `int()` cuts the decimal and pulls toward 0. For positive numbers, same as floor. For negative numbers, different -- `int(-3.5) = -3`, not `-4`. This is what the problem requires.

**5. Division Bug Proved by Example**

- Before: Suspected intermediate truncation mattered but unsure.
- Trigger: Traced `["7","2","/","3","*"]` both ways:
  - `operator.truediv`: 7/2=3.5 -> 3.5*3=10.5 -> int=10 (wrong)
  - `int(a/b)`: 7/2->3 -> 3*3=9 (correct)
- After: Never assume you can truncate at the end. Truncation must happen at the exact division step. Seeing it proved by code made it stick.

### Key Metaphors and Examples

- **The Waiting Room:** The stack is a waiting room for numbers. They sit until an operator calls their number. This metaphor makes the invariant intuitive rather than technical.
- **"Chop" operator for division:** `int()` is described as scissors that cut the decimal off and drag the result toward zero. Always cut at the moment of division, not at the door on the way out.
- **Token-detection comparison table:** Five different ways to check if a token is a number, side by side with `"-11"` as the test case. The table made the `isdigit()` failure visually undeniable.

---

## Final Complexity

| | Complexity | Reason |
|--|-----------|--------|
| Time | O(n) | One pass. Each token processed exactly once -- pushed or popped, never revisited. |
| Space | O(n) | Stack holds at most all operands. Worst case: n-1 numbers followed by one operator that consumes them all. |
| BTTC | O(n) | Every token must be read at least once to evaluate the expression. Cannot do better than O(n). Already optimal. |

---

## Self-Assessment

- **Confidence:** 4/5 -- Pattern recognition was immediate, solution was clean. The bugs caught in Teaching Mode are all rule-based and preventable. The operand order rule needs one more session to become reflexive.
- **Revisit:** Operand order (LEFT op RIGHT) -- needs drilling with non-commutative expressions. Division float trap -- solid after the proof-by-example.
- **Pattern Mastery Impact:** Stacks pattern moved to `competent`. Core mechanic (push/pop, LIFO retrieval order) is solid. Next step: problems where the stack holds structured data (pairs, indices) rather than raw numbers.

---

## Similar Problems

- **Valid Parentheses (#26)** -- Same "item waits in stack, trigger releases it" mechanic. The foundational Stack problem that Wiganz used to recognize this pattern.
- **Min Stack (#155)** -- Stack problem requiring auxiliary tracking alongside the main stack. Extends the data stored per stack frame.
- **Daily Temperatures (#739)** -- Monotonic Stack variant. Numbers wait in the stack, popped when a "better" (warmer) element arrives. Extends the waiting-room mechanic to relative comparisons.

---

*Hadriel x Wiganz -- 2026-05-08*
*"Whatever you do, work at it with all your heart, as working for the Lord." -- Colossians 3:23*
