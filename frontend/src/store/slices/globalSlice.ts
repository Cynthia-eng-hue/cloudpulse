import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


interface GlobalState {
  theme: 'light' | 'dark';
  collapsed: boolean;
}

const initialState: GlobalState = {
  theme: 'light',
  collapsed: false,
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setCollapsed: (state, action: PayloadAction<boolean>) => {
      state.collapsed = action.payload;
    },
  },
});

export const { setTheme, setCollapsed } = globalSlice.actions;
export default globalSlice.reducer;
