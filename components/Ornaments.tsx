import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Vector3, Color } from 'three';
import { ParticleData, TreeMorphState } from '../types';
import { generateParticleData } from '../utils/math';

interface OrnamentsProps {
  mode: TreeMorphState;
}

const COUNT = 400; // Increased count
const SCATTER_RADIUS = 20;
const TREE_HEIGHT = 9;
const TREE_RADIUS = 3.2;

const tempObj = new Object3D();
const tempVec = new Vector3();

export const Ornaments: React.FC<OrnamentsProps> = ({ mode }) => {
  const meshRef = useRef<InstancedMesh>(null);
  
  const particles = useMemo(() => 
    generateParticleData(COUNT, SCATTER_RADIUS, { height: TREE_HEIGHT, radius: TREE_RADIUS, count: COUNT }),
  []);

  const targetFactor = mode === TreeMorphState.TREE_SHAPE ? 1 : 0;
  const currentFactor = useRef(0);

  useLayoutEffect(() => {
    if (meshRef.current) {
      const color = new Color();
      for (let i = 0; i < COUNT; i++) {
        // More gold, less variation, pure luxury
        if (Math.random() > 0.92) {
            color.set('#8B0000'); // Deep Ruby Accent
        } else {
            const l = 0.4 + Math.random() * 0.4; 
            color.setHSL(0.12, 0.9, l); // Rich Gold
        }
        meshRef.current.setColorAt(i, color);
      }
      meshRef.current.instanceColor!.needsUpdate = true;
    }
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const speed = 1.8 * delta;
    currentFactor.current += (targetFactor - currentFactor.current) * speed;
    const t = currentFactor.current;

    for (let i = 0; i < COUNT; i++) {
      const p = particles[i];
      
      tempVec.lerpVectors(p.scatterPosition, p.treePosition, t);
      
      if (t > 0.9) {
          const time = state.clock.elapsedTime;
          tempVec.y += Math.sin(time * 2 + i) * 0.05; 
      }

      tempObj.position.copy(tempVec);
      tempObj.rotation.copy(p.rotation);
      
      tempObj.rotation.y += delta * 0.5;
      
      const scaleMult = 1.0 + (t * 0.5); 
      tempObj.scale.setScalar(p.scale * scaleMult);
      
      tempObj.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObj.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} castShadow receiveShadow>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial 
        roughness={0.1} 
        metalness={1.0}
        emissive="#FFD700"
        emissiveIntensity={0.3}
      />
    </instancedMesh>
  );
};
