import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useDataset } from '../context/DatasetContext';

export const StatisticsCard = () => {
  const { datasetData } = useDataset();

  if (!datasetData) return null;

  const { statistics } = datasetData;
  const numericColumns = Object.keys(statistics);
  const [selectedCol, setSelectedCol] = useState(numericColumns[0] || null);

  if (numericColumns.length === 0) return null;

  const currentCol = selectedCol && statistics[selectedCol] ? selectedCol : numericColumns[0];
  const stats = statistics[currentCol];

  const formatStatValue = (val) => {
    if (val === null || val === undefined) return "N/A";
    if (typeof val === "number") {
      return Number.isInteger(val) ? val.toLocaleString() : val.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    return val;
  };

  const statItems = [
    { label: "Count", value: formatStatValue(stats?.count) },
    { label: "Mean", value: formatStatValue(stats?.mean) },
    { label: "Std Dev", value: formatStatValue(stats?.std) },
    { label: "Min", value: formatStatValue(stats?.min) },
    { label: "25% (Q1)", value: formatStatValue(stats?.q25) },
    { label: "50% (Median)", value: formatStatValue(stats?.median) },
    { label: "75% (Q3)", value: formatStatValue(stats?.q75) },
    { label: "Max", value: formatStatValue(stats?.max) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-5 rounded-2xl bg-black border border-zinc-800 font-sans text-xs space-y-4"
    >
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-100">
          Summary Statistics
        </h3>
        <span className="text-zinc-500">{numericColumns.length} Numeric Columns</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Column Select List */}
        <div className="lg:col-span-4 space-y-1 max-h-60 overflow-y-auto pr-1">
          {numericColumns.map((colName) => (
            <button
              key={colName}
              onClick={() => setSelectedCol(colName)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer border ${
                currentCol === colName
                  ? "bg-zinc-900 text-white font-medium border-zinc-700"
                  : "bg-black text-zinc-400 hover:bg-zinc-900 border-zinc-800"
              }`}
            >
              <span className="truncate">{colName}</span>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
            </button>
          ))}
        </div>

        {/* Stat Grid */}
        <div className="lg:col-span-8 bg-black rounded-xl p-4 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h4 className="text-xs font-semibold text-zinc-100">{currentCol}</h4>
            <span className="text-[11px] text-zinc-500">{stats?.count?.toLocaleString()} values</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {statItems.map((st) => (
              <div key={st.label} className="p-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">{st.label}</span>
                <span className="text-xs font-medium text-zinc-100 mt-0.5 block truncate" title={String(st.value)}>
                  {st.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
