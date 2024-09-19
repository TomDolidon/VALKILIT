/* eslint-disable */

import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { ButtonModule } from 'primeng/button';
import BookCardComponent from 'app/shared/book-card/book-card.component';
import { CarouselModule } from 'primeng/carousel';
import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';
import { HttpResponse } from '@angular/common/http';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ButtonModule,
    BookCardComponent,
    CarouselModule,
    RatingModule,
    FormsModule,
    BookCardComponent,
  ],
})
export default class HomeComponent implements OnInit, OnDestroy {
  recentBooks: IBook[] = [];
  topBooks: [IBook, number][] | [] = [];

  account = signal<Account | null>(null);

  private readonly destroy$ = new Subject<void>();

  private accountService = inject(AccountService);
  private router = inject(Router);

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => this.account.set(account));

    this.loadRecentBooks();
    this.loadTopBooks();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRecentBooks(): void {
    this.bookService
      .query({
        size: 12,
        // sort: this.sortService.buildSortParam({} as any, 'id'),
      })
      .subscribe({
        next: (res: HttpResponse<IBook[]>) => {
          this.recentBooks = res.body ?? [];
        },
        error: () => {},
      });
  }

  loadTopBooks(): void {
    const nbBook = 2;
    this.bookService.getTopBooksByAverageRating(nbBook).subscribe(books => {
      this.topBooks = books;
    });
  }
}
