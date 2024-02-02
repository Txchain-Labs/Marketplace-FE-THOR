import { createSlice } from '@reduxjs/toolkit';
import { BagListing } from '../../models/BagListing';

export interface BagListState {
  isOpen: boolean;
  bagListed: BagListing[];
  bagListedIds: string[];
  tabState: number;
  ownedBagListed: BagListing[];
  onsaleBagListed: BagListing[];
  dataRefetching: number;
}

const initialState: BagListState = {
  isOpen: false,
  bagListed: [],
  bagListedIds: [],
  tabState: 0,
  ownedBagListed: [],
  onsaleBagListed: [],
  dataRefetching: 0,
};

console.log('id2cartedIndex state');
export const selectBagListed = (state: { bagList: BagListState }) =>
  state.bagList?.bagListed ?? [];
export const selectIsBagListOpen = (state: { bagList: BagListState }) =>
  state.bagList?.isOpen;
export const selectId2bagListedIndex = (state: { bagList: BagListState }) =>
  state.bagList.bagListedIds;
export const selectTabState = (state: { bagList: BagListState }) =>
  state.bagList;
export const getNFTsRefetching = (state: { bagList: BagListState }) =>
  state.bagList?.dataRefetching;
const bagListSlice = createSlice({
  name: 'bagList',
  initialState,
  reducers: {
    openBagListModal: (state) => {
      state.isOpen = true;
    },
    closeBagListModal: (state) => {
      state.isOpen = false;
    },
    setTabState: (state, action: { payload: any }) => {
      state.tabState = action.payload.value;
      state.ownedBagListed = action.payload.owned;
      state.onsaleBagListed = action.payload.onsale;
    },
    addToBagList: (state, action: { payload: any }) => {
      const id: string = action.payload.token_address + action.payload.token_id;
      if (state.bagListedIds.includes(id)) return;
      state.bagListedIds.push(id);
      state.bagListed.push(action.payload);
    },
    removeFromBagList: (state, action) => {
      const id: string = action.payload;

      const bagListedIndex = state.bagListedIds.findIndex(
        (bagListedId) => bagListedId === id
      );

      if (bagListedIndex > -1) {
        state.bagListedIds.splice(bagListedIndex, 1);
        state.bagListed.splice(bagListedIndex, 1);
      }
    },
    removeOnSaleItem: (state, action) => {
      const { tokenAddress, tokenId } = action.payload;
      return {
        ...state,
        onsaleBagListed: state.onsaleBagListed.filter(
          (item) =>
            item.token_address !== tokenAddress || item.token_id !== tokenId
        ),
      };
    },
    resetAll: (state) => {
      state.bagListedIds = [];
      state.bagListed = [];
      state.tabState = 0;
      state.ownedBagListed = [];
      state.onsaleBagListed = [];
    },
    setNFTsRefetching: (state) => {
      state.dataRefetching = state.dataRefetching + 1;
    },
  },
});

export const {
  removeOnSaleItem,
  openBagListModal,
  closeBagListModal,
  addToBagList,
  setTabState,
  removeFromBagList,
  resetAll,
  setNFTsRefetching,
} = bagListSlice.actions;

export default bagListSlice.reducer;
