import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { IBook } from 'app/entities/book/book.model';
import { ButtonModule } from 'primeng/button';
import { AnimateModule } from 'primeng/animate';
import { LocalCartService } from 'app/core/cart/cart.service';
import IBookCart from 'app/model/IBookCart';

@Component({
  standalone: true,
  selector: 'jhi-book-card',
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
  imports: [CommonModule, ButtonModule, AnimateModule],
})
export default class BookCardComponent {
  @Input() book?: IBook;
  private cartService = inject(LocalCartService);

  // TODO
  onBuyCardBtnClick(): void {
    if (this.book) {
      this.cartService.saveCart(
        this.book.id,
        JSON.stringify({ id: this.book.id, book: this.book, quantity: 1, sub_total: this.book.price }),
      );
    }
  }

  // TODO
  onSeeDetailsBtnClick(): void {
    console.error('feature not implemented');
  }
}
