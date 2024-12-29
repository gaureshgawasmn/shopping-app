import { CurrencyPipe } from '@angular/common';
import { Component, computed, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../cart-status/cart.service';
import { Purchase } from '../shared/checkout.model';
import { FormErrorComponent } from '../shared/form-error/form-error.component';
import { CheckoutService } from './checkout.service';
import { Country } from './country.model';
import { FormService } from './form.service';
import { State } from './state.model';

// Validator for card number (16 digits)
export function cardNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; // No value, so it's valid (can be empty initially)
    const value = control.value as string;
    const valid = /^[0-9]{16}$/.test(value); // Check if the value is exactly 16 digits
    return valid
      ? null
      : { invalidCardNumber: 'Card number must be exactly 16 digits' };
  };
}

// Validator for security code (3 digits)
export function securityCodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; // No value, so it's valid (can be empty initially)
    const value = control.value as string;
    const valid = /^[0-9]{3}$/.test(value); // Check if the value is exactly 3 digits
    return valid
      ? null
      : { invalidSecurityCode: 'Security code must be exactly 3 digits' };
  };
}

// Validator for security code (3 digits)
export function notOnlyWhiteSpace(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value != null) {
      let value = control.value as string;
      if (value.toString().trim().length === 0) {
        return { notOnlyWhiteSpace: 'true' };
      }
    }
    return null;
  };
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, FormErrorComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  constructor(
    private readonly cartService: CartService,
    private readonly formService: FormService,
    private readonly checkOutService: CheckoutService,
    private readonly router: Router
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
      firstName: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
        notOnlyWhiteSpace(),
      ]),
      lastName: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
        notOnlyWhiteSpace(),
      ]),
      email: new FormControl<string>('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
    }),
    shippingAddress: new FormGroup({
      country: new FormControl<Country | null>(null, Validators.required),
      street: new FormControl<string>('', [
        Validators.required,
        notOnlyWhiteSpace(),
      ]),
      city: new FormControl<string>('', [
        Validators.required,
        notOnlyWhiteSpace(),
      ]),
      state: new FormControl<string | null>(null, Validators.required),
      zipCode: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
        notOnlyWhiteSpace(),
      ]),
    }),
    billingAddress: new FormGroup({
      country: new FormControl<Country | null>(null, Validators.required),
      street: new FormControl<string>('', [
        Validators.required,
        notOnlyWhiteSpace(),
      ]),
      city: new FormControl<string>('', [
        Validators.required,
        notOnlyWhiteSpace(),
      ]),
      state: new FormControl<string | null>(null, Validators.required),
      zipCode: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
        notOnlyWhiteSpace(),
      ]),
    }),
    creditCard: new FormGroup({
      cardType: new FormControl<string>('', Validators.required),
      nameOnCard: new FormControl<string>('', [
        Validators.required,
        notOnlyWhiteSpace(),
      ]),
      cardNumber: new FormControl<number | null>(null, [
        Validators.required,
        cardNumberValidator(), // Custom validator for 16-digit card number
        notOnlyWhiteSpace(),
      ]),
      securityCode: new FormControl<number | null>(null, [
        Validators.required,
        securityCodeValidator(), // Custom validator for 3-digit security code
        notOnlyWhiteSpace(),
      ]),
      expirationMonth: new FormControl<number>(0, Validators.required),
      expirationYear: new FormControl<number>(0, Validators.required),
    }),
  });

  onSubmitPurchase() {
    console.log(this.checkOutFromGroup);
    if (this.checkOutFromGroup.invalid) {
      this.checkOutFromGroup.markAllAsTouched();
    }

    const purchase: Purchase = {
      customer: {
        firstName:
          this.checkOutFromGroup.controls.customer.controls.firstName.value!,
        lastName:
          this.checkOutFromGroup.controls.customer.controls.lastName.value!,
        email: this.checkOutFromGroup.controls.customer.controls.email.value!,
      },
      shippingAddress: {
        street:
          this.checkOutFromGroup.controls.shippingAddress.controls.street
            .value!,
        city: this.checkOutFromGroup.controls.shippingAddress.controls.city
          .value!,
        state:
          this.checkOutFromGroup.controls.shippingAddress.controls.state.value!,
        country:
          this.checkOutFromGroup.controls.shippingAddress.controls.country.value
            ?.code!,
        zipCode:
          this.checkOutFromGroup.controls.shippingAddress.controls.zipCode
            .value!,
      },
      billingAddress: {
        street:
          this.checkOutFromGroup.controls.billingAddress.controls.street.value!,
        city: this.checkOutFromGroup.controls.billingAddress.controls.city
          .value!,
        state:
          this.checkOutFromGroup.controls.billingAddress.controls.state.value!,
        country:
          this.checkOutFromGroup.controls.billingAddress.controls.country.value
            ?.code!,
        zipCode:
          this.checkOutFromGroup.controls.billingAddress.controls.zipCode
            .value!,
      },
      order: {
        totalPrice: this.totalPrice(),
        totalQuantity: this.totalQuantity(),
      },
      orderItems: this.getOrderItems(),
    };

    this.checkOutService.placeOrder(purchase).subscribe({
      next: (response) => {
        alert(
          `Your order has been received.\nOrder tracking number ${response.orderTrackingNumber}`
        );
        this.resetCart();
      },
      error: (error) => {
        alert(`There was an error: ${error.message}`);
      },
    });
  }

  resetCart() {
    // reset cart
    this.cartService.cartItems.set([]);
    this.cartService.computeCartTotal();

    // reset form
    this.checkOutFromGroup.reset();

    // navigate back to product page
    this.router.navigateByUrl('/products');
  }

  getOrderItems() {
    return this.cartService.cartItems().map((cartItem) => ({
      imageUrl: cartItem.imageUrl,
      quantity: cartItem.quantity,
      unitPrice: cartItem.unitPrice,
      productId: cartItem.id,
    }));
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
    this.checkOutFromGroup.controls.creditCard.controls.expirationMonth.setValue(
      this.creditCardMonths()[0]
    );
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
        formGroup.controls.state.setValue(states[0].name);
      }
    });
  }

  getFieldErrors(fieldName: string, field: FormControl<any>): string[] {
    let errorMessages: string[] = [];

    if (field.invalid && (field.touched || field.dirty)) {
      if (field.errors) {
        if (field.errors['required'] || field.errors['notOnlyWhiteSpace']) {
          errorMessages.push(`${fieldName} is required`);
        }
        if (field.errors['minlength']) {
          errorMessages.push(
            `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters long`
          );
        }
        if (field.errors['maxlength']) {
          errorMessages.push(
            `${fieldName} cannot be more than ${field.errors['maxlength'].requiredLength} characters long`
          );
        }
        if (field.errors['email']) {
          errorMessages.push(`Please enter a valid email address`);
        }

        if (field.errors['invalidCardNumber']) {
          errorMessages.push(`${fieldName} must be exactly 16 digits`);
        }

        if (field.errors['invalidSecurityCode']) {
          errorMessages.push(`${fieldName} must be exactly 3 digits`);
        }

        if (field.errors['pattern']) {
          errorMessages.push(`${fieldName} is invalid`);
        }
      }
    }

    return errorMessages;
  }

  // customers error start
  get firstNameErrors(): string[] {
    return this.getFieldErrors(
      'First Name',
      this.checkOutFromGroup.controls.customer.controls.firstName
    );
  }

  get lastNameErrors(): string[] {
    return this.getFieldErrors(
      'Last Name',
      this.checkOutFromGroup.controls.customer.controls.lastName
    );
  }

  get emailErrors(): string[] {
    return this.getFieldErrors(
      'Email',
      this.checkOutFromGroup.controls.customer.controls.email
    );
  }
  // customers error end

  // Shipping and Billing Address Error start
  get countryShippingErrors(): string[] {
    return this.getFieldErrors(
      'Country',
      this.checkOutFromGroup.controls.shippingAddress.controls.country
    );
  }

  get streetShippingErrors(): string[] {
    return this.getFieldErrors(
      'Street',
      this.checkOutFromGroup.controls.shippingAddress.controls.street
    );
  }

  get cityShippingErrors(): string[] {
    return this.getFieldErrors(
      'City',
      this.checkOutFromGroup.controls.shippingAddress.controls.city
    );
  }

  get stateShippingErrors(): string[] {
    return this.getFieldErrors(
      'State',
      this.checkOutFromGroup.controls.shippingAddress.controls.state
    );
  }

  get zipCodeShippingErrors(): string[] {
    return this.getFieldErrors(
      'Zip Code',
      this.checkOutFromGroup.controls.shippingAddress.controls.zipCode
    );
  }

  get countryBillingErrors(): string[] {
    return this.getFieldErrors(
      'Country',
      this.checkOutFromGroup.controls.billingAddress.controls.country
    );
  }

  get streetBillingErrors(): string[] {
    return this.getFieldErrors(
      'Street',
      this.checkOutFromGroup.controls.billingAddress.controls.street
    );
  }

  get cityBillingErrors(): string[] {
    return this.getFieldErrors(
      'City',
      this.checkOutFromGroup.controls.billingAddress.controls.city
    );
  }

  get stateBillingErrors(): string[] {
    return this.getFieldErrors(
      'State',
      this.checkOutFromGroup.controls.billingAddress.controls.state
    );
  }

  get zipCodeBillingErrors(): string[] {
    return this.getFieldErrors(
      'Zip Code',
      this.checkOutFromGroup.controls.billingAddress.controls.zipCode
    );
  }
  // Shipping and Billing Address Error end

  // Credit Card Field Error start
  get cardTypeErrors(): string[] {
    return this.getFieldErrors(
      'Card Type',
      this.checkOutFromGroup.controls.creditCard.controls.cardType
    );
  }

  get nameOnCardErrors(): string[] {
    return this.getFieldErrors(
      'Name on Card',
      this.checkOutFromGroup.controls.creditCard.controls.nameOnCard
    );
  }

  get cardNumberErrors(): string[] {
    return this.getFieldErrors(
      'Card Number',
      this.checkOutFromGroup.controls.creditCard.controls.cardNumber
    );
  }

  get securityCodeErrors(): string[] {
    return this.getFieldErrors(
      'Security Code',
      this.checkOutFromGroup.controls.creditCard.controls.securityCode
    );
  }

  get expirationMonthErrors(): string[] {
    return this.getFieldErrors(
      'Expiration Month',
      this.checkOutFromGroup.controls.creditCard.controls.expirationMonth
    );
  }

  get expirationYearErrors(): string[] {
    return this.getFieldErrors(
      'Expiration Year',
      this.checkOutFromGroup.controls.creditCard.controls.expirationYear
    );
  }
  // Credit Card Field Error end
}
