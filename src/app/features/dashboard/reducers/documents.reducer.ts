import { createSlice, Slice } from '@reduxjs/toolkit';

interface IReduxDocuments {
  type: string;
  payload: Array<Record<string, unknown>>;
}

const initialValue: Array<Record<string, unknown>> = [];

const documentsSlice: Slice = createSlice({
  name: 'documents',
  initialState: initialValue,
  reducers: {
    addDocuments: (_: Array<Record<string, unknown>>, action: IReduxDocuments): Array<Record<string, unknown>> => {
      return action.payload;
    },
    clearDocuments: (): Array<Record<string, unknown>> => {
      return initialValue;
    }
  }
});

export const { addDocuments, clearDocuments } = documentsSlice.actions;
export default documentsSlice.reducer;
