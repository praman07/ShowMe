import { createSlice } from '@reduxjs/toolkit';

const CHARTS_STORAGE_KEY = 'showme_saved_charts';

const loadSavedCharts = () => {
  try {
    const raw = localStorage.getItem(CHARTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
};

const DEFAULT_PALETTE = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#14b8a6', '#a855f7'];

const initialState = {
  activeConfig: {
    chartType: 'bar',
    xAxis: null,
    yAxis: null,
    aggregation: 'sum',
    bins: 10,
    title: '',
    primaryColor: '#6366f1',
    colorPalette: DEFAULT_PALETTE,
  },
  savedCharts: loadSavedCharts(),
};

export const visualizationSlice = createSlice({
  name: 'visualization',
  initialState,
  reducers: {
    setActiveConfig: (state, action) => {
      state.activeConfig = { ...state.activeConfig, ...action.payload };
    },
    updateActiveConfig: (state, action) => {
      const { field, value } = action.payload;
      state.activeConfig[field] = value;
    },
    saveCurrentChart: (state, action) => {
      const newChart = {
        id: 'chart_' + Date.now(),
        createdAt: new Date().toISOString(),
        ...state.activeConfig,
        title: action.payload?.title || state.activeConfig.title || `${state.activeConfig.chartType.toUpperCase()} Chart of ${state.activeConfig.yAxis || 'Count'} by ${state.activeConfig.xAxis || 'Category'}`,
      };
      state.savedCharts.unshift(newChart);
      try {
        localStorage.setItem(CHARTS_STORAGE_KEY, JSON.stringify(state.savedCharts));
      } catch (err) {
        console.error('Failed to save chart to localStorage:', err);
      }
    },
    removeSavedChart: (state, action) => {
      state.savedCharts = state.savedCharts.filter((chart) => chart.id !== action.payload);
      try {
        localStorage.setItem(CHARTS_STORAGE_KEY, JSON.stringify(state.savedCharts));
      } catch (err) {
        console.error('Failed to remove chart from localStorage:', err);
      }
    },
    resetVisualizationState: (state) => {
      state.activeConfig = {
        chartType: 'bar',
        xAxis: null,
        yAxis: null,
        aggregation: 'sum',
        bins: 10,
        title: '',
        primaryColor: '#6366f1',
        colorPalette: DEFAULT_PALETTE,
      };
      state.savedCharts = [];
      try {
        localStorage.removeItem(CHARTS_STORAGE_KEY);
      } catch (err) {
        console.error('Failed to clear charts from localStorage:', err);
      }
    },
  },
});

export const {
  setActiveConfig,
  updateActiveConfig,
  saveCurrentChart,
  removeSavedChart,
  resetVisualizationState,
} = visualizationSlice.actions;

export const selectVisualizationState = (state) => state.visualization;
export default visualizationSlice.reducer;
