import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';
import { useDataset } from '../context/DatasetContext';

export const DataQualityCard = () => {
  const { datasetData } = useDataset();

  if (!datasetData) return null;

  const { quality, dataset } = datasetData;

  const hasMissing = quality.missing_values > 0;
  const hasDuplicates = quality.duplicate_rows > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full py-5 px-6 rounded-2xl bg-black border border-zinc-800 space-y-4 font-sans text-xs"
    >
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-100">
          Data Quality
        </h3>
        <span className="text-zinc-400">
          {hasMissing || hasDuplicates ? "Attention Required" : "Clean"}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <span className="text-zinc-500 block mb-1">Missing Cells</span>
          <span className="text-base font-semibold text-zinc-100">{quality.missing_values.toLocaleString()}</span>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <span className="text-zinc-500 block mb-1">Missing Ratio</span>
          <span className="text-base font-semibold text-zinc-100">{quality.missing_percentage}%</span>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <span className="text-zinc-500 block mb-1">Duplicate Rows</span>
          <span className="text-base font-semibold text-zinc-100">{quality.duplicate_rows.toLocaleString()}</span>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <span className="text-zinc-500 block mb-1">Columns Affected</span>
          <span className="text-base font-semibold text-zinc-100">{quality.columns_with_missing} / {dataset.columns}</span>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-800 text-zinc-300 text-xs">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400 shrink-0" />
          <span>Parsed {dataset.rows.toLocaleString()} rows and {dataset.columns} columns.</span>
        </div>

        {!hasDuplicates ? (
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400 shrink-0" />
            <span>0 duplicate rows found.</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-zinc-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>Found {quality.duplicate_rows.toLocaleString()} duplicate rows.</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
