import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  user: object;
  address: string;
  token: string;
  loading: boolean;
}

/**
 * Default state object with initial values.
 */
const initialState: UserState = {
  user: {},
  address: '',
  token: '',
  loading: false,
} as const;

/**
 * Create a slice as a reducer containing actions.
 *
 * In this example actions are included in the slice. It is fine and can be
 * changed based on your needs.
 */
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken(
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.token>
    ) {
      state.token = action.payload;
    },
    setAddress(
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.address>
    ) {
      state.address = action.payload;
    },
    setUser(
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.user>
    ) {
      state.user = action.payload;
    },
    setLoading(
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.loading>
    ) {
      state.loading = action.payload;
    },
    clearStates(state: Draft<typeof initialState>) {
      state.user = {};
      state.token = '';
      state.loading = false;
    },
  },
});

// A small helper of user state for `useSelector` function.
// export const getUserState = (state: { token: UserState }) => state.token;

// Exports all actions
export const authAction = userSlice.actions;

export default userSlice.reducer;
