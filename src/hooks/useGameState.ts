import { useState, useEffect, useCallback } from 'react';
import { GameState, Player, TaskEventData, Theme, PartyRole } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';
import { generateBoardMap, canStart, getPlayerPath } from '../utils/gameLogic';
import { DEFAULT_THEMES } from '../data/defaultThemes';

const STORAGE_KEY = 'party-ludo-game-state';

export const initialPlayers: Player[] = [
  { id: 0, name: '绅士', color: '#0A84FF', role: 'GENTLEMAN', step: -1, themeId: null, isFinished: false },
  { id: 1, name: '淑女', color: '#FF375F', role: 'LADY', step: -1, themeId: null, isFinished: false }
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function isThemeAllowedForRole(theme: Theme, role: Player['role']) {
  return theme.audience === 'common' || theme.audience === role;
}

function normalizePlayers(input: unknown): Player[] {
  const incoming = Array.isArray(input) ? input : [];
  if (incoming.length < 2) return initialPlayers;

  return incoming.map((p, index) => {
    const record = isRecord(p) ? p : {};
    const roleValue = record.role as PartyRole;
    const themeIdValue = record.themeId;

    return {
      id: typeof record.id === 'number' ? record.id : index,
      name: typeof record.name === 'string' ? record.name : `玩家${index + 1}`,
      color: typeof record.color === 'string' ? record.color : '#FFFFFF',
      role: ['GENTLEMAN', 'LADY', 'KNIGHT', 'ELF'].includes(roleValue) ? roleValue : 'GENTLEMAN',
      step: typeof record.step === 'number' ? record.step : -1,
      themeId: typeof themeIdValue === 'string' || themeIdValue === null ? themeIdValue : null,
      isFinished: !!record.isFinished
    };
  });
}

function normalizeThemes(input: unknown): Theme[] {
  const incoming = Array.isArray(input) ? input : [];
  const source = incoming.length > 0 ? incoming : DEFAULT_THEMES;

  return source
    .map(t => {
      const record = isRecord(t) ? t : {};
      const tasksValue = record.tasks;
      const tasks = Array.isArray(tasksValue)
        ? tasksValue.map(x => (typeof x === 'string' ? x.trim() : '')).filter((x): x is string => x.length > 0)
        : [];

      const audienceValue = record.audience;

      return {
        id: typeof record.id === 'string' ? record.id : `theme_${Date.now()}`,
        name: typeof record.name === 'string' ? record.name : '未命名主题',
        desc: typeof record.desc === 'string' ? record.desc : '',
        audience:
          ['common', 'GENTLEMAN', 'LADY', 'KNIGHT', 'ELF'].includes(audienceValue as string)
            ? (audienceValue as Theme['audience'])
            : 'common',
        tasks
      } satisfies Theme;
    })
    .reduce<Theme[]>((acc, theme) => {
      if (acc.some(t => t.id === theme.id)) return acc;
      acc.push(theme);
      return acc;
    }, []);
}

function normalizeGameState(saved: unknown): GameState | null {
  if (!isRecord(saved)) return null;
  const s = saved;

  const themes = normalizeThemes(s.themes);
  const players = normalizePlayers(s.players).map(p => {
    if (p.themeId === null) return p;
    const theme = themes.find(t => t.id === p.themeId);
    if (!theme || !isThemeAllowedForRole(theme, p.role)) return { ...p, themeId: null };
    return p;
  });

  return {
    view: s.view === 'home' || s.view === 'game' || s.view === 'themes' ? s.view : 'home',
    turn: typeof s.turn === 'number' && s.turn >= 0 && s.turn < players.length ? s.turn : 0,
    players,
    themes,
    boardMap: generateBoardMap(),
    pathCoords: [], // 15x15 模式下不再需要全局路径，路径是 per-player 的
    isRolling: !!s.isRolling
  };
}

function createThemeId(existingIds: Set<string>) {
  const base = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? (crypto as Crypto).randomUUID() : `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  let id = `user_${base}`;
  while (existingIds.has(id)) {
    id = `user_${base}_${Math.random().toString(36).slice(2, 6)}`;
  }
  return id;
}

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const saved = loadFromStorage<GameState | null>(STORAGE_KEY, null);
    const normalized = normalizeGameState(saved);
    if (normalized) return normalized;

    return {
      view: 'home',
      turn: 0,
      players: initialPlayers,
      themes: DEFAULT_THEMES,
      boardMap: generateBoardMap(),
      pathCoords: [],
      isRolling: false
    };
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEY, state);
  }, [state]);

  const switchView = useCallback((view: GameState['view']) => setState(prev => ({ ...prev, view })), []);

  const updatePlayersConfig = useCallback((players: Omit<Player, 'step' | 'themeId'>[]) => {
    setState(prev => ({
      ...prev,
      players: players.map((p) => {
        const existing = prev.players.find(oldP => oldP.id === p.id);
        const playerTheme = existing?.themeId;
        // Verify if theme is still compatible with new role
        const themeDef = playerTheme ? prev.themes.find(t => t.id === playerTheme) : null;
        const validTheme = themeDef && isThemeAllowedForRole(themeDef, p.role) ? (playerTheme ?? null) : null;
        
        return {
          ...p,
          step: -1,
          themeId: validTheme
        };
      })
    }));
  }, []);

  const selectTheme = useCallback((playerId: number, themeId: string) => {
    setState(prev => ({ ...prev, players: prev.players.map(p => p.id === playerId ? { ...p, themeId } : p) }));
  }, []);

  const createTheme = useCallback((input: { name: string; desc?: string; audience: Theme['audience'] }) => {
    const name = input.name.trim();
    if (!name) return null;
    let createdId: string | null = null;
    setState(prev => {
      const id = createThemeId(new Set(prev.themes.map(t => t.id)));
      createdId = id;
      return { ...prev, themes: [...prev.themes, { id, name, desc: (input.desc || '').trim(), audience: input.audience, tasks: [] }] };
    });
    return createdId;
  }, []);

  const updateThemeMeta = useCallback((themeId: string, patch: Partial<Pick<Theme, 'name' | 'desc' | 'audience'>>) => {
    setState(prev => ({
      ...prev,
      themes: prev.themes.map(t => {
        if (t.id !== themeId) return t;
        return { ...t, name: typeof patch.name === 'string' ? patch.name.trim() || t.name : t.name, desc: typeof patch.desc === 'string' ? patch.desc.trim() : t.desc, audience: patch.audience || t.audience };
      })
    }));
  }, []);

  const addThemeTask = useCallback((themeId: string, taskText: string) => {
    const trimmed = taskText.trim();
    if (!trimmed) return;
    setState(prev => ({ ...prev, themes: prev.themes.map(t => t.id === themeId && !t.tasks.includes(trimmed) ? { ...t, tasks: [...t.tasks, trimmed] } : t) }));
  }, []);

  const removeThemeTask = useCallback((themeId: string, index: number) => {
    setState(prev => ({ ...prev, themes: prev.themes.map(t => t.id === themeId && index >= 0 && index < t.tasks.length ? { ...t, tasks: t.tasks.filter((_, i) => i !== index) } : t) }));
  }, []);

  const startGame = useCallback(() => {
    for (const player of state.players) {
      if (!player.themeId) return false;
      const theme = state.themes.find(t => t.id === player.themeId);
      if (!theme || !isThemeAllowedForRole(theme, player.role) || theme.tasks.length === 0) return false;
    }
    setState(prev => ({ ...prev, view: 'game', turn: Math.floor(Math.random() * prev.players.length) }));
    return true;
  }, [state.players, state.themes]);

  const movePlayer = useCallback((steps: number) => {
    setState(prev => {
      const activePlayer = prev.players[prev.turn];
      const isHome = activePlayer.step === -1;
      
      // 起飞逻辑
      if (isHome) {
        if (canStart(steps)) {
          return { ...prev, players: prev.players.map(p => p.id === activePlayer.id ? { ...p, step: 0 } : p) };
        }
        return prev;
      }
      
      return { ...prev, players: prev.players.map(p => p.id === activePlayer.id ? { ...p, step: activePlayer.step + steps } : p) };
    });
  }, []);

  const endTurn = useCallback(() => {
    setState(prev => ({ ...prev, turn: (prev.turn + 1) % prev.players.length, isRolling: false }));
  }, []);

  const setIsRolling = useCallback((rolling: boolean) => setState(prev => ({ ...prev, isRolling: rolling })), []);

  const checkTile = useCallback((landingStep: number): TaskEventData | 'win' | null => {
    const activePlayer = state.players[state.turn];
    const playerPath = getPlayerPath(activePlayer.role);
    
    if (landingStep >= playerPath.length - 1) return 'win';
    let overlappedOpponent = state.players.find(p => p.id !== activePlayer.id && p.step === landingStep);
    
    if (landingStep !== -1 && overlappedOpponent) {
      const theme = state.themes.find(t => t.id === activePlayer.themeId);
      const task = theme?.tasks[Math.floor(Math.random() * theme.tasks.length)] || '';
      return { type: 'collision', initiatorPlayerId: activePlayer.id, executorPlayerId: overlappedOpponent.id, title: '不期而遇', subtitle: `任务来自「${theme?.name || ''}」`, icon: 'handshake', color: 'text-yellow-400', task, taskSourceId: activePlayer.themeId || '' };
    }

    // 在 15x15 模式下，boardMap 暂时仅用于渲染背景，这里逻辑可以简化或预留
    return null;
  }, [state.players, state.turn, state.themes]);

  const resolveTask = useCallback((task: TaskEventData, outcome: 'accept' | 'reject') => {
    setState(prev => {
      let nextPlayers = prev.players;
      if (outcome === 'reject') {
        const backSteps = Math.floor(Math.random() * 3) + 1;
        nextPlayers = prev.players.map(p => p.id === task.executorPlayerId ? { ...p, step: task.type === 'collision' ? 0 : Math.max(0, p.step - backSteps) } : p);
      }
      return { ...prev, players: nextPlayers, turn: (prev.turn + 1) % prev.players.length, isRolling: false };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(prev => ({
      ...prev, view: 'home', turn: 0,
      players: prev.players.map(p => ({ ...p, themeId: null, step: -1 })),
      boardMap: generateBoardMap(), pathCoords: [], isRolling: false
    }));
  }, []);

  return { state, switchView, updatePlayersConfig, selectTheme, createTheme, updateThemeMeta, addThemeTask, removeThemeTask, startGame, movePlayer, endTurn, setIsRolling, checkTile, resolveTask, resetGame };
}
