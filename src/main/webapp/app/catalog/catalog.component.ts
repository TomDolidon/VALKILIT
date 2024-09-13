/* eslint-disable */

import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';
import { LazyLoadEvent } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import BookListComponent from './book-list/book-list.component';
import { BookFilterComponent } from './book-filter/book-filter.component';
import IBookFilter from 'app/model/IBookFilter';
import { ActivatedRoute } from '@angular/router';

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
  paginatorFirstRecordIndex = 0;
  filter: IBookFilter | undefined;
  searchTerm: string | undefined;

  // private sortService = inject(SortService);

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.loadBooks();
    });
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
        this.searchTerm,
      )
      .subscribe({
        next: (res: HttpResponse<IBook[]>) => {
          this.books = res.body || [];
          this.totalRecords = Number(res.headers.get('X-Total-Count'));
        },
        error: () => {},
      });
  }

  onPageChange(event: LazyLoadEvent): void {
    this.page = event.first! / event.rows!;
    this.paginatorFirstRecordIndex = event.first || 0;
    this.loadBooks();
  }

  onFilterChanged(filter: IBookFilter): void {
    this.paginatorFirstRecordIndex = 0;
    this.page = 0;
    this.filter = filter;
    this.loadBooks();
  }
}
