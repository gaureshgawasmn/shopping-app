import { CurrencyPipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItem } from '../cart-status/cart-item';
import { CartService } from '../cart-status/cart.service';

@Component({
  selector: 'app-cart-details',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css',
})
export class CartDetailsComponent {
  constructor(private readonly cartService: CartService) {}

  get cartItems() {
    return computed(() => this.cartService.cartItems());
  }

  get totalQuantity() {
    return computed(() => this.cartService.totalQuantity());
  }

  get totalPrice() {
    return computed(() => this.cartService.totalPrice());
  }

  incrementQuantity(item: CartItem) {
    this.cartService.addToCart(item);
  }

  decrementQuantity(item: CartItem) {
    this.cartService.decrementQuantity(item);
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item);
  }
}
