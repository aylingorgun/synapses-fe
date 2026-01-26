'use client';

import { useState, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DISASTER_COLORS } from '@/constants/chartColors';

export default function DistributionChart({
  data = [],
  dataKeys = [],
  xAxisKey = 'name',
  colors = DISASTER_COLORS,
  height = 400,
  showLegend = true,
  showGrid = true,
}) {
  const [hoveredBar, setHoveredBar] = useState(null);

  const handleBarMouseEnter = useCallback((dataKey) => {
    setHoveredBar(dataKey);
  }, []);

  const handleBarMouseLeave = useCallback(() => {
    setHoveredBar(null);
  }, []);

  if (!data.length || !dataKeys.length) {
    return (
      <div className="flex items-center justify-center h-[300px] text-slate-500 italic">
        <p>No data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = hoveredBar 
        ? payload.find(p => p.dataKey === hoveredBar) || payload[0]
        : payload[0];
      
      return (
        <div className="bg-white border border-slate-200 rounded-lg py-2 px-3 shadow-lg text-sm">
          <p className="font-semibold text-undp-navy">{label}</p>
          <p style={{ color: item.color }}>
            {item.name}: {item.value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-md:min-w-[500px]" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />}
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fill: '#64748b' }}
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#64748b' }}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              iconType="square"
              iconSize={12}
              formatter={(value) => <span className="text-xs text-gray-700">{value}</span>}
            />
          )}
          {dataKeys.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="disasters"
              fill={colors[key] || '#8884d8'}
              name={key}
              radius={[3, 3, 0, 0]}
              onMouseEnter={() => handleBarMouseEnter(key)}
              onMouseLeave={handleBarMouseLeave}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
