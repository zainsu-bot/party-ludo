import { TileType, PathCoord, PartyRole } from '../types';

export const BOARD_SIZE = 15;

/**
 * 经典 15x15 飞行棋：外圈 52 个公共格位的坐标列表
 * 这里的索引从 (0, 6) 开始顺时针旋转
 */
export const OUTER_LOOP: PathCoord[] = [
  { r: 6, c: 1 }, { r: 6, c: 2 }, { r: 6, c: 3 }, { r: 6, c: 4 }, { r: 6, c: 5 }, // BL -> TL
  { r: 5, c: 6 }, { r: 4, c: 6 }, { r: 3, c: 6 }, { r: 2, c: 6 }, { r: 1, c: 6 }, { r: 0, c: 6 },
  { r: 0, c: 7 },
  { r: 0, c: 8 }, { r: 1, c: 8 }, { r: 2, c: 8 }, { r: 3, c: 8 }, { r: 4, c: 8 }, { r: 5, c: 8 },
  { r: 6, c: 9 }, { r: 6, c: 10 }, { r: 6, c: 11 }, { r: 6, c: 12 }, { r: 6, c: 13 },
  { r: 6, c: 14 },
  { r: 7, c: 14 },
  { r: 8, c: 14 }, { r: 8, c: 13 }, { r: 8, c: 12 }, { r: 8, c: 11 }, { r: 8, c: 10 }, { r: 8, c: 9 },
  { r: 9, c: 8 }, { r: 10, c: 8 }, { r: 11, c: 8 }, { r: 12, c: 8 }, { r: 13, c: 8 }, { r: 14, c: 8 },
  { r: 14, c: 7 },
  { r: 14, c: 6 }, { r: 13, c: 6 }, { r: 12, c: 6 }, { r: 11, c: 6 }, { r: 10, c: 6 }, { r: 9, c: 6 },
  { r: 8, c: 5 }, { r: 8, c: 4 }, { r: 8, c: 3 }, { r: 8, c: 2 }, { r: 8, c: 1 },
  { r: 8, c: 0 },
  { r: 7, c: 0 },
  { r: 6, c: 0 }
];

/**
 * 角色对应的终点冲刺路径
 */
const GOAL_PATHS: Record<string, PathCoord[]> = {
  GENTLEMAN: [{ r: 1, c: 7 }, { r: 2, c: 7 }, { r: 3, c: 7 }, { r: 4, c: 7 }, { r: 5, c: 7 }, { r: 6, c: 7 }, { r: 7, c: 7 }],
  LADY: [{ r: 7, c: 13 }, { r: 7, c: 12 }, { r: 7, c: 11 }, { r: 7, c: 10 }, { r: 7, c: 9 }, { r: 7, c: 8 }, { r: 7, c: 7 }],
  KNIGHT: [{ r: 13, c: 7 }, { r: 12, c: 7 }, { r: 11, c: 7 }, { r: 10, c: 7 }, { r: 9, c: 7 }, { r: 8, c: 7 }, { r: 7, c: 7 }],
  ELF: [{ r: 7, c: 1 }, { r: 7, c: 2 }, { r: 7, c: 3 }, { r: 7, c: 4 }, { r: 7, c: 5 }, { r: 7, c: 6 }, { r: 7, c: 7 }]
};

/**
 * 角色起飞格在外圈路径中的索引偏移
 */
const START_OFFSETS: Record<string, number> = {
  ELF: 0,
  GENTLEMAN: 13,
  LADY: 26,
  KNIGHT: 39
};

export function getPlayerPath(role: PartyRole): PathCoord[] {
  const startOffset = START_OFFSETS[role] ?? 0;
  const fullPath: PathCoord[] = [];
  
  // 绕场一周 (50格)
  for (let i = 0; i < 50; i++) {
    fullPath.push(OUTER_LOOP[(startOffset + i) % 52]);
  }
  
  // 进入冲刺道 (7格)
  const goalPath = GOAL_PATHS[role] || [];
  return [...fullPath, ...goalPath];
}

export function generateBoardMap(): TileType[] {
  // 在 15x15 的结构中，TileType 将被用来渲染特定格子的背景
  return new Array(225).fill('blank'); 
}

export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export function canStart(diceValue: number): boolean {
  return [2, 4, 6].includes(diceValue);
}

export function calculateNewPosition(current: number, steps: number, isHome: boolean): number {
  if (isHome) return 0; // 起飞
  return current + steps;
}

export function getBasePos(role: PartyRole, index: number): PathCoord {
  const bases: Record<string, PathCoord> = {
    GENTLEMAN: { r: 2, c: 2 },
    LADY: { r: 2, c: 12 },
    KNIGHT: { r: 12, c: 12 },
    ELF: { r: 12, c: 2 }
  };
  const base = bases[role] || { r: 0, c: 0 };
  const offsets = [
    { r: -1, c: -1 }, { r: -1, c: 1 }, 
    { r: 1, c: -1 }, { r: 1, c: 1 }
  ];
  const offset = offsets[index] || { r: 0, c: 0 };
  return { r: base.r + offset.r, c: base.c + offset.c };
}
