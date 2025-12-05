import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { TreeMorphState } from '../types';
import { getRandomSpherePoint } from '../utils/math';

interface TopStarProps {
  mode: TreeMorphState;
}

export const TopStar: React.FC<TopStarProps> = ({ mode }) => {
  const groupRef = useRef<Group>(null);
  
  // Calculate fixed positions
  // Scatter: random point in space
  // Tree: Exact top of the tree. 
  // Foliage height is 10, centered at 0, so range is [-5, 5].
  // We place the star at 5.2 to sit just on the tip.
  const scatterPos = useMemo(() => getRandomSpherePoint(20), []);
  const treePos = useMemo(() => new Vector3(0, 5.2, 0), []);
  
  const targetFactor = mode === TreeMorphState.TREE_SHAPE ? 1 : 0;
  const currentFactor = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth animation lerp
    const speed = 2.0 * delta;
    currentFactor.current += (targetFactor - currentFactor.current) * speed;
    const t = currentFactor.current;
    
    // Position Interpolation
    groupRef.current.position.lerpVectors(scatterPos, treePos, t);
    
    // Rotation: Slow majestic spin
    groupRef.current.rotation.y += delta * 0.3;
    
    // Scale: Pulse slightly for "breathing" light effect
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    groupRef.current.scale.setScalar(pulse);
  });

  return (
    <group ref={groupRef}>
      {/* Core glowing star */}
      <mesh castShadow>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial 
          color="#FFD700" 
          emissive="#FFD700" 
          emissiveIntensity={2} 
          toneMapped={false}
        />
        <pointLight intensity={10} color="#FFD700" distance={8} decay={2} />
      </mesh>

      {/* Outer Halo / Geometric cage for complexity */}
      <mesh scale={1.4} rotation={[0.5, 0.5, 0]}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshBasicMaterial 
          color="#fff" 
          wireframe 
          transparent 
          opacity={0.15} 
        />
      </mesh>
      
      {/* Inner crystal core */}
      <mesh scale={0.5} rotation={[0, 0.5, 0.5]}>
         <octahedronGeometry args={[0.8, 0]} />
         <meshStandardMaterial color="white" emissive="white" emissiveIntensity={4} />
      </mesh>
    </group>
  );
};