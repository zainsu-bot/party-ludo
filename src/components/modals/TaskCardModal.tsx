import { useEffect } from 'react';
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
  useEffect(() => {
    if (isOpen) {
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
  const executorClassName = executor && (executor.role === 'LADY' || (executor.role as string) === 'ELF') ? 'text-rose-400' : 'text-indigo-300';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div className="relative w-full max-w-sm bg-[#1C1C1E] border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl overflow-hidden transform transition-all scale-100">
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <div className={`${taskData.color} mb-4`}>
            {iconMap[taskData.icon] || iconMap.favorite}
          </div>
          
          <h3 className="text-2xl font-black text-white mb-2 text-center tracking-wider">{taskData.title}</h3>
          
          <div className="text-sm text-gray-400 text-center leading-relaxed mb-8 font-medium">
            <div className="mb-1 opacity-60">{taskData.subtitle}</div>
            <div className="p-1 px-3 rounded-full bg-white/5 inline-block mt-2">
              由 <span className={`${executorClassName} font-bold`}>{executorLabel}</span> 执行
            </div>
          </div>

          <div className="w-full bg-white/5 rounded-2xl p-8 min-h-[140px] flex items-center justify-center border border-white/5 mb-8 shadow-inner ring-1 ring-white/5">
            <p className="text-xl font-bold text-white text-center leading-relaxed drop-shadow-sm">
              {taskData.task}
            </p>
          </div>
        </div>

        <div className="w-full flex gap-3">
          <button
            className="flex-1 h-12 rounded-xl bg-white/5 text-rose-400/60 font-bold text-sm hover:bg-white/10 active:scale-95 transition-all text-center"
            onClick={onReject}
          >
            {rejectLabel}
          </button>
          <button
            className="flex-[1.5] h-12 rounded-xl bg-rose-500 text-white font-black text-base shadow-[0_8px_25px_rgba(251,113,133,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2"
            onClick={onAccept}
          >
            接受任务
          </button>
        </div>
      </div>
    </div>
  );
}
