import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface NFTsState {
  searchText: string;
  sort: {
    orderBy: string | null;
    orderDirection: 'asc' | 'desc';
  };
  filter: {
    isModalOpen: boolean;
    listed: {
      listed: boolean;
      notListed: boolean;
    };
    bids: {
      privateBids: boolean;
      bids: boolean;
      noBids: boolean;
    };
    currency: number;
    priceMin: string;
    priceMax: string;
  };
}

const initialState: NFTsState = {
  searchText: '',
  sort: {
    orderBy: 'price',
    orderDirection: 'desc',
  },
  filter: {
    isModalOpen: false,
    listed: {
      listed: true,
      notListed: false,
    },
    bids: {
      privateBids: true,
      bids: true,
      noBids: true,
    },
    currency: 0,
    priceMin: '',
    priceMax: '',
  },
};

export const selectSearchText = (state: RootState) => state.nfts.searchText;
export const selectSort = (state: RootState) => state.nfts.sort;
export const selectFilter = (state: RootState) => state.nfts.filter;

const nftsSlice = createSlice({
  name: 'nfts',
  initialState,
  reducers: {
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setFilter: (state, action) => {
      const { payload } = action;

      state.filter.listed = payload.listed;
      state.filter.bids = payload.bids;
      state.filter.currency = payload.currency;
      state.filter.priceMin = payload.priceMin;
      state.filter.priceMax = payload.priceMax;
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
  setSearchText,
  setSort,
  setFilter,
  resetFilter,
  openFilterModal,
  closeFilterModal,
} = nftsSlice.actions;

export default nftsSlice.reducer;
