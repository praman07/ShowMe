import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  TrendingUp, 
  AreaChart as AreaIcon, 
  ScatterChart as ScatterIcon, 
  PieChart as PieIcon, 
  SlidersHorizontal, 
  Plus, 
  Palette,
  Pipette,
  Filter,
  ListFilter,
  Search,
  RotateCcw
} from 'lucide-react';
import { 
  updateActiveConfig, 
  saveCurrentChart, 
  selectVisualizationState 
} from '../store/visualizationSlice';
import { useDataset } from '@/features/dataset';
import { 
  FilterPanel, 
  setSearchQuery, 
  clearAllFilters, 
  getFilteredAndSortedRows, 
  selectFilterState 
} from '@/features/filters';

const chartTypes = [
  { id: 'bar', name: 'Bar Chart', icon: <BarChart2 className="w-4 h-4" /> },
  { id: 'line', name: 'Line Chart', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'area', name: 'Area Chart', icon: <AreaIcon className="w-4 h-4" /> },
  { id: 'scatter', name: 'Scatter Plot', icon: <ScatterIcon className="w-4 h-4" /> },
  { id: 'pie', name: 'Pie / Donut', icon: <PieIcon className="w-4 h-4" /> },
  { id: 'histogram', name: 'Histogram', icon: <SlidersHorizontal className="w-4 h-4" /> },
];

const PRESET_COLORS = [
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Crimson', hex: '#e11d48' },
];

const PRESET_PALETTES = [
  { id: 'modern', name: 'Modern Indigo', colors: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#14b8a6', '#a855f7'] },
  { id: 'sunset', name: 'Vibrant Sunset', colors: ['#f43f5e', '#fb923c', '#facc15', '#a855f7', '#ec4899', '#e11d48', '#d97706', '#c084fc'] },
  { id: 'ocean', name: 'Ocean Breeze', colors: ['#06b6d4', '#3b82f6', '#6366f1', '#14b8a6', '#0284c7', '#0d9488', '#2563eb', '#38bdf8'] },
  { id: 'forest', name: 'Forest Emerald', colors: ['#10b981', '#059669', '#84cc16', '#14b8a6', '#064e3b', '#22c55e', '#15803d', '#4d7c0f'] },
  { id: 'monochrome', name: 'Monochrome Slate', colors: ['#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa', '#71717a', '#52525b', '#3f3f46', '#27272a'] },
];

export const ChartBuilder = () => {
  const dispatch = useDispatch();
  const { datasetData } = useDataset();
  const { activeConfig } = useSelector(selectVisualizationState);
  const filterState = useSelector(selectFilterState);
  
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  if (!datasetData) return null;

  const { schema, preview, dataset } = datasetData;
  const { searchQuery, columnFilters } = filterState;
  const filteredRows = getFilteredAndSortedRows(preview, schema, filterState);
  const activeFilterCount = Object.keys(columnFilters).length + (searchQuery ? 1 : 0);

  const numericCols = schema.filter((s) => s.type === 'numeric').map((s) => s.name);
  const categoricalCols = schema.filter((s) => s.type === 'categorical' || s.type === 'text' || s.type === 'datetime' || s.type === 'boolean').map((s) => s.name);
  const allCols = schema.map((s) => s.name);

  // Set default axes if not set
  useEffect(() => {
    if (!activeConfig.xAxis && allCols.length > 0) {
      const defaultX = categoricalCols[0] || numericCols[0] || allCols[0];
      dispatch(updateActiveConfig({ field: 'xAxis', value: defaultX }));
    }
    if (!activeConfig.yAxis && numericCols.length > 0) {
      dispatch(updateActiveConfig({ field: 'yAxis', value: numericCols[0] }));
    }
  }, [schema]);

  const handleChartTypeSelect = (typeId) => {
    dispatch(updateActiveConfig({ field: 'chartType', value: typeId }));

    // Intelligent axis adjustments
    if (typeId === 'scatter') {
      if (!numericCols.includes(activeConfig.xAxis) && numericCols.length > 0) {
        dispatch(updateActiveConfig({ field: 'xAxis', value: numericCols[0] }));
      }
      if (!numericCols.includes(activeConfig.yAxis) && numericCols.length > 1) {
        dispatch(updateActiveConfig({ field: 'yAxis', value: numericCols[1] }));
      }
    } else if (typeId === 'histogram') {
      if (!numericCols.includes(activeConfig.xAxis) && numericCols.length > 0) {
        dispatch(updateActiveConfig({ field: 'xAxis', value: numericCols[0] }));
      }
    }
  };

  const handleSave = () => {
    dispatch(saveCurrentChart({ title: activeConfig.title }));
  };

  const isScatter = activeConfig.chartType === 'scatter';
  const isHistogram = activeConfig.chartType === 'histogram';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-black border border-zinc-800 shadow-xl space-y-6 w-full font-sans"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h3 className="text-lg font-bold text-zinc-100 tracking-tight">Visualization Builder</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Customize chart type, parameters, filters, and color palettes</p>
        </div>
      </div>

      {/* Integrated Data Filter Toolbar */}
      <div className="relative z-30 font-sans p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-300" />
            <span className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
              Filter Dataset Scope
            </span>
            <span className="text-[11px] text-zinc-400 font-sans">
              ({filteredRows.length} of {dataset.rows.toLocaleString()} rows selected)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Global Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search dataset rows..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
              />
            </div>

            {/* Filter Drawer Toggle */}
            <button
              type="button"
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeFilterCount > 0 || isFilterPanelOpen
                  ? 'bg-zinc-800 border-zinc-600 text-zinc-100 font-bold'
                  : 'bg-black hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-zinc-200 text-zinc-900 text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={() => dispatch(clearAllFilters())}
                className="p-1.5 text-xs font-medium rounded-xl bg-black hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Floating Filter Drawer Overlay */}
        <FilterPanel isOpen={isFilterPanelOpen} onClose={() => setIsFilterPanelOpen(false)} />
      </div>

      {/* Chart Type Selector */}
      <div>
        <label className="text-xs text-zinc-400 font-sans font-semibold uppercase tracking-wider block mb-2">
          1. Select Chart Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {chartTypes.map((t) => {
            const isSelected = activeConfig.chartType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleChartTypeSelect(t.id)}
                className={`p-3 rounded-xl text-xs font-medium border transition-all flex flex-col items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-800 border-zinc-600 text-zinc-100 shadow-md font-bold'
                    : 'bg-black hover:bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t.icon}
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Axis & Parameter Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 font-sans">
        {/* X Axis */}
        <div>
          <label className="text-xs text-zinc-400 font-sans block mb-1">
            {isHistogram ? 'Numeric Column' : isScatter ? 'X Axis (Numeric)' : 'X Axis / Dimension'}
          </label>
          <select
            value={activeConfig.xAxis || ''}
            onChange={(e) => dispatch(updateActiveConfig({ field: 'xAxis', value: e.target.value }))}
            className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 font-sans"
          >
            {(isScatter || isHistogram ? numericCols : allCols).map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        {/* Y Axis (Not needed for histogram) */}
        {!isHistogram && (
          <div>
            <label className="text-xs text-zinc-400 font-sans block mb-1">
              {isScatter ? 'Y Axis (Numeric)' : 'Y Axis / Measure'}
            </label>
            <select
              value={activeConfig.yAxis || ''}
              onChange={(e) => dispatch(updateActiveConfig({ field: 'yAxis', value: e.target.value }))}
              className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 font-sans"
            >
              {numericCols.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Aggregation (For Bar, Line, Area, Pie) */}
        {!isScatter && !isHistogram && (
          <div>
            <label className="text-xs text-zinc-400 font-sans block mb-1">Aggregation Function</label>
            <select
              value={activeConfig.aggregation}
              onChange={(e) => dispatch(updateActiveConfig({ field: 'aggregation', value: e.target.value }))}
              className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 uppercase font-sans"
            >
              <option value="sum">Sum</option>
              <option value="mean">Average (Mean)</option>
              <option value="min">Minimum</option>
              <option value="max">Maximum</option>
              <option value="count">Count Rows</option>
            </select>
          </div>
        )}
      </div>

      {/* 2. Color Theme & Swatches */}
      <div className="pt-2 border-t border-zinc-800/80 space-y-3 font-sans">
        <div className="flex items-center justify-between">
          <label className="text-xs text-zinc-400 font-sans font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-zinc-300" />
            2. Color Theme & Custom Picker
          </label>
        </div>

        {/* Theme Preset Pills (Common across ALL chart types for consistency) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-zinc-400 font-medium">Theme:</span>
          {PRESET_PALETTES.map((p) => {
            const isActive = JSON.stringify(activeConfig.colorPalette) === JSON.stringify(p.colors);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  dispatch(updateActiveConfig({ field: 'colorPalette', value: p.colors }));
                  dispatch(updateActiveConfig({ field: 'primaryColor', value: p.colors[0] }));
                }}
                className={`px-2.5 py-1 text-xs rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800 border-zinc-500 text-zinc-100 font-bold'
                    : 'bg-black border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="flex -space-x-1">
                  {p.colors.slice(0, 3).map((c, i) => (
                    <span key={i} className="w-2.5 h-2.5 rounded-full border border-black" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>

        {/* Color Swatches & Native Color Picker */}
        {activeConfig.chartType === 'pie' ? (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-zinc-400 font-medium">Slice Colors:</span>
            {(activeConfig.colorPalette || PRESET_PALETTES[0].colors).map((color, idx) => (
              <label
                key={idx}
                className="relative flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black border border-zinc-800 hover:border-zinc-600 cursor-pointer text-xs text-zinc-300 transition-colors"
                title={`Slice ${idx + 1} Color: ${color}`}
              >
                <span className="w-3.5 h-3.5 rounded-full border border-zinc-700 shrink-0" style={{ backgroundColor: color }} />
                <span className="font-mono text-[10px] text-zinc-400 uppercase">{color}</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const newPalette = [...(activeConfig.colorPalette || PRESET_PALETTES[0].colors)];
                    newPalette[idx] = e.target.value;
                    dispatch(updateActiveConfig({ field: 'colorPalette', value: newPalette }));
                  }}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
              </label>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-zinc-400 font-medium">Swatches:</span>
            {PRESET_COLORS.map((c) => {
              const isSelected = (activeConfig.primaryColor || '#6366f1').toLowerCase() === c.hex.toLowerCase();
              return (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => dispatch(updateActiveConfig({ field: 'primaryColor', value: c.hex }))}
                  className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${
                    isSelected ? 'scale-125 border-white shadow-md' : 'border-zinc-800 hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              );
            })}

            {/* Custom Color Picker Input */}
            <label className="relative flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-black border border-zinc-800 hover:border-zinc-600 text-xs text-zinc-300 cursor-pointer transition-colors">
              <Pipette className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-mono text-[10px] uppercase text-zinc-300">
                {activeConfig.primaryColor || '#6366f1'}
              </span>
              <input
                type="color"
                value={activeConfig.primaryColor || '#6366f1'}
                onChange={(e) => dispatch(updateActiveConfig({ field: 'primaryColor', value: e.target.value }))}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </label>
          </div>
        )}
      </div>

      {/* Chart Title & Save Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-zinc-800 font-sans">
        <input
          type="text"
          placeholder="Chart Title (optional e.g., Revenue by Region)"
          value={activeConfig.title}
          onChange={(e) => dispatch(updateActiveConfig({ field: 'title', value: e.target.value }))}
          className="flex-1 bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-sans"
        />

        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer font-sans"
        >
          <Plus className="w-4 h-4 text-zinc-900" />
          Save Visualization to Canvas
        </button>
      </div>
    </motion.div>
  );
};

