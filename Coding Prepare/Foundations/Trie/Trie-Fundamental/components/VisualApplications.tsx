import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

const INK = "#433422";
const PAPER = "#fefce8";
const ACCENT = "#d97706";

// --- Visual Concepts for Journal (Deep Dive & Bigger) ---

export const VisualSearchConcept = () => (
  <svg viewBox="0 0 500 400" className="w-full h-full">
    <defs>
      <marker id="arrowSm" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill={INK} />
      </marker>
    </defs>
    
    <text x="250" y="30" textAnchor="middle" fill={INK} fontSize="18" fontFamily="serif" fontWeight="bold">Algorithm: Conducting a Search for "BAT"</text>
    
    {/* Step 1 */}
    <g transform="translate(50, 80)">
      <rect x="0" y="0" width="100" height="200" rx="8" fill="white" stroke={INK} strokeWidth="1" />
      <text x="50" y="30" textAnchor="middle" fontSize="14" fontWeight="bold">Step 1</text>
      <text x="50" y="55" textAnchor="middle" fontSize="12" fill="#78716c">Current: Root</text>
      <text x="50" y="75" textAnchor="middle" fontSize="12" fill="#78716c">Looking for: 'B'</text>
      
      <circle cx="50" cy="130" r="20" fill={PAPER} stroke={INK} strokeWidth="2" />
      <text x="50" y="135" textAnchor="middle" fontSize="12">Root</text>
      
      <path d="M50,150 L50,180" stroke={ACCENT} strokeWidth="3" markerEnd="url(#arrowSm)" />
      <text x="50" y="195" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="bold">Found 'B'</text>
    </g>

    {/* Arrow */}
    <path d="M160,180 L190,180" stroke={INK} strokeWidth="2" markerEnd="url(#arrowSm)" />

    {/* Step 2 */}
    <g transform="translate(200, 80)">
      <rect x="0" y="0" width="100" height="200" rx="8" fill="white" stroke={INK} strokeWidth="1" />
      <text x="50" y="30" textAnchor="middle" fontSize="14" fontWeight="bold">Step 2</text>
      <text x="50" y="55" textAnchor="middle" fontSize="12" fill="#78716c">Current: Node B</text>
      <text x="50" y="75" textAnchor="middle" fontSize="12" fill="#78716c">Looking for: 'A'</text>
      
      <circle cx="50" cy="130" r="20" fill={PAPER} stroke={INK} strokeWidth="2" />
      <text x="50" y="136" textAnchor="middle" fontSize="16" fontWeight="bold">B</text>
      
      <path d="M50,150 L50,180" stroke={ACCENT} strokeWidth="3" markerEnd="url(#arrowSm)" />
      <text x="50" y="195" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="bold">Found 'A'</text>
    </g>

    {/* Arrow */}
    <path d="M310,180 L340,180" stroke={INK} strokeWidth="2" markerEnd="url(#arrowSm)" />

    {/* Step 3 */}
    <g transform="translate(350, 80)">
      <rect x="0" y="0" width="100" height="200" rx="8" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
      <text x="50" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#16a34a">Success</text>
      <text x="50" y="55" textAnchor="middle" fontSize="12" fill="#78716c">Current: Node T</text>
      <text x="50" y="75" textAnchor="middle" fontSize="12" fill="#78716c">Word End?</text>
      
      <circle cx="50" cy="130" r="20" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
      <text x="50" y="136" textAnchor="middle" fontSize="16" fontWeight="bold">T</text>
      
      <text x="50" y="180" textAnchor="middle" fontSize="14" fill="#16a34a" fontWeight="bold">YES (True)</text>
    </g>
  </svg>
);

export const VisualAutocompleteConcept = () => (
  <svg viewBox="0 0 500 400" className="w-full h-full">
    <text x="250" y="30" textAnchor="middle" fill={INK} fontSize="18" fontFamily="serif" fontWeight="bold">Algorithm: Autocomplete for "CA..."</text>
    
    {/* Left: Traversal Phase */}
    <g transform="translate(20, 80)">
      <text x="80" y="0" textAnchor="middle" fontSize="14" fontWeight="bold" fill={ACCENT}>Phase 1: Travel</text>
      <text x="80" y="20" textAnchor="middle" fontSize="12" fill="#78716c">Walk "C" -{'>'} "A"</text>

      <circle cx="80" cy="60" r="20" fill={PAPER} stroke={INK} strokeWidth="2" />
      <text x="80" y="66" textAnchor="middle" fontSize="16" fontWeight="bold">C</text>
      
      <line x1="80" y1="80" x2="80" y2="120" stroke={ACCENT} strokeWidth="4" />
      
      <circle cx="80" cy="140" r="25" fill={ACCENT} stroke={INK} strokeWidth="2" />
      <text x="80" y="148" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white">A</text>
    </g>

    <path d="M140,140 L200,140" stroke={INK} strokeWidth="2" markerEnd="url(#arrowSm)" strokeDasharray="6,4"/>

    {/* Right: Collection Phase */}
    <g transform="translate(220, 50)">
       <text x="150" y="0" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#65a30d">Phase 2: Harvest (DFS)</text>
       <text x="150" y="20" textAnchor="middle" fontSize="12" fill="#78716c">Collect all words below 'A'</text>

       {/* Subtree */}
       <circle cx="150" cy="60" r="25" fill={ACCENT} stroke={INK} strokeWidth="2" />
       <text x="150" y="68" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white">A</text>

       {/* Branch 1 */}
       <line x1="140" y1="80" x2="80" y2="150" stroke={INK} strokeWidth="2" />
       <circle cx="80" cy="150" r="20" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
       <text x="80" y="156" textAnchor="middle" fontSize="16" fontWeight="bold">T</text>
       <text x="80" y="185" textAnchor="middle" fontSize="14" fill="#16a34a" fontWeight="bold">"CAT"</text>

       {/* Branch 2 */}
       <line x1="160" y1="80" x2="220" y2="150" stroke={INK} strokeWidth="2" />
       <circle cx="220" cy="150" r="20" fill={PAPER} stroke={INK} strokeWidth="2" />
       <text x="220" y="156" textAnchor="middle" fontSize="16" fontWeight="bold">R</text>
       
       <line x1="220" y1="170" x2="220" y2="220" stroke={INK} strokeWidth="2" />
       <circle cx="220" cy="240" r="20" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
       <text x="220" y="246" textAnchor="middle" fontSize="16" fontWeight="bold">S</text>
       <text x="220" y="275" textAnchor="middle" fontSize="14" fill="#16a34a" fontWeight="bold">"CARS"</text>
    </g>
  </svg>
);

// --- Simulator (Unchanged Logic, just ensuring export) ---

export const AutocompleteSimulator = () => {
  const [input, setInput] = useState("");
  
  const dictionary = ["magic", "mage", "magnet", "map", "mars", "mint"];
  
  const matches = input 
    ? dictionary.filter(w => w.startsWith(input.toLowerCase()))
    : [];

  const INK = "#433422";
  const ACTIVE = "#d97706";
  const INACTIVE = "#a8a29e";

  const getNodeColor = (char: string, depth: number) => {
    if (!input) return INACTIVE;
    if (input.length > depth && input[depth] === char) return ACTIVE;
    return INACTIVE;
  };

  return (
    <div className="bg-[#fefce8] p-8 rounded-xl border-2 border-[#e7e5e4] shadow-cozy w-full">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        
        {/* Input Section */}
        <div className="w-full md:w-1/3 space-y-6">
          <div>
            <label className="block text-[#78716c] font-serif italic mb-2">Write in the Tome...</label>
            <div className="relative group">
              <Search className="absolute left-3 top-3 text-[#d97706]" size={18} />
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="try 'ma'..."
                className="w-full bg-[#fffbeb] border-b-2 border-[#d6d3d1] py-2 pl-10 pr-4 text-[#433422] font-serif text-lg focus:outline-none focus:border-[#d97706] transition-colors placeholder:text-[#d6d3d1]"
                maxLength={5}
              />
            </div>
          </div>
          
          <div className="bg-[#fff7ed] rounded-lg p-4 min-h-[140px] border border-[#ffedd5] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Sparkles className="text-[#d97706]" size={40} />
            </div>
            <h4 className="text-xs uppercase text-[#9a3412] font-bold mb-3 tracking-widest border-b border-[#fed7aa] pb-1">Divinations</h4>
            {matches.length > 0 ? (
              <ul className="space-y-2">
                {matches.map(m => (
                  <li key={m} className="text-[#433422] font-serif text-lg flex items-center">
                    <span className="text-[#d97706] font-bold border-b-2 border-[#d97706]/20 mr-1">{input}</span>
                    <span>{m.slice(input.length)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-[#a8a29e] text-sm italic font-serif mt-4">The pages are silent...</div>
            )}
          </div>
        </div>

        {/* Visualization Section */}
        <div className="w-full md:w-2/3 h-[400px] bg-[#fffbeb] rounded-xl border border-[#e7e5e4] relative overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
          
          <svg viewBox="0 0 400 200" className="w-full h-full relative z-10">
             <defs>
               <marker id="arrowHead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                 <polygon points="0 0, 10 3.5, 0 7" fill="#78716c" />
               </marker>
             </defs>

             {/* Root */}
             <circle cx="200" cy="20" r="8" fill={input.length > 0 ? ACTIVE : INK} />
             
             {/* Level 1 */}
             <line x1="200" y1="20" x2="200" y2="60" stroke={input.length > 0 && input[0] === 'm' ? ACTIVE : INACTIVE} strokeWidth="3" strokeLinecap="round" />
             <circle cx="200" cy="60" r="16" fill="#fff" stroke={getNodeColor('m', 0)} strokeWidth="2" />
             <text x="200" y="66" textAnchor="middle" fill={INK} fontSize="14" fontWeight="bold">m</text>

             {/* Level 2 */}
             {/* M -> A */}
             <line x1="200" y1="76" x2="150" y2="100" stroke={input.length > 1 && input[1] === 'a' ? ACTIVE : INACTIVE} strokeWidth="2" />
             <circle cx="150" cy="100" r="16" fill="#fff" stroke={getNodeColor('a', 1)} strokeWidth="2" />
             <text x="150" y="106" textAnchor="middle" fill={INK} fontSize="14" fontWeight="bold">a</text>
             
             {/* M -> I */}
             <line x1="200" y1="76" x2="250" y2="100" stroke={input.length > 1 && input[1] === 'i' ? ACTIVE : INACTIVE} strokeWidth="2" />
             <circle cx="250" cy="100" r="16" fill="#fff" stroke={getNodeColor('i', 1)} strokeWidth="2" />
             <text x="250" y="106" textAnchor="middle" fill={INK} fontSize="14" fontWeight="bold">i</text>

             {/* Level 3 */}
             <line x1="150" y1="116" x2="110" y2="150" stroke={input.length > 2 && input[2] === 'g' ? ACTIVE : INACTIVE} strokeWidth="2" />
             <circle cx="110" cy="150" r="16" fill="#fff" stroke={getNodeColor('g', 2)} strokeWidth="2" />
             <text x="110" y="156" textAnchor="middle" fill={INK} fontSize="14" fontWeight="bold">g</text>

             <line x1="150" y1="116" x2="150" y2="150" stroke={input.length > 2 && input[2] === 'p' ? ACTIVE : INACTIVE} strokeWidth="2" />
             <circle cx="150" cy="150" r="16" fill="#fff" stroke={getNodeColor('p', 2)} strokeWidth="2" />
             <text x="150" y="156" textAnchor="middle" fill={INK} fontSize="14" fontWeight="bold">p</text>

             <line x1="150" y1="116" x2="190" y2="150" stroke={input.length > 2 && input[2] === 'r' ? ACTIVE : INACTIVE} strokeWidth="2" />
             <circle cx="190" cy="150" r="16" fill="#fff" stroke={getNodeColor('r', 2)} strokeWidth="2" />
             <text x="190" y="156" textAnchor="middle" fill={INK} fontSize="14" fontWeight="bold">r</text>

             <line x1="250" y1="116" x2="250" y2="150" stroke={input.length > 2 && input[2] === 'n' ? ACTIVE : INACTIVE} strokeWidth="2" />
             <circle cx="250" cy="150" r="16" fill="#fff" stroke={getNodeColor('n', 2)} strokeWidth="2" />
             <text x="250" y="156" textAnchor="middle" fill={INK} fontSize="14" fontWeight="bold">n</text>

             <text x="320" y="180" fill={ACTIVE} fontSize="12" fontStyle="italic">Active Path</text>
             <circle cx="310" cy="177" r="4" fill={ACTIVE} />
          </svg>
        </div>
      </div>
    </div>
  );
};
