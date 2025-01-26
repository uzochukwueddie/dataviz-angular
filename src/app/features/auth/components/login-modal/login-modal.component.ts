import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, output, OutputEmitterRef, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ModalComponent } from '../../../../shared/modal/modal.component';
import { Apollo, MutationResult } from 'apollo-angular';
import { injectAppDispatch } from '../../../../store';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LOGIN_USER } from '../../graphql/auth';
import { addAuthUser } from '../../reducers/auth.reducer';
import { getLocalStorageItem, setLocalStorageItem } from '../../../../shared/utils/utils';
import { ToastService } from '../../../../shared/services/toast.service';
import { addDataSource } from '../../../datasources/reducers/datasource.reducer';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    FormsModule
  ],
  templateUrl: './login-modal.component.html'
})
export class LoginModalComponent implements OnDestroy {
  private readonly apollo: Apollo = inject(Apollo);
  private readonly router: Router = inject(Router);
  private toastService: ToastService = inject(ToastService);
  private readonly dispatch = injectAppDispatch();
  private destroy$ = new Subject<void>();

  close: OutputEmitterRef<void> = output<void>();
  signup: OutputEmitterRef<void> = output<void>();

  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    this.isLoading = true;
    this.apollo.mutate({
      mutation: LOGIN_USER,
      fetchPolicy: 'no-cache',
      variables: {
        email: this.email,
        password: this.password
      }
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (result: MutationResult) => {
        if (!result.data) {
          return;
        }
        const { user, projectIds } = result?.data?.loginUser;
        this.dispatch(addAuthUser({ authInfo: user }));
        const activeProject = getLocalStorageItem('activeProject');
        if (!activeProject || activeProject === 'undefined' && projectIds.length > 0) {
          setLocalStorageItem('activeProject', JSON.stringify(projectIds[0]));
        }
        if (activeProject !== 'undefined' && activeProject !== null) {
          this.dispatch(addDataSource({
            active: activeProject ? activeProject : projectIds[0],
            database: activeProject ? activeProject.database : projectIds[0].database,
            dataSource: projectIds
          }));
        }
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error);
        this.toastService.show(error?.message || 'Invalid credentials', 'error');
      }
    });
  }

}
