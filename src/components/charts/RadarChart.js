'use client';

import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { CHART_COLORS, COMPARISON_COLORS, COLORS } from '@/constants/chartColors';

const HEIGHT_CLASSES = {
  240: 'h-60',
  260: 'h-[260px]',
  280: 'h-[280px]',
  300: 'h-[300px]',
  320: 'h-80',
  400: 'h-[400px]',
  500: 'h-[500px]',
};

// Chart styling constants
const GRID_STROKE = COLORS.grey204; // #e5e7eb equivalent
const TICK_COLOR = COLORS.grey102; // #64748b equivalent
const TICK_LINE_COLOR = COLORS.grey204; // #cbd5e1 equivalent
const RADIUS_TICK_COLOR = COLORS.grey153; // #94a3b8 equivalent

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
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
      <p className="text-sm italic">{message}</p>
    </div>
  );
}

/**
 * RadarChart - A modular radar/spider chart component
 * 
 * @param {Array} data - Array of data objects, each with keys for each axis
 * @param {Array|string} dataKeys - Array of data keys to plot (one series per key) OR single key for percentage mode
 * @param {Array} axisKeys - Array of axis labels (e.g., ['Spring', 'Summer', 'Autumn', 'Winter'])
 * @param {number} height - Chart height in pixels
 * @param {boolean} loading - Loading state
 * @param {string} emptyMessage - Message to show when no data
 * @param {Array|string} color - Color array for series (defaults to CHART_COLORS) OR single color for percentage mode
 * @param {boolean} showLegend - Show legend
 * @param {number} domainMax - Maximum value for the domain (auto-calculated if not provided)
 * @param {number} domainMin - Minimum value for the domain (default: 0)
 * @param {Function} valueFormatter - Function to format values in tooltip
 * @param {boolean} isPercentage - If true, uses 0-100 domain with percentage formatting
 */
export default function RadarChart({
  data = [],
  dataKeys = [],
  axisKeys = [],
  height = 400,
  loading = false,
  emptyMessage = 'No data available',
  color = CHART_COLORS,
  showLegend = true,
  domainMax = null,
  domainMin = 0,
  valueFormatter = null,
  isPercentage = false,
}) {
  const heightClass = HEIGHT_CLASSES[height] || 'h-[400px]';

  if (loading) {
    return (
      <div className={heightClass}>
        <LoadingSkeleton />
      </div>
    );
  }

  // Normalize dataKeys to array format
  const dataKeysArray = Array.isArray(dataKeys) ? dataKeys : (dataKeys ? [dataKeys] : []);
  const singleDataKey = isPercentage && !Array.isArray(dataKeys) ? dataKeys : (dataKeysArray[0] || 'value');
  
  // In percentage mode, allow multiple dataKeys (for multiple countries)
  const hasValidDataKeys = isPercentage 
    ? (dataKeysArray.length > 0 || singleDataKey) 
    : dataKeysArray.length > 0;
  
  if (!data || data.length === 0 || !axisKeys.length || !hasValidDataKeys) {
    return (
      <div className={heightClass}>
        <EmptyState message={emptyMessage} />
      </div>
    );
  }

  // For percentage mode, always use 0-100 domain
  // For regular mode, calculate domain if not provided
  const calculatedMax = isPercentage 
    ? 100 
    : (domainMax !== null 
      ? domainMax 
      : (() => {
          const allValues = data.flatMap((item) =>
            dataKeysArray.map((key) => item[key] || 0)
          );
          const actualMax = allValues.length > 0 ? Math.max(...allValues) : 1;
          return actualMax > 50 
            ? Math.ceil(actualMax * 1.05)
            : actualMax > 10
              ? Math.ceil(actualMax * 1.1)
              : Math.ceil(actualMax * 1.2);
        })());

  // Get color(s) - support both single color and array
  const colorsArray = Array.isArray(color) ? color : (color ? [color] : CHART_COLORS);
  // In percentage mode with multiple dataKeys, use color array; otherwise use single color
  const useMultipleColors = isPercentage && Array.isArray(dataKeys) && dataKeys.length > 1;
  
  // Default value formatter
  const defaultFormatter = isPercentage 
    ? (value) => `${value.toFixed(1)}%`
    : (value) => value;
  const formatter = valueFormatter || defaultFormatter;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 rounded-lg py-2 px-3 shadow-lg text-sm">
          {payload.map((entry, index) => (
            <div key={index} className="mb-1 last:mb-0">
              <p
                className="font-semibold"
                style={{ color: entry.color }}
              >
                {entry.name || entry.payload?.axis}: {formatter(entry.value)}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={heightClass}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data} margin={{ top: 30, right: 20, bottom: showLegend ? 0 : 20, left: 20 }}>
          <PolarGrid 
            stroke={GRID_STROKE} 
            strokeWidth={1}
          />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fontSize: 12, fill: TICK_COLOR }}
            tickLine={{ stroke: TICK_LINE_COLOR }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[domainMin, calculatedMax]}
            tick={{ fontSize: 0, fill: RADIUS_TICK_COLOR }}
            tickCount={isPercentage ? 5 : 5}
            tickFormatter={isPercentage ? (value) => `${value}%` : formatter}
          />
          <Tooltip content={<CustomTooltip />} />
          {isPercentage && !useMultipleColors ? (
            // Single series in percentage mode
            <Radar
              name="value"
              dataKey={singleDataKey}
              stroke={colorsArray[0]}
              fill={colorsArray[0]}
              fillOpacity={0.3}
              strokeWidth={3}
              dot={false}
            />
          ) : (
            // Multiple series (either percentage mode with multiple countries, or regular mode)
            dataKeysArray.map((key, index) => (
              <Radar
                key={key}
                name={key}
                dataKey={key}
                stroke={colorsArray[index % colorsArray.length]}
                fill={colorsArray[index % colorsArray.length]}
                fillOpacity={0.3}
                strokeWidth={isPercentage ? 3 : 2}
                dot={false}
              />
            ))
          )}
          {showLegend && (useMultipleColors || !isPercentage) && (
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
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
