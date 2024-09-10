/* eslint-disable */

import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';
import { SortService } from 'app/shared/sort';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import BookCardComponent from '../book-card/book-card.component';

@Component({
  standalone: true,
  selector: 'jhi-book-list',
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
  imports: [CommonModule, ButtonModule, CardModule, PaginatorModule, BookCardComponent],
})
export default class BookListComponent implements OnInit {
  books: IBook[] = [];
  totalRecords = 0;
  itemsPerPage = 12;
  page = 0;

  private sortService = inject(SortService);

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks({ first: 0, rows: this.itemsPerPage });
  }

  loadBooks(event: LazyLoadEvent) {
    const page = event.first! / event.rows!;
    this.bookService
      .query({
        page: page,
        size: this.itemsPerPage,
        // sort: this.sortService.buildSortParam({} as any, 'id'),
      })
      .subscribe({
        next: (res: HttpResponse<IBook[]>) => {
          this.books = res.body || [];
          this.totalRecords = Number(res.headers.get('X-Total-Count'));
        },
        error: () => {
          // Gérer les erreurs ici
        },
      });
  }
}
