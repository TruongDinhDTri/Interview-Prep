# ~ Create a ListNode class for singly linked list nodes
class ListNode:
    def __init__(self, value=0, next=None):
        self.value = value
        self.next = next
        
# ~ Create a single Node 
node = ListNode(5)

# Quick Create a linked list: 1 -> 2 -> 3
head = ListNode(1, ListNode(2, ListNode(3)))

# Create a LinkedList from array of values
def create_linked_list(values):
    if not values:
        return None
    head = ListNode(values[0])
    current = head
    for value in values[1:]:
        current.next = ListNode(value)
        current = current.next
    return head

# # Let's do Common Routines
head = create_linked_list([1, 2, 3, 4, 5])
def print_linked_list(head):
    current = head
    while current:
        print(current.value)
        current = current.next
        
## 1. Couting the number of nodes in a linked list
def cound_nodes(head):
    count = 0
    current = head
    while current:
        count += 1
        current = current.next
    return count

##  2. Reversing a linked list in-place
def reverse_linked_list(head):
    prev = None
    current = head
    while current:
        next_node = current.next
        current.next = prev
        # move everything one step forward
        prev = current
        current = next_node
    return prev  # New head of the reversed list

## 3. Finding the middle node of a linked list using faslt and slow pointer technique
def find_middle_node(head):
    slow = head
    fast = head
    # if head hit the end of the list, slow is at the middle
    while fast and fast.next: # which means fast is not None and fast.next is not None
        slow = slow.next
        fast = fast.next.next
    return slow

## 4. Merged two linked lists together
def merged_two_sorted_lists(l1, l2):
    dummy = ListNode(0)
    current = dummy
    while l1 and l2:
        if l1.value < l2.value:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
    
    if l1:
        current.next = l1
    if l2:
        current.next = l2
    return dummy.next

## 5. Delete a node in a linked list has value = val
def delete_node(head, val):
    dummy = ListNode(0)
    current.next = head
    current = dummy
    
    while current.next:
        if current.next.value == val:
            # skip the values
            current.next = current.next.next
            break
        # if not found, move forward
        current = current.next
    return dummy.next
        
### 6. Getting the nth node from the end of a linked list using 2 pointers
def get_nth_from_end(head, n):
    first = head
    second = head
    # Move the first pointer n steps ahead
    for _ in range(n):
        if first is None:
            return None  # n is larger than the length of the list
        first = first.next
    # Move 2 pointer simultaneously until first hits the end
    while first:
        first = first.next
        second = second.next
    return second  # second is now the nth node from the end

## 7. Dêtect a cycle in a linked list using Floyd's Tortoise and Hare algorithm
def has_cycle(head):
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True  # Cycle detected
    return False  # No cycle
