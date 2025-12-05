import { Vector3, Euler } from 'three';

export enum TreeMorphState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface ParticleData {
  scatterPosition: Vector3;
  treePosition: Vector3;
  rotation: Euler;
  scale: number;
  speed: number; // For individual animation variance
}

export interface TreeConfig {
  height: number;
  radius: number;
  count: number;
}
