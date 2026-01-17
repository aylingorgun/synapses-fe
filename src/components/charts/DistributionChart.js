'use client';

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

const DEFAULT_COLORS = {
  'Windstorm': '#4CAF50',
  'Snowstorm': '#90CAF9',
  'Tornado': '#8BC34A',
  'Cyclone': '#3F51B5',
  'Heatwave': '#FF9800',
  'Coldwave': '#00BCD4',
  'Freeze': '#B3E5FC',
  'Forest Fires': '#FF5722',
  'Urban Fires': '#E64A19',
  'Wild Fires': '#BF360C',
  'Riverine Flood': '#1E88E5',
  'Flash Flood': '#1565C0',
  'Coastal Flood': '#0D47A1',
  'Urban Flood': '#42A5F5',
  'Drought': '#FFC107',
  'Earthquake': '#9C27B0',
  'Rockfall': '#795548',
  'Tsunami': '#00ACC1',
  'Mudflow': '#D32F2F',
  'Soil Erosion': '#8D6E63',
};

export default function DistributionChart({
  data = [],
  dataKeys = [],
  xAxisKey = 'name',
  colors = DEFAULT_COLORS,
  height = 400,
  showLegend = true,
  showGrid = true,
}) {
  if (!data.length || !dataKeys.length) {
    return (
      <div className="flex items-center justify-center h-[300px] text-slate-500 italic">
        <p>No data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
      return (
        <div className="bg-white border border-slate-200 rounded-lg py-3 px-4 shadow-lg text-sm">
          <p className="font-semibold text-[#1e3a5f] mb-2 pb-2 border-b border-slate-200">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
          <p className="font-semibold text-[#1e3a5f] mt-2 pt-2 border-t border-slate-200">Total: {total}</p>
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
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
