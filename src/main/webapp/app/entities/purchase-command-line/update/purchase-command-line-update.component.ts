import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';
import { IPurchaseCommand } from 'app/entities/purchase-command/purchase-command.model';
import { PurchaseCommandService } from 'app/entities/purchase-command/service/purchase-command.service';
import { PurchaseCommandLineService } from '../service/purchase-command-line.service';
import { IPurchaseCommandLine } from '../purchase-command-line.model';
import { PurchaseCommandLineFormGroup, PurchaseCommandLineFormService } from './purchase-command-line-form.service';

@Component({
  standalone: true,
  selector: 'jhi-purchase-command-line-update',
  templateUrl: './purchase-command-line-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PurchaseCommandLineUpdateComponent implements OnInit {
  isSaving = false;
  purchaseCommandLine: IPurchaseCommandLine | null = null;

  booksSharedCollection: IBook[] = [];
  purchaseCommandsSharedCollection: IPurchaseCommand[] = [];

  protected purchaseCommandLineService = inject(PurchaseCommandLineService);
  protected purchaseCommandLineFormService = inject(PurchaseCommandLineFormService);
  protected bookService = inject(BookService);
  protected purchaseCommandService = inject(PurchaseCommandService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PurchaseCommandLineFormGroup = this.purchaseCommandLineFormService.createPurchaseCommandLineFormGroup();

  compareBook = (o1: IBook | null, o2: IBook | null): boolean => this.bookService.compareBook(o1, o2);

  comparePurchaseCommand = (o1: IPurchaseCommand | null, o2: IPurchaseCommand | null): boolean =>
    this.purchaseCommandService.comparePurchaseCommand(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ purchaseCommandLine }) => {
      this.purchaseCommandLine = purchaseCommandLine;
      if (purchaseCommandLine) {
        this.updateForm(purchaseCommandLine);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const purchaseCommandLine = this.purchaseCommandLineFormService.getPurchaseCommandLine(this.editForm);
    if (purchaseCommandLine.id !== null) {
      this.subscribeToSaveResponse(this.purchaseCommandLineService.update(purchaseCommandLine));
    } else {
      this.subscribeToSaveResponse(this.purchaseCommandLineService.create(purchaseCommandLine));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPurchaseCommandLine>>): void {
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

  protected updateForm(purchaseCommandLine: IPurchaseCommandLine): void {
    this.purchaseCommandLine = purchaseCommandLine;
    this.purchaseCommandLineFormService.resetForm(this.editForm, purchaseCommandLine);

    this.booksSharedCollection = this.bookService.addBookToCollectionIfMissing<IBook>(this.booksSharedCollection, purchaseCommandLine.book);
    this.purchaseCommandsSharedCollection = this.purchaseCommandService.addPurchaseCommandToCollectionIfMissing<IPurchaseCommand>(
      this.purchaseCommandsSharedCollection,
      purchaseCommandLine.purchaseCommand,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.bookService
      .query()
      .pipe(map((res: HttpResponse<IBook[]>) => res.body ?? []))
      .pipe(map((books: IBook[]) => this.bookService.addBookToCollectionIfMissing<IBook>(books, this.purchaseCommandLine?.book)))
      .subscribe((books: IBook[]) => (this.booksSharedCollection = books));

    this.purchaseCommandService
      .query()
      .pipe(map((res: HttpResponse<IPurchaseCommand[]>) => res.body ?? []))
      .pipe(
        map((purchaseCommands: IPurchaseCommand[]) =>
          this.purchaseCommandService.addPurchaseCommandToCollectionIfMissing<IPurchaseCommand>(
            purchaseCommands,
            this.purchaseCommandLine?.purchaseCommand,
          ),
        ),
      )
      .subscribe((purchaseCommands: IPurchaseCommand[]) => (this.purchaseCommandsSharedCollection = purchaseCommands));
  }
}
