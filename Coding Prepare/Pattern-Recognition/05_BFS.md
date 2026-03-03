# BFS (Breadth-First Search)

## Spot It
| Signal | Use BFS |
|--------|---------|
| "shortest path" / "minimum steps" (unweighted) | ✓ |
| "level order traversal" | ✓ |
| "nearest X" / "minimum transformations" | ✓ |

**NOT BFS**: "all paths" / "any path exists" → DFS

---

## Why It Works
BFS explores in waves: all nodes at distance 1, then distance 2, etc. **First arrival = shortest path.**

---

## The Core
```python
from collections import deque

def bfs(start, target):
    queue = deque([start])
    visited = {start}
    steps = 0

    while queue:
        # Process entire level
        for _ in range(len(queue)):
            node = queue.popleft()

            if node == target:
                return steps

            for neighbor in getNeighbors(node):
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)

        steps += 1

    return -1  # not found
```

**Multi-Source BFS** (e.g., Rotting Oranges): Add ALL sources to queue initially.

---

## Traps
1. **Mark visited when ADDING to queue, not when popping** — prevents duplicates
2. **Level separation**: `for _ in range(len(queue))` — snapshot size BEFORE processing
3. **Weighted graphs**: BFS doesn't work → use Dijkstra
