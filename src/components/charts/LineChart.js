'use client';

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const HEIGHT_CLASSES = {
  240: 'h-60',
  260: 'h-[260px]',
  280: 'h-[280px]',
  300: 'h-[300px]',
  320: 'h-80',
  400: 'h-[400px]',
};

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full px-4">
        <div className="h-4 bg-slate-200 rounded animate-pulse mb-4" />
        <div className="h-32 bg-slate-100 rounded animate-pulse" />
        <div className="flex justify-between mt-4">
          {[...Array(5)].map((_, i) => (
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

export default function LineChart({
  data = [],
  dataKey = 'value',
  xAxisKey = 'name',
  height = 280,
  loading = false,
  showGrid = true,
  showAverage = false,
  averageLabel = 'Avg',
  unit = '',
  color = '#3b82f6',
  trendColors = null, // { positive: '#ef4444', negative: '#22c55e' }
  emptyMessage = 'No data available',
  valueFormatter = (value) => `${value}${unit}`,
  tooltipFormatter = null,
}) {
  const heightClass = HEIGHT_CLASSES[height] || 'h-[280px]';

  if (loading) {
    return (
      <div className={heightClass}>
        <LoadingSkeleton />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={heightClass}>
        <EmptyState message={emptyMessage} />
      </div>
    );
  }

  const values = data.map((d) => d[dataKey]);
  const avgValue = values.reduce((sum, v) => sum + v, 0) / values.length;
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueChange = data.length >= 2 ? data[data.length - 1][dataKey] - data[0][dataKey] : 0;

  const lineColor = trendColors
    ? (valueChange > 0 ? trendColors.positive : trendColors.negative)
    : color;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const formattedValue = tooltipFormatter
        ? tooltipFormatter(payload[0].value, label)
        : valueFormatter(payload[0].value);
      return (
        <div className="bg-white border border-slate-200 rounded-lg py-2 px-3 shadow-lg text-sm">
          <p className="font-semibold text-undp-navy">{label}</p>
          <p className="text-slate-600">{formattedValue}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={heightClass}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 10, right: 40, left: 0, bottom: 20 }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          )}
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={{ stroke: '#cbd5e1' }}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis
            domain={[Math.floor(minValue - 1), Math.ceil(maxValue + 1)]}
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={{ stroke: '#cbd5e1' }}
            axisLine={{ stroke: '#cbd5e1' }}
            tickFormatter={(value) => valueFormatter(value)}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          {showAverage && (
            <ReferenceLine
              y={avgValue}
              stroke="#94a3b8"
              strokeDasharray="5 5"
              label={{
                value: `${averageLabel}: ${valueFormatter(avgValue.toFixed(1))}`,
                position: 'right',
                fill: '#64748b',
                fontSize: 10,
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={lineColor}
            strokeWidth={2}
            dot={{ fill: '#fff', stroke: lineColor, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: lineColor, strokeWidth: 2 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
