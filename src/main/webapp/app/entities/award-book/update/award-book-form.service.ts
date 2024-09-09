import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IAwardBook, NewAwardBook } from '../award-book.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAwardBook for edit and NewAwardBookFormGroupInput for create.
 */
type AwardBookFormGroupInput = IAwardBook | PartialWithRequiredKeyOf<NewAwardBook>;

type AwardBookFormDefaults = Pick<NewAwardBook, 'id'>;

type AwardBookFormGroupContent = {
  id: FormControl<IAwardBook['id'] | NewAwardBook['id']>;
  year: FormControl<IAwardBook['year']>;
  book: FormControl<IAwardBook['book']>;
  award: FormControl<IAwardBook['award']>;
};

export type AwardBookFormGroup = FormGroup<AwardBookFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AwardBookFormService {
  createAwardBookFormGroup(awardBook: AwardBookFormGroupInput = { id: null }): AwardBookFormGroup {
    const awardBookRawValue = {
      ...this.getFormDefaults(),
      ...awardBook,
    };
    return new FormGroup<AwardBookFormGroupContent>({
      id: new FormControl(
        { value: awardBookRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      year: new FormControl(awardBookRawValue.year, {
        validators: [Validators.required],
      }),
      book: new FormControl(awardBookRawValue.book),
      award: new FormControl(awardBookRawValue.award),
    });
  }

  getAwardBook(form: AwardBookFormGroup): IAwardBook | NewAwardBook {
    return form.getRawValue() as IAwardBook | NewAwardBook;
  }

  resetForm(form: AwardBookFormGroup, awardBook: AwardBookFormGroupInput): void {
    const awardBookRawValue = { ...this.getFormDefaults(), ...awardBook };
    form.reset(
      {
        ...awardBookRawValue,
        id: { value: awardBookRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AwardBookFormDefaults {
    return {
      id: null,
    };
  }
}
