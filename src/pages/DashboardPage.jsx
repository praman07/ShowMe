import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database, Upload, AlertCircle } from 'lucide-react';
import { BackgroundGrid } from '@/shared/components/ui/BackgroundGrid';
import { 
  DatasetHeader, 
  MetricCards, 
  DataQualityCard, 
  SchemaTable, 
  StatisticsCard, 
  DatasetPreview, 
  useDataset 
} from '@/features/dataset';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { datasetData, analysisError } = useDataset();

  if (!datasetData) {
    return (
      <BackgroundGrid>
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 font-sans">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full p-8 rounded-2xl bg-black border border-zinc-800 text-center shadow-2xl space-y-4 font-mono"
          >
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 flex items-center justify-center mx-auto">
              <Database className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-sans  text-zinc-100 tracking-tight uppercase">No Active Dataset</h2>

            {analysisError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/60 text-red-300 text-xs flex items-center gap-2 text-left font-sans">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{analysisError}</span>
              </div>
            )}

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

  return (
    <BackgroundGrid className="min-h-screen">
      {/* Header Bar with Multi-Dataset Switcher */}
      <DatasetHeader />

      {/* Main Dashboard Grid matching Landing Page Graphite Aesthetics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Analytical KPI Rail */}
        <MetricCards />

        {/* Data Quality Assessment */}
        <DataQualityCard />

        {/* Column Schema Table */}
        <SchemaTable />

        {/* Summary Statistics */}
        <StatisticsCard />

        {/* Dataset Raw Sample Preview Table */}
        <DatasetPreview />
      </div>
    </BackgroundGrid>
  );
};
