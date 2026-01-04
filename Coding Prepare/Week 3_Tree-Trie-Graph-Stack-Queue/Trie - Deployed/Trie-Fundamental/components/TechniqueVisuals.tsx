
import React from 'react';

const INK = "#433422";
const ACCENT = "#d97706";
const PAPER = "#fefce8";

export const VisualEmptyTrie = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full">
    <text x="200" y="30" textAnchor="middle" fill={INK} fontSize="16" fontWeight="bold">The Void</text>
    <circle cx="200" cy="120" r="40" fill={PAPER} stroke={INK} strokeWidth="3" />
    <text x="200" y="125" textAnchor="middle" fontSize="14" fill={INK} fontWeight="bold">ROOT</text>
    <path d="M160,120 L100,120" stroke={ACCENT} strokeWidth="2" strokeDasharray="4,2" />
    <text x="90" y="125" textAnchor="middle" fontSize="20">🚫</text>
    <text x="200" y="200" textAnchor="middle" fontSize="14" fill={INK} fontStyle="italic">No children. No paths.</text>
  </svg>
);

export const VisualEmptyInsert = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full">
    <text x="200" y="30" textAnchor="middle" fill={INK} fontSize="16" fontWeight="bold">The Silent Seed</text>
    <circle cx="200" cy="120" r="40" fill="#fecaca" stroke="#be123c" strokeWidth="4" />
    <text x="200" y="125" textAnchor="middle" fontSize="14" fill="#be123c" fontWeight="bold">ROOT</text>
    
    {/* Glow effect */}
    <circle cx="200" cy="120" r="50" fill="none" stroke="#be123c" strokeWidth="1" strokeDasharray="4,4" opacity="0.6">
        <animate attributeName="r" values="50;55;50" dur="2s" repeatCount="indefinite" />
    </circle>
    
    <text x="200" y="200" textAnchor="middle" fontSize="14" fill={INK} fontStyle="italic">Root is now a Word.</text>
  </svg>
);

export const VisualWeaver = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full">
    <text x="200" y="30" textAnchor="middle" fill={INK} fontSize="16" fontWeight="bold">The Weaver</text>
    
    <rect x="50" y="60" width="60" height="30" fill="#fff" stroke={INK} />
    <text x="80" y="80" textAnchor="middle" fontSize="12">WORD 1</text>
    
    <rect x="50" y="100" width="60" height="30" fill="#fff" stroke={INK} />
    <text x="80" y="120" textAnchor="middle" fontSize="12">WORD 2</text>
    
    <path d="M110,75 Q150,75 180,100" fill="none" stroke={ACCENT} strokeWidth="2" />
    <path d="M110,115 Q150,115 180,100" fill="none" stroke={ACCENT} strokeWidth="2" />
    
    <circle cx="200" cy="120" r="30" fill={PAPER} stroke={INK} strokeWidth="2" />
    <text x="200" y="125" textAnchor="middle" fontSize="12">TRIE</text>
    
    <text x="200" y="200" textAnchor="middle" fontSize="14" fill={INK} fontStyle="italic">Many threads, one basket.</text>
  </svg>
);

export const VisualScale = () => (
  <svg viewBox="0 0 400 250" className="w-full h-full">
    <text x="200" y="30" textAnchor="middle" fill={INK} fontSize="16" fontWeight="bold">The Scale</text>
    
    {/* Left: Huge Pile */}
    <rect x="50" y="80" width="80" height="100" fill="#e5e7eb" stroke={INK} />
    <text x="90" y="130" textAnchor="middle" fontSize="12">N Words</text>
    <text x="90" y="200" textAnchor="middle" fontSize="12" fill="#be123c">Heavy (O(n))</text>

    {/* Right: Thin Path */}
    <path d="M250,80 L250,180" stroke={ACCENT} strokeWidth="4" />
    <text x="280" y="130" textAnchor="middle" fontSize="12" fill={ACCENT}>Length K</text>
    <text x="280" y="200" textAnchor="middle" fontSize="12" fill="#65a30d">Light (O(k))</text>
    
    <text x="200" y="225" textAnchor="middle" fontSize="14" fill={INK} fontStyle="italic">Ignore the pile. Walk the path.</text>
  </svg>
);
