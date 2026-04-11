import { useState, useCallback } from 'react';
import { Player, TaskEventData } from '../../types';
import { GameBoard } from '../GameBoard';
import { Dice } from '../Dice';
import { rollDice, getPlayerPath } from '../../utils/gameLogic';
import { ArrowLeft } from 'lucide-react';

interface GameViewProps {
  players: Player[];
  currentTurn: number;
  isRolling: boolean;
  onMove: (steps: number) => void;
  onCheckTile: (landingStep: number) => TaskEventData | 'win' | null;
  onEndTurn: () => void;
  onSetRolling: (rolling: boolean) => void;
  onWin: (winnerId: number) => void;
  onTaskTrigger: (data: TaskEventData) => void;
  onBack: () => void;
  boardTasks?: string[];
}

export function GameView({
  players,
  currentTurn,
  isRolling,
  onMove,
  onCheckTile,
  onEndTurn,
  onSetRolling,
  onWin,
  onTaskTrigger,
  onBack,
  boardTasks,
}: GameViewProps) {
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  const handleRoll = useCallback(() => {
    if (isRolling || isMoving || diceResult) return;

    onSetRolling(true);
    const result = rollDice();

    if (navigator.vibrate) navigator.vibrate(20);

    setTimeout(() => {
      setDiceResult(result);
      onSetRolling(false);
    }, 1000);
  }, [isRolling, isMoving, diceResult, onSetRolling]);

  const handleRollComplete = useCallback(() => {
    if (diceResult) {
      const activePlayer = players[currentTurn];
      const path = getPlayerPath(activePlayer.id);
      const pathLen = path.length;

      const finalStep = Math.min(activePlayer.step + diceResult, pathLen - 1);
      setIsMoving(true);
      onMove(diceResult);

      setTimeout(() => {
        const tileCheck = onCheckTile(finalStep);

        if (tileCheck === 'win') {
          onWin(activePlayer.id);
        } else if (tileCheck) {
          onTaskTrigger(tileCheck);
        } else {
          onEndTurn();
        }

        setDiceResult(null);
        setIsMoving(false);
      }, 600);
    }
  }, [diceResult, players, currentTurn, onMove, onCheckTile, onWin, onTaskTrigger, onEndTurn]);

  const activePlayer = players[currentTurn];
  const pathLen = getPlayerPath(activePlayer.id).length;

  return (
    <div className="fixed inset-0 z-50 bg-[#1e0a13] flex justify-center items-center overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3e1625_0%,_#1e0a13_100%)] opacity-80"></div>
      
      <div className="relative z-10 w-full max-w-4xl h-full p-4 flex flex-col items-center gap-4 overflow-y-auto no-scrollbar pt-6 lg:pt-10">
        
        {/* Compact Header Control Bar */}
        <div className="w-full max-w-[800px] bg-rose-950/40 backdrop-blur-2xl rounded-3xl p-3 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between gap-4">
            
            {/* Back & Player Info */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition text-rose-100 mr-1 cursor-pointer"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg shadow-lg font-black" 
                style={{backgroundColor: activePlayer.color, boxShadow: `0 0 15px ${activePlayer.color}44`}}
              >
                {activePlayer.name.substring(0, 1)}
              </div>
              <div className="flex flex-col ml-1">
                <div className="text-rose-100 font-black text-xs sm:text-sm max-w-[80px] sm:max-w-[none] truncate">{activePlayer.name}</div>
                <div className="text-[9px] sm:text-[10px] text-rose-200/40 font-bold uppercase tracking-wider">
                  进度 {activePlayer.step} / {pathLen - 1}
                </div>
              </div>
            </div>

            {/* Status Text (Middle) */}
            <div className="flex-1 text-center hidden sm:block">
              <span className="text-xs font-bold text-rose-200/60 uppercase tracking-[0.2em] animate-pulse">
                {isRolling ? '掷骰中...' : (isMoving ? '移动中...' : '等待掷骰')}
              </span>
            </div>

            {/* Mini Dice Container (Right) */}
            <div className="flex items-center gap-4">
              <div 
                className={`cursor-pointer transform scale-[0.55] origin-center -my-6 transition-all active:scale-[0.5] ${isRolling || isMoving ? 'pointer-events-none' : ''}`}
                onClick={handleRoll}
              >
                <Dice isRolling={isRolling} result={diceResult} onRollComplete={handleRollComplete} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Game Board */}
        <div className="w-full max-w-[800px] flex-1 flex flex-col justify-center items-center py-4">
          <GameBoard players={players} currentTurn={currentTurn} boardTasks={boardTasks} />
        </div>

      </div>

      {/* 调试工具：仅用于最后环节验证 - 如需使用请取消下方注释
      <div className="fixed bottom-20 right-4 flex flex-col gap-2 z-[100] opacity-50 hover:opacity-100 transition-opacity pointer-events-auto">
        <div className="text-[10px] text-white/40 text-right uppercase font-bold">调试工具</div>
        <button 
          onClick={() => onMove(40)} 
          className="bg-black/60 border border-white/10 text-white p-2 rounded-lg text-xs"
        >⏩ 快进 40 步</button>
        <button 
          onClick={() => {
            const path = getPlayerPath(players[currentTurn].id);
            const targetStep = path.length - 2;
            const diff = targetStep - players[currentTurn].step;
            if (diff > 0) onMove(diff);
          }} 
          className="bg-rose-900/60 border border-rose-400/30 text-white p-2 rounded-lg text-xs"
        >👑 夺冠前夕</button>
      </div>
      */}
    </div>
  );
}
