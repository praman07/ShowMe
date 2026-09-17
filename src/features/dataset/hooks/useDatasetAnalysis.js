import { useMemo, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { analyzeDataset } from '../api/datasetApi';
import { 
  setDataset, 
  setActiveDataset, 
  removeDataset, 
  resetDataset, 
  selectDatasetData,
  selectAllDatasets,
  selectActiveDatasetId
} from '../store/datasetSlice';
import { resetFilterState } from '@/features/filters/store/filterSlice';
import { resetVisualizationState } from '@/features/visualization/store/visualizationSlice';

export function useDatasetAnalysis() {
  const dispatch = useDispatch();
  const datasetData = useSelector(selectDatasetData);
  const datasets = useSelector(selectAllDatasets);
  const activeDatasetId = useSelector(selectActiveDatasetId);

  const mutation = useMutation({
    mutationFn: (file) => analyzeDataset(file),
    onSuccess: (data) => {
      dispatch(setDataset(data));
      dispatch(resetFilterState());
      dispatch(resetVisualizationState());
    },
  });

  const switchDataset = useCallback((id) => {
    dispatch(setActiveDataset(id));
    dispatch(resetFilterState());
    dispatch(resetVisualizationState());
  }, [dispatch]);

  const deleteDataset = useCallback((id) => {
    dispatch(removeDataset(id));
    dispatch(resetFilterState());
    dispatch(resetVisualizationState());
  }, [dispatch]);

  const clearAllDatasets = useCallback(() => {
    dispatch(resetDataset());
    dispatch(resetFilterState());
    dispatch(resetVisualizationState());
  }, [dispatch]);

  const analyzeFile = useCallback((file) => {
    return mutation.mutateAsync(file);
  }, [mutation]);

  return useMemo(() => ({
    datasetData,
    datasets,
    activeDatasetId,
    isAnalyzing: mutation.isPending,
    analysisError: mutation.error ? mutation.error.message : null,
    analyzeFile,
    switchDataset,
    deleteDataset,
    clearDataset: clearAllDatasets,
  }), [
    datasetData,
    datasets,
    activeDatasetId,
    mutation.isPending,
    mutation.error,
    analyzeFile,
    switchDataset,
    deleteDataset,
    clearAllDatasets,
  ]);
}
