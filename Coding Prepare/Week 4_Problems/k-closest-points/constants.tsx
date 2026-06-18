import React from 'react';
import { Point } from './types';

export const CODE_SNIPPET = `import heapq

class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        # Step 1: Initialize heap
        heap = []

        # Step 2: Iterate through all points
        for x, y in points:
            # Calculate negative distance squared
            dis = -(x*x + y*y)
            
            # Push to heap (Min-Heap behavior)
            heapq.heappush(heap, (dis, [x,y]))

            # Step 3: Maintain size k
            if len(heap) > k:
                # Pop the "smallest" (most negative => largest dist)
                heapq.heappop(heap)
        
        # Step 4: Return remaining k points
        return [[x,y] for (_, [x,y]) in heap]`;

export const INITIAL_POINTS: Point[] = [
    { x: 1, y: 3, id: 'p1', distanceSq: 10 },
    { x: -2, y: 2, id: 'p2', distanceSq: 8 },
    { x: 5, y: 8, id: 'p3', distanceSq: 89 },
    { x: 0, y: 1, id: 'p4', distanceSq: 1 },
    { x: 2, y: -2, id: 'p5', distanceSq: 8 },
];

export const K_VALUE = 3;

// Mapping line numbers in the code string to logical steps
export const CODE_LINES = {
    INIT: 6,
    LOOP_START: 9,
    CALC_DIST: 11,
    PUSH: 14,
    CHECK_SIZE: 17,
    POP: 19,
    RETURN: 22
};