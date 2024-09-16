import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IBook, NewBook } from '../book.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBook for edit and NewBookFormGroupInput for create.
 */
type BookFormGroupInput = IBook | PartialWithRequiredKeyOf<NewBook>;

type BookFormDefaults = Pick<NewBook, 'id' | 'categories' | 'authors'>;

type BookFormGroupContent = {
  id: FormControl<IBook['id'] | NewBook['id']>;
  title: FormControl<IBook['title']>;
  subtitle: FormControl<IBook['subtitle']>;
  imageUri: FormControl<IBook['imageUri']>;
  imageFile: FormControl<IBook['imageFile']>;
  price: FormControl<IBook['price']>;
  isbn: FormControl<IBook['isbn']>;
  format: FormControl<IBook['format']>;
  stock: FormControl<IBook['stock']>;
  description: FormControl<IBook['description']>;
  pageCount: FormControl<IBook['pageCount']>;
  language: FormControl<IBook['language']>;
  publishDate: FormControl<IBook['publishDate']>;
  publisher: FormControl<IBook['publisher']>;
  categories: FormControl<IBook['categories']>;
  authors: FormControl<IBook['authors']>;
};

export type BookFormGroup = FormGroup<BookFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BookFormService {
  createBookFormGroup(book: BookFormGroupInput = { id: null }): BookFormGroup {
    const bookRawValue = {
      ...this.getFormDefaults(),
      ...book,
    };
    return new FormGroup<BookFormGroupContent>({
      id: new FormControl(
        { value: bookRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(bookRawValue.title, {
        validators: [Validators.required],
      }),
      subtitle: new FormControl(bookRawValue.subtitle),
      imageUri: new FormControl(bookRawValue.imageUri),
      imageFile: new FormControl(bookRawValue.imageFile, {
        validators: [Validators.required],
      }),
      price: new FormControl(bookRawValue.price, {
        validators: [Validators.required],
      }),
      isbn: new FormControl(bookRawValue.isbn),
      format: new FormControl(bookRawValue.format, {
        validators: [Validators.required],
      }),
      stock: new FormControl(bookRawValue.stock, {
        validators: [Validators.required],
      }),
      description: new FormControl(bookRawValue.description),
      pageCount: new FormControl(bookRawValue.pageCount),
      language: new FormControl(bookRawValue.language, {
        validators: [Validators.required],
      }),
      publishDate: new FormControl(bookRawValue.publishDate, {
        validators: [Validators.required],
      }),
      publisher: new FormControl(bookRawValue.publisher),
      categories: new FormControl(bookRawValue.categories ?? []),
      authors: new FormControl(bookRawValue.authors ?? []),
    });
  }

  getBook(form: BookFormGroup): IBook | NewBook {
    return form.getRawValue() as IBook | NewBook;
  }

  resetForm(form: BookFormGroup, book: BookFormGroupInput): void {
    const bookRawValue = { ...this.getFormDefaults(), ...book };
    form.reset(
      {
        ...bookRawValue,
        id: { value: bookRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BookFormDefaults {
    return {
      id: null,
      categories: [],
      authors: [],
    };
  }
}
