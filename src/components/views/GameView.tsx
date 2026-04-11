import { useState, useCallback } from 'react';
import { Player, TaskEventData } from '../../types';
import { GameBoard } from '../GameBoard';
import { Dice } from '../Dice';
import { rollDice } from '../../utils/gameLogic';
import { ArrowLeft, Flag } from 'lucide-react';

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
  onBack
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
      const isHome = activePlayer.step === -1;
      
      // If player is at home and can't start, just end turn
      if (isHome && ![2, 4, 6].includes(diceResult)) {
        onMove(diceResult); // movePlayer handles the logic internally
        setTimeout(() => {
          onEndTurn();
          setDiceResult(null);
          setIsMoving(false);
        }, 500);
        return;
      }
      
      const landingStep = isHome ? 0 : activePlayer.step + diceResult;
      
      setIsMoving(true);
      onMove(diceResult);

      setTimeout(() => {
        const tileCheck = onCheckTile(landingStep);

        if (tileCheck === 'win') {
          onWin(players[currentTurn].id);
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
  const turnNumber = Math.floor(Math.max(...players.map(p => p.step)) / players.length) + 1;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A] flex justify-center items-center overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0F172A] to-[#0F172A]"></div>
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-50 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition backdrop-blur text-white shadow-xl"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="relative z-10 w-full max-w-6xl h-full p-4 lg:p-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: Dice Panel */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl h-[300px] lg:h-[500px] border border-gray-100">
            <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
              <span className="text-2xl">🎲</span> 投掷骰子
            </h3>
            
            <div className="flex-1 w-full flex items-center justify-center cursor-pointer" onClick={handleRoll}>
              <Dice isRolling={isRolling} result={diceResult} onRollComplete={handleRollComplete} />
            </div>

            <div className="mt-8 text-center text-sm font-medium text-slate-500 animate-pulse">
              点击上方骰子
            </div>
          </div>
        </div>

        {/* Right Side: Status and Board */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          
          {/* Status Panel */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl">
            <div className="flex flex-wrap items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-white">
                <div className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">i</div>
                <span className="font-semibold text-sm">回合: <span className="bg-blue-500/20 text-blue-300 px-2 rounded-full">{turnNumber}</span></span>
                <span className="ml-4 font-semibold text-sm text-slate-300">状态：等待玩家操作</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 mb-6">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{backgroundColor: activePlayer.color}}>
                ✈️
              </div>
              <div>
                <div className="text-white font-bold text-lg">{activePlayer.name}</div>
                <div className="text-sm text-slate-400">目前在：第 {activePlayer.step} 格</div>
              </div>
            </div>

            <div>
              <h4 className="text-slate-400 text-sm font-bold mb-3">当局派对玩家</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {players.map((p, i) => (
                  <div key={p.id} className={`p-3 rounded-xl border ${i === currentTurn ? 'border-blue-400/50 bg-blue-500/10' : 'border-white/5 bg-white/5'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: p.color}}></div>
                      <span className="text-white font-semibold text-sm truncate">{p.name}</span>
                    </div>
                    <div className="text-xs text-slate-400">位置: 第 {p.step} 格</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Game Board container */}
          <div className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur-md rounded-3xl p-4 lg:p-8 flex-1 flex flex-col justify-center border border-white/10 shadow-2xl relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2">
                <Flag size={16} /> 派对棋盘
             </div>
             <div className="w-full flex items-center justify-center">
               <GameBoard players={players} currentTurn={currentTurn} />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
