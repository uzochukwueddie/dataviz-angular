import { Component, ViewChild, ElementRef, input, computed, Signal, effect } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { truncateText } from '../../../../shared/utils/utils';
import { IChartResult } from '../../interfaces/chart.interface';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  template: `
    <div class="min-h-[550px] relative" [style.width.vw]="previewWidthComputed()">
      <canvas #chartCanvas></canvas>
    </div>
  `
})
export class LineChartComponent {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  chart: Chart | null = null;

  chartData = input<IChartResult | null>(null);
  previewWidth = input<number>(0);
  chartDataComputed = computed(() => this.chartData());
  previewWidthComputed = computed(() => this.previewWidth());

  constructor() {
    effect(() => {
      if (this.chart) {
        this.chart.destroy();
      }
      this.createChart();
    });
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  createChart(): void {
    const canvas = this.chartCanvas?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { data, xAxis, yAxis } = this.chartDataComputed() as IChartResult;
    const chartData = data as Record<string, unknown>[];

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.map(movie => truncateText(movie[xAxis] as string, 10)),
        datasets: [{
          label: yAxis,
          data: chartData.map(movie => movie[yAxis]),
          borderColor: '#3B82F6', // Primary line color
          backgroundColor: 'rgba(96, 165, 250, 0.2)', // Light fill under the line
          fill: false, // Enable area fill under the line
          tension: 0.4, // Add slight curve to the line
          pointRadius: 5, // This removes the points
          pointHoverRadius: 6,
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                family: "'Inter', sans-serif",
                size: 14
              },
              usePointStyle: false,
              boxWidth: 40,
              boxHeight: 3,
              generateLabels: (chart) => {
                const original = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                return original.map(label => ({
                  ...label,
                  text: truncateText(`${label.text}`, 20) as string
                }));
              }
            },
          },
          tooltip: {
            // Custom tooltip configuration
            intersect: false,
            mode: 'index',
            callbacks: {
              title: (tooltipItems: any) => {
                // Show full movie title in tooltip
                const dataIndex = tooltipItems[0].dataIndex;
                return chartData[dataIndex][xAxis] as any;
              },
              label: (context: any) => {
                // Format the duration in the tooltip
                const value = context.raw;
                return value;
              }
            },
            padding: 12,
            backgroundColor: 'rgba(17, 24, 39, 0.8)', // Tailwind gray-900 with opacity
            bodyFont: {
              size: 14,
              family: "'Inter', sans-serif"
            },
            displayColors: false  // Hide color box in tooltip
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: yAxis,
              font: {
                family: "'Inter', sans-serif",
                size: 14
              }
            },
            grid: {
              color: 'rgba(156, 163, 175, 0.1)', // Subtle grid lines
            },
          },
          x: {
            title: {
              display: true,
              text: xAxis,
              font: {
                family: "'Inter', sans-serif",
                size: 14
              }
            },
            grid: {
              display: true // Hide vertical grid lines
            },
            ticks: {
              autoSkip: true
            }
          }
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
