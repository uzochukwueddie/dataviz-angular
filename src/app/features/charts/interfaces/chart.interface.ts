export type ChartType = {
  name: string;
  icon: string;
};

export interface IChartConfiguration {
  projectId: string;
  userPrompt: string;
  chartType: string;
}

export interface IChartResult {
  xAxis: string;
  yAxis: string;
  title: string;
  type: string;
  data: Record<string, unknown>[] | number | number[];
}

export interface IChartInfo {
  id?: string;
  datasourceId: string;
  projectId?: string;
  userId: string;
  chartName: string;
  chartType: string;
  xAxis: string;
  yAxis: string;
  queryData: string,
  chartData: string,
  prompt: string;
  sql: string;
}

export interface IChartDataView {
  chartData: Record<string, unknown>[];
  title?: string;
}
