import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { useDataset } from '@/features/dataset';

export const MarketingLayout = ({ children }) => {
  const navigate = useNavigate();
  const { datasetData } = useDataset();

  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col bg-zinc-950 text-zinc-100 selection:bg-zinc-800 selection:text-white">
      {/* Header / Navbar - Transparent overlay allowing Spotlight to shine through */}
      <header className="absolute top-0 left-0 right-0 z-50 w-full bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <span className="font-bold text-lg tracking-wider text-white font-mono">
              SHOW<span className="text-zinc-400">ME</span>
            </span>
          </a>

          <div className="flex items-center gap-3">
            {datasetData && (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer font-sans"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-zinc-900" />
                Dashboard
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="h-full w-full overflow-hidden flex flex-col">{children}</main>
    </div>
  );
};
