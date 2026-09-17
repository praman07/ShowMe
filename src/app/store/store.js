import { configureStore } from '@reduxjs/toolkit';
import datasetReducer from '@/features/dataset/store/datasetSlice';
import filterReducer from '@/features/filters/store/filterSlice';
import visualizationReducer from '@/features/visualization/store/visualizationSlice';

export const store = configureStore({
  reducer: {
    dataset: datasetReducer,
    filters: filterReducer,
    visualization: visualizationReducer,
  },
});
