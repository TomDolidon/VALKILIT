/* eslint-disable */

import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { ButtonModule } from 'primeng/button';
import BookCard2Component from 'app/shared/book-card/book-card.component';
import { CarouselModule } from 'primeng/carousel';
import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SharedModule, RouterModule, ButtonModule, BookCard2Component, CarouselModule],
})
export default class HomeComponent implements OnInit, OnDestroy {
  recentBooks: IBook[] = [];

  // books = [
  //   {
  //     title: 'Le Hobbit',
  //     subtitle: "Voyage d'un aventurier",
  //     description: "Une histoire fantastique de la quête d'un hobbit à travers un monde magique.",
  //     imageUri: 'https://picsum.photos/200/300',
  //     price: 14.99,
  //     isbn: '9780261103283',
  //   },
  //   {
  //     title: 'Harry Potter',
  //     subtitle: "À l'école des sorciers",
  //     description: "Le premier tome de la célèbre saga d'un jeune sorcier.",
  //     imageUri: 'https://picsum.photos/200/301',
  //     price: 19.99,
  //     isbn: '9780747532743',
  //   },
  //   {
  //     title: 'Le Seigneur des Anneaux',
  //     subtitle: "La communauté de l'anneau",
  //     description: 'Une quête épique pour détruire un anneau maléfique.',
  //     imageUri: 'https://picsum.photos/200/302',
  //     price: 24.99,
  //     isbn: '9780261103573',
  //   },
  //   {
  //     title: 'Le Seigneur des Anneaux',
  //     subtitle: "La communauté de l'anneau",
  //     description: 'Une quête épique pour détruire un anneau maléfique.',
  //     imageUri: 'https://picsum.photos/200/302',
  //     price: 24.99,
  //     isbn: '9780261103573',
  //   },
  //   {
  //     title: 'Le Seigneur des Anneaux',
  //     subtitle: "La communauté de l'anneau",
  //     description: 'Une quête épique pour détruire un anneau maléfique.',
  //     imageUri: 'https://picsum.photos/200/302',
  //     price: 24.99,
  //     isbn: '9780261103573',
  //   },
  //   {
  //     title: 'Le Seigneur des Anneaux',
  //     subtitle: "La communauté de l'anneau",
  //     description: 'Une quête épique pour détruire un anneau maléfique.',
  //     imageUri: 'https://picsum.photos/200/302',
  //     price: 24.99,
  //     isbn: '9780261103573',
  //   },
  //   // Ajoutez autant de livres que vous le souhaitez
  // ];

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
}
