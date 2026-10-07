import React from 'react';
import { Flame, Settings, BookOpen, Calendar, ScrollText } from 'lucide-react';
import { AdhitthanaState } from '../types';

interface NavbarProps {
  state: AdhitthanaState;
  currentTab: 'home' | 'realms' | 'calendar' | 'sutta';
  setCurrentTab: (tab: 'home' | 'realms' | 'calendar' | 'sutta') => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  currentTab,
  setCurrentTab,
  onOpenSettings
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-200/70 text-stone-800 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div 
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-amber-50 rounded-full flex items-center justify-center">
              <span className="text-xl">🪷</span>
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wide text-amber-950 group-hover:text-amber-700 transition-colors">
              Metta Sutta 31
            </h1>
            <p className="text-[11px] text-amber-800/90 -mt-0.5 font-medium">
              ၃၁ ဘုံ မေတ္တသုတ် အဓိဋ္ဌာန်
            </p>
          </div>
        </div>

        {/* Navigation Tabs and Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Streak Indicator */}
          {state.streakCount > 0 && (
            <div 
              title={`ရက်ဆက် ရွတ်ဆိုမှု ${state.streakCount} ရက်`}
              className="flex items-center gap-1 bg-amber-50 border border-amber-300/80 px-2.5 py-1 rounded-full text-xs font-bold text-amber-800 shadow-2xs"
            >
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
              <span>{state.streakCount} ရက်</span>
            </div>
          )}

          {/* Tab buttons */}
          <button
            onClick={() => setCurrentTab('sutta')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
              currentTab === 'sutta' 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'text-stone-600 hover:bg-amber-50 hover:text-amber-900 border border-transparent'
            }`}
            title="မေတ္တာသုတ်တော် ဂါထာများ (အသံထွက်၊ ဘာသာပြန်)"
          >
            <ScrollText className="w-4 h-4" />
            <span className="hidden sm:inline">မေတ္တာသုတ်</span>
          </button>

          <button
            onClick={() => setCurrentTab('realms')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
              currentTab === 'realms' 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'text-stone-600 hover:bg-amber-50 hover:text-amber-900 border border-transparent'
            }`}
            title="၃၁ ဘုံ ဗဟုသုတ"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">၃၁ ဘုံ</span>
          </button>

          <button
            onClick={() => setCurrentTab('calendar')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
              currentTab === 'calendar' 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'text-stone-600 hover:bg-amber-50 hover:text-amber-900 border border-transparent'
            }`}
            title="မှတ်တမ်း ပြက္ခဒိန်"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">မှတ်တမ်း</span>
          </button>

          {/* Settings Modal Toggle */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors border border-stone-200/60 cursor-pointer"
            title="ဆက်တင်များ"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
