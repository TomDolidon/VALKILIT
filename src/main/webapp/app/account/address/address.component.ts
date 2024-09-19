import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmAddressComponent } from '../../checkout/confirm-address/confirm-address.component';
import { IAddress } from '../../entities/address/address.model';
import { ClientService } from '../../entities/client/service/client.service';
import { AddressService } from '../../entities/address/service/address.service';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';

@Component({
  selector: 'jhi-address',
  standalone: true,
  imports: [ConfirmAddressComponent, Button],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss',
})
export class AddressComponent {
  addressForm!: FormGroup;
  currentUserAddress!: IAddress;
  clientId!: string;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private addressService: AddressService,
    private messageService: MessageService,
  ) {
    this.setCurrentUserAddress();
  }

  save(): void {
    if (!this.isAddressAlreadyCreated()) {
      const addressData = this.addressForm.value;
      this.addressService.create({ ...addressData, id: null }).subscribe({
        next: response => {
          this.clientService
            .partialUpdate({
              id: this.clientId,
              address: response.body!,
            })
            .subscribe(() => {
              this.currentUserAddress = response.body as IAddress;
              this.messageService.add({
                severity: 'success',
                detail: 'Adresse mise à jour.',
              });
            });
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            detail: "Erreur lors de la création de l'adresse.",
          }),
      });
    } else {
      this.messageService.add({
        severity: 'info',
        detail: 'Cette adresse est déjà liée à votre compte.',
      });
    }
  }

  private isAddressAlreadyCreated(): boolean {
    return (
      this.currentUserAddress.street === this.addressForm.get('street')?.value &&
      this.currentUserAddress.city === this.addressForm.get('city')?.value &&
      this.currentUserAddress.postalCode === this.addressForm.get('postalCode')?.value &&
      this.currentUserAddress.country === this.addressForm.get('country')?.value
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
      this.clientId = value.body?.id as string;
      Object.assign(this.currentUserAddress, value.body?.address);
      this.setAddressGroupForm();
    });
  }

  private setAddressGroupForm(): void {
    this.addressForm = this.fb.group({
      street: [this.currentUserAddress.street, [Validators.required, Validators.minLength(5), Validators.maxLength(254)]],
      postalCode: [this.currentUserAddress.postalCode, [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      city: [
        this.currentUserAddress.city,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(254),
          Validators.pattern("^[a-zA-ZàâäéèêëîïôöùûüÿçÀÂÄÉÈÊËÎÏÔÖÙÛÜŸÇ'’\\-\\s]+$"),
        ],
      ],
      country: [
        this.currentUserAddress.country,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(100),
          Validators.pattern("^[a-zA-ZàâäéèêëîïôöùûüÿçÀÂÄÉÈÊËÎÏÔÖÙÛÜŸÇ'’\\-\\s]+$"),
        ],
      ],
    });
  }
}
