/* eslint-disable */

import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { IBook } from 'app/entities/book/book.model';
import { ButtonModule } from 'primeng/button';
import { AnimateModule } from 'primeng/animate';
import { ChipModule } from 'primeng/chip';
import { LocalCartService } from 'app/core/cart/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'jhi-book-card',
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
  imports: [CommonModule, ButtonModule, AnimateModule, ChipModule, RouterLink],
})
export default class BookCard2Component {
  @Input() book: IBook = {
    authors: [],
    categories: [],
    id: '',
  };

  maxVisibleAuthors: number = 2;
  maxVisibleCategories: number = 2;

  private cartService = inject(LocalCartService);

  // Limiter les auteurs affichés
  get limitedAuthors() {
    console.log('🔊 ~ BookCard2Component ~ getlimitedAuthors ~ limitedAuthors:', this.book);
    return this.book?.authors?.slice(0, this.maxVisibleAuthors);
  }

  // Limiter les catégories affichées
  get limitedCategories() {
    return this.book?.categories?.slice(0, this.maxVisibleCategories);
  }

  // TODO
  onBuyBookBtnClick(): void {
    if (this.book) {
      this.cartService.saveCart(
        this.book.id,
        JSON.stringify({ id: this.book.id, book: this.book, quantity: 1, sub_total: this.book.price }),
      );
    }
  }
}
