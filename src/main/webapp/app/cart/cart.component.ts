import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import SharedModule from 'app/shared/shared.module';
import { Account } from 'app/core/auth/account.model';
import { CartValidationButtonComponent } from './cart-validation-btn/cart-validation-btn.component';
import IBookCart from 'app/model/IBookCart';
import { DialogModule } from 'primeng/dialog';
import { IBook } from 'app/entities/book/book.model';
import { CartService } from 'app/core/cart/cart.service';
import { IPurchaseCommandLine, NewPurchaseCommandLine } from 'app/entities/purchase-command-line/purchase-command-line.model';
import { ImageUrlPipe } from 'app/shared/external-image/image-url.pipe';

@Component({
  selector: 'jhi-cart',
  standalone: true,
  imports: [SharedModule, RouterModule, TableModule, ButtonModule, FormsModule, CartValidationButtonComponent, DialogModule, ImageUrlPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export default class CartComponent implements OnInit, OnDestroy {
  account = signal<Account | null>(null);
  isEmptyCartDialogVisible = false;
  isRemoveItemDialogVisible = false;
  itemToDelete: IBookCart | null = null;

  private readonly destroy$ = new Subject<void>();

  private router = inject(Router);
  private cartService = inject(CartService);

  // Method to load cart data from local storage
  loadCart(): void {
    this.cartService.loadCart();
  }

  getCommandLines(): (IPurchaseCommandLine | NewPurchaseCommandLine)[] {
    return this.cartService.getCart();
  }

  ngOnInit(): void {
    this.loadCart();
  }

  display(): void {
    this.router.navigate(['/cart']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // TODO get total
  public onTotalItems(): number {
    return this.cartService.getCartTotalItems();
  }

  public onTotalPrice(): number {
    return this.cartService.getCartTotalPrice();
  }

  public onIncreaseQuantity(book: IBook): void {
    this.cartService.addToCart(book);
  }

  public onDecreaseQuantity(line: IBookCart): void {
    if (line.quantity < 2) {
      this.itemToDelete = line;
      this.isRemoveItemDialogVisible = true;
    } else {
      this.cartService.decreaseQuantity(line.book.id);
    }
  }

  public onEmptyCart(): void {
    this.cartService.clearCart();
    this.isEmptyCartDialogVisible = false;
  }

  public onBookTrashBTnClick(item: IBookCart): void {
    this.itemToDelete = item;
    this.isRemoveItemDialogVisible = true;
  }

  public onRemoveCartItemClick(): void {
    if (this.itemToDelete) {
      this.cartService.removeFromCart(this.itemToDelete.book.id);
      this.isRemoveItemDialogVisible = false;
    }
  }
}
