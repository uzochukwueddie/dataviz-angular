import { CommonModule } from "@angular/common";
import { Component, effect, inject, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Apollo } from "apollo-angular";
import { HighlightModule } from "ngx-highlightjs";
import { injectAppDispatch, injectAppSelector } from "../../../../store";
import { IReduxState } from "../../../../store/store.interface";
import { ToastService } from "../../../../shared/services/toast.service";
import { firstValueFrom } from "rxjs";
import { GET_POSTGRESQL_TABLE_DATA } from "../../graphql/postgresql";
import { clearDocuments } from "../../reducers/documents.reducer";
import { addPromptSQLQuery, clearPromptSQLQuery } from "../../reducers/sql.reducer";

@Component({
  selector: 'app-prompt-editor',
  imports: [CommonModule, FormsModule, HighlightModule],
  template: `
    <div class="h-full flex flex-col">
      <div class="bg-gray-100 px-4 py-2 flex gap-4 justify-end items-center">
        <button (click)="clearEditor()"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors">
          Clear
        </button>
        <button
            [disabled]="!prompt()"
            (click)="handleSubmit()"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Run Query
        </button>
      </div>

      <textarea
        [(ngModel)]="prompt"
        name="promptText"
        placeholder="Show me all users who signed up in the last month"
        class="w-full h-30 p-4 focus:outline-none resize-none"></textarea>
      <div class="border rounded-t-lg bg-white py-2">
          <div class="flex items-center justify-between mb-2s px-3">
              <h3 class="font-medium">Generated SQL</h3>
              <button (click)="copySqlToClipboard()" class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <i class="fa fa-copy"></i>
                  Copy
              </button>
          </div>
          <div class="bg-gray-50 rounded-lg font-mono text-sm overflow-x-auto">
            <pre><code [highlight]="sqlQuery() || 'No SQL generated yet'" language="sql"></code></pre>
          </div>
      </div>
    </div>
  `
})
export class PromptEditorComponent {
  private readonly apollo: Apollo = inject(Apollo);
  private toastService = inject(ToastService);
  private readonly dispatch = injectAppDispatch();
  private rootDatasource = injectAppSelector((state: IReduxState) => state.datasource);
  private sqlData = injectAppSelector((state: IReduxState) => state.sqlQuery);

  prompt = signal<string>('');
  sqlQuery = signal<string>('');
  pageLoading = output<boolean>();
  promptResult = output<string>();

  constructor() {
    effect(() => {
      if (this.sqlData() && this.sqlData().promptQuery) {
        this.sqlQuery.set(this.sqlData().promptQuery);
      }
    });
  }

  async handleSubmit(): Promise<void> {
    if (!this.prompt()) return;
    try {
      this.pageLoading.emit(true);
      const { data } = await firstValueFrom(
        this.apollo.query({
          query: GET_POSTGRESQL_TABLE_DATA,
          fetchPolicy: 'no-cache',
          variables: {
            info: {
              prompt: this.prompt(),
              projectId: this.rootDatasource().active?.projectId
            }
          }
        })
      );
      const { getSQLQueryData } = data as any;
      this.promptResult.emit(getSQLQueryData);
      const { sql } = JSON.parse(getSQLQueryData);
      const sqlData = sql.replace(/\n/g, ' ');
      this.sqlQuery.set(sqlData.replace(/\s+/g, ' '));
      this.dispatch(addPromptSQLQuery(sqlData.replace(/\s+/g, ' ')));
    } catch (error) {
      this.toastService.show('Failed to return result', 'error');
    } finally {
      this.pageLoading.emit(false);
    }
  }

  copySqlToClipboard(): void {
    if (this.sqlQuery()) {
      navigator.clipboard.writeText(this.sqlQuery())
        .then(() => console.log('SQL copied to clipboard'))
        .catch(() => console.log('Failed to copy SQL.'));
    }
  }

  clearEditor(): void {
    this.sqlQuery.set('');
    this.prompt.set('');
    this.dispatch(clearPromptSQLQuery(''));
    this.dispatch(clearDocuments([]));
    this.promptResult.emit(JSON.stringify({sql: '', result: []}));
  }
}
