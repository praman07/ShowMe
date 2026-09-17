import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  Database, 
  BarChart3, 
  X 
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';

export const DatasetHeader = () => {
  const navigate = useNavigate();
  const { 
    datasetData, 
    datasets, 
    activeDatasetId, 
    switchDataset, 
    deleteDataset 
  } = useDataset();

  if (!datasetData) return null;

  const { filename, rows, columns } = datasetData.dataset;

  return (
    <div className="w-full border-b border-zinc-800 bg-black py-4 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top Bar: Title & Primary Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-zinc-100 truncate tracking-tight" title={filename}>
                {filename}
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                {rows.toLocaleString()} rows · {columns.toLocaleString()} cols
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => deleteDataset(activeDatasetId)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-red-600 text-zinc-400 hover:text-white border border-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Delete current CSV dataset"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete CSV
            </button>

            <button
              onClick={() => navigate('/')}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Upload CSV
            </button>

            <button
              onClick={() => navigate('/data')}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              Data
            </button>
          </div>
        </div>

        {/* Datasets Bar */}
        {datasets && datasets.length > 0 && (
          <div className="pt-2 border-t border-zinc-800 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
            <span className="text-zinc-500 text-[11px] shrink-0 mr-1">Datasets:</span>
            {datasets.map((d) => {
              const isActive = d.id === activeDatasetId;
              return (
                <div
                  key={d.id}
                  onClick={() => switchDataset(d.id)}
                  className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-2 shrink-0 group ${
                    isActive
                      ? 'bg-zinc-900 border-zinc-700 text-white font-semibold'
                      : 'bg-black border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <span className="truncate max-w-[130px]">{d.filename}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDataset(d.id);
                    }}
                    className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete CSV"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
