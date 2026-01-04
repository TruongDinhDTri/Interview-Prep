import React from 'react';

type CodeVisualType = 'NODE' | 'INSERT' | 'SEARCH' | 'STARTSWITH' | 'DELETE';

const INK = "#433422";
const PAPER = "#fefce8";
const GREEN = "#65a30d";
const ORANGE = "#d97706";
const RED = "#be123c";

export const VisualCodeCompanion: React.FC<{ type: CodeVisualType }> = ({ type }) => {
  const renderContent = () => {
    switch (type) {
      case 'NODE':
        return (
          <svg viewBox="0 0 300 200" className="w-full h-full">
            {/* Box representing the class */}
            <rect x="50" y="40" width="200" height="120" rx="2" fill="#fffbeb" stroke={INK} strokeWidth="2" />
            <line x1="50" y1="70" x2="250" y2="70" stroke={INK} strokeWidth="1" />
            
            <text x="150" y="62" textAnchor="middle" fill={INK} fontSize="16" fontFamily="serif" fontWeight="bold">Class TrieNode</text>
            
            {/* Attributes */}
            <circle cx="70" cy="95" r="4" fill={GREEN} />
            <text x="85" y="100" fill={INK} fontSize="14" fontFamily="monospace">children = {'{}'}</text>
            
            <circle cx="70" cy="125" r="4" fill={ORANGE} />
            <text x="85" y="130" fill={INK} fontSize="14" fontFamily="monospace">is_end = False</text>
            
            <text x="220" y="150" fill={INK} fontSize="10" opacity="0.5" fontStyle="italic">Blueprint</text>
          </svg>
        );
      case 'INSERT':
        return (
          <svg viewBox="0 0 300 200" className="w-full h-full">
             <defs>
               <marker id="arrowInsert" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                 <polygon points="0 0, 10 3.5, 0 7" fill={ORANGE} />
               </marker>
             </defs>
             {/* Existing Path C -> A */}
             <circle cx="150" cy="30" r="12" fill={PAPER} stroke={INK} strokeWidth="2" />
             <line x1="150" y1="42" x2="100" y2="80" stroke={INK} strokeWidth="2" />
             <circle cx="100" cy="80" r="15" fill={PAPER} stroke={INK} strokeWidth="2" />
             <text x="100" y="85" textAnchor="middle" fill={INK} fontSize="12" fontWeight="bold">C</text>

             <line x1="100" y1="95" x2="100" y2="135" stroke={INK} strokeWidth="2" />
             <circle cx="100" cy="135" r="15" fill={PAPER} stroke={INK} strokeWidth="2" />
             <text x="100" y="140" textAnchor="middle" fill={INK} fontSize="12" fontWeight="bold">A</text>

             {/* New Insert Action -> R */}
             <path d="M115,135 Q160,135 175,100" fill="none" stroke={ORANGE} strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowInsert)" />
             
             <circle cx="190" cy="90" r="15" fill="#fff7ed" stroke={ORANGE} strokeWidth="2" />
             <text x="190" y="95" textAnchor="middle" fill={ORANGE} fontSize="12" fontWeight="bold">R</text>
             
             <text x="200" y="130" fill={ORANGE} fontSize="12" fontFamily="serif" fontStyle="italic">New Branch</text>
          </svg>
        );
      case 'SEARCH':
        return (
           <svg viewBox="0 0 300 200" className="w-full h-full">
             {/* Path Highlight */}
             <path d="M150,30 L100,80 L100,135" stroke={GREEN} strokeWidth="8" opacity="0.2" fill="none" strokeLinecap="round" />
             
             <circle cx="150" cy="30" r="10" fill={INK} />
             
             <line x1="150" y1="40" x2="100" y2="80" stroke={INK} strokeWidth="2" />
             <circle cx="100" cy="80" r="15" fill={PAPER} stroke={INK} strokeWidth="2" />
             <text x="100" y="85" textAnchor="middle" fill={INK} fontSize="12" fontWeight="bold">C</text>

             <line x1="100" y1="95" x2="100" y2="135" stroke={INK} strokeWidth="2" />
             <circle cx="100" cy="135" r="15" fill={PAPER} stroke={INK} strokeWidth="2" />
             <text x="100" y="140" textAnchor="middle" fill={INK} fontSize="12" fontWeight="bold">A</text>
             
             {/* Magnifying Glass Icon */}
             <g transform="translate(110, 110)">
               <circle cx="15" cy="15" r="12" fill="none" stroke={ORANGE} strokeWidth="3" />
               <line x1="25" y1="25" x2="35" y2="35" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
             </g>
             
             <rect x="150" y="60" width="100" height="40" rx="4" fill="#fff" stroke={ORANGE} strokeWidth="1" />
             <text x="160" y="75" fill={ORANGE} fontSize="10" fontWeight="bold" fontFamily="sans-serif">Searching...</text>
             <text x="160" y="90" fill={INK} fontSize="14" fontFamily="monospace">"CA"</text>
          </svg>
        );
      case 'STARTSWITH':
        return (
          <svg viewBox="0 0 300 200" className="w-full h-full">
             {/* Nodes */}
             <circle cx="150" cy="30" r="10" fill={INK} />
             
             <line x1="150" y1="40" x2="150" y2="80" stroke={INK} strokeWidth="2" />
             <circle cx="150" cy="80" r="15" fill={PAPER} stroke={INK} strokeWidth="2" />
             <text x="150" y="85" textAnchor="middle" fill={INK} fontSize="12">Z</text>
             
             {/* Subtree faded */}
             <g opacity="0.4">
                <line x1="150" y1="95" x2="120" y2="135" stroke={INK} strokeWidth="1" />
                <circle cx="120" cy="135" r="12" fill={PAPER} stroke={INK} strokeWidth="1" />
                <line x1="150" y1="95" x2="180" y2="135" stroke={INK} strokeWidth="1" />
                <circle cx="180" cy="135" r="12" fill={PAPER} stroke={INK} strokeWidth="1" />
             </g>

             {/* Checkmark */}
             <circle cx="150" cy="80" r="20" fill="none" stroke={GREEN} strokeWidth="3" />
             <path d="M180,60 L190,70 L210,50" stroke={GREEN} strokeWidth="3" fill="none" />
             
             <text x="190" y="90" fill={GREEN} fontSize="12" fontWeight="bold">Prefix Found</text>
             <text x="190" y="105" fill={INK} fontSize="10" fontStyle="italic">Don't need end!</text>
          </svg>
        );
      case 'DELETE':
        return (
          <svg viewBox="0 0 300 200" className="w-full h-full">
             {/* Tree Structure */}
             <circle cx="150" cy="30" r="10" fill={INK} />
             <line x1="150" y1="40" x2="150" y2="80" stroke={INK} strokeWidth="2" />
             <circle cx="150" cy="80" r="15" fill={PAPER} stroke={INK} strokeWidth="2" />
             <text x="150" y="85" textAnchor="middle" fill={INK} fontSize="12">B</text>

             <line x1="150" y1="95" x2="150" y2="135" stroke={INK} strokeWidth="2" strokeDasharray="4,2" />
             
             {/* Deletion Animation */}
             <g>
                <circle cx="150" cy="135" r="15" fill="#fecaca" stroke={RED}>
                   <animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite" />
                </circle>
                <text x="150" y="140" textAnchor="middle" fill={RED} fontSize="12">E</text>
                
                {/* Scissors */}
                <text x="175" y="120" fontSize="20">✂️</text>
             </g>
             
             <text x="180" y="140" fill={RED} fontSize="12" fontFamily="serif">Pruning...</text>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center p-4">
      {renderContent()}
    </div>
  );
};
