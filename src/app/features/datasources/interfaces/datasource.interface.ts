export interface IReduxDataSource {
  type: string;
  payload: IAppDataSource;
}

export interface IDatasource {
  id: string;
  projectId: string;
  type: string;
  database?: string;
}

export interface IAppDataSource {
  active: IDatasource | null;
  database: string,
  dataSource: IDatasource[];
}

export interface IPostgreSQLDatasource {
  id?: string;
  userId?: string;
  projectId: string;
  databaseUrl: string;
  port: string;
  databaseName: string;
  username: string;
  password: string;
}
