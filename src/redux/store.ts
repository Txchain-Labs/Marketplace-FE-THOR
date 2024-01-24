import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import {
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
} from 'react-redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import authReducer from './slices/authSlice';
import collectionReducer from './slices/collectionSlice';
import uiGolobalStateReducer from './slices/uiGolobalSlice';
import dummyDataReducer from './slices/dummyData';
import transactionReducer from './slices/transactionSlice';
import nodesReducer from './slices/nodesSlice';
import toastReducer from './slices/toastSlice';
import cartReducer from './slices/cartSlice';

/**
 * Creates a store and includes all the slices as reducers.
 */

const reducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  collections: collectionReducer,
  uiGolobal: uiGolobalStateReducer,
  dummy: dummyDataReducer,
  txn: transactionReducer,
  nodes: nodesReducer,
  toast: toastReducer,
  cart: cartReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: { users: UsersState}
type AppDispatch = typeof store.dispatch;

// Since we use typescript, lets utilize `useDispatch`
export const useDispatch = () => useDispatchBase<AppDispatch>();

// And utilize `useSelector`
export const useSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected
): TSelected => useSelectorBase<RootState, TSelected>(selector);
