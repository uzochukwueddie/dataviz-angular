import { gql } from 'apollo-angular';

export const GET_AI_CHART_PROMPT_CONFIG = gql`
  query GenerateChart($info: AiChartQuery!) {
    generateChart(info: $info)
  }
`;
