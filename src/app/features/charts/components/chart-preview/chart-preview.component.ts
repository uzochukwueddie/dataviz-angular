import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
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
export class ChartPreviewComponent implements OnInit, OnDestroy {
  private resizeObserver!: ResizeObserver;
  private elementRef: ElementRef = inject(ElementRef);

  sqlQuery = input<string>('');
  chartConfig = input<IChartResult | null>(null);
  isLoading = input<boolean>(false);
  chartInfoChange = output<IChartInfo>();

  number = signal<number>(0);
  previewWidth = signal<number>(0);

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

  ngOnInit(): void {
    this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        this.previewWidth.set(this.pxToVW(entry.contentRect.width));
      }
    });
    const previewElement = this.elementRef.nativeElement.querySelector('.preview');
    if (previewElement) {
      this.resizeObserver.observe(previewElement);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
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

  // Convert from px to viewport width
  private pxToVW(px: number): number {
    // Get viewport width
    const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    // Convert from px to vw
    return (px * 100) / viewportWidth;
  }

}
