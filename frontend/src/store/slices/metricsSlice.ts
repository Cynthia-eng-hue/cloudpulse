import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Metric } from '../../types/metrics';





interface MetricsState {
  realtime: Metric | null;
  history: Metric[];
  layout: any[];
}

const initialState: MetricsState = {
  realtime: null,
  history: [],
  layout: JSON.parse(localStorage.getItem('cloudpulse_dashboard_layout') || '[]'),
};

export const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    updateRealtime: (state, action: PayloadAction<Metric>) => {
      state.realtime = action.payload;
      // Add to history and keep last 100 points
      state.history = [...state.history, action.payload].slice(-100);
    },
    setHistory: (state, action: PayloadAction<Metric[]>) => {
      state.history = action.payload;
    },
    updateLayout: (state, action: PayloadAction<any[]>) => {
      state.layout = action.payload;
      localStorage.setItem('cloudpulse_dashboard_layout', JSON.stringify(action.payload));
    },
  },
});

export const { updateRealtime, setHistory, updateLayout } = metricsSlice.actions;
export default metricsSlice.reducer;
