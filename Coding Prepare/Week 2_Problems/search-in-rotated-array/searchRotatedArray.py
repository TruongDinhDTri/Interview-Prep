def search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2
        
        # Check immediately
        if nums[mid] == target:
            return mid

        # 1. Determine if we are in the Left Sorted portion
        if nums[left] <= nums[mid]: 
            # Target is within this sorted left portion
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # 2. Otherwise, we are in the Right Sorted portion
        else: 
            # Target is within this sorted right portion
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1 
                
    return -1
