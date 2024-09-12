import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AlertErrorComponent } from '../../shared/alert/alert-error.component';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'jhi-confirm-payment',
  standalone: true,
  imports: [AlertErrorComponent, ReactiveFormsModule, InputMaskModule],
  templateUrl: './confirm-payment.component.html',
  styleUrl: './confirm-payment.component.scss',
})
export class ConfirmPaymentComponent {
  @Input() paymentForm!: FormGroup;
}
