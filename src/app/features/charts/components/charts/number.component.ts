import { AfterViewInit, Component, effect, ElementRef, input, ViewChild } from "@angular/core";

@Component({
  selector: 'app-number-canvas',
  template: `
    <canvas #canvas
      [attr.width]="width()"
      [attr.height]="height()"
    ></canvas>
  `
})
export class NumberDisplayComponent implements AfterViewInit {
  number = input<number>(0);
  width = input<number>(300);
  height = input<number>(150);

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor() {
    effect(() => {
      this.drawNumber();
    });
  }

  ngAfterViewInit(): void {
    this.drawNumber();
  }

  private drawNumber(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const numberValue = this.number().toFixed(4);
    const displayNumber = this.number() % 1 !== 0 ? parseFloat(numberValue) : parseInt(numberValue);

    ctx.clearRect(0, 0, this.width(), this.height());

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';

    const calculateFontSize = () => {
      let fontSize = Math.min(this.width(), this.height()) * 0.8;
      ctx.font = `bold ${fontSize}px Arial`;

      while(ctx.measureText(`${displayNumber}`).width > this.width() * 0.9 || fontSize > this.height() * 0.8) {
        fontSize *= 0.9;
        ctx.font = `bold ${fontSize}px Arial`;
      }

      return fontSize;
    }

    const fontSize = calculateFontSize();
    ctx.font = `bold ${fontSize}px Arial`;

    ctx.fillText(`${displayNumber}`, this.width() / 2, this.height() / 2);
  }
}
