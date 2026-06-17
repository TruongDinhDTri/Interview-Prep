
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Sparkles, Loader2, Bot } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Greetings, Traveler. I am the Keeper of the Archive. If you find yourself lost in the forest of nodes, simply ask, and I shall illuminate the path." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `You are an expert Computer Science professor and the mystical "Keeper of the Archive" in a visualization app about Tries (Prefix Trees). 
      Your tone is wise, gentle, and slightly magical (referencing forests, paths, roots, and leaves), but your technical explanations must be precise and rigorous.
      
      Key knowledge:
      - Tries are O(L) for search/insert.
      - Nodes have children (HashMap) and is_end_of_word (Boolean).
      - Deletion uses recursive post-order traversal (The Withering Vine metaphor).
      
      Keep answers concise (under 3 paragraphs). Use markdown for code or bold text.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        })).concat([{ role: 'user', parts: [{ text: userMsg }] }]),
        config: { systemInstruction }
      });

      const responseText = response.text || "The archives are silent... (Error)";
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "A fog has descended... I cannot reach the archives right now. (API Error)" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
       {/* Chat Window */}
       {isOpen && (
         <div className="pointer-events-auto bg-[#fffbeb] w-[500px] h-[700px] rounded-2xl shadow-2xl border-2 border-[#e7e5e4] flex flex-col overflow-hidden animate-fade-in mb-4">
            {/* Header */}
            <div className="bg-[#433422] p-4 flex justify-between items-center text-[#fdf6e3]">
               <div className="flex items-center gap-2">
                 <Sparkles size={18} className="text-[#d97706]" />
                 <span className="font-serif font-bold">The Keeper</span>
               </div>
               <button onClick={() => setIsOpen(false)} className="hover:text-[#d97706] transition-colors">
                 <X size={20} />
               </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fafaf9]">
               {messages.map((m, i) => (
                 <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-lg text-sm font-serif leading-relaxed shadow-sm ${
                        m.role === 'user' 
                        ? 'bg-[#d97706] text-white rounded-br-none' 
                        : 'bg-white text-[#433422] border border-[#e7e5e4] rounded-bl-none'
                    }`}>
                        <MarkdownText text={m.text} />
                    </div>
                 </div>
               ))}
               {isLoading && (
                 <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-lg border border-[#e7e5e4] rounded-bl-none flex items-center gap-2 text-[#78716c] text-sm">
                        <Loader2 size={14} className="animate-spin" />
                        <span className="italic font-serif">Consulting the scrolls...</span>
                    </div>
                 </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-[#e7e5e4]">
               <div className="flex items-center gap-2 bg-[#f5f5f4] rounded-full px-4 py-2 border border-[#e7e5e4] focus-within:border-[#d97706] transition-colors">
                  <input 
                    className="flex-1 bg-transparent outline-none text-[#433422] text-sm font-serif placeholder:text-[#a8a29e]"
                    placeholder="Ask about Tries..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="text-[#d97706] hover:text-[#b45309] disabled:opacity-50 transition-colors"
                  >
                    <Send size={18} />
                  </button>
               </div>
            </div>
         </div>
       )}

       {/* Toggle Button */}
       <button 
         onClick={() => setIsOpen(!isOpen)}
         className="pointer-events-auto bg-[#433422] text-[#fdf6e3] p-4 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 group border-2 border-[#d97706]"
       >
         {isOpen ? <X size={28} /> : <MessageCircle size={28} className="group-hover:animate-pulse" />}
       </button>
    </div>
  );
};

// Improved Markdown helper
const MarkdownText = ({ text }: { text: string }) => {
    // Basic Split by newlines
    const lines = text.split('\n');
    return (
        <span className="block">
            {lines.map((line, i) => {
                // List items
                if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                    return (
                        <div key={i} className="flex gap-2 ml-2 my-1">
                            <span className="text-[#d97706]">•</span>
                            <span>{formatInline(line.replace(/^[\*\-]\s/, ''))}</span>
                        </div>
                    );
                }
                // Code blocks (simple detection)
                if (line.trim().startsWith('```')) return null; // Skip fence
                
                return <span key={i} className="block mb-1">{formatInline(line)}</span>;
            })}
        </span>
    );
};

const formatInline = (text: string) => {
    // Bold **text**
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="font-bold text-[#d97706]">{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('`') && part.endsWith('`')) {
                    return <code key={i} className="bg-[#f5f5f4] px-1 rounded text-[#d97706] font-mono text-xs">{part.slice(1, -1)}</code>;
                }
                return part;
            })}
        </>
    );
}
