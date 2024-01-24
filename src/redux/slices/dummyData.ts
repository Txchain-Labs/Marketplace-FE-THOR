import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

export interface NFTDetailState {
  data: any;
}

/**
 * Default state object with initial values.
 */
const initialState: NFTDetailState = {
  data: [],
} as any;

/**
 * Create a slice as a reducer containing actions.
 *
 * In this example actions are included in the slice. It is fine and can be
 * changed based on your needs.
 */
export const dummyData = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setData(
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.data>
    ) {
      if (action.payload.length) {
        state.data = [...state.data, ...action.payload];
      } else {
        state.data = [];
      }
    },
  },
});

// A small helper of user state for `useSelector` function.
// export const getCollectionsState = (state: { collections: CollectionState }) =>
//   state.collections;

// Exports all actions
export const nftActions = dummyData.actions;

export default dummyData.reducer;
