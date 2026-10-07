import React, { useState } from 'react';
import { Search, BookOpen, ArrowLeft } from 'lucide-react';
import { REALMS_DATA } from '../data/realmsData';
import { RealmCategory } from '../types';

interface RealmsCatalogProps {
  onBack: () => void;
}

export const RealmsCatalog: React.FC<RealmsCatalogProps> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryTabs = [
    { id: 'all', label: 'အားလုံး (၃၁)' },
    { id: 'apaya', label: 'အပါယ် ၄ ဘုံ' },
    { id: 'human', label: 'လူ့ဘုံ' },
    { id: 'deva', label: 'နတ် ၆ ဘုံ' },
    { id: 'rupa_brahma', label: 'ရူပဗြဟ္မာ ၁၆ ဘုံ' },
    { id: 'arupa_brahma', label: 'အရူပဗြဟ္မာ ၄ ဘုံ' }
  ];

  const filteredRealms = REALMS_DATA.filter((realm) => {
    const matchesCat = selectedCategory === 'all' || realm.category === (selectedCategory as RealmCategory);
    const matchesSearch = 
      realm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      realm.paliName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      realm.dedication.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
          <BookOpen className="w-5 h-5 text-amber-700" />
          <h2 className="text-base sm:text-lg font-bold text-amber-950">
            ၃၁ ဘုံ ဗဟုသုတ လက်စွဲ
          </h2>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="ဘုံအမည် သို့မဟုတ် ပါဠိအမည် ရှာဖွေပါ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-stone-300 rounded-2xl pl-10 pr-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 shadow-2xs text-xs sm:text-sm"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categoryTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition border cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-white text-stone-600 border-stone-200 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Realms List */}
      <div className="space-y-3.5">
        {filteredRealms.map((realm) => (
          <div
            key={realm.id}
            className="bg-white border border-stone-200 hover:border-amber-300 rounded-3xl p-5 shadow-xs transition space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0 border border-amber-200">
                  {realm.id}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-stone-900">
                  {realm.name}
                </h3>
                <span className="text-xs text-stone-400 font-normal italic">
                  ({realm.paliName})
                </span>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800">
                {realm.categoryName}
              </span>
            </div>

            {/* Dedication Sentence */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-amber-950">
              📌 {realm.dedication}
            </div>

            {/* Description */}
            <p className="text-xs text-stone-600 leading-relaxed">
              {realm.description}
            </p>
          </div>
        ))}

        {filteredRealms.length === 0 && (
          <div className="text-center py-12 text-stone-400 text-sm">
            ရှာဖွေမှုနှင့် ကိုက်ညီသော ဘုံ မတွေ့ရှိပါ
          </div>
        )}
      </div>
    </div>
  );
};
