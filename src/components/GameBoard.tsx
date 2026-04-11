import { TileType, PathCoord, Player } from '../types';
import { Sparkles, Bomb, Trophy, User, Gift, XCircle, Home } from 'lucide-react';
import { GRID_W, GRID_H, TILES_COUNT } from '../utils/gameLogic';

interface GameBoardProps {
  boardMap: TileType[];
  pathCoords: PathCoord[];
  players: Player[];
  currentTurn: number;
}

export function GameBoard({ boardMap, pathCoords, players, currentTurn }: GameBoardProps) {
  
  const getTileAt = (r: number, c: number) => {
    return pathCoords.findIndex(coord => coord.r === r && coord.c === c);
  };

  const renderTile = (r: number, c: number) => {
    const step = getTileAt(r, c);
    if (step === -1) return <div key={`${r}-${c}`} className="invisible" />; // Not part of path (shouldn't happen in full 8x5)

    const type = boardMap[step];
    const isStart = step === 0;
    const isEnd = step === TILES_COUNT - 1;

    let baseClasses = "relative rounded-xl border border-white/10 flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-105 duration-200 aspect-[5/6] cursor-default bg-gradient-to-br ";
    let content = null;

    if (isStart) {
      baseClasses += "from-emerald-400 to-emerald-600 border-white/30 text-white shadow-emerald-500/40";
      content = <><Gift size={24} className="mb-1"/><span className="text-[10px] font-bold">起点</span></>;
    } else if (isEnd) {
      baseClasses += "from-blue-500 to-indigo-600 border-white/30 text-white shadow-blue-500/40";
      content = <><Trophy size={24} className="mb-1 text-yellow-300"/><span className="text-[10px] font-bold">终点</span></>;
    } else if (type === 'lucky') {
      baseClasses += "from-amber-400 to-orange-500 text-white";
      content = <><Sparkles size={24} className="mb-1"/><span className="text-[10px] font-bold">幸运</span></>;
    } else if (type === 'trap') {
      baseClasses += "from-rose-500 to-red-600 text-white";
      content = <><Bomb size={24} className="mb-1"/><span className="text-[10px] font-bold">惩罚</span></>;
    } else {
      baseClasses += "from-purple-500 to-fuchsia-600 text-white";
      content = <><span className="text-2xl font-black opacity-30 mb-1">⚡</span><span className="text-[10px] whitespace-nowrap">普通任务</span></>;
    }

    return (
      <div key={`${r}-${c}`} className={baseClasses}>
        <div className="absolute top-1 left-2 text-xs font-black opacity-60 mix-blend-overlay">{step + 1}</div>
        {content}
      </div>
    );
  };

  return (
    <div className="w-full relative" style={{ maxWidth: '800px' }}>
      <div 
        className="w-full grid gap-2" 
        style={{ 
          gridTemplateColumns: `repeat(${GRID_W}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_H}, minmax(0, 1fr))`
        }}
      >
        {Array.from({ length: GRID_H }).map((_, r) =>
          Array.from({ length: GRID_W }).map((_, c) => renderTile(r, c))
        )}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {players.map((player) => {
          const coord = pathCoords[player.step];
          if (!coord) return null;

          const playersOnSameTile = players.filter(p => p.step === player.step);
          const isOverlapping = playersOnSameTile.length > 1;
          const indexOnTile = playersOnSameTile.findIndex(p => p.id === player.id);
          
          const isActive = player.id === currentTurn;
          
          let translate = 'translate(0, 0)';
          if (isOverlapping) {
            // Offset calculations for up to 4 players overlapping
            const offsets = [
              '-25%, -25%',
              '25%, 25%',
              '25%, -25%',
              '-25%, 25%'
            ];
            translate = `translate(${offsets[indexOnTile] || '0, 0'})`;
          }

          return (
             <div
              key={player.id}
              className="absolute flex items-center justify-center transition-all duration-500 ease-out z-20"
              style={{
                width: `${100 / GRID_W}%`,
                height: `${100 / GRID_H}%`,
                top: `${(coord.r / GRID_H) * 100}%`,
                left: `${(coord.c / GRID_W) * 100}%`,
              }}
            >
              <div 
                className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-2xl transition-transform duration-300 ${isActive ? 'scale-125 ring-4 ring-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'ring-2 ring-white/50 opacity-90'}`}
                style={{ 
                  backgroundColor: player.color,
                  transform: translate,
                }}
              >
                 <span className="text-white text-xs font-bold leading-none">{player.name.substring(0, 1)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
