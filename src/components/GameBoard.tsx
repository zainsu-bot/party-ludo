import { Player } from '../types';
import {
  GET_BOARD_MATRIX, getPlayerPath, SNAKE_COLS, SNAKE_ROWS, OUTER_LOOP
} from '../utils/gameLogic';
import { Trophy, Gift, Zap } from 'lucide-react';
import { LUCKY_STEPS } from '../hooks/useGameState';

interface GameBoardProps {
  players: Player[];
  currentTurn: number;
}

const TILE_THEME: Record<string, { glow: string; border: string; accent: string; bg: string; bgStrong: string }> = {
  default: { glow: 'shadow-[0_0_20px_rgba(255,255,255,0.1)]', border: 'border-white/10', accent: 'text-white/80', bg: 'bg-white/10', bgStrong: 'bg-white/20' },
  blue:    { glow: 'shadow-[0_0_40px_rgba(59,130,246,0.6)]', border: 'border-blue-400', accent: 'text-blue-100', bg: 'bg-blue-600/40', bgStrong: 'bg-blue-600/60' },
  rose:    { glow: 'shadow-[0_0_40px_rgba(244,114,182,0.6)]', border: 'border-rose-400', accent: 'text-rose-100', bg: 'bg-rose-600/40', bgStrong: 'bg-rose-600/60' },
  green:   { glow: 'shadow-[0_0_40px_rgba(34,197,94,0.6)]', border: 'border-green-400', accent: 'text-green-100', bg: 'bg-green-600/40', bgStrong: 'bg-green-600/60' },
  amber:   { glow: 'shadow-[0_0_40px_rgba(245,158,11,0.6)]', border: 'border-amber-400', accent: 'text-amber-100', bg: 'bg-amber-600/40', bgStrong: 'bg-amber-600/60' },
  special: { glow: 'shadow-[0_0_45px_rgba(251,191,36,0.4)]', border: 'border-amber-300', accent: 'text-amber-100', bg: 'bg-amber-500/40', bgStrong: 'bg-amber-500/60' },
  goal:    { glow: 'shadow-[0_0_60px_rgba(251,113,133,0.8)]', border: 'border-rose-400', accent: 'text-rose-50', bg: 'bg-rose-600/50', bgStrong: 'bg-rose-600/70' },
  public:  { glow: 'shadow-[0_0_35px_rgba(168,85,247,0.5)]', border: 'border-purple-400', accent: 'text-purple-50', bg: 'bg-indigo-900/60', bgStrong: 'bg-purple-500/30' },
};

export function GameBoard({ players, currentTurn }: GameBoardProps) {
  
  const renderPlayers = (here: Player[]) => {
    if (here.length === 0) return null;
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="flex flex-wrap items-center justify-center gap-0.5 p-1 w-full h-full">
          {here.map(p => (
            <div
              key={p.id}
              className={`
                shrink-0
                w-5 h-5 sm:w-7 sm:h-7 lg:w-9 lg:h-9 rounded-full border-[2px] sm:border-[3px] border-white flex items-center justify-center 
                text-[8px] sm:text-[10px] lg:text-sm font-black shadow-2xl transform transition-all duration-300
                ${p.id === currentTurn ? 'scale-110 z-10 animate-bounce ring-[4px] sm:ring-[6px] ring-white/40' : 'opacity-100 scale-100'}
              `}
              style={{ 
                backgroundColor: p.color, 
                boxShadow: `0 0 20px ${p.color}, inset 0 0 10px rgba(0,0,0,0.3)`,
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.4)'
              }}
            >
              {p.name.substring(0, 1)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTile = (row: number, col: number) => {
    const matrixValue = GET_BOARD_MATRIX()[row][col];
    
    // 根据当前坐标查找落在这里的棋子
    const here = players.filter(p => {
      const path = getPlayerPath(p.id);
      const coord = path[p.step];
      return coord && coord.r === row && coord.c === col;
    });

    const isActivePlayerHere = here.some(p => p.id === currentTurn);

    // 获取当前格子在 48 步公共路径中的索引
    const stepIndex = OUTER_LOOP.findIndex(c => c.r === row && c.c === col);
    const isLuckyCenter = LUCKY_STEPS.includes(stepIndex);
    const isLuckyZone = !isLuckyCenter && stepIndex !== -1 && LUCKY_STEPS.some(ls => Math.abs(ls - stepIndex) <= 1);

    // 1. 处理基地 (5, 6, 7, 8)
    const baseThemes: Record<string | number, { bg: string; border: string; shadow: string; glow: string; themeKey: string }> = {
      5:   { bg: 'bg-blue-600/50',  border: 'border-blue-400',  shadow: 'shadow-[0_0_40px_rgba(59,130,246,0.6)]', glow: 'from-blue-400/40', themeKey: 'blue' },
      6:   { bg: 'bg-rose-600/50',  border: 'border-rose-400',  shadow: 'shadow-[0_0_40px_rgba(244,63,94,0.6)]', glow: 'from-rose-400/40', themeKey: 'rose' },
      7:   { bg: 'bg-green-600/50', border: 'border-green-400', shadow: 'shadow-[0_0_40px_rgba(34,197,94,0.6)]', glow: 'from-green-400/40', themeKey: 'green' },
      8:   { bg: 'bg-amber-600/55', border: 'border-amber-400', shadow: 'shadow-[0_0_40px_rgba(245,158,11,0.7)]', glow: 'from-amber-400/50', themeKey: 'amber' },
    };

    if (matrixValue !== null && baseThemes[matrixValue as any]) {
      const b = baseThemes[matrixValue as any];
      return (
        <div key={`${row}-${col}`} className={`relative w-full h-full aspect-square rounded-md sm:rounded-lg ${b.bg} border-[2px] lg:border-[3px] ${b.border} ${b.shadow} backdrop-blur-2xl transition-all duration-700`}>
           <div className={`absolute inset-0 bg-gradient-to-br ${b.glow} to-transparent opacity-50 rounded-md sm:rounded-lg`} />
           {renderPlayers(here)}
        </div>
      );
    }

    // 2. 处理航道 (2: 公共, a,b,c,d: 个人冲刺)
    const laneThemes: Record<string | number, string> = {
      2: 'public',
      'a': 'blue', 'b': 'rose', 'c': 'amber', 'd': 'green'
    };

    if (matrixValue !== null && laneThemes[matrixValue as any]) {
      const themeKey = laneThemes[matrixValue as any];
      const theme = (TILE_THEME as any)[themeKey] || TILE_THEME.default;
      return (
        <div
          key={`${row}-${col}`}
          className={`
            relative w-full h-full aspect-square rounded-md sm:rounded-lg transition-all duration-500
            border-[2px] lg:border-[3px]
            backdrop-blur-2xl ${theme.bg}
            ${theme.border} ${theme.glow}
            ${isActivePlayerHere ? 'scale-105 border-white ring-[4px] sm:ring-[6px] ring-white/20 z-10 shadow-[0_0_50px_rgba(255,255,255,0.4)]' : ''}
          `}
        >
          {renderPlayers(here)}
          {here.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {isLuckyCenter ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-400 blur-md opacity-40 scale-150" />
                  <Gift size={16} className="text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,1)]" />
                </div>
              ) : isLuckyZone ? (
                <div className="relative">
                   <div className="absolute inset-0 bg-amber-400/20 blur-sm scale-110" />
                   <span className="text-amber-400 text-xs font-bold drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]">★</span>
                </div>
              ) : (
                <div className="opacity-20 group-hover:opacity-40 transition-opacity">
                  <Zap size={14} className="text-white fill-current" />
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // 3. 处理终点中心 (1)
    if (matrixValue === 1) {
      return (
        <div key={`${row}-${col}`} className={`relative w-full h-full aspect-square rounded-md sm:rounded-lg flex items-center justify-center border-[2px] lg:border-[3px] ${TILE_THEME.goal.border} ${TILE_THEME.goal.glow} backdrop-blur-3xl bg-gradient-to-br from-amber-400 via-rose-500 to-amber-600 shadow-[0_0_80px_rgba(251,113,133,0.6)]`}>
          <div className="absolute inset-0 bg-white/20 rounded-md sm:rounded-lg" />
          <Trophy size={20} className="text-white drop-shadow-[0_0_20px_rgba(251,191,36,1)] z-10 sm:scale-125" />
          {renderPlayers(here)}
        </div>
      );
    }

    // 4. 空白区域 (0) - 增加微弱底盘
    return (
      <div key={`${row}-${col}`} className="aspect-square flex items-center justify-center">
        <div className="w-1 h-1 bg-white/10 rounded-full" />
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div 
        className="relative p-3 md:p-6 rounded-[48px] shadow-[0_30px_100px_rgba(0,0,0,0.8)] border-[6px] border-white/5 overflow-hidden"
        style={{
          width: '100%',
          maxWidth: '850px',
          background: '#0a0508',
        }}
      >
        <div 
          className="grid gap-2 relative z-10"
          style={{ gridTemplateColumns: `repeat(${SNAKE_COLS}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: SNAKE_ROWS }, (_, r) =>
            Array.from({ length: SNAKE_COLS }, (_, c) => renderTile(r, c))
          )}
        </div>
      </div>
    </div>
  );
}
