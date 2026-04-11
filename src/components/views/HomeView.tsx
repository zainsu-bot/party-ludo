import { useState } from 'react';
import { Player, Theme, PartyRole } from '../../types';
import { ChevronRight, User, Plus, Minus } from 'lucide-react';

interface HomeViewProps {
  players: Player[];
  themes: Theme[];
  onSelectTheme: (playerId: number) => void;
  onStartGame: () => void;
  onUpdatePlayersConfig: (players: Omit<Player, 'step' | 'themeId'>[]) => void;
}

const roleLabel: Record<PartyRole, string> = {
  GENTLEMAN: '绅士 (Gentleman)',
  LADY: '淑女 (Lady)',
  KNIGHT: '骑士 (Knight)'
};

export function HomeView({ players, themes, onSelectTheme, onStartGame, onUpdatePlayersConfig }: HomeViewProps) {
  const [playerCount, setPlayerCount] = useState(players.length);

  const handlePlayerCountChange = (delta: number) => {
    const newCount = Math.max(2, Math.min(4, playerCount + delta));
    if (newCount !== playerCount) {
      setPlayerCount(newCount);
      const newPlayers = [...players];
      if (newCount > players.length) {
        newPlayers.push({
          id: newCount - 1,
          name: newCount === 4 ? '娇妻' : `玩家${newCount}`,
          color: newCount === 4 ? '#E5A50A' : '#32D74B',
          role: newCount === 4 ? 'LADY' : 'KNIGHT',
          step: -1,
          themeId: null,
          isFinished: false
        });
      } else {
        newPlayers.pop();
      }
      onUpdatePlayersConfig(newPlayers);
    }
  };

  const handleUpdatePlayer = (id: number, updates: Partial<Player>) => {
    const newPlayers = players.map(p => p.id === id ? { ...p, ...updates } : p);
    onUpdatePlayersConfig(newPlayers);
  };

  return (
    <div className="flex-1 flex flex-col justify-start space-y-6 mt-6">
      <div className="text-center mb-2">
        <h2 className="text-3xl text-white font-black tracking-widest relative drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          派对飞行棋
        </h2>
        <p className="text-[13px] text-rose-300/80 mt-2 font-medium tracking-wide">情密派对版 · 角色扮演交互</p>
      </div>

      <div className="bg-rose-950/40 backdrop-blur-2xl rounded-2xl p-5 border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="text-white font-bold flex items-center gap-2 text-base">
            <User size={18} className="text-rose-400" />
            玩家设置
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => handlePlayerCountChange(-1)} 
               className="w-9 h-9 rounded-full bg-white/5 text-white flex items-center justify-center disabled:opacity-30 border border-white/10 hover:bg-white/10 transition-colors"
               disabled={playerCount <= 2}
             ><Minus size={18}/></button>
             <div className="text-white font-black text-lg w-4 text-center">{playerCount}</div>
             <button 
               onClick={() => handlePlayerCountChange(1)} 
               className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center disabled:opacity-30 border border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:bg-rose-600 transition-colors"
               disabled={playerCount >= 4}
             ><Plus size={18}/></button>
          </div>
        </div>

        <div className="space-y-4">
          {players.slice(0, playerCount).map((player) => {
            const theme = themes.find(t => t.id === player.themeId);
            return (
              <div key={player.id} className="bg-white/5 rounded-2xl p-4 border border-white/10 border-l-4 shadow-lg transition-all" style={{borderLeftColor: player.color}}>
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-3">
                    <input 
                      type="text" 
                      value={player.name}
                      onChange={e => handleUpdatePlayer(player.id, { name: e.target.value })}
                      className="w-full bg-transparent text-white font-bold outline-none border-b border-white/20 pb-1 text-sm focus:border-rose-400 transition-colors placeholder:text-white/20"
                      placeholder="输入玩家昵称"
                    />
                    <select 
                      value={player.role}
                      onChange={e => handleUpdatePlayer(player.id, { role: e.target.value as PartyRole })}
                      className="w-full bg-black/40 text-white text-[13px] font-medium border border-white/10 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-white/30"
                    >
                      {Object.entries(roleLabel).map(([key, label]) => (
                        <option key={key} value={key} className="bg-slate-900 text-white">{label}</option>
                      ))}
                    </select>
                  </div>
                  <div 
                    className="flex-shrink-0 flex flex-col justify-center items-end pl-4 border-l border-white/10 cursor-pointer hover:bg-white/5 transition-all p-2 rounded-xl active:scale-95"
                    onClick={() => onSelectTheme(player.id)}
                  >
                    <div className="text-[11px] text-white/50 font-bold uppercase tracking-tighter">任务包 THEME</div>
                    <div className={`text-xs font-black mt-1.5 px-2 py-1 rounded-md flex items-center gap-1 ${theme ? 'bg-teal-500/20 text-teal-300' : 'bg-white/5 text-rose-300 animate-pulse border border-rose-300/30'}`}>
                      {theme?.name || '未选择 >'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1" />

      <button
        className="w-full h-16 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl text-white font-black text-xl shadow-[0_10px_30px_rgba(20,184,166,0.3)] active:scale-[0.98] flex items-center justify-center gap-3 mb-10 transition-all border-t border-white/20"
        onClick={onStartGame}
      >
        <span className="tracking-widest">开启派对游戏</span>
        <ChevronRight size={24} strokeWidth={3} />
      </button>
    </div>
  );
}
