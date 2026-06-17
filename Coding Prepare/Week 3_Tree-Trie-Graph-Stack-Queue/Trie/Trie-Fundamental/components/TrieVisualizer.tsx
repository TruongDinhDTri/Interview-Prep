import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Leaf } from 'lucide-react';

interface VisualNode {
  id: string;
  char: string;
  x: number;
  y: number;
  children: VisualNode[];
  isEnd: boolean;
}

const buildTree = (words: string[], width: number): VisualNode => {
  const root: any = { id: 'root', char: 'ROOT', children: {}, isEnd: false };

  words.forEach((word) => {
    let current = root;
    for (const char of word) {
      if (!current.children[char]) {
        current.children[char] = { id: Math.random().toString(36), char, children: {}, isEnd: false };
      }
      current = current.children[char];
    }
    current.isEnd = true;
  });

  const processNode = (node: any, x: number, y: number, level: number, availableWidth: number): VisualNode => {
    const childKeys = Object.keys(node.children).sort();
    const childCount = childKeys.length;
    
    const processedChildren: VisualNode[] = [];
    
    if (childCount > 0) {
      const sectionWidth = availableWidth / childCount;
      let startX = x - (availableWidth / 2) + (sectionWidth / 2);
      
      childKeys.forEach((key, index) => {
        const childX = startX + (index * sectionWidth);
        const childY = y + 70; 
        processedChildren.push(processNode(node.children[key], childX, childY, level + 1, sectionWidth));
      });
    }

    return {
      id: node.id || 'root',
      char: node.char,
      x: x,
      y: y,
      children: processedChildren,
      isEnd: node.isEnd
    };
  };

  return processNode(root, width / 2, 50, 0, width - 40);
};

export const TrieVisualizer: React.FC = () => {
  const [words, setWords] = useState<string[]>(['tea', 'ted', 'ten']);
  const [inputValue, setInputValue] = useState('');
  const [treeData, setTreeData] = useState<VisualNode | null>(null);
  const [searchPath, setSearchPath] = useState<Set<string>>(new Set());

  useEffect(() => {
    setTreeData(buildTree(words, 800)); 
  }, [words]);

  const handleAdd = () => {
    if (inputValue && !words.includes(inputValue.toLowerCase()) && inputValue.length < 8) {
      setWords([...words, inputValue.toLowerCase()]);
      setInputValue('');
    }
  };

  const handleRemove = (wordToRemove: string) => {
    setWords(words.filter(w => w !== wordToRemove));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    const newPath = new Set<string>();
    
    if (treeData && val) {
       let current = treeData;
       newPath.add(current.id);
       for (const char of val) {
          const found = current.children.find(c => c.char === char);
          if (found) {
              newPath.add(found.id);
              current = found;
          } else {
              break;
          }
       }
    }
    setSearchPath(newPath);
  };

  const renderLinks = (node: VisualNode) => {
    return (
      <g key={`links-${node.id}`}>
        {node.children.map(child => {
          const isPathActive = searchPath.has(child.id) && searchPath.has(node.id);
          return (
          <React.Fragment key={`link-${node.id}-${child.id}`}>
            {/* Organic curved line */}
            <path
              d={`M${node.x},${node.y} C${node.x},${(node.y + child.y)/2} ${child.x},${(node.y + child.y)/2} ${child.x},${child.y}`}
              fill="none"
              stroke={isPathActive ? "#d97706" : "#78716c"}
              strokeWidth={isPathActive ? 3 : 1}
              opacity={isPathActive ? 1 : 0.4}
              strokeDasharray={isPathActive ? "none" : "4,2"}
            />
            {renderLinks(child)}
          </React.Fragment>
        )})}
      </g>
    );
  };

  const renderNodes = (node: VisualNode) => {
    const isGlowing = searchPath.has(node.id);
    const isRoot = node.char === 'ROOT';
    
    return (
      <g key={`node-${node.id}`}>
        {node.children.map(child => renderNodes(child))}
        
        {/* Shadow */}
        <circle cx={node.x} cy={node.y + 3} r={isRoot ? 25 : 20} fill="rgba(67, 52, 34, 0.1)" />
        
        {/* Node Body */}
        <circle
          cx={node.x}
          cy={node.y}
          r={isRoot ? 25 : 20}
          fill={isGlowing ? "#fffbeb" : (node.isEnd ? "#fef3c7" : "#fafaf9")}
          stroke={isGlowing ? "#d97706" : (node.isEnd ? "#be185d" : "#78716c")}
          strokeWidth={isGlowing ? 3 : 2}
          className="transition-all duration-300"
        />
        
        {/* Leaf decoration for End of Word */}
        {node.isEnd && (
           <g transform={`translate(${node.x + 12}, ${node.y - 15})`}>
              <Leaf size={14} className="text-[#65a30d]" fill="#65a30d" />
           </g>
        )}

        <text
          x={node.x}
          y={node.y}
          dy=".3em"
          textAnchor="middle"
          fill="#433422"
          fontSize={isRoot ? "10px" : "14px"}
          fontWeight="bold"
          fontFamily="serif"
          pointerEvents="none"
        >
          {node.char}
        </text>
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center w-full space-y-6">
      <div className="bg-[#fefce8] p-6 rounded-xl border-2 border-[#e7e5e4] shadow-cozy w-full max-w-4xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#433422 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        <div className="relative z-10 flex flex-col items-center">
            <h3 className="text-[#433422] font-serif text-2xl mb-2 font-bold flex items-center">
                <span className="mr-2 opacity-50">✦</span> The Living Garden <span className="ml-2 opacity-50">✦</span>
            </h3>
            <p className="text-[#78716c] text-sm mb-6 italic font-serif">
              Plant new words and watch the branches grow.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-6 w-full">
            <div className="flex items-center space-x-2 bg-white p-1 rounded-lg border border-[#e7e5e4] shadow-sm">
                <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="New seed..."
                className="bg-transparent px-3 py-1 outline-none text-[#433422] font-serif w-32 placeholder:text-[#d6d3d1]"
                maxLength={7}
                />
                <button 
                onClick={handleAdd}
                className="bg-[#65a30d] hover:bg-[#4d7c0f] text-white p-2 rounded-md transition-colors"
                >
                <Plus size={16} />
                </button>
            </div>
            
            <div className="flex items-center space-x-2 bg-white p-1 rounded-lg border border-[#e7e5e4] shadow-sm relative">
                <Search className="ml-2 text-[#d97706]" size={16} />
                <input 
                type="text" 
                placeholder="Trace path..."
                onChange={handleSearchChange}
                className="bg-transparent px-3 py-1 outline-none text-[#433422] font-serif w-40 placeholder:text-[#d6d3d1]"
                />
            </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
            {words.map(w => (
                <span key={w} className="flex items-center bg-[#fff7ed] text-[#9a3412] px-3 py-1 rounded-full border border-[#ffedd5] text-sm font-serif shadow-sm">
                {w}
                <button onClick={() => handleRemove(w)} className="ml-2 hover:text-[#be123c]">
                    <Trash2 size={12} />
                </button>
                </span>
            ))}
            </div>

            <div className="w-full h-[400px] border border-[#e7e5e4] rounded-lg bg-[#fafaf9] shadow-inner flex justify-center relative overflow-hidden">
                {treeData && (
                    <svg width="800" height="400" viewBox="0 0 800 400" className="max-w-full">
                        {renderLinks(treeData)}
                        {renderNodes(treeData)}
                    </svg>
                )}
            </div>
            
            <div className="flex justify-center mt-4 space-x-6 text-xs text-[#78716c] font-serif italic">
                <div className="flex items-center"><div className="w-3 h-3 rounded-full border-2 border-[#78716c] bg-[#fafaf9] mr-2"></div> Step</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full border-2 border-[#be185d] bg-[#fef3c7] mr-2"></div> Full Word</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-[#d97706] mr-2"></div> Active Path</div>
            </div>
        </div>
      </div>
    </div>
  );
};
