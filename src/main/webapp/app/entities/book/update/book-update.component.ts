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
import { IPublisher } from 'app/entities/publisher/publisher.model';
import { PublisherService } from 'app/entities/publisher/service/publisher.service';
import { IBookCategory } from 'app/entities/book-category/book-category.model';
import { BookCategoryService } from 'app/entities/book-category/service/book-category.service';
import { IAuthor } from 'app/entities/author/author.model';
import { AuthorService } from 'app/entities/author/service/author.service';
import { BookFormat } from 'app/entities/enumerations/book-format.model';
import { Language } from 'app/entities/enumerations/language.model';
import { BookService } from '../service/book.service';
import { IBook } from '../book.model';
import { BookFormGroup, BookFormService } from './book-form.service';

@Component({
  standalone: true,
  selector: 'jhi-book-update',
  templateUrl: './book-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BookUpdateComponent implements OnInit {
  isSaving = false;
  book: IBook | null = null;
  bookImageFile: File | null | undefined = null;
  bookFormatValues = Object.keys(BookFormat);
  languageValues = Object.keys(Language);

  publishersSharedCollection: IPublisher[] = [];
  bookCategoriesSharedCollection: IBookCategory[] = [];
  authorsSharedCollection: IAuthor[] = [];

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected bookService = inject(BookService);
  protected bookFormService = inject(BookFormService);
  protected publisherService = inject(PublisherService);
  protected bookCategoryService = inject(BookCategoryService);
  protected authorService = inject(AuthorService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: BookFormGroup = this.bookFormService.createBookFormGroup();

  comparePublisher = (o1: IPublisher | null, o2: IPublisher | null): boolean => this.publisherService.comparePublisher(o1, o2);

  compareBookCategory = (o1: IBookCategory | null, o2: IBookCategory | null): boolean =>
    this.bookCategoryService.compareBookCategory(o1, o2);

  compareAuthor = (o1: IAuthor | null, o2: IAuthor | null): boolean => this.authorService.compareAuthor(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ book }) => {
      this.book = book;
      if (book) {
        this.updateForm(book);
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
  onImagePicked(event: Event): void {
    if (event.target !== null) {
      const HTMLInputElement = event.target as HTMLInputElement;
      this.bookImageFile = HTMLInputElement.files?.item(0);
    }
  }
  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const book = this.bookFormService.getBook(this.editForm);
    const formData = new FormData();
    if (book.id !== null) {
      this.subscribeToSaveResponse(this.bookService.update(book));
    } else {
      if (this.bookImageFile !== null && this.bookImageFile !== undefined)
        this.subscribeToSaveResponse(this.bookService.create(book, this.bookImageFile));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBook>>): void {
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

  protected updateForm(book: IBook): void {
    this.book = book;
    this.bookFormService.resetForm(this.editForm, book);

    this.publishersSharedCollection = this.publisherService.addPublisherToCollectionIfMissing<IPublisher>(
      this.publishersSharedCollection,
      book.publisher,
    );
    this.bookCategoriesSharedCollection = this.bookCategoryService.addBookCategoryToCollectionIfMissing<IBookCategory>(
      this.bookCategoriesSharedCollection,
      ...(book.categories ?? []),
    );
    this.authorsSharedCollection = this.authorService.addAuthorToCollectionIfMissing<IAuthor>(
      this.authorsSharedCollection,
      ...(book.authors ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.publisherService
      .query()
      .pipe(map((res: HttpResponse<IPublisher[]>) => res.body ?? []))
      .pipe(
        map((publishers: IPublisher[]) =>
          this.publisherService.addPublisherToCollectionIfMissing<IPublisher>(publishers, this.book?.publisher),
        ),
      )
      .subscribe((publishers: IPublisher[]) => (this.publishersSharedCollection = publishers));

    this.bookCategoryService
      .query()
      .pipe(map((res: HttpResponse<IBookCategory[]>) => res.body ?? []))
      .pipe(
        map((bookCategories: IBookCategory[]) =>
          this.bookCategoryService.addBookCategoryToCollectionIfMissing<IBookCategory>(bookCategories, ...(this.book?.categories ?? [])),
        ),
      )
      .subscribe((bookCategories: IBookCategory[]) => (this.bookCategoriesSharedCollection = bookCategories));

    this.authorService
      .query()
      .pipe(map((res: HttpResponse<IAuthor[]>) => res.body ?? []))
      .pipe(map((authors: IAuthor[]) => this.authorService.addAuthorToCollectionIfMissing<IAuthor>(authors, ...(this.book?.authors ?? []))))
      .subscribe((authors: IAuthor[]) => (this.authorsSharedCollection = authors));
  }
}
