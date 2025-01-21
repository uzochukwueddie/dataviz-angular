import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

import { routes } from './app.routes';
import { provideRedux } from '@reduxjs/angular-redux';
import { store } from './store';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideRedux({ store }),
    provideApollo(() => {
      const httpLink: HttpLink = inject(HttpLink);
      const apiUrl = environment.apiUrl;
      return {
        link: httpLink.create({uri: apiUrl, withCredentials: true}),
        cache: new InMemoryCache({
          addTypename: false
        })
      }
    }, {
      useMutationLoading: true
    })
  ]
};
