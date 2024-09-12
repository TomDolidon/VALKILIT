import { Component } from '@angular/core';
import { ConfirmAddressComponent } from './confirm-address/confirm-address.component';
import { ConfirmPaymentComponent } from './confirm-payment/confirm-payment.component';
import { Button } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { ConfirmSummaryComponent } from './confirm-summary/confirm-summary.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'jhi-checkout',
  standalone: true,
  imports: [
    ConfirmAddressComponent,
    ConfirmPaymentComponent,
    Button,
    StepperModule,
    ConfirmSummaryComponent,
    ReactiveFormsModule,
    ConfirmDialogModule,
    DialogModule,
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  checkoutForm: FormGroup;
  isProceedingCheckout = false;

  constructor(private fb: FormBuilder) {
    this.checkoutForm = this.fb.group({
      address: this.fb.group({
        street: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254)]],
        postalCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
        city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(254)]],
        country: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
      }),
      payment: this.fb.group({
        creditCardNumbers: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
        expirationDate: ['', [Validators.required]],
        securityCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      }),
    });
  }

  getAddressGroupForm(): FormGroup {
    return this.checkoutForm.get('address') as FormGroup;
  }

  getPaymentGroupForm(): FormGroup {
    return this.checkoutForm.get('payment') as FormGroup;
  }

  isFormValid(): boolean {
    return this.getAddressGroupForm().valid && this.getPaymentGroupForm().valid;
  }

  proceedCheckout(): void {
    this.isProceedingCheckout = true;

    setInterval(() => {
      this.isProceedingCheckout = false;
    }, 6000);
  }
}
