import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BackgroundGrid } from '@/shared/components/ui/BackgroundGrid';
import { Spotlight } from '@/shared/components/ui/Spotlight';
import { UploadZone, UploadStatus, useFileUpload } from '@/features/upload';
import { useDataset } from '@/features/dataset';

export const LandingPage = () => {
  const navigate = useNavigate();

  const {
    file,
    error,
    status,
    formattedSize,
    handleFileSelect,
    handleReset,
  } = useFileUpload();

  const { analyzeFile, isAnalyzing, analysisError } = useDataset();

  return (
    <BackgroundGrid className="h-full min-h-0 flex-1 flex items-center justify-center overflow-hidden relative">
      {/* Spotlight beam from topmost edge */}
      <Spotlight className="-top-40 left-0 md:left-40 md:-top-40" fill="white" />

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Product Statement */}
          <div className="lg:col-span-6 space-y-6">
          

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08]"
            >
              <span className="font-canela font-normal text-zinc-100 block">Play with your data.</span>
              <span className="font-canela flex gap-2 items-center font-normal text-zinc-100 block mt-1">
                <span className="font-bold text-4xl tracking-wider text-white font-mono">
              SHOW<span className="text-zinc-400 text-4xl">ME</span>
            </span> 
              what it means.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed font-sans"
            >
              Turn raw CSV files into structured quality metrics, column schemas, descriptive statistics, and interactive visualizations.
            </motion.p>
          </div>

          {/* Right Column: Hero CSV Upload Zone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-6 w-full space-y-4"
          >
            <UploadZone
              file={file}
              error={error}
              status={status}
              formattedSize={formattedSize}
              onFileSelect={handleFileSelect}
              onReset={handleReset}
              onAnalyze={() => {
                if (file) {
                  analyzeFile(file).then(() => navigate('/dashboard'));
                }
              }}
            />

            <UploadStatus
              file={file}
              formattedSize={formattedSize}
              error={error || analysisError}
              status={status}
              onReset={handleReset}
            />
          </motion.div>
        </div>
      </section>
    </BackgroundGrid>
  );
};
