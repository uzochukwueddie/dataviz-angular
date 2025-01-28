import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './shared/services/auth.guard.service';
import { DatasourceComponent } from './features/datasources/datasource.component';
import { ChartComponent } from './features/charts/chart.component';
import { ChartCreationComponent } from './features/charts/components/chart-creation/chart-creation.component';

export const routes: Routes = [
  { path: '', title: 'App', component: LandingComponent },
  { path: 'dashboard', title: 'DataViz - Dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'datasources', title: 'DataViz - Datasources', component: DatasourceComponent, canActivate: [AuthGuard] },
  { path: 'charts', title: 'DataViz - Charts', component: ChartComponent, canActivate: [AuthGuard] },
  { path: 'charts/create', title: 'DataViz - Create New Chart', component: ChartCreationComponent, canActivate: [AuthGuard] },
  { path: 'charts/edit/:chartId', title: 'DataViz - Edit Chart', component: ChartCreationComponent, canActivate: [AuthGuard] }
];
