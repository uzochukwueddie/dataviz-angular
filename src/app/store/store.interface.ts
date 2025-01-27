import { IAppDataSource } from "../features/datasources/interfaces/datasource.interface";
import { ISQLPayload } from "../shared/interfaces/app.interface";

export interface IReduxState {
  authUser: any;
  logout: boolean;
  datasource: IAppDataSource;
  collections: string[];
  documents: Array<Record<string, unknown>>,
  sqlQuery: ISQLPayload;
}
