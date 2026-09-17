import React from 'react';
import { motion } from 'framer-motion';
import { useDataset } from '../context/DatasetContext';

export const MetricCards = () => {
  const { datasetData } = useDataset();

  if (!datasetData) return null;

  const { dataset, quality } = datasetData;

  const metrics = [
    {
      title: "Rows",
      value: dataset.rows.toLocaleString(),
      label: "Total records",
    },
    {
      title: "Columns",
      value: dataset.columns.toLocaleString(),
      label: "Attributes",
    },
    {
      title: "Missing Rate",
      value: `${quality.missing_percentage}%`,
      label: `${quality.missing_values.toLocaleString()} missing cells`,
    },
    {
      title: "Duplicate Rows",
      value: quality.duplicate_rows.toLocaleString(),
      label: quality.duplicate_rows === 0 ? "No duplicates" : "Identical rows",
    },
  ];

  return (
    <div className="w-full py-5 px-6 rounded-2xl bg-black border border-zinc-800 font-sans">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
        {metrics.map((metric, idx) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className={`py-2 md:py-0 ${idx > 0 ? 'md:pl-6' : ''} ${idx % 2 === 1 ? 'pl-4 md:pl-6' : ''}`}
          >
            <span className="text-xs text-zinc-500 font-medium block mb-1">
              {metric.title}
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              {metric.value}
            </div>
            <span className="text-xs text-zinc-400 mt-1 block truncate">
              {metric.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
