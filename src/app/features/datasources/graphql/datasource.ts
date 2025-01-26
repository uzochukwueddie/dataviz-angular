import { gql } from 'apollo-angular';

export const CHECK_POSTGRESQL_CONNECTION = gql`
  mutation CheckPostgresqlConnection($datasource: DataSourceInfo!) {
    checkPostgresqlConnection(datasource: $datasource) {
      message
    }
  }
`;

export const CREATE_POSTGRESQL_DATASOURCE = gql`
  mutation CreatePostgresqlDataSource($source: DataSourceInfo!) {
    createPostgresqlDataSource(source: $source) {
      dataSource {
        id
        projectId
        type
        database
      }
    }
  }
`;

export const EDIT_DATASOURCE = gql`
  mutation EditDataSource($source: DataSourceInfo!) {
    editDataSource(source: $source) {
      dataSource {
        id
        projectId
        type
        database
      }
    }
  }
`;

export const GET_DATA_SOURCES = gql`
  query GetDataSources {
    getDataSources {
      dataSource {
        id
        projectId
        type
        database
      }
    }
  }
`;
export const GET_SINGLE_DATA_SOURCE = gql`
  query GetDataSourceByProjectId($projectId: String!) {
    getDataSourceByProjectId(projectId: $projectId) {
      id
      userId
      projectId
      databaseUrl
      createdAt
      type
      port
      databaseName
      username
      password
    }
  }
`;

export const DELETE_DATA_SOURCE = gql`
  mutation DeleteDatasource($datasourceId: String!) {
    deleteDatasource(datasourceId: $datasourceId) {
      id
    }
  }
`;
