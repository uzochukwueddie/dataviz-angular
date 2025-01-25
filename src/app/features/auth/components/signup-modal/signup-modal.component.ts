import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, output, OutputEmitterRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ModalComponent } from '../../../../shared/modal/modal.component';
import { Apollo, MutationResult } from 'apollo-angular';
import { injectAppDispatch } from '../../../../store';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { REGISTER_USER } from '../../graphql/auth';
import { addAuthUser } from '../../reducers/auth.reducer';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    FormsModule
  ],
  templateUrl: './signup-modal.component.html'
})
export class SignupModalComponent implements OnDestroy {
  private readonly apollo: Apollo = inject(Apollo);
  private readonly router: Router = inject(Router);
  private toastService: ToastService = inject(ToastService);
  private readonly dispatch = injectAppDispatch();
  private destroy$ = new Subject<void>();

  close: OutputEmitterRef<void> = output<void>();
  login: OutputEmitterRef<void> = output<void>();

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
      mutation: REGISTER_USER,
      fetchPolicy: 'no-cache',
      variables: {
        user: {
          email: this.email,
          password: this.password
        }
      }
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (result: MutationResult) => {
        if (!result.data) {
          return;
        }
        const { user } = result?.data?.registerUser;
        this.dispatch(addAuthUser({ authInfo: user }));
        // we don't need to set any data in local storage because user doesn;t have datasources yet.
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
