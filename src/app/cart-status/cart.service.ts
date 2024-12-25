import { Injectable, signal } from '@angular/core';
import { CartItem } from './cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems = signal<CartItem[]>([]);
  totalPrice = signal<number>(0.0);
  totalQuantity = signal<number>(0);

  constructor() {}

  addToCart(newItem: CartItem) {
    let existingCartItem = this.cartItems().find(
      (item) => item.id === newItem.id
    );
    if (existingCartItem) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.set([...this.cartItems(), newItem]);
    }
    this.computeCartTotal();
  }

  decrementQuantity(existingCartItem: CartItem) {
    let updatedCart;
    let count = existingCartItem.quantity;
    if (count === 1) {
      updatedCart = this.cartItems().filter(
        (item) => item.id != existingCartItem.id
      );
    } else {
      updatedCart = this.cartItems().map((item) => {
        if (item.id === existingCartItem.id) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
    }
    // Set the updated array back to the cartItems signal
    this.cartItems.set(updatedCart);

    // Recompute the cart total after the update
    this.computeCartTotal();
  }

  removeItem(existingCartItem: CartItem) {
    let updatedCart = this.cartItems().filter(
      (item) => item.id != existingCartItem.id
    );
    // Set the updated array back to the cartItems signal
    this.cartItems.set(updatedCart);
    // Recompute the cart total after the update
    this.computeCartTotal();
  }

  computeCartTotal() {
    let totalPrice = 0;
    let totalQuantity = 0;
    for (let currentItem of this.cartItems()) {
      totalPrice += currentItem.quantity * currentItem.unitPrice;
      totalQuantity += currentItem.quantity;
    }
    this.totalPrice.set(totalPrice);
    this.totalQuantity.set(totalQuantity);
  }
}
