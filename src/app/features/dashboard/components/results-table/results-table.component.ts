import { Component, computed, effect, input, InputSignal, signal } from '@angular/core';
import { injectAppSelector } from '../../../../store';
import { IReduxState } from '../../../../store/store.interface';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination.component';
import { TableComponent } from './table/table.component';

@Component({
  selector: 'app-results-table',
  imports: [CommonModule, PaginationComponent, TableComponent],
  templateUrl: './results-table.component.html',
  styleUrl: './results-table.component.scss'
})
export class ResultsTableComponent {
  datasource = injectAppSelector((state: IReduxState) => state.datasource);

  tableDataSignal = signal<Record<string, unknown>[]>([]);
  currentPage = signal<number>(1);
  itemsPerPage = 20;

  tableResult: InputSignal<Record<string, unknown>[]> = input<Record<string, unknown>[]>([]);
  isLoading: InputSignal<boolean> = input<boolean>(false);

  totalItems = computed(() => this.tableResult().length);
  tableData = computed(() => this.tableDataSignal());
  totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage));
  startIndex = computed(() => (this.currentPage() - 1) * this.itemsPerPage);
  endIndex = computed(() => Math.min(this.startIndex() + this.itemsPerPage, this.totalItems()));

  constructor() {
    effect(() => {
      if (this.tableResult().length) {
        const currentPageData = this.tableResult().slice(this.startIndex(), this.endIndex());
        this.tableDataSignal.set(currentPageData);
      } else {
        this.tableDataSignal.set([]);
      }
    });
  }

  onCurrentPageData(event: number): void {
    this.currentPage.set(event);
    const currentPageData = this.tableResult().slice(this.startIndex(), this.endIndex());
    this.tableDataSignal.set(currentPageData);
  }

}
