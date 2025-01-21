import { injectDispatch, injectSelector } from '@reduxjs/angular-redux';
import { configureStore } from '@reduxjs/toolkit';

export interface RootState {}

const rootReducer = (state: RootState | undefined, action: any): RootState => {
  if (action.type === 'logout/updateLogout') {

  }

  return {};
}

export const store = configureStore({
  reducer: rootReducer
});

export type AppDispatch = typeof store.dispatch;

export const injectAppDispatch = injectDispatch.withTypes<AppDispatch>();
export const injectAppSelector = injectSelector.withTypes<RootState>();
