import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Columns, Check, X } from 'lucide-react';
import { toggleColumnVisibility, selectFilterState } from '../store/filterSlice';
import { useDataset } from '@/features/dataset';

export const ColumnToggleModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { datasetData } = useDataset();
  const { hiddenColumns } = useSelector(selectFilterState);

  if (!datasetData || !isOpen) return null;

  const { schema } = datasetData;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-black border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Columns className="w-5 h-5 text-zinc-300" />
            <h3 className="text-base font-bold text-zinc-100">Column Visibility</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-400">
          Toggle columns to show or hide them in the Data Explorer table view.
        </p>

        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
          {schema.map((col) => {
            const isVisible = !hiddenColumns.includes(col.name);
            return (
              <button
                key={col.name}
                type="button"
                onClick={() => dispatch(toggleColumnVisibility(col.name))}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-sans transition-all flex items-center justify-between cursor-pointer border ${
                  isVisible
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-200 font-semibold'
                    : 'bg-black border-zinc-800 text-zinc-500 opacity-60'
                }`}
              >
                <span>{col.name}</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                    isVisible
                      ? 'bg-zinc-100 border-zinc-100 text-zinc-900'
                      : 'bg-zinc-900 border-zinc-700'
                  }`}
                >
                  {isVisible && <Check className="w-3 h-3 text-zinc-900" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-3 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
