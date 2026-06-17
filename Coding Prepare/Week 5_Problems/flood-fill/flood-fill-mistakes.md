# Flood Fill — Mistakes & Insights

**Pattern:** BFS / Grid | **Difficulty:** Easy | **Date:** 2026-04-15

---

## ❌ Mistakes Made

**1. Queue never seeded with starting point**
```python
# Wrong — queue is empty, while loop never runs
queue = deque()
while queue:
    ...

# Correct — seed the starting cell
queue = deque()
queue.append((sr, sc))
while queue:
    ...
```

**2. Used `neighbor` instead of `neighbor_cell`**
```python
# Wrong — `neighbor` is undefined
if neighbor in visited:
    queue.append(neighbor)
    visited.add(neighbor)

# Correct
if neighbor_cell in visited:
    queue.append(neighbor_cell)
    visited.add(neighbor_cell)
```
- Defined `neighbor_cell = (neighbor_row, neighbor_col)` but forgot to use it — 3 places affected.

---

## ✅ Clean Solution

```python
from collections import deque

class Solution:
    def floodFill(self, image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:
        rows = len(image)
        cols = len(image[0])
        directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
        visited = set()
        queue = deque()

        original_color = image[sr][sc]
        image[sr][sc] = color
        queue.append((sr, sc))

        while queue:
            current = queue.popleft()

            for direction in directions:
                neighbor_row = current[0] + direction[0]
                neighbor_col = current[1] + direction[1]
                neighbor_cell = (neighbor_row, neighbor_col)

                if neighbor_row < 0 or neighbor_row >= rows:
                    continue
                if neighbor_col < 0 or neighbor_col >= cols:
                    continue
                if neighbor_cell in visited:
                    continue

                if image[neighbor_row][neighbor_col] == original_color:
                    queue.append(neighbor_cell)
                    visited.add(neighbor_cell)
                    image[neighbor_row][neighbor_col] = color

        return image
```

**Time:** O(n×m) | **Space:** O(n×m)

---

## 💡 Key Insights

- **Pattern:** BFS on a grid — same template as Number of Islands, Rotting Oranges, Pacific Atlantic.
- **Always seed the queue** with the starting cell before the while loop.
- **Consistency matters** — if you define `neighbor_cell`, use it everywhere. Mixing variable names causes silent bugs.
- **Complexity rule for grid BFS/DFS:** Time = O(n×m), Space = O(n×m) — applies to ALL grid traversal problems.
