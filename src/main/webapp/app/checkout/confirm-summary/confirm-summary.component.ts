import { Component, inject, Input } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { FormGroup } from '@angular/forms';
import { CurrencyPipe, DatePipe, NgForOf } from '@angular/common';
import { CartService } from 'app/core/cart/cart.service';

@Component({
  selector: 'jhi-confirm-summary',
  standalone: true,
  imports: [FieldsetModule, DatePipe, NgForOf, CurrencyPipe],
  templateUrl: './confirm-summary.component.html',
  styleUrl: './confirm-summary.component.scss',
})
export class ConfirmSummaryComponent {
  @Input() addressForm!: FormGroup;
  @Input() paymentForm!: FormGroup;

  constructor(protected cartService: CartService) {}
}
