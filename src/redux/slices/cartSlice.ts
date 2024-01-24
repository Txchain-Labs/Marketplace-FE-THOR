import { createSlice } from '@reduxjs/toolkit';
import { Listing } from '../../models/Listing';

export interface CartState {
  isOpen: boolean;
  carted: Listing[];
  cartedIds: string[];
}

const initialState: CartState = {
  isOpen: false,
  carted: [],
  cartedIds: [],
};

export const selectCarted = (state: { cart: CartState }) => state.cart.carted;
export const selectIsCartOpen = (state: { cart: CartState }) =>
  state.cart.isOpen;
export const selectId2cartedIndex = (state: { cart: CartState }) =>
  state.cart.cartedIds;

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    openCartModal: (state) => {
      state.isOpen = true;
    },
    closeCartModal: (state) => {
      state.isOpen = false;
    },
    addToCart: (state, action: { payload: any }) => {
      const id: string = action.payload.nftAddress + action.payload.tokenId;

      if (state.cartedIds.includes(id)) return;

      state.cartedIds.push(id);
      state.carted.push(action.payload);
    },
    removeFromCart: (state, action) => {
      const id: string = action.payload;

      const cartedIndex = state.cartedIds.findIndex(
        (cartedId) => cartedId === id
      );

      if (cartedIndex > -1) {
        state.cartedIds.splice(cartedIndex, 1);
        state.carted.splice(cartedIndex, 1);
      }
    },
    resetAll: (state) => {
      state.cartedIds = [];
      state.carted = [];
    },
  },
});

export const {
  openCartModal,
  closeCartModal,
  addToCart,
  removeFromCart,
  resetAll,
} = cartSlice.actions;

export default cartSlice.reducer;
