# Merge Intervals

## Spot It
| Signal | Merge Intervals |
|--------|-----------------|
| "merge overlapping intervals" | ✓ |
| "meeting rooms" / scheduling conflicts | ✓ |
| "insert interval" | ✓ |

---

## Why It Works
**Sort by start time.** Then each interval can only overlap with the previous one. Check & merge in one pass = **O(n log n)**.

Overlap condition: `curr.start <= prev.end`

---

## The Core
```python
def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    result = [intervals[0]]

    for curr in intervals[1:]:
        prev = result[-1]
        if curr[0] <= prev[1]:  # overlap
            prev[1] = max(prev[1], curr[1])  # merge
        else:
            result.append(curr)

    return result
```

**Meeting Rooms II** (min rooms needed) — Line Sweep:
```python
def minRooms(intervals):
    events = []
    for start, end in intervals:
        events.append((start, 1))   # +1 at start
        events.append((end, -1))    # -1 at end
    events.sort()

    curr = max_rooms = 0
    for time, delta in events:
        curr += delta
        max_rooms = max(max_rooms, curr)
    return max_rooms
```

---

## Traps
1. **Sort first** — always
2. **Merge: `max(prev.end, curr.end)`** — curr might be contained in prev
3. **Meeting Rooms I vs II**: I = any overlap?, II = min rooms (line sweep)
