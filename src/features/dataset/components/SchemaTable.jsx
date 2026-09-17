import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useDataset } from '../context/DatasetContext';

export const SchemaTable = () => {
  const { datasetData } = useDataset();
  const [searchTerm, setSearchTerm] = useState('');

  if (!datasetData) return null;

  const { schema } = datasetData;

  const filteredSchema = schema.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-5 rounded-2xl bg-black border border-zinc-800 font-sans text-xs"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-100">
          Column Schema ({schema.length})
        </h3>

        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search columns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>
      </div>

      {/* Schema Table */}
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-[11px] text-zinc-500 font-medium">
              <th className="py-2.5 px-3">Column</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3 text-right">Unique</th>
              <th className="py-2.5 px-3 text-right">Missing</th>
              <th className="py-2.5 px-3 text-right">Missing %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-xs">
            {filteredSchema.length > 0 ? (
              filteredSchema.map((col) => (
                <tr key={col.name} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-zinc-200">
                    {col.name}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-400">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                      {col.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-300">
                    {col.unique.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-300">
                    {col.missing.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-400">
                    {col.missing_percentage}%
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-6 text-center text-zinc-500 text-xs">
                  No columns match "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
