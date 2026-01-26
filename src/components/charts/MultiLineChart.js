'use client';

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CHART_COLORS } from '@/constants/chartColors';

const HEIGHT_CLASSES = {
  300: 'h-[300px]',
  350: 'h-[350px]',
  400: 'h-[400px]',
  450: 'h-[450px]',
  500: 'h-[500px]',
};

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full px-4">
        <div className="h-4 bg-slate-200 rounded animate-pulse mb-4" />
        <div className="h-48 bg-slate-100 rounded animate-pulse" />
        <div className="flex justify-between mt-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-3 w-8 bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-400">
      <svg
        className="w-12 h-12 mb-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
        />
      </svg>
      <p className="text-sm italic">{message}</p>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label, lines }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg py-3 px-4 shadow-xl max-w-xs">
        <p className="font-semibold text-undp-navy mb-2 border-b border-slate-100 pb-2 text-sm">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry, idx) => {
            const lineConfig = lines.find(l => l.dataKey === entry.dataKey);
            const unit = lineConfig?.unit || '';
            const displayValue = typeof entry.value === 'number' 
              ? entry.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
              : entry.value;
            return (
              <div key={idx} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-slate-600 text-sm">{lineConfig?.name || entry.dataKey}</span>
                </div>
                <span className="font-medium text-slate-800 text-sm">
                  {displayValue}{unit}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

/**
 * Multi-line chart with support for dual Y-axes
 * 
 * @param {Object} props
 * @param {Array} props.data - Chart data array
 * @param {Array} props.lines - Line configurations: [{ dataKey, name, unit, yAxisId, color }]
 * @param {string} props.xAxisKey - Key for X-axis values
 * @param {number} props.height - Chart height (300, 350, 400, 450, 500)
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.showGrid - Show grid lines
 * @param {string} props.emptyMessage - Message when no data
 * @param {boolean} props.dualAxis - Enable dual Y-axis
 * @param {string} props.leftAxisLabel - Label for left Y-axis
 * @param {string} props.rightAxisLabel - Label for right Y-axis
 */
export default function MultiLineChart({
  data = [],
  lines = [],
  xAxisKey = 'year',
  height = 400,
  loading = false,
  showGrid = true,
  emptyMessage = 'Select variables to visualize correlations',
  dualAxis = false,
  leftAxisLabel = '',
  rightAxisLabel = '',
}) {
  const heightClass = HEIGHT_CLASSES[height] || 'h-[400px]';

  if (loading) {
    return (
      <div className={heightClass}>
        <LoadingSkeleton />
      </div>
    );
  }

  if (!data || data.length === 0 || lines.length === 0) {
    return (
      <div className={heightClass}>
        <EmptyState message={emptyMessage} />
      </div>
    );
  }

  // Calculate domains for each axis - never go below 0
  const getAxisDomain = (axisId) => {
    const relevantLines = lines.filter(l => l.yAxisId === axisId);
    if (relevantLines.length === 0) return [0, 'auto'];

    const allValues = relevantLines.flatMap(line => 
      data.map(d => d[line.dataKey]).filter(v => v !== null && v !== undefined)
    );
    
    if (allValues.length === 0) return [0, 'auto'];
    
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const padding = (max - min) * 0.1;
    
    // Always start at 0 or the minimum value if positive
    const domainMin = Math.max(0, Math.floor(min - padding));
    const domainMax = Math.ceil(max + padding);
    
    return [domainMin, domainMax];
  };

  const leftDomain = getAxisDomain('left');
  const rightDomain = dualAxis ? getAxisDomain('right') : [0, 'auto'];

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4 px-4">
        {payload.map((entry, index) => {
          const lineConfig = lines.find(l => l.dataKey === entry.dataKey);
          return (
            <div 
              key={`legend-${index}`}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200"
            >
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-slate-700">
                {lineConfig?.name || entry.value}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={heightClass}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 20, right: dualAxis ? 60 : 30, left: 20, bottom: 30 }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          )}
          
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 13, fill: '#475569' }}
            tickLine={{ stroke: '#cbd5e1' }}
            axisLine={{ stroke: '#cbd5e1' }}
            padding={{ left: 10, right: 10 }}
          />
          
          <YAxis
            yAxisId="left"
            domain={leftDomain}
            tick={{ fontSize: 13, fill: '#475569' }}
            tickLine={{ stroke: '#cbd5e1' }}
            axisLine={{ stroke: '#cbd5e1' }}
            width={60}
            label={leftAxisLabel ? {
              value: leftAxisLabel,
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: '#475569', fontSize: 13, fontWeight: 500 }
            } : undefined}
          />
          
          {dualAxis && (
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={rightDomain}
              tick={{ fontSize: 13, fill: '#475569' }}
              tickLine={{ stroke: '#cbd5e1' }}
              axisLine={{ stroke: '#cbd5e1' }}
              width={60}
              label={rightAxisLabel ? {
                value: rightAxisLabel,
                angle: 90,
                position: 'insideRight',
                style: { textAnchor: 'middle', fill: '#475569', fontSize: 13, fontWeight: 500 }
              } : undefined}
            />
          )}
          
          <Tooltip content={<CustomTooltip lines={lines} />} />
          <Legend content={renderLegend} />
          
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              yAxisId={line.yAxisId || 'left'}
              stroke={line.color || CHART_COLORS[index % CHART_COLORS.length]}
              strokeWidth={2.5}
              dot={{ 
                fill: '#fff', 
                stroke: line.color || CHART_COLORS[index % CHART_COLORS.length], 
                strokeWidth: 2, 
                r: 4 
              }}
              activeDot={{ 
                r: 6, 
                stroke: line.color || CHART_COLORS[index % CHART_COLORS.length], 
                strokeWidth: 2 
              }}
              connectNulls
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
