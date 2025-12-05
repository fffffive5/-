import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Vector3, Color } from 'three';
import { ParticleData, TreeMorphState } from '../types';
import { generateParticleData } from '../utils/math';

interface CrystalsProps {
  mode: TreeMorphState;
}

const COUNT = 150; // Exclusive diamonds
const SCATTER_RADIUS = 25; 
const TREE_HEIGHT = 9.5;
const TREE_RADIUS = 3.6; // Slightly further out than foliage to catch light

const tempObj = new Object3D();
const tempVec = new Vector3();

export const Crystals: React.FC<CrystalsProps> = ({ mode }) => {
  const meshRef = useRef<InstancedMesh>(null);
  
  const particles = useMemo(() => 
    generateParticleData(COUNT, SCATTER_RADIUS, { height: TREE_HEIGHT, radius: TREE_RADIUS, count: COUNT }),
  []);

  const targetFactor = mode === TreeMorphState.TREE_SHAPE ? 1 : 0;
  const currentFactor = useRef(0);

  useLayoutEffect(() => {
    if (meshRef.current) {
      // White/Silver palette
      const color = new Color('#ffffff');
      for (let i = 0; i < COUNT; i++) {
        meshRef.current.setColorAt(i, color);
      }
      meshRef.current.instanceColor!.needsUpdate = true;
    }
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const speed = 2.0 * delta;
    currentFactor.current += (targetFactor - currentFactor.current) * speed;
    const t = currentFactor.current;

    for (let i = 0; i < COUNT; i++) {
      const p = particles[i];
      
      tempVec.lerpVectors(p.scatterPosition, p.treePosition, t);
      
      // Add a distinct sparkly rotation
      const time = state.clock.elapsedTime;
      if (t > 0.8) {
          tempObj.rotation.x = time * 0.5 + i;
          tempObj.rotation.y = time * 0.5 + i;
      } else {
          tempObj.rotation.copy(p.rotation);
      }

      tempObj.position.copy(tempVec);
      
      // Crystals are smaller but sharp
      const scaleMult = 0.6 * (0.8 + 0.4 * Math.sin(time * 2 + i)); 
      tempObj.scale.setScalar(p.scale * scaleMult);
      
      tempObj.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObj.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} castShadow>
      {/* Octahedron for diamond shape */}
      <octahedronGeometry args={[0.15, 0]} />
      <meshStandardMaterial 
        roughness={0.0} 
        metalness={0.9}
        color="#ffffff"
        emissive="#b0e0ff"
        emissiveIntensity={0.5}
      />
    </instancedMesh>
  );
};
