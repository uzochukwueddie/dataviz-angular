import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { injectAppDispatch, injectAppSelector } from '../../../../store';
import { ToastService } from '../../../../shared/services/toast.service';
import { IReduxState } from '../../../../store/store.interface';
import { addLimitIfNeeded, addQuotesToColumnNames, addQuotesToTableNames } from '../../../../shared/utils/pg-utils';
import { firstValueFrom } from 'rxjs';
import { EXECUTE_POSTGRESQL_QUERY } from '../../graphql/postgresql';
import { addDocuments, clearDocuments } from '../../reducers/documents.reducer';
import { addSQLQuery, clearSQLQuery } from '../../reducers/sql.reducer';

@Component({
  selector: 'app-sql-editor',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sql-editor.component.html',
  styleUrl: './sql-editor.component.scss'
})
export class SqlEditorComponent implements OnInit {
  private readonly apollo: Apollo = inject(Apollo);
  private readonly dispatch = injectAppDispatch();
  private toastService = inject(ToastService);
  private rootDatasource = injectAppSelector((state: IReduxState) => state.datasource);
  private sqlData = injectAppSelector((state: IReduxState) => state.sqlQuery);

  queryControl = new FormControl('', [Validators.required]);
  validationMessage = '';
  isValidQuery = false;

  queryResult = output<string>();
  pageLoading = output<boolean>();

  get validationMessageClasses(): string {
    return `px-3 py-1 rounded-sm ${
      this.isValidQuery ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`;
  }

  constructor() {
    effect(() => {
      if (this.sqlData() && this.sqlData().sqlQuery) {
        this.queryControl.setValue(this.sqlData().sqlQuery);
      }
    });
  }

  ngOnInit(): void {
    this.queryControl.valueChanges.subscribe(() => {
      this.onQueryChange();
    })
  }

  onQueryChange(): void {
    const query = this.queryControl.value?.trim().toUpperCase() || '';
    if (!query) {
      this.validationMessage = 'Please enter a SQL query';
      this.isValidQuery = false;
      return;
    }

    if (!this.isSelectStatement(query)) {
      this.validationMessage = 'Only SELECT statements are allowed';
      this.isValidQuery = false;
      return;
    }

    this.validationMessage = 'Valid SELECT query';
    this.isValidQuery = true;

  }

  executeQuery(): void {
    if (this.isValidQuery && this.queryControl.value) {
      this.dispatch(addSQLQuery(this.queryControl.value));
      const processedQuery = addLimitIfNeeded(this.queryControl.value);
      const updatedPGTable = addQuotesToTableNames(processedQuery);
      const updatedPGColumns = addQuotesToColumnNames(updatedPGTable);
      this.getTableData(`${this.rootDatasource().active?.projectId}`, updatedPGColumns)
    }
  }

  clearEditor(): void {
    this.queryControl.reset();
    this.validationMessage = '';
    this.isValidQuery = false;
    this.dispatch(clearSQLQuery(''));
    this.dispatch(clearDocuments([]));
    this.queryResult.emit(JSON.stringify([]));
  }

  private isSelectStatement(query: string): boolean {
    const normalizeQuery = query.trim().toUpperCase();

    if (!normalizeQuery.startsWith('SELECT')) {
      return false;
    }

    // Check for prohibited statements
    const prohibitedStatements: string[] = [
      'INSERT',
      'DELETE',
      'UPDATE',
      'DROP',
      'CREATE',
      'ALTER',
      'GRANT',
      'REVOKE'
    ];

    return !prohibitedStatements.some((keyword: string) => normalizeQuery.includes(keyword));
  }

  private async getTableData(projectId: string, sqlQuery: string): Promise<void> {
    try {
      this.pageLoading.emit(true);
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
      this.queryResult.emit(documents);
      const filteredDocuments = JSON.parse(documents).filter((obj: Record<string, unknown>) => Object.keys(obj).length > 0);
    } catch (error) {
      this.toastService.show('Failed to return result', 'error');
    } finally {
      this.pageLoading.emit(false);
    }
  }

}
