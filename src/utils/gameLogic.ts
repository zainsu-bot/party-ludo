import { TileType, PathCoord } from '../types';

export const GRID_W = 8;
export const GRID_H = 5;
export const TILES_COUNT = 40;

export function generateSpiralPath(): PathCoord[] {
  const path: PathCoord[] = [];
  for (let i = 0; i < TILES_COUNT; i++) {
    const r = Math.floor(i / GRID_W);
    const c = r % 2 === 0 ? (i % GRID_W) : (GRID_W - 1 - (i % GRID_W));
    path.push({ r, c });
  }
  return path;
}

export function generateBoardMap(): TileType[] {
  const boardMap: TileType[] = new Array(TILES_COUNT).fill('blank');
  
  const availableIndices = [];
  for (let i = 1; i < TILES_COUNT - 1; i++) {
    availableIndices.push(i);
  }

  for (let i = availableIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
  }

  for (let i = 0; i < 12; i++) {
    boardMap[availableIndices[i]] = 'lucky';
  }
  for (let i = 12; i < 24; i++) {
    boardMap[availableIndices[i]] = 'trap';
  }

  return boardMap;
}

export function calculateNewPosition(current: number, steps: number): number {
  let target = current + steps;

  if (target >= TILES_COUNT - 1) {
    target = (TILES_COUNT - 1) - (target - (TILES_COUNT - 1));
  }

  return target;
}

export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}
