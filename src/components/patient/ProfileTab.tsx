import React, { useState } from 'react';
import { PatientProfile } from '../../types';
import { 
  User, 
  Award, 
  ShieldCheck, 
  Gift, 
  Sparkles, 
  CheckCircle, 
  ChevronRight, 
  Flame, 
  Lock, 
  FileCheck,
  Stethoscope
} from 'lucide-react';

interface ProfileTabProps {
  patient: PatientProfile;
  isLargeFont: boolean;
  onDeductPoints: (points: number, reason: string) => boolean;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  patient,
  isLargeFont,
  onDeductPoints,
}) => {
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState<string | null>(null);

  const rewards = [
    { id: 'r1', name: '奉贤中医内分泌名医健康讲座资格', cost: 100, desc: '线下参与谢玉华专家讲堂+互动答疑' },
    { id: 'r2', name: '医用超细无痛采血针 (50支装)', cost: 200, desc: '院内药房免费领取，减少扎针刺痛' },
    { id: 'r3', name: '奉贤中医特色低GI养生茶饮包', cost: 300, desc: '玉竹麦冬代茶饮精装体验礼盒' },
    { id: 'r4', name: '内分泌专科专家门诊预约绿色通道', cost: 400, desc: '享受快速面诊与病情全面评估' },
  ];

  const handleRedeem = (r: typeof rewards[0]) => {
    if (patient.points < r.cost) {
      setRedeemSuccessMsg(`积分不足！还需要 ${r.cost - patient.points} 积分`);
      setTimeout(() => setRedeemSuccessMsg(null), 3000);
      return;
    }

    const ok = onDeductPoints(r.cost, `兑换了【${r.name}】`);
    if (ok) {
      setRedeemSuccessMsg(`🎉 成功兑换【${r.name}】！凭脱敏编码可在奉贤中医医院服务台领取。`);
      setTimeout(() => setRedeemSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Patient Research Identity Card */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 text-white rounded-3xl p-5 shadow-lg border border-emerald-500/20 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-200 text-emerald-950 flex items-center justify-center font-bold text-2xl shadow-md">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{patient.name}</h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {patient.gender} · {patient.age}岁
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                {patient.diabetesType} · 病程 {patient.courseYears} 年
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 shadow-xs">
              {patient.group === 'experimental' ? '🧪 课题实验组(AI组)' : '📋 常规对照组'}
            </span>
          </div>
        </div>

        {/* Research UUID & Doctors */}
        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-emerald-300/70 text-[10px] block">科研唯一脱敏标识号</span>
            <span className="font-mono font-bold text-emerald-200">{patient.uuid}</span>
          </div>
          <div>
            <span className="text-emerald-300/70 text-[10px] block">课题随访阶段</span>
            <span className="font-semibold text-emerald-200">
              第 {patient.weekInStudy} 周 / 12周周期
            </span>
          </div>
          <div>
            <span className="text-emerald-300/70 text-[10px] block">责任医生</span>
            <span className="text-slate-200">{patient.primaryDoctor}</span>
          </div>
          <div>
            <span className="text-emerald-300/70 text-[10px] block">责任护士</span>
            <span className="text-slate-200">{patient.primaryNurse}</span>
          </div>
        </div>
      </div>

      {/* Compliance & Honor Metrics */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
            <Award className="w-4 h-4 text-amber-500" />
            <span>依从性与荣誉星级</span>
          </div>
          <span className="text-xs font-bold text-emerald-600">
            达标率 {patient.complianceRate}%
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">连续打卡</span>
            <span className="text-lg font-black text-amber-600 flex items-center justify-center gap-0.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              {patient.continuousDays} 天
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">累计积分</span>
            <span className="text-lg font-black text-emerald-600">
              {patient.points} 分
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">非空腹漏测率</span>
            <span className="text-lg font-black text-teal-600">
              {patient.nonFastingMissRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Points Redemption Store */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
            <Gift className="w-4 h-4 text-emerald-600" />
            <span>课题依从性激励商城</span>
          </div>
          <span className="text-xs font-bold text-slate-500">
            可用积分：<span className="text-emerald-600 font-black">{patient.points}</span>
          </span>
        </div>

        {redeemSuccessMsg && (
          <div className="mb-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-in fade-in">
            {redeemSuccessMsg}
          </div>
        )}

        <div className="space-y-2.5">
          {rewards.map((r) => (
            <div
              key={r.id}
              className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between"
            >
              <div className="flex-1 pr-3">
                <h4 className="font-bold text-xs text-slate-800">{r.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{r.desc}</p>
                <span className="inline-block mt-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                  {r.cost} 积分
                </span>
              </div>

              <button
                onClick={() => handleRedeem(r)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 active:scale-95 transition shadow-xs whitespace-nowrap"
              >
                立即兑换
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Ethics & Data Security */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100 space-y-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <Lock className="w-4 h-4 text-teal-600" />
          <span>科研伦理与数据安全保障</span>
        </div>

        <p className="text-[11px] leading-relaxed text-slate-400">
          本课题经上海市奉贤区中医医院医学伦理委员会审查批准（批件号：2026-FX-ETH-019）。
          所有患者数据均通过<strong>RSA非对称加密</strong>与<strong>唯一识别号（UUID）脱敏存储</strong>，严格保护患者隐私。
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-medium">
          <span className="flex items-center gap-1">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            知情同意书已线上归档
          </span>
          <span className="text-slate-400">签署日期：2026-01-18</span>
        </div>
      </div>
    </div>
  );
};
