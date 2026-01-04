
export interface ListNode {
  val: number;
  listIndex: number; // Which of the K lists this came from
  originalIndex: number; // Original position in that list
  color: string;
}

export interface HeapNode extends ListNode {
  id: string; // Unique ID for D3/React keys
}

export interface AlgorithmState {
  lists: (ListNode | null)[][]; // The K lists
  heap: HeapNode[]; // The current state of the min-heap
  result: ListNode[]; // The growing merged list
  pointers: number[]; // Index of the next element to consider for each list
  message: string; // Description of the current step
  highlightedHeapIndex?: number; // For visualizing comparisons
  highlightedListIndex?: number; // For visualizing extracting from list
  checkNextCandidate?: { listIdx: number, valIdx: number }; // Specific highlighting for the "If Check" step
}

export enum StepType {
  INITIAL = 'INITIAL',
  PUSH_TO_HEAP = 'PUSH_TO_HEAP',
  POP_MIN = 'POP_MIN',
  ADD_TO_RESULT = 'ADD_TO_RESULT',
  CHECK_NEXT = 'CHECK_NEXT',
  COMPLETE = 'COMPLETE'
}

export interface AlgorithmStep {
  state: AlgorithmState;
  type: StepType;
}
