import { Component, OnInit } from '@angular/core';
import { BookService } from '../entities/book/service/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IBook } from '../entities/book/book.model';
import { BookFilterComponent } from '../catalog/book-filter/book-filter.component';
import BookListComponent from '../catalog/book-list/book-list.component';
import { CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { IAuthor } from '../entities/author/author.model';
import { AuthorService } from '../entities/author/service/author.service';
import { HttpResponse } from '@angular/common/http';
import BookCard2Component from '../shared/book-card/book-card.component';
import { CarouselModule } from 'primeng/carousel';
import { CartService } from 'app/core/cart/cart.service';
import { ImageUrlPipe } from 'app/shared/external-image/image-url.pipe';
import ReviewsComponent from './review/reviews.component';
import { Location } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'jhi-details',
  standalone: true,
  imports: [
    BookFilterComponent,
    BookListComponent,
    DatePipe,
    CurrencyPipe,
    Button,
    NgIf,
    ImageModule,
    ChipModule,
    NgForOf,
    ChipsModule,
    BookCard2Component,
    CarouselModule,
    ImageUrlPipe,
    ReviewsComponent,
    ButtonModule,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export default class DetailsComponent implements OnInit {
  bookId = '';
  book!: IBook;
  firstAuthorOthersBooks!: IBook[];
  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private location: Location,
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
          this.loadFirstAuthorBooks();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: () => {
          this.router.navigate(['/404']);
        },
      });
    });
  }

  loadFirstAuthorBooks(): void {
    this.bookService
      .query({
        size: 12,
        authors: this.getFirstAuthor()?.name,
      })
      .subscribe({
        next: (res: HttpResponse<IBook[]>) => {
          this.firstAuthorOthersBooks = res.body?.filter(book => book.id !== this.book.id) ?? [];
        },
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
      this.cartService.addToCart(this.book);
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

  getFirstAuthor(): IAuthor | null {
    return this.book.authors?.length ? this.book.authors[0] : null;
  }

  goBack(): void {
    this.location.back();
  }
}
