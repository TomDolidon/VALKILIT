import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IBook } from 'app/entities/book/book.model';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'jhi-book-card',
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
  imports: [CommonModule, ButtonModule],
})
export default class BookCardComponent {
  @Input() book?: IBook;
}
