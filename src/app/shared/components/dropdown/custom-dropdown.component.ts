import { Component, effect, ElementRef, HostListener, inject, input, InputSignal, output, OutputEmitterRef, signal, WritableSignal } from "@angular/core";

export interface DropdownOption {
  id: string | number;
  label: string;
  value: any;
}

@Component({
  selector: 'app-custom-dropdown',
  standalone: true,
  template: `
    <div class="inherit w-full relative">
      <button
          class="w-full px-4 py-2 cursor-pointer bg-white border border-gray-300 rounded-md text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none"
          [attr.aria-expanded]="isOpen()"
          (click)="toggleDropdown()"
        >
          <span class="text-gray-700 truncate overflow-hidden whitespace-nowrap w-[90%]">{{ selectedOption()?.label || placeholder() }}</span>
          <span class="text-sm text-gray-500 transition-transform duration-200"
              [class.transform]="isOpen()"
              [class.rotate-180]="isOpen()"
            >
              ▼
          </span>
      </button>

      @if (isOpen()) {
        <ul class="absolute w-full mt-1 py-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto z-50"
          role="listbox" [attr.aria-label]="placeholder()">
          @for(option of options(); track option.id) {
            <li role="option"
              (click)="selectOption(option)"
              [attr.aria-selected]="option.id === selectedOption()?.id"
              class="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              [class.bg-gray-100]="option.id === selectedOption()?.id"
            >
              {{ option.label }}
            </li>
          } @empty {
            <li role="option" class="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
              {{ dropdownMessage() }}
            </li>
          }
        </ul>
      }

  </div>
  `
})
export class CustomDropdownComponent {
  elementRef: ElementRef = inject(ElementRef);

  options: InputSignal<DropdownOption[]> = input<DropdownOption[]>([]);
  placeholder: InputSignal<string> = input<string>('Select an option');
  dropdownMessage: InputSignal<string> = input<string>('');
  defaultOption: InputSignal<DropdownOption | null> = input<DropdownOption | null>(null);
  selectionChange: OutputEmitterRef<DropdownOption> = output<DropdownOption>();

  isOpen: WritableSignal<boolean> = signal(false);
  selectedOption: WritableSignal<DropdownOption | null> = signal<DropdownOption | null>(null);

  constructor() {
    effect(() => {
      if (this.defaultOption()) {
        this.selectedOption.set(this.defaultOption());
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target) && this.isOpen()) {
      this.isOpen.set(false);
    }
  }

  toggleDropdown(): void {
    this.isOpen.update((value: boolean) => !value);
  }

  selectOption(option: DropdownOption): void {
    this.selectedOption.set(option);
    this.selectionChange.emit(option);
    this.isOpen.set(false);
  }

}
