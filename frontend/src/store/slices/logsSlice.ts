import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface LogEntry {
  id: string;
  level: string;
  service: string;
  message: string;
  timestamp: string;
}

interface LogsState {
  allLogs: LogEntry[];
  filteredLogs: LogEntry[];
  filter: string;
  keyword: string;
}

const initialState: LogsState = {
  allLogs: [],
  filteredLogs: [],
  filter: 'all',
  keyword: '',
};

export const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    addLog: (state, action: PayloadAction<LogEntry>) => {
      state.allLogs = [action.payload, ...state.allLogs].slice(0, 1000);
    },
    setFilteredLogs: (state, action: PayloadAction<LogEntry[]>) => {
      state.filteredLogs = action.payload;
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
    setKeyword: (state, action: PayloadAction<string>) => {
      state.keyword = action.payload;
    }
  },
});

export const { addLog, setFilteredLogs, setFilter, setKeyword } = logsSlice.actions;
export default logsSlice.reducer;

