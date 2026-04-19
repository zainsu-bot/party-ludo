import { Layout, Gamepad2 } from 'lucide-react';
import { GameState } from '../types';

interface BottomNavProps {
  activeView: GameState['view'];
  onNavigate: (view: 'home' | 'themes') => void;
}

export function BottomNav({ activeView, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-rose-950/40 backdrop-blur-2xl border-t border-white/5 px-8 py-4 flex justify-around items-center z-40">
      <button 
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center gap-1 transition-all duration-300 ${
          activeView === 'home' || activeView === 'game' 
            ? 'text-rose-400 scale-110 drop-shadow-[0_0_10px_rgba(251,113,133,0.6)]' 
            : 'text-rose-200/40 hover:text-rose-200/60'
        }`}
      >
        <div className="relative">
          <Gamepad2 size={24} />
          {activeView === 'game' && <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">游戏</span>
      </button>

      <button 
        onClick={() => onNavigate('themes')}
        className={`flex flex-col items-center gap-1 transition-all duration-300 ${
          activeView === 'themes' 
            ? 'text-rose-400 scale-110 drop-shadow-[0_0_10px_rgba(251,113,133,0.6)]' 
            : 'text-rose-200/40 hover:text-rose-200/60'
        }`}
      >
        <Layout size={24} />
        <span className="text-[10px] font-black uppercase tracking-widest">题库</span>
      </button>
    </nav>
  );
}
