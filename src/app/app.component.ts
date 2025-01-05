import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartStatusComponent } from './cart-status/cart-status.component';
import { LoginStatusComponent } from './login-status/login-status.component';
import { SearchComponent } from './search/search.component';
import { SideNavComponent } from './side-nav/side-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SideNavComponent,
    SearchComponent,
    CartStatusComponent,
    LoginStatusComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'shopping-app';
}
