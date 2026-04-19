import { Theme } from '../../types';
import { Check } from 'lucide-react';
import { useEffect } from 'react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  themes: Theme[];
  selectedThemeIds: string[];
  onSelect: (themeId: string) => void;
  onClose: () => void;
}

export function ThemeSelectorModal({
  isOpen,
  themes,
  selectedThemeIds,
  onSelect,
  onClose
}: ThemeSelectorModalProps) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-[#2d1b33]/90 backdrop-blur-2xl rounded-[32px] p-8 transform transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-baseline gap-3">
            <h3 className="text-2xl font-black text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              混编模式
            </h3>
            <span className={`text-sm font-black uppercase tracking-wider ${selectedThemeIds.length === 2 ? 'text-teal-300' : 'text-white'}`}>
              请选满 2 个主题 ({selectedThemeIds.length}/2)
            </span>
          </div>
        </div>

        <div className="grid gap-3 max-h-[50vh] overflow-y-auto no-scrollbar pr-1 pb-4">
          {themes.map(theme => {
            const isSelected = selectedThemeIds.includes(theme.id);
            return (
              <div
                key={theme.id}
                onClick={() => onSelect(theme.id)}
                className={`group p-4 rounded-xl flex justify-between items-center transition-all cursor-pointer border-2 ${
                  isSelected 
                    ? 'bg-rose-500/20 border-rose-400 shadow-[0_0_20px_rgba(251,113,133,0.3)]' 
                    : 'bg-white/5 border-transparent hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex flex-col">
                  <span className={`text-base font-bold tracking-wide transition-colors ${isSelected ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                    {theme.name}
                  </span>
                  <span className="text-[11px] text-white/40 font-medium tracking-wide mt-1 line-clamp-1">
                    {theme.desc}
                  </span>
                </div>
                {isSelected && (
                  <div className="bg-white rounded-full p-1 shadow-lg">
                    <Check className="text-rose-600" size={14} strokeWidth={4} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
           <button
             onClick={onClose}
             disabled={selectedThemeIds.length !== 2}
             className={`w-full py-4 rounded-2xl font-black text-lg tracking-widest transition-all active:scale-95 shadow-2xl ${
               selectedThemeIds.length === 2
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-teal-500/40 opacity-100'
                : 'bg-white/10 text-white/20 cursor-not-allowed opacity-50'
             }`}
           >
             确认选择
           </button>
        </div>
      </div>
    </div>
  );
}
