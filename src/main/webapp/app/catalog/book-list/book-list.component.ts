/* eslint-disable */

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IBook } from 'app/entities/book/book.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import BookCardComponent from '../../shared/book-card/book-card.component';

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
