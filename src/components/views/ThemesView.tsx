import { Theme } from '../../types';

interface ThemesViewProps {
  themes: Theme[];
  onCreateTheme: () => void;
  onEditTheme: (themeId: string) => void;
}

const audienceLabel: Record<Theme['audience'], string> = {
  common: '通用',
  GENTLEMAN: '绅士专属',
  LADY: '淑女专属',
  KNIGHT: '骑士专属'
};

export function ThemesView({ themes, onCreateTheme, onEditTheme }: ThemesViewProps) {
  return (
    <div className="flex-1 flex flex-col pt-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">任务主题库</h2>
        <button
          className="h-10 px-5 rounded-2xl bg-rose-500 text-white text-sm font-black shadow-[0_5px_15px_rgba(244,63,94,0.4)] active:scale-95 transition-all"
          onClick={onCreateTheme}
        >
          新建主题
        </button>
      </div>
      <div className="space-y-4">
        {themes.map(theme => (
          <div
            key={theme.id}
            className="bg-white/[0.03] backdrop-blur-2xl rounded-[24px] p-6 border border-white/10 hover:border-white/30 transition-all cursor-pointer shadow-2xl group active:scale-[0.98]"
            onClick={() => onEditTheme(theme.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="text-white font-black text-xl mb-2 group-hover:text-rose-400 transition-colors tracking-tight">{theme.name}</div>
                <div className="text-[13px] text-white/70 font-medium line-clamp-2 leading-6 mb-5">{theme.desc}</div>
                <div className="flex items-center gap-3">
                  <div className="bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-xl text-[11px] text-rose-300 font-black uppercase tracking-widest">
                    {audienceLabel[theme.audience]}
                  </div>
                  <div className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] text-white font-black">
                    {theme.tasks.length} 任务
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
