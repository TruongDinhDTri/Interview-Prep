# Sliding Window Pattern - Complete Guide

> 💡 **Core Idea:** Maintain a window over data that expands/contracts based on validity conditions. Optimize O(n²) → O(n) for subarray/substring problems.

---

## 🎯 When to Use Sliding Window

### Quick Check

✅ Looking for **contiguous** subarray/substring
✅ Need **longest/shortest/maximum/minimum** subarray
✅ Window has **validity conditions**
✅ O(n) time with single pass

### Problem Indicators

| Problem Type | Use Sliding Window? |
|--------------|-------------------|
| **Longest** substring with K distinct chars | ✅ YES (Variable) |
| **Maximum** sum subarray of size K | ✅ YES (Fixed) |
| **Shortest** subarray with sum ≥ target | ✅ YES (Variable) |
| Substring with **all characters** | ✅ YES (Variable) |
| Non-contiguous subsequence | ❌ NO (DP or Two Pointers) |
| Finding pairs that sum to target | ❌ NO (Two Pointers) |
| Single element search | ❌ NO (Binary Search) |

---

## 🔥 The Two Core Patterns

### Pattern 1: Fixed-Size Window

**Setup:** Window size K is constant throughout

**When to use:**

1. **Fixed Window Size Given**
   - "maximum sum of K consecutive elements"
   - "average of all subarrays of size K"
   - Problem explicitly states window size
   - Need to compare all K-sized windows
   - Examples: Max Sum of K Consecutive, Moving Average

2. **Template Structure**
   - Add element at right
   - Maintain window size exactly K
   - Remove element at left when size > K
   - Update result for each valid window

**Key Signals:**
- "size K", "K consecutive", "K elements"
- "all subarrays of length K"
- "fixed length"
- Usually simpler than variable window

> ⚡ **Why it works:**
> - Slide window right by 1
> - Add new element, remove leftmost
> - Reuse previous calculation: `sum = sum - arr[left] + arr[right]`
> - No need to recalculate entire window!

**Template:**
```python
def max_sum_k_consecutive(arr, k):
    if len(arr) < k:
        return -1

    # Build first window
    window_sum = sum(arr[:k])
    max_sum = window_sum

    # Slide window
    for right in range(k, len(arr)):
        window_sum = window_sum - arr[right - k] + arr[right]
        max_sum = max(max_sum, window_sum)

    return max_sum
```

**Example:**
```
Array: [2, 1, 5, 1, 3, 2], K=3

Window [2,1,5]: sum=8, max=8
Window [1,5,1]: sum=8-2+1=7, max=8
Window [5,1,3]: sum=7-1+3=9, max=9 ✓
Window [1,3,2]: sum=9-5+2=6, max=9
```

---

### Pattern 2: Variable-Size Window

**Setup:** Window expands/contracts based on validity condition

**When to use:**

1. **Longest/Shortest Subarray Problems**
   - "longest substring with at most K distinct characters"
   - "shortest subarray with sum ≥ target"
   - "longest substring without repeating characters"
   - Window size changes to meet condition
   - Examples: Longest Substring K Distinct, Minimum Size Subarray Sum

2. **Character/Element Frequency Constraints**
   - "substring containing all characters of pattern"
   - "longest substring with at most 2 distinct"
   - Need hash map to track frequencies
   - Examples: Minimum Window Substring, Longest Repeating Character

3. **Condition-Based Windows**
   - Window valid when condition met
   - Expand: add elements until invalid
   - Shrink: remove elements until valid again
   - Track best window during valid states

**Key Signals:**
- "longest substring/subarray"
- "shortest subarray"
- "maximum/minimum length"
- "at most K", "at least K"
- "containing all", "without repeating"
- "distinct characters/elements"

> ⚡ **Why it works:**
> - **Expand:** Add right element, check if valid
> - **Shrink:** Remove left elements while condition violated
> - **Track:** Update result when window is valid
> - One pass through array = O(n)

**Template 1: Longest Valid Window**
```python
def longest_window(arr):
    left = 0
    max_length = 0
    # tracking structure (hash map, set, counter, etc.)
    window_data = {}

    for right in range(len(arr)):
        # Add arr[right] to window
        # Update window_data

        # Shrink window while INVALID
        while window_is_invalid(window_data):
            # Remove arr[left] from window
            # Update window_data
            left += 1

        # Update result (window is valid here)
        max_length = max(max_length, right - left + 1)

    return max_length
```

**Template 2: Shortest Valid Window**
```python
def shortest_window(arr, target):
    left = 0
    min_length = float('inf')
    window_data = {}

    for right in range(len(arr)):
        # Add arr[right] to window
        # Update window_data

        # Shrink window while VALID (minimize)
        while window_is_valid(window_data):
            # Update result BEFORE shrinking
            min_length = min(min_length, right - left + 1)

            # Remove arr[left] from window
            # Update window_data
            left += 1

    return min_length if min_length != float('inf') else 0
```

**Example: Longest Substring with K Distinct**
```
String: "araaci", K=2
freq = {}

right=0 'a': freq={'a':1}, valid(1≤2), max=1
right=1 'r': freq={'a':1,'r':1}, valid(2≤2), max=2
right=2 'a': freq={'a':2,'r':1}, valid(2≤2), max=3
right=3 'a': freq={'a':3,'r':1}, valid(2≤2), max=4
right=4 'c': freq={'a':3,'r':1,'c':1}, INVALID(3>2)!
  Shrink: left=0, remove 'a': freq={'a':2,'r':1,'c':1}, still invalid
  Shrink: left=1, remove 'r': freq={'a':2,'c':1}, valid! max=4
right=5 'i': freq={'a':2,'c':1,'i':1}, invalid(3>2)
  Shrink until valid...

Max length = 4 ("raaa")
```

---

## 🧭 Pattern Recognition

### Step-by-Step Recognition Process

**Step 1: Check Problem Type**
- Looking for **subarray/substring**?
  - → YES, continue
  - → NO, not Sliding Window
- Must be **contiguous**?
  - → YES, continue
  - → NO, use DP or other pattern

**Step 2: Identify Window Type**
- Window size **given explicitly**?
  - → Fixed-Size Window
- Window size **varies** (longest/shortest)?
  - → Variable-Size Window

**Step 3: Check Goal**
- **Longest** valid subarray?
  - → Variable Window, shrink when INVALID
- **Shortest** valid subarray?
  - → Variable Window, shrink when VALID
- **All subarrays of size K**?
  - → Fixed Window

**Step 4: Identify Validity Condition**
- Sum-based? (sum = K, sum ≥ K)
  - → Track running sum
- Frequency-based? (K distinct, no repeats)
  - → Use hash map for frequencies
- Count-based? (all characters present)
  - → Use hash map and counter

### Decision Flowchart

```
START: Read problem
    ↓
Looking for SUBARRAY/SUBSTRING?
    ├─ NO → Not Sliding Window ✗
    └─ YES ↓
    ↓
Must be CONTIGUOUS?
    ├─ NO → Use DP/Two Pointers ✗
    └─ YES ↓
    ↓
Window size FIXED (given K)?
    ├─ YES → FIXED-SIZE WINDOW ✓
    └─ NO ↓
    ↓
Says "LONGEST" / "MAXIMUM LENGTH"?
    └─ YES → VARIABLE WINDOW (shrink when invalid) ✓
    ↓
Says "SHORTEST" / "MINIMUM LENGTH"?
    └─ YES → VARIABLE WINDOW (shrink when valid) ✓
    ↓
Says "ALL SUBARRAYS" without size?
    └─ NOT Sliding Window (use brute force or DP) ✗
```

### Keyword Detection Guide

| Keywords in Problem | Pattern | What to Track |
|---------------------|---------|---------------|
| **"K consecutive elements"** | Fixed Window | Sum/Max/Min in window |
| **"size K", "length K"** | Fixed Window | Window metrics |
| **"longest substring"** | Variable (Longest) | Hash map for validity |
| **"maximum length subarray"** | Variable (Longest) | Validity condition |
| **"shortest subarray"** | Variable (Shortest) | Condition + minimize |
| **"minimum window"** | Variable (Shortest) | All required elements |
| **"at most K distinct"** | Variable (Longest) | Hash map of frequencies |
| **"without repeating"** | Variable (Longest) | Set or hash map |
| **"contains all"** | Variable (Shortest) | Hash map of required chars |
| **"sum equals/≥ K"** | Variable | Running sum |

### Red Flags (NOT Sliding Window)

| If You See... | Use Instead | Why |
|---------------|-------------|-----|
| "non-contiguous" | DP or Greedy | Can skip elements |
| "find a pair" | Two Pointers | Not about subarrays |
| "maximum/minimum element" (single) | Binary Search or Heap | Not subarray problem |
| "all possible subarrays" without optimization | Brute Force → O(n²) | Can't optimize with window |
| "palindrome substring" | DP or Expand Around Center | Different pattern |

---

## 🔍 The Validity Condition

> ⚠️ **Critical:** Variable window success depends on defining "valid"!

### Common Validity Conditions

**1. Sum-Based**
```python
# Sum exactly K
is_valid = (window_sum == k)

# Sum at least K
is_valid = (window_sum >= k)
```

**2. Frequency-Based**
```python
# At most K distinct characters
is_valid = (len(freq_map) <= k)

# No repeating characters
is_valid = (all(count <= 1 for count in freq_map.values()))

# Exactly K distinct
is_valid = (len(freq_map) == k)
```

**3. Contains All Required Elements**
```python
# All characters of pattern present
is_valid = (matched_count == required_count)

# Example: pattern "ABC"
required = {'A': 1, 'B': 1, 'C': 1}
is_valid = all(window[c] >= required[c] for c in required)
```

### Validity Patterns

| Goal | Validity Check | Shrink When |
|------|----------------|-------------|
| Longest with ≤K distinct | `len(freq) <= K` | `len(freq) > K` (INVALID) |
| Shortest with sum ≥ target | `sum >= target` | `sum >= target` (VALID) |
| Longest without repeats | `no duplicates` | `has duplicate` (INVALID) |
| Minimum window with all chars | `has all required` | `has all required` (VALID) |

---

## 🎨 Window Management Techniques

### Technique 1: Hash Map for Frequencies

**Use when:** Tracking character/element frequencies

```python
def longest_k_distinct(s, k):
    left = 0
    max_len = 0
    freq = {}  # char → count

    for right in range(len(s)):
        # Add right character
        char = s[right]
        freq[char] = freq.get(char, 0) + 1

        # Shrink if invalid (more than K distinct)
        while len(freq) > k:
            left_char = s[left]
            freq[left_char] -= 1
            if freq[left_char] == 0:
                del freq[left_char]  # Important: remove when count = 0
            left += 1

        max_len = max(max_len, right - left + 1)

    return max_len
```

### Technique 2: Counter for Required Elements

**Use when:** Window must contain all of specific elements

```python
def min_window_with_all_chars(s, pattern):
    if not s or not pattern:
        return ""

    required = {}
    for char in pattern:
        required[char] = required.get(char, 0) + 1

    required_count = len(required)  # Number of unique chars needed
    formed = 0  # Number of unique chars in window with correct frequency

    window_counts = {}
    left = 0
    min_len = float('inf')
    min_window = ""

    for right in range(len(s)):
        char = s[right]
        window_counts[char] = window_counts.get(char, 0) + 1

        # Check if this char frequency matches requirement
        if char in required and window_counts[char] == required[char]:
            formed += 1

        # Try to shrink when valid
        while formed == required_count:
            # Update result
            if right - left + 1 < min_len:
                min_len = right - left + 1
                min_window = s[left:right + 1]

            # Shrink from left
            left_char = s[left]
            window_counts[left_char] -= 1
            if left_char in required and window_counts[left_char] < required[left_char]:
                formed -= 1
            left += 1

    return min_window
```

### Technique 3: Simple Counter/Sum

**Use when:** Tracking simple metrics (sum, count)

```python
def max_ones_after_k_flips(arr, k):
    left = 0
    max_len = 0
    zero_count = 0  # Number of zeros in current window

    for right in range(len(arr)):
        if arr[right] == 0:
            zero_count += 1

        # Shrink if we have more than K zeros
        while zero_count > k:
            if arr[left] == 0:
                zero_count -= 1
            left += 1

        max_len = max(max_len, right - left + 1)

    return max_len
```

---

## ⚠️ Common Mistakes

### 1. Forgetting to Update Window Data When Shrinking

```python
# ❌ WRONG
while len(freq) > k:
    left += 1  # Forgot to remove s[left] from freq!

# ✅ CORRECT
while len(freq) > k:
    left_char = s[left]
    freq[left_char] -= 1
    if freq[left_char] == 0:
        del freq[left_char]
    left += 1
```

### 2. Updating Result at Wrong Time

```python
# For SHORTEST window:

# ❌ WRONG - updates after shrinking
while is_valid:
    left += 1
    min_len = min(min_len, right - left + 1)  # Window already shrunk!

# ✅ CORRECT - updates BEFORE shrinking
while is_valid:
    min_len = min(min_len, right - left + 1)  # Capture current valid window
    left += 1
```

### 3. Confusing Fixed vs Variable Window

```python
# Fixed window (size K):
for right in range(k, n):
    # Add right, remove (right-k)

# Variable window:
for right in range(n):
    # Add right
    while invalid:
        # Remove left
        left += 1
```

### 4. Not Handling Edge Cases

```python
# ❌ Missing checks
def max_sum_k(arr, k):
    window_sum = sum(arr[:k])  # Crashes if len(arr) < k!

# ✅ Add validation
def max_sum_k(arr, k):
    if len(arr) < k:
        return -1  # or 0, or raise error
    window_sum = sum(arr[:k])
```

### 5. Infinite Loop in While Condition

```python
# ❌ WRONG - condition never changes!
while zero_count > k:
    # ... but never decrease zero_count
    left += 1

# ✅ CORRECT
while zero_count > k:
    if arr[left] == 0:
        zero_count -= 1  # Actually update the condition variable
    left += 1
```

### 6. Using Sliding Window for Non-Contiguous Problems

```python
# Problem: "Longest increasing subsequence"
# Subsequence can SKIP elements → NOT contiguous
# ❌ Don't use Sliding Window
# ✅ Use Dynamic Programming
```

---

## 💡 Advanced Patterns

### Pattern: At Most K → Exactly K

**Trick:** `exactly(K) = atMost(K) - atMost(K-1)`

```python
def exactly_k_distinct(s, k):
    return at_most_k_distinct(s, k) - at_most_k_distinct(s, k - 1)

def at_most_k_distinct(s, k):
    left = 0
    max_len = 0
    freq = {}

    for right in range(len(s)):
        freq[s[right]] = freq.get(s[right], 0) + 1

        while len(freq) > k:
            freq[s[left]] -= 1
            if freq[s[left]] == 0:
                del freq[s[left]]
            left += 1

        max_len = max(max_len, right - left + 1)

    return max_len
```

### Pattern: Longest with Constraint

**Generic Template:**
```python
def longest_with_constraint(arr):
    left = 0
    max_len = 0
    # tracking variables

    for right in range(len(arr)):
        # Add arr[right], update tracking

        # Shrink while constraint violated
        while constraint_violated():
            # Remove arr[left], update tracking
            left += 1

        # Valid window: update result
        max_len = max(max_len, right - left + 1)

    return max_len
```

### Pattern: Shortest with Constraint

**Generic Template:**
```python
def shortest_with_constraint(arr):
    left = 0
    min_len = float('inf')
    # tracking variables

    for right in range(len(arr)):
        # Add arr[right], update tracking

        # Shrink while constraint satisfied
        while constraint_satisfied():
            # Update result BEFORE shrinking
            min_len = min(min_len, right - left + 1)
            # Remove arr[left], update tracking
            left += 1

    return min_len if min_len != float('inf') else 0
```

---

## 🎯 Practice Problems

### Fixed-Size Window
| Problem | Difficulty | Key Concept |
|---------|-----------|-------------|
| Maximum Sum Subarray of Size K | Easy | Basic sliding sum |
| Average of All Subarrays of Size K | Easy | Calculate average |
| Maximum of All Subarrays of Size K | Medium | Use deque for max |

### Variable-Size Window - Longest
| Problem | Difficulty | Key Concept |
|---------|-----------|-------------|
| Longest Substring Without Repeating Chars (#3) | Medium | Set/hash map for duplicates |
| Longest Substring with K Distinct Chars | Medium | Hash map frequency |
| Longest Repeating Character Replacement (#424) | Medium | Track max frequency |
| Max Consecutive Ones III (#1004) | Medium | Count zeros in window |

### Variable-Size Window - Shortest
| Problem | Difficulty | Key Concept |
|---------|-----------|-------------|
| Minimum Size Subarray Sum (#209) | Medium | Shrink when sum ≥ target |
| Minimum Window Substring (#76) | Hard | Track all required chars |
| Smallest Subarray with Sum ≥ K | Medium | Running sum |

### Advanced
| Problem | Difficulty | Key Concept |
|---------|-----------|-------------|
| Permutation in String (#567) | Medium | Match frequency map |
| Find All Anagrams in String (#438) | Medium | Fixed window + frequency |
| Longest Substring with At Most 2 Distinct Chars | Medium | At most K pattern |
| Subarrays with K Different Integers (#992) | Hard | Exactly K = atMost(K) - atMost(K-1) |

---

## 🔗 Related Patterns

### vs Two Pointers
| Sliding Window | Two Pointers |
|----------------|--------------|
| Finds subarrays/substrings | Finds pairs/elements |
| Window expands/contracts | Pointers converge or parallel |
| Validity conditions | Comparison-based |
| Example: Longest Substring K Distinct | Example: Two Sum Sorted |
| Often uses hash map | Usually doesn't need extra space |

**When to choose:**
- Contiguous subarray → **Sliding Window**
- Pairs in sorted array → **Two Pointers**

### vs Dynamic Programming
| Sliding Window | Dynamic Programming |
|----------------|---------------------|
| Contiguous subarrays | Can be non-contiguous |
| O(n) time | Often O(n²) or more |
| Single pass | Multiple subproblems |
| Example: Max Sum Size K | Example: Longest Increasing Subsequence |

**When to choose:**
- Can skip elements → **DP**
- Must be contiguous → **Sliding Window**

### vs Prefix Sum
| Sliding Window | Prefix Sum |
|----------------|------------|
| Dynamic window size | Precompute cumulative sums |
| Good for max/min length | Good for range sum queries |
| Example: Shortest Subarray Sum ≥ K | Example: Subarray Sum Equals K |

**When to choose:**
- Finding subarray with exact sum → **Prefix Sum + Hash Map**
- Finding longest/shortest with constraint → **Sliding Window**

---

## 🎯 Quick Reference

> 🔥 **Pattern Recognition Shortcuts:**
>
> **Fixed Size K** → Fixed-Size Window (simple)
>
> **Longest/Maximum subarray** → Variable Window (shrink when invalid)
>
> **Shortest/Minimum subarray** → Variable Window (shrink when valid)
>
> **Non-contiguous** → NOT Sliding Window (use DP)
>
> **Complexity:** O(n) time, O(k) space (k = window tracking)

### Template Selection Guide

```
Is window size FIXED (given K)?
    └─ Use: Fixed-size template

Looking for LONGEST valid window?
    └─ Use: Variable template (shrink while INVALID)

Looking for SHORTEST valid window?
    └─ Use: Variable template (shrink while VALID, update BEFORE shrinking)
```

---

## ✅ Mastery Checklist

Before moving to the next pattern, ensure you can:

1. **Identify** window type (fixed vs variable) in 30 seconds
2. **Write** both templates from memory
3. **Define** validity condition for any problem
4. **Explain** when to use hash map vs simple counter
5. **Know** when NOT to use sliding window (non-contiguous, pairs)
6. **Solve** 3 EASY problems in under 15 minutes each
7. **Solve** 2 MEDIUM problems in under 25 minutes each
8. **Distinguish** between Sliding Window and Two Pointers instantly

---

## 🧠 Mental Model

**Think of it like this:**
```
Fixed Window = Train car moving on tracks
    🚃🚃🚃────────
    Always same length, slides right

Variable Window = Accordion
    🎵═══🎵 → 🎵════════🎵 → 🎵═🎵
    Expands/contracts based on music (validity)
```

**Decision Framework:**
1. **Contiguous?** → Consider Sliding Window
2. **Window size given?** → Fixed-size
3. **Longest/Shortest?** → Variable-size
4. **What makes it valid?** → Define condition
5. **What to track?** → Choose data structure

---

**Master these patterns, solve 90% of subarray problems in one pass!** 🔥
