import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Foliage } from './Foliage';
import { Ornaments } from './Ornaments';
import { Crystals } from './Crystals';
import { TopStar } from './TopStar';
import { TreeMorphState } from '../types';
import { Vector3 } from 'three';

interface ExperienceProps {
  mode: TreeMorphState;
}

const Rig = () => {
  useFrame((state) => {
    // Subtle camera movement
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.1) * 2 + 10;
    state.camera.position.z = Math.cos(t * 0.1) * 2 + 10;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

export const Experience: React.FC<ExperienceProps> = ({ mode }) => {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [10, 2, 12], fov: 45 }}
      gl={{ antialias: false, toneMappingExposure: 1.5 }}
      className="w-full h-full bg-[#000502]"
    >
      <fog attach="fog" args={['#000502', 10, 40]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={100} 
        castShadow 
        color="#fff5b6"
      />
      <pointLight position={[-10, 5, -10]} intensity={20} color="#046307" />
      
      {/* Objects */}
      <group position={[0, -2, 0]}>
        <TopStar mode={mode} />
        <Foliage mode={mode} />
        <Ornaments mode={mode} />
        <Crystals mode={mode} />
        
        {/* Magic Dust (Sparkles) */}
        <Sparkles 
            count={600} 
            scale={12} 
            size={5} 
            speed={0.4} 
            opacity={0.6} 
            color="#FFD700"
        />

        <ContactShadows 
            resolution={1024} 
            scale={30} 
            blur={2} 
            opacity={0.5} 
            far={10} 
            color="#000000" 
        />
      </group>

      {/* Environment for Reflections */}
      <Environment preset="city" />

      {/* Controls */}
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 2}
        minDistance={8}
        maxDistance={25}
      />
      
      {/* <Rig /> */}

      {/* Post Processing for Cinematic Feel */}
      <EffectComposer disableNormalPass>
        <Bloom 
            luminanceThreshold={0.8} 
            mipmapBlur 
            intensity={1.5} 
            radius={0.4}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </Canvas>
  );
};
