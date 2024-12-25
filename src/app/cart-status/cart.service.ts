import { Injectable, signal } from '@angular/core';
import { CartItem } from './cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];
  totalPrice = signal<number>(0.0);
  totalQuantity = signal<number>(0);

  constructor() {}

  addToCart(newItem: CartItem) {
    let existingCartItem = this.cartItems.find(
      (item) => item.id === newItem.id
    );
    if (existingCartItem) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(newItem);
    }
    this.computeCartTotal();
  }

  computeCartTotal() {
    let totalPrice = 0;
    let totalQuantity = 0;
    for (let currentItem of this.cartItems) {
      totalPrice += currentItem.quantity * currentItem.unitPrice;
      totalQuantity += currentItem.quantity;
    }
    this.totalPrice.set(totalPrice);
    this.totalQuantity.set(totalQuantity);
  }
}
