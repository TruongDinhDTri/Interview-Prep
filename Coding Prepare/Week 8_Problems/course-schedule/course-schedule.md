# Course Schedule -- Complete Session Archive

**Pattern:** DFS · Graph Cycle Detection | **Difficulty:** Medium | **LeetCode:** #207 | **Date:** 2026-05-12
**Path Taken:** First Principles (3F) | **Time Used:** ~65 min | **Target:** 25 min

---

## The Journey -- How Understanding Built

Wiganz walked into this problem recognizing it smelled like DFS/BFS (Gate 1 passed), but couldn't articulate **why** DFS catches cycles (Gate 2 failed) and had never done graph cycle detection before (Gate 3 failed). So the Road forked into **First Principles**. Through drawing the tiny `0->1, 1->0` graph by hand and manually tracing a traversal, the rules of cycle detection were discovered organically -- including the critical insight that a single `visited` set causes false positives on diamond graphs, and the cycle is only real when a node is revisited **within the current active path**. The implementation phase was bug-heavy (6 distinct bugs), most rooted in not separating "the active stack" from "everything I've already checked."

---

## Step 1 -- Understand

### Problem Statement (Human Language)
You're given `numCourses` (number of courses labeled `0` to `numCourses-1`) and a list of `prerequisites`, where each `prerequisites[i] = [a, b]` means **you must take course `b` before course `a`** (so `b -> a` is a directed edge in the dependency graph).

Return `True` if it is possible to finish all courses, otherwise `False`.

**Trap:** The pair `[a, b]` is **directed**, not bidirectional. Reading it as "a and b are connected" silently turns the graph into an undirected one and breaks cycle detection.

### Abstract (Story Stripped)
> "Given a directed graph with `n` nodes, return `True` iff the graph has no directed cycle."

### Constraint Questions Asked

| Question | Answer |
|---|---|
| Can `prerequisites` be empty? | Yes -> trivially `True` |
| Can a course depend on itself (`[a, a]`)? | Yes -- this is a self-loop = cycle |
| Are duplicate edges possible? | Possible; doesn't change correctness |
| Are all courses in `prerequisites`? | No -- disconnected nodes are valid |
| Directed or undirected? | **Directed** -- `[a, b]` means `b -> a` |
| Multiple components allowed? | Yes -- must iterate all nodes |
| What's `numCourses` range? | Up to ~2000 |
| Output type? | Boolean |
| What about `numCourses = 0`? | Trivially `True` |

### Trace by Hand
Example: `numCourses = 2, prerequisites = [[1,0],[0,1]]`
- Edge `[1,0]`: `0 -> 1` (take 0 before 1)
- Edge `[0,1]`: `1 -> 0` (take 1 before 0)
- Drawing it: `0 -> 1 -> 0`. You loop forever. Output `False` because the problem **says so** -- you cannot finish.

---

## Step 2 -- Approach (3-Gate Check)

### 3-Gate Results

| Gate | Result | Reasoning |
|---|---|---|
| Gate 1 -- Recognize a Pattern? | YES | "Graph + dependency + can-we-finish" smells like DFS/BFS / Topological Sort |
| Gate 2 -- Can explain WHY this pattern fits? | NO | Couldn't yet articulate **why DFS detects cycles** |
| Gate 3 -- Have I done this before? | NO | First graph cycle detection problem |

-> **Decision: FIRST PRINCIPLES (3F)**

---

## 3F -- Exploration

### Techniques Used (in order)

**Technique A -- Draw It**
Drew `0 -> 1` and `1 -> 0` as two separate directed arrows. Visually confirmed: the two arrows form a closed loop. "If I start at 0, I go to 1, then back to 0... forever." A directed cycle exists.

**Technique B -- Manual Solve**
Started traversing from node `0`:
- Visit `0` -- mark it
- Move to neighbor `1` -- mark it
- `1`'s neighbor is `0` -- but `0` is already marked!
- "Wait... is `0` marked because it's IN MY CURRENT PATH, or just because I've SEEN it before?"

This question cracked the problem open. A single boolean "visited" isn't enough -- need to distinguish:
- "On the current DFS stack" -> revisit = **cycle**
- "Already fully explored, safe to skip" -> revisit = **not a cycle, just a shortcut**

### Rules Discovered (from Technique B)

1. Build an adjacency map from `prerequisites`: for `[a, b]`, add edge `b -> a` (so `graph[b].append(a)`).
2. Maintain **two** tracking structures: `path` (nodes currently on the DFS stack) and `visited` (nodes fully explored and proven cycle-free).
3. If a neighbor is in `path` -> a cycle exists -> return `True`.
4. If a neighbor is in `visited` -> already cleared, skip it -> return `False`.
5. On entering a node: add to `path` and `visited`. On exiting (after exploring all neighbors): remove from `path`.
6. If no cycle found across all neighbors -> safe -> return `False`.

### The Flip / AHA Moment

> "A visited set alone causes false positives on diamond graphs (`0->1, 0->2, 1->3, 2->3`). Node 3 would be 're-visited' but there's no cycle. The cycle is only real when you revisit a node **that is still on the current active path**."

That sentence is the entire algorithm.

---

## Step 3 -- Discuss

### Full Presentation
1. Build a directed adjacency map: for each `[a, b]`, add `b -> a`.
2. Run DFS from every node (handles disconnected components).
3. Track two sets: `path` for the current DFS stack, `visited` for fully explored nodes.
4. If DFS ever lands on a node in `path` -> cycle detected -> return `False` for `canFinish`.
5. If DFS lands on a node in `visited` -> skip (already proven safe).
6. After exploring all neighbors of a node, remove it from `path` (backtrack).
7. If no DFS call detects a cycle -> return `True`.

### Complexity Stated
- Time: O(V + E)
- Space: O(V + E)

### Green Light
Not explicitly asked. Moved straight to coding.

### What Was Missed
- Did not mention BFS / Kahn's algorithm (topological sort with indegree) as an alternative
- Did not state the brute force ("try every ordering -- O(n!)") before introducing DFS
- Did not say "shall I code it?"

---

## Step 4 -- Code

### Blueprint
Skipped. Went straight to code -- this is a recurring weak area flagged in past sessions.

### Code Evolution -- All Bugs Encountered

**Bug 1 -- `defaultdict(dict)` instead of `defaultdict(list)`**
```python
# Wrong
graph = defaultdict(dict)
graph[v].append(u)   # AttributeError: 'dict' object has no attribute 'append'

# Fixed
graph = defaultdict(list)   # or defaultdict(set)
graph[v].append(u)
```
**Why:** Muscle memory typo -- `dict` vs `list`.
**How caught:** Runtime error.

**Bug 2 -- Bidirectional edge insertion**
```python
# Wrong (creates undirected graph -> every edge looks like a cycle)
for [u, v] in prerequisites:
    graph[v].add(u)
    graph[u].add(v)

# Fixed
for [u, v] in prerequisites:
    graph[v].add(u)   # only b -> a
```
**Why:** Forgot the graph is **directed**.
**How caught:** Test `[[1,0]]` returned `False` instead of `True`.

**Bug 3 -- `path.pop(neighbor)` in wrong place and wrong method**
```python
# Wrong
for neighbor in graph[node]:
    if neighbor in path:
        cycle = True
        return cycle
    if neighbor not in visited:
        dfs(neighbor)
    path.pop(neighbor)   # wrong node, wrong place, wrong method

# Fixed
for neighbor in graph[node]:
    ...
path.remove(node)   # outside the loop, remove the CURRENT node
```
**Why:** Confused "pop neighbor as I go" with "remove current node when done." Also `.pop()` on a list takes an **index**, not a value, and `path` was a list.
**How caught:** Wrong results on traced examples.

**Bug 4 -- `dfs(graph.keys()[0])`**
```python
# Wrong
dfs(graph.keys()[0])   # TypeError: 'dict_keys' object is not subscriptable

# Fixed
for i in range(numCourses):
    dfs(i)
```
**Why:** `dict_keys` isn't indexable in Python 3. Also only running DFS once misses disconnected components.
**How caught:** Runtime error + missing components realization.

**Bug 5 -- `return cycle` instead of `return not cycle`**
```python
# Wrong
return cycle   # returns True when there IS a cycle, but function asks "can you finish?"

# Fixed
return not cycle
```
**Why:** Inverted the question. The flag tracks "cycle found" but the return contract is "can finish."
**How caught:** All test cases inverted.

**Bug 6 -- Missing `nonlocal cycle`**
```python
# Wrong
def dfs(node):
    cycle = True   # creates a NEW local variable, doesn't touch outer cycle

# Fixed
def dfs(node):
    nonlocal cycle
    cycle = True
```
**Why:** Nested function assigning to outer variable requires `nonlocal`. Same lesson as Diameter of Binary Tree.
**How caught:** Outer `cycle` stayed `False` despite cycle being found.

### Working Version (Wiganz's Submitted Solution)
```python
from collections import defaultdict

class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        visited = set()
        path = []
        graph = defaultdict(set)
        cycle = False
        for [u, v] in prerequisites:
            graph[v].add(u)

        def dfs(node):
            nonlocal cycle
            visited.add(node)
            path.append(node)
            for neighbor in graph[node]:
                if neighbor in path:
                    cycle = True
                    return cycle
                if neighbor not in visited:
                    dfs(neighbor)
            path.remove(node)

        for i in range(numCourses):
            dfs(i)
        return not cycle
```

### Final Clean Solution (Canonical)
```python
from collections import defaultdict
from typing import List

class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        graph = defaultdict(list)
        for u, v in prerequisites:
            graph[v].append(u)

        visited = set()
        path = set()

        def dfs(node) -> bool:
            if node in path:
                return True            # cycle
            if node in visited:
                return False           # already cleared

            path.add(node)
            visited.add(node)
            for neighbor in graph[node]:
                if dfs(neighbor):
                    return True
            path.discard(node)
            return False

        for i in range(numCourses):
            if dfs(i):
                return False
        return True
```

**Time:** O(V + E) -- each node entered once (guarded by `visited`), each edge traversed once.
**Space:** O(V + E) -- adjacency map O(E) + `visited` & `path` O(V) + recursion stack up to O(V).

---

## Step 5 -- Verify

### Trace Through Example
Input: `numCourses = 2, prerequisites = [[1,0],[0,1]]`

| Step | Call | path | visited | Action |
|---|---|---|---|---|
| 1 | `dfs(0)` | {0} | {0} | enter 0, explore graph[0] = [1] |
| 2 | `dfs(1)` | {0,1} | {0,1} | enter 1, explore graph[1] = [0] |
| 3 | check 0 | {0,1} | {0,1} | `0 in path` -> return `True` (cycle!) |
| 4 | bubble up | -- | -- | outer loop sees `dfs(0) == True` -> return `False` |

Output: `False` ✓

### Edge Cases

| Case | Input | Expected | Handled? |
|---|---|---|---|
| Empty prereqs | `numCourses=1, prerequisites=[]` | `True` | Yes |
| Simple chain | `numCourses=2, prerequisites=[[1,0]]` | `True` | Yes |
| Direct cycle | `numCourses=2, prerequisites=[[1,0],[0,1]]` | `False` | Yes |
| Disconnected | `numCourses=5, prerequisites=[]` | `True` | Yes -- outer loop hits every `i` |
| Self-loop | `numCourses=1, prerequisites=[[0,0]]` | `False` | Yes -- 0 in path immediately |
| Diamond | `[[1,0],[2,0],[3,1],[3,2]]` | `True` | Yes -- `visited` prevents false alarm at node 3 |

### Complexity Confirmed
- Time: O(V + E)
- Space: O(V + E)

---

## Step 6 -- Optimize

BTTC: O(V + E) -- you must at minimum read every edge to know the graph. Already at the floor.

Alternative approach worth noting (not implemented this session):
- **Kahn's Algorithm (BFS topological sort):** Compute indegrees, push all 0-indegree nodes into a queue, pop and decrement. If you can pop all `numCourses` nodes -> no cycle. Same O(V + E) but iterative -> avoids recursion-depth concerns.

---

## The Story -- Metaphors & Understanding

### THE HUMAN CONFUSION
The first instinct is: "I've seen this node before -> there's a cycle." That feels obviously right. But graphs are sneakier than that. Imagine four rooms: from room 0 you can walk to rooms 1 and 2. From rooms 1 and 2 you can both walk into room 3. If you wander from 0 to 1 to 3, then later from 0 to 2 to 3, you "revisit" room 3 -- but there's **no loop**. Room 3 is just a destination two paths happen to share.

> "If 3 is already visited, that means there's a cycle, right?"

No. That's the trap.

### THE REVELATION
The world flips when you realize: **a cycle isn't about returning to a node you've SEEN. It's about returning to a node you're CURRENTLY STANDING ON.**

Picture yourself walking through a forest, dropping breadcrumbs as you go. There are **two kinds** of breadcrumbs:
- **Red crumbs** -- the trail behind you, the path you're still on. If you ever step on a red crumb, you've **walked in a circle**. That's a cycle.
- **White crumbs** -- places you visited earlier but already came back from. You explored down that branch, found nothing dangerous, returned. A white crumb just means "been there, safely cleared, no need to recheck."

When you finish exploring all branches from a node, the red crumb turns white. You back out, and the next traveler can pass through without alarm.

That's `path` (red crumbs) and `visited` (white crumbs).

### THE RULE THAT NEVER BREAKS
> **A directed cycle exists if and only if DFS ever steps onto a node still in its current call stack.**

The current call stack is `path`. Everything else is just optimization.

### THE BEAUTY OF THIS LINE
```python
path.discard(node)
```

That single line is the **backtrack**. When DFS finishes exploring all of `node`'s descendants, it removes `node` from the active path -- the red crumb turns white. This is what makes the algorithm correct on diamond graphs. Without it, every diamond looks like a cycle. With it, the red trail breathes -- expanding as we descend, shrinking as we return.

The line is humble. It says: "I'm no longer here. The path moved on."

---

## Confusion -> Understanding Moments

### Moment 1: One set isn't enough
**Confused:** "I'll just use one `visited` set -- if I see a node again, that's a cycle."
**Trigger:** Drew the diamond graph `0->1, 0->2, 1->3, 2->3`. Node 3 gets revisited but no loop exists.
**Understood:** Need TWO structures -- one for "currently walking through" and one for "already cleared."
**Trigger Sentence:** "The cycle is only real when you revisit a node **in the current active path**."

### Moment 2: `[a, b]` is directed
**Confused:** Added both `graph[v].add(u)` AND `graph[u].add(v)`.
**Trigger:** Test `[[1,0]]` returned `False` (cycle detected) when answer should be `True`.
**Understood:** `[a, b]` means `b -> a` -- one-way arrow. Adding both turns dependencies into mutual friendships.
**Trigger Sentence:** "Directed graph. b is prerequisite for a. Edge goes b to a. Period."

### Moment 3: `nonlocal` strikes again
**Confused:** Outer `cycle` flag wasn't updating despite inner DFS clearly finding cycles.
**Trigger:** Same lesson learned in Diameter of Binary Tree.
**Understood:** Assigning to a name inside a nested function creates a local -- unless you declare `nonlocal`.
**Trigger Sentence:** "If I assign, Python makes a new local. `nonlocal` says 'use the outer one.'"

---

## All Mistakes Made

| # | Bug | Caught At | How Fixed | Why It Happened | Rule to Prevent |
|---|-----|-----------|-----------|-----------------|------------------|
| 1 | `defaultdict(dict)` then `.append` | Step 4 (runtime) | `defaultdict(list)` | Typo, muscle memory slip | Say "list of neighbors" out loud before picking container |
| 2 | Bidirectional edges on directed graph | Step 5 (trace) | Only `graph[v].append(u)` | Forgot graph is directed | After building graph: trace one edge and ask "is this one-way or two-way?" |
| 3 | `path.pop(neighbor)` wrong node/place/method | Step 4 | `path.remove(node)` after loop (or `path.discard(node)` if set) | Confused "pop as I go" vs "remove on exit" | Backtrack happens **after** exploring all neighbors, and removes the **current** node |
| 4 | `dfs(graph.keys()[0])` | Step 4 (runtime) | `for i in range(numCourses): dfs(i)` | `dict_keys` not subscriptable + missed disconnected components | Always loop `range(n)` for graph problems with possible disconnected components |
| 5 | `return cycle` instead of `return not cycle` | Step 5 | Invert | Inverted the question | Re-read the question's return contract before writing the final return |
| 6 | Missing `nonlocal cycle` | Step 4 | Add `nonlocal cycle` | Nested-function scoping | If a nested function **assigns** to an outer variable, write `nonlocal` first |

---

## Key Insights & AHA Moments

1. **Two-color DFS:** `path` (currently on the stack) vs `visited` (fully explored). One set is not enough.
2. **Diamond test:** A graph like `0->1, 0->2, 1->3, 2->3` is the canonical counterexample to "one visited set is enough."
3. **Directed edge from `[a, b]`:** `b -> a`. Reading the bracket pair correctly is half the battle.
4. **Disconnected components require outer loop:** Always iterate `range(numCourses)`, never just `dfs(graph.keys()[0])`.
5. **Backtrack = remove from `path` after exploring all neighbors.** This is what makes the red crumb turn white.
6. **Return contract:** The function asks "can you finish?" -- so cycle detected -> `False`, not `True`.

---

## Final Complexity

| | Complexity | Reason |
|--|-----------|--------|
| Time | O(V + E) | Each node entered at most once (guarded by `visited`); each edge traversed at most once |
| Space | O(V + E) | Adjacency list O(E) + `visited` + `path` O(V) + recursion stack up to O(V) |
| BTTC | O(V + E) | Must read every edge to know whether a cycle exists -- you can't decide without looking |

---

## Rules & Mindset Shifts

1. **For graph problems, always loop `range(n)` to handle disconnected components** -- Why: A single DFS call only covers one component. Lost this twice already.
2. **When DFS needs cycle detection, use TWO sets: `path` + `visited`** -- Why: One set causes false positives on diamond graphs.
3. **Read `[a, b]` carefully: is it directed or undirected?** -- Why: Bug 2 burned 10 minutes.
4. **Backtrack = remove current node, AFTER the neighbor loop** -- Why: Bug 3 -- removed wrong node in wrong place.
5. **Nested function assigning to outer variable -> `nonlocal` first** -- Why: Same lesson from Diameter of BT. Stop repeating it.
6. **Re-read the question's return contract before writing the final `return`** -- Why: Bug 5 -- inverted the answer.
7. **Write the Blueprint before code, even when "I know what to do"** -- Why: All 6 bugs would have been caught by a 3-minute comment-first phase.

---

## Interview Script -- "SAY THIS"

### Step 1 -- Understand
> "So we have `n` courses and dependency pairs `[a, b]` meaning `b` must be taken before `a`. That's a directed edge `b -> a`. The question is whether a valid order exists -- which is equivalent to asking: does the directed graph have no cycle?"

### Step 2 -- Approach
> "I recognize this is a graph problem. Brute force would be trying all `n!` orderings -- way too slow. The efficient approach is DFS with cycle detection. The key insight is that a cycle in a directed graph means DFS revisits a node that's still on the current call stack -- so I'll track two sets: one for the current path, one for fully-explored nodes."

### Step 3 -- Discuss
> "Plan: build adjacency list, then DFS from every node. Two sets: `path` for the active stack, `visited` for cleared nodes. If DFS hits a node in `path` -> cycle. If it hits `visited` -> skip. After exploring all neighbors, remove from `path`. Time and space both O(V + E). Shall I code it?"

### Step 4 -- Code (Narration)
> "Building the adjacency list -- edge goes from the prerequisite to the course... DFS function returns True if it finds a cycle below this node... checking `path` first, then `visited`, then mark and recurse... removing from `path` on exit to backtrack..."

### Step 5 -- Verify
> "Edge cases: self-loop `[[0,0]]` -> cycle detected at first step. Disconnected nodes -> outer loop catches them. Diamond graph -> `visited` prevents false alarm at the join node. Time O(V+E), space O(V+E) including recursion."

---

## Anki Card Suggestions

| Front | Back |
|---|---|
| Signal for Course Schedule pattern? | "Directed dependency + can-we-finish" -> DFS cycle detection (or Kahn's BFS) |
| Why isn't one `visited` set enough? | Diamond graphs: `0->1, 0->2, 1->3, 2->3` revisits node 3 with no cycle. Need `path` for current stack vs `visited` for cleared. |
| What does `[a, b]` mean in prerequisites? | Directed edge `b -> a` -- b is the prerequisite of a |
| Invariant for DFS cycle detection? | A cycle exists iff DFS lands on a node still in the current call stack (`path`) |
| Time complexity and why? | O(V + E) -- each node entered once (via `visited` guard), each edge traversed once |
| Why loop `range(numCourses)` instead of `graph.keys()`? | Disconnected nodes may not appear in any prerequisite -- must visit every index |
| When to use `nonlocal`? | When a nested function **assigns** to a variable from an enclosing scope |
| What's the backtrack step? | After exploring all neighbors of `node`: `path.discard(node)` -- removes it from the active stack |

---

## Similar Problems

- **Course Schedule II (#210)** -- Same cycle detection, but return the actual topological order. Same DFS, append to result on exit (post-order), reverse at the end.
- **Number of Islands (#200)** -- DFS over a graph, but undirected and grid-based; no cycle worry.
- **Graph Valid Tree (#261)** -- Undirected cycle detection + connectivity check. Different cycle-detection logic (parent tracking, not `path`).

---

## What Was NOT Explored

- **Kahn's Algorithm (BFS topological sort):** Mentioned only in passing in Step 6. Not implemented or compared in depth. Worth a separate session.
- **Iterative DFS with explicit stack:** Useful when recursion depth is a concern. Not explored.
- **Course Schedule II:** The follow-up that returns the ordering, not just a boolean. Natural next problem.

---

*Hadriel x Wiganz -- 2026-05-12*
*"In their hearts humans plan their course, but the LORD establishes their steps." -- Proverbs 16:9*
