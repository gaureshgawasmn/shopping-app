import '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  OKTA_AUTH,
  OktaAuthModule,
  OktaAuthStateService,
} from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  standalone: true,
  imports: [RouterLink],
  providers: [
    OktaAuthStateService, // Explicitly provide OktaAuthStateService in the component
    OktaAuthModule,
  ],
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.css',
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean = false;
  userFullName: string = '';

  constructor(
    private readonly oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private readonly oktaAuth: OktaAuth
  ) {}

  ngOnInit(): void {
    this.oktaAuthService.authState$.subscribe((result) => {
      this.isAuthenticated = result.isAuthenticated!;
      this.getUserDetails();
    });
  }

  getUserDetails() {
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then((res) => {
        this.userFullName = res.name as string;
      });
    }
  }

  logOut(): void {
    this.oktaAuth.signOut();
  }
}
