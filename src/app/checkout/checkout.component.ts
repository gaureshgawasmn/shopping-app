import { CurrencyPipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CartService } from '../cart-status/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  constructor(private readonly cartService: CartService) {}

  get totalQuantity() {
    return computed(() => this.cartService.totalQuantity());
  }
  get totalPrice() {
    return computed(() => this.cartService.totalPrice());
  }

  checkOutFromGroup = new FormGroup({
    customer: new FormGroup({
      firstName: new FormControl<string>('', Validators.required),
      lastName: new FormControl<string>('', Validators.required),
      email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),
    }),
    shippingAddress: new FormGroup({
      country: new FormControl<string>('', Validators.required),
      street: new FormControl<string>('', Validators.required),
      city: new FormControl<string>('', Validators.required),
      state: new FormControl<string>('', Validators.required),
      zipCode: new FormControl<string>('', Validators.required),
    }),
    billingAddress: new FormGroup({
      country: new FormControl<string>('', Validators.required),
      street: new FormControl<string>('', Validators.required),
      city: new FormControl<string>('', Validators.required),
      state: new FormControl<string>('', Validators.required),
      zipCode: new FormControl<string>('', Validators.required),
    }),
    creditCard: new FormGroup({
      cardType: new FormControl<string>('', Validators.required),
      nameOnCard: new FormControl<string>('', Validators.required),
      cardNumber: new FormControl<string>('', Validators.required),
      securityCode: new FormControl<string>('', Validators.required),
      expirationMonth: new FormControl<string>('', Validators.required),
      expirationYear: new FormControl<string>('', Validators.required),
    }),
  });

  onSubmitPurchase() {
    console.log(this.checkOutFromGroup);
  }

  copyShippingToBilling(event: any) {
    console.log(event);
    if (event.target?.checked) {
      this.checkOutFromGroup.controls.billingAddress.setValue({
        country:
          this.checkOutFromGroup.controls.shippingAddress.value.country ?? null,
        street:
          this.checkOutFromGroup.controls.shippingAddress.value.street ?? null,
        city:
          this.checkOutFromGroup.controls.shippingAddress.value.city ?? null,
        state:
          this.checkOutFromGroup.controls.shippingAddress.value.state ?? null,
        zipCode:
          this.checkOutFromGroup.controls.shippingAddress.value.zipCode ?? null,
      });
    } else {
      this.checkOutFromGroup.controls.billingAddress.reset();
    }
  }
}
