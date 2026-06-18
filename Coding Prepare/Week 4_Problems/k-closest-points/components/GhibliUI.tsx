import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    active?: boolean;
    className?: string;
    title?: string;
}

export const GhibliButton: React.FC<ButtonProps> = ({ onClick, children, disabled, active, className = '', title }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
                px-4 py-2 rounded-xl font-hand text-lg transition-all duration-300 transform
                flex items-center justify-center gap-2
                ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:-translate-y-0.5 hover:shadow-md cursor-pointer'}
                ${active 
                    ? 'bg-rose-400 text-white shadow-rose-200 shadow-sm' 
                    : 'bg-white text-slate-700 hover:bg-sky-50 border border-sky-100 shadow-sm'}
                ${className}
            `}
        >
            {children}
        </button>
    );
};

export const Card: React.FC<{ children: React.ReactNode; title?: string, className?: string }> = ({ children, title, className = '' }) => (
    <div className={`glass-panel rounded-2xl p-0 shadow-lg relative overflow-hidden flex flex-col ${className}`}>
        {title && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-300 via-purple-300 to-rose-300 z-20" />
        )}
        {title && <div className="px-4 py-2 border-b border-slate-100 bg-white/40 backdrop-blur-sm">
             <h2 className="text-sm font-bold text-slate-600 font-serif z-10 flex-none uppercase tracking-wide">{title}</h2>
        </div>}
        {children}
    </div>
);

interface ControlPanelProps {
    isPlaying: boolean;
    togglePlay: () => void;
    next: () => void;
    prev: () => void;
    speed: number;
    setSpeed: (s: number) => void;
    canNext: boolean;
    canPrev: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ isPlaying, togglePlay, next, prev, speed, setSpeed, canNext, canPrev }) => {
    return (
        <div className="flex items-center gap-2">
            <GhibliButton onClick={prev} disabled={!canPrev} className="!rounded-full w-8 h-8 !p-0 bg-slate-100 hover:bg-slate-200">
                <SkipBack size={14} />
            </GhibliButton>
            
            <GhibliButton onClick={togglePlay} active={isPlaying} className="!rounded-full w-10 h-10 !p-0 bg-emerald-400 text-white hover:bg-emerald-500 shadow-emerald-200">
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-1" />}
            </GhibliButton>

            <GhibliButton onClick={next} disabled={!canNext} className="!rounded-full w-8 h-8 !p-0 bg-slate-100 hover:bg-slate-200">
                <SkipForward size={14} />
            </GhibliButton>

            <div className="h-6 w-px bg-slate-300 mx-2"></div>

            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <button 
                    onClick={() => setSpeed(1000)} 
                    className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${speed === 1000 ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                >1x</button>
                 <button 
                    onClick={() => setSpeed(300)} 
                    className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${speed === 300 ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                >3x</button>
            </div>
        </div>
    );
};