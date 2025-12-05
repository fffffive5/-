import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Vector3, Color } from 'three';
import { ParticleData, TreeMorphState } from '../types';
import { generateParticleData } from '../utils/math';

interface FoliageProps {
  mode: TreeMorphState;
}

// Increased count for higher fidelity and "fuller" look
const COUNT = 4500;
const SCATTER_RADIUS = 15;
const TREE_HEIGHT = 10;
const TREE_RADIUS = 3.5;

// Temp object for matrix calculations to avoid GC
const tempObj = new Object3D();
const tempVec = new Vector3();

export const Foliage: React.FC<FoliageProps> = ({ mode }) => {
  const meshRef = useRef<InstancedMesh>(null);
  
  // Generate data once
  const particles = useMemo(() => 
    generateParticleData(COUNT, SCATTER_RADIUS, { height: TREE_HEIGHT, radius: TREE_RADIUS, count: COUNT }),
  []);

  // Animation state (0 = scattered, 1 = tree)
  const targetFactor = mode === TreeMorphState.TREE_SHAPE ? 1 : 0;
  const currentFactor = useRef(0);

  useLayoutEffect(() => {
    if (meshRef.current) {
      // Set random colors for depth (Emerald Variations)
      const color = new Color();
      for (let i = 0; i < COUNT; i++) {
        // Base emerald: #046307. 
        // More subtle variations for a rich velvet look
        const h = 145 / 360 + (Math.random() * 0.08 - 0.04); 
        const s = 0.7 + Math.random() * 0.3; 
        const l = 0.1 + Math.random() * 0.2; // Keep it deep
        color.setHSL(h, s, l);
        meshRef.current.setColorAt(i, color);
      }
      meshRef.current.instanceColor!.needsUpdate = true;
    }
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const speed = 2.5 * delta;
    currentFactor.current += (targetFactor - currentFactor.current) * speed;

    const t = currentFactor.current;

    for (let i = 0; i < COUNT; i++) {
      const p = particles[i];
      
      tempVec.lerpVectors(p.scatterPosition, p.treePosition, t);

      tempObj.position.copy(tempVec);
      tempObj.rotation.copy(p.rotation);
      
      if (t > 0.8) {
         tempObj.rotation.y += delta * 0.2 * p.speed;
      }
      
      tempObj.scale.setScalar(p.scale);
      tempObj.updateMatrix();
      
      meshRef.current.setMatrixAt(i, tempObj.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} castShadow receiveShadow>
      <boxGeometry args={[0.04, 0.25, 0.04]} />
      <meshStandardMaterial 
        roughness={0.4} 
        metalness={0.2} 
        color="#044a18"
      />
    </instancedMesh>
  );
};
