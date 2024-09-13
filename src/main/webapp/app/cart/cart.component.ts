import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import SharedModule from 'app/shared/shared.module';
import { Account } from 'app/core/auth/account.model';
import { LocalCartService } from 'app/core/cart/cart.service';
import { CartValidationButtonComponent } from './cart-validation-btn/-validation-btn.component';
import IBookCart from 'app/model/IBookCart';

@Component({
  selector: 'jhi-cart',
  standalone: true,
  imports: [SharedModule, RouterModule, TableModule, ButtonModule, FormsModule, CartValidationButtonComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export default class CartComponent implements OnInit, OnDestroy {
  account = signal<Account | null>(null);

  public purchaseLines: IBookCart[] = [];

  private readonly destroy$ = new Subject<void>();

  private router = inject(Router);
  private localCartStorage = inject(LocalCartService);

  // Method to load cart data from local storage
  loadCart(): void {
    this.purchaseLines = this.localCartStorage.getAllLines();
  }

  ngOnInit(): void {
    this.loadCart();
  }

  display(): void {
    this.router.navigate(['/cart']);
  }

  ngOnDestroy(): void {
    // TODO : user logged -> order DRAFT en BD
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onTotalItems(): number {
    return this.localCartStorage.getCartTotalItems();
  }

  public onTotalPrice(): number {
    return this.localCartStorage.getCartTotalPrice();
  }

  public onIncreaseQuantity(item: IBookCart): void {
    item.quantity = 1;
    this.localCartStorage.saveCart(item.id, JSON.stringify(item));
    // Trigger change detection to update the table
    this.loadCart();
  }

  public onDecreaseQuantity(item: IBookCart): void {
    item.quantity = -1;
    this.localCartStorage.saveCart(item.id, JSON.stringify(item));
    // Trigger change detection to update the table
    this.loadCart();
  }
}
