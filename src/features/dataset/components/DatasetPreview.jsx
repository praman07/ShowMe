import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useDataset } from '../context/DatasetContext';

export const DatasetPreview = () => {
  const { datasetData } = useDataset();
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

  if (!datasetData) return null;

  const { preview, schema, dataset } = datasetData;

  if (!preview || preview.length === 0) return null;

  const columns = schema.map((s) => s.name);

  const renderPreviewContent = () => (
    <div className={isFullscreen ? "fixed inset-0 z-[99999] bg-black w-screen h-screen p-4 sm:p-6 space-y-4 flex flex-col overflow-hidden font-sans" : "space-y-3 font-sans"}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 shrink-0 font-sans">
        <div className="flex items-center gap-2.5">
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-tight font-sans">
            Dataset Sample Preview
          </h3>
          {isFullscreen && (
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300 font-mono uppercase tracking-wider">
              Fullscreen Mode
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-400 font-sans">
          <span>First {preview.length} of {dataset.rows.toLocaleString()} rows</span>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-2.5 py-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm font-sans"
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Expand Dataset Preview to Fullscreen"}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-zinc-300" />
                <span className="hidden sm:inline text-xs font-semibold">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-zinc-300" />
                <span className="hidden sm:inline text-xs font-semibold">Fullscreen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scrollable Table Area */}
      <div className={`rounded-xl border border-zinc-800 overflow-hidden bg-black ${isFullscreen ? 'flex-1 flex flex-col min-h-0' : ''}`}>
        <div className={`overflow-x-auto overflow-y-auto ${isFullscreen ? 'flex-1 min-h-0' : 'max-h-[440px]'}`}>
          <table className="w-full text-left border-collapse text-xs min-w-max font-sans">
            <thead className="sticky top-0 z-20 bg-zinc-900 border-b border-zinc-800 text-[11px] text-zinc-400 uppercase">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center border-r border-zinc-800 text-zinc-500 font-sans">#</th>
                {columns.map((colName) => (
                  <th key={colName} className="py-2.5 px-3 font-semibold border-r border-zinc-800 whitespace-nowrap font-sans">
                    {colName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-black">
              {preview.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="py-2 px-3 text-center border-r border-zinc-900 text-zinc-500 select-none text-[11px]">
                    {idx + 1}
                  </td>
                  {columns.map((colName) => {
                    const val = row[colName];
                    const isNull = val === null || val === undefined;
                    return (
                      <td
                        key={colName}
                        className="py-2 px-3 border-r border-zinc-900 whitespace-nowrap max-w-xs truncate text-zinc-300 font-sans"
                        title={isNull ? 'null' : String(val)}
                      >
                        {isNull ? <span className="text-amber-400/90 text-[10px]">null</span> : String(val)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="p-5 rounded-2xl bg-black border border-zinc-800 font-sans text-xs">
        <div className="opacity-0">
          {/* Placeholder in normal page layout */}
        </div>
        {createPortal(renderPreviewContent(), document.body)}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-5 rounded-2xl bg-black border border-zinc-800 font-sans text-xs space-y-3"
    >
      {renderPreviewContent()}
    </motion.div>
  );
};

