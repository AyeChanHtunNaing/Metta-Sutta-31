import React, { useState } from 'react';
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { METTA_SUTTA_VERSES } from '../data/mettaSuttaData';

interface SuttaReaderProps {
  onBack: () => void;
}

export const SuttaReader: React.FC<SuttaReaderProps> = ({ onBack }) => {
  const [selectedStanza, setSelectedStanza] = useState<number | 'all'>('all');
  const [showPronunciation, setShowPronunciation] = useState<boolean>(true);
  const [showEnglish, setShowEnglish] = useState<boolean>(true);

  const displayedVerses = selectedStanza === 'all'
    ? METTA_SUTTA_VERSES
    : METTA_SUTTA_VERSES.filter(v => v.stanza === selectedStanza);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-amber-200/80 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-stone-600 hover:text-amber-900 text-xs sm:text-sm font-semibold transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ပင်မစာမျက်နှာသို့</span>
        </button>

        <div className="text-center">
          <h2 className="text-base sm:text-lg font-bold text-amber-950 flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span>မေတ္တာသုတ်တော် ဂါထာတော်များ</span>
          </h2>
          <p className="text-[11px] text-amber-800">
            ပါဠိတော်၊ အသံထွက် (ဖတ်နည်း)၊ မြန်မာပြန် နှင့် English
          </p>
        </div>

        <div className="w-16" /> {/* spacer */}
      </div>

      {/* Control bar: Stanza filter & Toggles */}
      <div className="bg-white border border-amber-200/80 rounded-2xl p-3.5 shadow-2xs space-y-3">
        {/* Stanza Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedStanza('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
              selectedStanza === 'all'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            အားလုံး (၁-၁၂)
          </button>
          {METTA_SUTTA_VERSES.map((verse) => (
            <button
              key={verse.stanza}
              onClick={() => setSelectedStanza(verse.stanza)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                selectedStanza === verse.stanza
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              ဂါထာ {verse.stanza}
            </button>
          ))}
        </div>

        {/* View toggles */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 text-stone-700 font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPronunciation}
                onChange={(e) => setShowPronunciation(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
              />
              <span>အသံထွက် (ဖတ်နည်း)</span>
            </label>

            <label className="flex items-center gap-1.5 text-stone-700 font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showEnglish}
                onChange={(e) => setShowEnglish(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
              />
              <span>English ဘာသာပြန်</span>
            </label>
          </div>

          <span className="text-[11px] text-stone-400 font-medium hidden sm:inline">
            {selectedStanza === 'all' ? 'ဂါထာတော် (၁၂) ပုဒ်စလုံး' : `ဂါထာတော် အမှတ် (${selectedStanza})`}
          </span>
        </div>
      </div>

      {/* Verses Cards List */}
      <div className="space-y-6">
        {displayedVerses.map((verse) => (
          <div
            key={verse.stanza}
            className="bg-white border border-amber-200/90 rounded-3xl p-6 sm:p-9 shadow-xs space-y-6 text-center"
          >
            {/* Stanza Badge */}
            <div className="flex justify-center">
              <span className="px-4 py-1 bg-amber-100/80 text-amber-900 text-xs font-bold rounded-full border border-amber-200/80">
                ဂါထာတော် အမှတ် ({verse.stanza})
              </span>
            </div>

            {/* Pali Lines with Pronunciation under each line (as in images) */}
            <div className="space-y-4 py-1">
              {verse.lines && verse.lines.length > 0 ? (
                verse.lines.map((line, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-base sm:text-lg font-bold text-stone-900 leading-relaxed tracking-wide">
                      {line.pali}
                    </p>
                    {showPronunciation && line.pronunciation && (
                      <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed">
                        {line.pronunciation}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-base sm:text-lg font-bold text-stone-900 whitespace-pre-line leading-loose">
                  {verse.pali}
                </p>
              )}
            </div>

            {/* Burmese Translation Section */}
            <div className="pt-4 border-t border-amber-100/80 space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-amber-900 inline-block px-3 py-1 bg-amber-50 rounded-full border border-amber-200/60">
                မြန်မာပြန်
              </h4>
              <div className="text-xs sm:text-sm text-stone-800 leading-relaxed font-normal whitespace-pre-line text-left sm:text-center max-w-xl mx-auto bg-stone-50/60 p-4 rounded-2xl border border-stone-200/60">
                {verse.meaning}
              </div>
            </div>

            {/* English Translation Section */}
            {showEnglish && verse.english && (
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <h4 className="text-xs font-bold text-stone-700 tracking-wider inline-block px-2.5 py-0.5 bg-stone-100 rounded-full">
                  English
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic max-w-xl mx-auto">
                  {verse.english}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination arrows when single stanza view */}
      {selectedStanza !== 'all' && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setSelectedStanza(prev => (typeof prev === 'number' && prev > 1 ? prev - 1 : 12))}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 transition cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ရှေ့ဂါထာ</span>
          </button>

          <span className="text-xs font-bold text-amber-900">
            {selectedStanza} / 12
          </span>

          <button
            onClick={() => setSelectedStanza(prev => (typeof prev === 'number' && prev < 12 ? prev + 1 : 1))}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 transition cursor-pointer shadow-2xs"
          >
            <span>နောက်ဂါထာ</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
