# 🎯 LeetCode 20: Valid Parentheses — Learning Archive

# 1. Problem Explanation

Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

An input string is valid if:

1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

**Inputs:** A string `s`.
**Outputs:** A boolean (`True` or `False`).
**Constraints:**

- String length up to $10^4$.
- Only consists of parentheses.

**What the problem is REALLY asking:**
It's checking for **perfect balance** and **nested order**. You can't close a bracket that wasn't the last one opened (LIFO).

---

# 2. Phase Analysis (FULL THINKING LOG)

🧠 **Wiganz's Brain Replay:**

- **Initial Approach:** Use a Stack. Push open brackets. When seeing a close bracket, pop the last open one and compare. If it doesn't match, return `False`.
- **The "Wait, what about...?" Moment:** Hadriel challenged the initial plan with two edge cases:
  1. What if the string starts with a close bracket `]`? (The "Empty Room" problem)
  2. What if the string ends with unclosed brackets `(()`? (The "Leftover" problem)
- **Refinement:** Wiganz realized we need to check if the stack is empty *before* popping, and check if the stack is *empty* at the very end.
- **Complexity Discussion:**
  - **Time:** $O(n)$ because we traverse the string once.
  - **Space:** $O(n)$ because in the worst case, the stack holds all characters.
- **Pattern Recognition:** This is the classic **Stack Pattern**. The relationship between parentheses is Last-In, First-Out (LIFO).
- **Aha! Moments:**
  - Realizing the stack acts like a "Waiting Room" for partners.
  - Understanding that `not stack` is the final condition for success.

---

# 3. Step-by-Step Guidance (How to Think)

1. **Identify the relationship:** When you see "matching pairs" or "nested structures," your brain should immediately scream **STACK**.
2. **Initialize your toolkit:** You need a stack (list or deque) and a way to match pairs (a Dictionary/Map is cleanest).
3. **The Loop Strategy:**
   - **Is it an Open Bracket?** Put it in the "Waiting Room" (Stack). It needs to wait for its partner.
   - **Is it a Close Bracket?**
     - **SIGNAL:** A partner has arrived!
     - **Check 1:** Is anyone even in the room? (If `stack` is empty, this closing bracket is a stray. Return `False`).
     - **Check 2:** Is the person at the door the *correct* partner? (Pop from stack and compare).
4. **The Final Audit:** After the loop, check the room. If anyone is left inside, they never found their partner. Return `False`.

---

# 4. Final Solution

```python
from collections import deque

class Solution:
    def isValid(self, s: str) -> bool:
        stack = deque()
        for char in s:
            if char in ['(','[', '{']:
                stack.append(char)
            else:
                # Check if stack is empty. Such as this case. Input = ']' but stack is empty
                if not stack:
                    return False
                latest = stack.pop()
                pair = latest + char
                if pair not in ["()", "[]", "{}"]:
                    return False
        # Stack must be empty at the end. empty = False not False is true. Which means if everything is good
        # Stack must be empty at the end
  
        # 3. If the stack is empty, all brackets were matched correctly
        return not stack
```

- **Time Complexity:** $O(n)$
- **Space Complexity:** $O(n)$

---

# 5. Errors, Misunderstandings & Mistakes (CRITICAL)

### ❌ The `is` vs `==` Identity Trap

- **The Mistake:** Using `if pair is not '()'`.
- **Why it happened:** Assuming `is` checks for value equality.
- **The Lesson:** In Python, `is` checks **Identity** (Memory Address), while `==` checks **Value**. Dynamically created strings (like `recently + char`) often have different memory addresses than string literals.
- **Rule:** Use `==` for values; use `is` ONLY for `None`, `True`, or `False`.

### ❌ The `or` Logic Trap

- **The Mistake:** `if pair != '()' or pair != '[]' or pair != '{}'`.
- **Why it happened:** Logic confusion. If `pair` is `"()"`, it IS NOT `"[]"`, so the second part of the `or` becomes `True`, making the whole statement `True` and returning `False`.
- **The Lesson:** When checking against multiple valid options, use `not in [list]` or a series of `and` statements.

### ❌ The "Empty Room" Crash

- **The Mistake:** Attempting to `stack.pop()` without checking `if not stack`.
- **Why it happened:** Only focusing on the "happy path" where every closer has an opener.
- **The Lesson:** ALWAYS check if a data structure has elements before removing from it.

### ❌ The Leftover Leftovers

- **The Mistake:** Returning `True` at the end of the loop without checking the stack state.
- **Why it happened:** Forgetting that unclosed openers `(((` are also invalid.
- **The Lesson:** A valid stack problem usually ends with a "Full Audit" (checking if the stack is empty).

---

*Archive generated by Hadriel 🔥⚔️💪*
*Reflecting session: 2026-01-22*
