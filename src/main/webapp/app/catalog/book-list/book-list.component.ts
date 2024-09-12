/* eslint-disable */

import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
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
  @Input() books?: IBook[];

  ngOnInit(): void {}
}
