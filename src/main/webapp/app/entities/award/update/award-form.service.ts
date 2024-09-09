import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IAward, NewAward } from '../award.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAward for edit and NewAwardFormGroupInput for create.
 */
type AwardFormGroupInput = IAward | PartialWithRequiredKeyOf<NewAward>;

type AwardFormDefaults = Pick<NewAward, 'id'>;

type AwardFormGroupContent = {
  id: FormControl<IAward['id'] | NewAward['id']>;
  name: FormControl<IAward['name']>;
  description: FormControl<IAward['description']>;
};

export type AwardFormGroup = FormGroup<AwardFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AwardFormService {
  createAwardFormGroup(award: AwardFormGroupInput = { id: null }): AwardFormGroup {
    const awardRawValue = {
      ...this.getFormDefaults(),
      ...award,
    };
    return new FormGroup<AwardFormGroupContent>({
      id: new FormControl(
        { value: awardRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(awardRawValue.name, {
        validators: [Validators.required],
      }),
      description: new FormControl(awardRawValue.description),
    });
  }

  getAward(form: AwardFormGroup): IAward | NewAward {
    return form.getRawValue() as IAward | NewAward;
  }

  resetForm(form: AwardFormGroup, award: AwardFormGroupInput): void {
    const awardRawValue = { ...this.getFormDefaults(), ...award };
    form.reset(
      {
        ...awardRawValue,
        id: { value: awardRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AwardFormDefaults {
    return {
      id: null,
    };
  }
}
