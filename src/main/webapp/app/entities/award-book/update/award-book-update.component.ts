import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';
import { IAward } from 'app/entities/award/award.model';
import { AwardService } from 'app/entities/award/service/award.service';
import { AwardBookService } from '../service/award-book.service';
import { IAwardBook } from '../award-book.model';
import { AwardBookFormGroup, AwardBookFormService } from './award-book-form.service';

@Component({
  standalone: true,
  selector: 'jhi-award-book-update',
  templateUrl: './award-book-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AwardBookUpdateComponent implements OnInit {
  isSaving = false;
  awardBook: IAwardBook | null = null;

  booksSharedCollection: IBook[] = [];
  awardsSharedCollection: IAward[] = [];

  protected awardBookService = inject(AwardBookService);
  protected awardBookFormService = inject(AwardBookFormService);
  protected bookService = inject(BookService);
  protected awardService = inject(AwardService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AwardBookFormGroup = this.awardBookFormService.createAwardBookFormGroup();

  compareBook = (o1: IBook | null, o2: IBook | null): boolean => this.bookService.compareBook(o1, o2);

  compareAward = (o1: IAward | null, o2: IAward | null): boolean => this.awardService.compareAward(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ awardBook }) => {
      this.awardBook = awardBook;
      if (awardBook) {
        this.updateForm(awardBook);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const awardBook = this.awardBookFormService.getAwardBook(this.editForm);
    if (awardBook.id !== null) {
      this.subscribeToSaveResponse(this.awardBookService.update(awardBook));
    } else {
      this.subscribeToSaveResponse(this.awardBookService.create(awardBook));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAwardBook>>): void {
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

  protected updateForm(awardBook: IAwardBook): void {
    this.awardBook = awardBook;
    this.awardBookFormService.resetForm(this.editForm, awardBook);

    this.booksSharedCollection = this.bookService.addBookToCollectionIfMissing<IBook>(this.booksSharedCollection, awardBook.book);
    this.awardsSharedCollection = this.awardService.addAwardToCollectionIfMissing<IAward>(this.awardsSharedCollection, awardBook.award);
  }

  protected loadRelationshipsOptions(): void {
    this.bookService
      .query()
      .pipe(map((res: HttpResponse<IBook[]>) => res.body ?? []))
      .pipe(map((books: IBook[]) => this.bookService.addBookToCollectionIfMissing<IBook>(books, this.awardBook?.book)))
      .subscribe((books: IBook[]) => (this.booksSharedCollection = books));

    this.awardService
      .query()
      .pipe(map((res: HttpResponse<IAward[]>) => res.body ?? []))
      .pipe(map((awards: IAward[]) => this.awardService.addAwardToCollectionIfMissing<IAward>(awards, this.awardBook?.award)))
      .subscribe((awards: IAward[]) => (this.awardsSharedCollection = awards));
  }
}
