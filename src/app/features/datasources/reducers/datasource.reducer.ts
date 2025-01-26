import { createSlice, Slice } from '@reduxjs/toolkit';
import { IAppDataSource, IReduxDataSource } from '../interfaces/datasource.interface';

const initialValue: IAppDataSource = {
  active: null,
  database: '',
  dataSource: []
};

const datasourceSlice: Slice = createSlice({
  name: 'datasource',
  initialState: initialValue,
  reducers: {
    addDataSource: (state: IAppDataSource, action: IReduxDataSource): IAppDataSource => {
      const newDataSource = {
        active: action.payload.active,
        database: action.payload.database,
        dataSource: action.payload.dataSource
      };
      return {
        ...state,
        ...newDataSource
      };
    },
    clearDataSource: (): IAppDataSource => {
      return initialValue;
    }
  }
});

export const { addDataSource, clearDataSource } = datasourceSlice.actions;
export default datasourceSlice.reducer;
