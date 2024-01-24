import { createSlice, Draft } from '@reduxjs/toolkit';

export interface CollectionState {
  collectionsLoading: boolean;
  collectionLoading: boolean;
  collections: any;
  collection: string;
}

/**
 * Default state object with initial values.
 */
const initialState: CollectionState = {
  collectionsLoading: false,
  collectionLoading: false,
  collections: null,
  collection: null,
} as any;

/**
 * Create a slice as a reducer containing actions.
 *
 * In this example actions are included in the slice. It is fine and can be
 * changed based on your needs.
 */
export const collectionSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCollections(state: Draft<typeof initialState>, action) {
      state.collections = action.payload.data;
      state.collectionsLoading = action.payload.collectionsLoading;
    },
    setCollection(state: Draft<typeof initialState>, action) {
      state.collection = action.payload.data;
      state.collectionLoading = action.payload.collectionLoading;
    },
  },
});

// A small helper of user state for `useSelector` function.
// export const getCollectionsState = (state: { collections: CollectionState }) =>
//   state.collections;

// Exports all actions
export const collectionsAction = collectionSlice.actions;

export default collectionSlice.reducer;
