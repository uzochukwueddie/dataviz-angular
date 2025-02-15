import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true">
      <div
        class="fixed inset-0 bg-black/50 bg-opacity-50 transition-opacity"
        (click)="close.emit()">
      </div>

      <!-- Modal Panel -->
      <div class="flex min-h-screen items-center justify-center p-4">
        <div
          class="relative bg-white rounded-lg shadow-xl max-w-full mx-auto"
          (click)="$event.stopPropagation()">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent {
  isOpen: InputSignal<boolean> = input(false);
  close: OutputEmitterRef<void> = output<void>();
}
