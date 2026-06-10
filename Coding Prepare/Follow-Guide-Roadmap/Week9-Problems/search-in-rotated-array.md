# STEP 1: Understand

#### Paraphase:

Well I'm given a sorted nums array. nums will be rotated at an unknow index k (1<=k < nums.length). Given the nums array after rotated and the target interget. Return the index of target if it is in the nums. -1 if it's not in the nums

#### Clarifying Questions

1. is the input sorted ?
2. Can values be negative ? Floating, Zero ?
3. Can there be duplicate ?
4. Can the input be empty or null ?
5. Can I modify the input array ?
6. How is the input sorted ?
7. What is the input expected size ?
8. What should I return ?
9. Is there only 1 valid answer ?

#### Strip the story

> Given a sorted array which is rotated at an unknow index k. Given an interger `target`, return the index of `target` if present, return `-1` if none

#### Trace the example

[4,5,6,7,0,1,2] target = 0

Usually in Binary Search we happend to be in sorted array. Which this would have 2 sorted array. We can find in these, something like

mid = 3 => 7

Let's say we know 7 is in the left half sorted array => how that's the key

🌟***Open Question: How to know if mid is in left or right portion***

1. mid is left portion => 2 case
   1. nums[left] <= target <= mid => in left portion
   2. target < nums[left] or target > mid => right portion
2. mid is in right portion => 2 case
   1. mid <= target <= nums[right] => right portion
   2. target > nums[right] or target < mid => left portion

So mid = 3 => 7 

0 < nums[left] = 4 => right portion 

=> left = mid + 1

Continue looping

mid = 5 => 1

mid < left => right portion

2.1 target < mid => left => right = mid -1 

[0,1] => 1 more round and found 0



#### STEP 2: Approach

##### 1. Does the abstract shape match a pattern signature

A: Well to me the abstract shape kinda look like we can use BInary Search on 2 halve of the array because we can still have 2 sorted array 

##### 2. Can I name a pattern and explain why it applies

A: I think it's Binary Search because Binary Search will bebased on the middle to move. We can identifed the left or right portion than we can use Binary Search on that portion with some addtional rules. For jumping over another sorted halves 

> I see `sorted array + based on middle to move + eliminate half of search space based on middle` which tell me Binary Search because I can make use of those 2 sorted array and condition to jump over another array. Than basedon the middle number and filter in that sorted half

##### 3. Have I solved somethign like this

A: Yes I have solve this exact problems but a long moment ago



#### STEP 4P: Reason

##### 1. Brute force and why it is bad

A: We can loop through the array and find the element. but that' On. The problem said "must right an alogirhtm with O(logn)"

##### 2. What does this pattern do instead ? 

A: We can use Binary Search to search in 2 half sorted and find the element with addition jumping rules

##### 3. What rule keeps it valid (invarant)

A: < I DON'T KNOW> 


#### STEP 3: Discuss

1. Name the approach:
   I will Identified the `portion` using the left and middle. Because when we rotated we also have 2 sorted array. If mid is bigger than left => we in left portion. Than we will applied those rules in the example trace to this problem
2. Walk through step

   1. Initialize the left, right pointer
   2. Initliaze the while loop with condition is left <= right (for edge case as [1])
   3. while left <= right
   4. Identified the portion using condition nums[left] <= nums[mid]
   5. Using this rules
   6. Calcuate the mid
   7. Idenfitied if mid is what we need to find => if yes => return
   8. Else using these rules

   * mid is left portion => 2 case
     1. nums[left] <= target <= mid => in left portion
     2. target < nums[left] or target > mid => right portion
   * mid is in right portion => 2 case
     1. mid <= target <= nums[right] => right portion
     2. target > nums[right] or target < mid => left portion

    9. Else return -1

3. Time: O(logn) since it's Binary Search, Space: O(1) since we use no extra space. left, right is constant we don't count
4. Shalle I motherfucking code this motherbitching ass hairy pussy little punky stinky hoes up ?


Here is the blueprint 

```
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        # Intialize left, right
    
        # Initilaize the loop while left <= right
        # Calcuate if the current mid is what we need => yes => return
        # If not
        # Calcuate the POTION SIDE
        # If left potion
        #   nums[left] <= target < nums[mid] => stay in left => right = mid - 1 (why not target <= nums[mid]) when we came down here we are sure mid is not what we need already 
        #   2 case left: target < nums[left] or target > mid => right portion => left = mid + 1


        # If right portion 
        #  nums[mid] < target <= nums[right] => right portion=> left = mid + 1
        # 2 case left: target > nums[right] or target < mid => left portion => right = mid -1 

        # if out of loop and CAN'T return the index => return -1
```



Final code: 

```

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        # Intialize left, right
        left, right = 0, len(nums) - 1
        # Initilaize the loop while left <= right
        while left <= right: 
            mid = (left + right) // 2
        # Calcuate if the current mid is what we need => yes => return
            if nums[mid] == target: 
                return mid
  
        # If not
        # Calcuate the POTION SIDE
        # If left potion
            if nums[left] <= nums[mid]:
        #   nums[left] <= target < nums[mid] => stay in left => right = mid - 1 (why not target <= nums[mid]) when we came down here we are sure mid is not what we need already 
                if nums[left] <= target < nums[mid]:
                    right = mid - 1
        #   2 case left: target < nums[left] or target > mid => right portion => left = mid + 1
                else: 
                    left = mid + 1

  
        # If right portion 
            else:
        #  nums[mid] < target <= nums[right] => right portion=> left = mid + 1
                if nums[mid] < target <= nums[right]:
                    left = mid + 1
        # 2 case left: target > nums[right] or target < mid => left portion => right = mid -1 
                else:
                    right = mid - 1


        # if out of loop and CAN'T return the index => return -1
        return -1




```

#### STEP 5: VERIFY

Trace: 

[4,5,6,7,0,1,2]

#1. mid = 3 => 7 => not target => jump to portion, nums[left] = 4 < nums[mid] = 7 => left portion. => target < nums[left] => right portion => left = mid + 1 => end of #1 :{left: 4, right: 6}


#2. mid = 5 => not target => jump to portion nums[left] = 0 < nums[mid] = 1 => consider left portion => target < nums[mid] and target ?= nums[left] => right = mid -1 => mid = 4 


#3. Found mid return index 4



The decided left or right portion just happend at the first time. Second time is consider the same right ? becauase when you're already in a sorted increasing portion. It's acting the same as left portion


#### step 6: OPTIMZEW

Follor because searching with Ologn is floor
