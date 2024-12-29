import { CurrencyPipe } from '@angular/common';
import { Component, computed, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CartService } from '../cart-status/cart.service';
import { Country } from './country.model';
import { FormService } from './form.service';
import { State } from './state.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  constructor(
    private readonly cartService: CartService,
    private readonly formService: FormService
  ) {
    this.formService.ngOnInit();
  }

  contries: Country[] = [];
  shippingStates: State[] = [];
  billingStates: State[] = [];

  ngOnInit() {
    this.formService.getAvailableContries().subscribe((data) => {
      this.contries = data;
    });
  }

  get totalQuantity() {
    return computed(() => this.cartService.totalQuantity());
  }
  get totalPrice() {
    return computed(() => this.cartService.totalPrice());
  }

  get creditCardYears() {
    return computed(() => this.formService.creditCardYears());
  }

  get creditCardMonths() {
    return computed(() => this.formService.creditCardMonths());
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
      country: new FormControl<Country | null>(null, Validators.required),
      street: new FormControl<string>('', Validators.required),
      city: new FormControl<string>('', Validators.required),
      state: new FormControl<number>(0, Validators.required),
      zipCode: new FormControl<string>('', Validators.required),
    }),
    billingAddress: new FormGroup({
      country: new FormControl<Country | null>(null, Validators.required),
      street: new FormControl<string>('', Validators.required),
      city: new FormControl<string>('', Validators.required),
      state: new FormControl<number>(0, Validators.required),
      zipCode: new FormControl<string>('', Validators.required),
    }),
    creditCard: new FormGroup({
      cardType: new FormControl<string>('', Validators.required),
      nameOnCard: new FormControl<string>('', Validators.required),
      cardNumber: new FormControl<string>('', Validators.required),
      securityCode: new FormControl<string>('', Validators.required),
      expirationMonth: new FormControl<number>(0, Validators.required),
      expirationYear: new FormControl<number>(0, Validators.required),
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
      this.billingStates = this.shippingStates;
    } else {
      this.checkOutFromGroup.controls.billingAddress.reset();
      this.billingStates = [];
    }
  }

  onCreditCardYearChange() {
    const expirationYear =
      this.checkOutFromGroup.controls.creditCard.controls.expirationYear.value;

    const validYear = Number(expirationYear);
    const yearToUse =
      !isNaN(validYear) && validYear > 0 ? validYear : new Date().getFullYear();

    this.formService.updateCreditCardMonths(yearToUse);
  }

  updateStates(formGroupName: 'shippingAddress' | 'billingAddress') {
    const formGroup = this.checkOutFromGroup.controls[formGroupName];
    const country = formGroup.controls.country.value?.code ?? 'IN';
    this.formService.getStatesForContry(country).subscribe((states) => {
      if (formGroupName === 'billingAddress') {
        this.billingStates = states;
      } else {
        this.shippingStates = states;
      }
      if (states.length > 0) {
        formGroup.controls.state.setValue(states[0].id);
      }
    });
  }
}
