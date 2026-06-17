# Subsets / Backtracking

## Spot It

| Signal | Approach |
| --- | --- |
| "generate ALL subsets/combinations/permutations" | Backtracking |
| "all valid configurations" (N-Queens, Sudoku) | Backtracking |
| "take or not take" each item | Include/Exclude |
| "partition into two groups" | Include/Exclude |
| "subset that sums to target" | Include/Exclude |
| "can you split array into equal halves?" | Include/Exclude |
| "letter combinations of phone number" | Include/Exclude per digit |

**Ask yourself:**
- "For each element, yes or no?" → **Include/Exclude**
- "Which element do I pick next from remaining?" → **Loop-based backtracking**

**NOT Backtracking:** "count ways" / "find optimal" → DP instead.

---

## Two Mental Models

### 1. Include / Exclude (Pick or Skip)

**Idea:** Walk through elements one by one. At each one: **take it or skip it**. Two choices per element → 2^n total subsets.

```
nums = [1, 2, 3]

                    []
               /         \
          [1]               []           ← take 1? yes / no
         /    \           /    \
      [1,2]   [1]      [2]     []       ← take 2? yes / no
      / \     / \      / \     / \
[1,2,3][1,2][1,3][1] [2,3][2] [3] []   ← take 3? yes / no
```

```python
def subsets(nums):
    result = []

    def backtrack(i, path):
        if i == len(nums):
            result.append(path[:])
            return

        path.append(nums[i])       # take it
        backtrack(i + 1, path)
        path.pop()                  # undo

        backtrack(i + 1, path)      # skip it

    backtrack(0, [])
    return result
```

**Best for:** whiteboard explanations, partition problems, subset sum.

---

### 2. Loop-based Backtracking

**Idea:** At each call, save current path as a valid subset. Then loop through remaining elements to extend it.

```python
def subsets(nums):
    result = []

    def backtrack(start, path):
        result.append(path[:])          # every path is a valid subset

        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()                  # undo

    backtrack(0, [])
    return result
```

**Best for:** combinations of size k, handling duplicates, permutations.

---

### Quick Pick

| Problem type | Use |
| --- | --- |
| All subsets | Either |
| Subset sum / partition | Include/Exclude |
| Combinations of size k | Loop-based |
| Has duplicates `[1,2,2]` | Loop-based + sort |
| Permutations | Loop-based + `used[]` |

---

## Backtracking vs DP — Same Tree, Different Question

Include/Exclude and 0/1 Knapsack DP use the **exact same "take or skip" tree**.

```
nums = [3, 4, 5], target = 7

                    TAKE 3              SKIP 3
                   /      \            /      \
              TAKE 4    SKIP 4    TAKE 4    SKIP 4
              /    \    /    \    /    \    /    \
            T5  S5  T5  S5   T5  S5  T5  S5

Same tree. Same decisions. 8 leaves.
```

The ONLY difference is **what the problem asks you to return**.

**"Give me ALL subsets that sum to 7"** → need the full list → must visit every leaf

```
[3,4]   sum=7 ✓ → collect
[3,5]   sum=8   → nope
[4,5]   sum=9   → nope
[3,4,5] sum=12  → nope
...

Answer: [[3,4]]          ← a LIST → Backtracking
```

**"CAN any subset sum to 7?"** → just need yes or no → use a table, skip repeated work

```
dp = [T, F, F, F, F, F, F, F]     ← can I make sum 0? yes. rest? no.
      0  1  2  3  4  5  6  7

After 3: [T, F, F, T, F, F, F, F]  ← can make 0 and 3
After 4: [T, F, F, T, T, F, F, T]  ← can make 7! done.

Answer: True              ← ONE value → DP
```

```
"give me ALL ___"              →  walk whole tree   →  Backtracking
"can you / max / min / count"  →  just one answer   →  DP table
```

Same family. Same decision. **Different question → different tool.**

---

## Permutations

Order matters → start from 0 every time, track what's `used`.

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

Sort first, then skip same value at same decision level:

```python
nums.sort()
# inside the loop:
if i > start and nums[i] == nums[i - 1]:
    continue
```

---

## Traps

1. **Copy the path** — `result.append(path[:])` not `path` (it's a reference)
2. **Always undo** — `path.pop()` after every recursive call
3. **Subsets: `i + 1`** to avoid reusing — Permutations: `0` with `used[]`
