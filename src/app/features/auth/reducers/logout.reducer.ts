import { createSlice, Slice } from '@reduxjs/toolkit';

const initialValue = true;

const logoutSlice: Slice = createSlice({
  name: 'logout',
  initialState: initialValue,
  reducers: {
    updateLogout: (state: any): any => {
      return state;
    },
  }
});

export const { updateLogout } = logoutSlice.actions;
export default logoutSlice.reducer;
