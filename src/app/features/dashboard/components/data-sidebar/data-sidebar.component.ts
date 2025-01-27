import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Signal, signal } from '@angular/core';
import { CustomDropdownComponent, DropdownOption } from '../../../../shared/components/dropdown/custom-dropdown.component';
import { injectAppDispatch, injectAppSelector } from '../../../../store';
import { IReduxState } from '../../../../store/store.interface';
import { Apollo } from 'apollo-angular';
import { ToastService } from '../../../../shared/services/toast.service';
import { IDatasource } from '../../../datasources/interfaces/datasource.interface';
import { firstValueFrom } from 'rxjs';
import { GET_SINGLE_DATA_SOURCE } from '../../../datasources/graphql/datasource';
import { getLocalStorageItem } from '../../../../shared/utils/utils';
import { EXECUTE_POSTGRESQL_QUERY, GET_SINGLE_POSTGRESQL_COLLECTIONS } from '../../graphql/postgresql';
import { addDataSource } from '../../../datasources/reducers/datasource.reducer';
import { addCollections } from '../../reducers/collections.reducer';
import { addDocuments, clearDocuments } from '../../reducers/documents.reducer';
import { AddDataSourceModalComponent } from '../../../datasources/components/datasource-modal/add-datasource-modal.component';

const DEFAULT_PROJECT: IDatasource = {
  id: '',
  projectId: '',
  type: '',
  database: ''
};

@Component({
  selector: 'app-data-sidebar',
  imports: [CommonModule, CustomDropdownComponent, AddDataSourceModalComponent],
  templateUrl: './data-sidebar.component.html'
})
export class DataSidebarComponent {
  private rootDatasource = injectAppSelector((state: IReduxState) => state.datasource);
  private readonly dispatch = injectAppDispatch();
  private readonly apollo: Apollo = inject(Apollo);
  private toastService = inject(ToastService);
  private modalOpen = signal<boolean>(false);
  private collections = signal<string[]>([]);
  private defaultProject = signal<DropdownOption | null>(null);

  tables: Signal<string[]> = computed(() => this.collections());
  isAddDataSourceModalOpen: Signal<boolean> = computed(() => this.modalOpen());
  defaultSelectedProject: Signal<DropdownOption | null> = computed(() => this.defaultProject());

  dropdownOptions: DropdownOption[] = [];

  constructor() {
    effect(() => {
      this.loadDataSources();
    });
    const activeProject = getLocalStorageItem('activeProject');
    const projects = this.rootDatasource().dataSource;
    const project = projects.length > 0 && !activeProject && projects[0].database ?
                    projects[0] : activeProject !== 'undefined' && activeProject !== null ? activeProject : DEFAULT_PROJECT;
    this.defaultProject.set({
      id: project.id,
      label: project.projectId,
      value: project.projectId
    });
    if (project.projectId && project.id) {
      this.getSelectedDatasourceCollections(project.projectId, project.id);
    }
  }

  onSelectionChange(option: DropdownOption): void {
    this.getSelectedDatasourceCollections(option.value, `${option.id}`);
  }

  onDropdownClicked(): void {
    this.loadDataSources();
  }

  showAddDataSourceModal(): void {
    this.modalOpen.set(true);
  }

  hideAddDataSourceModal(): void {
    this.modalOpen.set(false);
  }

  handleAdd(): void {
    this.hideAddDataSourceModal();
  }

  onSelectTable(table: string): void {
    const sql = `SELECT * FROM ${table} LIMIT 20`;
    this.getTableData(`${this.rootDatasource().active?.projectId}`, sql);
  }

  private loadDataSources(): void {
    const dataSources = this.rootDatasource().dataSource;
    this.dropdownOptions = dataSources.map((datasource: IDatasource) => {
      return {
        id: datasource.id,
        label: datasource.projectId,
        value: datasource.projectId
      };
    });
  }

  private async getSelectedDatasourceCollections(projectId: string, datasourceId: string): Promise<void> {
    try {
      const { data } = await firstValueFrom(
        this.apollo.query({
          query: GET_SINGLE_POSTGRESQL_COLLECTIONS,
          fetchPolicy: 'no-cache',
          variables: {
            projectId
          }
        })
      );
      const { getSinglePostgreSQLCollections } = data as any;
      this.collections.set(getSinglePostgreSQLCollections);
      const project = this.rootDatasource().dataSource.find((source: IDatasource) => source.id === datasourceId);
      this.dispatch(addDataSource({
        active: project,
        database: project?.database,
        dataSource: this.rootDatasource().dataSource
      }));
      this.dispatch(addCollections(getSinglePostgreSQLCollections));
      this.dispatch(clearDocuments([]));
    } catch (error) {
      console.log(error);
      this.toastService.show('Failed to return tables.', 'error');
    }
  }

  private async getTableData(projectId: string, sqlQuery: string): Promise<void> {
    try {
      const { data } = await firstValueFrom(
        this.apollo.query({
          query: EXECUTE_POSTGRESQL_QUERY,
          fetchPolicy: 'no-cache',
          variables: {
            data: {
              projectId,
              sqlQuery
            }
          }
        })
      );
      const { executePostgreSQLQuery } = data as any;
      const { documents } = executePostgreSQLQuery;
      const filteredDocuments = JSON.parse(documents).filter((obj: Record<string, unknown>) => Object.keys(obj).length > 0);
      this.dispatch(addDocuments(filteredDocuments));
    } catch (error) {
      this.toastService.show('Failed to return result', 'error');
    }
  }

}
