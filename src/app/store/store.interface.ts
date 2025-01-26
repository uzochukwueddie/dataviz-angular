import { IAppDataSource } from "../features/datasources/interfaces/datasource.interface";

export interface IReduxState {
  authUser: any;
  logout: boolean;
  datasource: IAppDataSource;
}
