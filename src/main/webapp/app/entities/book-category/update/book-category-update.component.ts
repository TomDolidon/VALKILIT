import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';
import { BookCategoryService } from '../service/book-category.service';
import { IBookCategory } from '../book-category.model';
import { BookCategoryFormGroup, BookCategoryFormService } from './book-category-form.service';

@Component({
  standalone: true,
  selector: 'jhi-book-category-update',
  templateUrl: './book-category-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BookCategoryUpdateComponent implements OnInit {
  isSaving = false;
  bookCategory: IBookCategory | null = null;

  booksSharedCollection: IBook[] = [];

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected bookCategoryService = inject(BookCategoryService);
  protected bookCategoryFormService = inject(BookCategoryFormService);
  protected bookService = inject(BookService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: BookCategoryFormGroup = this.bookCategoryFormService.createBookCategoryFormGroup();

  compareBook = (o1: IBook | null, o2: IBook | null): boolean => this.bookService.compareBook(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bookCategory }) => {
      this.bookCategory = bookCategory;
      if (bookCategory) {
        this.updateForm(bookCategory);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('valkylitApp.error', { ...err, key: `error.file.${err.key}` })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bookCategory = this.bookCategoryFormService.getBookCategory(this.editForm);
    if (bookCategory.id !== null) {
      this.subscribeToSaveResponse(this.bookCategoryService.update(bookCategory));
    } else {
      this.subscribeToSaveResponse(this.bookCategoryService.create(bookCategory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBookCategory>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(bookCategory: IBookCategory): void {
    this.bookCategory = bookCategory;
    this.bookCategoryFormService.resetForm(this.editForm, bookCategory);

    this.booksSharedCollection = this.bookService.addBookToCollectionIfMissing<IBook>(
      this.booksSharedCollection,
      ...(bookCategory.books ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.bookService
      .query()
      .pipe(map((res: HttpResponse<IBook[]>) => res.body ?? []))
      .pipe(map((books: IBook[]) => this.bookService.addBookToCollectionIfMissing<IBook>(books, ...(this.bookCategory?.books ?? []))))
      .subscribe((books: IBook[]) => (this.booksSharedCollection = books));
  }
}
