# Clone Graph — LeetCode #133

**Date:** 2026-05-07
**Session Time:** ~82 min total | Target was 25:00 | Ran +57 min over
**Pattern:** DFS + HashMap (visited tracking)
**Difficulty:** Medium
**Status:** ✅ Solved — full Road loop complete

---

## The Problem

Given a reference to a node in a **connected undirected graph**, return a **deep copy (clone)** of the entire graph.

Each node has:
```python
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
```

**Abstract version (stripped):**
"Given a node reference in a graph where nodes have a value and a list of neighbors — produce a completely independent copy of all reachable nodes and their connections, without infinite looping on cycles."

**Constraints confirmed:**
- Input is a Node reference (NOT a hashmap/adjList directly)
- Can be null (empty graph) → return None
- Values 1–100, all unique
- No repeated edges, no self-loops
- Graph IS connected (all nodes reachable from given node)
- **Cycles CAN exist** (undirected = every edge is bidirectional → always cycles)
- Return: the cloned version of the given node (reference to cloned graph)

---

## 🔑 Core Concepts Discovered This Session

### Deep Copy vs Shallow Copy

**Shallow copy:** Your "clone" node's neighbors still point to the **original** nodes. If original changes → your clone changes too. Not truly independent.

**Deep copy:** Every node in the clone is a **brand new object**. Original and clone are completely independent. Delete a node from original → it still exists in the clone.

> Discovery moment: Wiganz initially didn't know the difference. Question asked: "If I delete Node 3 from the original, should Node 3 still exist in the clone?" → "Yeah, of course. That's a clone." → He already knew it — he just didn't have the vocabulary.

### Why Cycles Make This Hard

If you naively clone every neighbor you visit **with no memory**:
```
Node 1 → clone Node 2 → clone Node 1 again → clone Node 2 again → ... infinite loop
```
Stack overflow. The cycle never breaks.

**The fix:** Before recursing into any neighbor, add the current node to the hashmap FIRST. When the cycle comes back around, it hits the hashmap check and stops.

### Core Constraint (The Invariant)

> "At any point during traversal, every node I have already visited must have exactly one clone in the hashmap."

This means:
- `if neighbor not in hashmap` → it's new → create clone, recurse, then append
- `if neighbor in hashmap` → already cloned → just retrieve and append

**No double-cloning. No infinite loops. The hashmap IS the visited set AND the clone lookup.**

---

## The Road Journey

### Step 1 — Understand

**Wiganz's paraphrase:** "I'm given a reference of a node in a connected undirected graph. Return a deep copy. The graph is represented as adjacency list. Return the copy of the given node as referenced to the cloned graph."

**9 Constraint Questions asked:** ✅ All 9. Earned Communication points.

**Extra question found:** Can the graph have cycles? → YES. This matters because cycles → infinite recursion if not handled.

**Trace of example:**
```
Input:  Node 1 → [2,4], Node 2 → [1,3], Node 3 → [2,4], Node 4 → [1,3]
Output: 4 NEW node objects with the same structure, completely independent
```

**Step 1 took ~15 min.** Long. Target is 3-4 min.

---

### Step 2 — Approach (3-Gate Check)

```
☑ Gate 1: "Visit all nodes in a graph" → graph traversal signature → YES
☑ Gate 2: Named DFS/BFS AND explained why → YES
           "I see visit all nodes in graph which tells me I can use DFS or BFS
            because they both allow visiting every node in the graph"
☑ Gate 3: Solved graph traversal + visited tracking before → YES
→ Decision: PATTERN PATH
```

**⚠️ Trap Wiganz almost fell into:** He said "DFS because of the word 'deep' in deep copy." — WRONG. The word 'deep' in "deep copy" has NOTHING to do with DFS. The signal is "traverse all nodes in a connected graph."

**Correct signal → pattern mapping:**
`"traverse all nodes in graph"` → BFS or DFS (both valid here)

---

### Step 3P — Match + Step 4P — Reason

**A — Brute Force (and why broken):**
Naive DFS with NO visited tracking → infinite loop on cycles. Every node keeps getting re-cloned forever.

**B — What DFS does instead:**
DFS + hashmap `{original_node → cloned_node}`. Before recursing into neighbors, the current node is already in the hashmap. When a cycle comes back around → hashmap check stops the recursion.

**C — Invariant:**
"At any point during traversal, every visited node must have exactly one clone in the hashmap."

---

### Step 3 — Discuss

Wiganz's full discuss:
1. Use DFS + hashmap to explore all neighbors and clone them
2. Steps: init hashmap → define dfs() → clone current node → for each neighbor: if not in hashmap → dfs it + append clone; if in hashmap → retrieve + append
3. Time O(N+E), Space O(N)
4. "Shall I code this up?"

✅ Green light.

---

### Step 4 — Code

**Blueprint (comments first — Phase 1):**
```python
# Edge case: node is None → return None
# 1. Initialize the hashmap
# 2. Define DFS function — clone current node, add to hashmap
# 3. Iterate through neighbors
# 4. If neighbor not in hashmap → dfs it, then append clone
# 5. If neighbor in hashmap → retrieve clone and append
# dfs(node)
# return hashmap[node]
```

**Final code (Phase 2):**
```python
from typing import Optional

class Solution:
    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:
        if node is None:
            return None

        hashmap = {}

        def dfs(node):
            clone_node = Node(node.val)
            hashmap[node] = clone_node
            for neighbor in node.neighbors:
                if neighbor not in hashmap:
                    dfs(neighbor)
                    hashmap[node].neighbors.append(hashmap[neighbor])
                else:
                    hashmap[node].neighbors.append(hashmap[neighbor])

        dfs(node)
        return hashmap[node]
```

**Bugs found and fixed:**

| Bug | Wrong | Fixed |
|-----|-------|-------|
| Cloning a node | `node.copy()` — Node has no copy() | `Node(node.val)` |
| if-branch append | `append(neighbor)` — appends original | call `dfs(neighbor)` first, then `append(hashmap[neighbor])` |
| return order | `return hashmap[0]` before `dfs(node)` | `dfs(node)` first, then `return hashmap[node]` |

---

## 🔥 Key Struggles & Confusions This Session

### Confusion 1 — "Does it double-add clone4's neighbors?"

**Wiganz's concern:** When dfs(node3) calls dfs(node4), and inside dfs(node4) it adds clone1 and clone3 to clone4's neighbors via `else` branch... then when dfs(node4) returns back to dfs(node3), does it ALSO add clone1 and clone3 to clone4 again?

**The resolution:**
```python
hashmap[node].neighbors.append(hashmap[neighbor])
```
After `dfs(node4)` returns, we're back inside `dfs(node3)`. `node` at that moment is **node3**, not node4. So `hashmap[node]` = **clone3**. We're appending clone4 INTO clone3's neighbors — NOT touching clone4 at all.

> "clone3.neighbors gets clone4. clone4's neighbors were already set inside dfs(node4). Two completely different nodes."

**⚡ Click moment:** "Oh, `node` is node3 at that point!" → "Yes. There's no double-add."

### Confusion 2 — "Won't it be infinite?"

**Concern:** Going node1 → node2 → node1 again → infinite?

**Resolution:** The FIRST line of `dfs()` is `hashmap[node] = clone_node` — BEFORE any recursion into neighbors. So when node2 sees node1 as a neighbor, node1 is ALREADY in the hashmap. It hits the `else` branch → just appends. No recursion. No infinite loop.

> The hashmap acts as both the "visited" set AND the clone storage.

### Confusion 3 — Time & Space Complexity

**Wiganz initially said:** "N+V" (wrong — V and N are both nodes), "N+EW" (wrong — no W).

**Correct:** O(N+E) — N nodes visited once, E edges processed once.
**Space:** O(N) — hashmap holds N entries + recursion stack goes at most N deep.

⚠️ **Flag for relearn:** Wiganz needs to get comfortable articulating graph complexity (N+E) without hesitation. Also needs to understand recursion stack depth = O(N) for DFS.

### Confusion 4 — "Why is O(N+E) the BTTC?"

We didn't fully discover this — just concluded it's the floor.

**⚠️ Need to revisit:** Why can't we do better than O(N+E)? Answer: to produce a deep copy, you MUST visit every node (N) and process every edge (E) at least once. You can't clone what you haven't seen. There is no way to skip any node or edge → O(N+E) is theoretically unavoidable.

---

## ⚠️ Things to Revisit / Relearn

- [ ] **Graph complexity notation** — O(N+E) where N = nodes, E = edges. Be fluent, not guessing.
- [ ] **Recursion stack space** — DFS stack depth = O(height of recursion) = O(N) worst case for graph.
- [ ] **BTTC for graph problems** — why O(N+E) is the floor (must touch every node + every edge).
- [ ] **Graph basics review** — cycles, connected components, directed vs undirected. Relearn before next graph problem.
- [ ] **The clone4 confusion** — trace this again manually on paper. The key: `hashmap[node]` refers to the CURRENT stack frame's node, not the neighbor's.

---

## ✅ Final Solution Summary

**Pattern:** DFS + HashMap
**Time:** O(N+E) — visit each node once, process each edge once
**Space:** O(N) — hashmap + recursion stack

**The one-line insight:**
> Add current node to hashmap BEFORE recursing into neighbors — this is what breaks cycles.

**BTTC:** O(N+E) — already at the floor. No optimization needed.
