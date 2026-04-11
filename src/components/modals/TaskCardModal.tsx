import { useState, useEffect } from 'react';
import { TaskEventData, Player } from '../../types';
import { Heart, Lock, HandshakeIcon } from 'lucide-react';

interface TaskCardModalProps {
  isOpen: boolean;
  taskData: TaskEventData | null;
  onAccept: () => void;
  onReject: () => void;
  players: Player[];
}

const iconMap: Record<string, React.ReactNode> = {
  favorite: <Heart size={40} fill="currentColor" />,
  lock: <Lock size={40} />,
  handshake: <HandshakeIcon size={40} />
};

export function TaskCardModal({ isOpen, taskData, onAccept, onReject, players }: TaskCardModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsFlipped(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !taskData) return null;

  const rejectLabel = taskData.type === 'collision' ? '拒绝（回到起点）' : '拒绝（走两步）';
  const executor = players.find(p => p.id === taskData.executorPlayerId);
  const executorLabel = executor ? executor.name : '未知玩家';
  const executorClassName = executor && (executor.role === 'LADY' || executor.role === 'ELF' as string) ? 'text-rose-400' : 'text-indigo-300';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div className="relative w-full max-w-sm h-[420px] perspective-1000">
        <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
          <div
            className="flip-card-front bg-rose-950/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center shadow-2xl cursor-pointer"
            onClick={() => setIsFlipped(true)}
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse">
              <div className={taskData.color}>
                {iconMap[taskData.icon] || iconMap.favorite}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{taskData.title}</h3>
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-8">
              点击翻转查看任务
            </p>
           
          </div>

          <div className="flip-card-back bg-[#1C1C1E] border border-white/10 p-6 shadow-2xl">
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <div className={taskData.color}>
                {iconMap[taskData.icon] || iconMap.favorite}
              </div>
              <h3 className="text-xl font-bold text-white mb-6 mt-4">{taskData.title}</h3>
              <div className="text-xs text-gray-400 text-center leading-relaxed mb-6">
                <div>{taskData.subtitle}</div>
                <div>
                  由 <span className={executorClassName}>{executorLabel}</span> 执行
                </div>
              </div>

              <div className="w-full bg-[#2C2C2E] rounded-xl p-6 min-h-[120px] flex items-center justify-center border border-white/5 mb-6">
                <p className="text-lg font-medium text-white text-center leading-relaxed">
                  {taskData.task}
                </p>
              </div>
            </div>

            <div className="w-full flex gap-3 mt-auto">
              <button
                className="flex-1 h-12 rounded-xl bg-white/5 text-rose-400 font-bold text-sm border border-rose-500/20 active:scale-95 transition-all"
                onClick={onReject}
              >
                {rejectLabel}
              </button>
              <button
                className="flex-1 h-12 rounded-xl bg-rose-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(251,113,133,0.4)] active:scale-95 transition-all"
                onClick={onAccept}
              >
                接受任务
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
