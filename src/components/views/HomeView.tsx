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
  husband: '绅士 (Gentleman)',
  wife: '淑女 (Lady)',
  bull: '骑士 (Knight)',
  female_partner: '精灵 (Elf)'
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
          name: `玩家${newCount}`,
          color: newCount === 4 ? '#E5A50A' : '#32D74B',
          role: newCount === 4 ? 'female_partner' : 'bull',
          step: 0,
          themeId: null
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
        <h2 className="text-3xl text-teal-300 font-bold tracking-wider relative drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">
          派对飞行棋
        </h2>
        <p className="text-xs text-teal-500/70 mt-2">特殊派对版本 · 角色扮演交互</p>
      </div>

      <div className="bg-[#1C2028]/80 backdrop-blur-md rounded-2xl p-5 border border-white/5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="text-teal-400 font-semibold flex items-center gap-2">
            <User size={18} />
            玩家设置
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => handlePlayerCountChange(-1)} 
               className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center disabled:opacity-30 border border-red-500/30"
               disabled={playerCount <= 3}
             ><Minus size={16}/></button>
             <div className="text-white font-bold w-4 text-center">{playerCount}</div>
             <button 
               onClick={() => handlePlayerCountChange(1)} 
               className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center disabled:opacity-30 border border-teal-500/30"
               disabled={playerCount >= 4}
             ><Plus size={16}/></button>
          </div>
        </div>

        <div className="space-y-4">
          {players.slice(0, playerCount).map((player, idx) => {
            const theme = themes.find(t => t.id === player.themeId);
            return (
              <div key={player.id} className="bg-black/30 rounded-xl p-3 border border-white/5 border-l-4" style={{borderLeftColor: player.color}}>
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-2">
                    <input 
                      type="text" 
                      value={player.name}
                      onChange={e => handleUpdatePlayer(player.id, { name: e.target.value })}
                      className="w-full bg-transparent text-white font-semibold outline-none border-b border-white/10 pb-1 text-sm focus:border-white/30 transition-colors"
                      placeholder="玩家昵称"
                    />
                    <select 
                      value={player.role}
                      onChange={e => handleUpdatePlayer(player.id, { role: e.target.value as PartyRole })}
                      className="w-full bg-[#1C2028] text-xs text-gray-400 border border-white/10 rounded px-2 py-1 outline-none"
                    >
                      {Object.entries(roleLabel).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div 
                    className="flex-1 flex flex-col justify-center items-end pl-3 border-l border-white/10 cursor-pointer hover:bg-white/5 transition-colors p-2 rounded"
                    onClick={() => onSelectTheme(player.id)}
                  >
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">任务包 Theme</div>
                    <div className="text-xs font-semibold text-teal-300 mt-1 flex items-center gap-1 line-clamp-1 text-right">
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
        className="w-full h-14 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full text-white font-semibold text-lg shadow-lg shadow-teal-500/20 active:scale-95 flex items-center justify-center gap-2 mb-8 transition-transform"
        onClick={onStartGame}
      >
        <span>进入游戏</span>
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
