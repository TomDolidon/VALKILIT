import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IPurchaseCommandLine, NewPurchaseCommandLine } from '../purchase-command-line.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPurchaseCommandLine for edit and NewPurchaseCommandLineFormGroupInput for create.
 */
type PurchaseCommandLineFormGroupInput = IPurchaseCommandLine | PartialWithRequiredKeyOf<NewPurchaseCommandLine>;

type PurchaseCommandLineFormDefaults = Pick<NewPurchaseCommandLine, 'id'>;

type PurchaseCommandLineFormGroupContent = {
  id: FormControl<IPurchaseCommandLine['id'] | NewPurchaseCommandLine['id']>;
  quantity: FormControl<IPurchaseCommandLine['quantity']>;
  unitPrice: FormControl<IPurchaseCommandLine['unitPrice']>;
  book: FormControl<IPurchaseCommandLine['book']>;
  purchaseCommand: FormControl<IPurchaseCommandLine['purchaseCommand']>;
};

export type PurchaseCommandLineFormGroup = FormGroup<PurchaseCommandLineFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PurchaseCommandLineFormService {
  createPurchaseCommandLineFormGroup(purchaseCommandLine: PurchaseCommandLineFormGroupInput = { id: null }): PurchaseCommandLineFormGroup {
    const purchaseCommandLineRawValue = {
      ...this.getFormDefaults(),
      ...purchaseCommandLine,
    };
    return new FormGroup<PurchaseCommandLineFormGroupContent>({
      id: new FormControl(
        { value: purchaseCommandLineRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      quantity: new FormControl(purchaseCommandLineRawValue.quantity, {
        validators: [Validators.required],
      }),
      unitPrice: new FormControl(purchaseCommandLineRawValue.unitPrice, {
        validators: [Validators.required],
      }),
      book: new FormControl(purchaseCommandLineRawValue.book),
      purchaseCommand: new FormControl(purchaseCommandLineRawValue.purchaseCommand),
    });
  }

  getPurchaseCommandLine(form: PurchaseCommandLineFormGroup): IPurchaseCommandLine | NewPurchaseCommandLine {
    return form.getRawValue() as IPurchaseCommandLine | NewPurchaseCommandLine;
  }

  resetForm(form: PurchaseCommandLineFormGroup, purchaseCommandLine: PurchaseCommandLineFormGroupInput): void {
    const purchaseCommandLineRawValue = { ...this.getFormDefaults(), ...purchaseCommandLine };
    form.reset(
      {
        ...purchaseCommandLineRawValue,
        id: { value: purchaseCommandLineRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PurchaseCommandLineFormDefaults {
    return {
      id: null,
    };
  }
}
