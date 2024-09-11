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
import BookListComponent from './book-list/book-list.component';
import { BookFilterComponent } from './book-filter/book-filter.component';
import IBookFilter from 'app/model/IBookFilter';

@Component({
  standalone: true,
  selector: 'jhi-catalog',
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  imports: [CommonModule, PaginatorModule, BookListComponent, BookFilterComponent],
})
export default class CatalogComponent implements OnInit {
  books: IBook[] = [];
  totalRecords = 0;
  itemsPerPage = 6;
  page = 0;
  filter: IBookFilter | undefined;

  private sortService = inject(SortService);

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService
      .query(
        {
          page: this.page,
          size: this.itemsPerPage,
          // sort: this.sortService.buildSortParam({} as any, 'id'),
        },
        this.filter,
      )
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

  onPageChange(event: LazyLoadEvent): void {
    this.page = event.first! / event.rows!;
    this.loadBooks();
  }

  onFilterChanged(filter: IBookFilter): void {
    console.log('🔊 ~ CatalogComponent ~ onFilterChanged ~ onFilterChanged:');
    this.filter = filter;
    this.loadBooks();
  }
}
