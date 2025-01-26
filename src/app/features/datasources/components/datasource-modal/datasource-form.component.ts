import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IPostgreSQLDatasource } from '../../interfaces/datasource.interface';
import { decodeBase64String } from '../../../../shared/utils/utils';

@Component({
  selector: 'app-datasource-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './datasource-form.component.html',
})
export class DatasourceFormComponent {
  datasource = input<IPostgreSQLDatasource | undefined>(undefined);
  computedDatasource = computed(() => this.datasource());

  configForm: FormGroup;
  formSubmit = output<IPostgreSQLDatasource>();
  testConnection = output<IPostgreSQLDatasource>();
  formCancel = output<void>();

  config: IPostgreSQLDatasource = {
    projectId: '',
    databaseUrl: '',
    port: '',
    databaseName: '',
    username: '',
    password: ''
  };

  constructor() {
    effect(() => {
      if (this.computedDatasource()) {
        const {
          projectId,
          databaseName,
          databaseUrl,
          username,
          password,
          port
        } = this.computedDatasource() as IPostgreSQLDatasource;
        this.configForm.patchValue({
          projectId,
          port,
          databaseUrl: decodeBase64String(databaseUrl),
          databaseName: decodeBase64String(databaseName),
          username: decodeBase64String(username),
          password: decodeBase64String(password),
        });
      }
    });

    this.configForm = new FormGroup({
      projectId: new FormControl(this.config.projectId, [
        Validators.required,
        Validators.minLength(1)
      ]),
      databaseUrl: new FormControl(this.config.databaseUrl, [
        Validators.required,
        Validators.minLength(1)
      ]),
      port: new FormControl(this.config.port, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(6)
      ]),
      databaseName: new FormControl(this.config.databaseName, [
        Validators.required,
        Validators.minLength(1)
      ]),
      username: new FormControl(this.config.username, [
        Validators.required,
        Validators.minLength(1)
      ]),
      password: new FormControl(this.config.password, [
        Validators.required,
        Validators.minLength(1)
      ]),
    });
  }

  onSubmit(): void {
    if (this.configForm.valid) {
      const config: IPostgreSQLDatasource = this.configForm.value;
      this.formSubmit.emit({
        // thisis only for updating
        ...(this.computedDatasource() && {
          id: this.computedDatasource()?.id,
          userId: this.computedDatasource()?.userId
        }),
        ...config
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
    this.configForm.reset();
  }

  testDatasourceConnection(): void {
    if (this.configForm.valid) {
      this.testConnection.emit(this.configForm.value);
    }
  }

  isEnabled(): boolean {
    return this.configForm.valid;
  }

}
