import React from 'react';
import { PatientProfile } from '../types';
import { 
  Smartphone, 
  Stethoscope, 
  FileText, 
  UserCheck, 
  Volume2, 
  VolumeX, 
  Type, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  activeView: 'patient' | 'nurse' | 'requirements';
  setActiveView: (view: 'patient' | 'nurse' | 'requirements') => void;
  patients: PatientProfile[];
  currentPatient: PatientProfile;
  setCurrentPatient: (patient: PatientProfile) => void;
  isLargeFont: boolean;
  setIsLargeFont: (large: boolean) => void;
  isAudioEnabled: boolean;
  setIsAudioEnabled: (enabled: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  patients,
  currentPatient,
  setCurrentPatient,
  isLargeFont,
  setIsLargeFont,
  isAudioEnabled,
  setIsAudioEnabled,
}) => {
  return (
    <header className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 text-white shadow-md sticky top-0 z-50">
      {/* Top hospital & research banner */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 border-b border-emerald-700/40 flex flex-wrap items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            奉贤区科委科技发展基金课题
          </span>
          <span className="hidden md:inline text-emerald-200/80">|</span>
          <span className="font-medium text-emerald-100 hidden sm:inline">
            上海市奉贤区中医医院 · 内分泌科联合研发
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-200/90 text-xs hidden lg:inline">
            课题编号：2026-FX-KW-320
          </span>
          <span className="bg-amber-400/20 text-amber-200 border border-amber-400/30 px-2 py-0.5 rounded text-[11px]">
            AI虚拟护士 1.0 (糖友智护 / 糖愈智能体)
          </span>
        </div>
      </div>

      {/* Main navigation and controls */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo and title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-200 text-emerald-950 flex items-center justify-center font-bold text-lg shadow-sm">
            糖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                糖友智护
                <span className="text-emerald-300 text-xs font-normal bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  糖愈智能体
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-emerald-200/70 hidden sm:block">
              AI虚拟护士驱动的糖尿病全病程依从性提升与科研随访平台
            </p>
          </div>
        </div>

        {/* View Switcher Buttons */}
        <div className="flex items-center bg-emerald-950/60 p-1 rounded-xl border border-emerald-600/30">
          <button
            onClick={() => setActiveView('patient')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeView === 'patient'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>患者小程序端</span>
          </button>

          <button
            onClick={() => setActiveView('nurse')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeView === 'nurse'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>医护科研后台</span>
          </button>

          <button
            onClick={() => setActiveView('requirements')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeView === 'requirements'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/40'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">需求梳理与课题方案</span>
            <span className="sm:hidden">方案全景</span>
          </button>
        </div>

        {/* Patient Switcher & Accessibility Toggles */}
        <div className="flex items-center gap-2">
          {/* Patient Selector */}
          <div className="flex items-center gap-1.5 bg-emerald-900/60 px-2 py-1 rounded-lg border border-emerald-600/30 text-xs">
            <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span className="text-emerald-200/80 hidden md:inline">模拟患者:</span>
            <select
              value={currentPatient.id}
              onChange={(e) => {
                const found = patients.find((p) => p.id === e.target.value);
                if (found) setCurrentPatient(found);
              }}
              className="bg-transparent text-emerald-100 font-medium focus:outline-none cursor-pointer"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id} className="text-slate-900">
                  {p.name} ({p.age}岁 · {p.group === 'experimental' ? '实验组' : '对照组'})
                </option>
              ))}
            </select>
          </div>

          {/* Large Font Mode (Elderly Accessibility) */}
          <button
            onClick={() => setIsLargeFont(!isLargeFont)}
            title={isLargeFont ? '切换为标准字号' : '适老化大字关怀模式'}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 border transition-all ${
              isLargeFont
                ? 'bg-amber-500 text-white border-amber-400 font-bold'
                : 'bg-emerald-900/40 text-emerald-200 border-emerald-700/50 hover:bg-emerald-800/60'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isLargeFont ? '大字版' : '标准字'}</span>
          </button>

          {/* Voice Prompt Toggle */}
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            title={isAudioEnabled ? '已开启语音播报' : '开启语音播报'}
            className={`p-1.5 rounded-lg text-xs flex items-center border transition-all ${
              isAudioEnabled
                ? 'bg-teal-500 text-white border-teal-400'
                : 'bg-emerald-900/40 text-emerald-200 border-emerald-700/50 hover:bg-emerald-800/60'
            }`}
          >
            {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
