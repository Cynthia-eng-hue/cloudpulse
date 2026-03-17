import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


export interface Alert {
  id: string;
  ruleName: string;
  value: number;
  metric: string;
  timestamp: string;
}

interface AlertsState {
  current: Alert[];
  history: Alert[];
  rules: any[];
}

const initialState: AlertsState = {
  current: [],
  history: [],
  rules: [],
};

export const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.current = [action.payload, ...state.current].slice(0, 10);
      state.history = [action.payload, ...state.history];
    },
    setHistory: (state, action: PayloadAction<Alert[]>) => {
      state.history = action.payload;
    },
    setRules: (state, action: PayloadAction<any[]>) => {
      state.rules = action.payload;
    },
    clearAlerts: (state) => {
      state.current = [];
    }
  },
});

export const { addAlert, setHistory, setRules, clearAlerts } = alertsSlice.actions;
export default alertsSlice.reducer;
