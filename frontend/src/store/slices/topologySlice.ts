import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


interface TopologyState {
  nodes: any[];
  edges: any[];
}

const initialState: TopologyState = {
  nodes: [],
  edges: [],
};

export const topologySlice = createSlice({
  name: 'topology',
  initialState,
  reducers: {
    setTopology: (state, action: PayloadAction<{ nodes: any[], edges: any[] }>) => {
      state.nodes = action.payload.nodes;
      state.edges = action.payload.edges;
    },
    updateNodeStatus: (state, action: PayloadAction<{ id: string, status: string }>) => {
      const node = state.nodes.find(n => n.id === action.payload.id);
      if (node) node.status = action.payload.status;
    }
  },
});

export const { setTopology, updateNodeStatus } = topologySlice.actions;
export default topologySlice.reducer;
