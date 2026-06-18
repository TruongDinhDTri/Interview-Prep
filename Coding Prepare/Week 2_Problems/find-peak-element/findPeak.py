"""
LeetCode #162: Find Peak Element
Difficulty: Medium
Time: O(log n) | Space: O(1)
"""

def findPeakElement(nums):
    """
    Key insight: Luôn đi về phía CAO hơn
    Khi left == right → Đó là peak!
    """
    if len(nums) == 1:
        return 0

    left, right = 0, len(nums) - 1

    while left < right:
        mid = left + (right - left) // 2

        if nums[mid] < nums[mid + 1]:
            # Bên phải cao hơn → Đi phải
            # Loại bỏ bên trái (bỏ mid vì nó thấp hơn)
            left = mid + 1
        else:
            # Bên trái cao hơn hoặc bằng → Đi trái
            # GIỮ mid vì nó có thể là peak
            right = mid

    # Khi left == right → Đó là peak!
    return left


# Test cases
if __name__ == "__main__":
    # Test 1
    assert findPeakElement([1, 2, 3, 1]) == 2
    # Test 2
    result2 = findPeakElement([1, 2, 1, 3, 5, 6, 4])
    assert result2 in [1, 5]  # Có thể là 1 hoặc 5
    # Test 3
    assert findPeakElement([1]) == 0
    # Test 4 - Ascending
    assert findPeakElement([1, 2, 3, 4, 5]) == 4
    # Test 5 - Descending
    assert findPeakElement([5, 4, 3, 2, 1]) == 0

    print("✓ All tests passed!")
