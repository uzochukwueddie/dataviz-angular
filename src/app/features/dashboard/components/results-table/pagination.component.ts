import { CommonModule } from "@angular/common";
import { Component, input, InputSignal, output, OutputEmitterRef } from "@angular/core";

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-4xl mx-auto">
      <div class="flex items-center justify-between px-4 gap-2">
          <div class="flex items-center space-x-2">
              <button
                [disabled]="currentPage() === 1"
                (click)="previousPage()"
                class="px-4 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fa fa-arrow-left"></i>
              </button>

              <span
                  class="px-4 py-1 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md flex w-[100px] justify-center">
                  {{ currentPage() }} of {{ totalPages() }}
              </span>

              <button
                [disabled]="currentPage() === totalPages()"
                (click)="nextPage()"
                class="px-4 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fa fa-arrow-right "></i>
              </button>
          </div>
      </div>
    </div>
  `
})
export class PaginationComponent {
  currentPage: InputSignal<number> = input<number>(1);
  totalPages: InputSignal<number> = input<number>(100);

  currentPageDataChange: OutputEmitterRef<number> = output<number>();

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPageDataChange.emit(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    const prevPage = this.currentPage() - 1;
    if (prevPage >= 1) {
      this.currentPageDataChange.emit(prevPage);
    }
  }

}
