import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, RotateCcw, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { setColumnFilter, removeColumnFilter, clearAllFilters, selectFilterState } from '../store/filterSlice';
import { useDataset } from '@/features/dataset';

export const FilterPanel = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { datasetData } = useDataset();
  const { columnFilters } = useSelector(selectFilterState);
  const [expandedCol, setExpandedCol] = useState(null);
  const panelRef = useRef(null);

  // Close open dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setExpandedCol(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!datasetData || !isOpen) return null;

  const { schema, preview } = datasetData;

  const handleCategoricalToggle = (colName, value) => {
    const current = columnFilters[colName] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    if (updated.length === 0) {
      dispatch(removeColumnFilter(colName));
    } else {
      dispatch(setColumnFilter({ column: colName, filter: updated }));
    }
  };

  const handleNumericChange = (colName, key, val) => {
    const current = columnFilters[colName] || { min: '', max: '' };
    const updated = { ...current, [key]: val };

    if (!updated.min && !updated.max) {
      dispatch(removeColumnFilter(colName));
    } else {
      dispatch(setColumnFilter({ column: colName, filter: updated }));
    }
  };

  const handleTextChange = (colName, val) => {
    if (!val.trim()) {
      dispatch(removeColumnFilter(colName));
    } else {
      dispatch(setColumnFilter({ column: colName, filter: val }));
    }
  };

  const handleBooleanChange = (colName, val) => {
    if (val === 'all') {
      dispatch(removeColumnFilter(colName));
    } else {
      dispatch(setColumnFilter({ column: colName, filter: val }));
    }
  };

  const getAppliedFilterLabel = (type, val) => {
    if (!val) return null;

    if (type === 'categorical' && Array.isArray(val) && val.length > 0) {
      if (val.length === 1) return val[0];
      return `${val[0]} +${val.length - 1}`;
    }

    if (type === 'numeric' && typeof val === 'object') {
      const { min, max } = val;
      if (min && max) return `${min}–${max}`;
      if (min) return `≥${min}`;
      if (max) return `≤${max}`;
    }

    if (type === 'text' && typeof val === 'string' && val.trim()) {
      return `"${val}"`;
    }

    if (type === 'boolean' && typeof val === 'string' && val !== 'all') {
      return val;
    }

    return 'applied';
  };

  const activeFilterCount = Object.keys(columnFilters).length;

  return (
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-2xl p-5 shadow-2xl z-40 overflow-visible font-sans"
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Filter className="w-4 h-4 text-zinc-300" />
            <h3 className="text-sm font-bold text-zinc-100 tracking-tight font-sans">Dataset Filters</h3>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-200 text-xs font-sans border border-zinc-700">
                {activeFilterCount} active
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 font-sans">
            {activeFilterCount > 0 && (
              <button
                onClick={() => dispatch(clearAllFilters())}
                className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset filters
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Trigger Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4 overflow-visible">
          {schema.map((col) => {
            const isExpanded = expandedCol === col.name;
            const isAnyExpanded = Boolean(expandedCol);
            const isOtherCol = isAnyExpanded && !isExpanded;
            const filterValue = columnFilters[col.name];
            const hasFilter = Boolean(filterValue);
            const appliedLabel = getAppliedFilterLabel(col.type, filterValue);

            // Get unique values for categorical
            const uniqueVals = col.type === 'categorical'
              ? Array.from(new Set(preview.map((r) => String(r[col.name])).filter((v) => v !== 'null' && v !== 'undefined')))
              : [];

            return (
              <div
                key={col.name}
                className={`relative transition-all duration-200 ${
                  isExpanded ? 'z-50 scale-[1.01]' : isOtherCol ? 'z-10 blur-[2px] opacity-40' : 'z-10'
                }`}
              >
                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => setExpandedCol(isExpanded ? null : col.name)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer select-none font-sans ${
                    hasFilter
                      ? 'bg-zinc-900 border-zinc-600 text-zinc-100 font-bold shadow-sm'
                      : 'bg-black hover:bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-semibold truncate">{col.name}</span>
                    {hasFilter ? (
                      <span
                        className="text-[10px] text-zinc-200 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0 max-w-[85px] truncate"
                        title={String(appliedLabel)}
                      >
                        {appliedLabel}
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-500 font-sans uppercase shrink-0">({col.type})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-zinc-300" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                    )}
                  </div>
                </button>

                {/* Floating Air Dropdown Popover */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-1.5 p-4 bg-black border border-zinc-800 rounded-xl shadow-2xl z-50 space-y-3 font-sans text-xs min-w-[220px]"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                        <span className="text-[11px] font-bold text-zinc-200 truncate">{col.name} Filter</span>
                        {hasFilter && (
                          <button
                            type="button"
                            onClick={() => dispatch(removeColumnFilter(col.name))}
                            className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            Clear
                          </button>
                        )}
                      </div>

                      {/* Categorical Dropdown */}
                      {col.type === 'categorical' && (
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {uniqueVals.length > 0 ? (
                            uniqueVals.map((val) => {
                              const isSelected = (filterValue || []).includes(val);
                              return (
                                <label
                                  key={val}
                                  className="flex items-center gap-2 p-1 rounded hover:bg-zinc-900 text-zinc-300 hover:text-white cursor-pointer select-none"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleCategoricalToggle(col.name, val)}
                                    className="rounded bg-zinc-900 border-zinc-700 text-zinc-100 focus:ring-0 cursor-pointer"
                                  />
                                  <span className="truncate">{val}</span>
                                </label>
                              );
                            })
                          ) : (
                            <span className="text-[11px] text-zinc-500 block py-1">No unique options</span>
                          )}
                        </div>
                      )}

                      {/* Numeric Min/Max Dropdown */}
                      {col.type === 'numeric' && (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-zinc-400 block mb-1">Min Value</label>
                              <input
                                type="number"
                                placeholder="Min"
                                value={(filterValue && filterValue.min) || ''}
                                onChange={(e) => handleNumericChange(col.name, 'min', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-zinc-400 block mb-1">Max Value</label>
                              <input
                                type="number"
                                placeholder="Max"
                                value={(filterValue && filterValue.max) || ''}
                                onChange={(e) => handleNumericChange(col.name, 'max', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Text Search Filter */}
                      {col.type === 'text' && (
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-1">Contains text</label>
                          <input
                            type="text"
                            placeholder="Type to filter..."
                            value={filterValue || ''}
                            onChange={(e) => handleTextChange(col.name, e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                          />
                        </div>
                      )}

                      {/* Boolean Filter */}
                      {col.type === 'boolean' && (
                        <div className="flex items-center gap-1.5 pt-1">
                          {['all', 'true', 'false'].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleBooleanChange(col.name, option)}
                              className={`flex-1 py-1.5 text-[11px] rounded-lg border uppercase font-sans font-medium transition-colors cursor-pointer ${
                                (filterValue || 'all') === option
                                  ? 'bg-zinc-100 text-zinc-900 border-zinc-100 font-bold'
                                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
