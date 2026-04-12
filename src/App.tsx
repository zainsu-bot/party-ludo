import { useState } from 'react';
import { Github } from 'lucide-react';
import { useGameState } from './hooks/useGameState';
import { TaskEventData } from './types';
import { HomeView } from './components/views/HomeView';
import { GameView } from './components/views/GameView';
import { ThemesView } from './components/views/ThemesView';
import { ThemeSelectorModal } from './components/modals/ThemeSelectorModal';
import { TaskCardModal } from './components/modals/TaskCardModal';
import { WinModal } from './components/modals/WinModal';
import { BottomNav } from './components/BottomNav';
import { ThemeCreateModal } from './components/modals/ThemeCreateModal';
import { ThemeEditorModal } from './components/modals/ThemeEditorModal';

function App() {
  const {
    state,
    switchView,
    selectTheme,
    createTheme,
    updateThemeMeta,
    addThemeTask,
    removeThemeTask,
    updatePlayersConfig,
    startGame,
    movePlayer,
    endTurn,
    setIsRolling,
    checkTile,
    resolveTask,
    resetGame
  } = useGameState();

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(0);
  const [taskData, setTaskData] = useState<TaskEventData | null>(null);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [isCreateThemeModalOpen, setIsCreateThemeModalOpen] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectTheme = (playerId: number) => {
    setSelectedPlayerId(playerId);
    setIsThemeModalOpen(true);
  };

  const handleThemeSelect = (themeId: string) => {
    selectTheme(selectedPlayerId, themeId);
  };

  const selectedPlayer = state.players.find(p => p.id === selectedPlayerId) || state.players[0];
  const selectableThemes = state.themes.filter(
    t => t.audience === 'common' || t.audience === selectedPlayer.role
  );

  const handleStartGame = () => {
    const success = startGame();
    if (!success) {
      showToast('⚠️ 无法开始：请先为所有玩家选择任务主题');
    }
  };

  const handleTaskTrigger = (data: TaskEventData) => {
    setTaskData(data);
  };

  const handleTaskAccept = () => {
    if (!taskData) return;
    setTaskData(null);
    resolveTask(taskData, 'accept');
  };

  const handleTaskReject = () => {
    if (!taskData) return;
    setTaskData(null);
    resolveTask(taskData, 'reject');
  };

  const handleWin = (id: number) => {
    setWinnerId(id);
  };

  const handleNavigate = (view: 'home' | 'themes') => {
    switchView(view);
  };

  const handleBackFromGame = () => {
    resetGame();
    switchView('home');
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex justify-center bg-[#1a0b16]">
      <div className="fixed inset-0 z-0 scale-110">
        {/* 高级 4-象限 Mesh Gradient 艺术背景 */}
        <div className="absolute inset-0 bg-[#0a050a]" />
        
        {/* 左上: 绅士蓝 */}
        <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-blue-900/30 blur-[120px] animate-pulse" style={{animationDuration: '8s'}} />
        
        {/* 右上: 淑女红 */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-900/25 blur-[100px] animate-pulse" style={{animationDuration: '10s'}} />
        
        {/* 左下: 骑士绿 */}
        <div className="absolute bottom-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-green-900/20 blur-[110px] animate-pulse" style={{animationDuration: '12s'}} />
        
        {/* 右下: 辅助色 */}
        <div className="absolute bottom-[-10%] right-[-15%] w-[50%] h-[50%] rounded-full bg-amber-900/20 blur-[90px] animate-pulse" style={{animationDuration: '9s'}} />
        
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 w-full max-w-[430px] h-full flex flex-col bg-black/20">
        <header className="pt-4 pb-2 px-6 shrink-0 flex justify-between items-start">
          <div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
              Party Game
            </div>
            <h1 className="text-2xl font-bold text-rose-100 tracking-tight drop-shadow-sm">派对飞行棋</h1>
          </div>
          <div className="flex flex-col items-end gap-2 mt-1">
            <a
              href="https://github.com/zainsu-bot/party-ludo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              title="GitHub Repository"
            >
              <Github size={24} />
            </a>
            <img 
              src="https://api.visitorbadge.io/api/visitors?path=zainsu-bot.party-ludo&label=HOT&countColor=%23e11d48&labelColor=%231e1b4b" 
              alt="Total Heat" 
              className="h-5 drop-shadow-[0_0_8px_rgba(225,29,72,0.4)] opacity-90 hover:opacity-100 transition-opacity mt-1"
            />
          </div>
        </header>

        <main className="flex-1 relative overflow-hidden">
          <div
            className={`absolute inset-0 flex flex-col px-4 pt-2 pb-20 transition-all duration-500 ease-in-out ${state.view === 'home'
                ? 'translate-x-0 opacity-100'
                : 'opacity-0 pointer-events-none -translate-x-full'
              }`}
          >
            <HomeView
              players={state.players}
              themes={state.themes}
              onSelectTheme={handleSelectTheme}
              onStartGame={handleStartGame}
              onUpdatePlayersConfig={updatePlayersConfig}
            />
          </div>

          <div
            className={`absolute inset-0 px-4 pt-2 transition-all duration-500 ease-in-out pb-20 overflow-y-auto no-scrollbar ${state.view === 'themes'
                ? 'translate-x-0 opacity-100'
                : 'opacity-0 pointer-events-none translate-x-full'
              }`}
          >
            <ThemesView
              themes={state.themes}
              onCreateTheme={() => setIsCreateThemeModalOpen(true)}
              onEditTheme={themeId => setEditingThemeId(themeId)}
            />
          </div>
        </main>

        <BottomNav activeView={state.view} onNavigate={handleNavigate} />
      </div>

      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        themes={selectableThemes}
        selectedThemeId={selectedPlayer?.themeId || null}
        onSelect={handleThemeSelect}
        onClose={() => setIsThemeModalOpen(false)}
      />

      <TaskCardModal
        isOpen={!!taskData}
        taskData={taskData}
        onAccept={handleTaskAccept}
        onReject={handleTaskReject}
        players={state.players}
      />

      <WinModal
        isOpen={winnerId !== null}
        winnerName={winnerId !== null ? state.players[winnerId].name : ''}
        onRestart={() => {
          resetGame();
          setWinnerId(null);
        }}
      />

      <ThemeCreateModal
        isOpen={isCreateThemeModalOpen}
        onClose={() => setIsCreateThemeModalOpen(false)}
        onCreate={input => {
          const id = createTheme(input);
          setIsCreateThemeModalOpen(false);
          if (id) setEditingThemeId(id);
        }}
      />

      <ThemeEditorModal
        isOpen={!!editingThemeId}
        theme={editingThemeId ? state.themes.find(t => t.id === editingThemeId) || null : null}
        onClose={() => {
          setEditingThemeId(null);
        }}
        onSaveMeta={(themeId, patch) => updateThemeMeta(themeId, patch)}
        onAddTask={(themeId, taskText) => addThemeTask(themeId, taskText)}
        onRemoveTask={(themeId, index) => removeThemeTask(themeId, index)}
      />

      {state.view === 'game' && (
        <GameView
          players={state.players}
          currentTurn={state.turn}
          isRolling={state.isRolling}
          onMove={movePlayer}
          onCheckTile={checkTile}
          onEndTurn={endTurn}
          onSetRolling={setIsRolling}
          onWin={handleWin}
          onTaskTrigger={handleTaskTrigger}
          onBack={handleBackFromGame}
          boardTasks={state.boardTasks}
        />
      )}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-0 w-full z-[100] flex justify-center pointer-events-none animate-[bounce_0.5s_infinite]">
          <div className="w-[85%] max-w-[340px] bg-rose-600/95 backdrop-blur-xl text-white px-5 py-3 rounded-2xl shadow-[0_10px_40px_rgba(225,29,72,0.8)] font-black text-[14px] text-center tracking-wide border-2 border-white/20 break-words leading-relaxed">
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
