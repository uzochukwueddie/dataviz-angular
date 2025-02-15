import { CommonModule } from "@angular/common";
import { Component, inject, output, signal } from "@angular/core";
import { ModalComponent } from "../../../../shared/modal/modal.component";
import { DatasourceFormComponent } from "./datasource-form.component";
import { Apollo, MutationResult } from "apollo-angular";
import { DatasourceSignalService } from "../../../../shared/services/datasource.signal";
import { ToastService } from "../../../../shared/services/toast.service";
import { injectAppDispatch } from "../../../../store";
import { IPostgreSQLDatasource } from "../../interfaces/datasource.interface";
import { CHECK_POSTGRESQL_CONNECTION, CREATE_POSTGRESQL_DATASOURCE } from "../../graphql/datasource";
import { convertToBase64, setLocalStorageItem } from "../../../../shared/utils/utils";
import { addDataSource } from "../../reducers/datasource.reducer";
import { clearDocuments } from "../../../dashboard/reducers/documents.reducer";

@Component({
  selector: 'app-add-datasource-modal',
  imports: [CommonModule, ModalComponent, DatasourceFormComponent],
  template: `
    <app-modal [isOpen]="isOpen()">
      <div class="w-full md:w-[600px] md:max-w-2xl">
        <div class="flex items-center justify-between p-4 border-gray-100 border-b-1">
          <h2 class="text-xl font-semibold">New PostgreSQL Connection</h2>
          <button (click)="closeModal()" class="text-gray-500 cursor-pointer hover:text-gray-700" aria-label="Close modal">
            <i class="fa fa-xmark"></i>
          </button>
        </div>

        <app-datasource-form
          (formSubmit)="handleFormSubmit($event)"
          (testConnection)="handleConnectionTest($event)"
          (formCancel)="closeModal()"
        />

      </div>
    </app-modal>
  `
})
export class AddDataSourceModalComponent {
  private readonly apollo: Apollo = inject(Apollo);
  private toastService = inject(ToastService);
  private readonly datasourceSignalService: DatasourceSignalService = inject(DatasourceSignalService);
  private readonly dispatch = injectAppDispatch();

  close = output<void>();
  submit = output<void>();

  isOpen = signal<boolean>(true);

  closeModal() {
    this.isOpen.set(false);
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
      mutation: CREATE_POSTGRESQL_DATASOURCE,
      fetchPolicy: 'no-cache',
      variables: {
        source: updatedConfig
      }
    })
    .subscribe({
      next: (result: MutationResult) => {
        if (result && result.data) {
          const { dataSource } = result.data.createPostgresqlDataSource;
          setLocalStorageItem('activeProject', JSON.stringify(dataSource[0]));
          this.dispatch(addDataSource({
            active: dataSource[0],
            database: dataSource[0].database,
            dataSource
          }));
          this.datasourceSignalService.updateDatasources(dataSource);
          this.dispatch(clearDocuments([]));
          this.toastService.show('PostreSQL datasource created successfully.', 'success');
        }
      },
      error: (error) => {
        console.log(error);
        this.toastService.show('Failed to create postgresql datasource.', 'error');
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
}
