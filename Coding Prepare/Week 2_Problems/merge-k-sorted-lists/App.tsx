
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Zap, BookOpen, Layout, ArrowRight, Terminal, Leaf } from 'lucide-react';
import HeapTree from './components/HeapTree';
import ListVisualizer from './components/ListVisualizer';
import ConceptExplainer from './components/ConceptExplainer';
import { generateSteps } from './services/algorithm';
import { AlgorithmStep, StepType } from './types';
import { INITIAL_LISTS, PYTHON_CODE } from './constants';

// --- lightweight Python syntax highlighter (gruvbox-dark palette) ---
const _PYKW = new Set("def return for in if elif else while import from as and or not None True False class with lambda yield break continue pass is raise try except finally global nonlocal del assert await async".split(" "));
const _PYBI = new Set("len range enumerate print sorted min max abs sum map filter zip reversed int str list dict set tuple float ord chr heappush heappop heapify heapq append pop".split(" "));
const hlPy = (line: string): React.ReactNode[] => {
  const P = { kw: '#FB4934', bi: '#FABD2F', fn: '#8EC07C', st: '#B8BB26', nu: '#D3869B', co: '#928374', self: '#83A598' };
  const re = /(#.*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+\.?\d*\b)|([A-Za-z_]\w*)|(\s+)|([^\w\s])/g;
  const out: React.ReactNode[] = []; let m: RegExpExecArray | null; let k = 0;
  while ((m = re.exec(line))) {
    const t = m[0]; let c = '';
    if (m[1]) c = P.co; else if (m[2]) c = P.st; else if (m[3]) c = P.nu;
    else if (m[4]) { if (_PYKW.has(t)) c = P.kw; else if (_PYBI.has(t)) c = P.bi; else if (t === 'self' || t === 'cls') c = P.self; else if (line[re.lastIndex] === '(') c = P.fn; }
    out.push(c ? <span key={k++} style={{ color: c }}>{t}</span> : <span key={k++}>{t}</span>);
  }
  return out;
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'visualizer' | 'concepts'>('visualizer');
  const [rawLists, setRawLists] = useState<number[][]>(INITIAL_LISTS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);

  const steps: AlgorithmStep[] = useMemo(() => generateSteps(rawLists), [rawLists]);
  const currentStep = steps[currentStepIndex];
  const isComplete = currentStepIndex === steps.length - 1;

  const executionLogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (executionLogRef.current) {
        executionLogRef.current.scrollTop = executionLogRef.current.scrollHeight;
    }
  }, [currentStepIndex]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && !isComplete) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isComplete, steps.length, playbackSpeed]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleGenerateNew = () => {
    const newLists = [];
    const numLists = 3 + Math.floor(Math.random() * 2); 
    for(let i=0; i<numLists; i++) {
        const len = 3 + Math.floor(Math.random() * 3);
        const arr = [];
        let current = Math.floor(Math.random() * 5);
        for(let j=0; j<len; j++) {
            current += 1 + Math.floor(Math.random() * 5);
            arr.push(current);
        }
        newLists.push(arr);
    }
    setRawLists(newLists);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // EXACT LINE MAPPING for Linked List Python Code in constants.ts
  const getHighlightedLines = (step: AlgorithmStep, stepIdx: number): number[] => {
    const hasStartedMainLoop = steps.slice(0, stepIdx + 1).some(s => s.type === StepType.POP_MIN);

    switch (step.type) {
      case StepType.INITIAL: return [5, 6]; // The for loop setup
      case StepType.PUSH_TO_HEAP:
        // If inside loop (checking next), it's line 21
        // If initial setup, it's line 8
        return hasStartedMainLoop ? [21] : [8];
      case StepType.POP_MIN: return [16]; // val, i, node = heapq.heappop(heap)
      case StepType.ADD_TO_RESULT: return [17, 18]; // curr.next = node; curr = curr.next
      case StepType.CHECK_NEXT: return [20]; // if node.next:
      case StepType.COMPLETE: return [23]; // return dummy.next
      default: return [];
    }
  };

  const highlightedLines = getHighlightedLines(currentStep, currentStepIndex);
  const recentSteps = steps.slice(Math.max(0, currentStepIndex - 3), currentStepIndex + 1);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F4] text-[#44403C] font-sans selection:bg-orange-200">
      {/* Autumn Header */}
      <header className="bg-[#292524] text-[#FAFAF9] sticky top-0 z-50 border-b border-orange-900 shadow-lg">
        <div className="w-full px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shadow-inner">
               <Leaf className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold tracking-wide text-orange-50">HeapMelt</h1>
              <p className="text-[10px] text-orange-300 uppercase tracking-[0.2em] font-medium">Linked List Harvest</p>
            </div>
          </div>
          
          <nav className="bg-[#44403C] p-1 rounded-lg flex gap-1">
             <button 
               onClick={() => setCurrentView('visualizer')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${currentView === 'visualizer' ? 'bg-[#57534E] text-orange-100 shadow-sm' : 'text-stone-400 hover:text-orange-200'}`}
             >
               <Layout size={16} /> Visualizer
             </button>
             <button 
               onClick={() => setCurrentView('concepts')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${currentView === 'concepts' ? 'bg-[#57534E] text-orange-100 shadow-sm' : 'text-stone-400 hover:text-orange-200'}`}
             >
               <BookOpen size={16} /> Concepts
             </button>
          </nav>
        </div>
      </header>

      {currentView === 'concepts' ? (
        <ConceptExplainer />
      ) : (
        <main className="flex-1 w-full px-6 py-8 grid grid-cols-1 xl:grid-cols-12 gap-6 max-w-[1920px] mx-auto">
          
          {/* LEFT: Stage (7 Cols) */}
          <div className="xl:col-span-7 flex flex-col gap-6">
            
            {/* Control Bar */}
            <div className="bg-white rounded-xl border border-stone-200 p-3 flex items-center justify-between shadow-sm">
               <div className="flex items-center gap-2">
                 <button onClick={handlePrev} disabled={currentStepIndex === 0} className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 disabled:opacity-30 transition-colors">
                   <SkipBack size={20} fill="currentColor" />
                 </button>
                 
                 <button 
                   onClick={() => setIsPlaying(!isPlaying)} 
                   className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold transition-all shadow-sm ${isPlaying ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-[#EA580C] text-white hover:bg-[#C2410C]'}`}
                 >
                   {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                   <span className="text-sm">{isPlaying ? 'Pause' : 'Start Harvest'}</span>
                 </button>

                 <button onClick={handleNext} disabled={isComplete} className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 disabled:opacity-30 transition-colors">
                   <SkipForward size={20} fill="currentColor" />
                 </button>

                 <div className="h-6 w-px bg-stone-200 mx-2"></div>
                 <button onClick={handleReset} className="p-2 text-stone-400 hover:text-stone-600 transition-colors" title="Restart">
                   <RotateCcw size={18} />
                 </button>
               </div>

               <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Speed</span>
                    <input 
                      type="range" 
                      min="100" 
                      max="2000" 
                      step="100"
                      value={2100 - playbackSpeed} 
                      onChange={(e) => setPlaybackSpeed(2100 - Number(e.target.value))}
                      className="w-24 h-1.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-orange-600"
                    />
                  </div>
                  <button onClick={handleGenerateNew} className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-200 hover:bg-amber-100">
                    <Zap size={14} /> New Crops
                  </button>
               </div>
            </div>

            {/* The Field (Visuals) */}
            <div className="space-y-6">
               {/* Lists */}
               <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-serif font-bold text-stone-500 uppercase tracking-widest">The Fields</h2>
                    <span className="text-xs text-stone-400">Linked Lists (Sorted)</span>
                 </div>
                 <ListVisualizer 
                   lists={rawLists} 
                   pointers={currentStep.state.pointers} 
                   highlightedListIndex={currentStep.state.highlightedListIndex}
                   checkNextCandidate={currentStep.state.checkNextCandidate}
                 />
               </div>

               {/* Heap & Result */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-1 rounded-2xl border border-stone-200 shadow-sm">
                     <HeapTree 
                       data={currentStep.state.heap} 
                       highlightedIndex={currentStep.state.highlightedHeapIndex}
                     />
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col">
                     <h2 className="text-sm font-serif font-bold text-stone-500 uppercase tracking-widest mb-4">The Wagon (Dummy.next)</h2>
                     <div className="flex-1 bg-stone-50 rounded-xl border-2 border-stone-100 p-4 shadow-inner overflow-hidden">
                        <div className="flex flex-wrap gap-1 content-start h-full overflow-y-auto">
                           {currentStep.state.result.length === 0 && (
                              <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 gap-2">
                                <span className="font-serif italic">Empty Wagon</span>
                              </div>
                           )}
                           {currentStep.state.result.map((node, idx) => (
                             <div key={idx} className="flex items-center animate-in fade-in duration-300">
                                {idx > 0 && <ArrowRight size={14} className="text-stone-400 mx-1"/>}
                                <div 
                                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm border-2 border-white ring-1 ring-stone-200"
                                  style={{ backgroundColor: node.color }}
                                >
                                  {node.val}
                                </div>
                             </div>
                           ))}
                           {currentStep.state.result.length > 0 && (
                                <div className="flex items-center ml-1 opacity-50">
                                  <ArrowRight size={14} className="text-stone-300 mx-1" />
                                  <span className="text-xs font-mono text-stone-400">None</span>
                                </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT: Logic & Code (5 Cols) */}
          <div className="xl:col-span-5 flex flex-col gap-6 h-[calc(100vh-140px)] sticky top-24">
            
            {/* Action Log */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm flex flex-col min-h-[30%] max-h-[40%] overflow-hidden">
               <div className="px-4 py-3 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
                  <h3 className="font-bold text-stone-700 text-sm flex items-center gap-2">
                    <Terminal size={14} /> Harvest Log
                  </h3>
                  <span className="px-2 py-0.5 bg-stone-200 text-stone-600 rounded text-[10px] font-mono font-bold">STEP {currentStepIndex}</span>
               </div>
               <div ref={executionLogRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                  {recentSteps.map((step, idx) => {
                    const isCurrent = idx === recentSteps.length - 1;
                    return (
                      <div key={idx} className={`text-sm border-l-2 pl-3 py-1 ${isCurrent ? 'border-orange-500' : 'border-stone-200 opacity-60'}`}>
                         <div className="text-[10px] font-bold uppercase text-stone-400 mb-0.5">{step.type.replace(/_/g, ' ')}</div>
                         <p className={`font-serif leading-snug ${isCurrent ? 'text-stone-800 font-medium' : 'text-stone-500'}`}>
                           {step.state.message}
                         </p>
                      </div>
                    )
                  })}
               </div>
            </div>

            {/* Code Viewer (Gruvbox Dark Theme) */}
            <div className="bg-[#282828] rounded-xl shadow-lg border border-stone-700 flex flex-col flex-1 overflow-hidden font-mono text-sm">
               <div className="bg-[#32302F] px-4 py-2 border-b border-stone-700 flex items-center justify-between">
                 <span className="text-[#D5C4A1] text-xs font-bold">solution.py</span>
                 <div className="flex gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#FB4934]"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-[#FABD2F]"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-[#B8BB26]"></div>
                 </div>
               </div>
               <div className="p-4 overflow-y-auto text-[#EBDBB2] leading-6">
                 {PYTHON_CODE.split('\n').map((line, i) => {
                   const lineNum = i + 1;
                   const isHighlighted = highlightedLines.includes(lineNum);
                   
                   return (
                     <div 
                       key={i} 
                       className={`flex relative ${isHighlighted ? 'bg-[#504945] -mx-4 px-4' : ''}`}
                     >
                       <span className={`w-8 text-right mr-4 select-none flex-shrink-0 text-[#928374] ${isHighlighted ? 'text-[#FABD2F] font-bold' : ''}`}>{lineNum}</span>
                       <span className="whitespace-pre">
                         {hlPy(line)}
                       </span>
                       {isHighlighted && (
                         <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#FABD2F]"></div>
                       )}
                     </div>
                   )
                 })}
               </div>
            </div>

          </div>
        </main>
      )}
    </div>
  );
};

export default App;
