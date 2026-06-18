import React, { useState } from 'react';
import { GhibliButton } from './GhibliUI';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RefreshCcw, AlertCircle, ArrowDownUp, Trash2, Filter } from 'lucide-react';

export const CoreIdeas: React.FC = () => {
    const [step, setStep] = useState(0);

    const TOTAL_STEPS = 12;
    
    const nextStep = () => setStep((s) => (s + 1) % TOTAL_STEPS);
    const reset = () => setStep(0);
    const prevStep = () => setStep((s) => Math.max(0, s - 1));

    // Phase 1 Data (Negation Trick)
    const rawData = [15, 42, 7]; // 42 is max

    // Phase 2 Data (Algorithm Logic)
    // Scenario: K=2. Points: [10, 20]. New Point: 5.
    const bucketContentStep7 = [{d: 10, id: 'a'}, {d: 20, id: 'b'}];
    const bucketContentStep8 = [{d: 10, id: 'a'}, {d: 20, id: 'b'}, {d: 5, id: 'c'}];
    const bucketContentStep9 = [{d: 10, id: 'a'}, {d: 5, id: 'c'}]; // 20 removed

    const getBucketContent = (s: number) => {
        if (s <= 7) return [];
        // Step 8: Show initial 2 items
        // Step 9: Still showing initial 2 items while 5 floats in
        if (s === 8 || s === 9) return bucketContentStep7;
        // Step 10: Show all 3 items (so we can highlight the max)
        if (s === 10) return bucketContentStep8;
        // Step 11: Show final result
        return bucketContentStep9;
    };

    const stepInfo = [
        // --- Phase 1: The Trick ---
        { title: "The Challenge", text: "We have numbers: [15, 42, 7]. We want a structure where we can easily access and remove the LARGEST number (42)." },
        { title: "The Tool Mismatch", text: "Python's heapq is a Min-Heap. It puts the SMALLEST number (7) at the top. This is the opposite of what we want." },
        { title: "The Negation Trick", text: "Mathematics to the rescue! Let's negate all numbers. Positive becomes negative. Largest becomes 'Smallest'." },
        { title: "Min-Heap Behavior", text: "Now we put these negative numbers into the Min-Heap. Who is the smallest now? -42 is smaller than -15 and -7." },
        { title: "The Side-by-Side Proof", text: "Look closely. The Min-Heap with negatives (-42) behaves exactly like a theoretical Max-Heap with positives (42)." },
        { title: "The Result", text: "We pop the top (-42). If we negate it back, we get 42. We successfully removed the largest number!" },
        
        // --- Phase 2: The Algorithm ---
        { title: "Applying to K Closest", text: "Now, how does this help us find the K closest points? The goal is to keep the K smallest distances." },
        { title: "The 'Discard' Strategy", text: "Paradoxically, to keep the smallest items, we need a mechanism to identify and DISCARD the largest ones whenever we have too many." },
        { title: "The Capacity Check", text: "Imagine a bucket of size K=2. We start by filling it with the first two distances: 10 and 20." },
        { title: "The Overflow", text: "A new point arrives with distance 5. We add it to the bucket. Now we have 3 items [10, 20, 5], which is > K." },
        { title: "The Eviction", text: "We must remove one to get back to size K. Which one? The LARGEST (20) is the farthest away. It must go." },
        { title: "The Synthesis", text: "We are left with [10, 5]. We kept the closest points! This 'Evict Max' strategy is why we need the Negation Trick + MinHeap." }
    ];

    const currentInfo = stepInfo[step];

    return (
        <div className="flex flex-col h-full p-4 gap-4">
            
            {/* Top Control Bar */}
            <div className="flex-none flex justify-between items-center bg-white/60 backdrop-blur rounded-2xl p-4 border border-white/50 shadow-sm z-50">
                 <div>
                     <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-sm font-bold">{step + 1}</span>
                        {currentInfo.title}
                     </h2>
                     <p className="text-slate-600 text-sm mt-1 max-w-3xl font-medium">{currentInfo.text}</p>
                 </div>
                 <div className="flex gap-2">
                     <GhibliButton onClick={reset} className="w-10 h-10 !p-0 !rounded-full bg-slate-100" title="Reset">
                        <RefreshCcw size={16}/>
                     </GhibliButton>
                      <GhibliButton onClick={prevStep} disabled={step===0} className="w-10 h-10 !p-0 !rounded-full bg-slate-100" title="Back">
                        <ArrowRight className="rotate-180" size={16}/>
                     </GhibliButton>
                     <GhibliButton onClick={nextStep} active={true} className="bg-sky-500 text-white hover:bg-sky-600 px-6 shadow-sky-200 shadow-lg">
                        {step === TOTAL_STEPS - 1 ? "Replay" : "Next"} <ArrowRight size={16}/>
                     </GhibliButton>
                 </div>
            </div>

            {/* Main Visualization Area */}
            <div className="flex-1 min-h-0 relative px-8 py-4 overflow-hidden">
                <AnimatePresence mode="wait">
                    
                    {/* PHASE 1: THE TRICK (Steps 0-5) */}
                    {step <= 5 && (
                        <motion.div 
                            key="phase1"
                            initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -20}}
                            className="w-full h-full grid grid-cols-2 gap-8"
                        >
                             {/* Left Side: The Goal (Max Heap) */}
                            <div className="relative flex flex-col items-center justify-center border-r border-slate-300/50 pr-8">
                                <div className="absolute top-0 left-0 bg-slate-200 text-slate-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Logical Goal
                                </div>
                                
                                <div className="relative w-full max-w-md h-64">
                                    <AnimatePresence>
                                        {step === 0 && (
                                            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex gap-4 justify-center items-center h-full">
                                                {rawData.map((n, i) => (
                                                    <div key={i} className="w-16 h-16 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center text-2xl font-bold text-slate-700 shadow-sm">
                                                        {n}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                        {step > 0 && (
                                            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="w-full h-full relative">
                                                <div className="absolute top-4 w-full text-center text-slate-400 text-sm font-hand mb-4">
                                                    "I want to pop the Max (42)"
                                                </div>
                                                {/* Root */}
                                                <div className={`absolute top-[30%] left-[50%] -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg border-4 z-10 transition-all duration-500
                                                    ${step === 5 ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}
                                                    bg-amber-100 border-amber-300 text-amber-700`}>
                                                    42
                                                </div>
                                                {/* Children */}
                                                <div className="absolute top-[70%] left-[30%] -translate-x-1/2 w-16 h-16 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-xl font-bold text-slate-400 shadow-sm">
                                                    15
                                                </div>
                                                <div className="absolute top-[70%] left-[70%] -translate-x-1/2 w-16 h-16 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-xl font-bold text-slate-400 shadow-sm">
                                                    7
                                                </div>
                                                {/* Lines */}
                                                <svg className="absolute inset-0 w-full h-full -z-10">
                                                    <line x1="50%" y1="38%" x2="30%" y2="70%" stroke="#cbd5e1" strokeWidth="2" />
                                                    <line x1="50%" y1="38%" x2="70%" y2="70%" stroke="#cbd5e1" strokeWidth="2" />
                                                </svg>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Right Side: The Reality (Min Heap) */}
                            <div className="relative flex flex-col items-center justify-center">
                                <div className="absolute top-0 left-0 bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Implementation (Min-Heap)
                                </div>

                                <div className="relative w-full max-w-md h-64">
                                    <AnimatePresence mode="wait">
                                        {step <= 1 && (
                                            <motion.div 
                                                key="s1"
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="flex flex-col gap-4 items-center justify-center h-full"
                                            >
                                                <div className="flex gap-4">
                                                    {rawData.map((n, i) => (
                                                        <motion.div 
                                                            key={i} 
                                                            className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shadow-md border-2 transition-all duration-500
                                                            ${step === 1 ? 'bg-red-50 border-red-200 text-red-400' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}
                                                        >
                                                            {n}
                                                        </motion.div>
                                                    ))}
                                                </div>
                                                {step === 1 && (
                                                    <div className="text-red-500 font-bold flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg">
                                                        <AlertCircle size={20}/> Min-Heap puts 7 at top. Wrong!
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}

                                        {step === 2 && (
                                            <motion.div 
                                                key="s2"
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="flex gap-4 justify-center items-center h-full"
                                            >
                                                {rawData.map((n, i) => (
                                                    <div key={i} className="relative">
                                                        <motion.div 
                                                            initial={{ rotateY: 0 }}
                                                            animate={{ rotateY: 180 }}
                                                            transition={{ duration: 0.6 }}
                                                            className="w-16 h-16 rounded-full bg-indigo-600 border-2 border-indigo-800 flex items-center justify-center text-xl font-bold text-white shadow-md"
                                                            style={{ backfaceVisibility: 'hidden' }}
                                                        >
                                                        </motion.div>
                                                        <motion.div 
                                                            initial={{ rotateY: -180 }}
                                                            animate={{ rotateY: 0 }}
                                                            transition={{ duration: 0.6 }}
                                                            className="absolute inset-0 w-16 h-16 rounded-full bg-indigo-600 border-2 border-indigo-800 flex items-center justify-center text-xl font-bold text-white shadow-md"
                                                            style={{ backfaceVisibility: 'hidden' }}
                                                        >
                                                            -{n}
                                                        </motion.div>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}

                                        {step >= 3 && (
                                            <motion.div 
                                                key="s3"
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                className="w-full h-full relative"
                                            >
                                                <div className="absolute top-4 w-full text-center text-indigo-400 text-sm font-hand mb-4">
                                                    "Min-Heap sees -42 as smallest"
                                                </div>
                                                {/* Root (-42) */}
                                                <motion.div 
                                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                    className={`absolute top-[30%] left-[50%] -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg border-4 z-10
                                                    ${step === 5 ? 'bg-rose-500 border-white text-white' : 'bg-indigo-100 border-indigo-300 text-indigo-700'}`}
                                                >
                                                    -42
                                                </motion.div>
                                                {/* Children */}
                                                <motion.div 
                                                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}
                                                    className="absolute top-[70%] left-[30%] -translate-x-1/2 w-16 h-16 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-xl font-bold text-slate-400 shadow-sm"
                                                >
                                                    -15
                                                </motion.div>
                                                <motion.div 
                                                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
                                                    className="absolute top-[70%] left-[70%] -translate-x-1/2 w-16 h-16 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-xl font-bold text-slate-400 shadow-sm"
                                                >
                                                    -7
                                                </motion.div>
                                                {/* Lines */}
                                                <svg className="absolute inset-0 w-full h-full -z-10">
                                                    <line x1="50%" y1="38%" x2="30%" y2="70%" stroke="#cbd5e1" strokeWidth="2" />
                                                    <line x1="50%" y1="38%" x2="70%" y2="70%" stroke="#cbd5e1" strokeWidth="2" />
                                                </svg>
                                                {/* Popped Animation */}
                                                {step === 5 && (
                                                    <motion.div
                                                        initial={{ top: '30%', left: '50%', opacity: 1, scale: 1 }}
                                                        animate={{ top: '-20%', opacity: 0, scale: 1.5 }}
                                                        transition={{ duration: 1 }}
                                                        className="absolute -translate-x-1/2 w-20 h-20 rounded-full bg-rose-500 border-4 border-white flex items-center justify-center text-2xl font-bold text-white shadow-xl z-50"
                                                    >
                                                        -42
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            {/* Connecting Arrow */}
                            {step >= 4 && (
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-white p-2 rounded-xl shadow-lg border border-indigo-100 z-20"
                                >
                                    <ArrowDownUp size={24} className="text-indigo-500 mb-1" />
                                    <span className="text-xs font-bold text-indigo-800">EQUIVALENT!</span>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* PHASE 2: THE ALGORITHM (Steps 6-11) */}
                    {step > 5 && (
                        <motion.div
                            key="phase2"
                            initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}}
                            className="w-full h-full flex flex-col items-center justify-center relative"
                        >
                            {/* Container Title */}
                            <div className="absolute top-0 left-4 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                <Filter size={14}/> Max-Heap Logic Applied
                            </div>

                            {/* The Bucket / Heap Container */}
                            <div className="w-full max-w-3xl h-[350px] bg-slate-100/50 rounded-b-3xl border-l-4 border-r-4 border-b-4 border-slate-300 relative flex items-end justify-center pb-8 gap-4 overflow-hidden shadow-inner">
                                <div className="absolute top-4 right-4 text-slate-400 text-sm font-bold">Capacity: K = 2</div>
                                
                                {/* Dashed Capacity Line */}
                                <div className="absolute top-[30%] left-0 w-full border-t-2 border-dashed border-rose-300 flex justify-center">
                                    <span className="bg-rose-50 text-rose-400 text-[10px] px-2 -mt-2">Overflow Threshold (Size {'>'} 2)</span>
                                </div>

                                <AnimatePresence mode="popLayout">
                                    {/* Render Bucket Items */}
                                    {getBucketContent(step).map((item, idx) => {
                                        const isMax = item.d === 20;
                                        const isNew = item.d === 5;
                                        
                                        return (
                                            <motion.div
                                                layoutId={`item-${item.id}`}
                                                key={item.id}
                                                initial={{ y: -300, opacity: 0 }}
                                                animate={{ 
                                                    y: 0, 
                                                    opacity: 1,
                                                    backgroundColor: isMax && step >= 10 ? '#fecdd3' : isNew ? '#ecfccb' : '#ffffff', // red tint if max, green if new
                                                    borderColor: isMax && step >= 10 ? '#e11d48' : isNew ? '#84cc16' : '#94a3b8'
                                                }}
                                                exit={{ 
                                                    y: -400, 
                                                    opacity: 0,
                                                    scale: 1.2,
                                                    rotate: 45 
                                                }}
                                                transition={{ type: "spring", bounce: 0.4 }}
                                                className="w-24 h-24 rounded-2xl border-4 flex flex-col items-center justify-center shadow-lg bg-white relative z-10"
                                            >
                                                <div className="text-2xl font-bold text-slate-700">{item.d}</div>
                                                <div className="text-[10px] text-slate-400 font-mono">Distance</div>
                                                {isMax && step >= 9 && (
                                                    <div className="absolute -top-3 -right-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">
                                                        MAX
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                    
                                    {/* The "New Point" waiting to enter in Step 8/9 */}
                                    {step === 9 && (
                                        <motion.div
                                            initial={{ y: -400, x: 0, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            key="incoming-5"
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 w-24 h-24 rounded-2xl border-4 border-emerald-400 bg-emerald-50 flex flex-col items-center justify-center shadow-xl z-20"
                                        >
                                            <div className="text-2xl font-bold text-emerald-700">5</div>
                                            <div className="text-[10px] text-emerald-500 font-bold">New Point</div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                                {step <= 7 && (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-lg font-hand opacity-50">
                                        (Bucket visualizing Capacity K=2)
                                    </div>
                                )}
                            </div>

                            {/* Annotations below */}
                            <div className="mt-8 flex gap-8">
                                <div className={`transition-all duration-500 ${step >= 10 ? 'opacity-30 blur-sm' : 'opacity-100'}`}>
                                    <h3 className="text-sm font-bold text-slate-600 mb-2">Strategy</h3>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm bg-white px-4 py-2 rounded-lg shadow-sm border">
                                        Fill Bucket <ArrowRight size={14}/> Check Size
                                    </div>
                                </div>
                                
                                <div className={`transition-all duration-500 ${step === 10 ? 'scale-110' : 'opacity-50'}`}>
                                    <h3 className="text-sm font-bold text-rose-600 mb-2">Overflow Logic</h3>
                                    <div className="flex items-center gap-2 text-rose-600 text-sm bg-rose-50 px-4 py-2 rounded-lg shadow-sm border border-rose-200">
                                        <Trash2 size={16}/> Evict Largest
                                    </div>
                                </div>
                            </div>
                            
                            {/* Final Synthesis Connection */}
                            {step === 11 && (
                                <motion.div 
                                    initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}
                                    className="absolute inset-0 bg-white/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-8 text-center"
                                >
                                    <h2 className="text-3xl font-bold text-slate-800 mb-4">Putting it Together</h2>
                                    <p className="text-xl text-slate-600 max-w-2xl leading-relaxed mb-8">
                                        We need to <strong className="text-rose-500">evict the largest</strong> distance to keep the K closest points.
                                        <br/><br/>
                                        As we learned in Part 1, the efficient way to "pop the largest" in Python 
                                        is to use a <strong className="text-indigo-600">Min-Heap with Negated Numbers</strong>.
                                    </p>
                                    <div className="flex gap-4">
                                        <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                                            <div className="text-xs text-slate-400 uppercase font-bold mb-1">Logic</div>
                                            <div className="font-mono text-slate-700">Pop Max(20)</div>
                                        </div>
                                        <div className="flex items-center text-slate-400"><ArrowRight/></div>
                                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                                            <div className="text-xs text-indigo-400 uppercase font-bold mb-1">Code</div>
                                            <div className="font-mono text-indigo-700">heappop(-20)</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
