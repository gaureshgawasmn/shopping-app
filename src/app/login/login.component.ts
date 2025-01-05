import '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { OktaSignIn } from '@okta/okta-signin-widget';

import { ReactiveFormsModule } from '@angular/forms';
import myAppConfig from '../config/my-app-config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  oktaSignin: any;

  constructor(@Inject(OKTA_AUTH) private readonly oktaAuth: OktaAuth) {
    this.oktaSignin = new OktaSignIn({
      logo: 'images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes,
      },
    });
  }

  ngOnInit(): void {
    this.oktaSignin.remove();

    this.oktaSignin.renderEl(
      {
        el: '#okta-sign-in-widget',
      }, // this name should be same as div tag id in login.component.html
      this.globalSuccessFn, // Pass the success callback
      this.globalErrorFn // Pass the error callback
    );
  }

  // Global Success Handler
  globalSuccessFn = (res: any) => {
    console.log('Success response:', res);
    if (res && res.status === 'SUCCESS') {
      // Pass the response to your signInWithRedirect logic
      this.oktaAuth.signInWithRedirect();
    }
  };

  // Global Error Handler
  globalErrorFn = (error: any) => {
    console.error('Error response:', error);
    throw error;
  };
}
