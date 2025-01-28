import { Component, ViewChild, ElementRef, input, computed, Signal, effect } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { IChartResult } from '../../interfaces/chart.interface';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  template: `
    <canvas #chartCanvas class="min-w-[800px]"></canvas>
  `
})
export class PieChartComponent {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  chart: Chart | null = null;

  chartData = input<IChartResult | null>(null);
  chartDataComputed: Signal<IChartResult | null> = computed(() => this.chartData());

  constructor() {
    effect(() => {
      if (this.chart) {
        this.chart.destroy();
      }
      this.createChart();
    });
  }

  ngAfterViewInit() {
    this.createChart();
  }

  // Calculate the total for percentage calculations
  private calculateTotal(data: Record<string, unknown>[]): number {
    return data.reduce((sum, value: any) => sum + value?.value, 0);
  }

  // Format numbers for better readability
  private formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }

  createChart(): void {
    const canvas = this.chartCanvas?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { data } = this.chartDataComputed() as IChartResult;
    const chartData = data as Record<string, unknown>[];
    const totalCount = this.calculateTotal(chartData);

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: chartData.map((item: any) => item.segment),
        datasets: [{
          data: chartData.map((item: any) => item.value),
          backgroundColor: chartData.map((item: any) => item.color),
          borderColor: '#3B82F6', // Primary line color
          borderWidth: 2,
          hoverBackgroundColor: chartData.map((item: any) => item.color.replace('0.8', '1')),
          hoverBorderColor: '#ffffff',
          hoverBorderWidth: 3,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 2,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                family: "'Inter', sans-serif",
                size: 14
              },
              generateLabels: (chart) => {
                const data = chart.data;
                if (data.labels && data.datasets) {
                  return data.labels.map((label, i) => {
                    const chartInfo = chartData[i] as any;
                    const value = data.datasets[0].data[i] as number;
                    const percentage = ((value / totalCount) * 100).toFixed(1);
                    return {
                      text: `${label} (${value} - ${percentage}%)`,
                      fillStyle: chartInfo.color,
                      strokeStyle: chartInfo.color,
                      lineWidth: 0,
                      hidden: false,
                      index: i
                    };
                  });
                }
                return [];
              }
            },
          },
          tooltip: {
            intersect: false,
            mode: 'index',
            callbacks: {
              title: (tooltipItems: any) => {
                const chartInfo = chartData as any;
                return chartInfo[tooltipItems[0].dataIndex]['segment'];
              },
              label: (context: any) => {
                const value = context.raw;
                const percentage = ((value / totalCount) * 100).toFixed(1);
                return [
                  `Count: ${this.formatNumber(value)}`,
                  `Percentage: ${percentage}%`
                ];
              }
            },
            padding: 12,
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            titleFont: {
              size: 14,
              weight: 'bold',
              family: "'Inter', sans-serif"
            },
            bodyFont: {
              size: 14,
              family: "'Inter', sans-serif"
            },
            displayColors: false
          },
        },
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 1500,
          easing: 'easeInOutQuart'
        }
      }
    }) as Chart;
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
