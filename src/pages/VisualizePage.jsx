import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Database, Upload, Layers } from 'lucide-react';
import { BackgroundGrid } from '@/shared/components/ui/BackgroundGrid';
import { useDataset } from '@/features/dataset';
import { getFilteredAndSortedRows, selectFilterState } from '@/features/filters';
import { 
  ChartBuilder, 
  ChartCard, 
  ChartRenderer, 
  transformChartData, 
  selectVisualizationState 
} from '@/features/visualization';

export const VisualizePage = () => {
  const navigate = useNavigate();
  const { datasetData } = useDataset();
  const filterState = useSelector(selectFilterState);
  const { activeConfig, savedCharts } = useSelector(selectVisualizationState);

  if (!datasetData) {
    return (
      <BackgroundGrid>
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full p-8 rounded-2xl bg-black border border-zinc-800 text-center shadow-2xl space-y-4 font-sans"
          >
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center mx-auto">
              <BarChart3 className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-sans text-zinc-100 tracking-tight uppercase">No Active Dataset</h2>
        

            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer font-sans"
            >
              <Upload className="w-4 h-4 text-zinc-900" />
              Upload CSV
            </button>
          </motion.div>
        </div>
      </BackgroundGrid>
    );
  }

  const { preview, schema, dataset } = datasetData;
  const filteredRows = getFilteredAndSortedRows(preview, schema, filterState);

  // Live active preview chart data
  const liveChartData = transformChartData(
    filteredRows,
    activeConfig.xAxis,
    activeConfig.yAxis,
    activeConfig.aggregation,
    activeConfig.chartType,
    activeConfig.bins
  );

  return (
    <BackgroundGrid className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h1 className="text-xl font-extrabold text-zinc-100 tracking-tight uppercase">
              Visualization Studio
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Chart canvas for <span className="text-zinc-200">{dataset.filename}</span>
            </p>
          </div>

          <div className="text-xs text-zinc-400">
            Active dataset subset: <span className="text-zinc-100 font-bold">{filteredRows.length}</span> rows
          </div>
        </div>

        {/* Builder (w-full, top) */}
        <div className="w-full">
          <ChartBuilder />
        </div>

        {/* Live Canvas Preview (w-full, lesser height) */}
        <div className="w-full p-6 rounded-2xl bg-black border border-zinc-800 shadow-xl space-y-4 font-sans">
          <div className="pb-3 border-b border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-bold">CANVAS PREVIEW</span>
              <h4 className="text-base font-bold text-zinc-100 mt-0.5">
                {activeConfig.title || `${activeConfig.chartType.toUpperCase()} of ${activeConfig.yAxis || 'Count'} by ${activeConfig.xAxis || 'Category'}`}
              </h4>
            </div>
            <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs uppercase font-bold">
              {activeConfig.chartType}
            </span>
          </div>

          <div className="py-2">
            <ChartRenderer
              data={liveChartData}
              chartType={activeConfig.chartType}
              xAxis={activeConfig.xAxis}
              yAxis={activeConfig.yAxis}
              aggregation={activeConfig.aggregation}
              primaryColor={activeConfig.primaryColor}
              colorPalette={activeConfig.colorPalette}
              height="h-56"
            />
          </div>
        </div>

        {/* Saved Visualizations Canvas Grid */}
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-400" />
              <h3 className="text-lg font-bold text-zinc-100 tracking-tight uppercase">
                Saved Visualizations ({savedCharts.length})
              </h3>
            </div>
          </div>

          {savedCharts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {savedCharts.map((chart) => (
                  <ChartCard
                    key={chart.id}
                    chartConfig={chart}
                    rows={filteredRows}
                    schema={schema}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-black border border-zinc-800 text-center text-zinc-500 text-xs font-sans space-y-1">
              <p className="font-bold text-zinc-400 text-sm uppercase">Canvas Empty</p>
              <p>Configure parameters above and click "Save Visualization to Canvas".</p>
            </div>
          )}
        </div>
      </div>
    </BackgroundGrid>
  );
};
