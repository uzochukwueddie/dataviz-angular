import { gql } from '@apollo/client/core';

// Fragment definition
export const CHART_FRAGMENT = gql`
  fragment ChartFields on ChartInfoResponse {
    id
    datasourceId
    userId
    projectId
    chartName
    chartType
    xAxis
    yAxis
    queryData
    chartData
    prompt
    sql
    createdAt
  }
`;

// Queries
export const GET_CHARTS = gql`
  query GetCharts($userId: String!) {
    getCharts(userId: $userId) {
      id
      datasourceId
      userId
      projectId
      chartName
      chartType
      xAxis
      yAxis
      queryData
      chartData
      prompt
      sql
      createdAt
    }
  }
`;

export const GET_CHARTS_INFO = gql`
  query GetChartInfo($chartId: String!) {
    getChartInfo(chartId: $chartId) {
      id
      datasourceId
      userId
      projectId
      chartName
      chartType
      xAxis
      yAxis
      queryData
      chartData
      prompt
      sql
      createdAt
    }
  }
`;

// Mutations
export const CREATE_NEW_CHART = gql`
  mutation CreateNewChartInfo($data: ChartInfoQuery!) {
    createNewChartInfo(data: $data) {
      id
      datasourceId
      userId
      chartName
      chartType
      xAxis
      yAxis
      queryData
      chartData
      prompt
      sql
      createdAt
    }
  }
`;

export const UPDATE_CHART = gql`
  mutation UpdateChart($chartId: String!, $data: ChartInfoQuery!) {
    updateChart(chartId: $chartId, data: $data) {
      id
      datasourceId
      userId
      chartName
      chartType
      xAxis
      yAxis
      queryData
      chartData
      prompt
      sql
      createdAt
    }
  }
`;

export const DELETE_CHART = gql`
  mutation DeleteChart($chartId: String!) {
    deleteChart(chartId: $chartId) {
      id
    }
  }
`;
