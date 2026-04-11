interface WinModalProps {
  isOpen: boolean;
  winnerName: string;
  onRestart: () => void;
}

export function WinModal({ isOpen, winnerName, onRestart }: WinModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-rose-950/80 backdrop-blur-sm" />
      <div className="relative bg-gradient-to-b from-rose-900 to-rose-950 w-full max-w-sm rounded-[40px] p-10 text-center shadow-2xl border border-rose-400/20">
        <div className="text-7xl mb-6 relative">
          <div className="absolute inset-0 blur-2xl bg-rose-500/30 rounded-full animate-pulse" />
          <span className="relative">👑</span>
        </div>
        <h2 className="text-4xl font-black text-rose-100 mb-2">{winnerName}</h2>
        <p className="text-rose-200/60 mb-10 font-medium">今晚你是绝对的赢家</p>
        <button
          className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-rose-950/50 transition-all active:scale-95"
          onClick={onRestart}
        >
          再来一局
        </button>
      </div>
    </div>
  );
}
