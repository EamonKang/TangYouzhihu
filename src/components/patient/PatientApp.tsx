import React, { useState } from 'react';
import { PatientProfile, BloodGlucoseRecord } from '../../types';
import { HomeTab } from './HomeTab';
import { NurseChatTab } from './NurseChatTab';
import { DataTrendTab } from './DataTrendTab';
import { FoodExerciseTab } from './FoodExerciseTab';
import { ProfileTab } from './ProfileTab';
import { RecordModal } from './RecordModal';
import { RelaxationModal } from './RelaxationModal';
import { 
  Home, 
  Bot, 
  TrendingUp, 
  Apple, 
  User, 
  Plus, 
  Smartphone, 
  Monitor,
  MoreHorizontal,
  Circle
} from 'lucide-react';

interface PatientAppProps {
  currentPatient: PatientProfile;
  records: BloodGlucoseRecord[];
  onAddRecord: (record: Omit<BloodGlucoseRecord, 'id' | 'patientId'>) => void;
  onAddPoints: (points: number, reason: string) => void;
  onDeductPoints: (points: number, reason: string) => boolean;
  onToggleMedication: (medId: string) => void;
  isLargeFont: boolean;
  isAudioEnabled: boolean;
}

export const PatientApp: React.FC<PatientAppProps> = ({
  currentPatient,
  records,
  onAddRecord,
  onAddPoints,
  onDeductPoints,
  onToggleMedication,
  isLargeFont,
  isAudioEnabled,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'trend' | 'food' | 'profile'>('home');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState<boolean>(false);
  const [isRelaxationModalOpen, setIsRelaxationModalOpen] = useState<boolean>(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  return (
    <div className="py-4 px-2 sm:px-4 flex flex-col items-center min-h-[calc(100vh-120px)] bg-slate-100/60">
      {/* Frame Mode Switcher */}
      <div className="mb-3 flex items-center justify-between w-full max-w-md px-2 text-xs text-slate-500">
        <span className="flex items-center gap-1 font-medium text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          微信小程序端容器模拟 (糖友智护 V1.0)
        </span>

        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          className="flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-600 hover:text-emerald-700 shadow-2xs transition"
        >
          {isPhoneFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          <span>{isPhoneFrame ? '切换宽屏' : '手机视窗'}</span>
        </button>
      </div>

      {/* Main Container: Phone Mockup Frame or Wide Card */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[420px] bg-slate-50 rounded-[44px] shadow-2xl border-[10px] border-slate-800 overflow-hidden relative'
            : 'max-w-2xl bg-slate-50 rounded-3xl shadow-lg border border-slate-200 overflow-hidden relative'
        }`}
      >
        {/* WeChat Mini-Program Header / Status Bar */}
        <div className="bg-white px-5 pt-3 pb-2.5 border-b border-slate-100 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          {/* Left: Mini-Program Title */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-slate-800 text-sm tracking-tight">
              糖友智护
            </span>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded font-medium">
              奉贤中医
            </span>
          </div>

          {/* Right: WeChat Capsule Buttons (··· ⭘) */}
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-full text-slate-600">
            <button title="小程序更多操作" className="hover:text-slate-900 transition">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <span className="w-[1px] h-3 bg-slate-300"></span>
            <button title="关闭小程序" className="hover:text-slate-900 transition">
              <Circle className="w-3 h-3 text-slate-500 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3.5 sm:p-4 overflow-y-auto max-h-[720px] scrollbar-none">
          {activeTab === 'home' && (
            <HomeTab
              patient={currentPatient}
              records={records}
              onOpenRecordModal={() => setIsRecordModalOpen(true)}
              onOpenRelaxationModal={() => setIsRelaxationModalOpen(true)}
              onSwitchTab={setActiveTab}
              onToggleMedication={onToggleMedication}
              isLargeFont={isLargeFont}
              isAudioEnabled={isAudioEnabled}
            />
          )}

          {activeTab === 'chat' && (
            <NurseChatTab
              patient={currentPatient}
              onOpenRelaxationModal={() => setIsRelaxationModalOpen(true)}
              isLargeFont={isLargeFont}
              isAudioEnabled={isAudioEnabled}
            />
          )}

          {activeTab === 'trend' && (
            <DataTrendTab
              records={records}
              isLargeFont={isLargeFont}
            />
          )}

          {activeTab === 'food' && (
            <FoodExerciseTab
              isLargeFont={isLargeFont}
              onAddPoints={onAddPoints}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileTab
              patient={currentPatient}
              isLargeFont={isLargeFont}
              onDeductPoints={onDeductPoints}
            />
          )}
        </div>

        {/* Bottom Floating Record Button (Only on home and trend tabs) */}
        {(activeTab === 'home' || activeTab === 'trend') && (
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="absolute right-5 bottom-20 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-700/30 flex items-center justify-center hover:scale-105 active:scale-95 transition"
            title="快捷测糖打卡"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}

        {/* WeChat Bottom Navigation Bar */}
        <div className="bg-white/95 backdrop-blur-md border-t border-slate-100 px-2 py-2 flex items-center justify-around sticky bottom-0 z-30 shadow-xs">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-0.5 transition ${
              activeTab === 'home' ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">首页</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center gap-0.5 relative transition ${
              activeTab === 'chat' ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Bot className="w-5 h-5" />
            <span className="text-[10px]">糖愈护士</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400"></span>
          </button>

          <button
            onClick={() => setActiveTab('trend')}
            className={`flex flex-col items-center gap-0.5 transition ${
              activeTab === 'trend' ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px]">血糖走势</span>
          </button>

          <button
            onClick={() => setActiveTab('food')}
            className={`flex flex-col items-center gap-0.5 transition ${
              activeTab === 'food' ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Apple className="w-5 h-5" />
            <span className="text-[10px]">食疗运动</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-0.5 transition ${
              activeTab === 'profile' ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">我的档案</span>
          </button>
        </div>

        {/* iPhone Bottom Home Bar Indicator (in phone frame mode) */}
        {isPhoneFrame && (
          <div className="bg-white py-1 flex justify-center">
            <div className="w-28 h-1 bg-slate-300 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Record Blood Glucose Modal */}
      <RecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSave={onAddRecord}
        isLargeFont={isLargeFont}
        isAudioEnabled={isAudioEnabled}
      />

      {/* Mindfulness Relaxation Modal */}
      <RelaxationModal
        isOpen={isRelaxationModalOpen}
        onClose={() => setIsRelaxationModalOpen(false)}
        isLargeFont={isLargeFont}
      />
    </div>
  );
};
