import React from 'react';
import { PatientProfile, BloodGlucoseRecord, TimeSlot } from '../../types';
import { 
  Heart, 
  PlusCircle, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Pill, 
  Flame, 
  ShieldAlert, 
  ChevronRight, 
  Apple, 
  MessageCircle, 
  Wind,
  Award
} from 'lucide-react';

interface HomeTabProps {
  patient: PatientProfile;
  records: BloodGlucoseRecord[];
  onOpenRecordModal: () => void;
  onOpenRelaxationModal: () => void;
  onSwitchTab: (tab: 'chat' | 'trend' | 'food' | 'profile') => void;
  onToggleMedication: (medId: string) => void;
  isLargeFont: boolean;
  isAudioEnabled: boolean;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  patient,
  records,
  onOpenRecordModal,
  onOpenRelaxationModal,
  onSwitchTab,
  onToggleMedication,
  isLargeFont,
  isAudioEnabled,
}) => {
  // Find today's records
  const todayStr = '2026-09-26'; // Match mock data today
  const todayRecords = records.filter((r) => r.timestamp.startsWith(todayStr));
  const latestRecord = records[0] || null;

  // Key 5 daily slots
  const keySlots: { slot: TimeSlot; label: string; timeHint: string }[] = [
    { slot: 'fasting', label: '晨起空腹', timeHint: '07:00' },
    { slot: 'post_breakfast', label: '早餐后2h', timeHint: '09:30' },
    { slot: 'post_lunch', label: '午餐后2h', timeHint: '13:30' },
    { slot: 'post_dinner', label: '晚餐后2h', timeHint: '20:00' },
    { slot: 'bedtime', label: '睡前', timeHint: '22:00' },
  ];

  return (
    <div className="space-y-4 pb-16">
      {/* AI Nurse Greeting Card */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-4 text-white shadow-lg shadow-emerald-900/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl shadow-inner">
              👩‍⚕️
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-bold px-1 rounded-full border border-white">
              AI
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className={`font-bold flex items-center gap-1.5 ${isLargeFont ? 'text-xl' : 'text-base'}`}>
                {patient.name} 糖友，早安！
              </h2>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] text-emerald-100 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
                已连测 {patient.continuousDays} 天
              </span>
            </div>

            <p className={`text-emerald-100/90 mt-1 leading-snug ${isLargeFont ? 'text-sm' : 'text-xs'}`}>
              我是您的虚拟糖尿病护士<span className="font-semibold text-white">糖糖</span>。
              今天感觉怎么样？按时监测是控制血糖的基石，糖糖一直在您身边守护您！
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => onSwitchTab('chat')}
                className="bg-white text-emerald-800 font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs hover:bg-emerald-50 active:scale-95 transition flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                问糖糖护士
              </button>
              <button
                onClick={onOpenRelaxationModal}
                className="bg-emerald-900/40 border border-white/25 text-white font-medium text-xs px-3 py-1.5 rounded-xl hover:bg-emerald-900/60 active:scale-95 transition flex items-center gap-1"
              >
                <Wind className="w-3.5 h-3.5 text-teal-200" />
                深呼吸放松
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Blood Glucose Status */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold text-sm">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>最新血糖记录</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {latestRecord ? latestRecord.timestamp : '暂无数据'}
          </span>
        </div>

        {latestRecord ? (
          <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-3 border border-slate-100">
            <div>
              <span className="text-xs text-slate-500 font-medium">
                {keySlots.find((s) => s.slot === latestRecord.timeSlot)?.label || '随机测量'}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`font-black tracking-tight text-slate-800 ${isLargeFont ? 'text-4xl' : 'text-3xl'}`}>
                  {latestRecord.value}
                </span>
                <span className="text-xs text-slate-400">mmol/L</span>
              </div>
            </div>

            <div className="text-right">
              {latestRecord.value < 3.9 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                  <ShieldAlert className="w-3.5 h-3.5" /> 严重低血糖
                </span>
              ) : latestRecord.value > 10.0 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                  偏高
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 理想达标
                </span>
              )}
              <p className="text-[10px] text-slate-400 mt-1 max-w-[130px] truncate">
                {latestRecord.note || '生活规律，继续保持'}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-slate-400 text-xs">
            今天尚未记录血糖，快去测一次吧
          </div>
        )}

        <button
          onClick={onOpenRecordModal}
          className="w-full mt-3 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-600 flex items-center justify-center gap-2 active:scale-98 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>一键录入血糖 (支持快捷录入)</span>
        </button>
      </div>

      {/* Today 5-Points Task Grid */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>今日监测时段打卡</span>
          </div>
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
            已完成 {todayRecords.length} / 5
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {keySlots.map((item) => {
            const recorded = todayRecords.find((r) => r.timeSlot === item.slot);
            return (
              <button
                key={item.slot}
                onClick={onOpenRecordModal}
                className={`py-2 px-1 rounded-2xl border text-center transition flex flex-col items-center justify-between min-h-[72px] ${
                  recorded
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-emerald-200 hover:bg-emerald-50/30'
                }`}
              >
                <span className="text-[11px] font-bold text-slate-700 leading-tight">
                  {item.label}
                </span>

                {recorded ? (
                  <div className="my-0.5">
                    <span className="text-xs font-black text-emerald-700">
                      {recorded.value}
                    </span>
                    <span className="block text-[8px] text-emerald-600">已测</span>
                  </div>
                ) : (
                  <div className="my-0.5">
                    <PlusCircle className="w-3.5 h-3.5 mx-auto text-slate-300" />
                    <span className="block text-[8px] text-slate-400">待测</span>
                  </div>
                )}

                <span className="text-[9px] text-slate-400">
                  {item.timeHint}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Medication Reminder & Compliance */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
            <Pill className="w-4 h-4 text-teal-600" />
            <span>今日用药计划</span>
          </div>
          <span className="text-[11px] text-slate-400">
            责任医生：{patient.primaryDoctor.split(' ')[0]}
          </span>
        </div>

        <div className="space-y-2">
          {patient.medications.map((med) => (
            <div
              key={med.id}
              onClick={() => onToggleMedication(med.id)}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                med.takenToday
                  ? 'bg-teal-50/50 border-teal-200 text-slate-700'
                  : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-teal-50/30'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                    med.takenToday ? 'bg-teal-500 text-white' : 'border border-slate-300 text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-800">
                    {med.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {med.dose} · {med.timing}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-mono font-medium text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded-full">
                  {med.reminderTime}
                </span>
                <span className={`block text-[10px] mt-0.5 ${med.takenToday ? 'text-teal-600 font-medium' : 'text-slate-400'}`}>
                  {med.takenToday ? '已服' : '点击打卡'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fengxian TCM Hospital Daily Wisdom */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-3xl p-4 border border-amber-200/60 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>奉贤中医内分泌特色调护指南</span>
          </div>
          <span className="text-[10px] text-amber-700 bg-amber-200/50 px-2 py-0.5 rounded-full font-medium">
            {patient.tcmSyndrome || '辨证施护'}
          </span>
        </div>

        <p className={`text-amber-900/80 leading-relaxed ${isLargeFont ? 'text-sm' : 'text-xs'}`}>
          🌿 <strong>今日调理锦囊</strong>：秋燥伤津，糖友易发口干多饮。奉贤中医建议可沸水冲泡<strong>玉竹麦冬养阴生津茶</strong>；晚间泡脚水温切勿超过38℃，浸泡10分钟即可，预防足部烫伤。
        </p>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => onSwitchTab('food')}
          className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs hover:border-emerald-200 transition text-left flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-lg">
            <Apple className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-800">食物GI字典</div>
            <div className="text-[10px] text-slate-400">苹果/西瓜等升糖速查</div>
          </div>
        </button>

        <button
          onClick={() => onSwitchTab('trend')}
          className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs hover:border-emerald-200 transition text-left flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-800">达标率 (TIR)</div>
            <div className="text-[10px] text-slate-400">7天走势与依从报表</div>
          </div>
        </button>
      </div>
    </div>
  );
};
