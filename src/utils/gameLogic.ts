import { TileType, PathCoord } from '../types';

export const SNAKE_COLS = 13;
export const SNAKE_ROWS = 13;

/**
 * 核心 13x13 飞行棋矩阵
 */
const BOARD_MATRIX: (number | string)[][] = [
  [5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 6, 6, 6], // 0
  [5, 5, 5, 2, 0, 0, 'b', 0, 0, 2, 6, 6, 6], // 1
  [5, 5, 5, 2, 0, 0, 'b', 0, 0, 2, 6, 6, 6], // 2
  [2, 2, 2, 2, 0, 0, 'b', 0, 0, 2, 2, 2, 2], // 3
  [2, 0, 0, 0, 0, 0, 'b', 0, 0, 0, 0, 0, 2], // 4
  [2, 0, 0, 0, 0, 0, 'b', 0, 0, 0, 0, 0, 2], // 5
  [2, 'a', 'a', 'a', 'a', 'a', 1, 'c', 'c', 'c', 'c', 'c', 2], // 6
  [2, 0, 0, 0, 0, 0, 'd', 0, 0, 0, 0, 0, 2], // 7
  [2, 0, 0, 0, 0, 0, 'd', 0, 0, 0, 0, 0, 2], // 8
  [2, 2, 2, 2, 0, 0, 'd', 0, 0, 2, 2, 2, 2], // 9
  [7, 7, 7, 2, 0, 0, 'd', 0, 0, 2, 8, 8, 8], // 10
  [7, 7, 7, 2, 0, 0, 'd', 0, 0, 2, 8, 8, 8], // 11
  [7, 7, 7, 2, 2, 2, 2, 2, 2, 2, 8, 8, 8], // 12
];

const COMMON_LOOP: PathCoord[] = [
  {r:3,c:0},{r:3,c:1},{r:3,c:2},{r:3,c:3},{r:2,c:3},{r:1,c:3},{r:0,c:3},
  {r:0,c:4},{r:0,c:5},{r:0,c:6},{r:0,c:7},{r:0,c:8},{r:0,c:9},
  {r:1,c:9},{r:2,c:9},{r:3,c:9},{r:3,c:10},{r:3,c:11},{r:3,c:12},
  {r:4,c:12},{r:5,c:12},{r:6,c:12},{r:7,c:12},{r:8,c:12},{r:9,c:12},
  {r:9,c:11},{r:9,c:10},{r:9,c:9},{r:10,c:9},{r:11,c:9},{r:12,c:9},
  {r:12,c:8},{r:12,c:7},{r:12,c:6},{r:12,c:5},{r:12,c:4},{r:12,c:3},
  {r:11,c:3},{r:10,c:3},{r:9,c:3},{r:9,c:2},{r:9,c:1},{r:9,c:0},
  {r:8,c:0},{r:7,c:0},{r:6,c:0},{r:5,c:0},{r:4,c:0}
];

const HOME_STRETCHES: PathCoord[][] = Array.from({ length: 4 }, (_, i) => {
  const stretch: PathCoord[] = [];
  for (let j = 0; j < 5; j++) {
    let r = 0, c = 0;
    if (i === 0) { r = 6; c = j + 1; }     // a (Gentleman - Blue)
    if (i === 1) { r = j + 1; c = 6; }     // b (Lady - Rose)
    if (i === 2) { r = 11 - j; c = 6; }    // d (Knight - Green)
    if (i === 3) { r = 6; c = 11 - j; }    // c (Elf - Amber)
    stretch.push({ r, c });
  }
  return stretch;
});

export function generateRolePath(roleId: number): PathCoord[] {
  const path: PathCoord[] = [];
  
  // 1. 基发起点
  const BASE_STARTS = [{r:1,c:1}, {r:1,c:11}, {r:11,c:1}, {r:11,c:11}];
  path.push(BASE_STARTS[roleId]);

  // 2. 环路切入与导出
  let startIndex = 0;
  let junctionCoord = {r:6, c:0};

  if (roleId === 0) { startIndex = 0;  junctionCoord = {r:6, c:0}; }  // Entry (3,0), Junction (6,0)
  if (roleId === 1) { startIndex = 12; junctionCoord = {r:0, c:6}; }  // Entry (0,9), Junction (0,6)
  if (roleId === 2) { startIndex = 36; junctionCoord = {r:12, c:6}; } // Entry (12,3), Junction (12,6)
  if (roleId === 3) { startIndex = 24; junctionCoord = {r:6, c:12}; } // Entry (9,12), Junction (6,12)

  for (let i = 0; i < COMMON_LOOP.length * 2; i++) {
    const current = COMMON_LOOP[(startIndex + i) % COMMON_LOOP.length];
    path.push(current);
    if (current.r === junctionCoord.r && current.c === junctionCoord.c) break;
  }

  // 3. 私有航道
  path.push(...HOME_STRETCHES[roleId]);

  // 4. 终点
  path.push({r:6,c:6});
  
  return path;
}

export const GET_BOARD_MATRIX = () => BOARD_MATRIX;
export const PATHS_BY_ROLE: PathCoord[][] = [
  generateRolePath(0), generateRolePath(1), generateRolePath(2), generateRolePath(3)
];

export const getPlayerPath = (roleId: number) => PATHS_BY_ROLE[roleId];
export const rollDice = () => Math.floor(Math.random() * 6) + 1;
export const generateBoardMap = () => new Array(53).fill('blank');
export const BOARD_SIZE = SNAKE_COLS;
export const OUTER_LOOP = COMMON_LOOP;
export const SNAKE_PATH = PATHS_BY_ROLE[0];
export const TOTAL_TILES = SNAKE_PATH.length;
