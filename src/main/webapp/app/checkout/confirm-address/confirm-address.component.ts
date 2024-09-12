import { Component, Input } from '@angular/core';
import { AlertErrorComponent } from '../../shared/alert/alert-error.component';
import FindLanguageFromKeyPipe from '../../shared/language/find-language-from-key.pipe';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import TranslateDirective from '../../shared/language/translate.directive';
import { TranslateModule } from '@ngx-translate/core';
import { IAddress } from '../../entities/address/address.model';
import { JsonPipe, NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { ClientService } from '../../entities/client/service/client.service';

@Component({
  selector: 'jhi-confirm-address',
  standalone: true,
  imports: [AlertErrorComponent, FindLanguageFromKeyPipe, ReactiveFormsModule, TranslateDirective, TranslateModule, NgIf, Button, JsonPipe],
  templateUrl: './confirm-address.component.html',
  styleUrl: './confirm-address.component.scss',
})
export class ConfirmAddressComponent {
  @Input() addressForm!: FormGroup;
  currentUserAddress!: IAddress;

  constructor(private clientService: ClientService) {
    this.currentUserAddress = {
      id: '',
      city: '',
      country: '',
      postalCode: null,
      street: '',
    };

    this.setCurrentUserAddress();
  }

  success(): boolean {
    return false;
  }

  setCurrentUserAddress(): void {
    this.clientService.getForSelf().subscribe(value => {
      Object.assign(this.currentUserAddress, value.body?.address);
    });
  }

  hydrateFormWithUserCurrentAddress(): void {
    this.addressForm.get('street')?.setValue(this.currentUserAddress.street);
    this.addressForm.get('postalCode')?.setValue(this.currentUserAddress.postalCode);
    this.addressForm.get('city')?.setValue(this.currentUserAddress.city);
    this.addressForm.get('country')?.setValue(this.currentUserAddress.country);
  }

  emptyForm(): void {
    this.addressForm.get('street')?.setValue('');
    this.addressForm.get('postalCode')?.setValue('');
    this.addressForm.get('city')?.setValue('');
    this.addressForm.get('country')?.setValue('');
  }
}
