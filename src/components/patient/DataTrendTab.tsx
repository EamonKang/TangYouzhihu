import React, { useState } from 'react';
import { BloodGlucoseRecord, TimeSlot } from '../../types';
import { 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter
} from 'lucide-react';

interface DataTrendTabProps {
  records: BloodGlucoseRecord[];
  isLargeFont: boolean;
}

export const DataTrendTab: React.FC<DataTrendTabProps> = ({
  records,
  isLargeFont,
}) => {
  const [range, setRange] = useState<'7' | '14' | '30'>('7');
  const [slotFilter, setSlotFilter] = useState<string>('all');
  const [activeTooltip, setActiveTooltip] = useState<BloodGlucoseRecord | null>(null);

  // Filter records by range (using record count as proxy)
  const rangeCount = range === '7' ? 14 : range === '14' ? 26 : 40;
  const filteredByRange = records.slice(0, rangeCount);

  const filteredRecords = slotFilter === 'all'
    ? filteredByRange
    : filteredByRange.filter((r) => r.timeSlot === slotFilter);

  // Calculate TIR (Time in Range: 4.4 - 10.0 mmol/L)
  const total = filteredByRange.length || 1;
  const inRangeCount = filteredByRange.filter((r) => r.value >= 4.4 && r.value <= 10.0).length;
  const lowCount = filteredByRange.filter((r) => r.value < 3.9).length;
  const highCount = filteredByRange.filter((r) => r.value > 10.0).length;

  const tirPercent = Math.round((inRangeCount / total) * 100);
  const lowPercent = Math.round((lowCount / total) * 100);
  const highPercent = Math.round((highCount / total) * 100);

  // Fasting avg vs Postprandial avg
  const fastingRecords = filteredByRange.filter((r) => r.timeSlot === 'fasting');
  const postRecords = filteredByRange.filter((r) => r.timeSlot.startsWith('post_'));

  const fastingAvg = fastingRecords.length
    ? (fastingRecords.reduce((acc, cur) => acc + cur.value, 0) / fastingRecords.length).toFixed(1)
    : '--';

  const postAvg = postRecords.length
    ? (postRecords.reduce((acc, cur) => acc + cur.value, 0) / postRecords.length).toFixed(1)
    : '--';

  // SVG Chart Dimensions
  const chartWidth = 320;
  const chartHeight = 160;
  const paddingX = 24;
  const paddingY = 20;

  const displayList = [...filteredByRange].reverse().slice(-10); // last 10 points
  const minVal = 2.0;
  const maxVal = 14.0;

  const getY = (val: number) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    return chartHeight - paddingY - ((clamped - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
  };

  const getX = (idx: number, count: number) => {
    if (count <= 1) return chartWidth / 2;
    return paddingX + (idx / (count - 1)) * (chartWidth - paddingX * 2);
  };

  // Generate SVG path string
  const points = displayList.map((d, idx) => ({
    x: getX(idx, displayList.length),
    y: getY(d.value),
    record: d,
  }));

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Green target zone boundaries
  const yTargetUpper = getY(10.0);
  const yTargetLower = getY(4.4);

  return (
    <div className="space-y-4 pb-16">
      {/* Top Range Tabs */}
      <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-100 shadow-xs">
        <span className="text-xs font-bold text-slate-700 px-2 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          趋势周期
        </span>
        <div className="flex gap-1">
          {(['7', '14', '30'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                range === r
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              近{r}天
            </button>
          ))}
        </div>
      </div>

      {/* TIR (Time in Range) Card */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-bold text-slate-800">
              目标范围内时间比例 (TIR)
            </span>
            <p className="text-[10px] text-slate-400">
              国际权威标准：TIR &gt; 70% 可显著降低心肾眼并发症
            </p>
          </div>
          <span className="text-xl font-black text-emerald-600">
            {tirPercent}%
          </span>
        </div>

        {/* Progress Bar Stack */}
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex my-2 border border-slate-200">
          <div
            style={{ width: `${lowPercent}%` }}
            className="bg-red-400 h-full transition-all duration-500"
            title={`偏低: ${lowPercent}%`}
          ></div>
          <div
            style={{ width: `${tirPercent}%` }}
            className="bg-emerald-500 h-full transition-all duration-500"
            title={`达标: ${tirPercent}%`}
          ></div>
          <div
            style={{ width: `${highPercent}%` }}
            className="bg-amber-400 h-full transition-all duration-500"
            title={`偏高: ${highPercent}%`}
          ></div>
        </div>

        <div className="grid grid-cols-3 text-center text-[11px] pt-1">
          <div className="text-red-600 font-medium">
            偏低 (&lt;3.9): {lowPercent}%
          </div>
          <div className="text-emerald-700 font-bold">
            达标 (4.4-10.0): {tirPercent}%
          </div>
          <div className="text-amber-600 font-medium">
            偏高 (&gt;10.0): {highPercent}%
          </div>
        </div>
      </div>

      {/* SVG Interactive Trend Chart */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-slate-800">
            血糖动态波动曲线 (近10次)
          </span>
          <span className="text-[10px] text-slate-400">
            绿区为 4.4~10.0 达标带
          </span>
        </div>

        <div className="relative flex justify-center py-2 overflow-x-auto">
          <svg width={chartWidth} height={chartHeight} className="overflow-visible">
            {/* Green target zone */}
            <rect
              x={paddingX}
              y={yTargetUpper}
              width={chartWidth - paddingX * 2}
              height={Math.abs(yTargetLower - yTargetUpper)}
              fill="#10b981"
              fillOpacity="0.1"
              rx="4"
            />

            {/* Upper line 10.0 */}
            <line
              x1={paddingX}
              y1={yTargetUpper}
              x2={chartWidth - paddingX}
              y2={yTargetUpper}
              stroke="#10b981"
              strokeDasharray="3 3"
              strokeOpacity="0.4"
            />
            <text x={chartWidth - paddingX + 2} y={yTargetUpper + 3} fontSize="8" fill="#10b981">
              10.0
            </text>

            {/* Lower line 4.4 */}
            <line
              x1={paddingX}
              y1={yTargetLower}
              x2={chartWidth - paddingX}
              y2={yTargetLower}
              stroke="#10b981"
              strokeDasharray="3 3"
              strokeOpacity="0.4"
            />
            <text x={chartWidth - paddingX + 2} y={yTargetLower + 3} fontSize="8" fill="#10b981">
              4.4
            </text>

            {/* Trend line */}
            {points.length > 1 && (
              <path
                d={pathD}
                fill="none"
                stroke="#0d9488"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data points */}
            {points.map((p, idx) => {
              const val = p.record.value;
              const isLow = val < 3.9;
              const isHigh = val > 10.0;
              const dotColor = isLow ? '#ef4444' : isHigh ? '#f59e0b' : '#10b981';

              return (
                <g key={idx} className="cursor-pointer" onClick={() => setActiveTooltip(p.record)}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4.5"
                    fill={dotColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="hover:scale-125 transition-transform"
                  />
                  <text
                    x={p.x}
                    y={p.y - 7}
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="#334155"
                  >
                    {val}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Point Details Tooltip */}
        {activeTooltip && (
          <div className="bg-emerald-50/80 p-2.5 rounded-2xl border border-emerald-200 text-xs flex items-center justify-between mt-2">
            <div>
              <span className="font-bold text-emerald-950">
                {activeTooltip.timestamp} ({activeTooltip.value} mmol/L)
              </span>
              <p className="text-[11px] text-emerald-800">
                {activeTooltip.note || '未填备注'}
              </p>
            </div>
            <button
              onClick={() => setActiveTooltip(null)}
              className="text-[10px] text-emerald-600 font-semibold underline"
            >
              关闭
            </button>
          </div>
        )}
      </div>

      {/* Statistical Summary Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] text-slate-400 font-medium">平均空腹血糖</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-800">{fastingAvg}</span>
            <span className="text-xs text-slate-400">mmol/L</span>
          </div>
          <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 mt-0.5">
            <ArrowDownRight className="w-3 h-3" /> 理想目标 &lt; 7.0
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] text-slate-400 font-medium">平均餐后血糖</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-800">{postAvg}</span>
            <span className="text-xs text-slate-400">mmol/L</span>
          </div>
          <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 mt-0.5">
            <ArrowDownRight className="w-3 h-3" /> 理想目标 &lt; 10.0
          </span>
        </div>
      </div>

      {/* Historical List */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800">
            明细日志记录 ({filteredRecords.length}条)
          </span>

          <select
            value={slotFilter}
            onChange={(e) => setSlotFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-600 focus:outline-none"
          >
            <option value="all">全部时段</option>
            <option value="fasting">晨起空腹</option>
            <option value="post_breakfast">早餐后2h</option>
            <option value="post_lunch">午餐后2h</option>
            <option value="post_dinner">晚餐后2h</option>
            <option value="bedtime">睡前</option>
          </select>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {filteredRecords.map((r) => (
            <div
              key={r.id}
              className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span>{r.timestamp}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-200/80 text-slate-600">
                    {r.timeSlot === 'fasting' ? '空腹' : r.timeSlot.includes('post') ? '餐后' : '睡前/随机'}
                  </span>
                </div>
                {r.note && (
                  <p className="text-[10px] text-slate-400 mt-0.5">{r.note}</p>
                )}
              </div>

              <div className="text-right">
                <span
                  className={`text-base font-black ${
                    r.value < 3.9
                      ? 'text-red-600'
                      : r.value > 10.0
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {r.value}
                </span>
                <span className="text-[10px] text-slate-400 block">mmol/L</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
