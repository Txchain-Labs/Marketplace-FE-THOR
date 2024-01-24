import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

export const STATUS = {
  STILL: 'still',
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error',
};

export interface transactionState {
  status: string;
  refetch: number;
  payload: any;
}

const initialState: transactionState = {
  status: 'still',
  refetch: 0,
  payload: {},
};

export const transactionSlice = createSlice({
  name: 'transactionSlice',
  initialState,
  reducers: {
    setTxnStatus: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.status>
    ) => {
      state.status = action.payload;
    },
    setRefetch: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.payload>
    ) => {
      state.refetch += 1;
      state.payload = action.payload;
    },
  },
});

export const { setTxnStatus, setRefetch } = transactionSlice.actions;

export default transactionSlice.reducer;
