import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './shared/services/auth.guard.service';
import { DatasourceComponent } from './features/datasources/datasource.component';

export const routes: Routes = [
  { path: '', title: 'App', component: LandingComponent },
  { path: 'dashboard', title: 'DataViz - Dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'datasources', title: 'DataViz - Datasources', component: DatasourceComponent, canActivate: [AuthGuard] },
];
