import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, X, Check, FileSpreadsheet } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
  file,
  error,
  status,
  formattedSize,
  onReset,
  onAnalyze
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (onChange) {
        onChange(droppedFile);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover="animate"
        className={cn(
          "p-6 sm:p-8 group/file block rounded-2xl cursor-pointer w-full min-h-[260px] flex flex-col justify-center items-center relative overflow-hidden bg-black border border-dashed transition-all duration-300",
          isDragActive ? "border-zinc-400 bg-zinc-400/10" : "border-zinc-800 hover:border-zinc-700"
        )}
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept=".csv,text/csv,application/vnd.ms-excel"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              if (onChange) {
                onChange(e.target.files[0]);
              }
            }
          }}
          className="hidden"
        />

        {/* Aceternity Grid Pattern Background */}
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none">
          <GridPattern />
        </div>

        <div className="flex flex-col items-center justify-center relative z-10">
          <p className="font-normal text-zinc-400 text-sm mt-1">
            Drag or drop your CSV file here or click to browse
          </p>

          <div className="relative w-full mt-8 max-w-xl mx-auto">
            {file ? (
              <motion.div
                layoutId="file-upload"
                className={cn(
                  "relative z-40 bg-black border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl shadow-2xl gap-4"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-lg bg-gray-500/10 text-gray-600 shrink-0">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-100 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-zinc-400 font-mono">
                        {formattedSize || (file.size / (1024 * 1024)).toFixed(2) + " MB"}
                      </span>
                  
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-800">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onReset) onReset();
                    }}
                    className="p-2 text-xs font-medium text-zinc-400 hover:text-red-400 bg-zinc-800/80 hover:bg-red-950/60 rounded-lg transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAnalyze) onAnalyze();
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-white text-black shadow-md shadow-white transition-colors cursor-pointer"
                  >
                    {status === 'validated' ? 'Dataset Ready (Phase 2)' : 'Analyze Dataset'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <React.Fragment>
                <motion.div
                  layoutId="file-upload"
                  variants={mainVariant}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className={cn(
                    "relative z-40 bg-black border border-zinc-800 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-xl shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                  )}
                >
                  {isDragActive ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-zinc-300 text-xs text-center flex flex-col items-center gap-1"
                    >
                      Drop it
                      <UploadCloud className="h-4 w-4 text-white animate-bounce" />
                    </motion.p>
                  ) : (
                    <UploadCloud className="h-6 w-6 text-zinc-400 group-hover/file:text-white transition-colors" />
                  )}
                </motion.div>

                <motion.div
                  variants={secondaryVariant}
                  className="absolute opacity-0 border border-dashed border-white inset-0 z-30 bg-white/10 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-xl"
                ></motion.div>
              </React.Fragment>
            )}
          </div>

          <div className="mt-6">
            <span className="text-zinc-400 text-xs">
              CSV files only · Maximum 50MB
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-zinc-900/40 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex-shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-zinc-950/80"
                  : "bg-zinc-900/60 shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
