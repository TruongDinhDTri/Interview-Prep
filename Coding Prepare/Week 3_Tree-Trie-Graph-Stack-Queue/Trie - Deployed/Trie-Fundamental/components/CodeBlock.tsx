import React from 'react';

interface CodeBlockProps {
  code: string;
  title?: string;
  fileName?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, title, fileName = "trie.py" }) => {
  return (
    <div className="my-4 rounded-lg overflow-hidden shadow-2xl font-sans w-full max-w-full border border-[#333]">
      {/* VS Code Title Bar */}
      <div className="bg-[#111111] px-4 py-2 flex items-center justify-between select-none border-b border-[#252526]">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div> {/* Red */}
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div> {/* Yellow */}
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div> {/* Green */}
        </div>
        <div className="text-gray-400 text-xs font-medium opacity-75">{title || 'Visual Studio Code'}</div>
        <div className="w-12"></div>
      </div>

      {/* VS Code Editor Area */}
      <div className="bg-[#111111] p-0 flex flex-col">
        {/* Tabs */}
        <div className="flex bg-[#252526] text-white text-xs">
          <div className="bg-[#111111] px-4 py-2 border-t-2 border-[#d97706] flex items-center">
            <span className="text-[#d97706] mr-2">🐍</span>
            <span>{fileName}</span>
            <span className="ml-3 text-gray-500 hover:text-white cursor-pointer">×</span>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-x-auto">
          <pre className="text-sm font-mono leading-relaxed text-[#d4d4d4]">
            <code>
              {code.split('\n').map((line, i) => (
                <div key={i} className="table-row">
                  <span className="table-cell text-right pr-4 text-[#444] select-none w-8">{i + 1}</span>
                  <span className="table-cell">{highlightSyntax(line)}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="bg-[#007acc] px-3 py-1 text-white text-[10px] flex justify-between font-sans">
        <div className="flex space-x-3">
          <span>main*</span>
          <span>Python 3.10</span>
        </div>
        <div className="flex space-x-3">
          <span>Ln {code.split('\n').length}, Col 1</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};

// Simple visual syntax highlighter for Python
const highlightSyntax = (line: string) => {
  if (!line) return <br />;
  
  // Comments
  if (line.trim().startsWith('#') || line.trim().startsWith('"""')) {
    return <span className="text-[#6a9955] italic">{line}</span>;
  }

  const parts = line.split(/(\s+|[(){}:,.=])/g);
  return parts.map((part, index) => {
    // Keywords
    if (['class', 'def', 'return', 'if', 'else', 'for', 'in', 'not', 'and', 'or', 'True', 'False', 'None'].includes(part)) {
      return <span key={index} className="text-[#c586c0] font-bold">{part}</span>; // Purple
    }
    // Self
    if (part === 'self') {
      return <span key={index} className="text-[#569cd6]">{part}</span>; // Blue
    }
    // Function definition names
    if (index > 0 && parts[index-2] === 'def') {
        return <span key={index} className="text-[#dcdcaa]">{part}</span>; // Yellow
    }
    // Strings
    if (part.startsWith('"') || part.startsWith("'")) {
        return <span key={index} className="text-[#ce9178]">{part}</span>; // Orange/Red
    }
    // Numbers
    if (!isNaN(Number(part)) && part.trim() !== '') {
        return <span key={index} className="text-[#b5cea8]">{part}</span>; // Light Green
    }
    
    return <span key={index}>{part}</span>;
  });
};