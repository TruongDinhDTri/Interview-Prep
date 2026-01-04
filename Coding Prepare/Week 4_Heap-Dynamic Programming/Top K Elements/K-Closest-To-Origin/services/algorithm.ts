import { Point, HeapNode, SimulationStep } from '../types';
import { CODE_LINES, K_VALUE } from '../constants';

// A simple Min-Heap implementation for the simulation
// Stores {val, point, id}
// Comparison is based on 'val'
const pushHeap = (heap: HeapNode[], node: HeapNode) => {
    heap.push(node);
    bubbleUp(heap, heap.length - 1);
};

const popHeap = (heap: HeapNode[]): HeapNode | undefined => {
    if (heap.length === 0) return undefined;
    const top = heap[0];
    const bottom = heap.pop();
    if (heap.length > 0 && bottom) {
        heap[0] = bottom;
        bubbleDown(heap, 0);
    }
    return top;
};

const bubbleUp = (heap: HeapNode[], index: number) => {
    while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        if (heap[index].val < heap[parentIndex].val) {
            [heap[index], heap[parentIndex]] = [heap[parentIndex], heap[index]];
            index = parentIndex;
        } else {
            break;
        }
    }
};

const bubbleDown = (heap: HeapNode[], index: number) => {
    while (true) {
        let leftChild = 2 * index + 1;
        let rightChild = 2 * index + 2;
        let smallest = index;

        if (leftChild < heap.length && heap[leftChild].val < heap[smallest].val) {
            smallest = leftChild;
        }
        if (rightChild < heap.length && heap[rightChild].val < heap[smallest].val) {
            smallest = rightChild;
        }

        if (smallest !== index) {
            [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
            index = smallest;
        } else {
            break;
        }
    }
};

export const generateSteps = (points: Point[], k: number): SimulationStep[] => {
    const steps: SimulationStep[] = [];
    // Deep copy helper for the heap state to avoid reference issues in history
    const getHeapState = (h: HeapNode[]) => JSON.parse(JSON.stringify(h));

    const realHeap: HeapNode[] = [];
    let stepCount = 0;

    // 1. Initialization
    steps.push({
        stepId: stepCount++,
        line: CODE_LINES.INIT,
        heap: [],
        points: points,
        currentPointIndex: -1,
        description: "Initialize an empty list to act as our heap.",
        highlightNodes: [],
        poppedNode: null
    });

    // 2. Loop
    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        
        // Loop Start
        steps.push({
            stepId: stepCount++,
            line: CODE_LINES.LOOP_START,
            heap: getHeapState(realHeap),
            points: points,
            currentPointIndex: i,
            description: `Processing point [${p.x}, ${p.y}]...`,
            highlightNodes: [],
            poppedNode: null
        });

        // Calc Distance
        const distSq = p.x * p.x + p.y * p.y;
        const negDist = -distSq;
        steps.push({
            stepId: stepCount++,
            line: CODE_LINES.CALC_DIST,
            heap: getHeapState(realHeap),
            points: points,
            currentPointIndex: i,
            description: `Distance² = ${distSq}. Negative Distance = ${negDist}.`,
            highlightNodes: [],
            poppedNode: null
        });

        // Push
        const newNode: HeapNode = { val: negDist, point: [p.x, p.y], id: p.id };
        pushHeap(realHeap, newNode);
        steps.push({
            stepId: stepCount++,
            line: CODE_LINES.PUSH,
            heap: getHeapState(realHeap),
            points: points,
            currentPointIndex: i,
            description: `Push (${negDist}, [${p.x}, ${p.y}]) into the heap. The heap rebalances to keep the smallest value at root.`,
            highlightNodes: [p.id],
            poppedNode: null
        });

        // Check Size
        steps.push({
            stepId: stepCount++,
            line: CODE_LINES.CHECK_SIZE,
            heap: getHeapState(realHeap),
            points: points,
            currentPointIndex: i,
            description: `Checking heap size: ${realHeap.length} > k (${k})?`,
            highlightNodes: [],
            poppedNode: null
        });

        if (realHeap.length > k) {
            const popped = popHeap(realHeap);
            steps.push({
                stepId: stepCount++,
                line: CODE_LINES.POP,
                heap: getHeapState(realHeap),
                points: points,
                currentPointIndex: i,
                description: `Heap size exceeded K! Pop the root: ${popped?.val}. Since we store negative distances, the "smallest" number is actually the largest distance (${Math.abs(popped?.val || 0)}). Goodbye!`,
                highlightNodes: [],
                poppedNode: popped || null
            });
        }
    }

    // Return
    steps.push({
        stepId: stepCount++,
        line: CODE_LINES.RETURN,
        heap: getHeapState(realHeap),
        points: points,
        currentPointIndex: points.length,
        description: "Loop finished. The heap contains the K closest points (closest to 0 because we evicted the farthest ones).",
        highlightNodes: realHeap.map(n => n.id),
        poppedNode: null
    });

    return steps;
};