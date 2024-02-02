import { createSlice } from '@reduxjs/toolkit';

interface BagState {
  isModalOpen: boolean;
  bagCurrentState: number;
  bagListedIds: Array<any>;
  bagListedItems: Array<any>;
  bagUnListedIds: Array<any>;
  bagUnListedItems: Array<any>;
  dataRefetching: number;
}
// Bag state 0 default all active , 1 Listed active , 2 Not listed active
const initialState: BagState = {
  isModalOpen: false,
  bagCurrentState: 0,
  bagListedIds: [],
  bagListedItems: [],
  bagUnListedIds: [],
  bagUnListedItems: [],
  dataRefetching: 0,
};

export const selectBagListedIds = (state: { managerBags: BagState }) =>
  state.managerBags?.bagListedIds ?? [];
export const selectBagUnListedIds = (state: { managerBags: BagState }) =>
  state.managerBags?.bagUnListedIds ?? [];
export const selectBagUnListedItems = (state: { managerBags: BagState }) =>
  state.managerBags?.bagUnListedItems;
export const selectBagListedItems = (state: { managerBags: BagState }) =>
  state.managerBags.bagListedItems;
export const selectBagState = (state: { managerBags: BagState }) =>
  state.managerBags.bagCurrentState;
export const isModalOpen = (state: { managerBags: BagState }) =>
  state.managerBags.isModalOpen;
export const isDataRefetching = (state: { managerBags: BagState }) =>
  state.managerBags.dataRefetching;

const managerBagSlice = createSlice({
  name: 'managerBags',
  initialState,
  reducers: {
    openBagModal: (state) => {
      state.isModalOpen = true;
    },
    closeBagModal: (state) => {
      state.isModalOpen = false;
    },
    setBagState: (state, action) => {
      const { payload } = action;
      if (payload?.item) {
        if (payload?.item.isListed) {
          if (state.bagCurrentState !== 1) {
            state.bagCurrentState = 1;
          } else {
            if (state.bagListedIds.length <= 0) {
              state.bagCurrentState = 0;
            }
          }
        } else {
          if (state.bagCurrentState !== 2) {
            state.bagCurrentState = 2;
          } else {
            if (state.bagUnListedIds.length <= 0) {
              state.bagCurrentState = 0;
            }
          }
        }
      }
      // state.bagCurrentState = payload;
    },
    addItemToBag: (state, action) => {
      const { payload } = action;
      if (payload.isListed) {
        if (state.bagListedIds.includes(payload.id)) return;
        if (state.bagListedIds.length >= 30) return;
        state.bagListedIds.push(payload.id);
        state.bagListedItems.push(action.payload);
      } else {
        if (state.bagUnListedIds.includes(payload.id)) return;
        if (state.bagUnListedIds.length >= 50) return;
        state.bagUnListedIds.push(payload.id);
        state.bagUnListedItems.push(action.payload);
      }
    },
    removeItemFromBag: (state, action) => {
      const { payload } = action;

      if (payload.isListed) {
        const bagListedIndex = state.bagListedIds.findIndex(
          (bagListedId) => bagListedId === payload.id
        );
        if (bagListedIndex > -1) {
          state.bagListedIds.splice(bagListedIndex, 1);
          state.bagListedItems.splice(bagListedIndex, 1);
        }
      } else {
        const bagUnListedIndex = state.bagUnListedIds.findIndex(
          (bagUnListedId) => bagUnListedId === payload.id
        );
        if (bagUnListedIndex > -1) {
          state.bagUnListedIds.splice(bagUnListedIndex, 1);
          state.bagUnListedItems.splice(bagUnListedIndex, 1);
        }
      }
    },
    resetBag: (state) => {
      state.bagListedIds = [];
      state.bagListedItems = [];
      state.bagUnListedIds = [];
      state.bagUnListedItems = [];
      state.bagCurrentState = 0;
      // state.dataRefetching = false;
    },
    setDataRefetching: (state) => {
      state.dataRefetching = state.dataRefetching + 1;
    },
    // setDataRefetchingFalse: (state) => {
    //   state.dataRefetching = false;
    // },
  },
});

export const {
  openBagModal,
  closeBagModal,
  setBagState,
  addItemToBag,
  removeItemFromBag,
  resetBag,
  // setDataRefetchingFalse,
  setDataRefetching,
} = managerBagSlice.actions;

export default managerBagSlice.reducer;
