# Prefix Sum - Quick Guide

## What is Prefix Sum?

A **prefix sum** (or cumulative sum) is a technique where you precompute the sum of elements from the start of an array up to each index.

Given array: `[a₀, a₁, a₂, a₃, ...]`
Prefix sum: `[a₀, a₀+a₁, a₀+a₁+a₂, a₀+a₁+a₂+a₃, ...]`

## When to Use Prefix Sum

Use prefix sum when you need to:

✓ **Calculate range sums quickly** - Answer multiple queries like "sum from index i to j"
✓ **Detect subarrays with target sum** - Find subarrays that sum to a specific value
✓ **Count frequency patterns** - Track cumulative counts or frequencies
✓ **Optimize repeated calculations** - Convert O(n) range queries to O(1)

## Core Concept

**Trade space for time**: Build the prefix sum once in O(n), then answer range queries in O(1).

**Formula**: `sum(i, j) = prefix[j] - prefix[i-1]`

## Simple Example

```
Original array:     [3, 1, 4, 1, 5]
Prefix sum array:   [3, 4, 8, 9, 14]

Query: Sum from index 1 to 3?
Answer: prefix[3] - prefix[0] = 9 - 3 = 6
        (which is 1 + 4 + 1 = 6 ✓)
```

## Implementation (Python)

```python
def build_prefix_sum(arr):
    prefix_sum = []
    cumulative_sum = 0

    for i in range(len(arr)):
        cumulative_sum += arr[i]      # Add current element to running sum
        prefix_sum.append(cumulative_sum)  # Store the cumulative sum

    return prefix_sum

# Example:
arr = [3, 1, 4, 1, 5]
prefix = build_prefix_sum(arr)
print(prefix)  # Output: [3, 4, 8, 9, 14]
```

**Key Pattern**: Running sum - carry forward all previous work in one pass!

## Common Patterns

1. **Basic prefix sum** - Sum of ranges
2. **With hash map** - Subarray sum equals k
3. **2D prefix sum** - Matrix range queries
4. **XOR prefix** - XOR of ranges

---

**Time Complexity**: O(n) build, O(1) query
**Space Complexity**: O(n) for the prefix array
