# 🗡️ Rotting Oranges -- Complete Session Archive

> **Pattern:** BFS (Multi-Source) | **Difficulty:** Medium | **LeetCode:** #994 | **Date:** 2026-05-22
> **Path Taken:** Pattern Path (BFS) | **First solve** | **🎯 Target:** 25 min

---

## 🗺️ The Journey -- How Understanding Built

Wiganz identified this as a BFS problem and correctly applied the level-by-level template -- but the session was filled with critical bugs that revealed exactly how wrong variable scope, off-by-one minute counting, and missing edge cases can silently destroy a correct-looking solution. The final solution works, but only after catching 6 distinct bugs. Every single one is documented here.

---

## 📖 Step 1 -- Understand

### 📝 Problem Statement (Human Language)

Given a 2D grid where each cell is `0` (empty), `1` (fresh orange), or `2` (rotten orange).
Every minute, a rotten orange spreads to all 4-directional fresh neighbors.
Return the minimum number of minutes until no fresh orange remains.
If any fresh orange can NEVER rot (isolated by walls/empty cells), return -1.

**Inputs:** `grid` -- 2D integer matrix
**Output:** Integer (minutes elapsed, or -1)
**Constraints:** Cells are only 0, 1, or 2. Multiple rotten sources. Spreading is simultaneous each minute.

**Traps:**
- "Simultaneous" spread means ALL rotten oranges spread at the same time each minute -- not sequentially. This forces multi-source BFS.
- An isolated fresh orange (surrounded by 0s, never touched by rot) makes the answer -1, NOT 0.
- A grid with zero fresh oranges at the start should immediately return 0, even if rotten oranges exist.

### 🔬 Abstract (Story Stripped)

> "Given a matrix with multiple infected sources, find the minimum steps for infection to reach all reachable cells simultaneously. Return -1 if any cell is permanently unreachable."

### ❓ Constraint Questions

| Question | Answer |
|----------|--------|
| Can grid be empty? | No, guaranteed at least 1 cell |
| Can fresh oranges be isolated? | Yes -- surrounded by 0s |
| Multiple rotten oranges at start? | Yes -- multi-source |
| Diagonal spread? | No -- 4 directions only |
| Does empty cell (0) block spread? | Yes |
| Can fresh orange be adjacent to no rotten? | Yes -- return -1 |
| Does grid mutate? | Yes (we use this as visited marker) |
| What if no fresh oranges exist? | Return 0 immediately |
| What if no rotten oranges exist but fresh exist? | Return -1 |

### ✋ Trace by Hand

```
Grid:
[[2,1,1],
 [1,1,0],
 [0,1,1]]

Minute 0 (initial rotten): (0,0)=2
Minute 1: (0,0) rots (0,1) and (1,0) → queue: [(0,1),(1,0)]
Minute 2: (0,1) rots (0,2),(1,1). (1,0) rots (1,1) already → queue: [(0,2),(1,1)]
Minute 3: (0,2) no new. (1,1) rots (2,1) → queue: [(2,1)]
Minute 4: (2,1) rots (2,2) → queue: [(2,2)]
Minute 5: (2,2) no new → queue empty
```

Output is 4. The problem says so. (We'll see below why naive code returns 5 -- and how to fix it.)

---

## 🧭 Step 2 -- Approach (3-Gate Check)

### 🚦 3-Gate Results

- **Gate 1 -- Has this been solved?** No (first time)
- **Gate 2 -- Which pattern?** BFS -- spreading infection level by level = BFS level = 1 minute
- **Gate 3 -- Can I apply it?** Yes

→ Decision: **PATTERN PATH -- BFS (Multi-Source)**

---

## 🎯 3P Match + 4P Reason

### 🔍 3P -- Signal → Pattern → Full Sentence

**Signal:** Multiple sources, simultaneous spread, "how many steps/minutes" question on a matrix

**Pattern:** Multi-Source BFS

> "I see multiple rotten oranges spreading simultaneously each minute, which tells me Multi-Source BFS because all sources must be in the queue at once and each BFS level = 1 minute of simultaneous spread."

### 🧠 4P -- Reason (Before ANY code)

**A -- 🐢 Brute Force + Why Bad:**
Simulate minute by minute by scanning the entire grid each minute to find newly rotten oranges. O((m×n)²) -- you scan m×n cells for up to m×n minutes. Terrible for large grids.

**B -- ⚡ What BFS Does Instead:**
Enqueue ALL initial rotten oranges at once. Process level by level -- one level = one minute. Each newly rotted orange goes into the queue for the next level. O(m×n) -- each cell is visited at most once.

**C -- 🔒 The Invariant:**
> "Every orange at BFS depth D became rotten at exactly minute D. If we count levels (not individual oranges), we count minutes correctly."

The queue snapshot trick -- `level_size = len(queue)` -- is what enforces this. Without it, you'd process oranges from different minutes in the same loop iteration.

---

## 🗣️ Step 3 -- Discuss

### 📋 Wiganz's Approach

1. Initialize `rows`, `cols`, `directions`, `fresh_count = 0`, `minute = 0`, `queue = deque()`
2. Scan matrix: count fresh oranges, enqueue all rotten oranges
3. Edge case: `fresh_count == 0` → return 0
4. Multi-source BFS: `while queue`, snapshot `level_size`, process each level, increment `minute` only if new oranges spread
5. Return `minute` if `fresh_count == 0` else `-1`

### 📊 Complexity Stated

- Time: O(m×n) -- each cell visited once
- Space: O(m×n) -- queue worst case holds all cells

### ✅ Green Light

Asked to code after confirming approach.

### ⚠️ What Was Missed in Discuss

- Brute force mention was brief (correct behavior -- brief in Step 2, deep in 4P)
- Edge case `[[2]]` (rotten only, no fresh) should be stated explicitly before coding

---

## 💻 Step 4 -- Code

### 🏗️ Blueprint (Comments First)

```python
def orangesRotting(self, grid):
    # Initialize rows, cols, directions, minute, fresh_count
    # Scan matrix: count fresh oranges, add all rotten to queue
    # Edge case: no fresh oranges from the start
    # Multi-source BFS from all rotten oranges simultaneously
        # Capture current level size
        # For each orange this level, check 4 neighbors
            # Skip out of bounds
            # Skip empty cells
            # If fresh: rot it, decrement count, add to queue
        # Only increment minute if new oranges actually spread
    # Return minute if all fresh are gone, else -1
```

### ✨ Final Clean Solution

```python
from collections import deque

class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        rows = len(grid)
        cols = len(grid[0])
        directions = [(0,1), (1,0), (0,-1), (-1,0)]
        fresh_count = 0
        minute = 0
        queue = deque()

        for row in range(rows):
            for col in range(cols):
                if grid[row][col] == 1:
                    fresh_count += 1
                if grid[row][col] == 2:
                    queue.append((row, col))

        if fresh_count == 0:
            return 0

        while queue:
            level_size = len(queue)

            for _ in range(level_size):
                current = queue.popleft()

                for direction in directions:
                    neighbor_row = direction[0] + current[0]
                    neighbor_col = direction[1] + current[1]

                    if neighbor_col < 0 or neighbor_col >= cols:
                        continue
                    if neighbor_row < 0 or neighbor_row >= rows:
                        continue

                    if grid[neighbor_row][neighbor_col] == 0:
                        continue

                    if grid[neighbor_row][neighbor_col] == 1:
                        grid[neighbor_row][neighbor_col] = 2
                        fresh_count -= 1
                        queue.append((neighbor_row, neighbor_col))

            if queue:
                minute += 1

        return minute if fresh_count == 0 else -1
```

**⏱️ Time:** O(m×n) -- each cell enqueued and processed at most once
**📦 Space:** O(m×n) -- queue holds up to all cells in worst case

---

## 🔍 Step 5 -- Verify

### 👣 Trace Through Main Example

```
Grid: [[2,1,1],[1,1,0],[0,1,1]]
Initial queue: [(0,0)]   fresh_count: 6

Level 1 (level_size=1):
  Process (0,0): rot (0,1) → fc=5, rot (1,0) → fc=4
  Queue after level: [(0,1),(1,0)] → non-empty → minute=1

Level 2 (level_size=2):
  Process (0,1): rot (0,2) → fc=3, rot (1,1) → fc=2
  Process (1,0): (1,1) already=2, skip
  Queue after level: [(0,2),(1,1)] → non-empty → minute=2

Level 3 (level_size=2):
  Process (0,2): no fresh neighbors
  Process (1,1): rot (2,1) → fc=1
  Queue after level: [(2,1)] → non-empty → minute=3

Level 4 (level_size=1):
  Process (2,1): rot (2,2) → fc=0
  Queue after level: [(2,2)] → non-empty → minute=4

Level 5 (level_size=1):
  Process (2,2): no fresh neighbors
  Queue after level: [] → EMPTY → minute stays at 4

fresh_count == 0 → return 4 ✓
```

### 🧪 Edge Cases

| Case | Input | Expected | Handled? |
|------|-------|----------|----------|
| No oranges | `[[0]]` | 0 | ✅ fresh_count=0, return 0 |
| One fresh, no rotten | `[[1]]` | -1 | ✅ queue empty, while skipped, fc=1, return -1 |
| One rotten, no fresh | `[[2]]` | 0 | ✅ fresh_count=0, return 0 (guard catches it) |
| Isolated fresh | `[[0,2,1],[0,0,0],[1,0,0]]` | -1 | ✅ BFS finishes, fc=2 > 0, return -1 |
| All rotten | `[[2,2],[2,2]]` | 0 | ✅ fresh_count=0, return 0 |
| All fresh | `[[1,1],[1,1]]` | -1 | ✅ queue empty, while skipped, fc=4, return -1 |

### ✅ Complexity Confirmed

- Time: O(m×n) -- BFS visits each cell once
- Space: O(m×n) -- queue in worst case

---

## ⚡ Step 6 -- Optimize

### Redundant visited set removed

During coding, a `visited = set()` was added and used to track processed neighbors. This was redundant:

- When a fresh orange is rotted: `grid[neighbor_row][neighbor_col] = 2`
- That cell will never pass `== 1` again in any future check
- The grid itself IS the visited structure -- modifying in-place removes the need for an external set

**Removed:** `visited = set()`, `visited.add(...)`, `if neighbor in visited: continue`, and dead variable `neighbor = (neighbor_row, neighbor_col)`

**Space improvement:** Saves O(m×n) for the set. Total space stays O(m×n) due to queue, but the constant factor is smaller.

BTTC for this problem: O(m×n) -- you must examine every cell at least once to count fresh oranges. Current solution matches BTTC.

---

## 🐛 Bugs & Mistakes (Every Single One)

### 🐛 Bug 1: Wrong variable in grid check (critical)

- **❌ What:** Used `grid[row][col]` and `queue.append((row, col))` inside BFS neighbor loop instead of `grid[neighbor_row][neighbor_col]` and `queue.append((neighbor_row, neighbor_col))`
- **🔍 Why:** `concept gap` + `variable scope confusion` -- `row` and `col` were loop variables from the outer initialization scan. After that scan finishes, they hold the last values (e.g., `row=2, col=2` for a 3x3 grid). Those old variables were still in scope inside the BFS loop. Every grid access and every enqueue was pointing at that same last-scanned cell instead of the actual neighbor.
- **💸 Cost:** Entire BFS logic was wrong. The wrong cell was being checked and enqueued. Would have produced completely wrong results for any grid.
- **🛡️ Prevention:** After nested loops, old loop variables persist in Python. When using NEW computed variables (`neighbor_row`, `neighbor_col`), use ONLY those -- never fall back to the outer loop names. Rule: inside the BFS loop, if you computed `neighbor_row` and `neighbor_col`, use them EXCLUSIVELY for everything in that scope.

### 🐛 Bug 2: Variable name inconsistency (minutes vs minute)

- **❌ What:** Initialized `minutes = 0` (plural), incremented `minute += 1` (singular), returned `minutes` (plural) -- three different references, only one is defined at each point
- **🔍 Why:** `typo` -- created the variable with one name, started typing the other name mid-code, mixed them freely
- **💸 Cost:** `NameError` at runtime (or silent wrong value if Python happened to find an outer scope variable named `minute`)
- **🛡️ Prevention:** Pick the variable name BEFORE writing the loop. Write it in the blueprint comment. Never rename mid-function. For counters, prefer the singular form: `minute`, `level`, `step`.

### 🐛 Bug 3: minute += 1 inside inner for loop (wrong indentation)

- **❌ What:** `minute += 1` was indented one level too deep -- inside `for _ in range(level_size)` instead of after it
- **🔍 Why:** `rush` -- wrote the increment without thinking about where the level boundary is. The `level_size` loop IS the level. The increment belongs AFTER it.
- **💸 Cost:** minute was incremented for every orange processed (up to m×n times), not once per minute. Wildly wrong result.
- **🛡️ Prevention:** The rule: "one minute = one BFS level = one outer iteration of the while loop." The `for _ in range(level_size)` loop is INSIDE the level. `minute += 1` goes AFTER the inner for loop, still inside while. Always check indentation of counters against your mental model of what "one unit" means.

### 🐛 Bug 4: Edge case [[2]] returns 1 without guard

- **❌ What:** For grid `[[2]]` (one rotten, zero fresh), BFS runs: processes (0,0), all neighbors OOB, nothing added. But `minute += 1` fires (at the time, unconditionally) → returns 1. Expected: 0.
- **🔍 Why:** `edge case blind spot` -- the assumption was "if there's no fresh orange, the BFS will do nothing." But the rotten orange IS in the queue. BFS runs one level for it. The minute counter doesn't know it was a wasted level.
- **💸 Cost:** Wrong answer for any grid with rotten oranges but no fresh oranges.
- **🛡️ Prevention:** Ask: "What if fresh_count is already 0 before BFS runs?" Add the guard `if fresh_count == 0: return 0` BEFORE the while loop. This class of bug = "BFS ran but had nothing to accomplish." The guard prevents entering BFS unnecessarily.

### 🐛 Bug 5: Last BFS level over-counts minute by 1

- **❌ What:** Even with the `fresh_count == 0` guard, the main example returned 5 instead of 4. The final rotten orange (2,2) is processed in the last level, has no fresh neighbors, adds nothing to queue. But `minute += 1` still fired → extra +1.
- **🔍 Why:** `edge case blind spot` -- same class as Bug 4. The last BFS level processes oranges that spread nothing new. An unconditional `minute += 1` counts that wasted level as a real minute.
- **💸 Cost:** Off-by-one error on the final answer for virtually every grid where the last orange processed has no fresh neighbors (which is almost always true).
- **🛡️ Prevention:** The fix: `if queue: minute += 1` -- only increment if the queue has new oranges after the level (meaning spreading actually happened). This works because: if new fresh oranges were rotted this level, they were added to the queue. If queue is empty after the level, no spreading happened -- this was a terminal level, don't count it.

### 🐛 Bug 6: Dead variable neighbor left in code

- **❌ What:** `neighbor = (neighbor_row, neighbor_col)` was written and then never used anywhere (after removing the visited set)
- **🔍 Why:** `rush` -- wrote the visited set logic first, then removed the set but forgot to remove the tuple assignment that fed into it
- **💸 Cost:** No runtime error, but dead code creates confusion. Future reader wonders what `neighbor` is for.
- **🛡️ Prevention:** When removing a feature (visited set), scan for ALL lines that referenced it and remove them together. Dead variables with no references are always a cleanup item.

> Root cause categories used: `rush` | `typo` | `concept gap` | `edge case blind spot`

---

## 💡 Discoveries (Aha Moments, Insights & Clarity)

### 🔒 Core Invariant / Rule

> "Each BFS level = exactly one minute of simultaneous spread. Count levels, not oranges."

The level snapshot `level_size = len(queue)` enforces this. Without it, you'd mix oranges from minute 1 and minute 2 in the same processing batch -- and the minute counter would be meaningless.

### ⚡ Aha Moments

**💡 1. Queue empty ≠ all fresh oranges rotted**

- **Before:** "If BFS finishes (queue empty), all reachable oranges must have been rotted."
- **Trigger:** "What if a fresh orange is surrounded by empty cells (0s)?"
- **After:** BFS can finish without touching isolated fresh oranges. Queue empty only means "no more rotten oranges to spread from." The only reliable check is `fresh_count == 0` after BFS.

**💡 2. The `if queue: minute += 1` trick**

- **Before:** Increment `minute` unconditionally after each level.
- **Trigger:** Tracing the main example manually revealed minute=5 when expected was 4. The last level (processing (2,2)) ran but produced nothing new.
- **After:** Only count a minute if the queue has items AFTER the level -- meaning at least one fresh orange was actually rotted this level. If queue is empty, this was a terminal no-spread level. Don't count it.
- **In his words:** This is the SAME class of bug as the `[[2]]` edge case -- both are "BFS level ran but accomplished nothing."

**💡 3. Grid as its own visited structure**

- **Before:** Added `visited = set()` to track processed cells.
- **Trigger:** Review of the code -- noticed that `grid[r][c] = 2` already marks the cell as rotten, which means no future check can return True for `== 1` on that cell.
- **After:** The grid mutation IS the visited marker. No external set needed. This is a key optimization pattern for grid BFS problems where cell state naturally tracks visitation.

**💡 4. Multi-source means ALL sources in queue at minute 0**

- **Before:** Could have added one rotten orange and BFS'd from there.
- **Trigger:** Understanding that all rotten oranges spread simultaneously.
- **After:** All initial rotten oranges go into the queue before BFS starts. This ensures minute 1 processes all of their neighbors together -- correct simultaneous spreading.

### 🎨 Key Metaphors & Examples

- **"Spreading infection"** -- The problem itself is a perfect metaphor. Multiple infected patients in a room, every minute they infect adjacent people. BFS is literally the spread pattern.
- **"Level = minute"** -- The BFS level structure maps 1:1 to the problem's minute structure. This is why BFS solves this exactly -- the algorithm's natural unit of work equals the problem's natural unit of time.

---

## 📊 Final Complexity

| | Complexity | Reason |
|--|-----------|--------|
| ⏱️ Time | O(m×n) | Each cell enters the queue at most once (once rotted, grid value = 2, never re-queued) |
| 📦 Space | O(m×n) | Queue worst case holds all cells (e.g., all rotten at once) |
| 🎯 BTTC | O(m×n) | Must scan every cell at least once to count fresh oranges -- cannot do better |

---

## 🪞 Self-Assessment

- **💪 Confidence:** 3/5 -- Core BFS structure was correct, but 6 bugs shows the execution under pressure is still shaky. The variable scope bug (Bug 1) is a serious one to make.
- **🔄 Revisit:** The `if queue: minute += 1` logic -- understand WHY before the next similar problem. Also revisit Bug 1 (scope confusion) -- this could reappear under interview pressure.
- **📈 Pattern Mastery Impact:** BFS pattern stays at competent. Multi-source BFS and level-counting are now explicitly part of the toolkit. The "grid as visited marker" optimization is a reusable insight for future grid BFS problems.

---

## 🔗 Similar Problems (max 3)

- **01 Matrix (#542)** -- BFS from all 0s simultaneously to find min distance to 0. Same multi-source pattern, same "enqueue all sources first" setup.
- **Number of Islands (#200)** -- DFS/BFS on a grid, visited tracking, same OOB checks. Single-source but same grid traversal structure.
- **Walls and Gates (LeetCode #286)** -- Multi-source BFS from all gates simultaneously to fill distances. Identical pattern to Rotting Oranges.

---

*🔥 Hadriel x Wiganz -- 2026-05-22*
*"Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds." -- James 1:2 ✝️*
*Six bugs. Fixed all six. That's not failure -- that's how mastery is forged.*
