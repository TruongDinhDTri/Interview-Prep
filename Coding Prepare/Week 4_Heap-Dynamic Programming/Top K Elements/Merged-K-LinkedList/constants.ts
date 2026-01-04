
// Autumn / Harvest Theme
export const COLORS = [
  "#D97706", // Amber (Pumpkin)
  "#B45309", // Rust
  "#65A30D", // Olive Green
  "#BE185D", // Deep Berry
  "#A16207", // Goldenrod
  "#7C2D12", // Deep Earth
];

export const LIST_BG_COLORS = [
  "bg-orange-50 border-orange-200",
  "bg-amber-50 border-amber-200",
  "bg-lime-50 border-lime-200",
  "bg-rose-50 border-rose-200",
  "bg-yellow-50 border-yellow-200",
  "bg-stone-100 border-stone-200",
];

export const INITIAL_LISTS = [
  [1, 4, 5],
  [1, 3, 4],
  [2, 6]
];

export const GEMINI_MODEL_NAME = "gemini-2.5-flash";

export const PYTHON_CODE = `def mergeKLists(lists):
    import heapq
    
    # 1. Add the HEAD of each list to the Basket
    heap = []
    for i, head in enumerate(lists):
        if head:
            # Store (val, list_index, node)
            heapq.heappush(heap, (head.val, i, head))
            
    dummy = ListNode(0)
    curr = dummy
    
    # 2. The Cycle
    while heap:
        # A. Pop the smallest node
        val, i, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        
        # B. If there is a NEXT node, add it to Basket
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
            
    return dummy.next`;
