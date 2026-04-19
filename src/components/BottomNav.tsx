import { Layout, Gamepad2 } from 'lucide-react';
import { GameState } from '../types';

interface BottomNavProps {
  activeView: GameState['view'];
  onNavigate: (view: 'home' | 'themes') => void;
}

export function BottomNav({ activeView, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-rose-950/70 backdrop-blur-3xl border-t border-white/10 px-4 py-4 flex justify-around items-center z-40 shadow-[0_-15px_40px_rgba(0,0,0,0.5)]">
      <button 
        onClick={() => onNavigate('home')}
        className={`relative flex items-center gap-3 transition-all duration-300 px-6 py-2.5 rounded-2xl group ${
          activeView === 'home' || activeView === 'game' 
            ? 'text-emerald-400 scale-105 drop-shadow-[0_0_15px_rgba(52,211,153,0.9)] bg-emerald-500/10' 
            : 'text-white/20 hover:text-emerald-300/40'
        }`}
      >
        <div className="relative">
          <Gamepad2 size={24} strokeWidth={2.5} className="drop-shadow-sm" />
          {activeView === 'game' && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shadow-lg shadow-emerald-500/50" />
          )}
        </div>
        <span className="text-sm font-black uppercase tracking-[0.1em] mb-[-2px]">游戏</span>
        {(activeView === 'home' || activeView === 'game') && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981]" />
        )}
      </button>

      <button 
        onClick={() => onNavigate('themes')}
        className={`relative flex items-center gap-3 transition-all duration-300 px-6 py-2.5 rounded-2xl group ${
          activeView === 'themes' 
            ? 'text-emerald-400 scale-105 drop-shadow-[0_0_15px_rgba(52,211,153,0.9)] bg-emerald-500/10' 
            : 'text-white/20 hover:text-emerald-300/40'
        }`}
      >
        <Layout size={24} strokeWidth={2.5} className="drop-shadow-sm" />
        <span className="text-sm font-black uppercase tracking-[0.1em] mb-[-2px]">题库</span>
        {activeView === 'themes' && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981]" />
        )}
      </button>
    </nav>
  );
}
