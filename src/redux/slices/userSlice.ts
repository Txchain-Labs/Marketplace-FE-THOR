import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  email: string;
  name: string;
  avaxBalance: string;
  thorBalance: string;
}

/**
 * Default state object with initial values.
 */
const initialState: UserState = {
  name: 'Sulhadin',
  email: 'sulhadin@gmail.com',
  avaxBalance: '-',
  thorBalance: '-',
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
    setName: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.name>
    ) => {
      state.name = action.payload;
    },
    setEmail: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.email>
    ) => {
      state.email = action.payload;
    },
    setAvaxBalance: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.avaxBalance>
    ) => {
      state.avaxBalance = action.payload;
    },
    setThorBalance: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.thorBalance>
    ) => {
      state.thorBalance = action.payload;
    },
  },
});

// A small helper of user state for `useSelector` function.
export const getUserState = (state: { user: UserState }) => state.user;

// Exports all actions
export const { setName, setEmail } = userSlice.actions;

export default userSlice.reducer;
