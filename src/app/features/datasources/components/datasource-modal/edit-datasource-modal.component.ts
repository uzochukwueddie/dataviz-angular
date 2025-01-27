import { CommonModule } from "@angular/common";
import { Component, computed, inject, input, OnInit, output, signal } from "@angular/core";
import { ModalComponent } from "../../../../shared/modal/modal.component";
import { DatasourceFormComponent } from "./datasource-form.component";
import { Apollo, MutationResult } from "apollo-angular";
import { DatasourceSignalService } from "../../../../shared/services/datasource.signal";
import { ToastService } from "../../../../shared/services/toast.service";
import { injectAppDispatch, injectAppSelector } from "../../../../store";
import { IDatasource, IPostgreSQLDatasource } from "../../interfaces/datasource.interface";
import { CHECK_POSTGRESQL_CONNECTION, CREATE_POSTGRESQL_DATASOURCE, EDIT_DATASOURCE, GET_SINGLE_DATA_SOURCE } from "../../graphql/datasource";
import { convertToBase64, getLocalStorageItem, setLocalStorageItem } from "../../../../shared/utils/utils";
import { addDataSource } from "../../reducers/datasource.reducer";
import { IReduxState } from "../../../../store/store.interface";
import { firstValueFrom } from "rxjs";
import { clearDocuments } from "../../../dashboard/reducers/documents.reducer";

@Component({
  selector: 'app-edit-datasource-modal',
  imports: [CommonModule, ModalComponent, DatasourceFormComponent],
  template: `
    <app-modal [isOpen]="true" (close)="closeModal()">
      <div class="w-full md:w-[600px] md:max-w-2xl">
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-xl font-semibold">Edit PostgreSQL Connection</h2>
          <button (click)="closeModal()" class="text-gray-500 hover:text-gray-700" aria-label="Close modal">
            <i class="fa fa-xmark"></i>
          </button>
        </div>

        <app-datasource-form
          (formSubmit)="handleFormSubmit($event)"
          (testConnection)="handleConnectionTest($event)"
          (formCancel)="closeModal()"
          [datasource]="computedDatasource()"
        />

      </div>
    </app-modal>
  `
})
export class EditDataSourceModalComponent implements OnInit {
  private readonly apollo: Apollo = inject(Apollo);
  private toastService = inject(ToastService);
  private readonly datasourceSignalService: DatasourceSignalService = inject(DatasourceSignalService);
  private readonly dispatch = injectAppDispatch();

  rootDatasource = injectAppSelector((state: IReduxState) => state.datasource);

  datasource = signal<IPostgreSQLDatasource | undefined>(undefined);
  computedDatasource = computed(() => this.datasource());

  projectId = input<string>('');
  computedProjectId = computed(() => this.projectId());

  close = output<void>();

  ngOnInit(): void {
    if (this.computedProjectId()) {
      this.getSelectedDatasource(this.computedProjectId());
    }
  }

  closeModal() {
    this.close.emit();
  }

  handleFormSubmit(config: IPostgreSQLDatasource): void {
    const updatedConfig: IPostgreSQLDatasource = {
      ...config,
      databaseName: convertToBase64(config.databaseName),
      databaseUrl: convertToBase64(config.databaseUrl),
      username: convertToBase64(config.username),
      password: convertToBase64(config.password)
    };
    this.apollo.mutate({
      mutation: EDIT_DATASOURCE,
      fetchPolicy: 'no-cache',
      variables: {
        source: updatedConfig
      }
    })
    .subscribe({
      next: (result: MutationResult) => {
        if (result && result.data) {
          const { dataSource } = result.data.editDataSource;
          const activeDatasource = this.rootDatasource().active;
          const activeProject = getLocalStorageItem('activeProject');
          if (activeProject !== 'undefined' && activeProject.projectId === activeDatasource?.projectId) {
            const datasourceActive = dataSource.find((source: IDatasource) => source.projectId === config?.projectId);
            setLocalStorageItem('activeProject', JSON.stringify(datasourceActive));
          }
          const activeSource =
              activeProject !== 'undefined' && activeProject.projectId === activeDatasource?.projectId
                ? activeDatasource
                : dataSource[0];
          this.dispatch(addDataSource({
            active: activeSource,
            database: activeSource.database,
            dataSource
          }));
          this.datasourceSignalService.updateDatasources(dataSource);
          this.dispatch(clearDocuments([]));
          this.toastService.show('PostreSQL datasource updated successfully.', 'success');
        }
      },
      error: (error) => {
        console.log(error);
        this.toastService.show('Failed to update postgresql datasource.', 'error');
      },
    });
  }

  handleConnectionTest(config: IPostgreSQLDatasource): void {
    this.apollo.mutate({
      mutation: CHECK_POSTGRESQL_CONNECTION,
      fetchPolicy: 'no-cache',
      variables: {
        datasource: config
      }
    })
    .subscribe({
      next: () => {
        this.toastService.show('PostreSQL connection test successful.', 'success');
      },
      error: (error) => {
        console.log(error);
        this.toastService.show('PostreSQL connection test failed.', 'error');
      }
    });
  }

  private async getSelectedDatasource(projectId: string): Promise<void> {
    try {
      const { data } = await firstValueFrom(
        this.apollo.query({
          query: GET_SINGLE_DATA_SOURCE,
          fetchPolicy: 'no-cache',
          variables: {
            projectId
          }
        })
      );
      const { getDataSourceByProjectId } = data as any;
      this.datasource.set(getDataSourceByProjectId);
    } catch (error) {
      console.log(error);
    }
  }
}
