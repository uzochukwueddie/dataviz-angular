import { computed, Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  public activeToasts = computed(() => this.toasts());

  show(message: string, type: ToastType = 'info', duration: number = 3000): void {
    const toast: Toast = {
      id: crypto.randomUUID(),
      message,
      type,
      duration
    };

    this.toasts.update((currentToasts: Toast[]) => [...currentToasts, toast]);

    if (duration > 0) {
      setTimeout(() => this.remove(toast.id), duration);
    }
  }

  remove(id: string): void {
    this.toasts.update((currentToasts: Toast[]) => currentToasts.filter(toast => toast.id !== id));
  }
}
