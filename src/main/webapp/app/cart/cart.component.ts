import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IBook } from 'app/entities/book/book.model';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-cart',
  standalone: true,
  imports: [SharedModule, RouterModule, TableModule, ButtonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export default class CartComponent implements OnInit, OnDestroy {
  account = signal<Account | null>(null);

  public books: IBook[] = [];

  private readonly destroy$ = new Subject<void>();

  private accountService = inject(AccountService);
  private router = inject(Router);

  ngOnInit(): void {
    // TODO: update it (comes from Home component)
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => this.account.set(account));
    //
    this.books = [
      { id: '1', title: "L'art d'avoir toujours raison", price: 15.99, stock: 1 },
      { id: '15', title: 'Game of Thrones : T1', price: 20.0, stock: 1 },
      { id: '521', title: 'Maths semestre 1', price: 45.36, stock: 3 },
      { id: '4', title: 'One Piece - T 106', price: 7.95, stock: 1 },
    ];
  }

  display(): void {
    this.router.navigate(['/cart']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // to get the total items in cart
  getCartTotalItems(): number {
    let sum = 0;
    this.books.forEach((book: IBook) => (sum += book.stock ? book.stock : 0));
    return sum;
  }

  // to get the total order's price
  getCartTotalPrice(): number {
    let sum = 0;
    this.books.forEach((book: IBook) => (sum += (book.stock ? book.stock : 0) * (book.price ? book.price : 0)));
    return sum;
  }
}
