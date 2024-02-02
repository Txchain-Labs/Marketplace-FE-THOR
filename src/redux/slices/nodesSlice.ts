import { createSlice } from '@reduxjs/toolkit';

export interface NodesState {
  tier: string;
  sort: {
    orderBy: string | null;
    orderDirection: 'asc' | 'desc';
  };
  filter: {
    isModalOpen: boolean;
    currency: number;
    priceMin?: string;
    priceMax?: string;
    bids: {
      privateBids: boolean;
      bids: boolean;
      noBids: boolean;
    };
    pendingRewardsMin?: string;
    pendingRewardsMax?: string;
    dueDate: number[];
  };
}

const initialState: NodesState = {
  tier: 'ODIN',
  sort: {
    orderBy: 'avaxPriceInWei',
    orderDirection: 'desc',
  },
  filter: {
    isModalOpen: false,
    currency: 0,
    priceMin: '',
    priceMax: '',
    bids: {
      privateBids: true,
      bids: true,
      noBids: true,
    },
    pendingRewardsMin: '',
    pendingRewardsMax: '',
    dueDate: [0, 30],
  },
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
      const { payload } = action;

      state.filter.currency = payload.currency;
      state.filter.priceMin = payload.priceMin;
      state.filter.priceMax = payload.priceMax;
      state.filter.bids = payload.bids;
      state.filter.pendingRewardsMin = payload.pendingRewardsMin;
      state.filter.pendingRewardsMax = payload.pendingRewardsMax;
      state.filter.dueDate = payload.dueDate;
    },
    resetFilter: (state) => {
      state.filter = {
        ...initialState.filter,
        isModalOpen: state.filter.isModalOpen,
      };
    },
    openFilterModal: (state) => {
      state.filter.isModalOpen = true;
    },
    closeFilterModal: (state) => {
      state.filter.isModalOpen = false;
    },
  },
});

export const {
  setTier,
  setSort,
  setFilter,
  resetFilter,
  openFilterModal,
  closeFilterModal,
} = nodesSlice.actions;

export default nodesSlice.reducer;
