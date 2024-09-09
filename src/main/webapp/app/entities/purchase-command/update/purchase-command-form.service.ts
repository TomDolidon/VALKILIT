import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IPurchaseCommand, NewPurchaseCommand } from '../purchase-command.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPurchaseCommand for edit and NewPurchaseCommandFormGroupInput for create.
 */
type PurchaseCommandFormGroupInput = IPurchaseCommand | PartialWithRequiredKeyOf<NewPurchaseCommand>;

type PurchaseCommandFormDefaults = Pick<NewPurchaseCommand, 'id'>;

type PurchaseCommandFormGroupContent = {
  id: FormControl<IPurchaseCommand['id'] | NewPurchaseCommand['id']>;
  expeditionDate: FormControl<IPurchaseCommand['expeditionDate']>;
  status: FormControl<IPurchaseCommand['status']>;
  deliveryAddress: FormControl<IPurchaseCommand['deliveryAddress']>;
  client: FormControl<IPurchaseCommand['client']>;
};

export type PurchaseCommandFormGroup = FormGroup<PurchaseCommandFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PurchaseCommandFormService {
  createPurchaseCommandFormGroup(purchaseCommand: PurchaseCommandFormGroupInput = { id: null }): PurchaseCommandFormGroup {
    const purchaseCommandRawValue = {
      ...this.getFormDefaults(),
      ...purchaseCommand,
    };
    return new FormGroup<PurchaseCommandFormGroupContent>({
      id: new FormControl(
        { value: purchaseCommandRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      expeditionDate: new FormControl(purchaseCommandRawValue.expeditionDate),
      status: new FormControl(purchaseCommandRawValue.status, {
        validators: [Validators.required],
      }),
      deliveryAddress: new FormControl(purchaseCommandRawValue.deliveryAddress),
      client: new FormControl(purchaseCommandRawValue.client),
    });
  }

  getPurchaseCommand(form: PurchaseCommandFormGroup): IPurchaseCommand | NewPurchaseCommand {
    return form.getRawValue() as IPurchaseCommand | NewPurchaseCommand;
  }

  resetForm(form: PurchaseCommandFormGroup, purchaseCommand: PurchaseCommandFormGroupInput): void {
    const purchaseCommandRawValue = { ...this.getFormDefaults(), ...purchaseCommand };
    form.reset(
      {
        ...purchaseCommandRawValue,
        id: { value: purchaseCommandRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PurchaseCommandFormDefaults {
    return {
      id: null,
    };
  }
}
