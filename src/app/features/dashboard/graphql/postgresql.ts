import { gql } from 'apollo-angular';

export const GET_POSTGRESQL_TABLE_DATA = gql`
  query GetSQLQueryData($info: AiSQLQuery!) {
    getSQLQueryData(info: $info)
  }
`;

export const GET_POSTGRESQL_COLLECTIONS = gql`
  query GetPostgreSQLCollections($projectId: String!) {
    getPostgreSQLCollections(projectId: $projectId) {
      collections
      projectIds {
        id
        projectId
        type
        database
      }
    }
  }
`;

export const GET_SINGLE_POSTGRESQL_COLLECTIONS = gql`
  query GetSinglePostgreSQLCollections($projectId: String!) {
    getSinglePostgreSQLCollections(projectId: $projectId)
  }
`;

export const EXECUTE_POSTGRESQL_QUERY = gql`
  query ExecutePostgreSQLQuery($data: PostGresqlExecution!) {
    executePostgreSQLQuery(data: $data) {
      documents
    }
  }
`;

export const GET_POSTGRESQL_CHART_DATA = gql`
  query GetPostgreSQLChartData($query: PostgreSQLChartQuery!) {
    getPostgreSQLChartData(query: $query) {
      queryResponse
    }
  }
`;
