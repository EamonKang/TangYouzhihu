import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Calendar, 
  ArrowRight, 
  Clock, 
  UserCheck, 
  Award, 
  Stethoscope,
  ChevronRight
} from 'lucide-react';

export const RequirementsOverview: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-emerald-500/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            奉贤区科委科技发展基金项目 · 需求梳理与产品定义方案
          </span>
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full text-xs">
            系统版本 V1.0 MVP
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
          “糖友智护” AI虚拟护士与糖尿病科研随访管理系统
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-4xl">
          依托上海市奉贤区中医医院内分泌科临床科研力量，将原“糖愈”智能体升级为具备
          <strong>【温暖拟人化共情 + 循证指南与中医辨证知识库 + 场景感知闭环】</strong>
          的 AI 虚拟糖尿病护士（糖糖护士），重构“提醒 - 记录 - 研判 - 激励 - 医护协同”的全病程慢病护理范式。
        </p>
      </div>

      {/* 1. Core Pain Points & Solutions */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
        <h2 className="font-bold text-base text-slate-800 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">1</span>
          临床痛点与系统核心突破重构
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="bg-red-50/60 p-4 rounded-2xl border border-red-100 text-xs space-y-2">
            <span className="font-bold text-red-900 flex items-center gap-1.5 text-sm">
              ❌ 传统糖尿病临床护理痛点
            </span>
            <ul className="space-y-1.5 text-slate-700 leading-relaxed">
              <li>• <strong>被动式管理</strong>：以月度门诊为主，离院后24小时血糖处于“黑盒状态”；</li>
              <li>• <strong>依从性低下</strong>：非空腹血糖漏测率超50%，患者频繁遗忘测糖与服药；</li>
              <li>• <strong>心理管理倦怠</strong>：常年扎针饮食受限，糖友普遍存在焦虑与抵触情绪；</li>
              <li>• <strong>医护负荷过重</strong>：重复性宣教占用大量时间，科研RCT试验随访追踪耗时费力。</li>
            </ul>
          </div>

          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 text-xs space-y-2">
            <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-sm">
              ✅ “糖友智护” 系统解决方案
            </span>
            <ul className="space-y-1.5 text-emerald-950 leading-relaxed">
              <li>• <strong>AI虚拟护士贴身主动关怀</strong>：微信小程序零安装，晨起/餐后智能提醒与漏测追随；</li>
              <li>• <strong>极简记录与双15预警</strong>：一键输入即刻研判，&lt;3.9 mmol/L自动激活急救双15流程；</li>
              <li>• <strong>情绪识别与正念减压</strong>：识别负面词汇，推送5分钟腹式呼吸与共情疏导；</li>
              <li>• <strong>医护RCT科研闭环后台</strong>：100例队列分层、红黄绿高危预警、一键导出科研数据CSV。</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. System Architecture Blueprint */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <h2 className="font-bold text-base text-slate-800 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">2</span>
          “糖友智护” 系统总体技术架构 (端 + 智能体中台 + 临床科研后台)
        </h2>

        <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
          {/* Layer 1: Client Frontends */}
          <div className="bg-emerald-50/80 p-3 border-b border-emerald-200">
            <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
              <span>📱 用户交互层（患者微信小程序端）</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
              <span className="bg-white p-2 rounded-xl border border-emerald-200 text-emerald-900 font-medium">极简血糖打卡与预警</span>
              <span className="bg-white p-2 rounded-xl border border-emerald-200 text-emerald-900 font-medium">糖糖AI护士对话</span>
              <span className="bg-white p-2 rounded-xl border border-emerald-200 text-emerald-900 font-medium">食物GI/GL速查字典</span>
              <span className="bg-white p-2 rounded-xl border border-emerald-200 text-emerald-900 font-medium">5分钟正念呼吸放松</span>
              <span className="bg-white p-2 rounded-xl border border-emerald-200 text-emerald-900 font-medium">依从性积分商城</span>
            </div>
          </div>

          {/* Layer 2: Agent Core */}
          <div className="bg-teal-50/80 p-3 border-b border-teal-200">
            <div className="font-bold text-teal-900 mb-1 flex items-center gap-1.5">
              <span>🤖 “糖愈” AI 虚拟护士智能体核心引擎</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
              <span className="bg-white p-2 rounded-xl border border-teal-200 text-teal-900 font-medium">Gemini 3.8 / 临床语义引擎</span>
              <span className="bg-white p-2 rounded-xl border border-teal-200 text-teal-900 font-medium">内分泌指南循证知识库</span>
              <span className="bg-white p-2 rounded-xl border border-teal-200 text-teal-900 font-medium">奉贤中医辨证施护模块</span>
              <span className="bg-white p-2 rounded-xl border border-teal-200 text-teal-900 font-medium">情绪词库与心理疏导</span>
            </div>
          </div>

          {/* Layer 3: Clinical & Research Console */}
          <div className="bg-slate-50 p-3 border-b border-slate-200">
            <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <span>💻 医护端与课题管理后台（内分泌科随访与RCT系统）</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
              <span className="bg-white p-2 rounded-xl border border-slate-200 text-slate-800 font-medium">重点高危患者告警中心</span>
              <span className="bg-white p-2 rounded-xl border border-slate-200 text-slate-800 font-medium">100例RCT对照队列管理</span>
              <span className="bg-white p-2 rounded-xl border border-slate-200 text-slate-800 font-medium">统计报表与一键CSV导出</span>
              <span className="bg-white p-2 rounded-xl border border-slate-200 text-slate-800 font-medium">医嘱下发与随访登记</span>
            </div>
          </div>

          {/* Layer 4: Security & Compliance */}
          <div className="bg-amber-50/60 p-3 text-[11px] text-amber-900 flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              数据安全与伦理合规底座：
            </span>
            <span>唯一脱敏标识号 (UUID) 隔离存储</span>
            <span>敏感数据 RSA 非对称加密</span>
            <span>HTTPS/TLS 端到端加密传输</span>
            <span>奉贤伦理审查批准编号：2026-FX-ETH-019</span>
          </div>
        </div>
      </div>

      {/* 3. Product Roadmap */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
        <h2 className="font-bold text-base text-slate-800 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">3</span>
          课题三年全周期实施路径与里程碑
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              2026年 (当前阶段)
            </span>
            <h4 className="font-bold text-sm text-slate-800">1.0 MVP构建与小规模试点</h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              • 完成患者/医护需求调研与产品PRD设计；<br />
              • “糖友智护 1.0”上线，验证“提醒-记录-激励”闭环；<br />
              • 启动50例小规模试点，验证数据传输与依从性改善。
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-bold text-[10px]">
              2027年 (扩展阶段)
            </span>
            <h4 className="font-bold text-sm text-slate-800">2.0功能深化与大规模RCT</h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              • 拓展至100例RCT随机对照试验；<br />
              • 引入并发症风险预警（视网膜病变/糖尿病足筛查）；<br />
              • 医院-社区-家庭三师共管协同机制上线。
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
              2028年 (结题与推广)
            </span>
            <h4 className="font-bold text-sm text-slate-800">成果产出与课题验收</h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              • 全周期数据统计分析与效应量验证；<br />
              • 统计源核心期刊学术论文发表；<br />
              • 迎接奉贤区科委课题专家组结题答辩与全区推广。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
