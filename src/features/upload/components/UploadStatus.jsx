import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSpreadsheet, 
  Trash2, 
  BarChart3, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useDataset } from '@/features/dataset';

export const UploadStatus = ({
  file,
  formattedSize,
  error: clientError,
  status,
  onReset,
}) => {
  const navigate = useNavigate();
  const { analyzeFile, isAnalyzing, analysisError } = useDataset();
  const [apiError, setApiError] = useState(null);

  if (!file && !clientError && !apiError && !analysisError) return null;

  const displayError = clientError || apiError || analysisError;

  const handleAnalyzeClick = async () => {
    if (!file) return;
    setApiError(null);

    try {
      await analyzeFile(file);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.message || 'Failed to analyze dataset.');
    }
  };

  const handleResetAll = () => {
    setApiError(null);
    onReset();
  };

  return (
    <AnimatePresence mode="wait">
      {/* Error State */}
      {displayError && (
        <motion.div
          key="error-state"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full max-w-2xl mx-auto mt-4 p-4 backdrop-blur-md  text-red-200 flex items-start sm:items-center justify-between gap-3 shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg  text-red-500 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{displayError}</p>
              <p className="text-xs text-red-500/80">Try uploading again.</p>
            </div>
          </div>
          <button
            onClick={handleResetAll}
            className="px-3 py-1.5 text-xs font-medium bg-white text-black rounded-lg shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try again
          </button>
        </motion.div>
      )}

    </AnimatePresence>
  );
};
