import { injectDispatch, injectSelector } from '@reduxjs/angular-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/reducers/auth.reducer';
import logoutReducer from '../features/auth/reducers/logout.reducer';
import datasourceReducer from '../features/datasources/reducers/datasource.reducer';

export interface RootState {
  authUser: ReturnType<typeof authReducer>,
  logout: ReturnType<typeof logoutReducer>,
  datasource: ReturnType<typeof datasourceReducer>,
}

const rootReducer = (state: RootState | undefined, action: any): RootState => {
  if (action.type === 'logout/updateLogout') {
    return {
      authUser: authReducer(undefined, action),
      logout: logoutReducer(undefined, action),
      datasource: datasourceReducer(undefined, action),
    };
  }

  return {
    authUser: authReducer(state?.authUser, action),
    logout: authReducer(state?.logout, action),
    datasource: datasourceReducer(state?.datasource, action),
  };
}

export const store = configureStore({
  reducer: rootReducer
});

export type AppDispatch = typeof store.dispatch;

export const injectAppDispatch = injectDispatch.withTypes<AppDispatch>();
export const injectAppSelector = injectSelector.withTypes<RootState>();
