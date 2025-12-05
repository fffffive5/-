import React, { useState } from 'react';
import { Experience } from './components/Experience';
import { UI } from './components/UI';
import { TreeMorphState } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<TreeMorphState>(TreeMorphState.SCATTERED);

  return (
    <div className="relative w-full h-screen bg-[#000502]">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Experience mode={mode} />
      </div>

      {/* UI Overlay Layer */}
      <UI mode={mode} setMode={setMode} />
      
      {/* Texture Overlay for Grainy Film Effect (Optional Polish) */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
};

export default App;
