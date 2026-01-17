"""
LeetCode #704: Binary Search
Difficulty: Easy
Time: O(log n) | Space: O(1)
"""

def binarySearch(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2  # Prevent overflow

        if nums[mid] == target:
            return mid
        elif target < nums[mid]:
            right = mid - 1
        else:
            left = mid + 1

    return -1


# Test cases
if __name__ == "__main__":
    # Test 1
    assert binarySearch([-1, 0, 3, 5, 9, 12], 9) == 4
    # Test 2
    assert binarySearch([-1, 0, 3, 5, 9, 12], 2) == -1
    # Test 3
    assert binarySearch([5], 5) == 0

    print("✓ All tests passed!")
