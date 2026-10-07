import React, { useState } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, CheckCircle2, Flame, AlertCircle } from 'lucide-react';
import { AdhitthanaState } from '../types';

interface HistoryCalendarProps {
  state: AdhitthanaState;
  onBack: () => void;
}

export const HistoryCalendar: React.FC<HistoryCalendarProps> = ({ state, onBack }) => {
  const [currentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const myanmarMonths = [
    "ဇန်နဝါရီ", "ဖေဖော်ဝါရီ", "မတ်", "ဧပြီ", "မေ", "ဇွန်",
    "ဇူလိုင်", "သြဂုတ်", "စက်တင်ဘာ", "အောက်တိုဘာ", "နိုဝင်ဘာ", "ဒီဇင်ဘာ"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const isDateCompleted = (day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return state.completedDates.includes(formattedDate);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-stone-600 hover:text-amber-800 text-xs sm:text-sm font-semibold transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ပင်မသို့ ပြန်သွားမည်</span>
        </button>

        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-amber-700" />
          <h2 className="text-base sm:text-lg font-bold text-amber-950">
            အဓိဋ္ဌာန် မှတ်တမ်း ပြက္ခဒိန်
          </h2>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-stone-200/90 p-4 rounded-3xl text-center space-y-1 shadow-xs">
          <p className="text-[11px] text-stone-500 font-semibold">ရက်ဆက် Streak</p>
          <div className="flex items-center justify-center gap-1 text-lg sm:text-xl font-bold text-orange-600">
            <Flame className="w-5 h-5 fill-orange-500" />
            <span>{state.streakCount} ရက်</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200/90 p-4 rounded-3xl text-center space-y-1 shadow-xs">
          <p className="text-[11px] text-stone-500 font-semibold">ပြီးစီးမှု</p>
          <p className="text-lg sm:text-xl font-bold text-emerald-600">
            {state.completedDates.length} ရက်
          </p>
        </div>

        <div className="bg-white border border-stone-200/90 p-4 rounded-3xl text-center space-y-1 shadow-xs">
          <p className="text-[11px] text-stone-500 font-semibold">ပန်းတိုင်</p>
          <p className="text-lg sm:text-xl font-bold text-amber-700">
            {state.targetDays} ရက်
          </p>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="bg-white border border-amber-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="text-center">
          <h3 className="text-base sm:text-lg font-bold text-amber-950">
            {year} ခုနှစ်၊ {myanmarMonths[month]} လ
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            (စိမ်းရောင်အမှတ်အသားသည် မေတ္တာသုတ် ၃၁ ခေါက် ရွတ်ဆိုပြီးမြောက်ခဲ့သော နေ့များဖြစ်သည်)
          </p>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-stone-500 border-b border-stone-100 pb-2">
          <span>တနင်္ဂနွေ</span>
          <span>တနင်္လာ</span>
          <span>အင်္ဂါ</span>
          <span>ဗုဒ္ဓဟူး</span>
          <span>ကြာသပတေး</span>
          <span>သောကြာ</span>
          <span>စနေ</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {blanksArray.map((_, idx) => (
            <div key={`blank-${idx}`} className="h-10 sm:h-12" />
          ))}

          {daysArray.map((day) => {
            const completed = isDateCompleted(day);
            return (
              <div
                key={day}
                className={`h-10 sm:h-12 rounded-2xl flex flex-col items-center justify-center text-xs sm:text-sm font-semibold transition relative ${
                  completed
                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-800 shadow-2xs font-bold'
                    : 'bg-stone-50/60 text-stone-600 border border-stone-200/50'
                }`}
              >
                <span>{day}</span>
                {completed && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Broken/Failed Journeys History */}
      {state.failedJourneys.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-3 shadow-xs">
          <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-stone-500" />
            <span>ယခင် အဓိဋ္ဌာန် ပြတ်တောက်ခဲ့သော မှတ်တမ်းများ</span>
          </h3>

          <div className="space-y-2">
            {state.failedJourneys.map((rec) => (
              <div
                key={rec.id}
                className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-xs space-y-1"
              >
                <div className="flex justify-between text-stone-800">
                  <span className="font-bold text-amber-800">{rec.targetDays} ရက် အဓိဋ္ဌာန်</span>
                  <span className="text-stone-600">ပြီးမြောက်ခဲ့မှု: {rec.daysCompleted} ရက်</span>
                </div>
                <div className="flex justify-between text-stone-500 text-[11px]">
                  <span>စတင်ရက်: {rec.startDate}</span>
                  <span>ပျက်သွားသည့်ရက်: {rec.failedDate}</span>
                </div>
                <p className="text-[11px] text-rose-700 italic">
                  အကြောင်းရင်း: {rec.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
