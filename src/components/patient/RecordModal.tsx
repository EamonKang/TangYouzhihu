import React, { useState } from 'react';
import { TimeSlot, GlucoseStatus, BloodGlucoseRecord } from '../../types';
import { X, Check, AlertTriangle, AlertCircle, Sparkles, HeartPulse, Clock } from 'lucide-react';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<BloodGlucoseRecord, 'id' | 'patientId'>) => void;
  isLargeFont: boolean;
  isAudioEnabled: boolean;
}

const timeSlotLabels: { slot: TimeSlot; label: string; desc: string }[] = [
  { slot: 'fasting', label: '晨起空腹', desc: '早起未进食前' },
  { slot: 'post_breakfast', label: '早餐后2小时', desc: '吃第一口饭起算' },
  { slot: 'pre_lunch', label: '午餐前', desc: '午饭前即刻' },
  { slot: 'post_lunch', label: '午餐后2小时', desc: '吃第一口饭起算' },
  { slot: 'pre_dinner', label: '晚餐前', desc: '晚饭前即刻' },
  { slot: 'post_dinner', label: '晚餐后2小时', desc: '吃第一口饭起算' },
  { slot: 'bedtime', label: '睡前', desc: '准备入睡前' },
  { slot: 'random', label: '随机/加测', desc: '身体不适随时测' },
];

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLargeFont,
  isAudioEnabled,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>('fasting');
  const [glucoseValue, setGlucoseValue] = useState<number>(6.5);
  const [note, setNote] = useState<string>('');

  if (!isOpen) return null;

  // Calculate status and safety guidance
  const isFasting = selectedSlot === 'fasting' || selectedSlot === 'pre_lunch' || selectedSlot === 'pre_dinner';
  
  let status: GlucoseStatus = 'normal';
  let statusText = '理想达标';
  let statusColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  let advice = '太棒了！您的血糖在非常理想的控制范围，请继续保持良好的饮食与运动习惯！';

  if (glucoseValue < 3.9) {
    status = 'low';
    statusText = '⚠️ 严重低血糖风险';
    statusColor = 'text-red-700 bg-red-100 border-red-300 animate-pulse';
    advice = '【紧急处置 - 双15原则】：立即进食15g快速糖（半杯果汁或4块水果糖），静坐15分钟后复测！系统将自动通报责任护士！';
  } else if (glucoseValue >= 3.9 && glucoseValue < (isFasting ? 4.4 : 4.4)) {
    status = 'normal';
    statusText = '偏低（接近临界）';
    statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
    advice = '血糖稍偏低，建议留意有无轻微心慌手抖，可适当提前进食或加餐少量粗粮饼干。';
  } else if (glucoseValue > (isFasting ? 7.0 : 10.0) && glucoseValue <= 13.9) {
    status = 'high';
    statusText = '血糖偏高';
    statusColor = 'text-orange-700 bg-orange-50 border-orange-200';
    advice = '血糖略高于理想控制标准，请回顾刚才餐食是否偏油腻或主食超量，餐后可在1小时适度慢走20分钟。';
  } else if (glucoseValue > 13.9) {
    status = 'very_high';
    statusText = '🔴 显著高血糖告警';
    statusColor = 'text-purple-800 bg-purple-100 border-purple-300';
    advice = '血糖明显偏高！请多饮温开水促进排糖，排查有无漏服药物，关注有无明显口渴、恶心等反应，必要时联系科室医生。';
  }

  const handleAdjust = (delta: number) => {
    const nextVal = Number((glucoseValue + delta).toFixed(1));
    if (nextVal >= 1.5 && nextVal <= 33.3) {
      setGlucoseValue(nextVal);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    onSave({
      timestamp: timeStr,
      timeSlot: selectedSlot,
      value: glucoseValue,
      status,
      note: note.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-emerald-100 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-emerald-200" />
            <h3 className={`font-bold ${isLargeFont ? 'text-xl' : 'text-base'}`}>
              记录血糖数值
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Time slot picker */}
          <div>
            <label className={`block font-semibold text-slate-700 mb-2 flex items-center gap-1.5 ${isLargeFont ? 'text-lg' : 'text-xs'}`}>
              <Clock className="w-4 h-4 text-emerald-600" />
              测量时段
            </label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlotLabels.map((item) => (
                <button
                  type="button"
                  key={item.slot}
                  onClick={() => setSelectedSlot(item.slot)}
                  className={`py-2 px-3 rounded-xl border text-left transition-all ${
                    selectedSlot === item.slot
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold shadow-xs ring-1 ring-emerald-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={isLargeFont ? 'text-base' : 'text-xs font-medium'}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Value Stepper */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <span className="text-xs text-slate-400 font-medium">测量结果 (mmol/L)</span>
            
            <div className="flex items-center justify-center gap-3 my-2">
              <button
                type="button"
                onClick={() => handleAdjust(-0.5)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-lg hover:bg-slate-100 active:scale-95 shadow-xs"
              >
                -0.5
              </button>
              <button
                type="button"
                onClick={() => handleAdjust(-0.1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-base hover:bg-slate-100 active:scale-95 shadow-xs"
              >
                -0.1
              </button>

              <div className="min-w-[110px]">
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="33.3"
                  value={glucoseValue}
                  onChange={(e) => setGlucoseValue(Number(parseFloat(e.target.value) || 0))}
                  className={`w-full text-center font-black text-slate-800 bg-transparent focus:outline-none ${
                    isLargeFont ? 'text-4xl' : 'text-3xl'
                  }`}
                />
                <span className="text-[11px] text-slate-400">mmol/L</span>
              </div>

              <button
                type="button"
                onClick={() => handleAdjust(0.1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-base hover:bg-slate-100 active:scale-95 shadow-xs"
              >
                +0.1
              </button>
              <button
                type="button"
                onClick={() => handleAdjust(0.5)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-lg hover:bg-slate-100 active:scale-95 shadow-xs"
              >
                +0.5
              </button>
            </div>

            {/* Quick value presets */}
            <div className="flex items-center justify-center gap-1.5 mt-2 flex-wrap">
              {[5.6, 6.2, 7.0, 7.8, 8.5, 9.4].map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setGlucoseValue(v)}
                  className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Instant Diagnosis Feedback Box */}
          <div className={`p-3.5 rounded-2xl border ${statusColor} space-y-1`}>
            <div className="flex items-center gap-1.5 font-bold text-sm">
              {glucoseValue < 3.9 ? (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              ) : glucoseValue > 13.9 ? (
                <AlertCircle className="w-4 h-4 text-purple-700" />
              ) : (
                <Sparkles className="w-4 h-4 text-emerald-600" />
              )}
              <span>智能研判：{statusText}</span>
            </div>
            <p className={`text-xs leading-relaxed ${isLargeFont ? 'text-sm' : 'text-xs'}`}>
              {advice}
            </p>
          </div>

          {/* Optional Note */}
          <div>
            <label className={`block font-medium text-slate-700 mb-1 ${isLargeFont ? 'text-base' : 'text-xs'}`}>
              备注说明（选填：饮食或运动情况）
            </label>
            <input
              type="text"
              placeholder="例如：早餐燕麦粥+鸡蛋，散步20分钟"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Points Bonus Notice */}
          <div className="flex items-center justify-between text-xs text-amber-700 bg-amber-50/80 px-3 py-2 rounded-xl border border-amber-200">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              完成记录将获得课题依从性激励
            </span>
            <span className="font-bold">+10 积分</span>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              确认上传
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
