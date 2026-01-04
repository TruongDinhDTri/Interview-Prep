
import React from 'react';

const INK = "#433422";
const PAPER = "#fdf6e3";
const ACCENT_ORANGE = "#d97706";
const ACCENT_GREEN = "#65a30d";
const ACCENT_RED = "#be123c";

// --- Algorithm Concept Visuals (Headers) ---

export const VisualBasicConcept = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full">
    <rect x="80" y="30" width="240" height="180" rx="8" fill="#fff" stroke={INK} strokeWidth="2" strokeDasharray="6,6" />
    <text x="200" y="25" textAnchor="middle" fill={INK} fontSize="16" fontWeight="bold">The Blueprint</text>
    
    <circle cx="200" cy="120" r="40" fill={ACCENT_ORANGE} opacity="0.15" />
    <circle cx="200" cy="120" r="8" fill={INK} />
    
    <path d="M200,120 L270,170" stroke={INK} strokeWidth="3" markerEnd="url(#arrow)" />
    <path d="M200,120 L130,170" stroke={INK} strokeWidth="3" markerEnd="url(#arrow)" />
    
    <text x="200" y="90" textAnchor="middle" fontSize="14" fill={INK} fontWeight="bold">Node</text>
    <text x="260" y="200" textAnchor="middle" fontSize="12" fill={ACCENT_ORANGE} fontWeight="bold">Points to Next</text>
  </svg>
);

export const VisualInsertConcept = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full">
    {/* Map Background */}
    <rect x="40" y="20" width="320" height="210" rx="4" fill="#fffbeb" stroke="#e7e5e4" strokeWidth="2" />
    <path d="M50,100 Q150,50 250,150 T350,100" fill="none" stroke="#d6d3d1" strokeWidth="3" strokeDasharray="8,6" />
    
    {/* Nodes being built */}
    <circle cx="100" cy="85" r="14" fill={INK} />
    <circle cx="180" cy="110" r="14" fill={ACCENT_ORANGE} />
    <line x1="100" y1="85" x2="180" y2="110" stroke={INK} strokeWidth="3" />
    
    {/* New Path construction */}
    <line x1="180" y1="110" x2="250" y2="150" stroke={ACCENT_ORANGE} strokeWidth="4" strokeDasharray="6,4" />
    <circle cx="250" cy="150" r="14" fill="none" stroke={ACCENT_ORANGE} strokeWidth="3" />
    
    <text x="250" y="190" textAnchor="middle" fontSize="14" fill={ACCENT_ORANGE} fontWeight="bold">Building...</text>
    <text x="200" y="240" textAnchor="middle" fontSize="16" fontWeight="bold" fill={INK}>The Cartographer</text>
  </svg>
);

export const VisualSearchConcept = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full">
    {/* Footsteps */}
    <g opacity="0.6">
      <ellipse cx="100" cy="120" rx="10" ry="16" fill={INK} transform="rotate(10 100 120)" />
      <ellipse cx="150" cy="90" rx="10" ry="16" fill={INK} transform="rotate(25 150 90)" />
      <ellipse cx="200" cy="130" rx="10" ry="16" fill={INK} transform="rotate(-10 200 130)" />
    </g>
    
    {/* Magnifying Glass */}
    <g transform="translate(240, 90)">
       <circle cx="0" cy="0" r="40" fill="none" stroke={ACCENT_ORANGE} strokeWidth="5" />
       <line x1="28" y1="28" x2="55" y2="55" stroke={ACCENT_ORANGE} strokeWidth="6" strokeLinecap="round" />
       {/* Target inside glass */}
       <text x="0" y="10" textAnchor="middle" fontSize="32" fill={INK} fontWeight="bold">?</text>
    </g>
    
    <text x="200" y="240" textAnchor="middle" fontSize="16" fontWeight="bold" fill={INK}>The Tracker</text>
  </svg>
);

export const VisualStartsWithConcept = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full">
    {/* Horizon Line */}
    <path d="M40,160 Q200,120 360,160" fill="none" stroke={INK} strokeWidth="3" />
    
    {/* Binoculars View */}
    <defs>
      <clipPath id="circleView">
         <circle cx="200" cy="100" r="70" />
      </clipPath>
    </defs>
    
    <circle cx="200" cy="100" r="70" fill="#e0f2fe" stroke={ACCENT_GREEN} strokeWidth="5" />
    <g clipPath="url(#circleView)">
       {/* Tree in distance */}
       <path d="M200,150 L200,70" stroke={INK} strokeWidth="6" />
       <circle cx="200" cy="70" r="30" fill={ACCENT_GREEN} />
    </g>
    
    <text x="200" y="200" textAnchor="middle" fontSize="14" fill={ACCENT_GREEN} fontStyle="italic">"I see the path ahead!"</text>
    <text x="200" y="240" textAnchor="middle" fontSize="16" fontWeight="bold" fill={INK}>The Scout</text>
  </svg>
);

export const VisualDeleteConcept = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full">
    <defs>
      <marker id="arrowRed" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill={ACCENT_RED} />
      </marker>
      <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
      </marker>
    </defs>

    {/* LEFT: Tree Structure */}
    <g transform="translate(0, 20)">
        <text x="100" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill={INK}>The Tree</text>
        
        {/* Root */}
        <circle cx="100" cy="50" r="15" fill={PAPER} stroke={INK} strokeWidth="2" />
        <line x1="100" y1="65" x2="80" y2="100" stroke={INK} strokeWidth="2" />
        <line x1="100" y1="65" x2="120" y2="100" stroke={INK} strokeWidth="2" />
        
        {/* Child 1 (Keep) */}
        <circle cx="80" cy="100" r="12" fill="#dcfce7" stroke={ACCENT_GREEN} strokeWidth="2" />
        
        {/* Child 2 (Delete Chain) */}
        <circle cx="120" cy="100" r="12" fill={PAPER} stroke={INK} strokeWidth="2" />
        <text x="120" y="104" textAnchor="middle" fontSize="10">A</text>
        <line x1="120" y1="112" x2="120" y2="140" stroke={INK} strokeWidth="2" />
        
        <circle cx="120" cy="140" r="12" fill="#fecaca" stroke={ACCENT_RED} strokeWidth="2" />
        <text x="120" y="144" textAnchor="middle" fontSize="10">B</text>
    </g>

    {/* RIGHT: Recursion Stack */}
    <g transform="translate(200, 20)">
        <text x="100" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill={INK}>The Recursion Stack</text>
        
        {/* Stack Frame 1 */}
        <rect x="50" y="40" width="100" height="30" fill="#eff6ff" stroke="#3b82f6" rx="4" />
        <text x="100" y="60" textAnchor="middle" fontSize="12">1. delete(Root)</text>
        
        {/* Down Arrow */}
        <path d="M100,70 L100,85" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowBlue)" />

        {/* Stack Frame 2 */}
        <rect x="50" y="90" width="100" height="30" fill="#eff6ff" stroke="#3b82f6" rx="4" />
        <text x="100" y="110" textAnchor="middle" fontSize="12">2. delete(A)</text>
        
         {/* Down Arrow */}
        <path d="M100,120 L100,135" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowBlue)" />

        {/* Stack Frame 3 */}
        <rect x="50" y="140" width="100" height="30" fill="#eff6ff" stroke="#3b82f6" rx="4" />
        <text x="100" y="160" textAnchor="middle" fontSize="12">3. delete(B)</text>
    </g>
    
    {/* Return Arrow (Bubble Up) */}
    <path d="M280,155 Q320,115 280,105" fill="none" stroke={ACCENT_RED} strokeWidth="2" markerEnd="url(#arrowRed)" strokeDasharray="4,2" />
    <text x="340" y="130" textAnchor="middle" fontSize="10" fill={ACCENT_RED} fontWeight="bold">Return True</text>
    <text x="340" y="142" textAnchor="middle" fontSize="10" fill={ACCENT_RED}>(Clean Up)</text>

    <text x="200" y="230" textAnchor="middle" fontSize="16" fontWeight="bold" fill={INK}>The Pruner</text>
  </svg>
);


// --- Fundamental Visuals (Deep Dive & Bigger) ---

export const VisualWhat = () => (
  <svg viewBox="0 0 600 400" className="w-full h-full">
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill={INK} />
      </marker>
    </defs>
    
    <text x="300" y="30" textAnchor="middle" fill={INK} fontSize="20" fontFamily="serif" fontWeight="bold">The Structural Difference</text>

    {/* Left: The List (Redundant) */}
    <g transform="translate(50, 80)">
      <text x="80" y="-15" textAnchor="middle" fill={INK} fontSize="16" fontWeight="bold">List (Array)</text>
      
      {/* Box 1: TEA */}
      <rect x="0" y="10" width="160" height="40" rx="4" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1"/>
      <text x="20" y="35" fontFamily="monospace" fontSize="18">"TEA"</text>
      
      {/* Box 2: TED */}
      <rect x="0" y="60" width="160" height="40" rx="4" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1"/>
      <text x="20" y="85" fontFamily="monospace" fontSize="18">"TED"</text>
      
      {/* Box 3: TEN */}
      <rect x="0" y="110" width="160" height="40" rx="4" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1"/>
      <text x="20" y="135" fontFamily="monospace" fontSize="18">"TEN"</text>

      {/* Red Highlight showing redundancy */}
      <rect x="15" y="5" width="35" height="150" fill="none" stroke={ACCENT_RED} strokeWidth="3" strokeDasharray="6,4" rx="4"/>
      <text x="80" y="180" textAnchor="middle" fill={ACCENT_RED} fontSize="14" fontWeight="bold">"T-E" stored 3 times!</text>
    </g>

    {/* Right: The Trie (Efficient) */}
    <g transform="translate(350, 80)">
       <text x="100" y="-15" textAnchor="middle" fill={INK} fontSize="16" fontWeight="bold">Trie (Prefix Tree)</text>
       
       {/* Root */}
       <circle cx="100" cy="10" r="6" fill={INK} />
       
       {/* T */}
       <line x1="100" y1="10" x2="100" y2="50" stroke={INK} strokeWidth="2" />
       <circle cx="100" cy="50" r="16" fill={PAPER} stroke={INK} strokeWidth="2" />
       <text x="100" y="55" textAnchor="middle" fontSize="14" fontWeight="bold">T</text>
       
       {/* E */}
       <line x1="100" y1="66" x2="100" y2="100" stroke={INK} strokeWidth="2" />
       <circle cx="100" cy="100" r="16" fill={PAPER} stroke={INK} strokeWidth="2" />
       <text x="100" y="105" textAnchor="middle" fontSize="14" fontWeight="bold">E</text>

       {/* Branching */}
       <line x1="100" y1="116" x2="40" y2="160" stroke={INK} strokeWidth="2" />
       <circle cx="40" cy="160" r="16" fill="#dcfce7" stroke={ACCENT_GREEN} strokeWidth="2" />
       <text x="40" y="165" textAnchor="middle" fontSize="14" fontWeight="bold">A</text>

       <line x1="100" y1="116" x2="100" y2="160" stroke={INK} strokeWidth="2" />
       <circle cx="100" cy="160" r="16" fill="#dcfce7" stroke={ACCENT_GREEN} strokeWidth="2" />
       <text x="100" y="165" textAnchor="middle" fontSize="14" fontWeight="bold">D</text>

       <line x1="100" y1="116" x2="160" y2="160" stroke={INK} strokeWidth="2" />
       <circle cx="160" cy="160" r="16" fill="#dcfce7" stroke={ACCENT_GREEN} strokeWidth="2" />
       <text x="160" y="165" textAnchor="middle" fontSize="14" fontWeight="bold">N</text>
       
       {/* Green Highlight */}
       <rect x="80" y="40" width="40" height="75" fill="none" stroke={ACCENT_GREEN} strokeWidth="3" strokeDasharray="6,4" rx="8"/>
       <text x="180" y="80" textAnchor="start" fill={ACCENT_GREEN} fontSize="14" fontWeight="bold">"T-E" stored ONCE</text>
    </g>
  </svg>
);

export const VisualWhy = () => (
  <svg viewBox="0 0 600 400" className="w-full h-full">
    <text x="300" y="30" textAnchor="middle" fill={INK} fontSize="20" fontFamily="serif" fontWeight="bold">Complexity: Length vs. Volume</text>
    
    {/* Grid Lines */}
    <line x1="50" y1="350" x2="550" y2="350" stroke="#e5e7eb" strokeWidth="2" />
    <line x1="50" y1="350" x2="50" y2="50" stroke="#e5e7eb" strokeWidth="2" />
    
    <text x="50" y="380" textAnchor="middle" fontSize="12">0 Words</text>
    <text x="300" y="380" textAnchor="middle" fontSize="12">1,000,000 Words</text>
    <text x="550" y="380" textAnchor="middle" fontSize="12">1 Billion Words</text>
    
    {/* Line 1: Linear Search */}
    <path d="M50,350 L550,50" fill="none" stroke={ACCENT_RED} strokeWidth="4" />
    <text x="450" y="100" fill={ACCENT_RED} fontSize="18" fontWeight="bold">List Search: O(N)</text>
    <text x="450" y="125" fill={ACCENT_RED} fontSize="12">Gets slower as you add data</text>

    {/* Line 2: Trie Search */}
    <line x1="50" y1="280" x2="550" y2="280" stroke={ACCENT_GREEN} strokeWidth="4" strokeDasharray="8,6" />
    <text x="450" y="260" fill={ACCENT_GREEN} fontSize="18" fontWeight="bold">Trie Search: O(L)</text>
    <text x="450" y="295" fill={ACCENT_GREEN} fontSize="12">Constant speed (for word length L)</text>
    
    {/* Example Point */}
    <circle cx="300" cy="280" r="8" fill={ACCENT_GREEN} />
    <text x="300" y="250" textAnchor="middle" fontSize="12" fill={INK} fontStyle="italic">Finding "CAT" takes 3 steps.</text>
    <text x="300" y="265" textAnchor="middle" fontSize="12" fill={INK} fontStyle="italic">Always.</text>
  </svg>
);

export const VisualHow = () => (
  <svg viewBox="0 0 600 400" className="w-full h-full">
    <text x="300" y="30" textAnchor="middle" fill={INK} fontSize="20" fontFamily="serif" fontWeight="bold">The Hierarchy of Characters</text>
    
    {/* Levels Indicator */}
    <g opacity="0.1">
       <rect x="50" y="60" width="500" height="60" fill={INK} />
       <rect x="50" y="160" width="500" height="60" fill={INK} />
       <rect x="50" y="260" width="500" height="60" fill={INK} />
    </g>
    <text x="40" y="95" textAnchor="end" fontSize="12" fill="#9ca3af">Level 0</text>
    <text x="40" y="195" textAnchor="end" fontSize="12" fill="#9ca3af">Level 1</text>
    <text x="40" y="295" textAnchor="end" fontSize="12" fill="#9ca3af">Level 2</text>

    {/* Tree */}
    <g transform="translate(300, 90)">
      {/* Root */}
      <circle cx="0" cy="0" r="25" fill="#f3f4f6" stroke={INK} strokeWidth="2" />
      <text x="0" y="5" textAnchor="middle" fontSize="12" fontWeight="bold">ROOT</text>
      
      {/* Connections */}
      <line x1="0" y1="25" x2="-100" y2="100" stroke={INK} strokeWidth="2" />
      <line x1="0" y1="25" x2="100" y2="100" stroke={INK} strokeWidth="2" />
      
      {/* Level 1 Nodes */}
      <circle cx="-100" cy="100" r="25" fill={PAPER} stroke={INK} strokeWidth="2" />
      <text x="-100" y="108" textAnchor="middle" fontSize="18" fontWeight="bold">C</text>
      
      <circle cx="100" cy="100" r="25" fill={PAPER} stroke={INK} strokeWidth="2" />
      <text x="100" y="108" textAnchor="middle" fontSize="18" fontWeight="bold">M</text>

      {/* Level 2 Connections */}
      <line x1="-100" y1="125" x2="-140" y2="200" stroke={INK} strokeWidth="2" />
      <line x1="-100" y1="125" x2="-60" y2="200" stroke={INK} strokeWidth="2" />

      {/* Level 2 Nodes */}
      <circle cx="-140" cy="200" r="25" fill={PAPER} stroke={INK} strokeWidth="2" />
      <text x="-140" y="208" textAnchor="middle" fontSize="18" fontWeight="bold">A</text>
      <text x="-140" y="245" textAnchor="middle" fontSize="12" fill={ACCENT_ORANGE}>("CA")</text>

      <circle cx="-60" cy="200" r="25" fill={PAPER} stroke={INK} strokeWidth="2" />
      <text x="-60" y="208" textAnchor="middle" fontSize="18" fontWeight="bold">U</text>
      <text x="-60" y="245" textAnchor="middle" fontSize="12" fill={ACCENT_ORANGE}>("CU")</text>
    </g>
  </svg>
);

// --- Anatomy Visuals (Technical & Clean & Bigger) ---

export const VisualRoot = () => (
  <svg viewBox="0 0 300 300" className="w-full h-full">
    {/* Background */}
    <rect width="300" height="300" fill="#fafaf9" opacity="0.5"/>
    
    {/* The Root Node */}
    <circle cx="150" cy="80" r="35" fill="#e5e5e5" stroke={INK} strokeWidth="4" strokeDasharray="6,4"/>
    <text x="150" y="85" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#737373">EMPTY</text>

    {/* Arrows */}
    <path d="M150,115 L100,180" stroke={INK} strokeWidth="3" markerEnd="url(#arrow)" />
    <path d="M150,115 L200,180" stroke={INK} strokeWidth="3" markerEnd="url(#arrow)" />

    {/* Children */}
    <circle cx="100" cy="210" r="20" fill={PAPER} stroke={INK} strokeWidth="2" />
    <text x="100" y="217" textAnchor="middle" fontSize="18" fontWeight="bold">A</text>

    <circle cx="200" cy="210" r="20" fill={PAPER} stroke={INK} strokeWidth="2" />
    <text x="200" y="217" textAnchor="middle" fontSize="18" fontWeight="bold">Z</text>

    <text x="150" y="270" textAnchor="middle" fontSize="16" fill={INK} fontWeight="bold">The Starting Point</text>
    <text x="150" y="290" textAnchor="middle" fontSize="12" fill="#525252">Points to the first letters. Holds no character itself.</text>
  </svg>
);

export const VisualNode = () => (
  <svg viewBox="0 0 300 300" className="w-full h-full">
    {/* The Node Object */}
    <rect x="50" y="60" width="200" height="150" rx="15" fill="#fff" stroke={INK} strokeWidth="3" />
    
    {/* Character */}
    <circle cx="150" cy="50" r="35" fill={ACCENT_ORANGE} stroke={INK} strokeWidth="3" />
    <text x="150" y="62" textAnchor="middle" fontSize="32" fill="white" fontWeight="bold">B</text>
    
    {/* Map Representation */}
    <text x="150" y="120" textAnchor="middle" fontSize="16" fontWeight="bold" fill={INK} textDecoration="underline">Children Map</text>
    <text x="150" y="145" textAnchor="middle" fontSize="14" fontFamily="monospace" fill="#525252">{'{"a": Node, "e": Node}'}</text>
    
    <text x="150" y="180" textAnchor="middle" fontSize="16" fontWeight="bold" fill={INK} textDecoration="underline">End Flag</text>
    <text x="150" y="205" textAnchor="middle" fontSize="14" fontFamily="monospace" fill="#be123c">False</text>
    
    <text x="150" y="250" textAnchor="middle" fontSize="14" fill={INK} fontStyle="italic">A container for data and pointers.</text>
  </svg>
);

export const VisualEdge = () => (
  <svg viewBox="0 0 300 300" className="w-full h-full">
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill={INK} />
      </marker>
    </defs>

    {/* Parent */}
    <circle cx="50" cy="150" r="30" fill={PAPER} stroke={INK} strokeWidth="3" />
    <text x="50" y="158" textAnchor="middle" fontSize="20" fontWeight="bold">H</text>

    {/* Child */}
    <circle cx="250" cy="150" r="30" fill={PAPER} stroke={INK} strokeWidth="3" />
    <text x="250" y="158" textAnchor="middle" fontSize="20" fontWeight="bold">E</text>

    {/* The Edge */}
    <line x1="80" y1="150" x2="210" y2="150" stroke={INK} strokeWidth="4" markerEnd="url(#arrow)" />
    
    {/* Label */}
    <rect x="100" y="120" width="100" height="40" fill="#fff" stroke="#e5e5e5" rx="6" />
    <text x="150" y="145" textAnchor="middle" fontSize="14" fontFamily="monospace">children['e']</text>

    <text x="150" y="220" textAnchor="middle" fontSize="16" fill={INK} fontWeight="bold">The Reference</text>
    <text x="150" y="240" textAnchor="middle" fontSize="12" fill="#525252">Not a physical line. A memory pointer.</text>
  </svg>
);

export const VisualMarker = () => (
  <svg viewBox="0 0 300 300" className="w-full h-full">
    {/* Path S-H-E */}
    <text x="150" y="50" textAnchor="middle" fontSize="14" fill="#525252">Path for "SHE"</text>

    <g transform="translate(50, 150)">
      <circle cx="0" cy="0" r="20" fill={PAPER} stroke={INK} strokeWidth="2" />
      <text x="0" y="6" textAnchor="middle" fontSize="16" fontWeight="bold">S</text>
    </g>
    <line x1="70" y1="150" x2="130" y2="150" stroke={INK} strokeWidth="2" />
    
    <g transform="translate(150, 150)">
      <circle cx="0" cy="0" r="20" fill={PAPER} stroke={INK} strokeWidth="2" />
      <text x="0" y="6" textAnchor="middle" fontSize="16" fontWeight="bold">H</text>
    </g>
    <line x1="170" y1="150" x2="230" y2="150" stroke={INK} strokeWidth="2" />

    {/* The Marked Node */}
    <g transform="translate(250, 150)">
      {/* Glow Effect */}
      <circle cx="0" cy="0" r="28" fill="none" stroke={ACCENT_RED} strokeWidth="2" strokeDasharray="4,2">
         <animate attributeName="r" values="28;32;28" dur="2s" repeatCount="indefinite" />
         <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="0" cy="0" r="24" fill="#fecaca" stroke={ACCENT_RED} strokeWidth="3" />
      <text x="0" y="8" textAnchor="middle" fontSize="20" fontWeight="bold" fill={ACCENT_RED}>E</text>
    </g>
    
    <text x="150" y="220" textAnchor="middle" fontSize="16" fill={ACCENT_RED} fontWeight="bold">is_end = True</text>
    <text x="150" y="245" textAnchor="middle" fontSize="12" fill="#525252">Marks that "SHE" is a valid word.</text>
    <text x="150" y="265" textAnchor="middle" fontSize="12" fill="#525252">("SH" is just a prefix, no marker)</text>
  </svg>
);
