import React from 'react';
import { motion } from 'framer-motion';
import { FileUpload } from '@/shared/components/ui/file-upload';

export const UploadZone = ({
  file,
  error,
  status,
  formattedSize,
  onFileSelect,
  onReset,
  onAnalyze,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      <FileUpload
        onChange={onFileSelect}
        file={file}
        error={error}
        status={status}
        formattedSize={formattedSize}
        onReset={onReset}
        onAnalyze={onAnalyze}
      />
    </motion.div>
  );
};
