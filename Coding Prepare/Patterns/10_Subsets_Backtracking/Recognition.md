# Backtracking — Subsets / Permutations / Combinations / Combo Sum

## Spot It

| Signal | Approach |
| --- | --- |
| "generate ALL subsets/combinations/permutations" | Backtracking |
| "all valid configurations" (N-Queens, Sudoku) | Backtracking |
| "take or not take" each item | Backtracking → Subsets |
| "partition into two groups" | Backtracking → Subsets |
| "subset that sums to target" | Backtracking → Subsets |
| "combinations that sum to target, reuse allowed" | Backtracking → Combo Sum |
| "letter combinations of phone number" | Backtracking → Subsets-shaped |

**NOT Backtracking:** "count ways" / "find optimal (max/min)" → DP instead (see the comparison at the bottom).

---

## Backtracking Is the Parent — Not a Sibling

Every problem below runs the **exact same 5 steps**. Nothing about this skeleton changes between them:

1. **Choose** one available option
2. **Recurse** — go deeper with that choice made
3. If the **GOAL** is reached → **snapshot** the result (copy it — see the trap below)
4. **Undo** the choice
5. Try the **next** option

It's tempting to think "backtracking = ask yes/no for each element" because Subsets looks that way. It doesn't hold up — trace **Combination Sum** (`candidates = [2,3,6,7]`, `target = 7`, coins reusable) against the same 5 steps:

```
path=[], remaining=7
1. CHOOSE coin 2 → path=[2], remaining=5
2. RECURSE with remaining=5
   1. CHOOSE coin 2 again (reuse allowed) → path=[2,2], remaining=3
   2. RECURSE with remaining=3
      1. CHOOSE coin 3 → path=[2,2,3], remaining=0
      2. GOAL reached (remaining==0) → SNAPSHOT [2,2,3] ✅
      3. UNDO coin 3 → path=[2,2], remaining=3
      4. Try coin 6 → remaining=3-6=-3 → invalid, no snapshot, no recurse
   ...
```

CHOICE here is "pick 1 of up to 4 coins" — not a binary yes/no. GOAL here is `remaining == 0` — not "walked every element." **The skeleton didn't move. Only CHOICE and GOAL changed.** That's the whole relationship: Backtracking is the technique; Subsets, Permutations, Combinations, and Combo Sum are four different fill-ins for CHOICE and GOAL, not four kinds of backtracking.

---

## The 4 Applications — Same Skeleton, Different CHOICE + GOAL

| Problem | CHOICE (where the next pick comes from) | GOAL (when to snapshot) |
| --- | --- | --- |
| **Subsets** | Forward only from `start` — never repeat, never go back | **Every node** — even `[]` is already a valid answer |
| **Permutations** | Rescan the **whole list** every time + a `used[]` marker | Only when the path is **full length** (`len == n`) |
| **Combinations** | Forward only from `start`, same as Subsets | Only when the path is **exactly size `k`** |
| **Combo Sum** | Forward only, but **reuse allowed** (recurse with `i`, not `i+1`) | `remaining == 0` (and **prune** the branch the moment `remaining < 0`) |

**Why Permutations can't use "forward only, no repeat" like Subsets:** try to build `[3,1,2]` from `[1,2,3]` — you pick index `2`, then index `0` (which is *before* index `2`), then index `1` (before `2`, after `0`). There's no consistent "before/after" rule that produces this order. Position-based rules don't work here — the only thing that works is marking **which index has already been used in this specific path** (`used[]`), independent of position.

---

## Two Equivalent Codings of Subsets — Not Two Different Patterns

For Subsets specifically, there are two ways to write the code that produce the **exact same tree**. This is not a decision to make per problem — it's two ways to draw the same picture.

**Include/Exclude** — ask yes/no for each element, in fixed order, depth always = n:

```python
def subsets(nums):
    result = []
    def backtrack(i, path):
        if i == len(nums):
            result.append(path[:])
            return
        path.append(nums[i]); backtrack(i + 1, path); path.pop()   # take it
        backtrack(i + 1, path)                                     # skip it
    backtrack(0, [])
    return result
```

**Loop-based** — snapshot at every call, then loop the remaining elements to extend:

```python
def subsets(nums):
    result = []
    def backtrack(start, path):
        result.append(path[:])                  # every path is already valid
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return result
```

Trace both by hand for `[1, 2]` and they produce the identical 4 subsets: `[]`, `[1]`, `[2]`, `[1, 2]`. Loop-based is the one that generalizes cleanly to Combinations (`len==k`) and Combo Sum (reuse) — Include/Exclude's rigid "one yes/no per fixed position" doesn't stretch to "reuse this same choice" or "order matters." That's *why* the other three applications below all use the Loop-based shape, not a preference — it's the only one of the two that actually fits.

---

## Permutations

```python
def permutations(nums):
    result = []
    def backtrack(path, used):
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True
            path.append(nums[i])
            backtrack(path, used)
            path.pop()
            used[i] = False
    backtrack([], [False] * len(nums))
    return result
```

---

## Handle Duplicates

Sort first, then skip a repeated value at the same decision level:

```python
nums.sort()
# inside the loop:
if i > start and nums[i] == nums[i - 1]:
    continue
```

---

## The Reference vs Snapshot Trap

Say `current = [1, 2]` and you do `result.append(current)` (no `[:]`) at a GOAL. You didn't copy anything — `result[0]` now just points at the *same* list object as `current`. The moment you `undo` afterward (`current.pop()` → `[1]`), `result[0]` changes too, because it's not a separate list — it's the same one. By the time backtracking finishes, every "saved" result looks like whatever `current` ended up as, usually `[]`.

Fix: `result.append(current[:])` — an actual copy, frozen at that instant, immune to whatever `current` does afterward.

---

## Backtracking vs DP — Same Tree, Different Question

Subsets (Include/Exclude shape) and 0/1 Knapsack DP walk the **exact same take-or-skip tree**. The only difference is what the problem asks you to return.

**"Give me ALL subsets that sum to 7"** → need the full list → must visit every leaf → a LIST → **Backtracking**.

**"CAN any subset sum to 7?"** → just yes/no → use a table, skip repeated work → ONE value → **DP**.

```
"give me ALL ___"              →  walk whole tree   →  Backtracking
"can you / max / min / count"  →  just one answer   →  DP table
```

---

## Traps

1. **Snapshot, don't reference** — `result.append(path[:])`, not `path` (see above).
2. **Always undo** — `path.pop()` after every recursive call, or state leaks across branches.
3. **Subsets/Combinations: `i + 1`** to move forward only — **Permutations: `0` with `used[]`** — **Combo Sum: `i`** to allow reuse.
