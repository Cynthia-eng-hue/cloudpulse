import { configureStore } from '@reduxjs/toolkit';
import globalReducer from './slices/globalSlice';
import metricsReducer from './slices/metricsSlice';
import alertsReducer from './slices/alertsSlice';
import topologyReducer from './slices/topologySlice';
import logsReducer from './slices/logsSlice';



export const store = configureStore({
  reducer: {
    global: globalReducer,
    metrics: metricsReducer,
    alerts: alertsReducer,
    topology: topologyReducer,
    logs: logsReducer,
  },
});




export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
