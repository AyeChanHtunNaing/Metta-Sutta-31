import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { RecitationRoom } from './components/RecitationRoom';
import { RealmsCatalog } from './components/RealmsCatalog';
import { HistoryCalendar } from './components/HistoryCalendar';
import { SuttaReader } from './components/SuttaReader';
import { SettingsModal } from './components/SettingsModal';
import { StorageService } from './services/storageService';
import { AdhitthanaState } from './types';

export function App() {
  const [adhitthanaState, setAdhitthanaState] = useState<AdhitthanaState>(StorageService.loadState());
  const [currentTab, setCurrentTab] = useState<'home' | 'realms' | 'calendar' | 'recitation' | 'sutta'>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // Initial evaluation of date & missed days on load
    const freshState = StorageService.loadState();
    setAdhitthanaState(freshState);
  }, []);

  const handleStartRecitation = () => {
    setCurrentTab('recitation');
  };

  const handleExitRecitation = () => {
    setCurrentTab('home');
  };

  const handleFinishRecitation = () => {
    const updatedState = StorageService.recordDailyCompletion();
    setAdhitthanaState(updatedState);
    setCurrentTab('home');
  };

  const handleStartNewJourney = (targetDays: number, name: string) => {
    const updatedState = StorageService.startJourney(targetDays, name);
    setAdhitthanaState(updatedState);
  };

  const handleResetMissedJourney = () => {
    const updatedState = StorageService.resetMissedJourney();
    setAdhitthanaState(updatedState);
  };

  const handleResetAll = () => {
    const updatedState = StorageService.resetAll();
    setAdhitthanaState(updatedState);
  };

  const handleSaveName = (name: string) => {
    const updatedState = { ...adhitthanaState, devoteeName: name };
    setAdhitthanaState(updatedState);
    StorageService.saveState(updatedState);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 flex flex-col font-sans selection:bg-amber-500/20">
      {/* Show Navbar when not in focused Recitation mode */}
      {currentTab !== 'recitation' && (
        <Navbar
          state={adhitthanaState}
          currentTab={currentTab}
          setCurrentTab={(tab) => setCurrentTab(tab)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            state={adhitthanaState}
            onStartRecitation={handleStartRecitation}
            onStartNewJourney={handleStartNewJourney}
            onResetMissedJourney={handleResetMissedJourney}
            onOpenRealms={() => setCurrentTab('realms')}
            onOpenCalendar={() => setCurrentTab('calendar')}
            onOpenSutta={() => setCurrentTab('sutta')}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {currentTab === 'sutta' && (
          <SuttaReader onBack={() => setCurrentTab('home')} />
        )}

        {currentTab === 'realms' && (
          <RealmsCatalog onBack={() => setCurrentTab('home')} />
        )}

        {currentTab === 'calendar' && (
          <HistoryCalendar
            state={adhitthanaState}
            onBack={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'recitation' && (
          <RecitationRoom
            devoteeName={adhitthanaState.devoteeName}
            onExit={handleExitRecitation}
            onFinishSession={handleFinishRecitation}
            soundEnabled={true}
          />
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        state={adhitthanaState}
        onSaveName={handleSaveName}
        onResetAll={handleResetAll}
      />
    </div>
  );
}

export default App;
