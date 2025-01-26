import { Injectable, signal } from "@angular/core";
import { IDatasource } from "../../features/datasources/interfaces/datasource.interface";

@Injectable({
  providedIn: 'root'
})
export class DatasourceSignalService {
  private dataSourcesSignal = signal<IDatasource[]>([]);

  public readonly datasources = this.dataSourcesSignal.asReadonly();

  updateDatasources(sources: IDatasource[]): void {
    this.dataSourcesSignal.set(sources);
  }
}
