import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

const COLOR_PALETTE = [
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#14b8a6', // Teal
  '#a855f7', // Violet
];

const formatAxisValue = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const abs = Math.abs(num);
  if (abs >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (abs >= 10_000) return `${(num / 1_000).toFixed(1)}k`;
  if (abs >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return Number.isInteger(num) ? String(num) : num.toFixed(2);
};

const CustomTooltip = ({ active, payload, label, chartType, primaryColor, colorPalette }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const valColor = 
      data.color || 
      data.fill || 
      data.payload?.fill || 
      data.payload?.color || 
      data.stroke || 
      primaryColor || 
      '#6366f1';
    
    const displayLabel = label || data.name || data.payload?.name || 'Category';
    
    return (
      <div 
        className="p-3 bg-zinc-950/95 border rounded-xl shadow-2xl backdrop-blur-md text-xs font-sans space-y-1 z-50 transition-colors"
        style={{ borderColor: `${valColor}40` }}
      >
        <p className="font-semibold text-[11px] truncate max-w-[200px]" style={{ color: valColor }}>
          {displayLabel}
        </p>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: valColor }} />
          <span className="text-zinc-100 font-bold text-sm">
            {chartType === 'scatter' 
              ? `X: ${formatAxisValue(data.payload?.x)}, Y: ${formatAxisValue(data.payload?.y)}` 
              : chartType === 'histogram'
              ? `Count: ${data.value.toLocaleString()}`
              : `Value: ${formatAxisValue(data.value)} (${data.value.toLocaleString()})`}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const getAdaptiveYDomain = (data, chartType) => {
  if (!data || data.length === 0) return [0, 'auto'];
  if (chartType === 'line' || chartType === 'area' || chartType === 'scatter') {
    const vals = data
      .map((d) => (chartType === 'scatter' ? d.y : d.value))
      .filter((v) => typeof v === 'number' && !isNaN(v));
    if (vals.length === 0) return ['auto', 'auto'];

    const min = Math.min(...vals);
    const max = Math.max(...vals);

    if (min === max) {
      const pad = Math.abs(min) * 0.1 || 5;
      return [Math.floor(min - pad), Math.ceil(max + pad)];
    }

    const range = max - min;
    const padding = range * 0.1;
    const low = min - padding < 0 && min >= 0 ? 0 : Math.floor(min - padding);
    const high = Math.ceil(max + padding);

    return [low, high];
  }
  return [0, 'auto'];
};

export const ChartRenderer = ({ 
  data, 
  chartType, 
  xAxis, 
  yAxis, 
  aggregation,
  primaryColor = '#6366f1',
  colorPalette = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#14b8a6', '#a855f7'],
  height = 'h-60'
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`${height} flex items-center justify-center text-xs text-zinc-500 font-sans`}>
        No valid chart data available for selected configuration
      </div>
    );
  }

  const gradientId = `colorArea_${(primaryColor || '6366f1').replace('#', '')}`;
  const adaptiveYDomain = getAdaptiveYDomain(data, chartType);

  return (
    <div className={`w-full ${height}`}>
      <ResponsiveContainer width="100%" height="100%">
        {(() => {
          if (chartType === 'bar') {
            return (
              <BarChart data={data} margin={{ top: 12, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.6} />
                <XAxis 
                  dataKey="name" 
                  stroke="#3f3f46" 
                  tick={{ fill: '#f4f4f5', fontSize: 11, fontWeight: 500 }}
                  tickMargin={12}
                  dy={4}
                  tickLine={false} 
                  tickFormatter={(val) => String(val).length > 14 ? `${String(val).slice(0, 12)}...` : val}
                />
                <YAxis 
                  stroke="#3f3f46" 
                  tick={{ fill: '#f4f4f5', fontSize: 11, fontWeight: 500 }}
                  tickMargin={12}
                  dx={-4}
                  tickLine={false} 
                  tickFormatter={formatAxisValue} 
                />
                <Tooltip content={<CustomTooltip chartType="bar" primaryColor={primaryColor} />} />
                <Bar 
                  dataKey="value" 
                  fill={primaryColor} 
                  radius={[6, 6, 0, 0]} 
                  isAnimationActive={true}
                  animationDuration={750}
                  animationEasing="ease-out"
                />
              </BarChart>
            );
          }

          if (chartType === 'line') {
            return (
              <LineChart data={data} margin={{ top: 12, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.6} />
                <XAxis 
                  dataKey="name" 
                  stroke="#3f3f46" 
                  tick={{ fill: '#f4f4f5', fontSize: 11, fontWeight: 500 }}
                  tickMargin={12}
                  dy={4}
                  tickLine={false}
                  tickFormatter={(val) => String(val).length > 14 ? `${String(val).slice(0, 12)}...` : val}
                />
                <YAxis 
                  stroke="#3f3f46" 
                  tick={{ fill: '#f4f4f5', fontSize: 11, fontWeight: 500 }}
                  tickMargin={12}
                  dx={-4}
                  tickLine={false} 
                  tickFormatter={formatAxisValue}
                  domain={adaptiveYDomain}
                />
                <Tooltip content={<CustomTooltip chartType="line" primaryColor={primaryColor} />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={primaryColor} 
                  strokeWidth={3} 
                  dot={{ fill: primaryColor, r: 4, strokeWidth: 1.5, stroke: '#000' }} 
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                  isAnimationActive={true}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              </LineChart>
            );
          }

          if (chartType === 'area') {
            return (
              <AreaChart data={data} margin={{ top: 12, right: 20, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.45} />
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.6} />
                <XAxis 
                  dataKey="name" 
                  stroke="#3f3f46" 
                  tick={{ fill: '#f4f4f5', fontSize: 11, fontWeight: 500 }}
                  tickMargin={12}
                  dy={4}
                  tickLine={false}
                  tickFormatter={(val) => String(val).length > 14 ? `${String(val).slice(0, 12)}...` : val}
                />
                <YAxis 
                  stroke="#3f3f46" 
                  tick={{ fill: '#f4f4f5', fontSize: 11, fontWeight: 500 }}
                  tickMargin={12}
                  dx={-4}
                  tickLine={false}
                  tickFormatter={formatAxisValue}
                  domain={adaptiveYDomain}
                />
                <Tooltip content={<CustomTooltip chartType="area" primaryColor={primaryColor} />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={primaryColor} 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill={`url(#${gradientId})`} 
                  isAnimationActive={true}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              </AreaChart>
            );
          }

          if (chartType === 'scatter') {
            return (
              <ScatterChart margin={{ top: 12, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.6} />
                <XAxis 
                  dataKey="x" 
                  name={xAxis} 
                  stroke="#3f3f46" 
                  tick={{ fill: '#f4f4f5', fontSize: 11, fontWeight: 500 }}
                  tickMargin={12}
                  dy={4}
                  tickLine={false} 
                  tickFormatter={formatAxisValue} 
                />
                <YAxis 
                  dataKey="y" 
                  name={yAxis} 
                  stroke="#3f3f46" 
                  tick={{ fill: '#f4f4f5', fontSize: 11, fontWeight: 500 }}
                  tickMargin={12}
                  dx={-4}
                  tickLine={false} 
                  tickFormatter={formatAxisValue} 
                  domain={adaptiveYDomain} 
                />
                <Tooltip content={<CustomTooltip chartType="scatter" primaryColor={primaryColor} />} />
                <Scatter 
                  data={data} 
                  fill={primaryColor} 
                  isAnimationActive={true}
                  animationDuration={700}
                  animationEasing="ease-out"
                />
              </ScatterChart>
            );
          }

          if (chartType === 'pie') {
            const palette = Array.isArray(colorPalette) && colorPalette.length > 0 ? colorPalette : [primaryColor];
            const pieData = data.map((entry, index) => {
              const sliceColor = palette[index % palette.length];
              return {
                ...entry,
                fill: sliceColor,
                color: sliceColor,
              };
            });

            return (
              <PieChart margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <Tooltip content={<CustomTooltip chartType="pie" primaryColor={primaryColor} colorPalette={palette} />} />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle" 
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', color: '#e4e4e7', fontWeight: 500, paddingTop: '6px' }} 
                />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={85}
                  innerRadius={45}
                  paddingAngle={3}
                  isAnimationActive={true}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="#000" strokeWidth={1} />
                  ))}
                </Pie>
              </PieChart>
            );
          }

          if (chartType === 'histogram') {
            return (
              <BarChart data={data} margin={{ top: 12, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.6} />
                <XAxis 
                  dataKey="binRange" 
                  stroke="#3f3f46" 
                  tick={{ fill: '#f4f4f5', fontSize: 10, fontWeight: 500 }}
                  tickMargin={12}
                  dy={4}
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#3f3f46" 
                  tick={{ fill: '#f4f4f5', fontSize: 11, fontWeight: 500 }}
                  tickMargin={12}
                  dx={-4}
                  tickLine={false} 
                  tickFormatter={formatAxisValue} 
                />
                <Tooltip content={<CustomTooltip chartType="histogram" primaryColor={primaryColor} />} />
                <Bar 
                  dataKey="count" 
                  fill={primaryColor} 
                  radius={[4, 4, 0, 0]} 
                  isAnimationActive={true}
                  animationDuration={700}
                  animationEasing="ease-out"
                />
              </BarChart>
            );
          }

          return null;
        })()}
      </ResponsiveContainer>
    </div>
  );
};
