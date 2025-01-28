import { Component, inject } from "@angular/core";
import { Apollo } from "apollo-angular";
import { injectAppDispatch } from "../../../store";
import { Router, RouterModule } from "@angular/router";
import { CommonModule, Location } from "@angular/common";
import { IMenuItem } from "../../interfaces/app.interface";
import { LOGOUT_USER } from "../../../features/auth/graphql/auth";
import { updateLogout } from "../../../features/auth/reducers/logout.reducer";
import { deleteLocalStorageItem } from "../../utils/utils";

@Component({
  selector: 'app-icon-sidebar',
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="fixed left-0 top-0 h-screen w-16 bg-slate-800 flex flex-col items-center py-4">
      <ul class="flex flex-col gap-6 w-full">
        <li *ngFor="let item of menuItems" class="group {{ item.class }}">
          <a (click)="navigateToIndexPage(item.label, item.route)"
            class="flex justify-center items-center w-full p-2 cursor-pointer text-gray-300 hover:text-white hover:bg-slate-700 transition-all duration-300 ease-in-out"
            [ngClass]="{
            'bg-gray-700': isLinkActive(item.route),
            'text-white': isLinkActive(item.route)
          }">
              <i [class]="item.icon" class="text-xl"></i>

              <span class="absolute z-50 left-16 bg-slate-900 text-white px-2 py-1 rounded text-sm
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
          whitespace-nowrap pointer-events-none">
                {{ item.label}}
              </span>
          </a>
        </li>
      </ul>
    </nav>
  `
})
export class IconSidebarComponent {
  private readonly apollo: Apollo = inject(Apollo);
  private readonly dispatch = injectAppDispatch();
  private readonly router: Router = inject(Router);

  location: Location = inject(Location);
  menuItems: IMenuItem[] = [
    { icon: 'fas fa-home', class: '', label: 'Dashboard', route: '/dashboard' },
    { icon: 'fa-regular fa-chart-bar', class: '', label: 'Charts', route: '/charts' },
    { icon: 'fas fa-database', class: '', label: 'Data Sources', route: '/datasources' },
    { icon: 'fa-solid fa-right-from-bracket', class: 'bottom-0 absolute w-full', label: 'Logout', route: '/' },
  ];

  navigateToIndexPage(label: string, route: string): void {
    if (label === 'Logout') {
      this.logoutUser();
    } else {
      this.router.navigate([route]);
    }
  }

  isLinkActive(path: string): boolean {
    if (path === '/') return false;
    return location.pathname === path || location.pathname.includes(path);
  }

  logoutUser(): void {
    this.apollo.mutate({ mutation: LOGOUT_USER })
      .subscribe({
        next: () => {
          this.logoutNavigate();
        },
        error: () => {
          this.logoutNavigate();
        }
      });
  }

  private logoutNavigate(): void {
    this.dispatch(updateLogout({}));
    deleteLocalStorageItem('activeProject');
    this.router.navigate(['/']);
  }

}
