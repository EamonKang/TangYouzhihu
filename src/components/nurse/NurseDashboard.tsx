import React, { useState } from 'react';
import { 
  PatientProfile, 
  NurseAlert, 
  BloodGlucoseRecord, 
  RCTCohortMetrics 
} from '../../types';
import { 
  generateFullCohort, 
  mockAlerts as initialMockAlerts, 
  rctMetrics,
  tcmPrescriptions 
} from '../../data/mockData';
import { 
  Activity, 
  AlertTriangle, 
  Users, 
  FileSpreadsheet, 
  BookOpen, 
  CheckCircle2, 
  PhoneCall, 
  Send, 
  Download, 
  Search, 
  ShieldCheck, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Stethoscope,
  Filter,
  Eye,
  Check
} from 'lucide-react';

interface NurseDashboardProps {
  patients: PatientProfile[];
  onSelectPatient: (patient: PatientProfile) => void;
  isLargeFont: boolean;
}

export const NurseDashboard: React.FC<NurseDashboardProps> = ({
  patients,
  onSelectPatient,
  isLargeFont,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'alerts' | 'cohort' | 'stats' | 'knowledge'>('overview');
  const [alerts, setAlerts] = useState<NurseAlert[]>(initialMockAlerts);
  const [cohort] = useState<PatientProfile[]>(generateFullCohort());
  const [cohortSearch, setCohortSearch] = useState<string>('');
  const [cohortGroupFilter, setCohortGroupFilter] = useState<'all' | 'experimental' | 'control'>('all');
  const [selectedAlertForFollowup, setSelectedAlertForFollowup] = useState<NurseAlert | null>(null);
  const [followupNote, setFollowupNote] = useState<string>('');
  const [selectedPatientForDetail, setSelectedPatientForDetail] = useState<PatientProfile | null>(null);

  // Handle resolving an alert
  const handleResolveAlert = (alertId: string, note?: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'resolved',
              handlerNote: note || '已进行常规电话随访并给出医嘱指导。',
            }
          : a
      )
    );
    setSelectedAlertForFollowup(null);
    setFollowupNote('');
  };

  // Export full RCT cohort to CSV
  const handleExportCSV = () => {
    const headers = [
      '脱敏UUID',
      '姓名',
      '性别',
      '年龄',
      '分组',
      '随访周数',
      '基线HbA1c(%)',
      '当前HbA1c(%)',
      'HbA1c降幅(%)',
      '监测依从率(%)',
      '非空腹漏测率(%)',
      '连续打卡天数',
      '责任医生',
      '责任护士',
      '知情同意签署'
    ];

    const rows = cohort.map((p) => [
      p.uuid,
      p.name,
      p.gender,
      p.age,
      p.group === 'experimental' ? '实验组(AI组)' : '对照组(常规组)',
      p.weekInStudy,
      p.baselineHbA1c,
      p.currentHbA1c || '--',
      p.currentHbA1c ? (p.baselineHbA1c - p.currentHbA1c).toFixed(1) : '--',
      `${p.complianceRate}%`,
      `${p.nonFastingMissRate}%`,
      p.continuousDays,
      p.primaryDoctor,
      p.primaryNurse,
      p.signedConsent ? '已签署' : '未签署'
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `奉贤中医内分泌_糖友智护_RCT科研队列脱敏数据_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter cohort list
  const filteredCohort = cohort.filter((p) => {
    const matchGroup = cohortGroupFilter === 'all' || p.group === cohortGroupFilter;
    const matchSearch = p.name.includes(cohortSearch) || p.uuid.toLowerCase().includes(cohortSearch.toLowerCase());
    return matchGroup && matchSearch;
  });

  const pendingAlerts = alerts.filter((a) => a.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-4">
      {/* Top Console Navigation Bar */}
      <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'overview'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>科室总览看板</span>
          </button>

          <button
            onClick={() => setActiveSubTab('alerts')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 relative ${
              activeSubTab === 'alerts'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>重点患者预警</span>
            {pendingAlerts.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingAlerts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('cohort')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'cohort'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>RCT临床队列(100例)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('stats')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'stats'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>科研统计与导出</span>
          </button>

          <button
            onClick={() => setActiveSubTab('knowledge')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'knowledge'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>奉贤中医特色知识库</span>
          </button>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>导出科研数据 (CSV)</span>
        </button>
      </div>

      {/* SUB-TAB 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-4">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-400 font-medium">RCT入组总人数</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-slate-800">100</span>
                <span className="text-xs text-slate-400">例</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
                <span>实验组(AI)：50例</span>
                <span>对照组：50例</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-400 font-medium">实验组平均依从率</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-emerald-600">86.8%</span>
                <span className="text-xs text-emerald-500 font-bold">达标</span>
              </div>
              <div className="mt-2 text-[11px] text-emerald-700 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 对照组仅 49.3% (+37.5%)
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-400 font-medium">非空腹漏测率改善</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-teal-600">15.2%</span>
                <span className="text-xs text-slate-400">降至</span>
              </div>
              <div className="mt-2 text-[11px] text-teal-700 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" /> 对照组高达 53.6% (-38.4%)
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-400 font-medium">待处置预警工单</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-amber-600">{pendingAlerts.length}</span>
                <span className="text-xs text-slate-400">件</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                低血糖处置率 100%
              </div>
            </div>
          </div>

          {/* Department RCT Research Team Banner */}
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-3xl p-5 shadow-sm border border-teal-700/30">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-teal-800/60 pb-3">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-teal-300" />
                  上海市奉贤区中医医院 · 内分泌科课题研究团队架构
                </h3>
                <p className="text-xs text-teal-200/80 mt-0.5">
                  《AI 虚拟护士在糖尿病护理中突破传统模式的创新实践与患者血糖监测依从性提升研究》
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                10人核心多学科团队 (MDT)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-teal-300 font-bold block">课题负责人</span>
                <span className="text-slate-100 font-medium text-sm">揭梦惠</span>
                <span className="text-[10px] text-teal-200/60 block">主管护师 (内分泌科)</span>
              </div>

              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-teal-300 font-bold block">医疗指导</span>
                <span className="text-slate-100 font-medium text-sm">谢玉华</span>
                <span className="text-[10px] text-teal-200/60 block">副主任医师 (内分泌科)</span>
              </div>

              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-teal-300 font-bold block">护理指导</span>
                <span className="text-slate-100 font-medium text-sm">陈丽丽 / 方英</span>
                <span className="text-[10px] text-teal-200/60 block">护士长 / 护理部主任</span>
              </div>

              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-teal-300 font-bold block">数据统计分析</span>
                <span className="text-slate-100 font-medium text-sm">陈茉</span>
                <span className="text-[10px] text-teal-200/60 block">医师</span>
              </div>

              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-teal-300 font-bold block">信息技术支持</span>
                <span className="text-slate-100 font-medium text-sm">姚云</span>
                <span className="text-[10px] text-teal-200/60 block">高级工程师</span>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-teal-200/70">
              临床病例收集组：余华丹、殷智、刘怡、孙佳（护师） · 全员实行AB角应急协同机制
            </div>
          </div>

          {/* Quick Pending Alerts Section */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-800">
                  当前重点高危患者告警 ({pendingAlerts.length}条待处理)
                </h3>
              </div>
              <button
                onClick={() => setActiveSubTab('alerts')}
                className="text-xs text-teal-700 hover:underline flex items-center gap-1 font-semibold"
              >
                查看全部工单 <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingAlerts.map((a) => (
                <div
                  key={a.id}
                  className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/50 flex flex-wrap items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-800">
                        {a.patientName} ({a.patientUuid})
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-200 text-amber-900">
                        {a.type === 'continuous_missed' ? '连续漏测' : a.type === 'severe_low' ? '严重低血糖' : '显著高血糖'}
                      </span>
                      <span className="text-[10px] text-slate-400">{a.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{a.details}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAlertForFollowup(a)}
                      className="px-3 py-1.5 rounded-xl bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 transition flex items-center gap-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>电话回访登记</span>
                    </button>
                    <button
                      onClick={() => handleResolveAlert(a.id)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-medium text-xs hover:bg-slate-50 transition"
                    >
                      直接归档
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ALERT CENTER */}
      {activeSubTab === 'alerts' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-800">
                患者风险分层与告警干预中心
              </h3>
              <p className="text-xs text-slate-400">
                自动监测严重低血糖 (&lt;3.9)、显著高血糖 (&gt;13.9)、连续未测关怀及心理倦怠预警
              </p>
            </div>
            <span className="text-xs text-slate-500">
              共 {alerts.length} 条记录
            </span>
          </div>

          {/* Alert List */}
          <div className="space-y-3">
            {alerts.map((a) => (
              <div
                key={a.id}
                className={`p-4 rounded-2xl border transition ${
                  a.status === 'pending'
                    ? 'bg-amber-50/60 border-amber-200 shadow-xs'
                    : 'bg-slate-50/80 border-slate-200 text-slate-500'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800">
                      {a.patientName}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      {a.patientUuid}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        a.severity === 'critical'
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {a.severity === 'critical' ? '🔴 紧急' : '🟡 高风险'}
                    </span>
                    <span className="text-xs text-slate-400">{a.timestamp}</span>
                  </div>

                  <div>
                    {a.status === 'resolved' ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 已完成干预
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedAlertForFollowup(a)}
                          className="px-3 py-1.5 rounded-xl bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 transition flex items-center gap-1"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>随访干预</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                  {a.details}
                </p>

                {a.handlerNote && (
                  <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs text-emerald-800 bg-emerald-50/50 p-2 rounded-xl">
                    <span className="font-bold">护士处理记录：</span>
                    {a.handlerNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: RCT COHORT (100 CASES) */}
      {activeSubTab === 'cohort' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-800">
                100例 RCT 临床试验队列名录
              </h3>
              <p className="text-xs text-slate-400">
                随机对照试验设计：实验组 (AI虚拟护士干预组 50例) vs 对照组 (常规护理组 50例)
              </p>
            </div>

            {/* Filter and Search */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="搜索姓名或UUID..."
                  value={cohortSearch}
                  onChange={(e) => setCohortSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <select
                value={cohortGroupFilter}
                onChange={(e) => setCohortGroupFilter(e.target.value as any)}
                className="text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-600 focus:outline-none"
              >
                <option value="all">全部分组 (100例)</option>
                <option value="experimental">实验组 (50例)</option>
                <option value="control">对照组 (50例)</option>
              </select>
            </div>
          </div>

          {/* Cohort Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">脱敏编号</th>
                  <th className="py-2.5 px-3">姓名</th>
                  <th className="py-2.5 px-3">年龄/性别</th>
                  <th className="py-2.5 px-3">分组</th>
                  <th className="py-2.5 px-3">随访周数</th>
                  <th className="py-2.5 px-3">基线HbA1c</th>
                  <th className="py-2.5 px-3">当前HbA1c</th>
                  <th className="py-2.5 px-3">依从率</th>
                  <th className="py-2.5 px-3">漏测率</th>
                  <th className="py-2.5 px-3">责任医生</th>
                  <th className="py-2.5 px-3">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCohort.slice(0, 20).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-900">
                      {p.uuid}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {p.name}
                    </td>
                    <td className="py-2.5 px-3">
                      {p.age}岁 / {p.gender}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.group === 'experimental'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {p.group === 'experimental' ? '实验组(AI)' : '常规对照'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">第 {p.weekInStudy} 周</td>
                    <td className="py-2.5 px-3 font-medium">{p.baselineHbA1c}%</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">
                      {p.currentHbA1c || '--'}%
                    </td>
                    <td className="py-2.5 px-3 font-bold">
                      {p.complianceRate}%
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {p.nonFastingMissRate}%
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {p.primaryDoctor.split(' ')[0]}
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => {
                          onSelectPatient(p);
                          setSelectedPatientForDetail(p);
                        }}
                        className="text-teal-600 font-semibold hover:underline flex items-center gap-0.5"
                      >
                        <Eye className="w-3.5 h-3.5" /> 切换查看
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-slate-400 text-center py-2">
            展示前 20 条记录，共 {filteredCohort.length} 条。点击右上角“导出科研数据”可下载完整100例CSV报表。
          </div>
        </div>
      )}

      {/* SUB-TAB 4: RESEARCH STATS & EVALUATION */}
      {activeSubTab === 'stats' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-800">
                12周干预终点科研统计分析 (n=100)
              </h3>
              <p className="text-xs text-slate-400">
                依据奉贤区科委课题考核指标与结题要求自动统计
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              导出完整原始数据
            </button>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-left">研究考核指标</th>
                  <th className="py-3 px-4 text-center">对照组 (常规护理 n=50)</th>
                  <th className="py-3 px-4 text-center">实验组 (糖友智护AI组 n=50)</th>
                  <th className="py-3 px-4 text-center">组间差异 (p值)</th>
                  <th className="py-3 px-4 text-center">考核达标研判</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-bold">平均监测依从率 (%)</td>
                  <td className="py-3 px-4 text-center">49.3 ± 8.2%</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600">86.8 ± 6.4%</td>
                  <td className="py-3 px-4 text-center font-mono">p &lt; 0.001</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      ✓ 超额达成
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">非空腹血糖漏测率 (%)</td>
                  <td className="py-3 px-4 text-center text-amber-600">53.6 ± 7.9%</td>
                  <td className="py-3 px-4 text-center font-bold text-teal-600">15.2 ± 3.8%</td>
                  <td className="py-3 px-4 text-center font-mono">p &lt; 0.001</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      ✓ 显著下降 (-38.4%)
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">基线 HbA1c 均值 (%)</td>
                  <td className="py-3 px-4 text-center">8.62 ± 0.91%</td>
                  <td className="py-3 px-4 text-center">8.66 ± 0.88%</td>
                  <td className="py-3 px-4 text-center font-mono">p = 0.82 (均衡)</td>
                  <td className="py-3 px-4 text-center text-slate-400">基线可比</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">12周末 HbA1c 均值 (%)</td>
                  <td className="py-3 px-4 text-center">8.18 ± 0.74% (-0.44%)</td>
                  <td className="py-3 px-4 text-center font-black text-emerald-600">7.21 ± 0.58% (-1.45%)</td>
                  <td className="py-3 px-4 text-center font-mono">p &lt; 0.01</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      ✓ 降糖疗效优
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">每周监测 ≥5 次达标比例</td>
                  <td className="py-3 px-4 text-center">44.0% (22/50)</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600">88.0% (44/50)</td>
                  <td className="py-3 px-4 text-center font-mono">p &lt; 0.001</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      ✓ 翻倍提升
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">AI虚拟护士沟通易懂与满意度</td>
                  <td className="py-3 px-4 text-center text-slate-400">不适用</td>
                  <td className="py-3 px-4 text-center font-bold text-teal-700">94.6% 满意率</td>
                  <td className="py-3 px-4 text-center">--</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                      ✓ 高接受度
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: KNOWLEDGE BASE */}
      {activeSubTab === 'knowledge' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-800">
              奉贤中医特色内分泌辨证知识库
            </h3>
            <p className="text-xs text-slate-400">
              由谢玉华（副主任医师）与揭梦惠（主管护师）审核录入，赋能“糖糖护士”智能体
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {tcmPrescriptions.map((t) => (
              <div
                key={t.id}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2 hover:border-teal-300 transition"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-sm">{t.title}</h4>
                  <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md font-medium">
                    {t.teaOrDiet}
                  </span>
                </div>

                <p className="text-amber-800 font-medium">
                  <strong>适宜分型：</strong>{t.syndrome}
                </p>

                <div className="bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-semibold block mb-1">配方组成：</span>
                  <div className="flex flex-wrap gap-1">
                    {t.ingredients.map((ing, i) => (
                      <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-semibold block mb-1">推荐调护穴位：</span>
                  <p className="text-slate-600 text-[11px]">{t.acupoints.join('、')}</p>
                </div>

                <p className="text-red-700/90 text-[11px] bg-red-50/60 p-2 rounded-xl">
                  <strong>注意规范：</strong>{t.cautions}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Follow-up Note Modal */}
      {selectedAlertForFollowup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-base text-slate-800">
              电话随访登记 · {selectedAlertForFollowup.patientName} ({selectedAlertForFollowup.patientUuid})
            </h3>
            <p className="text-xs text-slate-500">
              触发原因：{selectedAlertForFollowup.details}
            </p>

            <textarea
              rows={4}
              placeholder="记录医护随访情况（例如：已电话指导患者立即补充碳水，告知运动前加餐注意事项，患者目前状态良好...）"
              value={followupNote}
              onChange={(e) => setFollowupNote(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedAlertForFollowup(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                取消
              </button>
              <button
                onClick={() => handleResolveAlert(selectedAlertForFollowup.id, followupNote)}
                className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> 保存并关闭告警
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
