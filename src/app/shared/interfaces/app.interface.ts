import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { IDatasource } from "../../features/datasources/interfaces/datasource.interface";

export interface NavItem {
    id: number;
    name: string;
    items?: string[];
}

export interface IQueryProp {
    projectId: string;
    queryScope?: string;
    collectionName?: string;
    queries?: IQueryCollection[];
    limit?: string;
    order?: string;
    sortBy?: string;
    mongoQuery?: string;
    sqlQuery?: string;
}

export interface IQueryCollection {
    id?: number;
    column: string;
    operator: string;
    type: string;
    value: string;
}

export interface IPostgreSQLChartQuery {
    projectId: string;
    fieldName?: string;
    collectionName: string;
    metric: string;
    xValue?: string;
    yValue?: string;
    limit: number;
    type?: string;
    order: string;
    sortBy: string;
}

export interface IQueryError {
    time: string;
    message: string;
}

export interface IOrderSort {
    order: string;
    sortBy: string;
}

export interface Option {
    value: string;
    label: string;
}

export interface DataSource {
    name: string;
    parent: IDatasource;
    type: 'cluster' | 'database';
    children?: DataSource[];
}

export interface IVisualizationSource {
    dataSources: DataSource[];
    showTopLevelSelect?: boolean;
    showCollectionSelect: boolean;
    onClickParent: (item: string) => void;
    onClickChild: (childSource: DataSource, item: string) => void;
    onClose: () => void;
}

export interface IVisualizationProp {
    isOpen: boolean;
    isDropdownOpen: boolean;
    selectedOption: string | null;
}

export interface IVisualizationItem {
    source: DataSource,
    level: number,
    showCollectionSelect: boolean;
    onClickParent: (item: string) => void,
    onClickChild: (childSource: DataSource, item: string) => void,
    showTopLevelSelect?: boolean;
}

export interface IAxis {
    name: string;
    type: string;
    value: string;
}

export interface IEditChatProps {
    datasourceId: string;
    chartType: string;
    metric: string;
    xAxis: IAxis | null,
    yAxis: IAxis | null,
    limit: string;
    numberChartValue: number | null,
    chartData: Record<string, unknown>[],
    queryData: Record<string, unknown>[],
    orderBy: string;
    sortBy: string;
    chartName: string;
    queryScope: string;
    chartCreationType: string;
    datasource: string;
}

export interface DataItem {
    [key: string]: unknown;
}
export interface ChartComponentProps {
    data: DataItem[];
    xAxis: string;
    yAxis: string;
    createChartType: string;
    setChartDiv: (div: HTMLDivElement) => void;
}

export interface CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
}

// export interface PaginationEvent {
//   currentPage: number;
//   startIndex: number;
//   endIndex: number;
//   data: Record<string, unknown>[];
// }

export interface IMenuItem {
  icon: string;
  class: string;
  label: string;
  route: string;
}
