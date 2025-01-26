import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { injectAppDispatch } from '../../../store';
import { Router, RouterModule } from '@angular/router';
import { LOGOUT_USER } from '../../../features/auth/graphql/auth';
import { updateLogout } from '../../../features/auth/reducers/logout.reducer';
import { deleteLocalStorageItem } from '../../utils/utils';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="h-screen bg-gray-800 text-white flex-shrink-0 transition-all duration-300 ease-in-out"
      [ngClass]="{'w-64': !isCollapsed(), 'w-16': isCollapsed()}">
      <div class="p-4 flex justify-between items-center">
          <h2 [ngClass]="{'opacity-0 w-0': isCollapsed(), 'opacity-100': !isCollapsed()}"
              class="text-xl font-bold transition-all duration-300">DataViz</h2>
          <button (click)="toggleCollapse()" class="p-2 hover:bg-gray-700 rounded transition-transform duration-300"
              [ngClass]="{'rotate-180': isCollapsed()}">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
          </button>
      </div>
      <nav class="mt-4">
          <a routerLink="/dashboard" routerLinkActive="bg-gray-700" [routerLinkActiveOptions]="{exact: true}"
            class="flex gap-3 items-center p-4 hover:bg-gray-700 transition-all duration-300">
              <i class="fas fa-home text-xl"></i>
              <span [ngClass]="{'opacity-0 w-0': isCollapsed(), 'opacity-100': !isCollapsed()}"
                  class="transition-all duration-300">Dashboard</span>
          </a>
          <a routerLink="/charts" routerLinkActive="bg-gray-700" [routerLinkActiveOptions]="{exact: true}"
              class="flex gap-3 items-center p-4 hover:bg-gray-700 transition-all duration-300">
              <i class="fa-regular fa-chart-bar text-xl"></i>
              <span [ngClass]="{'opacity-0 w-0': isCollapsed(), 'opacity-100': !isCollapsed()}"
                  class="transition-all duration-300">Charts</span>
          </a>
          <a routerLink="/datasources" routerLinkActive="bg-gray-700" [routerLinkActiveOptions]="{exact: true}"
              class="flex gap-3 items-center p-4 hover:bg-gray-700 transition-all duration-300">
              <i class="fas fa-database text-xl"></i>
              <span [ngClass]="{'opacity-0 w-0': isCollapsed(), 'opacity-100': !isCollapsed()}"
                  class="transition-all duration-300">Data
                  Sources</span>
          </a>
          <div class="flex-grow"></div>
          <a  (click)="logoutUser()"
              class="flex gap-3 cursor-pointer items-center p-4 hoveer:bg-gray-700 absolute z-10 bottom-0 w-64 transition-all duration-300">
              <i class="fa-solid fa-right-from-bracket text-xl"></i>
              <span [ngClass]="{'opacity-0 w-0': isCollapsed(), 'opacity-100': !isCollapsed()}"
                  class="transition-all duration-300">Logout</span>
          </a>
      </nav>
  </aside>
  `,
})
export class SidebarComponent {
  private collapsed = signal<boolean>(false);
  private readonly apollo: Apollo = inject(Apollo);
  private readonly dispatch = injectAppDispatch();
  private readonly router: Router = inject(Router);

  isCollapsed = computed(() => this.collapsed());

  toggleCollapse(): void {
    this.collapsed.update((value: boolean) => !value);
  }

  logoutUser(): void {
    this.apollo.mutate({ mutation: LOGOUT_USER })
      .subscribe({
        next: () => {
          this.navigateToIndexPage();
        },
        error: () => {
          this.navigateToIndexPage();
        }
      });
  }

  private navigateToIndexPage(): void {
    this.dispatch(updateLogout({}));
    deleteLocalStorageItem('activeProject');
    this.router.navigate(['/']);
  }

}
