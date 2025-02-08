import { CommonModule } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { HighlightModule } from 'ngx-highlightjs';
import { IChartInfo, IChartResult } from '../../interfaces/chart.interface';
import { NumberDisplayComponent } from '../charts/number.component';
import { BarChartComponent } from '../charts/bar.component';
import { LineChartComponent } from '../charts/line.component';
import { PieChartComponent } from '../charts/pie.component';

@Component({
  selector: 'app-chart-preview',
  imports: [
    NumberDisplayComponent,
    BarChartComponent,
    LineChartComponent,
    PieChartComponent,
    CommonModule,
    HighlightModule
  ],
  templateUrl: './chart-preview.component.html'
})
export class ChartPreviewComponent {
  sqlQuery = input<string>('');
  chartConfig = input<IChartResult | null>(null);
  isLoading = input<boolean>(false);
  chartInfoChange = output<IChartInfo>();

  number = signal<number>(0);

  constructor() {
    effect(() => {
      if (this.chartConfig()) {
        const { data } = this.chartConfig() as IChartResult;
        if (this.chartConfig()?.type === 'number') {
          this.number.set(data as number);
        }
      }
    })
  }

  saveChart(): void {
    const { data, title, xAxis, yAxis, type } = this.chartConfig() as IChartResult;
    const info: IChartInfo = {
      datasourceId: '',
      userId: '',
      chartName: title,
      chartType: type,
      xAxis,
      yAxis,
      queryData: '',
      chartData: JSON.stringify(data),
      prompt: '',
      sql: ''
    };
    this.chartInfoChange.emit(info);
  }

}
