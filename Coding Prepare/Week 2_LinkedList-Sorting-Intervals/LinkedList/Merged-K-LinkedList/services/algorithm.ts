
import { AlgorithmStep, AlgorithmState, ListNode, HeapNode, StepType } from '../types';
import { COLORS } from '../constants';

const cloneState = (state: AlgorithmState): AlgorithmState => ({
  lists: state.lists.map(l => [...l]),
  heap: [...state.heap],
  result: [...state.result],
  pointers: [...state.pointers],
  message: state.message,
  highlightedHeapIndex: state.highlightedHeapIndex,
  highlightedListIndex: state.highlightedListIndex,
  checkNextCandidate: state.checkNextCandidate ? { ...state.checkNextCandidate } : undefined,
});

export function generateSteps(rawLists: number[][]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const k = rawLists.length;
  const pointers = new Array(k).fill(0);
  
  const lists: ListNode[][] = rawLists.map((list, i) => 
    list.map((val, j) => ({
      val,
      listIndex: i,
      originalIndex: j,
      color: COLORS[i % COLORS.length]
    }))
  );

  let currentState: AlgorithmState = {
    lists: lists,
    heap: [],
    result: [],
    pointers: pointers,
    message: "The Harvest begins. We have K Linked Lists representing sorted crop rows.",
  };

  steps.push({ state: cloneState(currentState), type: StepType.INITIAL });

  // --- Initialization Phase ---
  currentState.message = "Initialization: We visit the HEAD of each Linked List and put it in our Basket.";
  
  for (let i = 0; i < k; i++) {
    if (lists[i].length > 0) {
      const node = lists[i][0];
      
      currentState.highlightedListIndex = i;
      currentState.message = `Initial Harvest: Adding HEAD of List ${String.fromCharCode(65 + i)} (val=${node.val}) to the Basket.`;
      
      const heapNode: HeapNode = { ...node, id: `node-${node.listIndex}-${node.originalIndex}` };
      currentState.heap.push(heapNode);
      
      // Sort for visualization (simulate heap)
      currentState.heap.sort((a, b) => a.val - b.val);

      currentState.pointers[i]++; 
      steps.push({ state: cloneState(currentState), type: StepType.PUSH_TO_HEAP });
    }
  }
  currentState.highlightedListIndex = undefined;

  // --- Main Loop ---
  while (currentState.heap.length > 0) {
    // 1. Pop Min
    const minNode = currentState.heap[0]; // Peak
    
    // Visualization: Highlight top of heap
    currentState.highlightedHeapIndex = 0;
    currentState.message = `Pop Min: Node (val=${minNode.val}) from List ${String.fromCharCode(65 + minNode.listIndex)} is the smallest.`;
    steps.push({ state: cloneState(currentState), type: StepType.POP_MIN });

    // Logic: Remove from heap
    currentState.heap.shift(); // Simple shift since we sort every time for vis
    currentState.heap.sort((a, b) => a.val - b.val);

    // 2. Add to Result
    currentState.highlightedHeapIndex = undefined;
    currentState.result.push(minNode);
    currentState.message = `Link Node: Attaching node (val=${minNode.val}) to 'curr.next' in our Result list.`;
    steps.push({ state: cloneState(currentState), type: StepType.ADD_TO_RESULT });

    // 3. Check Next (THE CRITICAL STEP)
    const listIdx = minNode.listIndex;
    const nextIdx = currentState.pointers[listIdx]; 
    
    currentState.highlightedListIndex = listIdx;
    currentState.checkNextCandidate = { listIdx, valIdx: nextIdx }; // Mark the specific slot we are checking
    
    if (nextIdx < lists[listIdx].length) {
      // Logic: Condition is true
      const nextVal = lists[listIdx][nextIdx].val;
      currentState.message = `Check node.next: Does List ${String.fromCharCode(65 + listIdx)} have a next node? YES. Found (val=${nextVal}).`;
      steps.push({ state: cloneState(currentState), type: StepType.CHECK_NEXT });

      // 4. Push Next
      const nextNode = lists[listIdx][nextIdx];
      const heapNode: HeapNode = { ...nextNode, id: `node-${nextNode.listIndex}-${nextNode.originalIndex}` };
      
      // Clear the "Check" highlight, now simply push
      currentState.checkNextCandidate = undefined; 
      currentState.heap.push(heapNode);
      currentState.heap.sort((a, b) => a.val - b.val); // Maintain heap invariant
      
      currentState.pointers[listIdx]++; // Move pointer officially
      currentState.message = `Push Heap: Adding node.next (val=${nextNode.val}) to the Basket.`;
      steps.push({ state: cloneState(currentState), type: StepType.PUSH_TO_HEAP });

    } else {
      // Logic: Condition is false
      currentState.message = `Check node.next: Does List ${String.fromCharCode(65 + listIdx)} have a next node? NO. Reached end (None).`;
      steps.push({ state: cloneState(currentState), type: StepType.CHECK_NEXT });
      // No push step follows
    }
    
    currentState.highlightedListIndex = undefined;
    currentState.checkNextCandidate = undefined;
  }

  currentState.message = "Complete: The Heap is empty. We return dummy.next!";
  currentState.highlightedListIndex = undefined;
  currentState.highlightedHeapIndex = undefined;
  steps.push({ state: cloneState(currentState), type: StepType.COMPLETE });

  return steps;
}
