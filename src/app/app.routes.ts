import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', title: 'App', component: LandingComponent },
  { path: 'dashboard', title: 'DataViz - Dashboard', component: DashboardComponent },
];
