import { createSlice, Slice } from '@reduxjs/toolkit';
import { IReduxAddAuthUser } from '../interfaces/auth.interface';
import { IUser } from '../../../shared/interfaces/user.interface';

const initialValue: IUser = {} as IUser;

const authSlice: Slice = createSlice({
  name: 'auth',
  initialState: initialValue,
  reducers: {
    addAuthUser: (state: IUser, action: IReduxAddAuthUser): IUser => {
      const { authInfo } = action.payload;
      const newObj = {...authInfo};
      return {
        ...state,
        ...newObj
      };
    },
    clearAuthUser: (): IUser => {
      return initialValue;
    }
  }
});

export const { addAuthUser, clearAuthUser } = authSlice.actions;
export default authSlice.reducer;
