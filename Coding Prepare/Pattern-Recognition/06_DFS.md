# DFS (Depth-First Search)

## Spot It
| Signal | Use DFS |
|--------|---------|
| "all paths" / "any path exists" | ✓ |
| "connected components" / "islands" | ✓ |
| "tree traversal" / "validate BST" | ✓ |
| "cycle detection" / "topological sort" | ✓ |
| **"tree height"** / **"depth"** / **"balanced"** | ✓ — post-order, report up |
| **"every node must satisfy condition"** | ✓ — check on the way back up |
| **"need children's info before processing parent"** | ✓ — post-order DFS |

**NOT DFS**: "shortest path" / "minimum steps" → Use **BFS**

**Key sentence (3P Match):** "I see [tree height / every node] which tells me DFS (post-order) because each node needs its children's values FIRST before it can do its own work."

---

## Why It Works
DFS explores ONE branch completely, then backtracks. The call stack IS your backtracking.

**O(V+E)** time, **O(H)** space (height of recursion).

---

## Tree DFS Core
```python
def dfs(node):
    if not node: return BASE_VALUE

    left = dfs(node.left)
    right = dfs(node.right)

    return COMBINE(node.val, left, right)
```

| Problem | BASE | COMBINE |
|---------|------|---------|
| Max Depth | 0 | 1 + max(L, R) |
| Path Sum | check leaf | subtract, recurse |
| Validate BST | True | pass min/max bounds down |
| **Balanced Binary Tree** | **0 (None→0)** | **-1 if unbalanced, else 1+max(L,R)** |

**-1 Sentinel trick:** when you need to return height (int) AND validity (bool), use -1 as impossible height signal.
Parent checks: `if left == -1 or right == -1: return -1`. Outer wrapper converts: `return dfs(root) != -1`.

---

## Graph DFS Core
```python
def dfs(node, visited):
    if node in visited: return
    visited.add(node)

    for neighbor in graph[node]:
        dfs(neighbor, visited)
```

**Cycle in directed graph**: Use 3 colors (white/gray/black). Hit gray = cycle.

---

## Traps
1. **Graphs need `visited` set** - trees don't (no cycles)
2. **Copy path before storing**: `result.append(path[:])` not `result.append(path)`
3. **DFS finds A path, not THE SHORTEST**
