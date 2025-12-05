import React from 'react';
import { TreeMorphState } from '../types';

interface UIProps {
  mode: TreeMorphState;
  setMode: (mode: TreeMorphState) => void;
}

export const UI: React.FC<UIProps> = ({ mode, setMode }) => {
  const isTree = mode === TreeMorphState.TREE_SHAPE;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12 z-10">
      
      {/* Header */}
      <header className="flex flex-col items-center md:items-start text-[#FFD700]">
        <h1 className="font-serif text-3xl md:text-5xl tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
          XJY Signature
        </h1>
        <p className="font-sans text-xs md:text-sm tracking-[0.3em] mt-2 text-emerald-100 opacity-80">
          The Art of Celebration
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-col items-center justify-center pointer-events-auto">
        <button
          onClick={() => setMode(isTree ? TreeMorphState.SCATTERED : TreeMorphState.TREE_SHAPE)}
          className={`
            group relative px-8 py-4 overflow-hidden rounded-full 
            transition-all duration-700 ease-in-out
            border border-[#FFD700] backdrop-blur-sm
            ${isTree ? 'bg-[#FFD700]/10' : 'bg-transparent'}
          `}
        >
          {/* Button Background Glow */}
          <span className={`
            absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent
            transform transition-transform duration-700
            ${isTree ? 'translate-x-full' : '-translate-x-full group-hover:translate-x-full'}
          `} />

          <span className="relative z-10 font-serif text-sm md:text-base tracking-widest text-[#FFD700] group-hover:text-white transition-colors duration-300">
            {isTree ? 'DISASSEMBLE' : 'ASSEMBLE COLLECTION'}
          </span>
        </button>
        
        <div className="mt-4 flex gap-2">
            <div className={`h-1 w-1 rounded-full bg-[#FFD700] transition-all duration-500 ${isTree ? 'opacity-100 scale-150' : 'opacity-30'}`} />
            <div className={`h-1 w-1 rounded-full bg-[#FFD700] transition-all duration-500 ${!isTree ? 'opacity-100 scale-150' : 'opacity-30'}`} />
        </div>
      </div>

      {/* Footer */}
      <footer className="flex justify-between items-end text-[#FFD700]/60">
        <div className="hidden md:block w-32 h-[1px] bg-gradient-to-r from-[#FFD700]/50 to-transparent"></div>
        <p className="font-sans text-[10px] tracking-widest uppercase">
          XJY Christmas Limited Edition
        </p>
      </footer>
    </div>
  );
};