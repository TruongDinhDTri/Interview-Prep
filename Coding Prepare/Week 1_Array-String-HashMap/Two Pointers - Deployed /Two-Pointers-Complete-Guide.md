# Two Pointers Pattern - Complete Guide

> 💡 **Core Idea:** Use two pointers to traverse data structures efficiently. Optimize O(n²) → O(n), use O(1) space.

---

## 🎯 When to Use Two Pointers

### Quick Check

✅ Linear structure (array, string, linked list)
✅ Need O(n) time, O(1) space
✅ Finding pairs/triplets OR in-place modifications

### Problem Indicators

| Problem Type | Use Two Pointers? |
|--------------|-------------------|
| Pair in **sorted** array | ✅ YES (Opposite) |
| Remove duplicates **in-place** | ✅ YES (Same Direction) |
| Palindrome check | ✅ YES (Opposite) |
| Linked list cycle | ✅ YES (Fast & Slow) |
| Pair in **unsorted** array | ❌ NO (Hash Map) |
| Single element in sorted array | ❌ NO (Binary Search) |

---

## 🔥 The Two Core Patterns

### Pattern 1: Opposite Direction (Converging)

**Setup:** `left = 0, right = n - 1` → Move toward each other

**When to use:**

1. **Sorted Array + Find Pairs/Triplets**
   - Problem asks for TWO elements that sum to target
   - Problem asks for THREE elements (3Sum, triplet)
   - Array is sorted OR can be sorted
   - Need to find pairs with specific relationship
   - Examples: Two Sum II, 3Sum, 4Sum

2. **Palindrome Problems**
   - Check if string/array reads same forwards/backwards
   - Compare elements from both ends
   - Examples: Valid Palindrome, Palindrome String

3. **Container/Area Problems**
   - Calculate area/volume between two points
   - Need to maximize/minimize by moving boundaries
   - Examples: Container With Most Water, Trapping Rain Water

4. **Sorted Array Searching**
   - Find closest pair to target
   - Find pair with smallest/largest difference
   - Two elements that meet a condition

**Key Signals:**
- "sorted array" in problem description
- "find a pair" or "find two numbers"
- "sum equals target"
- "palindrome"
- Words: "closest", "farthest", "maximum", "minimum" with pairs

> ⚡ **Why it works:** Sorted array lets you make decisions:
- Sum too small? → `left++` (increase)
- Sum too large? → `right--` (decrease)

**Template:**
```python
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1

    while left < right:
        total = arr[left] + arr[right]

        if total == target:
            return [left, right]
        elif total < target:
            left += 1
        else:
            right -= 1

    return [-1, -1]
```

**Example:**
```
Array: [1, 2, 3, 4, 6], Target: 6

left=0(1), right=4(6) → sum=7 > 6 → right--
left=0(1), right=3(4) → sum=5 < 6 → left++
left=1(2), right=3(4) → sum=6 ✓ Found!
```

---

### Pattern 2: Same Direction (Parallel)

**Setup:** Both start at beginning, move forward (different speeds)

**When to use:**

1. **In-Place Array Modification**
   - Remove duplicates from sorted array
   - Remove specific elements (zeros, values)
   - Rearrange array elements
   - Must modify **in-place** (O(1) space)
   - Examples: Remove Duplicates, Move Zeros, Remove Element

2. **Linked List - Cycle Detection**
   - Detect if linked list has a cycle
   - Find start of cycle
   - Fast pointer moves 2x speed, slow moves 1x
   - If they meet → cycle exists
   - Example: Linked List Cycle, Cycle Detection II

3. **Linked List - Position Finding**
   - Find middle of linked list
   - Find nth node from end
   - Fast pointer gets head start or moves faster
   - When fast reaches end, slow is at target
   - Examples: Middle of Linked List, Remove Nth From End

4. **Array Partitioning/Filtering**
   - Separate elements by condition (even/odd)
   - Keep elements that meet criteria
   - One pointer scans, other builds result
   - Examples: Partition Array, Squares of Sorted Array

**Key Signals:**
- "in-place" or "O(1) space" or "constant space"
- "remove duplicates"
- "move all zeros to end"
- "linked list cycle"
- "middle of linked list"
- "nth from end"
- "partition" or "separate"

> ⚡ **Why it works:**
> - `fast` → scans array
> - `slow` → tracks valid position
> - In-place, no extra space

**Template 1: In-Place Removal**
```python
def remove_duplicates(arr):
    if not arr:
        return 0

    slow = 0

    for fast in range(1, len(arr)):
        if arr[fast] != arr[slow]:
            slow += 1
            arr[slow] = arr[fast]

    return slow + 1
```

**Template 2: Fast & Slow (Linked List)**
```python
def has_cycle(head):
    slow = fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

        if slow == fast:
            return True

    return False
```

**Example:**
```
Array: [1, 1, 2, 2, 3]

fast=1: arr[1]=1 == arr[0]=1 → skip
fast=2: arr[2]=2 != arr[0]=1 → slow++, arr[1]=2
fast=3: arr[3]=2 == arr[1]=2 → skip
fast=4: arr[4]=3 != arr[1]=2 → slow++, arr[2]=3

Result: [1, 2, 3] (length=3)
```

---

## 🧭 Pattern Recognition

### Step-by-Step Recognition Process

**Step 1: Check Data Structure**
- Is it an **array/string**?
  - → Check if sorted
- Is it a **linked list**?
  - → Likely Same Direction (Fast & Slow)

**Step 2: Identify Goal**
- Finding **pairs/triplets**?
  - → Check if sorted → Opposite Direction
  - → If unsorted → Hash Map (NOT Two Pointers)
- **Modifying in-place**?
  - → Same Direction
- **Checking palindrome**?
  - → Opposite Direction
- **Cycle detection**?
  - → Same Direction (Fast & Slow)

**Step 3: Check Constraints**
- Mentions **O(1) space** or **in-place**?
  - → Same Direction
- Array is **sorted**?
  - → Likely Opposite Direction
- Need to **preserve indices**?
  - → Hash Map (NOT Two Pointers)

### Decision Flowchart

```
START: Read problem
    ↓
Is array SORTED?
    ├─ YES → Finding PAIRS/TRIPLETS?
    │         ├─ YES → OPPOSITE DIRECTION ✓
    │         └─ NO → Check next question
    │
    └─ NO → Continue below
    ↓
Says "in-place" or "O(1) space"?
    ├─ YES → SAME DIRECTION ✓
    └─ NO → Continue below
    ↓
Is it a LINKED LIST?
    ├─ Cycle/middle/nth from end?
    │   └─ YES → SAME DIRECTION (Fast & Slow) ✓
    └─ NO → Continue below
    ↓
Is it PALINDROME check?
    └─ YES → OPPOSITE DIRECTION ✓
    ↓
Finding pairs in UNSORTED array?
    └─ Use HASH MAP (NOT Two Pointers) ✗
```

### Keyword Detection Guide

| Keywords in Problem | Pattern | Reasoning |
|---------------------|---------|-----------|
| **"sorted array"** | Opposite Direction | Can make decisions based on values |
| **"find a pair", "two numbers"** | Opposite Direction (if sorted) | Looking for two elements |
| **"sum equals target"** | Opposite Direction (if sorted) | Classic pair sum problem |
| **"triplet", "3Sum", "4Sum"** | Opposite Direction | Multiple pointers from ends |
| **"palindrome", "valid palindrome"** | Opposite Direction | Compare from both ends |
| **"container", "water", "area"** | Opposite Direction | Maximize/minimize between boundaries |
| **"in-place"** | Same Direction | O(1) space requirement |
| **"O(1) space", "constant space"** | Same Direction | Can't use extra array |
| **"remove duplicates"** | Same Direction | Filter in-place |
| **"move zeros", "move elements"** | Same Direction | Rearrange in-place |
| **"linked list cycle"** | Same Direction (Fast & Slow) | Cycle detection |
| **"middle of linked list"** | Same Direction (Fast & Slow) | Position finding |
| **"nth node from end"** | Same Direction (Fast & Slow) | Position with offset |

### Red Flags (NOT Two Pointers)

| If You See... | Use Instead | Why |
|---------------|-------------|-----|
| "unsorted array" + "find pair" + "return indices" | Hash Map | Need to preserve indices |
| "count frequency" | Hash Map | Need O(1) lookup |
| "find single element" in sorted array | Binary Search | Not looking for pairs |
| "longest substring with..." | Sliding Window | Window validity checks |
| "subarray sum equals k" | Hash Map or Prefix Sum | Need cumulative sums |

---

## 🔍 Why Sorted Arrays Matter

> ⚠️ **Critical:** Opposite Direction ONLY works on sorted arrays!

**Why?**
```
Sorted [2, 7, 11, 15], target = 9
left=0(2), right=3(15) → sum=17 > 9
→ Must move right-- (decrease sum) ✓

Unsorted [7, 2, 15, 11], target = 9
left=0(7), right=3(11) → sum=18 > 9
→ Move right--? → right=2(15) → sum=22 (worse!)
→ MISSED [7, 2] pair! ✗
```

**If unsorted:**
- Can sort first? → Sort then use Two Pointers
- Can't sort (need indices)? → Use Hash Map

```python
# Hash Map for unsorted
def two_sum(arr, target):
    seen = {}
    for i, num in enumerate(arr):
        if target - num in seen:
            return [seen[target - num], i]
        seen[num] = i
```

---

## ❌ When NOT to Use Two Pointers

| Problem Type | Use Instead | Why |
|--------------|-------------|-----|
| Unsorted array + pairs | **Hash Map** | Can't make decisions without sorting |
| Single element in sorted array | **Binary Search** | Need O(log n), not looking for pairs |
| Subarray with constraints | **Sliding Window** | Need window validity checks |
| Frequency counting | **Hash Map** | Need to track occurrences |

**Quick Rule:**
- Unsorted + need indices → Hash Map
- Sorted + one element → Binary Search
- Subarray/substring → Sliding Window
- Pairs in sorted → Two Pointers ✓

---

## ⚠️ Common Mistakes

### 1. Using on Unsorted Array
```python
# ❌ WRONG
def two_sum(arr, target):  # Unsorted!
    left, right = 0, len(arr) - 1
    # This won't work - might miss the answer!

# ✅ FIX: Sort first OR use Hash Map
```

### 2. Moving Both Pointers (Opposite Direction)
```python
# ❌ WRONG
if total < target:
    left += 1
    right -= 1  # Don't move both!

# ✅ CORRECT
if total < target:
    left += 1  # Only one
elif total > target:
    right -= 1  # Only one
```

### 3. Forgetting Edge Cases
```python
# ❌ Missing check
def remove_duplicates(arr):
    slow = 0
    for fast in range(1, len(arr)):  # Crashes if empty!

# ✅ Add check
def remove_duplicates(arr):
    if not arr:
        return 0
    # ... rest of code
```

### 4. Confusing with Sliding Window
- **Two Pointers:** Find pairs, simple filtering
- **Sliding Window:** Find subarray, window validity checks

---

## 💡 Practice Problems

### Opposite Direction
| Problem | Difficulty |
|---------|-----------|
| Two Sum II (#167) | Easy |
| 3Sum (#15) | Medium |
| Container With Most Water (#11) | Medium |
| Valid Palindrome (#125) | Easy |

### Same Direction
| Problem | Difficulty |
|---------|-----------|
| Remove Duplicates (#26) | Easy |
| Move Zeros (#283) | Easy |
| Linked List Cycle (#141) | Easy |
| Middle of Linked List (#876) | Easy |

---

## 🔗 Related Patterns

### vs Sliding Window
| Two Pointers | Sliding Window |
|--------------|----------------|
| Find pairs | Find subarray/substring |
| Comparison-based | Window validity checks |
| Example: Remove Duplicates | Example: Longest Substring |

### vs Partitioning
**Sort Colors / Dutch National Flag** = Partitioning algorithm (NOT Two Pointers)
- Two Pointers → Find pairs/filter
- Partitioning → Rearrange elements with swapping

---

## 🎯 Quick Reference

> 🔥 **Pattern Recognition Shortcuts:**
>
> **Sorted + Pairs** → Opposite Direction
>
> **In-place Modify** → Same Direction
>
> **Unsorted + Pairs** → Hash Map (NOT Two Pointers)
>
> **Complexity:** O(n) time, O(1) space

---

## ✅ Mastery Checklist

Before moving to the next pattern, ensure you can:

1. Explain why sorted arrays matter
2. Write both templates from memory
3. Identify pattern in 2-3 minutes
4. Know when to use Hash Map instead
5. Solve 3 EASY problems in under 20 minutes each

---

**Master these two patterns, recognize 95% of Two Pointers problems!** 🔥
