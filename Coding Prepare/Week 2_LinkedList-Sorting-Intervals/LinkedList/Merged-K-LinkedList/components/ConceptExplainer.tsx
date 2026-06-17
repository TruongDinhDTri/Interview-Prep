
import React from 'react';
import { Sun, ShoppingBasket, ArrowRight, GitCommit } from 'lucide-react';

// --- SVG Visualizations ---

const StrategyVisual = () => (
  <svg viewBox="0 0 600 220" className="w-full h-auto bg-white rounded-xl border border-stone-200 shadow-sm my-6">
    <defs>
      <marker id="arrowhead-strategy" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#EA580C" />
      </marker>
      <marker id="arrow-list" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6" fill="none" stroke="#A8A29E" strokeWidth="1" />
      </marker>
    </defs>

    {/* Title */}
    <text x="20" y="30" className="font-serif text-xs text-stone-400 uppercase tracking-widest font-bold">Linked Lists</text>
    <text x="450" y="30" textAnchor="middle" className="font-serif text-xs text-stone-400 uppercase tracking-widest font-bold">The Basket</text>

    {/* Background Area for Field */}
    <rect x="20" y="45" width="320" height="150" fill="#FDFBF7" rx="8" stroke="#F5F5F4" />

    {/* Rows */}
    {[0, 1, 2].map((row, i) => (
      <g key={i} transform={`translate(40, ${80 + i * 50})`}>
        <text x="-15" y="4" className="font-serif text-xs font-bold text-stone-400">{String.fromCharCode(65+i)}</text>
        
        {/* Nodes */}
        {[0, 1, 2].map((col, j) => (
          <g key={j} transform={`translate(${col * 60 + 20}, 0)`}>
             {/* Arrow to next */}
             {j < 2 && <line x1="14" y1="0" x2="46" y2="0" stroke="#D6D3D1" strokeWidth="2" markerEnd="url(#arrow-list)" />}
             
             {/* Node Body */}
             <circle 
                r="14" 
                fill={j===0 ? (i===0?"#FDBA74":i===1?"#FCD34D":"#BEF264") : "#E7E5E4"} 
                stroke={j===0 ? "#fff" : "#D6D3D1"}
                strokeWidth="2"
             />
             {/* Value Label */}
             <text y="4" textAnchor="middle" fontSize="10" fill={j===0 ? "#78350F" : "#A8A29E"} fontWeight="bold">
               {10 + i*10 + j*2}
             </text>
             
             {/* Head Label */}
             {j===0 && <text y="-20" textAnchor="middle" fontSize="8" fill="#A8A29E" fontWeight="bold">HEAD</text>}

             {/* Highlight Ring for First Item */}
             {j === 0 && (
                <circle r="18" fill="none" stroke="#EA580C" strokeWidth="2" strokeDasharray="3 3" opacity="0.6">
                    <animate attributeName="opacity" values="0.6;1;0.6" duration="2s" repeatCount="indefinite" />
                </circle>
             )}
          </g>
        ))}
        {/* Null Pointer */}
        <g transform="translate(200, 0)">
             <line x1="-14" y1="0" x2="0" y2="0" stroke="#D6D3D1" strokeWidth="2" />
             <rect x="0" y="-6" width="12" height="12" fill="none" stroke="#D6D3D1" strokeWidth="1"/>
             <line x1="0" y1="6" x2="12" y2="-6" stroke="#D6D3D1" strokeWidth="1"/>
        </g>
      </g>
    ))}

    {/* The Basket (Heap) */}
    <g transform="translate(450, 130)">
       <path d="M-50,-20 L-35,50 Q0,60 35,50 L50,-20 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="3" />
       <ellipse cx="0" cy="-20" rx="50" ry="10" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
       
       {/* Items inside basket */}
       <circle cx="-20" cy="10" r="12" fill="#FDBA74" stroke="#fff" strokeWidth="2" />
       <circle cx="20" cy="10" r="12" fill="#FCD34D" stroke="#fff" strokeWidth="2" />
       <circle cx="0" cy="-5" r="12" fill="#BEF264" stroke="#fff" strokeWidth="2" />
    </g>

    {/* Arrows */}
    <path d="M 75,80 Q 250,60 410,110" fill="none" stroke="#EA580C" strokeWidth="2" markerEnd="url(#arrowhead-strategy)" strokeDasharray="4 4" />
    <path d="M 75,130 L 400,130" fill="none" stroke="#EA580C" strokeWidth="2" markerEnd="url(#arrowhead-strategy)" strokeDasharray="4 4" />
    <path d="M 75,180 Q 250,200 410,150" fill="none" stroke="#EA580C" strokeWidth="2" markerEnd="url(#arrowhead-strategy)" strokeDasharray="4 4" />
    
    <text x="280" y="100" textAnchor="middle" className="text-[10px] text-orange-600 bg-white font-bold px-1">Only Add Head</text>

  </svg>
);

// --- Storyboard Step Visuals ---

const HarvestVisual = () => (
  <svg viewBox="0 0 200 120" className="w-full h-full">
    {/* Basket */}
    <path d="M70,80 L80,110 L120,110 L130,80 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
    <ellipse cx="100" cy="80" rx="30" ry="8" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
    
    {/* Leaving Item */}
    <g transform="translate(100, 60)">
      <circle r="12" fill="#BEF264" stroke="#fff" strokeWidth="2" />
      <text y="4" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#3F6212">Min</text>
      <animateTransform attributeName="transform" type="translate" from="100 60" to="160 40" dur="1.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;1;0" dur="1.5s" repeatCount="indefinite" />
    </g>

    {/* Wagon */}
    <g transform="translate(160, 40)">
       <rect x="-15" y="-10" width="30" height="20" fill="#E7E5E4" stroke="#A8A29E" />
       <circle cx="-10" cy="10" r="3" fill="#57534E" />
       <circle cx="10" cy="10" r="3" fill="#57534E" />
    </g>
  </svg>
);

const IdentifyVisual = () => (
  <svg viewBox="0 0 200 120" className="w-full h-full">
    {/* Ghost Item */}
    <g transform="translate(150, 60)" opacity="0.5">
       <circle r="12" fill="#BEF264" stroke="#44403C" strokeWidth="2" strokeDasharray="2 2" />
       <text y="4" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#44403C">Min</text>
    </g>

    {/* Tag */}
    <rect x="140" y="30" width="40" height="16" rx="4" fill="#fff" stroke="#EA580C" strokeWidth="1" />
    <text x="160" y="42" textAnchor="middle" fontSize="8" fill="#EA580C" fontWeight="bold">List A</text>

    {/* Arrow Back */}
    <path d="M 135,60 Q 100,60 70,60" fill="none" stroke="#EA580C" strokeWidth="2" markerEnd="url(#arrow-cycle)" />
    <text x="100" y="55" textAnchor="middle" fontSize="8" fill="#EA580C" fontWeight="bold">Origin?</text>

    {/* Row A Label */}
    <text x="40" y="65" fontSize="14" fontWeight="bold" fill="#44403C">List A</text>
  </svg>
);

const RecruitVisual = () => (
  <svg viewBox="0 0 200 120" className="w-full h-full">
    <defs>
       <marker id="arrow-next" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6" fill="none" stroke="#A8A29E" strokeWidth="1" />
      </marker>
    </defs>
    {/* Row Track */}
    <line x1="20" y1="60" x2="60" y2="60" stroke="#E7E5E4" strokeWidth="2" />
    
    {/* Ghost (Just Taken) */}
    <circle cx="50" cy="60" r="12" fill="#E7E5E4" stroke="#A8A29E" strokeDasharray="2 2" opacity="0.5" />
    
    {/* Next Pointer Arrow */}
    <line x1="65" y1="60" x2="85" y2="60" stroke="#EA580C" strokeWidth="2" markerEnd="url(#arrow-next)" />
    <text x="75" y="50" textAnchor="middle" fontSize="8" fill="#EA580C" fontWeight="bold">.next</text>

    {/* Next Item (Candidate) */}
    <g transform="translate(100, 60)">
       <circle r="14" fill="#FDBA74" stroke="#EA580C" strokeWidth="2" />
       <text y="4" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#7C2D12">Next</text>
       {/* Focus Ring */}
       <circle r="18" fill="none" stroke="#EA580C" strokeWidth="2" opacity="0.5">
         <animate attributeName="r" values="16;20;16" dur="1.5s" repeatCount="indefinite" />
         <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite" />
       </circle>
    </g>

    {/* Text */}
    <text x="100" y="90" textAnchor="middle" fontSize="9" fill="#EA580C" fontWeight="bold">Found node.next!</text>
  </svg>
);

const RejoinVisual = () => (
  <svg viewBox="0 0 200 120" className="w-full h-full">
     {/* Basket */}
    <g transform="translate(100, 90)">
      <path d="M-30,-15 L-20,30 L20,30 L30,-15 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
    </g>

    {/* Jumping Item */}
    <g>
       <circle r="12" fill="#FDBA74" stroke="#fff" strokeWidth="2" >
          <animateMotion path="M 50,60 Q 75,20 100,70" dur="1s" repeatCount="indefinite" rotate="auto" />
       </circle>
    </g>

    <text x="150" y="50" textAnchor="middle" fontSize="9" fill="#16A34A" fontWeight="bold">Add to Basket</text>
  </svg>
);


// --- Main Component ---

const ConceptExplainer: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] text-stone-800 font-sans pb-20">
      <div className="max-w-5xl mx-auto px-8 py-16">
        
        {/* Header */}
        <header className="mb-20 text-center border-b border-stone-200 pb-10">
            <div className="inline-block p-4 bg-orange-100 rounded-full text-orange-600 mb-6">
                <Sun size={40} />
            </div>
            <h1 className="text-5xl font-serif font-bold text-stone-800 mb-4">The Harvest of Linked Lists</h1>
            <p className="text-xl text-stone-500 font-serif italic">
              Efficiently merging sorted linked lists using a Min-Heap.
            </p>
        </header>

        {/* Concept 1 */}
        <section className="mb-24">
            <div className="flex gap-6">
                <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 bg-stone-800 text-stone-50 rounded-xl flex items-center justify-center font-serif font-bold text-xl">1</div>
                </div>
                <div>
                    <h2 className="text-3xl font-serif font-bold text-stone-800 mb-4">The Problem</h2>
                    <p className="text-lg text-stone-600 leading-relaxed mb-6">
                        We have <strong>K</strong> sorted <strong>Linked Lists</strong>. We want to merge them into one single sorted linked list.
                        <br/><br/>
                        Unlike arrays, we can't just access any element by index. We only have access to the <strong>HEAD</strong> of each list and can only move forward using <code>.next</code>.
                    </p>
                    
                    <div className="bg-white border border-stone-200 p-8 rounded-2xl flex items-center justify-around shadow-sm mt-8">
                        <div className="text-center">
                            <div className="font-bold text-stone-400 text-xs uppercase tracking-widest mb-2">Linked Lists</div>
                            <div className="flex flex-col gap-2 items-center">
                                <div className="flex items-center gap-1">
                                   <div className="h-3 w-3 rounded-full bg-stone-300"></div>
                                   <div className="h-0.5 w-6 bg-stone-300"></div>
                                   <div className="h-3 w-3 rounded-full bg-stone-300"></div>
                                </div>
                                <div className="flex items-center gap-1">
                                   <div className="h-3 w-3 rounded-full bg-stone-300"></div>
                                   <div className="h-0.5 w-6 bg-stone-300"></div>
                                   <div className="h-3 w-3 rounded-full bg-stone-300"></div>
                                </div>
                            </div>
                        </div>
                        <div className="text-stone-300">➔</div>
                        <div className="text-center">
                            <div className="font-bold text-stone-400 text-xs uppercase tracking-widest mb-2">One Result List</div>
                            <div className="flex items-center gap-1">
                               <div className="h-3 w-3 rounded-full bg-orange-300"></div>
                               <div className="h-0.5 w-6 bg-orange-200"></div>
                               <div className="h-3 w-3 rounded-full bg-orange-300"></div>
                               <div className="h-0.5 w-6 bg-orange-200"></div>
                               <div className="h-3 w-3 rounded-full bg-orange-300"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Concept 2: Strategy */}
        <section className="mb-24">
            <div className="flex gap-6">
                <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 bg-amber-600 text-white rounded-xl flex items-center justify-center font-serif font-bold text-xl">2</div>
                </div>
                <div className="w-full">
                    <h2 className="text-3xl font-serif font-bold text-stone-800 mb-4">The Strategy: Collect Heads</h2>
                    <p className="text-lg text-stone-600 leading-relaxed mb-6">
                        The smallest element of each list is guaranteed to be at the <strong>HEAD</strong>. 
                        We put the head of every list into a <strong>Min-Heap</strong> (our Basket). 
                        This allows us to instantly know which head is the smallest among all lists.
                    </p>
                    {/* Visualization */}
                    <StrategyVisual />
                </div>
            </div>
        </section>

        {/* Concept 3: Cycle (Redesigned) */}
        <section className="mb-10">
            <div className="flex gap-6">
                <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 bg-lime-700 text-white rounded-xl flex items-center justify-center font-serif font-bold text-xl">3</div>
                </div>
                <div className="w-full">
                    <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2">The Cycle: Pop & Next</h2>
                    <p className="text-lg text-stone-500 font-serif italic mb-8">Follow the pointers.</p>

                    {/* 4-Step Visual Storyboard Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        
                        {/* Step 1: Harvest */}
                        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
                             <div className="w-full aspect-[5/3] bg-stone-50 rounded-lg mb-3 overflow-hidden">
                                <HarvestVisual />
                             </div>
                             <h4 className="font-bold text-lime-700 uppercase text-xs tracking-widest mb-1">Step 1: Pop Min</h4>
                             <p className="text-sm text-stone-600 font-medium">Pop the smallest node from the Basket. Attach it to our Result list.</p>
                        </div>

                        {/* Step 2: Identify */}
                        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
                             <div className="w-full aspect-[5/3] bg-stone-50 rounded-lg mb-3 overflow-hidden">
                                <IdentifyVisual />
                             </div>
                             <h4 className="font-bold text-orange-600 uppercase text-xs tracking-widest mb-1">Step 2: Check Origin</h4>
                             <p className="text-sm text-stone-600 font-medium">"This node came from List A. Does List A have more nodes?"</p>
                        </div>

                         {/* Step 3: Recruit */}
                         <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
                             <div className="w-full aspect-[5/3] bg-stone-50 rounded-lg mb-3 overflow-hidden">
                                <RecruitVisual />
                             </div>
                             <h4 className="font-bold text-orange-600 uppercase text-xs tracking-widest mb-1">Step 3: Follow .next</h4>
                             <p className="text-sm text-stone-600 font-medium">Move to <code>node.next</code>. This is the new candidate for List A.</p>
                        </div>

                        {/* Step 4: Rejoin */}
                        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
                             <div className="w-full aspect-[5/3] bg-stone-50 rounded-lg mb-3 overflow-hidden">
                                <RejoinVisual />
                             </div>
                             <h4 className="font-bold text-lime-700 uppercase text-xs tracking-widest mb-1">Step 4: Push to Heap</h4>
                             <p className="text-sm text-stone-600 font-medium">Add <code>node.next</code> to the Basket. The Heap re-sorts automatically.</p>
                        </div>

                    </div>

                    {/* Visual Timeline / Trace */}
                    <div className="bg-stone-800 p-8 rounded-xl shadow-lg text-stone-200">
                        <h4 className="font-bold text-orange-400 uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                            <GitCommit size={16}/> Visual Trace
                        </h4>
                        
                        <div className="relative pl-6 border-l-2 border-stone-600 space-y-8 font-mono text-sm">
                            
                            {/* Event 1 */}
                            <div className="relative">
                                <div className="absolute -left-[31px] top-0 w-4 h-4 bg-lime-500 rounded-full border-4 border-stone-800"></div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-lime-400 font-bold">Action: Pop Min (5)</span>
                                    <span className="text-stone-400 text-xs">Origin: <span className="text-orange-300">List A</span></span>
                                </div>
                            </div>

                             {/* Event 2 */}
                             <div className="relative">
                                <div className="absolute -left-[31px] top-0 w-4 h-4 bg-orange-500 rounded-full border-4 border-stone-800"></div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-orange-400 font-bold">Logic: Check node.next</span>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="opacity-50 line-through">Node 5 (Done)</span>
                                        <ArrowRight size={12}/>
                                        <span className="font-bold bg-stone-700 px-1 rounded border border-stone-600">Node 12 (Next)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Event 3 */}
                             <div className="relative">
                                <div className="absolute -left-[31px] top-0 w-4 h-4 bg-stone-500 rounded-full border-4 border-stone-800"></div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-white font-bold">Action: Push (12)</span>
                                    <span className="text-stone-400 text-xs">Basket re-sorts...</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>

        {/* Footer Quote */}
        <div className="text-center mt-20 pt-10 border-t border-stone-200">
            <div className="inline-flex items-center gap-2 text-stone-400 font-serif italic">
                <ShoppingBasket size={16} />
                <span>We only care about the head of the lists.</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ConceptExplainer;
