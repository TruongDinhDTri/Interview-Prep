# Merge K Sorted Linked Lists - Interactive Algorithm Visualizer

## Project Overview

**Merged-K-LinkedList** (branded as "HeapMelt: Linked List Harvest") is an interactive React-based educational application that teaches the classic "Merge K Sorted Linked Lists" algorithm through immersive visualization and step-by-step execution. The project transforms a fundamental data structures problem into an engaging learning experience with an autumn harvest theme.

## Problem Statement

You are given an array of `k` linked lists, where each linked list is sorted in ascending order. Merge all the linked lists into one sorted linked list and return it.

**Example**:
```
Input: lists = [[1,4,5], [1,3,4], [2,6]]
Output: [1,1,2,3,4,4,5,6]

Explanation:
The linked-lists are:
  1 → 4 → 5
  1 → 3 → 4
  2 → 6

Merging them into one sorted list:
1 → 1 → 2 → 3 → 4 → 4 → 5 → 6
```

## Core Algorithm Concept

### The Min-Heap Strategy

The optimal solution uses a **Min-Heap** to efficiently track and extract the smallest unprocessed node across all K linked lists.

#### Why This Approach Works

**The Naive Approach (O(N*K) - Too Slow)**:
1. Look at the head of all K lists
2. Find the minimum value (requires K comparisons)
3. Add it to result
4. Move that list's pointer forward
5. Repeat N times (where N = total nodes)
6. **Time Complexity**: O(N * K) - too slow when K is large

**The Heap Approach (O(N log K) - Optimal)**:
1. Put the head of all K lists into a Min-Heap (K insertions)
2. Extract the minimum node from heap (O(log K))
3. Add it to result
4. If that node has a `.next`, push it to the heap (O(log K))
5. Repeat until heap is empty
6. **Time Complexity**: O(N log K) - much better!

#### Key Insight: The Harvest Metaphor

Think of the K sorted lists as **crop rows in a field**, each with produce arranged from smallest to largest. You have a **basket** (the heap) that can hold one item from each row. Your task is to **harvest** all crops in sorted order and load them into a **wagon** (the result list).

**The Strategy**:
1. **Initial Harvest**: Pick the first (smallest) crop from each row and put it in your basket
2. **The Cycle**:
   - Look in your basket, pick the smallest crop
   - Put it in the wagon
   - Go back to that crop's row and pick the next one (if any exists)
   - Put it in the basket
3. **Continue** until all crops are harvested

The basket (heap) ensures you always know which crop is smallest without checking all rows every time.

## Algorithm Implementation

### Python Code

```python
def mergeKLists(lists):
    import heapq

    # 1. Add the HEAD of each list to the Basket (Heap)
    heap = []
    for i, head in enumerate(lists):
        if head:
            # Store (val, list_index, node)
            heapq.heappush(heap, (head.val, i, head))

    dummy = ListNode(0)  # Dummy node to simplify result list building
    curr = dummy

    # 2. The Harvest Cycle
    while heap:
        # A. Pop the smallest node from the basket
        val, i, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next

        # B. If there is a NEXT node in that row, add it to Basket
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))

    return dummy.next  # Return the actual head (skip dummy)
```

### Step-by-Step Breakdown

#### Phase 1: Initialization
```
Lists: [1→4→5, 1→3→4, 2→6]
Pointers: All at head (index 0 of each list)

Action: Push head of each list to heap
Heap after init: [(1, 0, Node1-A), (1, 1, Node1-B), (2, 2, Node2-C)]
                  List A         List B         List C
```

#### Phase 2: The Main Loop

**Iteration 1**:
- Pop min from heap: `(1, 0, Node1-A)` from List A
- Add to result: `1`
- Check if Node1-A has `.next`: YES → Node4-A
- Push Node4-A to heap: `(4, 0, Node4-A)`
- Heap: `[(1, 1, Node1-B), (2, 2, Node2-C), (4, 0, Node4-A)]`

**Iteration 2**:
- Pop min: `(1, 1, Node1-B)` from List B
- Add to result: `1 → 1`
- Check if Node1-B has `.next`: YES → Node3-B
- Push Node3-B to heap: `(3, 1, Node3-B)`
- Heap: `[(2, 2, Node2-C), (3, 1, Node3-B), (4, 0, Node4-A)]`

**Iteration 3**:
- Pop min: `(2, 2, Node2-C)` from List C
- Add to result: `1 → 1 → 2`
- Check if Node2-C has `.next`: YES → Node6-C
- Push Node6-C to heap: `(6, 2, Node6-C)`
- Heap: `[(3, 1, Node3-B), (4, 0, Node4-A), (6, 2, Node6-C)]`

**Continue until heap is empty...**

Final result: `1 → 1 → 2 → 3 → 4 → 4 → 5 → 6`

### Time & Space Complexity

- **Time Complexity**: O(N log K)
  - N = total number of nodes across all lists
  - Each node is pushed and popped from heap exactly once
  - Each heap operation takes O(log K) time
  - Total: N * 2 * O(log K) = O(N log K)

- **Space Complexity**: O(K)
  - Heap contains at most K nodes (one from each list)
  - Result list doesn't count toward space complexity (required output)
  - O(K) for heap + O(1) for pointers = O(K)

## Application Features

### Two Main Views

#### 1. Visualizer Mode (Interactive Step-Through)

The main interactive experience that shows:

**The Field (Linked Lists Display)**:
- All K sorted linked lists displayed horizontally
- Color-coded by list (autumn colors: orange, amber, lime, rose, yellow, earth tones)
- Current pointer position highlighted for each list
- Visual indicator when checking a node's `.next` property

**The Basket (Min-Heap Visualization)**:
- Binary tree representation of the heap structure
- Color-coded nodes matching their source list
- Highlighted root (minimum element)
- Real-time updates as nodes are added/removed

**The Wagon (Result List)**:
- Growing linked list showing merged result
- Nodes appear in order as they're added
- Color preservation shows which list each node came from
- Visual arrows (→) between nodes

**Harvest Log (Execution Trace)**:
- Real-time step descriptions
- Shows current operation type (INITIAL, PUSH_TO_HEAP, POP_MIN, ADD_TO_RESULT, CHECK_NEXT, COMPLETE)
- Scrollable history of recent steps
- Current step highlighted

**Code Viewer (Synchronized Highlighting)**:
- Full Python implementation displayed
- Current line highlighted as algorithm executes
- Gruvbox Dark theme for comfortable reading
- Line numbers with visual indicators

**Interactive Controls**:
- **Play/Pause**: "Start Harvest" button with auto-play
- **Step Forward/Back**: Manual control through algorithm
- **Reset**: Return to initial state
- **New Crops**: Generate random linked lists
- **Speed Control**: Adjustable playback speed (100ms - 2000ms per step)

#### 2. Concepts Mode (Educational Content)

A dedicated learning section that explains:
- Why heaps are needed (vs. naive K-way comparison)
- How Min-Heap properties ensure O(log K) operations
- The "dummy node" technique for linked list building
- Why this is better than merge-sort approach for K lists
- Time and space complexity analysis
- Common pitfalls and edge cases

### Visual Design Philosophy

#### Autumn Harvest Theme

The application uses a warm, rustic aesthetic inspired by fall harvest seasons:

**Color Palette**:
- **Primary**: Orange (#D97706), Amber (#B45309), Rust
- **Accents**: Olive Green (#65A30D), Deep Berry, Goldenrod
- **Backgrounds**: Stone/Earth tones (#F5F5F4, #292524)
- **Highlights**: Orange-50 to Orange-600 gradients

**Visual Metaphors**:
- **Linked Lists** = Crop rows in a field
- **Heap** = Harvest basket
- **Result** = Wagon collecting the harvest
- **Algorithm** = The harvest process

**Design Elements**:
- Rounded corners for warm, organic feel
- Subtle shadows and borders
- Gruvbox Dark code theme (warm, autumn colors)
- Gradient headers and backgrounds
- Smooth transitions and fade-in animations

## Technical Implementation

### Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development
- **Styling**: Tailwind CSS with custom autumn color palette
- **Visualization**: Custom D3-inspired tree rendering for heap
- **Icons**: Lucide React (Leaf, Terminal, Layout, BookOpen, etc.)
- **State Management**: React hooks (useState, useEffect, useMemo, useRef)

### Architecture

#### Component Structure

```
App.tsx (Main container, view routing)
├── Visualizer View
│   ├── ListVisualizer.tsx (Linked lists with pointers)
│   ├── HeapTree.tsx (Binary tree Min-Heap)
│   ├── Result Display (inline)
│   ├── Execution Log (inline with ref for auto-scroll)
│   └── Code Viewer (inline with syntax highlighting)
└── Concepts View
    └── ConceptExplainer.tsx (Educational content)
```

#### Key State Variables

```typescript
const [currentView, setCurrentView] = useState<'visualizer' | 'concepts'>('visualizer');
const [rawLists, setRawLists] = useState<number[][]>(INITIAL_LISTS);
const [currentStepIndex, setCurrentStepIndex] = useState(0);
const [isPlaying, setIsPlaying] = useState(false);
const [playbackSpeed, setPlaybackSpeed] = useState(1000);

const steps: AlgorithmStep[] = useMemo(() => generateSteps(rawLists), [rawLists]);
const currentStep = steps[currentStepIndex];
```

#### Data Flow

1. **Input**: User provides or generates `rawLists` (2D array of numbers)
2. **Transformation**: `generateSteps(rawLists)` converts to `ListNode[][]` with metadata
3. **Simulation**: Algorithm runs and captures every state change as a `AlgorithmStep`
4. **Playback**: User navigates through steps, triggering re-renders of visualizations
5. **Synchronization**: Current step's state determines all visual component displays

### Data Structures

#### ListNode Interface
```typescript
interface ListNode {
  val: number;
  listIndex: number;      // Which list (0-K)
  originalIndex: number;  // Position in that list
  color: string;          // Visual color (from theme)
}
```

#### HeapNode Interface
```typescript
interface HeapNode extends ListNode {
  id: string;  // Unique identifier: "node-{listIndex}-{originalIndex}"
}
```

#### AlgorithmState Interface
```typescript
interface AlgorithmState {
  lists: ListNode[][];              // All K lists
  heap: HeapNode[];                 // Current heap state
  result: ListNode[];               // Merged result so far
  pointers: number[];               // Current index in each list
  message: string;                  // Human-readable description
  highlightedHeapIndex?: number;    // Which heap node to highlight
  highlightedListIndex?: number;    // Which list to highlight
  checkNextCandidate?: {            // Visual indicator for .next check
    listIdx: number;
    valIdx: number;
  };
}
```

#### AlgorithmStep Interface
```typescript
interface AlgorithmStep {
  state: AlgorithmState;
  type: StepType;  // INITIAL, PUSH_TO_HEAP, POP_MIN, ADD_TO_RESULT, CHECK_NEXT, COMPLETE
}

enum StepType {
  INITIAL = "INITIAL",
  PUSH_TO_HEAP = "PUSH_TO_HEAP",
  POP_MIN = "POP_MIN",
  ADD_TO_RESULT = "ADD_TO_RESULT",
  CHECK_NEXT = "CHECK_NEXT",
  COMPLETE = "COMPLETE"
}
```

### Algorithm Simulation Logic

The `generateSteps()` function in `services/algorithm.ts`:

1. **Transforms Input**: Converts number arrays to ListNode objects with metadata
2. **Initialization Phase**: Creates steps for adding each list's head to heap
3. **Main Loop**: While heap is not empty:
   - Step: Pop minimum from heap (POP_MIN)
   - Step: Add to result list (ADD_TO_RESULT)
   - Step: Check if popped node has `.next` (CHECK_NEXT)
   - Step: If yes, push next node to heap (PUSH_TO_HEAP)
4. **Completion**: Final step marking algorithm done
5. **State Cloning**: Each step gets a deep copy of state to prevent reference issues

**Critical Detail**: The heap is sorted after every operation for visualization purposes. In production code, Python's `heapq` maintains the heap property automatically.

### Code Highlighting System

The code viewer synchronizes with algorithm execution:

```typescript
const getHighlightedLines = (step: AlgorithmStep, stepIdx: number): number[] => {
  const hasStartedMainLoop = steps.slice(0, stepIdx + 1).some(s => s.type === StepType.POP_MIN);

  switch (step.type) {
    case StepType.INITIAL: return [5, 6];      // for loop setup
    case StepType.PUSH_TO_HEAP:
      return hasStartedMainLoop ? [21] : [8];  // Inside loop vs initialization
    case StepType.POP_MIN: return [16];        // heapq.heappop
    case StepType.ADD_TO_RESULT: return [17, 18]; // curr.next = node
    case StepType.CHECK_NEXT: return [20];     // if node.next:
    case StepType.COMPLETE: return [23];       // return dummy.next
    default: return [];
  }
};
```

This creates a visual connection between abstract operations and concrete code.

## Educational Value

### Learning Outcomes

After using this application, students will understand:

#### 1. Heap Data Structures
- Min-Heap properties (parent ≤ children)
- Heap operations: insert O(log K), extract-min O(log K)
- Why heaps are perfect for "find minimum among K items" problems
- Heap vs. sorted array trade-offs

#### 2. Linked List Manipulation
- The "dummy node" technique for simplifying list building
- Pointer manipulation (`curr = curr.next`)
- Checking for `null`/`None` (`.next` existence)
- Building new lists from existing nodes (no copying needed)

#### 3. Algorithm Optimization
- Why naive K-way merge is O(N*K)
- How heaps reduce K comparisons to log K
- Space-time trade-offs (O(K) space for O(N log K) time)
- When to use heaps vs. other data structures

#### 4. Problem-Solving Patterns
- Divide and conquer isn't always optimal (K-way merge-sort is O(N log K) but more complex)
- Priority queues for streaming minimum/maximum
- Merging multiple sorted sources efficiently
- Real-world applications (database query merging, external sorting)

### Pedagogical Approach

#### Visual Learning Reinforcement
- **See** the heap structure change in real-time
- **Track** pointers moving through lists
- **Watch** the result list grow node by node
- **Connect** code lines to visual changes

#### Interactive Exploration
- Generate different input sizes (3-4 lists, 3-5 nodes each)
- Step through at your own pace
- Jump back to review confusing steps
- Speed up or slow down playback

#### Conceptual Scaffolding
1. **Concepts First**: Understand the "harvest basket" metaphor
2. **Visualization**: See it work with concrete examples
3. **Code Connection**: Map operations to Python code
4. **Complexity Analysis**: Understand why it's efficient

## Use Cases

### For Students
- Visualize linked list merging for homework/assignments
- Prepare for coding interviews (Merge K Sorted Lists is a classic question)
- Debug understanding of heap operations
- Build intuition for pointer manipulation

### For Educators
- Demonstrate algorithms in lectures with live interaction
- Provide as practice tool for students
- Show complexity differences between naive and optimal solutions
- Explain "dummy node" technique visually

### For Interview Preparation
- Practice explaining the algorithm step-by-step
- Understand edge cases (empty lists, single list, K=0)
- Learn to recognize merge problems that benefit from heaps
- Build confidence through repeated visualization

### For Software Engineers
- Review fundamental algorithms for real-world problems
- Understand external sorting algorithms (used in databases)
- Learn patterns for merging multiple data streams
- Optimize multi-source data aggregation code

## Key Insights and "Aha!" Moments

### Why Not Merge Two at a Time?

**Approach**: Merge list 1 with list 2, then result with list 3, etc.

**Problem**:
- First merge: O(n₁ + n₂)
- Second merge: O(n₁ + n₂ + n₃)
- Third merge: O(n₁ + n₂ + n₃ + n₄)
- Total: O(N*K) in the worst case

**Heap Approach**: O(N log K) - much better when K is large!

### The Power of the Dummy Node

Without dummy node:
```python
if not result:
    result = node
    curr = result
else:
    curr.next = node
    curr = curr.next
```

With dummy node:
```python
dummy = ListNode(0)
curr = dummy
# ...
curr.next = node
curr = curr.next
# ...
return dummy.next
```

**Benefit**: Eliminates special case for first node, cleaner code!

### Why the Heap Never Grows Beyond K

**Key Insight**: We only add a new node when we remove one.

- Start: K nodes in heap (one from each list)
- Loop: Pop 1, push 0 or 1
  - If the popped node has `.next`, push it → heap stays size K
  - If the popped node was the last in its list, don't push → heap shrinks
- Heap size: K → K-1 → K-2 → ... → 0

**Space Complexity Guarantee**: O(K) always, never O(N)!

### The Heap Property Guarantees Correctness

**Claim**: The algorithm always picks the globally smallest unprocessed node.

**Proof**:
1. All lists are sorted (given)
2. If a node is in the heap, all nodes before it in its list have been processed
3. If a node is not in the heap, its predecessor in its list is still in the heap (or will be)
4. Min-Heap guarantees the smallest node in heap is at the root
5. Therefore, the root is the smallest unprocessed node globally

This is why the algorithm produces a sorted result!

## Real-World Applications

### Database Query Optimization
When merging results from multiple sorted indexes or shards:
```
Query: SELECT * FROM users WHERE age > 25 ORDER BY age
Shards: 3 database partitions, each with locally sorted results
Solution: Merge K sorted lists (one from each shard) into final result
```

### External Sorting (Sorting Files Bigger Than RAM)
1. Split huge file into K chunks that fit in memory
2. Sort each chunk individually (in-memory sort)
3. Write sorted chunks to disk
4. Merge K sorted files into final sorted file (using this algorithm)

### Log File Aggregation
Merging timestamped logs from multiple servers:
```
Server 1: [10:00 event A, 10:05 event B, 10:10 event C]
Server 2: [10:02 event D, 10:08 event E]
Server 3: [10:01 event F, 10:12 event G]
Result: Chronologically merged log [10:00 A, 10:01 F, 10:02 D, ...]
```

### Multi-Source Data Streams
Real-time merging of sorted sensor data:
- K sensors producing timestamped readings
- Need to process in chronological order
- Use heap to efficiently merge streams

## Project Structure

```
Merged-K-LinkedList/
├── src/
│   ├── App.tsx                      # Main application with view routing
│   ├── index.tsx                    # React entry point
│   ├── components/
│   │   ├── ListVisualizer.tsx       # Linked lists with pointers
│   │   ├── HeapTree.tsx             # Binary tree Min-Heap visualization
│   │   └── ConceptExplainer.tsx     # Educational content view
│   ├── services/
│   │   ├── algorithm.ts             # Step generation and simulation
│   │   └── geminiService.ts         # (Optional) AI integration for explanations
│   ├── types.ts                     # TypeScript interfaces
│   └── constants.ts                 # Initial data and configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Running the Project

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser

### Installation
```bash
cd "Merged-K-LinkedList"
npm install
```

### Development
```bash
npm run dev
```
Access at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## Customization and Extension Ideas

### Possible Enhancements

#### 1. Additional Algorithm Variants
- **Divide and Conquer**: Merge pairs of lists recursively
- **Sequential Merge**: Merge two at a time (show why it's slower)
- **Priority Queue with Custom Comparator**: Demonstrate flexibility

#### 2. Interactive Features
- **Custom Input**: User can enter their own linked lists
- **Step Annotations**: Add detailed explanations for each step type
- **Complexity Counter**: Show real-time operation count
- **Performance Comparison**: Side-by-side with naive approach

#### 3. Educational Content
- **Quiz Mode**: Questions after visualization
- **Challenge Mode**: "Predict next step" game
- **Code Writing**: Fill-in-the-blank coding exercises
- **Edge Cases**: Visualize empty lists, single list, duplicate values

#### 4. Visualization Improvements
- **Animated Heap Operations**: Show bubble-down/up when inserting
- **Slow-Motion Mode**: Extra slow for complex steps
- **3D Heap**: Perspective view of tree structure
- **Node History**: Trail showing where each node came from

## Advanced Topics

### Optimization: Avoid Sorting the Heap

In production code, Python's `heapq` maintains the heap property without sorting. The current implementation sorts for visualization clarity, which adds unnecessary overhead.

**Improvement**: Implement proper heap with bubble-up/bubble-down operations visually.

### Handling Node Comparison Issues

In Python 3, tuples are compared element by element. The heap stores `(val, i, node)`, but if two nodes have the same `val`, Python will compare `i` (list index), which works. If we only stored `(val, node)` and two nodes had the same value, Python would try to compare `node` objects, causing an error.

**Solution**: Always include a tie-breaker (like list index) in the tuple!

### Extending to Other Merge Problems

The same pattern applies to:
- **Merge K Sorted Arrays** (not linked lists): Return single sorted array
- **Smallest Range Covering K Lists**: Use heap to track current position in each list
- **Kth Smallest Element in K Sorted Arrays**: Stop after K pops

Understanding this visualizer unlocks solutions to an entire family of problems!

## Conclusion

**Merged-K-LinkedList (HeapMelt)** is a comprehensive educational tool that transforms an abstract algorithm into a tangible, visual, and interactive experience. By combining:

- **Engaging Theme** (autumn harvest metaphor)
- **Interactive Visualization** (synchronized views of lists, heap, result, code)
- **Step-by-Step Execution** (complete algorithm trace)
- **Educational Content** (concepts mode with explanations)
- **Real-World Context** (applications in databases, sorting, streaming)

The application helps learners build deep intuition for:
- Min-Heap data structures and their operations
- Linked list manipulation techniques (dummy nodes, pointer traversal)
- Algorithm optimization (O(N*K) → O(N log K))
- Merge patterns applicable to many problems

Whether you're preparing for technical interviews, teaching algorithms, or simply curious about how complex data structures work, HeapMelt provides an enjoyable and effective learning journey through one of computer science's classic problems.

## Related Algorithms

This merge K sorted lists problem connects to several other important algorithms:

- **Merge Sort**: The merge step is the same concept (merge 2 sorted lists)
- **External Sorting**: Merge K sorted runs from disk
- **K-Way Merge**: General pattern for combining K sorted sources
- **Priority Queue Applications**: Any "get minimum of K sources" problem
- **K Closest Points** (sibling project): Different use of heaps (Max-Heap via negation)

Mastering this visualization unlocks understanding of a fundamental algorithmic building block used throughout computer science and software engineering.
