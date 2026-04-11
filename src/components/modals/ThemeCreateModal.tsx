import { useEffect, useMemo, useState } from 'react';
import { Theme } from '../../types';

interface ThemeCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (input: { name: string; desc: string; audience: Theme['audience'] }) => void;
}

const audienceOptions: { label: string; value: Theme['audience'] }[] = [
  { label: '通用', value: 'common' },
  { label: '绅士', value: 'GENTLEMAN' },
  { label: '淑女', value: 'LADY' },
  { label: '骑士', value: 'KNIGHT' }
];

export function ThemeCreateModal({ isOpen, onClose, onCreate }: ThemeCreateModalProps) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [audience, setAudience] = useState<Theme['audience']>('common');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    setName('');
    setDesc('');
    setAudience('common');
    setError('');
  }, [isOpen]);

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

  const canSubmit = useMemo(() => name.trim().length > 0, [name]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-rose-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-[#2d1b33]/90 backdrop-blur-2xl rounded-t-[32px] p-6 border-t border-white/10 shadow-2xl animate-slide-up">
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-rose-100 uppercase tracking-wider">新建主题</h3>
        </div>

        <div className="space-y-4 pb-8">
          <div className="space-y-2">
            <div className="text-xs text-rose-200/40 font-bold uppercase tracking-widest">主题名称</div>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-white/5 text-white outline-none border border-white/5 focus:border-rose-500/30 transition-all"
              placeholder="例如：甜蜜互动"
              maxLength={24}
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs text-rose-200/40 font-bold uppercase tracking-widest">描述（可选）</div>
            <input
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-white/5 text-white outline-none border border-white/5 focus:border-rose-500/30 transition-all font-medium"
              placeholder="例如：日常小甜饼、轻量互动"
              maxLength={60}
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs text-rose-200/40 font-bold uppercase tracking-widest">适用对象</div>
            <div className="grid grid-cols-3 gap-2">
              {audienceOptions.map(opt => (
                <button
                  key={opt.value}
                  className={`h-11 rounded-xl text-sm font-bold border transition-all ${
                    audience === opt.value
                      ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-950/40'
                      : 'bg-white/5 text-rose-200/40 border-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => setAudience(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="text-sm text-rose-400 font-bold">{error}</div>}

          <div className="flex gap-3 pt-6">
            <button
              className="flex-1 h-12 rounded-2xl bg-white/5 text-rose-200/60 font-bold text-sm active:scale-95 transition-transform"
              onClick={onClose}
            >
              取消
            </button>
            <button
              className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-sm active:scale-95 shadow-xl shadow-rose-950/50 disabled:opacity-30 transition-all"
              disabled={!canSubmit}
              onClick={() => {
                if (!name.trim()) {
                  setError('请输入主题名称');
                  return;
                }
                onCreate({ name: name.trim(), desc: desc.trim(), audience });
              }}
            >
              创建并编辑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

