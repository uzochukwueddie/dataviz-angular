import { animate, style, transition, trigger } from "@angular/animations";
import { CommonModule } from "@angular/common";
import { Component, computed, inject } from "@angular/core";
import { ToastService } from "../services/toast.service";

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm">
      @for (toast of toasts(); track toast.id) {
        <div class="flex items-center justify-between p-4 rounded-lg shadow-lg cursor-pointer transition-transform duration-200 hover:-translate-x-1"
            [ngClass]="{
              'bg-green-500 text-white': toast.type === 'success',
              'bg-red-500 text-white': toast.type === 'error',
              'bg-yellow-500 text-white': toast.type === 'warning',
              'bg-blue-500 text-white': toast.type === 'info'
            }" [@slideIn] (click)="removeToast(toast.id)">
            <div class="flex items-center gap-3">
                <span class="text-white flex items-center justify-center w-6 h-6 rounded-full">
                  @switch (toast.type) {
                    @case ('success') {
                      ✓
                    }
                    @case ('error') {
                      ✗
                    }
                    @case ('warning') {
                      !
                    }
                    @default {
                      i
                    }
                  }
                </span>
                <span class="text-sm text-white">{{ toast.message }}</span>
            </div>
            <button
              (click)="removeToast(toast.id)"
              class="ml-4 text-xl text-white opacity-60 hover:opacity-100 transition-opacity duration-200">
                ×
            </button>
        </div>
      }
    </div>
  `,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'transformX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'transformX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'transformX(100%)', opacity: 0 }))
      ]),
    ])
  ]
})
export class ToastComponent {
  private toastService: ToastService = inject(ToastService);

  toasts = computed(() => this.toastService.activeToasts());

  removeToast(id: string): void {
    this.toastService.remove(id);
  }
}
