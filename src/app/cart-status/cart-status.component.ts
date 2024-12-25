import { CurrencyPipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart-status',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css',
})
export class CartStatusComponent {
  constructor(private readonly cartService: CartService) {}

  totalPrice = computed(() => this.cartService.totalPrice());
  totalQuantity = computed(() => this.cartService.totalQuantity());
}
