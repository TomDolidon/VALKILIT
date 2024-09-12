import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
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
  imports: [SharedModule, RouterModule, TableModule, ButtonModule, CartValidationButtonComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export default class CartComponent implements OnInit, OnDestroy {
  account = signal<Account | null>(null);

  public purchaseLines: IBookCart[] = [];
  private defaultKey = 'valkylit-cart';

  private readonly destroy$ = new Subject<void>();

  private router = inject(Router);
  private localCartStorage = inject(LocalCartService);

  ngOnInit(): void {
    if (this.localCartStorage.getCart(this.defaultKey)) {
      this.purchaseLines = JSON.parse(this.localCartStorage.getCart(this.defaultKey)!);
    } else {
      this.purchaseLines = this.localCartStorage.getAllLines();
    }
  }

  display(): void {
    this.router.navigate(['/cart']);
  }

  ngOnDestroy(): void {
    this.localCartStorage.saveCart(this.defaultKey, JSON.stringify(this.purchaseLines));
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onTotalItems(): number {
    return this.localCartStorage.getCartTotalItems();
  }

  public onTotalPrice(): number {
    return this.localCartStorage.getCartTotalPrice();
  }
}
