import { PathCoord, Player, PartyRole } from '../types';
import { Trophy, Plane } from 'lucide-react';
import { BOARD_SIZE, OUTER_LOOP, getPlayerPath, getBasePos } from '../utils/gameLogic';

interface GameBoardProps {
  players: Player[];
  currentTurn: number;
}

export function GameBoard({ players, currentTurn }: GameBoardProps) {
  
  // 缓存每个角色的全量路径，避免重复计算
  const playerPaths: Record<PartyRole, PathCoord[]> = {
    GENTLEMAN: getPlayerPath('GENTLEMAN'),
    LADY: getPlayerPath('LADY'),
    KNIGHT: getPlayerPath('KNIGHT'),
    ELF: getPlayerPath('ELF')
  };

  // 识别特定格子的属性
  const getTileType = (r: number, c: number) => {
    // 基地判定
    if (r < 6 && c < 6) return { type: 'base', role: 'GENTLEMAN', color: 'bg-blue-500' };
    if (r < 6 && c > 8) return { type: 'base', role: 'LADY', color: 'bg-green-500' };
    if (r > 8 && c > 8) return { type: 'base', role: 'KNIGHT', color: 'bg-red-500' };
    if (r > 8 && c < 6) return { type: 'base', role: 'ELF', color: 'bg-yellow-400' };

    // 中心点判定
    if (r >= 6 && r <= 8 && c >= 6 && c <= 8) {
      if (r === 7 && c === 7) return { type: 'goal', color: 'bg-white', isCenter: true };
      return { type: 'goal', color: 'bg-slate-800' };
    }

    // 路径判定 (基于 OUTER_LOOP 的索引分配颜色)
    const loopIndex = OUTER_LOOP.findIndex(coord => coord.r === r && coord.c === c);
    if (loopIndex !== -1) {
      const colors = ['bg-yellow-400', 'bg-blue-500', 'bg-red-500', 'bg-green-500'];
      return { type: 'path', color: colors[loopIndex % 4], index: loopIndex };
    }

    // 冲刺道判定 (Hardcoded for simplicity in UI)
    if (c === 7 && r > 0 && r < 7) return { type: 'dash', color: 'bg-blue-500' };
    if (r === 7 && c > 7 && c < 14) return { type: 'dash', color: 'bg-green-500' };
    if (c === 7 && r > 7 && r < 14) return { type: 'dash', color: 'bg-red-500' };
    if (r === 7 && c > 0 && c < 7) return { type: 'dash', color: 'bg-yellow-400' };

    return { type: 'empty', color: 'bg-transparent' };
  };

  const renderTile = (r: number, c: number) => {
    const tile = getTileType(r, c);
    
    let baseClasses = "relative w-full aspect-square border-[0.5px] border-white/5 flex items-center justify-center transition-all ";
    baseClasses += tile.color;

    if (tile.type === 'base') {
      // 只有在特定位置显示起飞飞机图标
      const isBaseSlot = (r === 2 || r === 3) && (c === 2 || c === 3 || c === 11 || c === 12);
      return (
        <div key={`${r}-${c}`} className={`${baseClasses} rounded-sm opacity-90`}>
          {isBaseSlot && <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center"><Plane size={10} className="text-white"/></div>}
        </div>
      );
    }

    if (tile.type === 'goal') {
      return (
        <div key={`${r}-${c}`} className={`${baseClasses} rounded-none`}>
          {tile.isCenter && <Trophy size={20} className="text-amber-400 animate-pulse"/>}
        </div>
      );
    }

    if (tile.type === 'empty') {
      return <div key={`${r}-${c}`} className={`${baseClasses} bg-slate-900/30`} />;
    }

    return (
      <div key={`${r}-${c}`} className={`${baseClasses} rounded-sm shadow-inner`}>
        {/* 这里将来可以放任务数字 */}
      </div>
    );
  };

  return (
    <div className="w-full relative select-none p-2 bg-[#1a0b3b] rounded-2xl shadow-2xl border-4 border-slate-800" style={{ maxWidth: '600px' }}>
      {/* 棋盘背景格纹 */}
      <div className="w-full grid grid-cols-15">
        {Array.from({ length: BOARD_SIZE }).map((_, r) =>
          Array.from({ length: BOARD_SIZE }).map((_, c) => renderTile(r, c))
        )}
      </div>

      {/* 玩家棋子层 */}
      <div className="absolute inset-0 pointer-events-none p-2">
        <div className="relative w-full h-full">
          {players.map((player) => {
            // 获取当前位置坐标
            let coord: PathCoord;
            if (player.step === -1) {
              // 还在停机坪
              coord = getBasePos(player.role, 0); // 这里 index 先传 0
            } else {
              const path = playerPaths[player.role];
              coord = path[player.step] || { r: 0, c: 0 };
            }

            const isActive = player.id === currentTurn;
            
            return (
              <div
                key={player.id}
                className="absolute flex items-center justify-center transition-all duration-500 ease-out z-20"
                style={{
                  width: `${100 / BOARD_SIZE}%`,
                  height: `${100 / BOARD_SIZE}%`,
                  top: `${(coord.r / BOARD_SIZE) * 100}%`,
                  left: `${(coord.c / BOARD_SIZE) * 100}%`,
                }}
              >
                <div 
                  className={`relative flex items-center justify-center w-6 h-6 rounded-full shadow-2xl transition-transform duration-300 border-2 border-white ${isActive ? 'scale-125 z-30 shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'opacity-90'}`}
                  style={{ backgroundColor: player.color }}
                >
                   <span className="text-white text-[10px] font-bold leading-none">{player.name.substring(0, 1)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
