import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { Apollo } from "apollo-angular";
import { injectAppDispatch } from "../../store";
import { firstValueFrom } from "rxjs";
import { CHECK_CURRENT_USER } from "../../features/auth/graphql/auth";
import { addAuthUser } from "../../features/auth/reducers/auth.reducer";
import { getLocalStorageItem, setLocalStorageItem } from "../utils/utils";
import { addDataSource } from "../../features/datasources/reducers/datasource.reducer";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private router: Router = inject(Router);
  private apollo: Apollo = inject(Apollo);
  private dispatch = injectAppDispatch();

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    try {
      const { data } = await firstValueFrom(
        this.apollo.query({
          query: CHECK_CURRENT_USER,
          fetchPolicy: 'no-cache'
        })
      );
      const { checkCurrentUser } = data as any;
      const { user, projectIds, collections } = checkCurrentUser;
      this.dispatch(addAuthUser({ authInfo: user }));
      const activeProject = getLocalStorageItem('activeProject');
      setLocalStorageItem(
        'activeProject',
        activeProject !== 'undefined' && activeProject !== null ? JSON.stringify(activeProject) : JSON.stringify(projectIds[0])
      );
      this.dispatch(addDataSource({
        active: activeProject !== 'undefined' && activeProject !== null ?
                          activeProject : projectIds.length > 0 ? projectIds[0] : null,
        database: activeProject !== 'undefined' && activeProject !== null ?
                          activeProject.database : projectIds.length > 0 ? projectIds[0].database : '',
        dataSource: projectIds
      }));
      // dispatch collections
      return true;
    } catch (error) {
      this.router.navigate(['/']);
      return false;
    }
  }
}
