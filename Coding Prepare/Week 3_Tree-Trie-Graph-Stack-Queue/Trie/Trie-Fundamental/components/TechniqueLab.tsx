
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, StepForward, StepBack, RefreshCw, Clock, Terminal, BookOpen, Wrench } from 'lucide-react';
import { TECHNIQUE_SCENARIOS } from '../data/technique_steps';
import { VisualState } from '../data/algorithm_steps';
import { 
    VisualEmptyTrie, 
    VisualEmptyInsert, 
    VisualWeaver, 
    VisualScale
} from './TechniqueVisuals';

const INK = "#433422";
const PAPER = "#fefce8";
const ACTIVE_COLOR = "#d97706";
const VISITED_COLOR = "#a8a29e";
const FOUND_COLOR = "#65a30d";
const RED = "#be123c";

export const TechniqueLab: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('EMPTY_SEARCH');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1500);

  const timerRef = useRef<number | null>(null);

  const scenario = TECHNIQUE_SCENARIOS[activeScenarioId];
  const totalSteps = scenario.steps.length;
  const stepData = scenario.steps[currentStep];

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < totalSteps - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, speed);
    } else if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, totalSteps, speed]);

  const handleStep = (dir: 'next' | 'prev') => {
    setIsPlaying(false);
    if (dir === 'next' && currentStep < totalSteps - 1) setCurrentStep(c => c + 1);
    if (dir === 'prev' && currentStep > 0) setCurrentStep(c => c - 1);
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const renderConceptVisual = () => {
      switch(activeScenarioId) {
          case 'EMPTY_SEARCH': return <VisualEmptyTrie />;
          case 'EMPTY_INSERT': return <VisualEmptyInsert />;
          case 'PREPROCESSING': return <VisualWeaver />;
          case 'COMPLEXITY': return <VisualScale />;
          default: return null;
      }
  };

  return (
    <div className="space-y-8 animate-fade-in w-full h-full pb-8">
      {/* Header */}
      <div className="space-y-6 text-center">
        <h2 className="text-5xl font-serif font-bold text-[#433422] drop-shadow-sm">The Workshop</h2>
        <p className="text-xl text-[#78716c] font-serif italic max-w-2xl mx-auto">
           "Advanced techniques and edge cases for the master scribe."
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mt-8">
           {Object.values(TECHNIQUE_SCENARIOS).map(s => (
             <button
               key={s.id}
               onClick={() => { setActiveScenarioId(s.id); reset(); }}
               className={`px-6 py-3 rounded-full font-serif font-bold text-lg transition-all transform hover:scale-105 ${
                 activeScenarioId === s.id 
                 ? 'bg-[#433422] text-[#fdf6e3] shadow-xl ring-2 ring-[#d97706] ring-offset-2' 
                 : 'bg-white text-[#57534e] border border-[#e7e5e4] hover:bg-[#fff7ed] hover:border-[#d97706]'
               }`}
             >
               {s.title}
             </button>
           ))}
        </div>

        {/* Concept Deck */}
        <div className="bg-[#fffbeb] border border-[#e7e5e4] rounded-xl overflow-hidden max-w-7xl mx-auto shadow-md">
             <div className="h-2 w-full bg-[#d97706]"></div>
             <div className="p-8 flex flex-col md:flex-row gap-12 text-left min-h-[400px]">
                <div className="md:w-1/2 space-y-6">
                   <div className="space-y-2">
                       <h3 className="text-3xl font-bold font-serif text-[#433422]">{scenario.subtitle}</h3>
                       <div className="flex items-center space-x-2 text-[#d97706] text-sm font-bold uppercase tracking-widest">
                           <Wrench size={16} />
                           <span>Technique</span>
                       </div>
                   </div>
                   <div className="prose-none">
                      <MarkdownRenderer content={scenario.description} />
                   </div>
                </div>

                <div className="md:w-1/2 flex flex-col space-y-4">
                    {/* The Visual - Made much larger */}
                    <div className="bg-white rounded-lg border border-[#e7e5e4] shadow-sm h-[450px] overflow-hidden p-4 flex items-center justify-center">
                        {renderConceptVisual()}
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-[#e7e5e4] flex flex-col justify-center items-center text-center shadow-sm">
                        <Clock className="text-[#d97706] mb-3" size={32} />
                        <div className="text-xs uppercase tracking-widest text-[#9a3412] font-bold mb-2">Complexity</div>
                        <div className="text-2xl font-bold font-mono text-[#433422]">{scenario.complexity}</div>
                    </div>
                </div>
             </div>
        </div>
      </div>

      {/* Workbench - Full Height */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[85vh] min-h-[900px]">
         {/* Code */}
         <div className="bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden flex flex-col border border-[#333] h-full">
            <div className="bg-[#252526] px-4 py-2 flex items-center justify-between border-b border-[#333] shrink-0">
               <div className="flex space-x-2"><div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div><div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div><div className="w-3 h-3 rounded-full bg-[#27c93f]"></div></div>
               <div className="text-gray-400 text-xs font-mono">technique.py</div>
            </div>
            <div className="p-6 overflow-auto flex-1 font-mono text-sm leading-8 scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-[#1e1e1e]">
               {scenario.code.split('\n').map((line, idx) => {
                 const lineNum = idx + 1;
                 const isActive = lineNum === stepData.lineNo;
                 return (
                   <div key={idx} className={`flex transition-colors duration-200 ${isActive ? 'bg-[#37373d]' : ''}`}>
                     <span className="w-8 text-right pr-4 text-[#858585] select-none shrink-0">{lineNum}</span>
                     <pre className={`${isActive ? 'text-white font-bold' : 'text-[#d4d4d4]'} font-mono whitespace-pre`}>
                        <SyntaxHighlight line={line} />
                     </pre>
                     {isActive && <span className="ml-auto text-[#d97706] animate-pulse pl-4">← Executing</span>}
                   </div>
                 );
               })}
            </div>
         </div>

         {/* Visual */}
         <div className="bg-[#fffbeb] rounded-xl shadow-2xl border border-[#e7e5e4] relative overflow-hidden flex flex-col h-full">
            <div className="relative z-20 bg-white border-b border-[#d97706]/20 p-6 min-h-[160px] flex flex-col justify-center shadow-sm shrink-0">
               <div className="flex items-start gap-4">
                  <div className="bg-[#fff7ed] p-2 rounded-lg border border-[#fed7aa] mt-1 shrink-0"><Terminal className="text-[#d97706]" size={20} /></div>
                  <div className="flex-1">
                    <span className="text-xs uppercase font-bold text-[#9a3412] tracking-wider block mb-2">Execution Console</span>
                    <p className="text-[#433422] font-serif text-lg leading-snug animate-fade-in key={currentStep}">{stepData.log}</p>
                  </div>
               </div>
            </div>
            
            <div className="flex-1 w-full relative bg-[#fafaf9]/50 overflow-hidden h-full min-h-[700px]">
               <LabVisualizer state={stepData.visual} />
            </div>

            <div className="bg-white border-t border-[#e7e5e4] p-4 flex items-center justify-between z-20 shrink-0">
               <div className="flex items-center space-x-2">
                 <button onClick={reset} className="p-2 hover:bg-[#f3f4f6] rounded-full text-[#57534e] transition-colors"><RefreshCw size={20} /></button>
                 <div className="h-6 w-px bg-[#e7e5e4] mx-2"></div>
                 <button onClick={() => handleStep('prev')} disabled={currentStep===0} className="p-2 hover:bg-[#f3f4f6] rounded-full disabled:opacity-30 transition-colors"><StepBack size={24} fill="currentColor" /></button>
                 <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 bg-[#433422] text-[#fdf6e3] rounded-full hover:bg-[#5c4d43] shadow-lg transform hover:scale-105 transition-all mx-2">{isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1"/>}</button>
                 <button onClick={() => handleStep('next')} disabled={currentStep===totalSteps-1} className="p-2 hover:bg-[#f3f4f6] rounded-full disabled:opacity-30 transition-colors"><StepForward size={24} fill="currentColor" /></button>
               </div>
               <div className="flex items-center space-x-6">
                  <div className="text-xs font-bold text-[#a8a29e] uppercase tracking-widest">Step {currentStep + 1} of {totalSteps}</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// Reused components from AlgorithmLab (duplicated to ensure no breakage of existing file)

const MarkdownRenderer = ({ content }: { content: string }) => {
    const normalized = content.replace(/(^|\n)(### [^\n]+)/g, '\n\n$2\n\n');
    const blocks = normalized.split('\n\n').map(s => s.trim()).filter(s => s);
    return (
        <div className="space-y-4 font-serif text-lg text-[#57534e]">
            {blocks.map((block, i) => {
                if (block.startsWith('###')) return <h3 key={i} className="text-2xl font-bold text-[#433422] mt-6 mb-3 border-b-2 border-[#d97706]/20 pb-2 flex items-center">{block.replace(/###/g, '').trim()}</h3>;
                if (block.startsWith('*') || block.startsWith('-')) {
                    const items = block.split('\n').filter(s => s.trim().startsWith('*') || s.trim().startsWith('-'));
                    return <ul key={i} className="list-disc pl-6 space-y-2 mb-4 bg-[#fff7ed]/50 p-4 rounded-lg border border-[#fed7aa]/30">{items.map((item, j) => <li key={j} dangerouslySetInnerHTML={{__html: formatText(item.replace(/^[\*\-]/, '').trim())}} />)}</ul>
                }
                if (/^\d+\./.test(block)) {
                     const items = block.split('\n').filter(s => /^\d+\./.test(s.trim()));
                     return <ol key={i} className="list-decimal pl-6 space-y-3 mb-4 bg-[#f0fdf4]/30 p-4 rounded-lg border border-[#bbf7d0]/30">{items.map((item, j) => <li key={j} className="pl-2" dangerouslySetInnerHTML={{__html: formatText(item.replace(/^\d+\./, '').trim())}} />)}</ol>
                }
                return <p key={i} className="leading-relaxed mb-4" dangerouslySetInnerHTML={{__html: formatText(block)}} />;
            })}
        </div>
    )
}

const formatText = (text: string) => text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#d97706] font-bold">$1</strong>').replace(/`([^`]+)`/g, '<code class="bg-[#f5f5f4] px-1.5 py-0.5 rounded text-[#d97706] text-sm font-bold font-mono border border-[#e7e5e4]">$1</code>');

const SyntaxHighlight = ({ line }: { line: string }) => {
  const parts = line.split(/(\s+|[(){}:,.=[\]"'])/g);
  return <>{parts.map((part, i) => {
        if (['def', 'class', 'return', 'if', 'else', 'elif', 'for', 'in', 'not', 'del', 'and', 'or'].includes(part)) return <span key={i} className="text-[#c586c0]">{part}</span>;
        if (part === 'self') return <span key={i} className="text-[#569cd6]">{part}</span>;
        if (part === 'True' || part === 'False') return <span key={i} className="text-[#569cd6]">{part}</span>;
        if (part === 'None') return <span key={i} className="text-[#569cd6]">{part}</span>;
        if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="text-[#ce9178]">{part}</span>;
        if (!isNaN(Number(part)) && part.trim() !== "") return <span key={i} className="text-[#b5cea8]">{part}</span>;
        if (i > 1 && parts[i-2] === 'def') return <span key={i} className="text-[#dcdcaa]">{part}</span>;
        return <span key={i}>{part}</span>;
      })}</>;
};

const LabVisualizer = ({ state }: { state: VisualState }) => {
  return (
    // Updated viewBox to match AlgorithmLab zoom (800 500)
    <svg viewBox="0 0 800 500" className="w-full h-full transition-all duration-500">
       <defs>
          <marker id="arrow" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill={INK} /></marker>
          <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
       </defs>
       {state.links.map((link, i) => {
          const source = state.nodes.find(n => n.id === link.source);
          const target = state.nodes.find(n => n.id === link.target);
          if (!source || !target) return null;
          const isActive = link.status === 'active';
          return <line key={i} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={isActive ? ACTIVE_COLOR : INK} strokeWidth={isActive ? 4 : 2} markerEnd="url(#arrow)" opacity={link.status === 'default' ? 0.4 : 1} />
       })}
       {state.nodes.map(node => {
          let fill = PAPER; let stroke = INK; let textColor = INK;
          if (node.status === 'active') { fill = '#fff7ed'; stroke = ACTIVE_COLOR; }
          if (node.status === 'found') { fill = '#ecfccb'; stroke = FOUND_COLOR; }
          if (node.status === 'visited') { fill = '#f5f5f4'; stroke = VISITED_COLOR; textColor = VISITED_COLOR; }
          return (
            <g key={node.id} className="transition-all duration-500">
               {node.isEnd && <circle cx={node.x} cy={node.y} r={32} fill="none" stroke={FOUND_COLOR} strokeWidth="3" strokeDasharray="4,2" className="animate-spin-slow" />}
               <circle cx={node.x} cy={node.y} r={25} fill={fill} stroke={stroke} strokeWidth={3} filter={node.status === 'active' || node.status === 'found' ? 'url(#glow)' : ''} />
               <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor} fontFamily="serif">{node.char}</text>
            </g>
          );
       })}
       {state.pointer && <g className="transition-all duration-500" transform={`translate(${state.pointer.x}, ${state.pointer.y})`}><path d="M-10,0 L-20,-5 L-20,5 Z" fill={ACTIVE_COLOR} /><text x="10" y="5" fill={ACTIVE_COLOR} fontSize="16" fontWeight="bold" fontFamily="monospace">← {state.pointer.label}</text></g>}
       {state.message && <text x="400" y="480" textAnchor="middle" fontSize="18" fontWeight="bold" fill={INK} className="opacity-50">{state.message}</text>}
    </svg>
  );
};
