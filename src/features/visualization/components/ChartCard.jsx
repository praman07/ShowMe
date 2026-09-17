import React from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Trash2, BarChart2 } from 'lucide-react';
import { removeSavedChart } from '../store/visualizationSlice';
import { transformChartData } from '../utils/chartTransformers';
import { ChartRenderer } from './ChartRenderer';

export const ChartCard = ({ chartConfig, rows, schema }) => {
  const dispatch = useDispatch();

  const { id, title, chartType, xAxis, yAxis, aggregation, bins, primaryColor, colorPalette } = chartConfig;

  // Transform data dynamically based on currently available rows
  const chartData = transformChartData(rows, xAxis, yAxis, aggregation, chartType, bins);

  const displayTitle = title || `${chartType.toUpperCase()} of ${yAxis || 'Count'} by ${xAxis || 'Category'}`;
  const subtitle = chartType === 'histogram'
    ? `Distribution of ${xAxis} (${bins || 10} bins)`
    : chartType === 'scatter'
    ? `Scatter correlation: ${xAxis} vs ${yAxis}`
    : `${chartType.toUpperCase()} · ${aggregation.toUpperCase()} of ${yAxis || 'Count'} by ${xAxis}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-5 rounded-2xl bg-black border border-zinc-800 shadow-xl space-y-4 relative group font-sans"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="min-w-0">
          <h4 className="text-base font-bold text-zinc-100 truncate" title={displayTitle}>
            {displayTitle}
          </h4>
          <p className="text-xs text-zinc-400 font-sans mt-0.5 truncate">{subtitle}</p>
        </div>

        <button
          onClick={() => dispatch(removeSavedChart(id))}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
          title="Remove chart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Chart Canvas */}
      <ChartRenderer
        data={chartData}
        chartType={chartType}
        xAxis={xAxis}
        yAxis={yAxis}
        aggregation={aggregation}
        primaryColor={primaryColor}
        colorPalette={colorPalette}
        height="h-56"
      />
    </motion.div>
  );
};
