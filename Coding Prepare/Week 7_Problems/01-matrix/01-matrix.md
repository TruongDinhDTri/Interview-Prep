# 01 Matrix — Complete Session Archive

**Pattern:** Multi-source BFS | **Difficulty:** Medium | **Date:** 2026-04-29

---

## 🗺️ The Journey — How Understanding Built

Started by correctly identifying "shortest path = BFS" but failed Gate 3 (never solved THIS type). Went First Principles path. Discovered the key insight by tracing the brute force: "BFS from each 1" is O((mn)²) — too slow. The flip moment came when Wiganz saw that **distance comes FROM the 0s**, not the 1s. Drawing the wave visually clicking: start from ALL 0s simultaneously, let the wave expand outward, distance = parent + 1. That rule IS the algorithm.

---

## 🎯 Step 1 — Understand

### Mistake in Step 1 Order ⚠️

Wiganz asked constraint questions BEFORE paraphrasing. Correct order is:
1. Paraphrase first
2. Then constraint questions
3. Then strip the story
4. Then trace

**Why this matters:** In a real interview, skipping the paraphrase signals you didn't fully read the problem. Communication score takes a hit.

### Paraphrase (Wiganz's words)

> "I'm given a matrix size mxn. I have to return a matrix of the same dimension. Each cell holds the distance to its nearest 0."

### Constraint Questions Asked

- Can values be negative? → Always 0 or 1 (binary matrix)
- At least one 0? → Guaranteed
- What to return? → Matrix of same dimensions, each cell = distance
- Can the matrix be empty? → No, m, n ≥ 1 guaranteed
- Can I modify in-place? → Yes
- Size constraints? → 1 ≤ m, n, total cells ≤ 10⁴

### Abstract Version (locked-in)

> "Given a 2D grid, find the shortest distance from each cell to its nearest 0 cell."

### Trace by Hand (Example 2)

```
Input:          Expected:
0 0 0           0 0 0
0 1 0    →      0 1 0
1 1 1           1 2 1
```

- Cell (2,0): nearest 0 is (1,0), distance = 1 ✅ — Definition WHY: *"I can SEE it's one step above me"*
- Cell (2,1): all nearest 0s are 2 steps away, distance = 2 ✅ — Definition WHY: *"move up then left/right — always 2 steps"*

**Step 1 WHY rule:** Could a 5-year-old explain by pointing at the picture? YES → that's Step 1 WHY. No algorithm needed here.

---

## 🧠 Step 2 — Approach

### 3-Gate Check

- Gate 1: Does abstract shape match a pattern? → YES (shortest path = BFS)
- Gate 2: Can I name AND explain WHY? → YES: *"I see 'shortest path of each cell to nearest 0' which tells me BFS because BFS is exploring and finding shortest path"*
- Gate 3: Have I solved something like THIS before? → **NO** — knew BFS, but never this specific type

**Gate 3 = NO → First Principles path (3F)**

---

## 🔵 Step 3F — First Principles Exploration

### Technique A — Visualize / Draw It

Drew the grid. Key observation Wiganz made:

> **"Distance comes from the 0."**

The 0s are the SOURCE of all distance information. Not the destination — the origin.

### Technique B — Manual Solve: The Brute Force Trap

**First instinct:** BFS from each 1 cell to find nearest 0.

**Tracing the cost:**
- How many 1 cells could there be? → O(m×n)
- Each BFS visits how many cells? → O(m×n) in the worst case (4 neighbors × all cells)
- Total cost = O(m×n) × O(m×n) = **O((m×n)²)**

For 10⁴ cells: **10⁸ operations. Way too slow.**

### 🔥 The Flip Moment

**Hadriel asked:** "What if instead of starting from the 1 cells... you flipped it? What if you started from ALL the 0 cells at once?"

**Wiganz:** *"might work"* (too vague — pushed to trace it)

**Tracing "start from all 0s":**

Wave 0 — Queue initialized with all 0 cells:
```
dist: 0  0  0
      0  -1  0
     -1  -1  -1
```

Wave 1 — Process the 0 cells, update their -1 neighbors:
- (0,1) dequeued → (1,1) is -1 → distance[1][1] = 0 + 1 = 1
- (1,0) dequeued → (2,0) is -1 → distance[2][0] = 0 + 1 = 1
- (1,2) dequeued → (2,2) is -1 → distance[2][2] = 0 + 1 = 1

```
dist: 0  0  0
      0  1  0
      1  -1  1
```

Wave 2 — Process wave 1 cells:
- (2,0) dequeued → neighbor (2,1) is -1 → distance[2][1] = 1 + 1 = 2

```
dist: 0  0  0
      0  1  0
      1  2  1  ✅ Matches expected output!
```

**Wiganz's AHA moment:** *"That looks like a wave!"* 🔥

### Rules Discovered (3F Technique B)

1. All `0` cells start with distance = 0 — they ARE the base case
2. Start BFS from ALL `0` cells simultaneously (multi-source, not single-source)
3. Wave expands outward level by level
4. Cell's distance = parent's distance + 1
5. Only update cells where distance == -1 (first write = shortest distance; BFS guarantees this)
6. Never re-add a cell that's already been set

### Why "start from 0s" gives O(m×n) instead of O((m×n)²)

- Each cell is added to the queue **exactly once** (the -1 check prevents re-adding)
- Each cell checks **4 neighbors**
- Total operations = 4 × m×n = **O(m×n)**

Wiganz derived this himself: *"1 time in queue. 4 neighbors. So 4 × m×n → O(m×n)"*

---

## 📢 Step 3 — Discuss

### Wiganz's Full Presentation

> "I will use BFS starting from all zeros at once. Steps:
> 1. Initialize a queue and distance matrix
> 2. Mark distance matrix as all -1 except 0 positions (distance = 0 for 0 cells)
> 3. Add all 0 cells to the queue
> 4. Start exploring — dequeue current, explore 4 neighbors
> 5. If neighbor has never been visited (distance == -1), mark it as parent's distance + 1, add to queue
> 6. Return the distance matrix
>
> Time O(mn), Space O(mn). Shall I code it?"

### Complexity Proof Wiganz Derived

Each cell enters queue once → O(mn) entries. Each entry checks 4 neighbors → 4 × O(mn) = O(mn) total. ✅

---

## 💻 Step 4 — Code

### Evolution of the Code (including all mistakes)

**First submission (with all bugs):**

```python
from collections import deque
def 01_matrix(mat):                          # ❌ BUG 1: invalid function name
    queue = deque()
    visited = set()
    directions = [(0,1), (1,0), (-1,0), (0,-1)]
    distance = [[0 if mat[r][c] == 0 else -1 for c in len(mat[0])] for r in len(mat)]  # ❌ BUG 2: missing range()
    for r in range(len(mat)):
        for c in range(len(mat[0])):
            if mat[r][c] == 0:
                queue.append((r,c))
    while queue:
        current = queue.popleft()
        for direction in directions:
            neighbor_row = current[0] + direction[0]
            neighbor_col = current[1] + direction[1]
            neighbor = (neighbor_row, neighbor_col)
            if neighbor_col < 0 or neighbor_col >= len(mat[0]):
                continueI di                  # ❌ BUG 3: typo, should be `continue`
            if neighbor_row < 0 or neighbor_row >= len(mat):
                continue
            if neighbor in visited:
                continue
            if distance[neighbor_row][neighbor_col] == -1:
                distance[neighbor_row][neighbor_col] = distance[current[0]][current[1]] + 1
                visited.add(neighbor)
                queue.add(neighbor)           # ❌ BUG 4: deque has no .add(), use .append()
    return distance
```

### Final Clean Solution

```python
from collections import deque

def updateMatrix(mat):
    queue = deque()
    visited = set()
    directions = [(0,1), (1,0), (-1,0), (0,-1)]
    distance = [[0 if mat[r][c] == 0 else -1 for c in range(len(mat[0]))] for r in range(len(mat))]

    # Add all 0 cells to queue as starting points
    for r in range(len(mat)):
        for c in range(len(mat[0])):
            if mat[r][c] == 0:
                queue.append((r, c))

    # BFS wave expansion from all 0s simultaneously
    while queue:
        current = queue.popleft()
        for direction in directions:
            neighbor_row = current[0] + direction[0]
            neighbor_col = current[1] + direction[1]
            neighbor = (neighbor_row, neighbor_col)

            # Boundary check
            if neighbor_col < 0 or neighbor_col >= len(mat[0]):
                continue
            if neighbor_row < 0 or neighbor_row >= len(mat):
                continue
            if neighbor in visited:
                continue

            # Only update unvisited cells
            if distance[neighbor_row][neighbor_col] == -1:
                distance[neighbor_row][neighbor_col] = distance[current[0]][current[1]] + 1
                visited.add(neighbor)
                queue.append(neighbor)

    return distance
```

**Time:** O(m×n) — each cell enqueued and dequeued exactly once
**Space:** O(m×n) — distance matrix + queue

**Note:** The `visited` set is technically redundant here — the `distance == -1` check already prevents re-processing. Both work fine together, but you could simplify to just the -1 check and remove the visited set entirely.

---

## ❌ Mistakes Made

### 1. Wrong Step 1 Order — Asked Constraints Before Paraphrasing

**What happened:** Jumped to constraint questions without paraphrasing first.

**Why it happened:** Habit of wanting to validate assumptions before confirming understanding. Natural but wrong.

**Why it matters:** In a real interview, Communication is scored across ALL steps. Starting with constraints before paraphrase signals you didn't fully read the problem.

**Fix:** Always paraphrase FIRST. One sentence. Then ask constraints.

---

### 2. Brute Force Direction — BFS from 1s Instead of 0s

**What happened:** First instinct was "BFS from each 1 cell to find nearest 0."

**Why it happened:** Natural instinct is to search FROM the unknown (1s, the cells you need to answer) TOWARD the known (0s, the reference point). This is how you'd think about it as a human navigating the grid.

**Why it's wrong:** This requires O(m×n) separate BFS runs, each costing O(m×n) → O((m×n)²) total.

**The fix (the flip):** Reverse the direction. Start FROM the known (all 0s) and PUSH answers OUT to the unknown (1 cells). Multi-source BFS runs once and covers everything in O(m×n).

**Key insight to remember:** When multiple cells need distance-to-source, put ALL sources in the queue at the start and let BFS expand outward. The first time BFS reaches a cell = shortest distance.

---

### 3. Syntax Bug — `for c in len(mat[0])` → Missing `range()`

**What happened:** `for c in len(mat[0])` inside the list comprehension.

**Why it happened:** `len()` returns an integer. You can't iterate over an integer in Python. `for c in 5` throws `TypeError: 'int' object is not iterable`.

**The fix:** `for c in range(len(mat[0]))` — `range()` creates an iterable sequence from the integer.

**Why this mistake is common:** Muscle memory from other languages where `for i in n` is valid. In Python, always need `range()`.

---

### 4. Wrong Method — `queue.add(neighbor)` → deque has no `.add()`

**What happened:** Called `.add()` on a `deque` object.

**Why it happened:** Confused `deque` with `set`. Sets use `.add()`. Deques use `.append()` (right end) or `.appendleft()` (left end).

**The fix:** `queue.append(neighbor)`

**Memory trick:**
| Data Structure | Add method |
|---|---|
| `list` | `.append()` |
| `deque` | `.append()` (right) / `.appendleft()` (left) |
| `set` | `.add()` |

---

### 5. Invalid Function Name — `def 01_matrix`

**What happened:** Named the function `01_matrix` which starts with a digit.

**Why it happened:** Copied the problem name literally. Python identifiers cannot start with a digit — this is a `SyntaxError`.

**The fix:** `updateMatrix` (LeetCode's official signature) or any valid name like `zero_one_matrix`.

**Rule:** Python identifiers must start with a letter or underscore, never a digit.

---

### 6. Typo — `continueI di`

**What happened:** During editing/rewriting, accidentally wrote `continueI di` instead of `continue`.

**Why it happened:** Editing error while rewriting the code. Happens when you're typing fast and correcting mistakes simultaneously.

**Fix:** Always do a quick scan after editing. This would be a `SyntaxError` that Python catches immediately.

---

### 7. Trace Error — Row 2 after first wave

**What happened:** Said row 2 is `[-1, -1, -1]` after first wave of BFS.

**Why it happened:** Forgot that the initial 0 cells include (1,0) and (1,2), which are adjacent to (2,0) and (2,2) respectively. The "first wave" processes ALL initial 0 cells, not just the ones in row 0.

**Correct trace:** After first wave, row 2 is `[1, -1, 1]` because (2,0) is updated by (1,0) and (2,2) is updated by (1,2).

---

## ✅ Step 5 — Verify

### Trace Through Example 2

```
Initial queue: [(0,0), (0,1), (0,2), (1,0), (1,2)]

Initial distance:
0   0   0
0  -1   0
-1  -1  -1

After processing (0,1) → (1,1) gets distance 1
After processing (1,0) → (2,0) gets distance 1
After processing (1,2) → (2,2) gets distance 1

Queue: [(1,1), (2,0), (2,2)]

Distance after wave 1:
0  0  0
0  1  0
1  -1  1

After processing (2,0) → (2,1) gets distance 2

Final:
0  0  0
0  1  0
1  2  1  ✅ Correct!
```

### Edge Cases

| Case | Input | Expected | Handled? |
|---|---|---|---|
| All zeros | `[[0,0],[0,0]]` | `[[0,0],[0,0]]` | ✅ All in queue, no -1 cells to update |
| Single cell 0 | `[[0]]` | `[[0]]` | ✅ Initialized to 0, queue processes, no neighbors |
| Single cell 1 | `[[1]]` | impossible | ✅ Guaranteed at least one 0 in constraints |
| 1 is surrounded | `[[0,0,0],[0,1,0],[0,0,0]]` | `[[0,0,0],[0,1,0],[0,0,0]]` | ✅ 1 gets distance 1 from adjacent 0s |

---

## 📚 Key Concepts for Recall

1. **Multi-source BFS:** Put ALL sources in the queue at the start. BFS expands outward simultaneously. First time a cell is reached = shortest distance.
2. **The Flip:** When solving "distance from each cell to nearest source," reverse direction — push FROM sources outward, not FROM cells toward sources.
3. **Why O(m×n):** Each cell is enqueued exactly once (the -1 guard). Each entry checks 4 neighbors. Total = 4 × m×n = O(m×n).
4. **The wave analogy:** BFS from multiple sources looks like ripples in water spreading outward at equal speed. Distance = how many ripple rings away from the nearest source.
5. **-1 as unvisited sentinel:** Avoids a separate `visited` set (though having both is also valid). First write = shortest distance.
6. **Boundary check order:** Check col bounds before accessing `mat[row][col]` to avoid index errors. Row bounds after.
7. **deque.append() not .add():** Sets use `.add()`, deques use `.append()`.
8. **range() around len():** `for i in len(arr)` → TypeError. Always `for i in range(len(arr))`.

---

## 🔥 The Core Insight in One Sentence

> Instead of BFS FROM each 1 TO a 0 (O((mn)²)), put ALL 0s in the queue at once and let one BFS wave push distances OUTWARD (O(mn)).
