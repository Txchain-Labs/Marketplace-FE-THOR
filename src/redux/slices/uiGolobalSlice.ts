import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

export interface uiGolobalState {
  activeCat: 'node' | 'art' | 'none';
}

const initialState: uiGolobalState = {
  activeCat: 'node',
};

export const uiGolobalStateSlice = createSlice({
  name: 'uiGolobalState',
  initialState,
  reducers: {
    setactiveCat: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.activeCat>
    ) => {
      state.activeCat = action.payload;
    },
  },
});

export const { setactiveCat } = uiGolobalStateSlice.actions;

export default uiGolobalStateSlice.reducer;
