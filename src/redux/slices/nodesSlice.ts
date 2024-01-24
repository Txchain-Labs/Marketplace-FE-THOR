import { createSlice } from '@reduxjs/toolkit';

export interface NodesState {
  tier: string;
  sort: {
    orderBy: string | null;
    orderDirection: 'asc' | 'desc';
  };
  filter: any;
}

const initialState: NodesState = {
  tier: 'ODIN',
  sort: {
    orderBy: 'avaxPriceInWei',
    orderDirection: 'desc',
  },
  filter: {},
};

export const selectTier = (state: { nodes: NodesState }) => state.nodes.tier;
export const selectSort = (state: { nodes: NodesState }) => state.nodes.sort;
export const selectFilter = (state: { nodes: NodesState }) =>
  state.nodes.filter;

const nodesSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    setTier: (state, action) => {
      state.tier = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const { setTier, setSort, setFilter } = nodesSlice.actions;

export default nodesSlice.reducer;
