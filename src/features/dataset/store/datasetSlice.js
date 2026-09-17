import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'showme_datasets_store';

const loadInitialState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { datasets: [], activeDatasetId: null, datasetData: null };
    
    const parsed = JSON.parse(raw);
    const datasets = parsed.datasets || [];
    const activeDatasetId = parsed.activeDatasetId || (datasets.length > 0 ? datasets[0].id : null);
    const activeDataset = datasets.find((d) => d.id === activeDatasetId) || (datasets.length > 0 ? datasets[0] : null);

    return {
      datasets,
      activeDatasetId: activeDataset ? activeDataset.id : null,
      datasetData: activeDataset ? activeDataset.data : null,
    };
  } catch (err) {
    console.error('Failed to load dataset state from localStorage:', err);
    return { datasets: [], activeDatasetId: null, datasetData: null };
  }
};

const persistState = (datasets, activeDatasetId) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ datasets, activeDatasetId }));
  } catch (err) {
    console.error('Failed to persist dataset state to localStorage:', err);
  }
};

const initialState = loadInitialState();

export const datasetSlice = createSlice({
  name: 'dataset',
  initialState,
  reducers: {
    setDataset: (state, action) => {
      const payload = action.payload; // full result from backend analysis API
      const filename = payload.dataset.filename;
      const id = payload.id || `${filename}_${Date.now()}`;

      const datasetItem = {
        id,
        filename,
        rows: payload.dataset.rows,
        columns: payload.dataset.columns,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        data: { ...payload, id },
      };

      // Check if dataset with same filename already exists, update it, else append
      const existingIdx = state.datasets.findIndex((d) => d.filename === filename);
      if (existingIdx >= 0) {
        state.datasets[existingIdx] = datasetItem;
      } else {
        state.datasets.unshift(datasetItem);
      }

      state.activeDatasetId = id;
      state.datasetData = datasetItem.data;

      persistState(state.datasets, state.activeDatasetId);
    },

    setActiveDataset: (state, action) => {
      const targetId = action.payload;
      const target = state.datasets.find((d) => d.id === targetId);
      if (target) {
        state.activeDatasetId = target.id;
        state.datasetData = target.data;
        persistState(state.datasets, state.activeDatasetId);
      }
    },

    removeDataset: (state, action) => {
      const targetId = action.payload;
      state.datasets = state.datasets.filter((d) => d.id !== targetId);

      if (state.activeDatasetId === targetId) {
        const fallback = state.datasets.length > 0 ? state.datasets[0] : null;
        state.activeDatasetId = fallback ? fallback.id : null;
        state.datasetData = fallback ? fallback.data : null;
      }

      persistState(state.datasets, state.activeDatasetId);
    },

    resetDataset: (state) => {
      state.datasets = [];
      state.activeDatasetId = null;
      state.datasetData = null;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.error('Failed to clear datasets from localStorage:', err);
      }
    },
  },
});

export const { setDataset, setActiveDataset, removeDataset, resetDataset } = datasetSlice.actions;

export const selectDatasetData = (state) => state.dataset.datasetData;
export const selectAllDatasets = (state) => state.dataset.datasets;
export const selectActiveDatasetId = (state) => state.dataset.activeDatasetId;

export default datasetSlice.reducer;
