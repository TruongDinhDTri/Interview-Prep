import React, { useState, useEffect, useRef } from 'react';
import { Card, ControlPanel } from './GhibliUI';
import { HeapViz } from './HeapViz';
import { CODE_SNIPPET, INITIAL_POINTS, K_VALUE } from '../constants';
import { generateSteps } from '../services/algorithm';
import { SimulationStep } from '../types';
import { motion } from 'framer-motion';

export const DebugMode: React.FC = () => {
    const [steps, setSteps] = useState<SimulationStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1000);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const generated = generateSteps(INITIAL_POINTS, K_VALUE);
        setSteps(generated);
    }, []);

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setCurrentStepIndex((prev) => {
                    if (prev < steps.length - 1) return prev + 1;
                    setIsPlaying(false);
                    return prev;
                });
            }, speed);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, steps.length, speed]);

    const currentStep = steps[currentStepIndex];

    if (!currentStep) return <div className="flex items-center justify-center h-full text-slate-400">Initializing...</div>;

    const renderCode = () => {
        return CODE_SNIPPET.split('\n').map((line, idx) => {
            const lineNum = idx + 1;
            const isCurrent = currentStep.line === lineNum;
            return (
                <div 
                    key={lineNum} 
                    id={`code-line-${lineNum}`}
                    className={`
                        font-mono text-xs sm:text-sm px-4 py-0.5 transition-colors duration-200 whitespace-pre
                        ${isCurrent ? 'bg-yellow-100 border-l-4 border-yellow-400 text-slate-900 font-bold' : 'text-slate-500 border-l-4 border-transparent hover:bg-slate-50'}
                    `}
                >
                    <span className="inline-block w-6 text-slate-300 text-[10px] select-none mr-2 text-right">{lineNum}</span>
                    {line}
                </div>
            );
        });
    };

    return (
        <div className="h-full flex flex-col p-4 gap-4 overflow-hidden">
            
            {/* Top Bar: Controls & Status */}
            <div className="flex-none flex flex-col md:flex-row gap-4 bg-white/60 backdrop-blur-sm p-3 rounded-2xl border border-white/50 shadow-sm">
                <div className="flex-none flex justify-center">
                     <ControlPanel 
                        isPlaying={isPlaying}
                        togglePlay={() => setIsPlaying(!isPlaying)}
                        next={() => setCurrentStepIndex(c => Math.min(c + 1, steps.length - 1))}
                        prev={() => setCurrentStepIndex(c => Math.max(c - 1, 0))}
                        speed={speed}
                        setSpeed={setSpeed}
                        canNext={currentStepIndex < steps.length - 1}
                        canPrev={currentStepIndex > 0}
                    />
                </div>
                <div className="flex-1 pl-4 border-l border-slate-200 flex items-center">
                     <p className="text-slate-700 font-hand text-lg leading-none">{currentStep.description}</p>
                </div>
                <div className="flex-none flex items-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-wider px-4">
                    <div>Step {currentStepIndex + 1} / {steps.length}</div>
                    <div>K = {K_VALUE}</div>
                </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* Left: Code View */}
                <div className="lg:col-span-4 h-full min-h-0 flex flex-col">
                    <Card title="Source Code" className="flex-1 min-h-0 flex flex-col bg-white">
                        <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
                            {renderCode()}
                        </div>
                    </Card>
                </div>

                {/* Right: Visualizations */}
                <div className="lg:col-span-8 h-full min-h-0 flex flex-col gap-4">
                    
                    {/* Top Right: 2D Space */}
                    <div className="h-[45%] min-h-0">
                        <Card title="2D Plane Visualization" className="h-full bg-white relative">
                             <div className="absolute inset-0 p-6">
                                {/* Grid */}
                                <div className="w-full h-full relative border border-slate-100 bg-slate-50/30 rounded-lg overflow-hidden">
                                     {/* Axis */}
                                    <div className="absolute top-1/2 left-0 w-full h-px bg-slate-300 z-0"></div>
                                    <div className="absolute left-1/2 top-0 h-full w-px bg-slate-300 z-0"></div>
                                    
                                    {/* Origin */}
                                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-slate-800 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"></div>

                                     {/* Points */}
                                    {currentStep.points.map((p, idx) => {
                                        // Normalize coordinates for display (-5 to 5 range mapping to 0-100%)
                                        const xPct = 50 + (p.x * 8); 
                                        const yPct = 50 - (p.y * 8);
                                        const isProcessed = idx <= currentStep.currentPointIndex;
                                        const isCurrent = idx === currentStep.currentPointIndex;
                                        const isInHeap = currentStep.heap.find(n => n.id === p.id);

                                        return (
                                            <motion.div
                                                key={p.id}
                                                initial={{ scale: 0 }}
                                                animate={{ 
                                                    scale: isCurrent ? 1.3 : 1,
                                                    opacity: isProcessed ? 1 : 0.3
                                                }}
                                                className={`
                                                    absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2
                                                    flex items-center justify-center transition-colors duration-300 rounded-full border-2
                                                    ${isCurrent ? 'bg-yellow-400 border-yellow-600 z-30 shadow-lg' : ''}
                                                    ${!isCurrent && isInHeap ? 'bg-emerald-400 border-emerald-600 z-20' : ''}
                                                    ${!isCurrent && !isInHeap && isProcessed ? 'bg-slate-200 border-slate-300 z-10' : ''}
                                                    ${!isProcessed ? 'bg-slate-100 border-slate-200' : ''}
                                                `}
                                                style={{ left: `${xPct}%`, top: `${yPct}%` }}
                                            >
                                                <span className="text-[10px] font-bold text-slate-700">
                                                    {isCurrent || isInHeap ? Math.abs(p.distanceSq) : ''}
                                                </span>
                                                {/* Tooltip */}
                                                <div className="absolute -bottom-5 text-[9px] bg-white/90 px-1 rounded border border-slate-200 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity z-40 pointer-events-none">
                                                    ({p.x},{p.y}) d²={p.distanceSq}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                             </div>
                        </Card>
                    </div>

                    {/* Bottom Right: Heap Viz */}
                    <div className="h-[55%] min-h-0">
                        <Card title={`Heap Structure (Size: ${currentStep.heap.length})`} className="h-full bg-slate-50">
                            <div className="w-full h-full p-4">
                                <HeapViz 
                                    heap={currentStep.heap} 
                                    poppedNode={currentStep.poppedNode}
                                    highlightIds={currentStep.highlightNodes}
                                    title="Min-Heap of Negated Distances"
                                />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};