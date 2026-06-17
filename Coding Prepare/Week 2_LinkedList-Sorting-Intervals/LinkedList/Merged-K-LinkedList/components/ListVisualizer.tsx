
import React from 'react';
import { LIST_BG_COLORS } from '../constants';
import { ArrowRight } from 'lucide-react';

interface ListVisualizerProps {
  lists: number[][];
  pointers: number[];
  highlightedListIndex?: number;
  checkNextCandidate?: { listIdx: number, valIdx: number };
}

const ListVisualizer: React.FC<ListVisualizerProps> = ({ lists, pointers, highlightedListIndex, checkNextCandidate }) => {
  return (
    <div className="space-y-6">
      {lists.map((list, listIdx) => {
        const isFinished = pointers[listIdx] >= list.length;
        const isActive = highlightedListIndex === listIdx;
        
        return (
          <div 
            key={listIdx} 
            className={`
              flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-500 relative
              ${isActive 
                ? `bg-orange-50 border-orange-400 shadow-md scale-[1.01]` 
                : 'bg-[#FDFBF7] border-[#E7E5E4] hover:border-orange-200'
              }
            `}
          >
            {/* Row Label */}
            <div className="w-20 flex flex-col items-center justify-center border-r-2 border-dashed border-stone-300 pr-4 flex-shrink-0">
              <span className="font-serif text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">List</span>
              <span className={`font-serif text-3xl font-bold ${isActive ? 'text-orange-700' : 'text-stone-400'}`}>
                {String.fromCharCode(65 + listIdx)}
              </span>
            </div>
            
            <div className="flex items-center flex-1 overflow-x-auto pb-2 px-2 scrollbar-hide">
              {list.map((val, valIdx) => {
                // States
                const isProcessed = valIdx < pointers[listIdx];
                const isCheckingThis = checkNextCandidate?.listIdx === listIdx && checkNextCandidate?.valIdx === valIdx;
                
                return (
                  <div key={valIdx} className="flex items-center">
                    
                    {/* Arrow (Linked List Pointer) */}
                    {valIdx > 0 && (
                      <div className="mx-1 text-stone-300">
                         <ArrowRight size={16} />
                      </div>
                    )}

                    <div className="relative group">
                        <div 
                          className={`
                            relative flex items-center justify-center w-14 h-14 font-mono font-bold text-xl rounded-full border-2 
                            transition-all duration-300
                            ${isProcessed 
                              ? 'bg-stone-100 border-stone-200 text-stone-300 shadow-inner' 
                              : 'bg-white border-stone-300 text-stone-700 shadow-sm'
                            }
                            ${isCheckingThis ? 'ring-4 ring-orange-400 ring-opacity-50 scale-110 bg-orange-50 border-orange-500 z-10 text-orange-900' : ''}
                          `}
                        >
                          {val}
                          
                          {/* NEXT label for context */}
                          {!isProcessed && valIdx === pointers[listIdx] && !isCheckingThis && (
                             <span className="absolute -top-5 text-[9px] font-bold text-stone-400 uppercase tracking-wider">Head</span>
                          )}

                          {/* Visual indicator for "Checking" */}
                          {isCheckingThis && (
                            <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                              <span className="text-[10px] font-bold bg-orange-600 text-white px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">Node.next?</span>
                              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-orange-600"></div>
                            </div>
                          )}
                        </div>
                        
                        {/* .next dot */}
                        {!isProcessed && (
                            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-stone-400 rounded-full border border-white"></div>
                        )}
                    </div>
                  </div>
                );
              })}
              
              {/* NULL / None Termination */}
              <div className="flex items-center ml-1 opacity-50">
                  <ArrowRight size={16} className="text-stone-300 mr-2" />
                  <div className={`
                     w-10 h-10 border-2 border-dashed border-stone-300 rounded-md flex items-center justify-center
                     ${checkNextCandidate?.listIdx === listIdx && checkNextCandidate?.valIdx === list.length ? 'bg-orange-50 border-orange-400' : 'bg-stone-50'}
                  `}>
                      <span className="text-[10px] font-mono text-stone-400">None</span>
                  </div>
                   {/* Empty State Check Visual */}
                  {checkNextCandidate?.listIdx === listIdx && checkNextCandidate?.valIdx === list.length && (
                     <div className="absolute ml-8 -mt-16 flex flex-col items-center animate-bounce z-10">
                        <span className="text-[10px] font-bold bg-stone-500 text-white px-2 py-0.5 rounded-full shadow-sm">Node.next?</span>
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-stone-500"></div>
                     </div>
                  )}
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListVisualizer;
