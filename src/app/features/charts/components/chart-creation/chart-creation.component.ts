import { CommonModule, Location } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ChartConfigurationComponent } from '../chart-configuration/chart-configuration.component';
import { Apollo, MutationResult } from 'apollo-angular';
import { ToastService } from '../../../../shared/services/toast.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { injectAppSelector } from '../../../../store';
import { IReduxState } from '../../../../store/store.interface';
import { IChartConfiguration, IChartInfo, IChartResult } from '../../interfaces/chart.interface';
import { DropdownOption } from '../../../../shared/components/dropdown/custom-dropdown.component';
import { IDatasource } from '../../../datasources/interfaces/datasource.interface';
import { firstValueFrom } from 'rxjs';
import { GET_AI_CHART_PROMPT_CONFIG } from '../../graphql/aiCharts';
import { ChartPreviewComponent } from '../chart-preview/chart-preview.component';
import { getLocalStorageItem } from '../../../../shared/utils/utils';
import { CREATE_NEW_CHART, GET_CHARTS_INFO, UPDATE_CHART } from '../../graphql/chartInfo';

@Component({
  selector: 'app-chart-creation',
  imports: [CommonModule, RouterModule, ChartConfigurationComponent, ChartPreviewComponent],
  templateUrl: './chart-creation.component.html',
  styles: ``
})
export class ChartCreationComponent {
  private readonly apollo: Apollo = inject(Apollo);
  private toastService = inject(ToastService);
  private readonly router: Router = inject(Router);
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private authUser = injectAppSelector((state: IReduxState) => state.authUser);

  rootDatasource = injectAppSelector((state: IReduxState) => state.datasource);

  chartResult: WritableSignal<IChartResult | null> = signal<IChartResult | null>(null);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  dropdownOptions: WritableSignal<DropdownOption[]> = signal<DropdownOption[]>([]);
  chartInfo: WritableSignal<IChartInfo | null> = signal(null);
  sqlQuery = signal('');
  chartInfoId = signal('');
  prompt = signal('');
  queryData = signal([]);
  originalChartData = signal<IChartResult | null>(null);
  isEditPage = signal(false);

  constructor() {
    this.isEditPage.set(this.location.path().includes('/charts/edit'));
    const dataSources = this.rootDatasource().dataSource;
    const mappedDatasources = dataSources.map((source: IDatasource) => {
      return {
        id: source.id,
        value: source.projectId,
        label: source.projectId
      };
    });
    this.dropdownOptions.set(mappedDatasources);
    const chartId = this.route.snapshot.paramMap.get('chartId');
    if (chartId) {
      this.getChartInfo(chartId);
    }
  }

  onConfigChange(config: IChartConfiguration): void {
    this.prompt.set(config.userPrompt);
    this.getAIChartData(config);
  }

  onChartChange(chart: IChartResult): void {
    if (this.originalChartData()?.type !== 'number' && chart.type === 'number') {
      this.chartResult.set(chart);
    } else {
      this.chartResult.set({
        ...this.originalChartData()!,
        type: chart.type
      });
    }
  }

  saveChart(event: IChartInfo): void {
    const activeProject = getLocalStorageItem('activeProject');
    const info: IChartInfo = {
      ...event,
      ...(this.isEditPage() && {
        id: this.chartInfoId()
      }),
      datasourceId: activeProject.id,
      userId: this.authUser().id,
      sql: this.sqlQuery(),
      prompt: this.prompt(),
      queryData: JSON.stringify(this.queryData())
    };
    this.apollo
    .mutate({
      mutation: this.isEditPage() ? UPDATE_CHART : CREATE_NEW_CHART,
      fetchPolicy: 'no-cache',
      variables: {
        ...(this.isEditPage() && {
          chartId: info.id
        }),
        data: info
      }
    })
    .subscribe({
      next: (result: MutationResult) => {
        if (result && result.data) {
          this.toastService.show(`Chart ${this.isEditPage() ? 'updated' : 'saved'} successfully`, 'success');
          this.router.navigate(['/charts']);
        }
      },
      error: () => {
        this.toastService.show(`Error ${this.isEditPage() ? 'updating' : 'saving'} chart`, 'error');
      }
    })
  }

  private async getAIChartData(config: IChartConfiguration): Promise<void> {
    try {
      this.isLoading.set(true);
      const { data } = await firstValueFrom(
        this.apollo.query({
          query: GET_AI_CHART_PROMPT_CONFIG,
          fetchPolicy: 'no-cache',
          variables: {
            info: config
          }
        })
      );
      const { generateChart } = data as any;
      const { promptResult, sql, queryResult } = JSON.parse(generateChart);
      const resultString = promptResult.input.chart;
      const obj = {
        ...resultString,
        type: promptResult.input.chartType
      };
      this.chartResult.set(obj);
      this.originalChartData.set(obj);
      const sqlData = sql.replace(/\n/g, ' ');
      this.sqlQuery.set(sqlData.replace(/\s+/g, ' '));
      this.queryData.set(queryResult);
    } catch (error) {
      this.toastService.show('Failed to generate chart', 'error');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async getChartInfo(chartId: string): Promise<void> {
    try {
      const { data } = await firstValueFrom(
        this.apollo.query({
          query: GET_CHARTS_INFO,
          fetchPolicy: 'no-cache',
          variables: {
            chartId
          }
        })
      );
      const { getChartInfo } = data as any;
      const {
        id, sql, chartName, xAxis, yAxis,
        chartType, chartData, prompt, queryData
      } = getChartInfo as IChartInfo;
      this.chartInfoId.set(`${id}`);
      this.chartInfo.set(getChartInfo);
      this.sqlQuery.set(sql);
      this.prompt.set(prompt);
      this.queryData.set(JSON.parse(queryData));
      const info = {
        xAxis,
        yAxis,
        title: chartName,
        type: chartType,
        data: JSON.parse(chartData)
      };
      this.chartResult.set(info);
      this.originalChartData.set(info);
    } catch (error) {
      this.toastService.show('Failed to chart data.', 'error');
    }
  }

}
