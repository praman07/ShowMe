import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  LayoutDashboard, 
  Database, 
  BarChart3, 
  Upload, 
  Menu, 
  X, 
  FileSpreadsheet,
  Plus,
  Trash2
} from 'lucide-react';
import { useDataset } from '@/features/dataset';

export const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { datasetData, datasets, activeDatasetId, switchDataset, deleteDataset } = useDataset();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Data Explorer', path: '/data', icon: <Database className="w-4 h-4" /> },
    { label: 'Visualization Studio', path: '/visualize', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex bg-white text-zinc-200 selection:bg-zinc-400 selection:text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800 bg-black sticky top-0 h-screen shrink-0 z-40">
        {/* Logo */}
        <div className="h-16 px-6 border-b border-zinc-800 flex items-center justify-between font-sans">
          <a href="/" className="flex items-center gap-2 group">
               <span className="font-bold text-lg tracking-wider text-white font-mono">
              SHOW<span className="text-zinc-400 text-lg">ME</span>
            </span> 
          </a>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="px-3 py-5 space-y-1 font-sans text-xs">
          <div className="px-3 pb-2 text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
            WORKSPACE MODULES
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-zinc-100 font-bold border border-zinc-700/60'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Loaded Datasets List Section */}
        <div className="flex-1 px-3 py-2 overflow-y-auto space-y-3 font-sans text-xs border-t border-zinc-800">
          <div className="flex items-center justify-between px-3">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
              DATASETS ({datasets ? datasets.length : 0})
            </span>
            <button
              onClick={() => navigate('/')}
              className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
              title="Upload new dataset"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            {datasets && datasets.map((d) => {
              const isActive = d.id === activeDatasetId;
              return (
                <div
                  key={d.id}
                  onClick={() => switchDataset(d.id)}
                  className={`w-full p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isActive
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-100 font-bold shadow-sm'
                      : 'bg-black hover:bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileSpreadsheet className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                    <div className="min-w-0 text-left">
                      <p className="text-xs truncate" title={d.filename}>{d.filename}</p>
                      <p className="text-[10px] text-zinc-500">{d.rows.toLocaleString()} rows</p>
                    </div>
                  </div>

                  {datasets.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDataset(d.id);
                      }}
                      className="p-1 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete dataset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upload Action */}
        <div className="p-3 border-t border-zinc-800">
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer font-sans"
          >
            <Plus className="w-4 h-4 text-zinc-900" />
            Upload New CSV
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar for Mobile */}
        <header className="md:hidden sticky top-0 z-50 h-16 border-b border-zinc-800 bg-black px-4 flex items-center justify-between font-sans">
          <a href="/" className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">SHOWME</span>
          </a>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 cursor-pointer"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-zinc-900 bg-zinc-950 px-4 py-4 space-y-3 z-40 font-sans text-xs"
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg cursor-pointer ${
                      isActive
                        ? 'bg-zinc-800 text-white font-bold'
                        : 'text-zinc-400 hover:text-white bg-zinc-950/50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-2 border-t border-zinc-900 space-y-2">
                <div className="text-[10px] text-zinc-500 uppercase font-bold">SWITCH DATASET:</div>
                {datasets && datasets.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      switchDataset(d.id);
                      setIsMobileOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs ${
                      d.id === activeDatasetId ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400'
                    }`}
                  >
                    <span className="truncate">{d.filename}</span>
                    <span className="text-[10px] text-zinc-500">{d.rows.toLocaleString()}r</span>
                  </button>
                ))}

                <button
                  onClick={() => {
                    navigate('/');
                    setIsMobileOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-zinc-100 text-zinc-900 text-xs font-semibold flex items-center justify-center gap-2 font-sans mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Upload New CSV
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};
