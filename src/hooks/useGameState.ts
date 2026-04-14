import { useState, useEffect, useCallback } from 'react';
import { GameState, Player, TaskEventData, Theme, PartyRole } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';
import { generateBoardMap, SNAKE_PATH, getPlayerPath, OUTER_LOOP } from '../utils/gameLogic';
import { DEFAULT_THEMES } from '../data/defaultThemes';

const STORAGE_KEY = 'party-ludo-game-state';

// 已废弃的主题 ID（从 localStorage 合并时过滤，防止旧缓存复活）
const DEPRECATED_THEME_IDS: readonly string[] = [
  'wild', 'cyber_speed',
  'wild_husband', 'wild_wife', 'wild_bull',
  'cyber_speed_husband', 'cyber_speed_wife', 'cyber_speed_bull',
];

export const initialPlayers: Player[] = [
  { id: 0, name: '绅士', color: '#0A84FF', role: 'GENTLEMAN', step: 0, themeId: null, isFinished: false, taskIndex: 0 },
  { id: 1, name: '淑女', color: '#FF375F', role: 'LADY', step: 0, themeId: null, isFinished: false, taskIndex: 0 }
];

// 定义“幸运格”的步数索引（基于 48 步的公共路径，保持稀有感）
export const LUCKY_STEPS = [7, 16, 25, 34, 43];

// 新增：任务格图标配置 (Lucide-React 组件名)
export const TASK_ICON = 'Zap';

/**
 * 任务梯度分池大小：控制游戏难度进度的颗粒度
 * 统一设置为 4，意味着每完成 4 个任务，游戏的任务广度就会向高一阶的难度池推进。
 */
export const BUCKET_SIZE = 4;

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function isThemeAllowedForRole(theme: Theme, role: Player['role']) {
  return theme.audience === 'common' || theme.audience === role;
}

/**
 * 分段洗牌算法：保证整体难度梯度的同时，增加局部随机惊喜
 * 默认每 8 张卡为一个“战区”，在战区内进行随机排序
 */
function getBucketShuffledIndex(realIndex: number, totalTasks: number, playerId: number): number {
  const bucketNo = Math.floor(realIndex / BUCKET_SIZE);
  const posInBucket = realIndex % BUCKET_SIZE;

  // 生成该战区的原始索引序列
  const bucketStart = bucketNo * BUCKET_SIZE;
  const indices: number[] = [];
  for (let i = 0; i < BUCKET_SIZE; i++) {
    const idx = bucketStart + i;
    if (idx < totalTasks) {
      indices.push(idx);
    }
  }

  if (indices.length <= 1) return realIndex;

  // 使用基于随机种子（桶编号 + 玩家ID）的确定性洗牌
  // 这样保证同一个玩家在同一局中看到的顺序是稳定的，但不同局不同
  let seed = bucketNo * 59 + playerId + 13;
  for (let i = indices.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = seed % (i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices[posInBucket] ?? (realIndex % totalTasks);
}

function normalizePlayers(input: unknown): Player[] {
  const incoming = Array.isArray(input) ? input : [];
  if (incoming.length < 2) return initialPlayers;

  return incoming.map((p, index) => {
    const record = isRecord(p) ? p : {};
    const roleValue = record.role as PartyRole;
    const themeIdValue = record.themeId;
    const defaultNames: Record<string, string> = { GENTLEMAN: '绅士', LADY: '淑女', KNIGHT: '骑士' };

    let name: string = typeof record.name === 'string' ? record.name : (defaultNames[roleValue as string] || `玩家${index + 1}`);

    // Cleanup old role names
    if (name === '精灵' || name === '精') {
      name = defaultNames[roleValue as string] || `玩家${index + 1}`;
    }

    return {
      id: typeof record.id === 'number' ? record.id : index,
      name: name,
      color: typeof record.color === 'string' ? record.color : '#FFFFFF',
      role: ['GENTLEMAN', 'LADY', 'KNIGHT'].includes(roleValue) ? roleValue : (roleValue === ('ELF' as PartyRole) ? 'LADY' : 'GENTLEMAN'),
      step: typeof record.step === 'number' ? Math.max(0, record.step) : 0,
      themeId: typeof themeIdValue === 'string' || themeIdValue === null ? themeIdValue : null,
      isFinished: !!record.isFinished,
      taskIndex: typeof record['taskIndex'] === 'number' ? (record['taskIndex'] as number) : 0
    };
  });
}

function normalizeThemes(input: unknown): Theme[] {
  const incoming = Array.isArray(input) ? input : [];
  const themesMap = new Map<string, Theme>();

  // 1. 先加载代码中的默认主题 (确保代码更新能生效)
  DEFAULT_THEMES.forEach(t => themesMap.set(t.id, t));

  // 2. 合并来自存储的主题 (主要是保留用户自定义的主题)
  incoming.forEach(t => {
    if (isRecord(t) && typeof t.id === 'string') {
      const id = t.id;
      // 如果 ID 不在默认主题中，且不在弃用列表中，说明是用户新建的主题，合并进来
      if (!themesMap.has(id) && !DEPRECATED_THEME_IDS.includes(id)) {
        const tasksValue = t.tasks;
        const tasks = Array.isArray(tasksValue)
          ? tasksValue.map(x => (typeof x === 'string' ? x.trim() : '')).filter((x): x is string => x.length > 0)
          : [];

        themesMap.set(id, {
          id: id,
          name: typeof t.name === 'string' ? t.name : '未命名主题',
          desc: typeof t.desc === 'string' ? t.desc : '',
          audience: ['common', 'GENTLEMAN', 'LADY', 'KNIGHT'].includes(t.audience as string)
            ? (t.audience as Theme['audience'])
            : 'common',
          tasks
        });
      }
    }
  });

  return Array.from(themesMap.values());
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

  const switchView = useCallback((view: GameState['view']) => {
    setState(prev => ({ ...prev, view }));
  }, []);

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
          step: 0,
          themeId: validTheme,
          taskIndex: 0
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

    setState(prev => {
      const next: GameState = {
        ...prev,
        view: 'game',
        turn: Math.floor(Math.random() * prev.players.length)
      };

      return next;
    });

    return true;
  }, [state.players, state.themes]);

  const movePlayer = useCallback((steps: number) => {
    let won = false;
    setState(prev => {
      const activePlayer = prev.players[prev.turn];
      const path = getPlayerPath(activePlayer.id) || SNAKE_PATH;
      const pathLen = path.length;

      const remaining = (pathLen - 1) - activePlayer.step;

      // 只要点数大于或等于剩余步数，就移动到终点并获胜
      const actualSteps = Math.min(steps, remaining);
      const finalStep = activePlayer.step + actualSteps;

      if (finalStep === pathLen - 1) {
        won = true;
      }

      return {
        ...prev,
        players: prev.players.map(p => p.id === activePlayer.id ? { ...p, step: finalStep, isFinished: finalStep === pathLen - 1 } : p)
      };
    });
    return won;
  }, []);

  const endTurn = useCallback(() => {
    setState(prev => ({ ...prev, turn: (prev.turn + 1) % prev.players.length, isRolling: false }));
  }, []);

  const setIsRolling = useCallback((rolling: boolean) => setState(prev => ({ ...prev, isRolling: rolling })), []);

  const checkTile = useCallback((finalStep: number): TaskEventData | 'win' | null => {
    const activePlayer = state.players[state.turn];
    const path = getPlayerPath(activePlayer.id);
    const pathLen = path.length;

    // 1. 物理坐标胜利判定 (最高优先级防卡死)
    const currentCoord = path[finalStep];
    if (currentCoord && currentCoord.r === 6 && currentCoord.c === 6) {
      return 'win';
    }

    // 2. 索引胜利判定
    if (finalStep >= pathLen - 1) return 'win';

    // 3. 碰撞检测
    const opponent = state.players.find(p => {
      if (p.id === activePlayer.id) return false;
      const oppPath = getPlayerPath(p.id);
      const oppCoord = oppPath[p.step];
      return oppCoord && oppCoord.r === currentCoord.r && oppCoord.c === currentCoord.c;
    });

    const theme = state.themes.find(t => t.id === activePlayer.themeId);
    let task = '完成一个挑战！';
    if (theme && theme.tasks.length > 0) {
      // 核心修复：通过物理坐标计算全局索引，确保所有颜色的玩家坐标一致
      const currentCoord = path[finalStep];
      const globalIdx = OUTER_LOOP.findIndex(c => c.r === currentCoord.r && c.c === currentCoord.c);

      // 检查是否在全局幸运格及其磁吸范围内
      const isLucky = globalIdx !== -1 && LUCKY_STEPS.some(luckyStep => {
        // 在 48 步循环路径中，计算环形距离
        const dist = Math.abs(luckyStep - globalIdx);
        // 考虑环路循环（48步首尾相接）
        return dist <= 1 || dist === OUTER_LOOP.length - 1;
      });

      let finalTaskIdx = getBucketShuffledIndex(activePlayer.taskIndex, theme.tasks.length, activePlayer.id);

      if (isLucky) {
        // 如果是幸运格，在此档位 (Bucket) 内“精准插队”找出一张奖励卡
        const bucketNo = Math.floor(activePlayer.taskIndex / BUCKET_SIZE);
        const bucketStart = bucketNo * BUCKET_SIZE;

        // 搜索当前档位内是否存在奖励或特权卡 (增加识别词：奖赏、特权、豁免)
        let rewardIdx = theme.tasks.findIndex((t, idx) =>
          idx >= bucketStart &&
          idx < bucketStart + BUCKET_SIZE &&
          (t.includes('[★') || t.includes('奖励') || t.includes('奖赏') || t.includes('特权') || t.includes('豁免'))
        );

        // 【终极保底】：如果当前档位没奖励了，就向后跨组搜索整张卡包
        if (rewardIdx === -1) {
          rewardIdx = theme.tasks.findIndex((t, idx) =>
            idx >= activePlayer.taskIndex &&
            (t.includes('[★') || t.includes('奖励') || t.includes('奖赏') || t.includes('特权') || t.includes('豁免'))
          );
        }

        if (rewardIdx !== -1) {
          finalTaskIdx = rewardIdx;
        }
      }

      task = theme.tasks[finalTaskIdx % theme.tasks.length];
    }

    if (opponent) {
      return { type: 'collision', initiatorPlayerId: activePlayer.id, executorPlayerId: opponent.id, title: '不期而遇', subtitle: `任务来自「${theme?.name || ''}」`, icon: 'handshake', color: 'text-yellow-400', task, taskSourceId: activePlayer.themeId || '' };
    }

    // 普通格：触发任务卡
    return { type: 'lucky', initiatorPlayerId: activePlayer.id, executorPlayerId: activePlayer.id, title: '任务卡', subtitle: `来自「${theme?.name || '未知主题'}」`, icon: 'star', color: 'text-blue-400', task, taskSourceId: activePlayer.themeId || '' };
  }, [state.players, state.turn, state.themes]);

  const resolveTask = useCallback((task: TaskEventData, outcome: 'accept' | 'reject') => {
    setState(prev => {
      let nextPlayers = prev.players.map(p =>
        p.id === task.initiatorPlayerId ? { ...p, taskIndex: p.taskIndex + 1 } : p
      );
      if (outcome === 'reject') {
        const backSteps = Math.floor(Math.random() * 3) + 1;
        nextPlayers = nextPlayers.map(p => p.id === task.executorPlayerId ? { ...p, step: task.type === 'collision' ? 0 : Math.max(0, p.step - backSteps) } : p);
      }
      return { ...prev, players: nextPlayers, turn: (prev.turn + 1) % prev.players.length, isRolling: false };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(prev => ({
      ...prev, view: 'home', turn: 0,
      players: prev.players.map(p => ({ ...p, themeId: null, step: 0, taskIndex: 0 })),
      boardMap: generateBoardMap(), pathCoords: [], isRolling: false
    }));
  }, []);

  return { state, switchView, updatePlayersConfig, selectTheme, createTheme, updateThemeMeta, addThemeTask, removeThemeTask, startGame, movePlayer, endTurn, setIsRolling, checkTile, resolveTask, resetGame };
}
