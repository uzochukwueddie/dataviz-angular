import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { DatasourceSignalService } from '../../shared/services/datasource.signal';
import { Apollo, MutationResult } from 'apollo-angular';
import { injectAppDispatch, injectAppSelector } from '../../store';
import { IDatasource } from './interfaces/datasource.interface';
import { CommonModule } from '@angular/common';
import { AddDataSourceModalComponent } from './components/datasource-modal/add-datasource-modal.component';
import { DatasourcesListComponent } from './components/datasources-list/datasources-list.component';
import { IReduxState } from '../../store/store.interface';
import { DELETE_DATA_SOURCE } from './graphql/datasource';
import { addDataSource } from './reducers/datasource.reducer';
import { setLocalStorageItem } from '../../shared/utils/utils';
import { ToastService } from '../../shared/services/toast.service';
import { EditDataSourceModalComponent } from './components/datasource-modal/edit-datasource-modal.component';

@Component({
  selector: 'app-datasource',
  imports: [CommonModule, AddDataSourceModalComponent, DatasourcesListComponent, EditDataSourceModalComponent],
  templateUrl: './datasource.component.html',
  styleUrl: './datasource.component.scss'
})
export class DatasourceComponent implements OnInit {
  private readonly datasourceSignalService: DatasourceSignalService = inject(DatasourceSignalService);
  private readonly apollo: Apollo = inject(Apollo);
  private readonly dispatch = injectAppDispatch();
  private toastService = inject(ToastService);
  private readonly rootDatasources = injectAppSelector((state: IReduxState) => state.datasource);

  dataSources: IDatasource[] = [];

  addModal = signal<boolean>(false);
  editModal = signal<boolean>(false);
  projectId = signal<string>('');

  isAddModalOpen = computed(() => this.addModal());
  isEditModalOpen = computed(() => this.editModal());

  constructor() {
    effect(() => {
      this.loadDataSources();
    });
  }

  ngOnInit(): void {
    this.dataSources = this.rootDatasources().dataSource;
  }

  showAddModal(): void {
    this.addModal.set(true);
  }

  hideAddModal(): void {
    this.addModal.set(false);
    this.loadDataSources();
  }

  showEditModal(projectId: string): void {
    this.projectId.set(projectId);
    this.editModal.set(true);
  }

  hideEditModal(): void {
    this.editModal.set(false);
  }

  handleAdd(): void {
    this.loadDataSources();
    this.hideAddModal();
  }

  handleEdit(): void {
    this.loadDataSources();
    this.hideEditModal();
  }

  deleteDataSource(datasourceId: string): void {
    if (confirm('Are you sure you want to delete this data source?')) {
      this.apollo.mutate({
        mutation: DELETE_DATA_SOURCE,
        fetchPolicy: 'no-cache',
        variables: {
          datasourceId
        }
      }).subscribe({
        next: (result: MutationResult) => {
          if (result && result.data) {
            const { id } = result.data.deleteDatasource;
            const datasource = this.rootDatasources();
            const sources = datasource.dataSource.filter((source: IDatasource) => source.id !== id);
            const active = datasource.active;
            const hasActiveDatasource = sources.some((source: IDatasource) => source.id === active?.id);
            const activeSource = hasActiveDatasource ? active : sources[0];
            this.dispatch(addDataSource({
              active: activeSource,
              database: activeSource?.database,
              dataSource: sources
            }));
            setLocalStorageItem('activeProject', JSON.stringify(activeSource));
            this.dataSources = sources;
            this.toastService.show('Data source deleted successfully.', 'error');
          }
        },
        error: () => {
          this.toastService.show('Failed to delete postgresql datasource.', 'error');
        }
      });
    }
  }

  private loadDataSources(): void {
    const dataSources = this.datasourceSignalService.datasources();
    if (dataSources.length > 0) {
      this.dataSources = dataSources;
    }
  }

}
