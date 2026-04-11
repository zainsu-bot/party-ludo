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
  { label: '骑士', value: 'KNIGHT' },
  { label: '精灵', value: 'ELF' }
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-[#1C1C1E] rounded-t-[32px] p-6">
        <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6" />
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">新建主题</h3>
        </div>

        <div className="space-y-4 pb-8">
          <div className="space-y-2">
            <div className="text-xs text-gray-400">主题名称</div>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-[#2C2C2E] text-white outline-none border border-white/5 focus:border-white/20"
              placeholder="例如：甜蜜互动"
              maxLength={24}
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs text-gray-400">描述（可选）</div>
            <input
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-[#2C2C2E] text-white outline-none border border-white/5 focus:border-white/20"
              placeholder="例如：日常小甜饼、轻量互动"
              maxLength={60}
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs text-gray-400">适用对象</div>
            <div className="grid grid-cols-3 gap-2">
              {audienceOptions.map(opt => (
                <button
                  key={opt.value}
                  className={`h-10 rounded-xl text-sm font-semibold ios-btn border ${
                    audience === opt.value
                      ? 'bg-white text-black border-white'
                      : 'bg-[#2C2C2E] text-gray-200 border-white/5'
                  }`}
                  onClick={() => setAudience(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="text-sm text-[#FF453A]">{error}</div>}

          <div className="flex gap-3 pt-2">
            <button
              className="flex-1 h-12 rounded-full bg-[#3A3A3C] text-gray-200 font-bold text-sm ios-btn"
              onClick={onClose}
            >
              取消
            </button>
            <button
              className="flex-1 h-12 rounded-full bg-gradient-to-r from-[#0A84FF] to-[#007AFF] text-white font-bold text-sm ios-btn shadow-lg disabled:opacity-40"
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

