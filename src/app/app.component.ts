import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { IconSidebarComponent } from './shared/components/sidebar/icon-sidebar.component';

@Component({
  selector: 'app-root',
  imports: [
    ToastComponent,
    SidebarComponent,
    IconSidebarComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  router: Router = inject(Router);

  get activeUrl(): string {
    return this.router.url;
  }

  get isActive(): boolean {
    const url = this.router.url;
    return url.includes('/charts/create') || url.includes('/charts/edit');
  }
}
