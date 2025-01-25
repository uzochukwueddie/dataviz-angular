import { injectDispatch, injectSelector } from '@reduxjs/angular-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/reducers/auth.reducer';

export interface RootState {
  authUser: ReturnType<typeof authReducer>
}

const rootReducer = (state: RootState | undefined, action: any): RootState => {
  if (action.type === 'logout/updateLogout') {
    return {
      authUser: authReducer(undefined, action)
    };
  }

  return {
    authUser: authReducer(state?.authUser, action),
  };
}

export const store = configureStore({
  reducer: rootReducer
});

export type AppDispatch = typeof store.dispatch;

export const injectAppDispatch = injectDispatch.withTypes<AppDispatch>();
export const injectAppSelector = injectSelector.withTypes<RootState>();
