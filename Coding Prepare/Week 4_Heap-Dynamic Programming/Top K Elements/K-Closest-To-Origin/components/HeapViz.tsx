import React from 'react';
import { HeapNode } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface HeapVizProps {
    heap: HeapNode[];
    poppedNode: HeapNode | null;
    highlightIds: string[];
    title: string;
}

// Helper to calculate position for a binary tree node
// Index 0 is root.
// Level 0: 1 node (0)
// Level 1: 2 nodes (1, 2)
// Level 2: 4 nodes (3..6)
const getPosition = (index: number, totalNodes: number) => {
    const level = Math.floor(Math.log2(index + 1));
    const maxLevel = Math.max(Math.floor(Math.log2(totalNodes)), 2); // Ensure at least some height
    
    // Vertical position (15% padding top, distributed)
    const y = 15 + (level * (70 / (maxLevel || 1)));
    
    // Horizontal position
    // Determine offset from center based on level
    // Root is 50%. Level 1 is 30%, 70%. Level 2 is 20, 40, 60, 80.
    
    const levelStartIndex = Math.pow(2, level) - 1;
    const positionInLevel = index - levelStartIndex;
    const nodesInLevel = Math.pow(2, level);
    
    // Split the width (100%) into (nodesInLevel + 1) parts
    const x = ((positionInLevel + 1) / (nodesInLevel + 1)) * 100;
    
    return { x, y };
};

export const HeapViz: React.FC<HeapVizProps> = ({ heap, poppedNode, highlightIds, title }) => {
    
    // Calculate lines
    const lines = heap.map((node, index) => {
        if (index === 0) return null;
        const parentIndex = Math.floor((index - 1) / 2);
        if (parentIndex < 0) return null;
        
        const start = getPosition(parentIndex, heap.length);
        const end = getPosition(index, heap.length);
        
        return (
            <line 
                key={`line-${node.id}`}
                x1={`${start.x}%`} y1={`${start.y}%`}
                x2={`${end.x}%`} y2={`${end.y}%`}
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="4 4"
            />
        );
    });

    return (
        <div className="flex flex-col w-full h-full relative bg-slate-50/50 rounded-xl border border-slate-200 overflow-hidden">
            <div className="absolute top-3 left-3 z-20">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white/80 px-2 py-1 rounded">{title}</h3>
            </div>

            <div className="w-full h-full relative">
                {/* SVG Layer for connections */}
                <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                    {lines}
                </svg>

                {/* Nodes Layer */}
                <AnimatePresence mode="popLayout">
                    {heap.map((node, index) => {
                        const pos = getPosition(index, heap.length);
                        const isHighlighted = highlightIds.includes(node.id);
                        
                        return (
                            <motion.div
                                layoutId={`heap-node-${node.id}`}
                                key={node.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ 
                                    left: `${pos.x}%`,
                                    top: `${pos.y}%`,
                                    scale: isHighlighted ? 1.2 : 1,
                                    opacity: 1,
                                    backgroundColor: isHighlighted ? '#fde047' : '#ffffff',
                                    borderColor: isHighlighted ? '#eab308' : '#64748b',
                                    zIndex: isHighlighted ? 20 : 10
                                }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                className="absolute w-10 h-10 md:w-12 md:h-12 -ml-5 -mt-5 md:-ml-6 md:-mt-6 rounded-full flex items-center justify-center shadow-md border-2 font-mono text-sm md:text-base font-bold text-slate-700"
                            >
                                {node.val}
                                <div className="absolute -bottom-5 text-[9px] text-slate-400 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity bg-white px-1 rounded border">
                                    [{node.point[0]}, {node.point[1]}]
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                 {/* Popped Node Animation */}
                 <AnimatePresence>
                    {poppedNode && (
                        <motion.div
                            key="popped"
                            initial={{ left: '50%', top: '15%', opacity: 1, scale: 1 }}
                            animate={{ top: '-20%', opacity: 0, scale: 1.5, rotate: 20 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute w-14 h-14 -ml-7 -mt-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xl border-4 border-white font-mono text-lg font-bold z-50"
                        >
                            {poppedNode.val}
                        </motion.div>
                    )}
                </AnimatePresence>

                {heap.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 italic">
                        Empty Heap
                    </div>
                )}
            </div>
        </div>
    );
};