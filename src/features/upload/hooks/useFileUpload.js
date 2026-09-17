import { useState, useCallback } from 'react';

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function useFileUpload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'selected' | 'preparing' | 'validated' | 'error'

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      return "Please select a CSV file.";
    }

    const isCsvExtension = selectedFile.name.toLowerCase().endsWith('.csv');
    const isCsvMime = selectedFile.type === 'text/csv' || selectedFile.type === 'application/vnd.ms-excel';

    if (!isCsvExtension && !isCsvMime) {
      return "Only CSV files are supported.";
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      return `File size must be less than ${MAX_FILE_SIZE_MB}MB.`;
    }

    return null;
  };

  const handleFileSelect = useCallback((selectedFile) => {
    setError(null);
    
    if (!selectedFile) {
      setError("Please select a CSV file.");
      setStatus('error');
      return false;
    }

    const validationError = validateFile(selectedFile);

    if (validationError) {
      setError(validationError);
      setStatus('error');
      setFile(null);
      return false;
    }

    setFile(selectedFile);
    setError(null);
    setStatus('selected');
    return true;
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);

  const handleReset = useCallback(() => {
    setFile(null);
    setError(null);
    setStatus('idle');
    setIsDragOver(false);
  }, []);

  const prepareDataset = useCallback(() => {
    if (!file) return;
    setStatus('preparing');
    
    // Simulating Phase 1 validation preparation for Phase 2 integration
    setTimeout(() => {
      setStatus('validated');
    }, 600);
  }, [file]);

  return {
    file,
    error,
    isDragOver,
    status,
    formattedSize: file ? formatFileSize(file.size) : null,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    prepareDataset,
  };
}
