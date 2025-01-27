import { CommonModule } from '@angular/common';
import { Component, effect, input, InputSignal } from '@angular/core';

interface ColumnType {
  name: string;
}

interface IDataSet {
  [key: string]: any;
}

type QueryResultType = { columns: ColumnType[], dataset: any[] };

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.component.html'
})
export class TableComponent {
  data: InputSignal<Record<string, unknown>[]> = input<Record<string, unknown>[]>([]);

  queryResult: QueryResultType = {
    columns: [],
    dataset: []
  };
  copiedRow: number | null = null;
  colors: string[] = [
    'text-red-500', 'text-blue-500', 'text-green-500',
    'text-yellow-500', 'text-purple-500', 'text-pink-500',
    'text-indigo-500', 'text-orange-500', 'text-teal-500'
  ];

  constructor() {
    effect(() => {
      this.processData();
    });
  }

  handleCopy(rowData: IDataSet[], rowIndex: number): void {
    const jsonData = JSON.stringify(
      Object.fromEntries(
        rowData.map((value, index) => {
          return [
            this.queryResult.columns[index].name,
            value
          ];
        })
      )
    );
    navigator.clipboard.writeText(jsonData);
    this.copiedRow = rowIndex;
    setTimeout(() => {
      this.copiedRow = null;
    }, 2000)
  }

  getObjectString(cell: any): string {
    return cell ? cell.toString() : cell;
  }

  getCellColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  private processData(): void {
    if (this.data().length > 0) {
      this.queryResult.columns = Object.keys(this.data()[0]).map((key) => {
        return {
          name: key
        }
      });

      this.queryResult.dataset = this.data().map((row) => Object.values(row));
    } else {
      this.queryResult = {
        columns: [],
        dataset: []
      };
    }
  }

}
