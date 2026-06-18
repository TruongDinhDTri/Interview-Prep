export interface Point {
    x: number;
    y: number;
    id: string;
    distanceSq: number;
}

export interface HeapNode {
    val: number; // The negative distance
    point: number[]; // [x, y]
    id: string; // for React keys
}

export interface SimulationStep {
    stepId: number;
    line: number; // Corresponds to code line number
    heap: HeapNode[];
    points: Point[];
    currentPointIndex: number;
    description: string;
    highlightNodes: string[]; // IDs of nodes to highlight (e.g. being popped)
    poppedNode: HeapNode | null;
}

export enum Tab {
    CORE_IDEAS = 'CORE_IDEAS',
    DEBUG_MODE = 'DEBUG_MODE'
}