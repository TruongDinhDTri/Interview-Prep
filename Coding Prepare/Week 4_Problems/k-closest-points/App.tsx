import React, { useState } from 'react';
import { CoreIdeas } from './components/CoreIdeas';
import { DebugMode } from './components/DebugMode';
import { Tab } from './types';
import { Sparkles, Code, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CORE_IDEAS);

  return (
    <div className="h-screen w-screen bg-slate-50 font-sans text-slate-800 relative overflow-hidden flex flex-col">
        
        {/* Background Elements (Ghibli Style) */}
        <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-indigo-100 to-rose-100 opacity-80" />
            <div className="absolute top-10 left-10 w-64 h-32 bg-white blur-3xl opacity-60 animate-float" style={{animationDuration: '15s'}} />
            <div className="absolute top-40 right-20 w-80 h-40 bg-white blur-3xl opacity-50 animate-float" style={{animationDuration: '20s'}} />
            <div className="absolute bottom-20 left-1/3 w-96 h-48 bg-rose-200 blur-3xl opacity-30 animate-float" style={{animationDuration: '18s'}} />
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-sky-300/30 to-transparent" />
        </div>

        {/* Main Layout Container */}
        <div className="relative z-10 flex flex-col h-full max-w-[1800px] w-full mx-auto px-4 lg:px-6 pb-4">
            
            {/* Header & Nav - Fixed Height */}
            <header className="flex-none py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-white/40 p-2 rounded-full backdrop-blur-sm border border-white/50 shadow-sm">
                        <Sparkles className="text-rose-500" size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold font-serif text-slate-800 tracking-tight">GhibliAlgo</h1>
                        <p className="text-[10px] text-slate-500 font-hand tracking-widest uppercase">K Closest Points</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white/40 backdrop-blur-md p-1 rounded-full border border-white/60 shadow-sm flex gap-1">
                    <button
                        onClick={() => setActiveTab(Tab.CORE_IDEAS)}
                        className={`
                            px-4 py-1.5 rounded-full flex items-center gap-2 transition-all duration-300 text-sm font-medium
                            ${activeTab === Tab.CORE_IDEAS 
                                ? 'bg-white text-rose-500 shadow-sm' 
                                : 'text-slate-600 hover:bg-white/50'}
                        `}
                    >
                        <BookOpen size={16} />
                        Core Ideas
                    </button>
                    <button
                        onClick={() => setActiveTab(Tab.DEBUG_MODE)}
                        className={`
                            px-4 py-1.5 rounded-full flex items-center gap-2 transition-all duration-300 text-sm font-medium
                            ${activeTab === Tab.DEBUG_MODE 
                                ? 'bg-white text-sky-600 shadow-sm' 
                                : 'text-slate-600 hover:bg-white/50'}
                        `}
                    >
                        <Code size={16} />
                        Debug Mode
                    </button>
                </div>
            </header>

            {/* Main Content - Grows to fill space */}
            <main className="flex-1 min-h-0 relative bg-white/30 rounded-3xl border border-white/50 shadow-xl backdrop-blur-sm overflow-hidden">
                {activeTab === Tab.CORE_IDEAS ? <CoreIdeas /> : <DebugMode />}
            </main>
        </div>
    </div>
  );
}