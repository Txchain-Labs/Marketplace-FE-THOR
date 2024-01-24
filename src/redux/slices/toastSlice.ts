import { createSlice } from '@reduxjs/toolkit';

export const ToastSeverity = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
};

export interface toastOptions {
  autoHideDuration?: number;
  message: string;
  severity?: string;
  image?: string;
  link?: string;
  variant?: string;
  anchorOrigin?: object;
  itemCount?: number;
}

export interface toastState {
  state: boolean;
  options: toastOptions;
}

const initialState: toastState = {
  state: false,
  options: {
    autoHideDuration: 4000,
    message: 'Hi',
    severity: ToastSeverity.INFO,
    image: '/images/nftImage.png',
    link: '',
    variant: 'filled',
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'right',
    },
    itemCount: 0,
  },
};

export const toastSlice = createSlice({
  name: 'toastSlice',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.state = true;
      state.options = {
        ...initialState.options,
        ...action.payload,
      };
    },
    hideToast: (state) => {
      state.state = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;
