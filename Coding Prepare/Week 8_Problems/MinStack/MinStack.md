# LC155 - MinStack - Complete Session Archive

> **Pattern:** Stacks | **Difficulty:** Medium | **LeetCode:** #155 | **Date:** 2026-05-19
> **Path Taken:** First Principles | **Solved:** Solo (first attempt) | **Status:** Proud win

---

## The Journey - How Understanding Built

Wiganz encountered MinStack for the first time and arrived at the core insight independently: each stack node stores a `(val, min)` tuple, freezing the minimum at push time. The approach was correct from the start. The challenge was in the implementation -- three bugs appeared during coding, all caught and fixed solo before any hints. The debrief revealed that while the fix worked, the root cause (two sources of truth) pointed toward a cleaner design that eliminates the problem class entirely.

---

## Problem Statement

Design a stack that supports four operations in O(1) time each:

- `push(val)` -- push element onto the stack
- `pop()` -- remove top element
- `top()` -- return top element without removing it
- `getMin()` -- return the current minimum element

The trick: `getMin()` must be O(1). A naive approach (scan entire stack) is O(n). The challenge is engineering the data structure so minimum retrieval costs nothing.

**Input:** a sequence of operations
**Output:** correct results for `top()` and `getMin()` at any point
**Constraint:** all four operations must be O(1) time

---

## Core Insight (Found Solo)

Each node in the stack stores `(val, current_min)` -- not just the value, but a frozen snapshot of what the minimum was at the moment this element was pushed.

When you pop a node, the node below already has its own correct min baked in from when it was pushed. No recalculation. No global state to update. `getMin()` just reads `stack[-1][1]`.

This is the entire insight. Everything else is execution.

---

## Wiganz's Solution (Solved Solo - First Attempt)

```python
from collections import deque

class MinStack:

    def __init__(self):
        # Initialize the stack and min
        self.stack = deque()
        self.min = float('inf')

    def push(self, val: int) -> None:
        # Check if the stack is empty the min should be reset
        if len(self.stack) == 0:
            self.min = float('inf')
        # Check the value with min
        if val <= self.min:
            self.min = val
        self.stack.append((val, self.min))
        return None

    def pop(self) -> None:
        # Pop the node
        x = self.stack[-1] if self.stack else None

        # Remove the val's min itself
        if x[0] == x[1] and len(self.stack) >= 2:
            # Assign previous min
            previous = self.stack[-2] if self.stack else None
            self.min = previous[1]

        x = self.stack.pop()
        return x

    def top(self) -> int:
        # Peek the top
        return self.stack[-1][0] if self.stack else None

    def getMin(self) -> int:
        # Pop the node
        x = self.stack[-1] if self.stack else None
        # Get 2nd value in the node
        return x[1] if x else None
```

This solution is correct. All bugs were caught and fixed during the session before submission.

---

## Bugs Caught Solo (All 3)

### Bug 1 - `self.min` Initialized to 0

- **What:** `self.min = 0` in `__init__`. When pushing positive values like `2`, the condition `2 <= 0` is `False`, so min never updated. Stack stored wrong min for every positive value.
- **Why:** `rush` + `edge case blind spot` -- initializing to 0 feels natural (like initializing a counter), but a running minimum needs a value that every real input can beat.
- **Cost:** Every positive push stored a wrong min. Silent corruption -- no crash, just wrong answers.
- **Prevention:** When tracking a running minimum, always initialize to `float('inf')`. When tracking a running maximum, always initialize to `float('-inf')`. The sentinel must be beatable by any real input.

---

### Bug 2 - Stale `self.min` After Full Empty

- **What:** After popping all elements and pushing new ones, `self.min` still held the old minimum from the previous session. New pushes compared against a stale sentinel.
- **Why:** `concept gap` -- global state that persists across logical resets. The stack was empty but `self.min` didn't know that.
- **Cost:** Wrong min stored in new pushes. The stack "remembered" the old session's minimum even after being fully emptied.
- **Fix:** Reset `self.min = float('inf')` at the start of `push()` when `len(self.stack) == 0`.
- **Prevention:** Global state that survives logical resets is a smell. If a variable should reset when the structure is empty, either reset it explicitly or eliminate it entirely.

---

### Bug 3 - `pop()` Didn't Update `self.min` When Minimum Was Removed

- **What:** When popping a node where `val == min` (the current minimum), `self.min` was never updated to reflect the new top. Subsequent `getMin()` calls returned the deleted minimum.
- **Why:** `concept gap` -- two sources of truth (`self.min` global + the tuple's second element) diverged on pop. When the authoritative source (the tuple) was removed, the global became stale.
- **Cost:** `getMin()` returned a deleted value. The stack lied about its minimum.
- **Fix:** Before popping, if the node being removed carries the current min (`x[0] == x[1]`), look at the node below and grab its min. Reassign `self.min`.
- **Prevention:** Don't store the same information in two places. Two sources of truth means two things to keep in sync, and sync bugs are the most common class of bugs in stateful systems.

> Root cause categories used: `rush` | `edge case blind spot` | `concept gap`

---

## Clean Solution (Hadriel)

```python
class MinStack:

    def __init__(self):
        self.stack = []

    def push(self, val: int) -> None:
        min_val = min(val, self.stack[-1][1]) if self.stack else val
        self.stack.append((val, min_val))

    def pop(self) -> None:
        self.stack.pop()

    def top(self) -> int:
        return self.stack[-1][0]

    def getMin(self) -> int:
        return self.stack[-1][1]
```

### Why This Is Cleaner

| | Wiganz Solution | Clean Solution |
|---|---|---|
| Sources of truth | 2 (`self.min` + tuple) | 1 (tuple only) |
| `push` | Updates global, then appends | Computes local min inline, appends |
| `pop` | Condition check + global reassign | One line |
| Bug surface | High -- global can go stale | Zero -- no global to go stale |
| Lines of code | ~30 | ~10 |

The key line in `push`:

```python
min_val = min(val, self.stack[-1][1]) if self.stack else val
```

- Stack has elements: compare new `val` against the min already stored in the top node
- Stack is empty: this value is the only element, so it is the min by default
- Result gets sealed into the new node forever

`pop` becomes a single line because there is nothing to sync. No global. No condition. Just remove the top node.

### The Deeper Insight

Wiganz's fix for Bug 3 was correct -- check if the min is being popped, then reassign the global from the node below. That fix *works*. But the right question is: why does this sync logic need to exist at all?

Answer: because `self.min` shouldn't exist. It's a redundant copy of information that's already in the tuple. The clean solution removes the duplicate at the source. When you find yourself writing complex sync logic between two variables, that's a signal -- one of them shouldn't be there.

**Immutable snapshot pattern:** Each node doesn't say "the global min is X." It says "when I was born, the minimum was X -- and that fact never changes, even after I'm surrounded by different elements." Pop is trivially simple because removing a node doesn't change anyone else's snapshot.

---

## Complexity

| | Complexity | Reason |
|---|---|---|
| Time (all ops) | O(1) | push/pop are list append/pop (amortized O(1)); top and getMin read index -1 directly |
| Space | O(n) | Each of n elements stores a 2-tuple -- linear growth, constant overhead per node |
| BTTC | O(1) time, O(n) space | You cannot retrieve min in O(1) without storing it somewhere -- O(n) space is the floor |

---

## Key Takeaways

1. **The tuple per node is the entire insight.** `(val, current_min)` freezes a snapshot of the minimum at push time. Pop doesn't need to recalculate anything because the node below already has its correct snapshot.

2. **`stack[-1][1]` is not "the global min."** It is "the min as of the node currently on top." This distinction matters -- it's a local frozen fact, not a live variable.

3. **One source of truth over two.** Every time the same fact lives in two places, you need sync logic. Sync logic creates sync bugs. Wiganz's solution had `self.min` and the tuple's second element saying the same thing -- and they diverged on pop.

4. **`list` is better than `deque` for stack.** Python's `list.append()` and `list.pop()` are both O(1). `deque` adds overhead and import noise with no benefit for stack-only usage.

5. **The bug pattern here is classic:** initialize to wrong sentinel (Bug 1), stale global on reset (Bug 2), global not updated on structural change (Bug 3). All three are variants of "global state went out of sync." The clean solution makes this entire bug class impossible.

---

## Self-Assessment

- **Confidence:** 4/5 -- Core insight arrived independently. Bugs were caught and fixed solo. Understands why the clean solution is cleaner. Minor shaky area: articulating the "immutable snapshot" framing unprompted.
- **Revisit:** The moment when you reach for a global variable, ask first: "Is this information already stored somewhere in my structure?"
- **Pattern Mastery Impact:** Stacks pattern -- demonstrates the tuple-per-node technique. Directly applicable to any "stack with auxiliary info" problem variant.

---

## Similar Problems

- **Valid Parentheses (#20)** -- Stack stores state at push time; pop checks the stored state
- **Daily Temperatures (#739)** -- Monotonic stack; each node implicitly carries position context
- **Evaluate Reverse Polish Notation (#150)** -- Stack as computation context; operand order matters on pop

---

*Hadriel x Wiganz -- 2026-05-19*
*"Those who hope in the Lord will renew their strength." -- Isaiah 40:31*
