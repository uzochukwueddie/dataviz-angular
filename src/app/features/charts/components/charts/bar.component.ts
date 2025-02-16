import { Component, computed, effect, ElementRef, input, ViewChild } from "@angular/core";
import { Chart, registerables } from 'chart.js';
import { IChartResult } from "../../interfaces/chart.interface";
import { truncateText } from "../../../../shared/utils/utils";

Chart.register(...registerables);

@Component({
  selector: 'app-bar-chart',
  template: `
    <div class="min-h-[550px] relative" [style.width.vw]="previewWidthComputed()">
      <canvas #chartCanvas></canvas>
    </div>
  `
})
export class BarChartComponent {
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
    const { data, xAxis, yAxis } = this.chartDataComputed() as IChartResult;
    const chartData = data as Record<string, unknown>[];
    const canvas = this.chartCanvas?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.map(item => truncateText(item[xAxis] as string, 10)),
        datasets: [{
          label: yAxis,
          data: chartData.map(item => item[yAxis]),
          backgroundColor: '#60A5FA', // Tailwind blue-400
          borderColor: '#3B82F6', // Tailwind blue-500
          borderWidth: 1,
          borderRadius: 5,
          barThickness: 40
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
              generateLabels: (chart) => {
                const original = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                return original.map(label => ({
                  ...label,
                  text: truncateText(label.text, 20)
                }));
              }
            },
          },
          tooltip: {
            // Custom tooltip configuration
            callbacks: {
              title: (tooltipItems: any) => {
                // Show full movie title in tooltip
                const dataIndex = tooltipItems[0].dataIndex;
                return chartData[dataIndex][xAxis] as any;
              },
              label: (context: any) => {
                // Format the duration in the tooltip
                return context.raw;
              }
            },
            padding: 12,
            backgroundColor: 'rgba(17, 24, 39, 0.8)', // Tailwind gray-900 with opacity
            titleFont: {
              size: 14,
              weight: 'bold',
              family: "'Inter', sans-serif"
            },
            bodyFont: {
              size: 13,
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
            }
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
            ticks: {
              autoSkip: true
            }
          }
        }
      }
    }) as Chart;
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

}
