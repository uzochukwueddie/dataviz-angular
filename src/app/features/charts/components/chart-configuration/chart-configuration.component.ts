import { Component, effect, input, InputSignal, output, signal, WritableSignal } from '@angular/core';
import { CustomDropdownComponent, DropdownOption } from '../../../../shared/components/dropdown/custom-dropdown.component';
import { CommonModule } from '@angular/common';
import { ChartType, IChartConfiguration, IChartInfo, IChartResult } from '../../interfaces/chart.interface';
import { IAppDataSource, IDatasource } from '../../../datasources/interfaces/datasource.interface';
import { setLocalStorageItem } from '../../../../shared/utils/utils';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chart-configuration',
  imports: [CommonModule, CustomDropdownComponent, FormsModule],
  templateUrl: './chart-configuration.component.html',
  styles: ``
})
export class ChartConfigurationComponent {
  dropdownOptions = input<DropdownOption[]>([]);
  chartInfo: InputSignal<IChartInfo | null> = input<IChartInfo | null>(null);
  datasources: InputSignal<IAppDataSource | null> = input<IAppDataSource | null>(null);
  chartConfig: InputSignal<IChartResult | null> = input<IChartResult | null>(null);
  chartConfigData: InputSignal<IChartResult | null> = input<IChartResult | null>(null);
  configChange = output<IChartConfiguration>();
  chartChange = output<IChartResult>();

  defaultProject = signal<DropdownOption | null>(null);
  config: WritableSignal<IChartConfiguration> = signal({
    projectId: '',
    userPrompt: '',
    chartType: '',
  });
  chartTypes: ChartType[] = [
    {name: 'number', icon: 'fa-brands fa-creative-commons-zero'},
    {name: 'bar', icon: 'fa fa-chart-column'},
    {name: 'line', icon: 'fa fa-chart-line'},
    {name: 'pie', icon: 'fa fa-chart-pie'}
  ];

  get isConfigValid(): boolean {
    return Boolean(
      this.config().projectId &&
      this.config().chartType &&
      this.config().userPrompt.trim()
    );
  }

  constructor() {
    effect(() => {
      if (this.chartInfo()) {
        const { id, projectId, prompt, chartType } = this.chartInfo() as IChartInfo;
        this.config.set({
          projectId: `${projectId}`,
          userPrompt: prompt,
          chartType
        });
        this.defaultProject.set({
          id: `${id}`,
          label: projectId!,
          value: projectId!
        });
      }
    });
  }

  onSelectionChange(option: DropdownOption): void {
    this.config.update((value: IChartConfiguration) => {
      return {
        ...value,
        projectId: option.value
      }
    });
    const selectedDatasource = this.datasources()?.dataSource.find((source: IDatasource) => source.id === option.id);
    setLocalStorageItem('activeProject', JSON.stringify(selectedDatasource));
  }

  selectChartType(type: ChartType): void {
    this.config.update((value: IChartConfiguration) => {
      return {
        ...value,
        chartType: type.name
      }
    });
    if (this.chartConfig() && this.chartConfig()?.type !== 'number' && type.name !== 'pie') {
      const chart: IChartResult = {
        ...this.chartConfig(),
        type: type.name,
        ...(type.name === 'number' && {
          data: this.calculateTotal(this.chartConfig()!)
        })
      } as IChartResult;
      this.chartChange.emit(chart);
    }

    if (this.chartConfig() && this.chartConfig()?.type === 'number'
      && Array.isArray(this.chartConfigData()?.data) && type.name !== 'pie') {
        this.chartChange.emit({
          ...this.chartConfigData()!,
          type: type.name
        });
    }
  }

  calculateTotal(chart: IChartResult): number {
    const data = chart.data as Record<string, unknown>[];
    return data.reduce((sum, value: any) => sum + value[chart.yAxis], 0);
  }

  generateChart(): void {
    if (this.isConfigValid) {
      this.configChange.emit(this.config());
    }
  }

}
