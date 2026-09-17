import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Search, 
  ListFilter, 
  Columns3, 
  RotateCcw, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ChevronLeft, 
  ChevronRight,
  Database,
  Upload,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { BackgroundGrid } from '@/shared/components/ui/BackgroundGrid';
import { useDataset } from '@/features/dataset';
import { 
  FilterPanel, 
  ColumnToggleModal, 
  getFilteredAndSortedRows,
  setSearchQuery,
  setSort,
  clearAllFilters,
  setPage,
  setPageSize,
  selectFilterState
} from '@/features/filters';

export const DataPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { datasetData } = useDataset();
  const filterState = useSelector(selectFilterState);

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  if (!datasetData) {
    return (
      <BackgroundGrid>
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full p-8 rounded-2xl bg-black border border-zinc-800 text-center shadow-2xl space-y-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center mx-auto">
              <Database className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-sans text-zinc-100 tracking-tight font-mono uppercase">No Active Dataset</h2>
          

            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
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
  const { searchQuery, columnFilters, sortConfig, hiddenColumns, page, pageSize } = filterState;

  // Derive filtered and sorted rows
  const filteredRows = getFilteredAndSortedRows(preview, schema, filterState);
  const totalFilteredCount = filteredRows.length;

  // Pagination calculation
  const totalPages = Math.ceil(totalFilteredCount / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRows = filteredRows.slice(startIndex, startIndex + pageSize);

  // Active columns
  const visibleSchema = schema.filter((s) => !hiddenColumns.includes(s.name));
  const activeFilterCount = Object.keys(columnFilters).length + (searchQuery ? 1 : 0);

  const renderExplorerContent = () => (
    <div className={isFullscreen ? "fixed inset-0 z-[99999] bg-black w-screen h-screen p-4 sm:p-6 space-y-4 flex flex-col overflow-hidden font-sans" : "space-y-6"}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800 font-sans shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold text-zinc-100 tracking-tight uppercase">
              Data Explorer
            </h1>
            {isFullscreen && (
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300 font-mono uppercase tracking-wider">
                Fullscreen Mode
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Inspecting preview rows for <span className="text-zinc-200">{dataset.filename}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-zinc-400">
          <div>
            Showing <span className="text-zinc-100 font-bold">{preview.length}</span> preview rows of {dataset.rows.toLocaleString()}
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Expand Dataset to Fullscreen"}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-zinc-300" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-zinc-300" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toolbar Controls & Absolute Filter Panel Container */}
      <div className="relative z-30 font-sans space-y-3 shrink-0">
        {/* Global Search & Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Global Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search dataset rows..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeFilterCount > 0 || isFilterPanelOpen
                  ? 'bg-zinc-800 border-zinc-600 text-zinc-100'
                  : 'bg-black hover:bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
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

            <button
              onClick={() => setIsColumnModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-black hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Columns3 className="w-3.5 h-3.5" />
              Columns ({visibleSchema.length}/{schema.length})
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={() => dispatch(clearAllFilters())}
                className="p-2 text-xs font-medium rounded-xl bg-black hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                title="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-2 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isFullscreen
                  ? 'bg-zinc-800 border-zinc-600 text-zinc-100'
                  : 'bg-black hover:bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
              title={isFullscreen ? "Exit Fullscreen (Esc)" : "Expand Dataset to Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Absolute Filter Panel Drawer Overlay */}
        <FilterPanel isOpen={isFilterPanelOpen} onClose={() => setIsFilterPanelOpen(false)} />
      </div>

      {/* Column Visibility Modal */}
      <ColumnToggleModal isOpen={isColumnModalOpen} onClose={() => setIsColumnModalOpen(false)} />

      {/* Main Data Table - Protagonist */}
      <div className={`rounded-2xl bg-black border border-zinc-800 overflow-hidden shadow-sm ${isFullscreen ? 'flex-1 flex flex-col min-h-0' : ''}`}>
        <div className={`overflow-x-auto overflow-y-auto ${isFullscreen ? 'flex-1 min-h-0' : 'max-h-[560px]'}`}>
          <table className="w-full text-left border-collapse text-xs font-sans min-w-max">
            <thead className="sticky top-0 z-20 bg-zinc-900 border-b border-zinc-800 text-[11px] text-zinc-400 uppercase">
              <tr>
                <th className="py-3 px-4 w-12 text-center border-r border-zinc-800/80 font-sans text-zinc-500">
                  #
                </th>
                {visibleSchema.map((col) => {
                  const isSorted = sortConfig.key === col.name;
                  return (
                    <th
                      key={col.name}
                      onClick={() => dispatch(setSort(col.name))}
                      className="py-3 px-4 font-bold border-r border-zinc-800/60 whitespace-nowrap cursor-pointer hover:text-zinc-100 transition-colors select-none group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.name}</span>
                        {isSorted ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUp className="w-3 h-3 text-zinc-100" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-zinc-100" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-black">
              {paginatedRows.length > 0 ? (
                paginatedRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="py-2.5 px-3 text-center border-r border-zinc-800/60 text-zinc-500 select-none text-[11px]">
                      {startIndex + idx + 1}
                    </td>
                    {visibleSchema.map((col) => {
                      const val = row[col.name];
                      const isNull = val === null || val === undefined;
                      return (
                        <td
                          key={col.name}
                          className="py-2.5 px-4 border-r border-zinc-800/40 whitespace-nowrap max-w-xs truncate"
                          title={isNull ? 'null' : String(val)}
                        >
                          {isNull ? (
                            <span className="text-amber-400/90 text-[10px] font-sans">
                              null
                            </span>
                          ) : (
                            <span className="text-zinc-300">{String(val)}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={visibleSchema.length + 1} className="py-12 text-center text-zinc-500 font-sans text-xs">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-zinc-800 text-xs font-sans shrink-0">
          <div className="text-zinc-400">
            Showing {totalFilteredCount > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + pageSize, totalFilteredCount)} of {totalFilteredCount} preview rows
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => dispatch(setPageSize(Number(e.target.value)))}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-2.5 py-1 focus:outline-none"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => dispatch(setPage(currentPage - 1))}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 disabled:opacity-40 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-zinc-300">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => dispatch(setPage(currentPage + 1))}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 disabled:opacity-40 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <>
        <BackgroundGrid className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 opacity-0">
            {/* Hidden placeholder to retain scroll context */}
          </div>
        </BackgroundGrid>
        {createPortal(renderExplorerContent(), document.body)}
      </>
    );
  }

  return (
    <BackgroundGrid className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {renderExplorerContent()}
      </div>
    </BackgroundGrid>
  );
};

