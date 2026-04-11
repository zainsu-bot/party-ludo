import { useState, useEffect } from 'react';
import { Theme, PartyRole } from '../../types';
import { X, Plus, Trash2, Edit2, Check } from 'lucide-react';

interface ThemeEditorModalProps {
  isOpen: boolean;
  theme: Theme | null;
  onClose: () => void;
  onSaveMeta: (themeId: string, patch: Partial<Pick<Theme, 'name' | 'desc' | 'audience'>>) => void;
  onAddTask: (themeId: string, taskText: string) => void;
  onRemoveTask: (themeId: string, index: number) => void;
}

const audienceOptions: { label: string; value: Theme['audience'] }[] = [
  { label: '通用', value: 'common' },
  { label: '绅士专用', value: 'husband' },
  { label: '淑女专用', value: 'wife' },
  { label: '骑士专用', value: 'bull' },
  { label: '精灵专用', value: 'female_partner' }
];

export function ThemeEditorModal({
  isOpen,
  theme,
  onClose,
  onSaveMeta,
  onAddTask,
  onRemoveTask
}: ThemeEditorModalProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    if (isOpen && theme) {
      setEditName(theme.name);
      setEditDesc(theme.desc);
      setIsEditingTitle(false);
      setNewTaskText('');
    }
  }, [isOpen, theme]);

  if (!isOpen || !theme) return null;

  const handleSaveMeta = () => {
    onSaveMeta(theme.id, { name: editName, desc: editDesc });
    setIsEditingTitle(false);
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onAddTask(theme.id, newTaskText);
      setNewTaskText('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="flex-1 overflow-hidden flex flex-col bg-[#1C1C1E] mt-12 rounded-t-3xl shadow-2xl relative animate-slide-up">
        {/* Header */}
        <header className="px-6 py-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-white tracking-tight">编辑主题</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center ios-btn border border-white/5 text-gray-400"
          >
            <X size={20} />
          </button>
        </header>

        {/* Form Container */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
          
          {/* Metadata Section */}
          <section className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">基本信息</h3>
            </div>
            
            {!isEditingTitle ? (
              <div className="group relative">
                <div className="pr-10">
                  <h4 className="text-lg font-bold text-white mb-1">{theme.name}</h4>
                  <p className="text-sm text-gray-400 line-clamp-2">{theme.desc || '暂无描述'}</p>
                </div>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white ios-btn"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">主题名称</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full bg-black/40 text-white rounded-lg px-4 py-2 text-sm border border-white/10 outline-none focus:border-white/30"
                    placeholder="输入名称..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">描述 (可选)</label>
                  <input
                    type="text"
                    value={editDesc}
                    onChange={e => setEditDesc(e.target.value)}
                    className="w-full bg-black/40 text-white rounded-lg px-4 py-2 text-sm border border-white/10 outline-none focus:border-white/30"
                    placeholder="一句话介绍..."
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveMeta}
                    className="px-4 py-1.5 rounded-full bg-[#0A84FF] text-white text-sm font-semibold ios-btn flex items-center gap-1"
                  >
                    <Check size={16} />保存
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Audience Section */}
          <section className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">适用对象设定</h3>
            <div className="flex flex-wrap gap-2">
              {audienceOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onSaveMeta(theme.id, { audience: opt.value })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border ios-btn transition-colors ${
                    theme.audience === opt.value
                      ? 'bg-teal-500/20 text-teal-400 border-teal-500/50'
                      : 'bg-black/40 text-gray-400 border-white/5 hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              只有扮演该角色的玩家，在分配主题包时才能选中此主题。
            </p>
          </section>

          {/* Tasks Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                任务列表卡 ({theme.tasks.length})
              </h3>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAddTask();
                }}
                placeholder="在此输入新的任务指令..."
                className="flex-1 bg-white/5 text-white rounded-xl px-4 py-3 text-sm border border-white/10 outline-none focus:border-white/30"
              />
              <button
                onClick={handleAddTask}
                disabled={!newTaskText.trim()}
                className="w-12 h-12 rounded-xl bg-teal-500 text-white flex items-center justify-center disabled:opacity-50 ios-btn"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {theme.tasks.map((task, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-gray-400 font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 text-sm text-gray-200 line-clamp-2">
                    {task}
                  </div>
                  <button
                    onClick={() => onRemoveTask(theme.id, idx)}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {theme.tasks.length === 0 && (
                <div className="text-center py-10 text-gray-500 text-sm">
                  主题内还没有任务卡，快去添加吧
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
