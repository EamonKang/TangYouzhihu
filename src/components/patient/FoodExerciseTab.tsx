import React, { useState } from 'react';
import { foodDatabase } from '../../data/mockData';
import { FoodItem } from '../../types';
import { 
  Apple, 
  Flame, 
  Search, 
  Footprints, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Info,
  Activity,
  Heart
} from 'lucide-react';

interface FoodExerciseTabProps {
  isLargeFont: boolean;
  onAddPoints: (points: number, reason: string) => void;
}

export const FoodExerciseTab: React.FC<FoodExerciseTabProps> = ({
  isLargeFont,
  onAddPoints,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'food' | 'exercise'>('food');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [exerciseCheckedIn, setExerciseCheckedIn] = useState<boolean>(false);
  const [safetyGlucoseInput, setSafetyGlucoseInput] = useState<string>('6.5');

  // Filter foods
  const categories = ['全部', '水果', '主食', '蔬菜', '肉蛋奶', '零食饮品'];
  const filteredFoods = foodDatabase.filter((f) => {
    const matchCat = selectedCategory === '全部' || f.category === selectedCategory;
    const matchQuery = f.name.includes(searchQuery) || f.advice.includes(searchQuery) || f.tcmProperty.includes(searchQuery);
    return matchCat && matchQuery;
  });

  // Pre-exercise safety check
  const gVal = parseFloat(safetyGlucoseInput) || 0;
  let safetyAdvice = '适合适度运动，记得带水和糖果。';
  let safetyColor = 'bg-emerald-50 border-emerald-200 text-emerald-800';

  if (gVal < 5.5) {
    safetyAdvice = '⚠️ 运动前血糖 < 5.5 mmol/L，建议先吃1-2片苏打饼干或半杯牛奶后再运动，预防运动诱发低血糖！';
    safetyColor = 'bg-red-50 border-red-200 text-red-800 animate-pulse';
  } else if (gVal > 16.7) {
    safetyAdvice = '⚠️ 运动前血糖 > 16.7 mmol/L，此时剧烈运动可能加重代谢紊乱，建议暂停剧烈运动，多喝水，必要时测尿酮！';
    safetyColor = 'bg-amber-50 border-amber-200 text-amber-800';
  }

  const handleExerciseCheckin = () => {
    if (exerciseCheckedIn) return;
    setExerciseCheckedIn(true);
    onAddPoints(15, '完成科学运动打卡');
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Sub-tab Switcher */}
      <div className="bg-slate-100 p-1 rounded-2xl flex">
        <button
          onClick={() => setActiveSubTab('food')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'food'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Apple className="w-4 h-4 text-emerald-600" />
          <span>食物升糖字典 (GI/GL)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('exercise')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'exercise'
              ? 'bg-white text-teal-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4 text-teal-600" />
          <span>运动处方与打卡</span>
        </button>
      </div>

      {activeSubTab === 'food' ? (
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="搜食物（西瓜、苹果、米饭、苦瓜...）"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-xs"
            />
          </div>

          {/* Category Chips */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1 rounded-xl text-xs whitespace-nowrap transition ${
                  selectedCategory === c
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Legend Banner */}
          <div className="bg-emerald-50/60 p-2.5 rounded-2xl border border-emerald-100 flex items-center justify-between text-[11px] text-emerald-900">
            <span className="font-semibold flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              红绿灯交通法则：
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-700 font-medium">🟢 低GI (&lt;55)</span>
              <span className="text-amber-700 font-medium">🟡 中GI (55-69)</span>
              <span className="text-red-700 font-medium">🔴 高GI (≥70)</span>
            </span>
          </div>

          {/* Food Cards List */}
          <div className="space-y-2.5">
            {filteredFoods.map((f) => (
              <div
                key={f.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs hover:border-emerald-200 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-slate-800 ${isLargeFont ? 'text-base' : 'text-sm'}`}>
                      {f.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {f.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        f.level === 'low'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : f.level === 'medium'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                    >
                      GI {f.gi} · {f.level === 'low' ? '低升糖' : f.level === 'medium' ? '中升糖' : '高升糖'}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-xs text-slate-600 space-y-1">
                  <p>
                    <span className="font-semibold text-slate-700">推荐食用量：</span>
                    {f.portion}
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    <span className="font-semibold text-slate-700">营养指导：</span>
                    {f.advice}
                  </p>
                  <p className="text-amber-800/80 bg-amber-50/60 p-1.5 rounded-lg text-[11px]">
                    <span className="font-semibold">🌿 中医调护：</span>
                    {f.tcmProperty}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Pre-Exercise Safety Checker */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs mb-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>运动前安全评估（防低血糖与酮症）</span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs text-slate-500">当前测得血糖：</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.1"
                  value={safetyGlucoseInput}
                  onChange={(e) => setSafetyGlucoseInput(e.target.value)}
                  className="w-20 px-2 py-1 border border-slate-300 rounded-lg text-sm text-center font-bold"
                />
                <span className="text-xs text-slate-400">mmol/L</span>
              </div>
            </div>

            <div className={`p-2.5 rounded-xl border text-xs leading-relaxed ${safetyColor}`}>
              {safetyAdvice}
            </div>
          </div>

          {/* Today Activity Tracker */}
          <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-3xl p-4 text-white shadow-md shadow-teal-900/10">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-teal-100 font-medium">今日运动步数</span>
                <div className="text-3xl font-black mt-1">7,420</div>
                <span className="text-[11px] text-teal-200">目标 8,000 步 (已完成 92%)</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Footprints className="w-7 h-7" />
              </div>
            </div>

            <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden mt-3">
              <div className="bg-amber-300 h-full w-[92%] rounded-full"></div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
              <span className="text-xs text-teal-100">餐后快走 30 分钟已完成</span>
              <button
                onClick={handleExerciseCheckin}
                disabled={exerciseCheckedIn}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  exerciseCheckedIn
                    ? 'bg-white/30 text-white cursor-default'
                    : 'bg-white text-teal-900 hover:bg-teal-50 shadow-xs active:scale-95'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {exerciseCheckedIn ? '今日已打卡 (+15分)' : '运动打卡 (+15分)'}
              </button>
            </div>
          </div>

          {/* Fengxian TCM Baduanjin Exercise */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>奉贤中医特色：八段锦控糖功法</span>
              </div>
              <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                适宜中老年
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs">
                <h4 className="font-bold text-amber-900">
                  第一式：调理脾胃须单举
                </h4>
                <p className="text-amber-800/80 mt-1 leading-relaxed">
                  通过左右两手一上一下拉伸对拔，牵拉腹腔脏腑，刺激脾胃经脉，增强中焦运化功能，有效改善胰岛素敏感度。
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs">
                <h4 className="font-bold text-amber-900">
                  第二式：五劳七伤往后瞧
                </h4>
                <p className="text-amber-800/80 mt-1 leading-relaxed">
                  缓慢转头牵引颈胸神经与植物神经，调节自主神经功能，缓解糖尿病糖友常有的神经衰弱、失眠烦躁。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
