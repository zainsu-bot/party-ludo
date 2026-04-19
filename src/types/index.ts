export type TileType = 'blank' | 'lucky' | 'trap' | 'base' | 'goal';

export type PartyRole = 'GENTLEMAN' | 'LADY' | 'KNIGHT';

export interface Player {
  id: number;
  name: string;
  color: string;
  role: PartyRole;
  step: number; // Position in the pathCoords array (-1 means in base)
  themeIds: string[];
  isFinished: boolean;
  taskIndex: number; // Tracks sequential index for drawn puzzle/task cards
  sessionPool?: string[]; // Generated mixed tasks for the current game
}

export type ThemeAudience = 'common' | 'GENTLEMAN' | 'LADY' | 'KNIGHT';

export interface Theme {
  id: string;
  name: string;
  desc: string;
  audience: ThemeAudience;
  tasks: string[];
}

export interface PathCoord {
  r: number;
  c: number;
}

export interface GameState {
  view: 'home' | 'game' | 'themes';
  turn: number;
  players: Player[];
  themes: Theme[];
  boardMap: TileType[];
  pathCoords: PathCoord[];
  isRolling: boolean;
  boardTasks?: string[];
}

export interface TaskEventData {
  type: 'collision' | 'lucky' | 'trap';
  initiatorPlayerId: number;
  executorPlayerId: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  task: string;
  taskSourceId: string;
}
