import { Vector3, Euler, MathUtils } from 'three';
import { ParticleData, TreeConfig } from '../types';

/**
 * Generates a random point inside a sphere of given radius.
 */
export const getRandomSpherePoint = (radius: number): Vector3 => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  const sinPhi = Math.sin(phi);
  return new Vector3(
    r * sinPhi * Math.cos(theta),
    r * sinPhi * Math.sin(theta),
    r * Math.cos(phi)
  );
};

/**
 * Generates a point on the surface/volume of a cone (Christmas Tree shape).
 */
export const getTreePoint = (config: TreeConfig): Vector3 => {
  const { height, radius } = config;
  
  // Normalized height (0 at bottom, 1 at top)
  // We bias slightly towards the bottom for more fullness
  const yNorm = Math.pow(Math.random(), 1.5); 
  const y = (yNorm - 0.5) * height; // Center vertically
  
  // Radius at this height (linear taper)
  // At yNorm=0 (bottom), r = radius. At yNorm=1 (top), r = 0.
  const rAtHeight = radius * (1 - yNorm);
  
  // Random angle
  const theta = Math.random() * Math.PI * 2;
  
  // Random distance from center (volume, not just surface)
  const r = Math.sqrt(Math.random()) * rAtHeight;
  
  return new Vector3(
    r * Math.cos(theta),
    y,
    r * Math.sin(theta)
  );
};

/**
 * Generates dataset for instanced meshes
 */
export const generateParticleData = (count: number, scatterRadius: number, treeConfig: TreeConfig): ParticleData[] => {
  const data: ParticleData[] = [];
  
  for (let i = 0; i < count; i++) {
    const scatterPos = getRandomSpherePoint(scatterRadius);
    const treePos = getTreePoint(treeConfig);
    
    // Add some random noise to tree pos so it's not perfectly geometric
    treePos.x += (Math.random() - 0.5) * 0.2;
    treePos.z += (Math.random() - 0.5) * 0.2;
    
    // Random rotation for natural look
    const rotation = new Euler(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    data.push({
      scatterPosition: scatterPos,
      treePosition: treePos,
      rotation,
      scale: 0.5 + Math.random() * 0.5,
      speed: 0.5 + Math.random() * 0.5, // Variance in interpolation speed
    });
  }
  
  return data;
};
