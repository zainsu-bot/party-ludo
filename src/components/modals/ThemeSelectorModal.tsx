import { Theme } from '../../types';
import { Check } from 'lucide-react';
import { useEffect } from 'react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  themes: Theme[];
  selectedThemeId: string | null;
  onSelect: (themeId: string) => void;
  onClose: () => void;
}

export function ThemeSelectorModal({
  isOpen,
  themes,
  selectedThemeId,
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
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">选择派对主题</h3>
        </div>
        <div className="grid gap-4 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
          {themes.map(theme => (
            <div
              key={theme.id}
              onClick={() => {
                onSelect(theme.id);
                onClose();
              }}
              className={`group p-5 rounded-2xl flex justify-between items-center transition-all cursor-pointer border-2 ${
                selectedThemeId === theme.id 
                  ? 'bg-rose-500/20 border-rose-400 shadow-[0_0_20px_rgba(251,113,133,0.3)]' 
                  : 'bg-white/5 border-transparent hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex flex-col">
                <span className={`text-base font-bold tracking-wide transition-colors ${selectedThemeId === theme.id ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                  {theme.name}
                </span>
                <span className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Selection Theme Pack</span>
              </div>
              {selectedThemeId === theme.id && (
                <div className="bg-white rounded-full p-1 shadow-lg">
                  <Check className="text-rose-600" size={16} strokeWidth={4} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
