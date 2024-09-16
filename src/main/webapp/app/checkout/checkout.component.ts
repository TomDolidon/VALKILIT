import { Component } from '@angular/core';
import { ConfirmAddressComponent } from './confirm-address/confirm-address.component';
import { ConfirmPaymentComponent } from './confirm-payment/confirm-payment.component';
import { Button } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { ConfirmSummaryComponent } from './confirm-summary/confirm-summary.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { LocalCartService } from '../core/cart/cart.service';
import { AddressService } from '../entities/address/service/address.service';
import { PurchaseCommandService } from '../entities/purchase-command/service/purchase-command.service';
import { IPurchaseCommandWithLines } from '../entities/purchase-command/purchase-command.model';
import { IAddress } from '../entities/address/address.model';
import { ClientService } from '../entities/client/service/client.service';
import { concatMap, from, of } from 'rxjs';
import { CurrencyPipe, NgForOf } from '@angular/common';
import { PurchaseCommandLineService } from '../entities/purchase-command-line/service/purchase-command-line.service';
import IPurchaseCommandInvalidLine from '../model/IPurchaseCommandInvalidLine';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

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
    NgForOf,
    CurrencyPipe,
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  checkoutForm: FormGroup;
  currentUserAddress!: IAddress;
  isProceedingCheckout = false;
  isProceedingCartAdjustment = false;
  isCartTotallyWrong = false;
  purchaseCommandInvalidLines: IPurchaseCommandInvalidLine[] = [];

  constructor(
    private fb: FormBuilder,
    private localCartService: LocalCartService,
    private addressService: AddressService,
    private purchaseCommandService: PurchaseCommandService,
    private purchaseCommandLineService: PurchaseCommandLineService,
    private clientService: ClientService,
    private messageService: MessageService,
    protected router: Router,
  ) {
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

    this.setCurrentUserAddress();
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

    setTimeout(() => {
      this.purchaseCommandService
        .getSelfCurrentDraftPurchaseCommand()
        .pipe(
          catchError(() => {
            console.error('getSelfCurrentDraftPurchaseCommand error');
            return of(null);
          }),
          switchMap(draftResponse => {
            if (!draftResponse?.body) {
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Votre commande est introuvable.',
              });
              this.isProceedingCheckout = false;
              return of(null);
            }

            const purchaseCommand: IPurchaseCommandWithLines = draftResponse.body as IPurchaseCommandWithLines;

            // Check stock.
            return this.purchaseCommandService.checkSelfCurrentDraftPurchaseCommandStock().pipe(
              // Handle stock issues.
              tap((purchaseCommandInvalidStockResponse: HttpResponse<{}>) => {
                const purchaseCommandInvalidStock = purchaseCommandInvalidStockResponse.body as IPurchaseCommandInvalidLine[];
                this.checkAndHandleStockIssues(purchaseCommandInvalidStock, purchaseCommand);
              }),
              // Handle final steps if there is no stock issues.
              switchMap((purchaseCommandInvalidStockResponse: HttpResponse<{}>) => {
                const purchaseCommandInvalidStock = purchaseCommandInvalidStockResponse.body as IPurchaseCommandInvalidLine[];
                if (purchaseCommandInvalidStock.length) {
                  return of(null);
                }
                this.handleAddressAndConfirm();
                return of(null);
              }),
            );
          }),
        )
        .subscribe();
    }, 6000);
  }

  proceedCheckoutWithAdjustments(): void {
    this.isProceedingCartAdjustment = false;
    this.isProceedingCheckout = true;

    // Prepare observables to fix invalid lines.
    const updateObservables = this.purchaseCommandInvalidLines.map(invalidLine =>
      invalidLine.stock > 0
        ? this.purchaseCommandLineService
            .partialUpdate({
              id: invalidLine.purchaseCommandLineId,
              quantity: invalidLine.stock,
            })
            .pipe(catchError(() => of(undefined)))
        : this.purchaseCommandLineService.delete(invalidLine.purchaseCommandLineId).pipe(catchError(() => of(undefined))),
    );

    // Fix invalid lines one after one and then retry to finalise the checkout.
    from(updateObservables)
      .pipe(
        concatMap(obs => obs),
        catchError(() => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la mise à jour des stocks.' });
          this.isProceedingCheckout = false;
          return of(undefined);
        }),
      )
      .subscribe({
        complete: () => this.proceedCheckout(),
      });
  }

  clearCartAndGoToCatalog(): void {
    this.localCartService.clearCart();
    this.router.navigate(['/catalog']);
  }

  private showPopupToPartiallyClearCart(): void {
    this.isProceedingCartAdjustment = true;
  }

  private showPopupToCompletelyClearCart(): void {
    this.isCartTotallyWrong = true;
  }

  private isAddressAlreadyCreated(): boolean {
    const addressGroupForm = this.getAddressGroupForm();
    return (
      this.currentUserAddress.street === addressGroupForm.get('street')?.value &&
      this.currentUserAddress.city === addressGroupForm.get('city')?.value &&
      this.currentUserAddress.postalCode === addressGroupForm.get('postalCode')?.value &&
      this.currentUserAddress.country === addressGroupForm.get('country')?.value
    );
  }

  private setCurrentUserAddress(): void {
    this.currentUserAddress = {
      id: '',
      city: '',
      country: '',
      postalCode: null,
      street: '',
    };
    this.clientService.getForSelf().subscribe(value => {
      Object.assign(this.currentUserAddress, value.body?.address);
    });
  }

  private checkAndHandleStockIssues(
    purchaseCommandInvalidLines: IPurchaseCommandInvalidLine[],
    purchaseCommand: IPurchaseCommandWithLines,
  ): void {
    if (purchaseCommandInvalidLines.length) {
      this.isProceedingCheckout = false;
      if (
        purchaseCommandInvalidLines.length === purchaseCommand.purchaseCommandLines?.length &&
        purchaseCommandInvalidLines.every(line => line.stock === 0)
      ) {
        this.showPopupToCompletelyClearCart();
      } else {
        this.purchaseCommandInvalidLines = purchaseCommandInvalidLines;
        this.showPopupToPartiallyClearCart();
      }
    }
  }

  private handleAddressAndConfirm(): void {
    if (!this.isAddressAlreadyCreated()) {
      const addressData = this.getAddressGroupForm().value;
      this.addressService.create({ ...addressData, id: null }).subscribe({
        next: () => this.validatePurchaseCommand(),
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: "Erreur lors de la création de l'adresse.",
          }),
      });
    } else {
      this.validatePurchaseCommand();
    }
  }

  private validatePurchaseCommand(): void {
    this.purchaseCommandService.validateSelfCurrentDraftPurchaseCommand().subscribe({
      next: () => {
        this.localCartService.clearCart();
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmation',
          detail: 'Votre commande a été validée. Son expédition se fera dans un délai de 24 heures.',
          life: 6000,
        });
        this.router.navigate(['/']);
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors de la validation de la commande.',
        }),
    });
  }
}
