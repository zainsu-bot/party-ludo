export type TileType = 'blank' | 'lucky' | 'trap';

export type PartyRole = 'husband' | 'wife' | 'bull' | 'female_partner';

export interface Player {
  id: number;
  name: string;
  color: string;
  role: PartyRole;
  step: number;
  themeId: string | null;
}

export type ThemeAudience = 'common' | 'husband' | 'wife' | 'bull' | 'female_partner';

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
