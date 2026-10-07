import React, { useState } from 'react';
import { Play, Sparkles, AlertTriangle, CheckCircle2, Trophy, Flame, ChevronRight, BookOpen, Calendar, User, ScrollText } from 'lucide-react';
import { AdhitthanaState } from '../types';
import { METTA_SUTTA_BENEFITS } from '../data/mettaSuttaData';

interface HomeViewProps {
  state: AdhitthanaState;
  onStartRecitation: () => void;
  onStartNewJourney: (targetDays: number, name: string) => void;
  onResetMissedJourney: () => void;
  onOpenRealms: () => void;
  onOpenCalendar: () => void;
  onOpenSutta: () => void;
  onOpenSettings: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  state,
  onStartRecitation,
  onStartNewJourney,
  onResetMissedJourney,
  onOpenRealms,
  onOpenCalendar,
  onOpenSutta,
  onOpenSettings
}) => {
  const [setupName, setSetupName] = useState(state.devoteeName || '');
  const [setupDays, setSetupDays] = useState(31);

  const targetDayOptions = [7, 21, 31, 45, 90];
  const progressPercent = Math.min(100, Math.round((state.currentDay / state.targetDays) * 100));

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      {/* 1. STRICT MISSED DAY ALERT (KOENAWIN DISCIPLINE) */}
      {state.status === 'missed_day' && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-rose-950">
                ရက်ပျက်သဖြင့် အဓိဋ္ဌာန် ကျိုးပေါက်သွားပါသည်
              </h2>
              <p className="text-xs text-rose-700 font-medium">
                (KoeNaWin စည်းကမ်းအတိုင်း ရက်ပျက်ပါက အစမှ အသစ်ပြန်စတင်ရပါမည်)
              </p>
            </div>
          </div>

          <p className="text-sm text-stone-700 leading-relaxed bg-white/80 p-4 rounded-2xl border border-rose-200">
            အဓိဋ္ဌာန် ရွတ်ဆိုမှုသည် စိတ်စွမ်းအားနှင့် နေ့စဥ် ဝီရိယမပြတ် ဆောက်တည်ရသော မြင့်မြတ်သည့် ကုသိုလ်ဖြစ်ပါသည်။ 
            မနေ့က ရွတ်ဆိုမှု ပျက်ကွက်ခဲ့သဖြင့် သစ္စာအဓိဋ္ဌာန် စည်းကမ်းအရ ယခုအကြိမ် အဓိဋ္ဌာန်ကို မှတ်တမ်းတင်သိမ်းဆည်းလိုက်ပြီး၊ 
            စိတ်သစ်ကိုယ်သစ်ဖြင့် အစမှ ပြန်လည်စတင်နိုင်ပါသည်။
          </p>

          <button
            onClick={onResetMissedJourney}
            className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm sm:text-base shadow-sm transition cursor-pointer"
          >
            အဓိဋ္ဌာန် အသစ် ပြန်လည်စတင်မည်
          </button>
        </div>
      )}

      {/* 2. COMPLETED TODAY STATUS */}
      {state.status === 'completed_today' && (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 text-center">
          <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-950">
              ယနေ့အတွက် အဓိဋ္ဌာန် အောင်မြင်စွာ ပြီးဆုံးပါပြီ!
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              ၃၁ ဘုံရှိ သတ္တဝါအပေါင်းတို့အား မေတ္တာဓာတ် ပျံ့နှံ့ပူဇော်ပြီး ဖြစ်ပါသည်။
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 text-xs">
            <span className="bg-white border border-amber-200 px-3.5 py-1.5 rounded-full flex items-center gap-1 font-bold text-amber-800 shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              ရက်ဆက် streak: {state.streakCount} ရက်
            </span>
            <span className="bg-white border border-stone-200 px-3.5 py-1.5 rounded-full font-semibold text-stone-700 shadow-2xs">
              Day {state.currentDay - 1} / {state.targetDays}
            </span>
          </div>

          <button
            onClick={onStartRecitation}
            className="px-6 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-semibold text-xs transition border border-stone-300 shadow-2xs cursor-pointer"
          >
            ထပ်မံ ရွတ်ဖတ်ပူဇော်မည် (လွတ်လပ်စွာ)
          </button>
        </div>
      )}

      {/* 3. COMPLETED ENTIRE JOURNEY */}
      {state.status === 'completed_journey' && (
        <div className="bg-gradient-to-b from-amber-50 to-yellow-50 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 border border-amber-300 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Trophy className="w-8 h-8 text-amber-600 animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-950">
              အဓိဋ္ဌာန် အောင်မြင်စွာ ဆုံးခန်းတိုင် ပြီးမြောက်ပါပြီ!
            </h2>
            <p className="text-sm text-stone-700 mt-1">
              သတ်မှတ်ထားသော ({state.targetDays}) ရက် အဓိဋ္ဌာန် ခရီးစဉ်ကို အပြည့်အဝ ပြီးမြောက်ခဲ့ပါပြီ။
            </p>
          </div>
          <button
            onClick={() => onStartNewJourney(31, state.devoteeName)}
            className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition cursor-pointer"
          >
            နောက်ထပ် အဓိဋ္ဌာန်အသစ် စတင်ဆောက်တည်မည်
          </button>
        </div>
      )}

      {/* 4. ACTIVE JOURNEY HERO CARD (LIGHT THEME) */}
      {state.status === 'active' && (
        <div className="bg-white border border-amber-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-amber-100/40 rounded-full blur-2xl pointer-events-none" />

          {/* Devotee name badge */}
          <div className="flex items-center justify-between gap-2">
            <button 
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 text-xs text-amber-900 hover:text-amber-700 font-semibold transition cursor-pointer bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200/80"
              title="အမည် ပြင်ဆင်ရန်"
            >
              <User className="w-3.5 h-3.5 text-amber-700" />
              <span>အဓိဋ္ဌာန်ပြုသူ: {state.devoteeName || "အမည်မထည့်ရသေးပါ (ပြင်ရန် နှိပ်ပါ)"}</span>
            </button>
            <span className="text-xs font-bold px-3 py-1 bg-amber-100/80 text-amber-900 rounded-full border border-amber-200">
              {state.targetDays} ရက် အဓိဋ္ဌာန်
            </span>
          </div>

          {/* Day Counter Display */}
          <div className="text-center space-y-1 py-2">
            <p className="text-xs uppercase tracking-wider text-amber-800 font-bold">
              လက်ရှိ ရောက်ရှိနေသော နေ့ရက်
            </p>
            <h2 className="text-5xl sm:text-6xl font-extrabold text-amber-950 tracking-tight">
              Day {state.currentDay}
              <span className="text-2xl sm:text-3xl text-stone-400 font-medium ml-2">
                / {state.targetDays}
              </span>
            </h2>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-stone-600 font-semibold">
              <span>တိုးတက်မှု (Progress)</span>
              <span className="text-amber-700 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden p-0.5 border border-stone-200">
              <div 
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500 shadow-2xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Big Action CTA */}
          <button
            onClick={onStartRecitation}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-base sm:text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
            <span>ယနေ့ အဓိဋ္ဌာန် စတင်ရွတ်ဆိုမည်</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 5. NOT STARTED: INITIAL SETUP CARD (LIGHT THEME) */}
      {state.status === 'not_started' && (
        <div className="bg-white border border-amber-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-center mx-auto text-2xl shadow-2xs">
              🪷
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-950">
              ၃၁ ဘုံ မေတ္တသုတ် အဓိဋ္ဌာန် ဆောက်တည်မည်
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              ၃၁ ဘုံရှိ သတ္တဝါအပေါင်းတို့အား မေတ္တာပို့သပြီး အေးချမ်းသာယာစေရန် နေ့စဥ် မေတ္တသုတ် (၃၁) ခေါက် ရွတ်ဆိုပူဇော်မည့် အဓိဋ္ဌာန်ခရီးစဉ် စတင်ပါ။
            </p>
          </div>

          <div className="space-y-4">
            {/* Devotee Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                အဓိဋ္ဌာန်ပြုသူ အမည် (ရည်စူးစာတွင် ထည့်သွင်းရန်)
              </label>
              <input
                type="text"
                placeholder="ဥပမာ- မောင်မောင်"
                value={setupName}
                onChange={(e) => setSetupName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white text-sm"
              />
            </div>

            {/* Target Days Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                အဓိဋ္ဌာန် ရက်သတ်မှတ်ချက် ရွေးချယ်ပါ
              </label>
              <div className="grid grid-cols-5 gap-2">
                {targetDayOptions.map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setSetupDays(days)}
                    className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                      setupDays === days
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm scale-102'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {days} ရက်
                  </button>
                ))}
              </div>
            </div>

            {/* Discipline Note */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed">
              ⚠️ <span className="font-bold">သတိပြုရန် စည်းကမ်း:</span> နေ့စဥ် မပျက်မကွက် ရွတ်ဆိုရပါမည်။ ရက်တစ်ရက် ပျက်ကွက်သွားပါက အဓိဋ္ဌာန် ကျိုးပေါက်မည်ဖြစ်ပြီး အစမှ အသစ်ပြန်လည် စတင်ရပါမည်။
            </div>

            {/* Start Button */}
            <button
              onClick={() => onStartNewJourney(setupDays, setupName)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-base shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>အဓိဋ္ဌာန် စတင် ဆောက်တည်မည်</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. FEATURED METTA SUTTA READER CARD */}
      <button
        onClick={onOpenSutta}
        className="w-full bg-gradient-to-r from-amber-50 to-amber-100/60 hover:from-amber-100 hover:to-amber-200/60 border border-amber-300/90 p-5 rounded-3xl text-left transition shadow-2xs group cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-amber-300 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <ScrollText className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-amber-950">
                မေတ္တာသုတ်တော် ဂါထာတော်များ
              </h3>
              <span className="px-2 py-0.5 bg-amber-200/80 text-amber-900 text-[10px] font-bold rounded-full">
                အသံထွက် / ဘာသာပြန်
              </span>
            </div>
            <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
              ဂါထာတော် (၁၂) ပုဒ်၏ အသံထွက် (ဖတ်နည်း)၊ မြန်မာပြန် နှင့် English စုံလင်စွာ ဖတ်ရှုလေ့လာရန်
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-amber-700 shrink-0 ml-2 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* 7. QUICK NAVIGATION CARDS (LIGHT THEME) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 31 Realms Guide */}
        <button
          onClick={onOpenRealms}
          className="bg-white hover:bg-amber-50/50 border border-stone-200 hover:border-amber-300 p-5 rounded-3xl text-left transition shadow-xs group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-stone-900">၃၁ ဘုံ ဗဟုသုတ</h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            ဘုံအဆင့်ဆင့်နှင့် သတ္တဝါတို့၏ သဘာဝများ ဖတ်ရှုရန်
          </p>
        </button>

        {/* History / Calendar */}
        <button
          onClick={onOpenCalendar}
          className="bg-white hover:bg-amber-50/50 border border-stone-200 hover:border-amber-300 p-5 rounded-3xl text-left transition shadow-xs group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-stone-900">အဓိဋ္ဌာန် ပြက္ခဒိန်</h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            ပြီးမြောက်မှုနှင့် Streak ရက်ဆက် မှတ်တမ်းများ
          </p>
        </button>
      </div>

      {/* 7. BENEFITS OF RECITING METTA SUTTA CARD */}
      <div className="bg-white border border-amber-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-amber-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-base font-bold text-amber-950">
            {METTA_SUTTA_BENEFITS.title}
          </h3>
        </div>

        <div className="space-y-3.5">
          {METTA_SUTTA_BENEFITS.items.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-amber-200 shadow-2xs">
                {item.id}
              </span>
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs sm:text-sm text-amber-950 font-semibold leading-relaxed mt-1">
          📌 {METTA_SUTTA_BENEFITS.note}
        </div>
      </div>

      {/* 8. DAILY METTA DHAMMA INSPIRATION (LIGHT THEME) */}
      <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-4 text-center text-xs text-stone-700 leading-relaxed shadow-2xs">
        <p className="font-bold text-amber-900 mb-1">🪷 မေတ္တာတရား၏ ဂုဏ်တော် -</p>
        <p className="italic text-stone-600">
          "မေတ္တာစိတ်သည် တစ်လောကလုံးရှိ သတ္တဝါအပေါင်းအား အေးမြသော အရိပ်အာဝါသကို ပေးစွမ်းနိုင်၏။ 
          မေတ္တာပွားများသူသည် အိပ်သော်လည်း ချမ်းသာ၊ နိုးသော်လည်း ချမ်းသာ၊ လူနတ်ဗြဟ္မာ ချစ်ခင်မြတ်နိုးခြင်းကို ရရှိပေ၏။"
        </p>
      </div>
    </div>
  );
};
