import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { OKTA_AUTH, OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';
import { AuthState, OktaAuth } from '@okta/okta-auth-js';
import { routes } from './app.routes';
import myAppConfig from './config/my-app-config';

const oktaConfig = myAppConfig.oidc;

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always', // this will give access of parent component url param in child component
      })
    ),
    provideHttpClient(),
    {
      provide: OKTA_CONFIG,
      useValue: { oktaConfig }, // Providing OktaAuth configuration
    },
    {
      provide: OKTA_AUTH,
      // useValue: { oktaAuth }, // having issue with null state
      useFactory: () => {
        const oktaAuth = new OktaAuth(oktaConfig);
        console.log('Okta auth instance created!');
        // You can perform any setup here, like subscribing to authStateManager
        oktaAuth.authStateManager.subscribe((authState: AuthState) => {
          console.log('AuthState updated', authState);
        });
        return oktaAuth;
      },
    },
    OktaAuthModule,
  ],
};
