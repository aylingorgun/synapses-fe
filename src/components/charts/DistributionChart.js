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
import styles from '@/styles/charts.module.css';

// Default color palette for disaster types (matching filterOptions)
const DEFAULT_COLORS = {
  // Storms
  'Windstorm': '#4CAF50',
  'Snowstorm': '#90CAF9',
  'Tornado': '#8BC34A',
  'Cyclone': '#3F51B5',
  // Temperature
  'Heatwave': '#FF9800',
  'Coldwave': '#00BCD4',
  'Freeze': '#B3E5FC',
  // Fires
  'Forest Fires': '#FF5722',
  'Urban Fires': '#E64A19',
  'Wild Fires': '#BF360C',
  // Floods
  'Riverine Flood': '#1E88E5',
  'Flash Flood': '#1565C0',
  'Coastal Flood': '#0D47A1',
  'Urban Flood': '#42A5F5',
  // Others
  'Drought': '#FFC107',
  'Earthquake': '#9C27B0',
  'Rockfall': '#795548',
  'Tsunami': '#00ACC1',
  'Mudflow': '#D32F2F',
  'Soil Erosion': '#8D6E63',
};

/**
 * Reusable stacked bar chart for disaster distribution
 * @param {Array} data - Chart data with country/region as key and disaster types as values
 * @param {Array} dataKeys - Array of disaster type keys to display as stacked bars
 * @param {string} xAxisKey - Key for X-axis labels (default: 'name')
 * @param {Object} colors - Custom color mapping for disaster types
 * @param {number} height - Chart height (default: 400)
 * @param {boolean} showLegend - Whether to show legend (default: true)
 * @param {boolean} showGrid - Whether to show grid (default: true)
 */
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
      <div className={styles.emptyChart}>
        <p>No data available</p>
      </div>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
          <p className={styles.tooltipTotal}>Total: {total}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartWrapper} style={{ height }}>
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
              formatter={(value) => <span style={{ fontSize: '0.8rem', color: '#374151' }}>{value}</span>}
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
