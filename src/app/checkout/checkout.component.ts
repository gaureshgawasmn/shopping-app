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
import { CartService } from '../cart-status/cart.service';
import { FormErrorComponent } from '../shared/form-error/form-error.component';
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
      state: new FormControl<number | null>(null, Validators.required),
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
      state: new FormControl<number | null>(null, Validators.required),
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

  get customersError() {
    let errorMessages: string[] = [];
    // Define fields that need to be validated
    const fields = [
      {
        name: 'First Name',
        control: this.checkOutFromGroup.controls.customer.controls.firstName,
      },
      {
        name: 'Last Name',
        control: this.checkOutFromGroup.controls.customer.controls.lastName,
      },
      {
        name: 'Email',
        control: this.checkOutFromGroup.controls.customer.controls.email,
      },
    ];

    // Collect error messages for each field
    fields.forEach((field) => {
      return errorMessages.push(
        ...this.getFieldErrors(field.name, field.control)
      );
    });

    return errorMessages;
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

  get shippingAddressErrors(): string[] {
    const errorMessages: string[] = [];

    const fields = [
      {
        name: 'Country',
        control:
          this.checkOutFromGroup.controls.shippingAddress.controls.country,
      },
      {
        name: 'Street',
        control:
          this.checkOutFromGroup.controls.shippingAddress.controls.street,
      },
      {
        name: 'City',
        control: this.checkOutFromGroup.controls.shippingAddress.controls.city,
      },
      {
        name: 'State',
        control: this.checkOutFromGroup.controls.shippingAddress.controls.state,
      },
      {
        name: 'Zip Code',
        control:
          this.checkOutFromGroup.controls.shippingAddress.controls.zipCode,
      },
    ];

    fields.forEach((field) => {
      errorMessages.push(...this.getFieldErrors(field.name, field.control));
    });

    return errorMessages;
  }

  get billingAddressErrors(): string[] {
    const errorMessages: string[] = [];

    const fields = [
      {
        name: 'Country',
        control:
          this.checkOutFromGroup.controls.billingAddress.controls.country,
      },
      {
        name: 'Street',
        control: this.checkOutFromGroup.controls.billingAddress.controls.street,
      },
      {
        name: 'City',
        control: this.checkOutFromGroup.controls.billingAddress.controls.city,
      },
      {
        name: 'State',
        control: this.checkOutFromGroup.controls.billingAddress.controls.state,
      },
      {
        name: 'Zip Code',
        control:
          this.checkOutFromGroup.controls.billingAddress.controls.zipCode,
      },
    ];

    fields.forEach((field) => {
      errorMessages.push(...this.getFieldErrors(field.name, field.control));
    });

    return errorMessages;
  }

  get creditCardErrors(): string[] {
    const errorMessages: string[] = [];

    const fields = [
      {
        name: 'Card Type',
        control: this.checkOutFromGroup.controls.creditCard.controls.cardType,
      },
      {
        name: 'Name on Card',
        control: this.checkOutFromGroup.controls.creditCard.controls.nameOnCard,
      },
      {
        name: 'Card Number',
        control: this.checkOutFromGroup.controls.creditCard.controls.cardNumber,
      },
      {
        name: 'Security Code',
        control:
          this.checkOutFromGroup.controls.creditCard.controls.securityCode,
      },
      {
        name: 'Expiration Month',
        control:
          this.checkOutFromGroup.controls.creditCard.controls.expirationMonth,
      },
      {
        name: 'Expiration Year',
        control:
          this.checkOutFromGroup.controls.creditCard.controls.expirationYear,
      },
    ];

    fields.forEach((field) => {
      errorMessages.push(...this.getFieldErrors(field.name, field.control));
    });

    return errorMessages;
  }
}
