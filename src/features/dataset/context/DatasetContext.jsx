import React, { createContext, useContext } from 'react';
import { useDatasetAnalysis } from '../hooks/useDatasetAnalysis';

const DatasetContext = createContext(null);

export function DatasetProvider({ children }) {
  const datasetState = useDatasetAnalysis();

  return (
    <DatasetContext.Provider value={datasetState}>
      {children}
    </DatasetContext.Provider>
  );
}

export function useDataset() {
  const context = useContext(DatasetContext);
  if (!context) {
    throw new Error('useDataset must be used within a DatasetProvider');
  }
  return context;
}
