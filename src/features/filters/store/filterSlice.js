import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  columnFilters: {}, // e.g. { region: ['North', 'South'], revenue: { min: 100, max: 5000 }, is_active: 'true' }
  sortConfig: { key: null, direction: 'asc' },
  hiddenColumns: [],
  page: 1,
  pageSize: 25,
};

export const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setColumnFilter: (state, action) => {
      const { column, filter } = action.payload;
      state.columnFilters[column] = filter;
      state.page = 1;
    },
    removeColumnFilter: (state, action) => {
      delete state.columnFilters[action.payload];
      state.page = 1;
    },
    clearAllFilters: (state) => {
      state.searchQuery = '';
      state.columnFilters = {};
      state.sortConfig = { key: null, direction: 'asc' };
      state.page = 1;
    },
    setSort: (state, action) => {
      const key = action.payload;
      if (state.sortConfig.key === key) {
        if (state.sortConfig.direction === 'asc') {
          state.sortConfig.direction = 'desc';
        } else {
          state.sortConfig = { key: null, direction: 'asc' };
        }
      } else {
        state.sortConfig = { key, direction: 'asc' };
      }
      state.page = 1;
    },
    toggleColumnVisibility: (state, action) => {
      const colName = action.payload;
      if (state.hiddenColumns.includes(colName)) {
        state.hiddenColumns = state.hiddenColumns.filter((c) => c !== colName);
      } else {
        state.hiddenColumns.push(colName);
      }
    },
    setColumnVisibility: (state, action) => {
      state.hiddenColumns = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.page = 1;
    },
    resetFilterState: (state) => {
      state.searchQuery = '';
      state.columnFilters = {};
      state.sortConfig = { key: null, direction: 'asc' };
      state.hiddenColumns = [];
      state.page = 1;
      state.pageSize = 25;
    },
  },
});

export const {
  setSearchQuery,
  setColumnFilter,
  removeColumnFilter,
  clearAllFilters,
  setSort,
  toggleColumnVisibility,
  setColumnVisibility,
  setPage,
  setPageSize,
  resetFilterState,
} = filterSlice.actions;

export const selectFilterState = (state) => state.filters;
export default filterSlice.reducer;
