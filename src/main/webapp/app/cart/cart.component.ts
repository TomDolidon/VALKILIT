import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IPurchaseCommandLine } from 'app/entities/purchase-command-line/purchase-command-line.model';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

type CustomPurchaseLine = IPurchaseCommandLine & { totalPrice: number };

@Component({
  selector: 'jhi-cart',
  standalone: true,
  imports: [SharedModule, RouterModule, TableModule, ButtonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export default class CartComponent implements OnInit, OnDestroy {
  account = signal<Account | null>(null);

  purchaseLines: CustomPurchaseLine[] = [];

  private readonly destroy$ = new Subject<void>();

  private accountService = inject(AccountService);
  private router = inject(Router);

  ngOnInit(): void {
    // TODO: update it (comes from Home component)
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => this.account.set(account));
    this.pushIntoCart({ id: '1', quantity: 1, unitPrice: 15.99, book: { id: 'b1', title: "L'art d'avoir toujours raison", price: 15.99 } });
    this.pushIntoCart({ id: '2', quantity: 1, unitPrice: 20.0, book: { id: 'b2', title: 'Games of Throne : T5', price: 20.0 } });
    this.pushIntoCart({ id: '3', quantity: 3, unitPrice: 45.36, book: { id: 'b3', title: 'Analyse et Géométrie', price: 45.36 } });
    this.pushIntoCart({ id: '4', quantity: 1, unitPrice: 7.95, book: { id: 'b4', title: 'One Piece : T106', price: 7.95 } });
    this.pushIntoCart({ id: '5', quantity: 1, unitPrice: 7.95, book: { id: 'b5', title: 'Berserk : T42', price: 7.95 } });
  }

  display(): void {
    this.router.navigate(['/cart']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // to set a basic (test only) cart
  pushIntoCart(line: IPurchaseCommandLine): void {
    // Calculate the value (for example: price * quantity)
    const calculatedValue = (line.quantity ? line.quantity : 0) * (line.unitPrice ? line.unitPrice : 0);
    // Push the new object into the array
    this.purchaseLines.push({ ...line, totalPrice: calculatedValue });
  }

  // to get the total items in cart
  getCartTotalItems(): number {
    let sum = 0;
    this.purchaseLines.forEach((element: CustomPurchaseLine) => (sum += element.quantity ? element.quantity : 0));
    return sum;
  }

  // to get the total order's price
  getCartTotalPrice(): number {
    let sum = 0;
    this.purchaseLines.forEach((element: CustomPurchaseLine) => (sum += element.totalPrice ? element.totalPrice : 0));
    return sum;
  }
}
