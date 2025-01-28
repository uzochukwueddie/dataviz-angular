import { Component, inject, input, output, signal } from '@angular/core';
import { IChartDataView, IChartInfo } from '../../interfaces/chart.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChartDataModalComponent } from './chart-modal.component';

@Component({
  selector: 'app-charts-grid',
  imports: [CommonModule, ChartDataModalComponent],
  templateUrl: './charts-grid.component.html'
})
export class ChartsGridComponent {
  private router: Router = inject(Router);

  charts = input<IChartInfo[]>([]);
  showModal = signal<boolean>(false);
  selectedChart = signal<IChartDataView>({title: '', chartData: []});

  deleteInfoChange = output<string>();

  chartIcon(chart: IChartInfo): string {
    if (chart.chartType === 'bar') {
      return 'fa fa-chart-column';
    }  else if (chart.chartType === 'line') {
      return 'fa fa-chart-line';
    } else if (chart.chartType === 'number') {
      return 'fa-brands fa-creative-commons-zero';
    } else if (chart.chartType === 'pie') {
      return 'fa fa-chart-pie';
    } else {
      return 'fa fa-chart-column';
    }
  }

  updateChart(chartId: string | undefined): void {
    this.router.navigate([`/charts/edit/${chartId}`]);
  }

  deleteChart(chartId: string | undefined): void {
    this.deleteInfoChange.emit(chartId!);
  }

  openModal(chart: IChartInfo): void {
    this.selectedChart.set({
      title: chart.chartName,
      chartData: chart.chartType !== 'number' ? JSON.parse(chart.chartData) : JSON.parse(chart.queryData)
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }
}
