import { Component, input, InputSignal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IChartDataView } from '../../interfaces/chart.interface';

@Component({
  selector: 'app-chart-data-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-xl w-full h-[75%] max-w-2xl">
        <div class="flex justify-between items-center p-6">
          <div>
            <h2 class="text-xl font-bold">Chart Data</h2>
            @if (chartData().title) {
            <p class="text-sm font-bold mb-2">{{ chartData().title }}</p>
            }
          </div>
          <button (click)="onClose.emit()" class="text-gray-400 hover:text-gray-600">
            <i class="fa fa-xmark"></i>
          </button>
        </div>
        <div class="px-6">
          <p class="text-sm mb-4">The following chart data is used to render this visualization.</p>
          <div class="bg-gray-100 py-4 overflow-y-scroll max-h-80">
            <table class="w-full border-collapse text-sm">
              <thead>
                <tr class="border-b border-gray-300">
                  @for (key of keys; track key) {
                  <th class="text-left pb-2 px-4 whitespace-nowrap">{{ key }}</th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (item of chartData().chartData; track item) {
                  <tr class="border-b border-gray-300 last:border-b-0">
                    @for (column of keys; track column) {
                      <td class="py-3 px-4 whitespace-nowrap overflow-hidden text-ellipsis">
                        {{ item[column] }}
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ChartDataModalComponent {
  chartData: InputSignal<IChartDataView> = input<IChartDataView>({ title: '', chartData: [] });
  onClose = output<void>();

  get keys(): string[] {
    return this.chartData().chartData.length > 0 ? Object.keys(this.chartData().chartData[0]) : [];
  }
}
