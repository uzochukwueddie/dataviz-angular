import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
}

export interface IMenuItem {
  icon: string;
  class: string;
  label: string;
  route: string;
}

export interface ISQLPayload {
  promptQuery: string;
  sqlQuery: string;
}
