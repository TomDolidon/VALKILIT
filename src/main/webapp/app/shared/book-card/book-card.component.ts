/* eslint-disable */

import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { IBook } from 'app/entities/book/book.model';
import { ButtonModule } from 'primeng/button';
import { AnimateModule } from 'primeng/animate';
import { ChipModule } from 'primeng/chip';
import { RouterLink } from '@angular/router';
import { CartService } from 'app/core/cart/cart.service';
import { ImageUrlPipe } from '../external-image/image-url.pipe';
import TranslateDirective from '../language/translate.directive';
import SharedModule from '../shared.module';

@Component({
  standalone: true,
  selector: 'jhi-book-card',
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
  imports: [CommonModule, ButtonModule, AnimateModule, ChipModule, RouterLink, ImageUrlPipe, TranslateDirective, SharedModule],
})
export default class BookCard2Component {
  @Input() book: IBook = {
    authors: [],
    categories: [],
    id: '',
  };

  maxVisibleAuthors: number = 2;
  maxVisibleCategories: number = 2;

  private cartService = inject(CartService);

  // Limiter les auteurs affichés
  get limitedAuthors() {
    return this.book?.authors?.slice(0, this.maxVisibleAuthors);
  }

  // Limiter les catégories affichées
  get limitedCategories() {
    return this.book?.categories?.slice(0, this.maxVisibleCategories);
  }

  onBuyBookBtnClick(): void {
    if (this.book) {
      this.cartService.addToCart(this.book);
    }
  }
}
