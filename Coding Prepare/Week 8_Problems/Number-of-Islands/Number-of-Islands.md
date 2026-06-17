# 🗡️ Number of Islands — Complete Session Archive

> **Pattern:** BFS (Matrix Traversal) | **Difficulty:** Medium | **LeetCode:** #200 | **Date:** 2026-05-21
> **Path Taken:** Pattern Path | **⏱️ Time Used:** ~44 min (including discussion) | **🎯 Target:** 25 min

---

## 🗺️ The Journey — How Understanding Built

Wiganz recognized the BFS pattern correctly and moved through the Road with solid structural thinking. The session ran overtime not from confusion on approach, but from condition logic precision in the Blueprint — particularly `== '0'` vs `== 0` and return statement placement. Three bugs surfaced only at Verify, all caught through Socratic guidance. The key conceptual unlock: matrix BFS does NOT pre-load a start node — you scan first, trigger BFS only when you find an unvisited `'1'`. That difference from graph BFS is subtle but load-bearing.

---

## 📖 Step 1 — Understand

### 📝 Problem Statement (Human Language)
Given a 2D grid of characters where `'1'` means land and `'0'` means water, count the number of **islands** — groups of `'1'`s that are connected horizontally or vertically. Diagonal connections do NOT count. Each island is a connected component of land cells.

### 🔬 Abstract (Story Stripped)
> "Given a 2D grid of '1's and '0's, count the number of connected components of '1's, where connectivity is defined as horizontally or vertically adjacent cells only."

### ❓ Constraint Questions Asked
| Question | Answer |
|---|---|
| Is connectivity horizontal/vertical only, or also diagonal? | Horizontal + vertical only — no diagonal |
| Can the grid be empty? | No — guaranteed non-empty |
| Grid cells are strings `'1'`/`'0'`, not integers? | Yes — strings |
| Can I modify the grid in-place? | Yes — grid mutation is allowed |
| What do I return? | Integer — count of islands |
| Single cell grid? | Yes — possible edge case |

### ✋ Trace by Hand
```
Grid:
1 1 0 0
1 0 0 0
0 0 1 0
0 0 0 1
```
Output: `3` — Because the top-left cluster (three connected `'1'`s) is one island, the lone `'1'` at (2,2) is a second, and the lone `'1'` at (3,3) is a third. Definition WHY: the problem says a group of horizontally/vertically connected `'1'`s counts as one island.

---

## 🧭 Step 2 — Approach (3-Gate Check)

### 🚦 3-Gate Results
- Gate 1 (abstract shape match): ✅ "count connected components in a 2D binary matrix" → BFS/DFS signature
- Gate 2 (name + why): ✅ BFS — explore all cells reachable from a `'1'` before moving to the next unvisited one
- Gate 3 (solved something like this): ✅ 01 Matrix, Flood Fill — same matrix BFS template

→ Decision: **PATTERN PATH**

---

## 🎯 3P Match + 4P Reason

### 🔍 3P — Signal → Pattern → Full Sentence
> "I see 'connected components' in a 2D matrix — that's a BFS signature, because BFS can flood-fill from any unvisited starting cell and mark everything reachable before I move on."

### 🧠 4P — Reason (Before ANY code)

**A — 🐢 Brute Force + Why Bad:**
Check every cell; for each `'1'`, try every possible path to count connectivity — exponential branching, revisiting cells repeatedly. O(m×n × m×n) in the worst case. Completely impractical.

**B — ⚡ What BFS Does Instead:**
Scan the grid cell by cell. When an unvisited `'1'` is found, increment the counter and immediately BFS outward from that cell, marking every connected `'1'` as visited before moving on. Each cell is touched at most once → O(m×n).

**C — 🔒 The Invariant:**
> Once a `'1'` cell is added to the queue and marked visited, it will NEVER be counted again. Every BFS call exhausts exactly one island — no more, no less.

---

## 🗣️ Step 3 — Discuss

### 📋 Wiganz's Presentation
1. Scan each cell in the grid row by row.
2. Skip cells that are `'0'` or already visited.
3. When an unvisited `'1'` is found, increment `count` and launch BFS from that cell.
4. BFS explores all 4 neighbors (up/down/left/right), skipping out-of-bounds, `'0'`s, and already-visited cells.
5. Mark each cell visited as it enters the queue.
6. Return `count` after all cells are scanned.

### 📊 Complexity Stated
- Time: O(m×n) — every cell visited at most once
- Space: O(m×n) — visited set + queue in worst case (all land)

### ✅ Green Light
Asked "Shall I code it?" — yes.

### ⚠️ What Was Missed
- Did not explicitly name the brute force before presenting the optimal — missed the 10-second brute force mention that earns Problem Solving points.
- Condition logic precision (string vs int, return placement) not verified verbally before coding.

---

## 💻 Step 4 — Code

### 🏗️ Blueprint (Comments First)
```python
def numIslands(self, matrix):
    # 1. Get rows, cols. Init count=0, visited set, queue, directions
    # 2. Outer scan: for each (row, col), skip if visited or '0'
    # 3. Otherwise: count += 1, mark visited, enqueue
    # 4. BFS inner loop: popleft, check 4 neighbors
    # 5.   Skip: out of bounds, visited, '0'
    # 6.   Otherwise: mark visited, enqueue neighbor
    # 7. Return count
```

### ✨ Final Clean Solution
```python
from collections import deque

class Solution:
    def numIslands(self, matrix: List[List[str]]) -> int:
        rows = len(matrix)
        cols = len(matrix[0])
        count = 0
        visited = set()
        queue = deque()
        directions = [(0,1), (1,0), (-1,0), (0,-1)]

        for row in range(rows):
            for col in range(cols):
                if (row, col) in visited or matrix[row][col] == "0":
                    continue
                count += 1
                visited.add((row, col))
                queue.append((row, col))

                while queue:
                    current = queue.popleft()
                    for direction in directions:
                        neighbor_row = current[0] + direction[0]
                        neighbor_col = current[1] + direction[1]
                        neighbor = (neighbor_row, neighbor_col)

                        if neighbor_row < 0 or neighbor_row >= rows:
                            continue
                        if neighbor_col < 0 or neighbor_col >= cols:
                            continue
                        if neighbor in visited:
                            continue
                        if matrix[neighbor_row][neighbor_col] == "0":
                            continue

                        visited.add(neighbor)
                        queue.append(neighbor)

        return count
```

**⏱️ Time:** O(m×n) — each cell enqueued and dequeued at most once
**📦 Space:** O(m×n) — visited set + queue both scale with grid size

---

## 🔍 Step 5 — Verify

### 👣 Trace Through Example
```
Grid:
1 1 0
1 0 0
0 0 1
```
| Step | Action | count | visited size | queue |
|---|---|---|---|---|
| (0,0): '1', unvisited | count+=1, enqueue | 1 | 1 | [(0,0)] |
| BFS from (0,0): check neighbors (0,1)=1, (1,0)=1 | enqueue both | 1 | 3 | [(0,1),(1,0)] |
| BFS (0,1): neighbors (0,2)='0', (0,0) visited, (1,1)='0' | nothing added | 1 | 3 | [(1,0)] |
| BFS (1,0): neighbors (0,0) visited, (2,0)='0', (1,1)='0' | nothing added | 1 | 3 | [] |
| Scan continues: (0,1) visited, (0,2)='0', (1,0) visited, (1,1)='0', (1,2)='0', (2,0)='0', (2,1)='0' | skip all | 1 | 3 | — |
| (2,2): '1', unvisited | count+=1, enqueue | 2 | 4 | [(2,2)] |
| BFS from (2,2): all neighbors out-of-bounds or '0' | nothing added | 2 | 4 | [] |
| Return | **2** | — | — | — |

Output: `2` ✅

### 🧪 Edge Cases
| Case | Input | Expected | Handled? |
|---|---|---|---|
| All water | `[["0","0"],["0","0"]]` | 0 | ✅ — outer scan skips all |
| All land (one island) | `[["1","1"],["1","1"]]` | 1 | ✅ — BFS floods entire grid |
| Single cell land | `[["1"]]` | 1 | ✅ — count=1, BFS has no valid neighbors |
| Single cell water | `[["0"]]` | 0 | ✅ — skipped immediately |
| Checkerboard | `[["1","0"],["0","1"]]` | 2 | ✅ — no adjacency between the two |
| Diagonal '1's | `[["1","0"],["0","1"]]` | 2 | ✅ — diagonal NOT connected by design |

### ✅ Complexity Confirmed
Time O(m×n) — outer scan + BFS together visit each cell at most once (visited set prevents re-entry).
Space O(m×n) — visited set holds up to m×n tuples; queue can hold up to m×n cells in an all-land grid.

---

## ⚡ Step 6 — Optimize

### BTTC Already Reached
BTTC = O(m×n) — must inspect every cell to determine if it belongs to an island. Already there.

### Space Optimization Identified
**Grid mutation trick:** Replace `visited` set with in-place mutation — set `grid[r][c] = '0'` when a cell is visited. This eliminates the O(m×n) visited set entirely, reducing space from O(m×n) to O(m×n) queue-only in worst case. Net improvement is constant factor, but is cleaner in interviews where grid mutation is allowed.

```python
# Instead of: visited.add((row, col))
# Use:        matrix[row][col] = "0"
# And check:  if matrix[row][col] == "0": continue  (covers both water AND visited)
```

This was correctly identified and confirmed as the space-optimal path. Not implemented in final solution (visited set version submitted) — both are valid interview answers.

---

## 🐛 Bugs & Mistakes (Every Single One)

### 🐛 Bug 1: `== 0` instead of `== "0"`
- **❌ What:** Wrote `matrix[row][col] == 0` (integer) — condition never triggers because grid stores strings `"0"` and `"1"`.
- **🔍 Why:** `concept gap` — forgot that the input type is `List[List[str]]`, not integers. The problem signature says `str`, but coding muscle memory defaulted to int comparison.
- **💸 Cost:** Every cell would appear to be land — BFS would flood infinitely (or throw errors), count would be wildly wrong.
- **🛡️ Prevention:** During Step 1, explicitly state the cell type in the abstract. If the problem says `str`, write `"0"` in your Blueprint comment, not `0`. Check your comparison type before coding the condition.

### 🐛 Bug 2: `return count` placed inside the outer for loop
- **❌ What:** `return count` was indented one level too deep — inside the `for col in range(cols)` loop — returning after the first island is found instead of after the full scan.
- **🔍 Why:** `rush` + `indentation error` — wrote the return at the wrong level when filling in Blueprint comments. Did not re-check nesting before proceeding.
- **💸 Cost:** Function exits after the very first `'1'` is processed, always returning `1` regardless of grid contents.
- **🛡️ Prevention:** After writing the return statement, explicitly ask: "Is this at the TOP level of the function?" Return for the scan result always lives OUTSIDE all loops. Blueprint comment should read `# 7. Return count` at function scope — match indentation to the comment's intended level.

### 🐛 Bug 3: Indentation error in `for direction in directions` block
- **❌ What:** The `for direction in directions` loop (neighbor expansion) was misindented — placed outside the `while queue` block instead of inside it.
- **🔍 Why:** `rush` — copied the direction iteration logic without verifying it was nested inside the BFS while loop.
- **💸 Cost:** Neighbor expansion would run once per outer-loop cell rather than per BFS step — breaking the entire BFS traversal logic.
- **🛡️ Prevention:** The BFS skeleton has a fixed nesting structure: `while queue` → `popleft` → `for direction`. These three always go together. Verify the three-level nesting every time you write a BFS.

> Root cause categories used: `rush` | `concept gap` | `indentation error`

---

## 💡 Discoveries (Aha Moments & Insights)

### 🔒 Core Invariant / Rule
> **Once a cell is marked visited and added to the queue, it will never be re-counted.** Each BFS call from a new `'1'` exhausts exactly one island — all cells touched by that BFS belong to the same connected component. The outer scan then skips all of them.

Think of it like a wildfire: you light the match at one cell, and the fire spreads to every connected neighbor. When the fire burns out (queue empty), that entire island is ash — gray, visited, done. You keep walking the grid looking for unlit land.

### ⚡ Aha Moments (in order)

**💡 1. Matrix BFS does NOT pre-load a start node**
- **Before:** Expected to set up BFS with a starting node before the scan, like in graph BFS.
- **Trigger:** Realized that in matrix BFS there is no single starting cell — you don't know where the islands are until you scan. The scan IS the discovery mechanism.
- **After:** The outer `for row / for col` loop plays the role of "finding the source." BFS only fires when the scan encounters an unvisited `'1'`. The queue starts empty and is populated on-demand.

**💡 2. "Connected components" = islands**
- **Before:** The term "connected components" sounded abstract.
- **Trigger:** Abstracting the problem: "count connected components of '1's in a 2D binary matrix."
- **After:** Every island IS a connected component. This directly maps to the BFS template already practiced on graphs — same logic, different representation.

**💡 3. Grid mutation as visited set replacement**
- **Before:** Used `visited = set()` as default — didn't question the space cost.
- **Trigger:** "What if you don't need the set at all?"
- **After:** Setting `grid[r][c] = '0'` serves the same purpose as `visited.add((r,c))` — the next check `matrix[row][col] == "0"` will catch it. Eliminates the set entirely. Requires explicit permission that grid mutation is OK (confirmed in Step 1 constraints).

### 🎨 Key Metaphors & Examples

- **Wildfire metaphor:** Each BFS call is a wildfire starting at one cell and burning through all connected land. When the fire dies, one island is fully charred. You keep walking to find unlit land and start the next fire. The count = number of times you struck a match.
- **Checkerboard edge case:** `[["1","0"],["0","1"]]` — diagonal `'1'`s look close on paper but are NOT connected. Confirmed that the 4-directional constraint is the whole definition of adjacency here.

---

## 📊 Final Complexity

| | Complexity | Reason |
|--|-----------|--------|
| ⏱️ Time | O(m×n) | Outer scan visits every cell once. BFS for each island also visits cells once — the visited set/mutation prevents re-entry. Total work across all BFS calls is bounded by m×n. |
| 📦 Space | O(m×n) | visited set stores up to m×n tuples. Queue can hold up to m×n cells in the worst case (all land, BFS enqueues everything). Grid mutation version reduces this to O(m×n) queue only (no set). |
| 🎯 BTTC | O(m×n) | Must inspect every cell to determine land or water. Cannot skip any cell — already at theoretical floor. |

---

## 🪞 Self-Assessment

- **💪 Confidence:** 3/5 — Pattern recognition and BFS structure are solid. The three bugs (type comparison, return placement, indentation) reveal Blueprint precision is still a weak area under time pressure.
- **🔄 Revisit:**
  - Blueprint phase — condition logic: always annotate expected types next to comparisons in comments
  - Return statement placement — must verify scope before writing
  - BFS nesting discipline — the `while queue` → `popleft` → `for direction` triple must become reflex
- **📈 Pattern Mastery Impact:** Adds a matrix-traversal BFS problem to the solved set. Reinforces the "scan first, trigger BFS on discovery" template that distinguishes matrix BFS from graph BFS. Problems solved in BFS pattern now: 7.

---

## 🔗 Similar Problems

- **01 Matrix (#542)** — BFS from all `0`s simultaneously (multi-source BFS). Same matrix traversal template, different trigger.
- **Flood Fill (#733)** — BFS/DFS from a single start cell, recolor connected component. Simplified version of this exact problem.
- **Max Area of Island (#695)** — Same template, track island size instead of island count. Direct extension.

---

*🔥 Hadriel x Wiganz — 2026-05-21*
*"Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go." — Joshua 1:9 ✝️*
