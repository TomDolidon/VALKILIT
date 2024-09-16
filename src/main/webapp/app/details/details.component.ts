import { Component, OnInit } from '@angular/core';
import { BookService } from '../entities/book/service/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IBook } from '../entities/book/book.model';
import { BookFilterComponent } from '../catalog/book-filter/book-filter.component';
import BookListComponent from '../catalog/book-list/book-list.component';
import { CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { LocalCartService } from '../core/cart/cart.service';
import { ImageModule } from 'primeng/image';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';

@Component({
  selector: 'jhi-details',
  standalone: true,
  imports: [BookFilterComponent, BookListComponent, DatePipe, CurrencyPipe, Button, NgIf, ImageModule, ChipModule, NgForOf, ChipsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export default class DetailsComponent implements OnInit {
  bookId = '';
  book!: IBook;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: LocalCartService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.bookId = params.get('id') ?? '';
      if (this.bookId === '') {
        this.router.navigate(['/404']);
        return;
      }
      this.bookService.find(this.bookId).subscribe({
        next: response => {
          this.book = response.body as IBook;
          if (this.book.id === '') {
            this.router.navigate(['/404']);
          }
        },
        error: () => {
          this.router.navigate(['/404']);
        },
      });
    });
  }

  getAuthorNames(): string {
    let string = '';
    this.book.authors?.forEach(author => {
      if (string.length) {
        string += ', ';
      }
      string += author.name ?? '';
    });
    return string;
  }

  getCategoryNames(): string {
    let string = '';
    this.book.categories?.forEach(category => {
      if (string.length) {
        string += ', ';
      }
      string += category.name ?? '';
    });
    return string;
  }

  onBuyBookBtnClick(): void {
    if (this.book.id) {
      this.cartService.saveCart(
        this.book.id,
        JSON.stringify({ id: this.book.id, book: this.book, quantity: 1, sub_total: this.book.price }),
      );
    }
  }

  getStockClass(stock: number): string {
    if (stock === 0) {
      return 'danger';
    } else if (stock <= 5) {
      return 'warning';
    } else {
      return 'success';
    }
  }
}
