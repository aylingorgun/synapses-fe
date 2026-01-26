'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0468B1', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full border-8 border-slate-200 animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-white" />
      </div>
    </div>
  );
}

function EmptyState({ message = 'No data available' }) {
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
          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
        />
      </svg>
      <p className="text-sm italic">{message}</p>
    </div>
  );
}

export default function DonutChart({
  data = [],
  dataKey = 'value',
  nameKey = 'name',
  colors = COLORS,
  height = 280,
  innerRadius = 50,
  outerRadius = 80,
  loading = false,
  showLegend = true,
  showPercentage = true,
  emptyMessage = 'No data available',
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

  const total = data.reduce((sum, entry) => sum + (entry[dataKey] || 0), 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = ((item.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white border border-slate-200 rounded-lg py-2 px-3 shadow-lg text-sm">
          <p className="font-semibold text-undp-navy">{item.name}</p>
          <p className="text-slate-600">
            {showPercentage ? `${percentage}%` : item.value}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={heightClass}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={showPercentage ? renderCustomizedLabel : undefined}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={10}
              formatter={(value) => (
                <span className="text-xs text-slate-700">{value}</span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
