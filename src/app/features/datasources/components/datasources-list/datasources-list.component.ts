import { CommonModule } from '@angular/common';
import { Component, input, InputSignal, output } from '@angular/core';
import { IDatasource } from '../../interfaces/datasource.interface';

@Component({
  selector: 'app-datasources-list',
  imports: [CommonModule],
  templateUrl: './datasources-list.component.html'
})
export class DatasourcesListComponent {
  dataSources: InputSignal<IDatasource[]> = input<IDatasource[]>([]);

  edit = output<string>();
  delete = output<string>();

  onEdit(projectId: string): void {
    this.edit.emit(projectId);
  }

  onDelete(datasourceId: string): void {
    this.delete.emit(datasourceId);
  }
}
