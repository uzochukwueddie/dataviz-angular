import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Apollo, MutationResult } from 'apollo-angular';
import { ToastService } from '../../shared/services/toast.service';
import { Router } from '@angular/router';
import { injectAppSelector } from '../../store';
import { IReduxState } from '../../store/store.interface';
import { CommonModule } from '@angular/common';
import { ChartsGridComponent } from './components/charts-grid/charts-grid.component';
import { IChartInfo } from './interfaces/chart.interface';
import { firstValueFrom } from 'rxjs';
import { DELETE_CHART, GET_CHARTS } from './graphql/chartInfo';

@Component({
  selector: 'app-chart',
  imports: [CommonModule, ChartsGridComponent],
  templateUrl: './chart.component.html'
})
export class ChartComponent {
  private apollo: Apollo = inject(Apollo);
  private toastService = inject(ToastService);
  private router: Router = inject(Router);
  private authUser = injectAppSelector((state: IReduxState) => state.authUser);

  charts: WritableSignal<IChartInfo[]> = signal([]);
  filteredCharts: WritableSignal<IChartInfo[]> = signal([]);
  isLoading = signal<boolean>(false);
  filters = ['All', 'Number', 'Bar', 'Line', 'Pie'];
  activeFilter: string = 'All';

  ngOnInit(): void {
    this.getCharts();
  }

  toggleFilter(filter: string): void {
    this.activeFilter = filter;
    filter = filter.toLowerCase();
    if (filter === 'all') {
      this.filteredCharts.set(this.charts());
    } else {
      const filtered: IChartInfo[] = this.charts().filter((chart: IChartInfo) => chart.chartType === filter);
      this.filteredCharts.set(filtered);
    }
  }

  createNewChart(): void {
    this.router.navigate(['/charts/create']);
  }

  deleteCreatedChart(chartId: string): void {
    if (confirm('Are you sure you want to delete this chart?')) {
      this.apollo
      .mutate({
        mutation: DELETE_CHART,
        fetchPolicy: 'no-cache',
        variables: { chartId }
      })
      .subscribe({
        next: (result: MutationResult) => {
          if (result && result.data) {
            const { id } = result.data.deleteChart;
            const updatedCharts: IChartInfo[] = this.charts().filter((chart: IChartInfo) => chart.id !== id);
            this.charts.set(updatedCharts);
            this.filteredCharts.set(updatedCharts);
            this.toastService.show('Chart deleted successfully', 'success');
          }
        },
        error: () => {
          this.toastService.show('Error deleting chart', 'error');
        }
      });
    }
  }

  private async getCharts(): Promise<void> {
    try {
      this.isLoading.set(true);
      const { data } = await firstValueFrom(
        this.apollo.query({
          query: GET_CHARTS,
          fetchPolicy: 'no-cache',
          variables: { userId: this.authUser().id }
        })
      );
      const { getCharts } = data as any;
      this.charts.set(getCharts);
      this.filteredCharts.set(getCharts);
    } catch (error) {
      this.toastService.show('Failed to return charts', 'error');
    } finally {
      this.isLoading.set(false);
    }
  }

}
