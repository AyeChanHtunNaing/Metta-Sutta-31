import React, { useState } from 'react';
import { X, User, RefreshCw, Check } from 'lucide-react';
import { AdhitthanaState } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: AdhitthanaState;
  onSaveName: (name: string) => void;
  onResetAll: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  state,
  onSaveName,
  onResetAll
}) => {
  const [name, setName] = useState(state.devoteeName);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveName(name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-stone-200/90 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            ပြင်ဆင်ချက်များ (Settings)
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Devotee Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>အဓိဋ္ဌာန်ပြုသူ အမည်</span>
            </label>
            <input
              type="text"
              placeholder="ဥပမာ- မောင်မောင်"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white text-sm"
            />
            <p className="text-[11px] text-stone-500">
              အဆုံးသတ် ရည်စူးစာတွင် ဤအမည်ဖြင့် အလိုအလျောက် ပေါ်လာမည်ဖြစ်ပါသည်။
            </p>
          </div>

          {/* Reset Journey Option */}
          <div className="pt-3 border-t border-stone-100">
            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-2.5 rounded-xl bg-stone-50 hover:bg-rose-50 text-stone-600 hover:text-rose-600 border border-stone-200 hover:border-rose-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>အဓိဋ္ဌာန် အစမှ အသစ်ပြန်စတင်မည်</span>
              </button>
            ) : (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center space-y-2.5">
                <p className="text-xs text-rose-900 font-bold">
                  လက်ရှိ အဓိဋ္ဌာန်ကို ဖျက်ပြီး အသစ်ပြန်စရန် သေချာပါသလား?
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      onResetAll();
                      setShowConfirmReset(false);
                      onClose();
                    }}
                    className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    သေချာသည် (Reset)
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-4 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-semibold text-xs cursor-pointer"
                  >
                    မလုပ်တော့ပါ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition cursor-pointer"
          >
            ပိတ်မည်
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>သိမ်းဆည်းမည်</span>
          </button>
        </div>
      </div>
    </div>
  );
};
