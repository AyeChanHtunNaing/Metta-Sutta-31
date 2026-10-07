import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, ChevronLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { RealmItem } from '../types';
import { REALMS_DATA } from '../data/realmsData';
import { FULL_METTA_SUTTA_PALI, PRAYER_FLOW_TEXTS } from '../data/mettaSuttaData';
import { soundService } from '../services/soundService';

interface RecitationRoomProps {
  devoteeName: string;
  onExit: () => void;
  onFinishSession: () => void;
  soundEnabled: boolean;
}

export const RecitationRoom: React.FC<RecitationRoomProps> = ({
  devoteeName,
  onExit,
  onFinishSession,
  soundEnabled
}) => {
  // Step 0: Opening
  // Steps 1..31: Realms
  // Step 32: Concluding Dedication
  // Step 33: Merit Sharing
  const [currentStep, setCurrentStep] = useState(0);

  const currentRealm: RealmItem | undefined = 
    currentStep >= 1 && currentStep <= 31 ? REALMS_DATA[currentStep - 1] : undefined;

  const handleNext = () => {
    if (soundEnabled) {
      soundService.playKyeeZee();
    }
    if (currentStep < 33) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleComplete = () => {
    if (soundEnabled) {
      soundService.playKyeeZee();
      setTimeout(() => soundService.playKyeeZee(), 1500);
      setTimeout(() => soundService.playKyeeZee(), 3000);
    }
    onFinishSession();
  };

  // Progress percentage
  const progressPercent = Math.min(100, Math.round((currentStep / 32) * 100));

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 pb-28">
      {/* Top Header (Light Theme) */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-amber-200/80 px-4 py-3 flex items-center justify-between shadow-2xs">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-stone-600 hover:text-amber-800 text-xs sm:text-sm font-semibold transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ထွက်မည်</span>
        </button>

        <div className="text-center">
          <p className="text-xs font-bold text-amber-900">
            {currentStep === 0 && "အစပျိုး အဓိဋ္ဌာန်ပြုစာ"}
            {currentStep >= 1 && currentStep <= 31 && `ဘုံစဉ် ( ${currentStep} / 31 )`}
            {currentStep === 32 && "ပြီးမြောက်ခြင်း ရည်စူးစာ"}
            {currentStep === 33 && "ကုသိုလ် အမျှဝေခြင်း"}
          </p>
          <div className="w-32 sm:w-48 bg-stone-200 h-1.5 rounded-full overflow-hidden mt-1 mx-auto">
            <div 
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => soundService.playKyeeZee()}
          className="text-[11px] font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-xl border border-amber-300/80 transition cursor-pointer flex items-center gap-1 shadow-2xs"
          title="ကြေးစည်သံ စမ်းသပ်တီးကြည့်ရန်"
        >
          <span>🔔 ကြေးစည်သံ</span>
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* STEP 0: OPENING / NAMO TASSA & INITIAL INTENTION */}
        {currentStep === 0 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Namo Tassa Header Card */}
            <div className="bg-white border border-amber-200 rounded-3xl p-6 sm:p-8 text-center shadow-xs">
              <span className="inline-block px-3.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200 mb-3">
                အစပျိုး ရွတ်ဆိုခြင်း
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-amber-950 leading-relaxed">
                {PRAYER_FLOW_TEXTS.namoTassa}
              </h2>
            </div>

            {/* Initial Intention Card */}
            <div className="bg-white border border-amber-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <p className="text-xs uppercase tracking-wider text-amber-800 font-bold mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                အဓိဋ္ဌာန် စတင်ပြုစာ
              </p>
              <p className="text-base sm:text-lg text-amber-950 font-medium leading-relaxed bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80">
                "{PRAYER_FLOW_TEXTS.initialIntention}"
              </p>
            </div>

            {/* Guidance Info */}
            <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-4 text-stone-700 text-xs sm:text-sm leading-relaxed space-y-2">
              <p className="font-bold text-amber-900">📌 ရွတ်ဆိုပုံ ညွှန်ကြားချက် -</p>
              <ul className="list-disc list-inside space-y-1 text-stone-600">
                <li>ငရဲဘုံမှသည် မဟာဗြဟ္မာဘုံအထိ ဘုံပေါင်း (၃၁) ဘုံအတွက် တစ်ဘုံစီအလိုက် မေတ္တသုတ် (၁) ခေါက်စီ စုစုပေါင်း (၃၁) ခေါက် ရွတ်ဆိုပါမည်။</li>
                <li>တစ်ဘုံရွတ်ပြီးတိုင်း "ပြီးပါပြီ (နောက်တစ်ဘုံသို့)" ခလုတ်ကို နှိပ်၍ ဆက်လက်ရွတ်ဆိုနိုင်ပါသည်။</li>
              </ul>
            </div>

            {/* Begin Button */}
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-base sm:text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>၃၁ ဘုံ မေတ္တသုတ် စတင်ရွတ်ဆိုမည်</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEPS 1 to 31: REALM-BY-REALM RECITATION */}
        {currentStep >= 1 && currentStep <= 31 && currentRealm && (
          <div className="space-y-5 animate-fadeIn">
            {/* Realm Card */}
            <div className="bg-white border border-amber-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
                  {currentRealm.categoryName}
                </span>
                <span className="text-xs font-bold text-stone-500">
                  ဘုံစဉ် {currentRealm.id} / 31
                </span>
              </div>

              {/* Dedication Sentence (The core requirement) */}
              <div className="bg-gradient-to-b from-amber-50 to-yellow-50/40 border-2 border-amber-300 rounded-2xl p-5 my-3 text-center shadow-2xs">
                <p className="text-xs text-amber-800 font-bold uppercase tracking-wider mb-1">
                  ဘုံအလိုက် ရည်စူးစာ
                </p>
                <h3 className="text-lg sm:text-xl font-bold text-amber-950 leading-snug">
                  "{currentRealm.dedication}"
                </h3>
                <p className="text-xs text-amber-800 mt-2 font-semibold">
                  ( မေတ္တသုတ်တော် (၁) ခေါက် ရွတ်ဆိုပူဇော်ပါ )
                </p>
              </div>

              {/* Realm Details snippet */}
              <p className="text-xs text-stone-600 bg-stone-50 p-3.5 rounded-xl border border-stone-200 leading-relaxed">
                💡 <span className="font-bold text-stone-800">{currentRealm.name} ({currentRealm.paliName}):</span> {currentRealm.description}
              </p>
            </div>

            {/* Metta Sutta Pali Recitation Card */}
            <div className="bg-white border border-amber-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
                <span className="text-xs text-amber-900 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  မေတ္တာသုတ် ပါဠိတော်
                </span>
                <span className="text-[11px] text-stone-500 font-medium">
                  ဂါထာ (၁ မှ ၁၂)
                </span>
              </div>
              <div className="text-sm sm:text-base text-stone-800 font-normal leading-loose whitespace-pre-line max-h-96 overflow-y-auto pr-2 scrollbar-thin">
                {FULL_METTA_SUTTA_PALI}
              </div>
            </div>

            {/* Navigation and Next Action */}
            <div className="pt-2 flex items-center gap-3">
              {currentStep > 1 && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-3.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 font-semibold text-sm transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">ရှေ့ဘုံ</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>မေတ္တသုတ် ရွတ်ဆိုပြီးပါပြီ (နောက်တစ်ဘုံသို့)</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 32: CONCLUDING DEDICATION WITH DEVOTEE NAME */}
        {currentStep === 32 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white border border-amber-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>မေတ္တသုတ် ၃၁ ခေါက် ပြီးမြောက်ခြင်း ရည်စူးစာ</span>
              </div>
              <h3 className="text-base sm:text-lg text-amber-950 font-medium leading-relaxed bg-amber-50/70 p-5 rounded-2xl border border-amber-200 my-3">
                "{PRAYER_FLOW_TEXTS.conclusionTemplate(devoteeName)}"
              </h3>
              <p className="text-xs text-stone-500 text-center">
                ( မိမိ၏ အမည်ကို ထည့်သွင်း၍ ၃၁ ဘုံ မေတ္တသုတ် အဓိဋ္ဌာန် ပြီးမြောက်ကြောင်း အာရုံပြုရွတ်ဆိုပါ )
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-base sm:text-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ကုသိုလ် အမျှဝေရန် ဆက်သွားမည်</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 33: MERIT SHARING & FINISH */}
        {currentStep === 33 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 sm:p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-amber-100 border border-amber-300 rounded-full flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <Sparkles className="w-8 h-8 text-amber-600 animate-pulse" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-amber-950 mb-2">
                ကုသိုလ် အမျှဝေခြင်း
              </h2>
              <div className="bg-amber-50/80 border border-amber-200 p-5 rounded-2xl text-base sm:text-lg font-bold text-amber-950 whitespace-pre-line leading-relaxed my-4">
                {PRAYER_FLOW_TEXTS.meritSharing}
              </div>
              <p className="text-xs text-stone-600 font-medium">
                ၃၁ ဘုံရှိ သတ္တဝါအပေါင်းတို့အား မေတ္တာဓာတ် ပျံ့နှံ့စေပြီး သာဓု ၃ ကြိမ် ခေါ်ဆိုပါ
              </p>
            </div>

            <button
              onClick={handleComplete}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base sm:text-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-6 h-6 text-white" />
              <span>ယနေ့ အဓိဋ္ဌာန် အောင်မြင်စွာ ပြီးဆုံးပါပြီ</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
