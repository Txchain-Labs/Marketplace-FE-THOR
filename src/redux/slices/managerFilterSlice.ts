import { createSlice } from '@reduxjs/toolkit';

interface FilterState {
  activeView: string;
  searchText: string;
  sort: {
    orderBy: string | null;
    orderDirection: 'asc' | 'desc';
  };
  filter: {
    isModalOpen: boolean;
    favs: {
      favourited: boolean;
      notFavourited: boolean;
    };
    status: {
      listed: boolean;
      notListed: boolean;
    };

    bids: {
      privateBids: boolean;
      bids: boolean;
      noBids: boolean;
    };
    perks: {
      withPerks: boolean;
      withoutPerks: boolean;
    };
    tier: {
      thor: boolean;
      odin: boolean;
    };
    condition: {
      inactive: boolean;
      inuse: boolean;
      unclaimed: boolean;
      claimed: boolean;
    };
    price: {
      currency: number;
      min: string;
      max: string;
    };
    pendingRewards: {
      min: string;
      max: string;
    };
    dueDate: number[];
  };
  isFilterApplied: boolean;
  showFilter: {
    favs: boolean;
    status: boolean;
    bids: boolean;
    perks: boolean;
    tier: boolean;
    condition: boolean;
    price: boolean;
    pendingRewards: boolean;
    dueDate: boolean;
  };
}
export const filterInitialState = {
  favs: {
    favourited: true,
    notFavourited: true,
  },
  status: {
    listed: true,
    notListed: true,
  },
  bids: {
    privateBids: true,
    bids: true,
    noBids: true,
  },
  perks: {
    withPerks: true,
    withoutPerks: true,
  },
  tier: {
    thor: true,
    odin: true,
  },
  condition: {
    inactive: true,
    inuse: true,
    unclaimed: true,
    claimed: true,
  },
  price: {
    currency: 0,
    min: '',
    max: '',
  },
  pendingRewards: {
    min: '',
    max: '',
  },
  dueDate: [0, 366],
};

const initialState: FilterState = {
  activeView: 'list',
  searchText: '',
  sort: {
    orderBy: 'price',
    orderDirection: 'desc',
  },
  filter: {
    isModalOpen: false,
    ...filterInitialState,
  },
  isFilterApplied: false,
  showFilter: {
    favs: false,
    status: false,
    bids: false,
    perks: false,
    tier: false,
    condition: false,
    price: false,
    pendingRewards: false,
    dueDate: false,
  },
};

export const filterAppliedStatus = (state: { managerFilter: FilterState }) =>
  state.managerFilter.isFilterApplied;
export const selectSearchText = (state: { managerFilter: FilterState }) =>
  state.managerFilter.searchText;
export const selectSort = (state: { managerFilter: FilterState }) =>
  state.managerFilter.sort;
export const selectFilter = (state: { managerFilter: FilterState }) =>
  state.managerFilter.filter;
export const selectShowFilter = (state: { managerFilter: FilterState }) =>
  state.managerFilter.showFilter;
export const dataActiveView = (state: { managerFilter: FilterState }) =>
  state.managerFilter.activeView;
const managerFilterSlice = createSlice({
  name: 'managerFilters',
  initialState,
  reducers: {
    setDataView: (state, action) => {
      state.activeView = action.payload;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },

    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setFilter: (state, action) => {
      const { payload } = action;
      state.filter = {
        ...payload,
      };
    },
    showFilter: (state, action) => {
      const { payload } = action;
      if (payload?.favs) {
        state.showFilter = {
          ...state.showFilter,
          favs: true,
        };
      }
      if (payload?.status) {
        state.showFilter = {
          ...state.showFilter,
          status: true,
        };
      }
      if (payload?.bids) {
        state.showFilter = {
          ...state.showFilter,
          bids: true,
        };
      }
      if (payload?.perks) {
        state.showFilter = {
          ...state.showFilter,
          perks: true,
        };
      }
      if (payload?.tier) {
        state.showFilter = {
          ...state.showFilter,
          tier: true,
        };
      }
      if (payload?.condition) {
        state.showFilter = {
          ...state.showFilter,
          condition: true,
        };
      }
      if (payload?.price) {
        state.showFilter = {
          ...state.showFilter,
          price: true,
        };
      }
      if (payload?.pendingRewards) {
        state.showFilter = {
          ...state.showFilter,
          pendingRewards: true,
        };
      }
      if (payload?.dueDate) {
        state.showFilter = {
          ...state.showFilter,
          dueDate: true,
        };
      }
    },
    resetFilter: (state) => {
      // state = {
      //   ...state,
      // };
      state.filter = {
        ...initialState.filter,
        isModalOpen: state.filter.isModalOpen,
      };
      state.showFilter = {
        ...initialState.showFilter,
      };
      state.isFilterApplied = false;
    },
    setFilterStatus: (state, action) => {
      const { payload } = action;
      state.isFilterApplied = payload;
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
  showFilter,
  resetFilter,
  openFilterModal,
  closeFilterModal,
  setDataView,
  setFilterStatus,
} = managerFilterSlice.actions;

export default managerFilterSlice.reducer;
