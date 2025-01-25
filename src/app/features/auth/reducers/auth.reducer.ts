import { createSlice, Slice } from '@reduxjs/toolkit';
import { IReduxAddAuthUser } from '../interfaces/auth.interface';

const initialValue: any = {};

const authSlice: Slice = createSlice({
  name: 'auth',
  initialState: initialValue,
  reducers: {
    addAuthUser: (state: any, action: IReduxAddAuthUser): any => {
      const { authInfo } = action.payload;
      const newObj = {...authInfo};
      return {
        ...state,
        ...newObj
      };
    },
    clearAuthUser: (): any => {
      return initialValue;
    }
  }
});

export const { addAuthUser, clearAuthUser } = authSlice.actions;
export default authSlice.reducer;
