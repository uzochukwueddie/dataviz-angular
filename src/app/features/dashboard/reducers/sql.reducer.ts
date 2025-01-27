import { createSlice, Slice } from '@reduxjs/toolkit';
import { ISQLPayload } from '../../../shared/interfaces/app.interface';

interface IReduxSQL {
  type: string;
  payload: string;
}

const initialValue: ISQLPayload = {
  promptQuery: '',
  sqlQuery: ''
};

const sqlSlice: Slice = createSlice({
  name: 'sqlQuery',
  initialState: initialValue,
  reducers: {
    addSQLQuery: (state: ISQLPayload, action: IReduxSQL): ISQLPayload => {
      return {
        ...state,
        sqlQuery: action.payload
      };
    },
    addPromptSQLQuery: (state: ISQLPayload, action: IReduxSQL): ISQLPayload => {
      return {
        ...state,
        promptQuery: action.payload
      };
    },
    clearSQLQuery: (state: ISQLPayload): ISQLPayload => {
      return {
        ...state,
        sqlQuery: ''
      };
    },
    clearPromptSQLQuery: (state: ISQLPayload): ISQLPayload => {
      return {
        ...state,
        promptQuery: ''
      };
    },
  }
});

export const { addPromptSQLQuery, addSQLQuery, clearSQLQuery, clearPromptSQLQuery } = sqlSlice.actions;
export default sqlSlice.reducer;
