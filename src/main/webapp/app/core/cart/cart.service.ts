/* eslint-disable */

import { inject, Injectable } from '@angular/core';
import { IBook } from 'app/entities/book/book.model';
import { IPurchaseCommandLine, NewPurchaseCommandLine } from 'app/entities/purchase-command-line/purchase-command-line.model';
import { AccountService } from '../auth/account.service';
import { EntityResponseType } from 'app/entities/book/service/book.service';
import { Observable, switchMap } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from '../config/application-config.service';
import { PurchaseCommandService } from 'app/entities/purchase-command/service/purchase-command.service';
import { IPurchaseCommand } from 'app/entities/purchase-command/purchase-command.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/client-cart');
  private readonly storageKey = 'purchaseCart';

  private purchaseCommandService = inject(PurchaseCommandService);
  private accountService = inject(AccountService);

  private cart: (IPurchaseCommandLine | NewPurchaseCommandLine)[] = [];

  public getCart() {
    return this.cart;
  }

  public loadCart() {
    if (this.accountService.isAuthenticated()) {
      this.getDBCart();
    } else {
      this.cart = this.getLocalCart();
    }
  }

  /**
   * Retrieve cart from localstorage
   * @returns IPurchaseCommandLine
   */
  getDBCart(): void {
    this.purchaseCommandService.getSelfCurrentDraftPurchaseCommand().subscribe({
      next: (res: HttpResponse<any>) => {
        this.cart = (res.body.purchaseCommandLines as (IPurchaseCommandLine | NewPurchaseCommandLine)[]) || [];
      },
      error: () => {},
    });
  }

  getLocalCart() {
    const cartJson = localStorage.getItem(this.storageKey);
    if (cartJson) {
      return JSON.parse(cartJson) as (IPurchaseCommandLine | NewPurchaseCommandLine)[];
    }
    return [];
  }

  /**
   *
   * @returns number of items in the cart
   */
  public getCartTotalItems(): number {
    let quantity = 0;
    this.cart.forEach(item => {
      if (item.quantity) {
        quantity += item.quantity;
      }
    });
    return quantity;
  }

  /**
   * get total price of items in the carts
   * @returns
   */
  public getCartTotalPrice(): number {
    let totalPrice = 0;
    this.cart.forEach(item => {
      if (item.quantity && item.unitPrice) {
        totalPrice += item.quantity * item.unitPrice;
      }
    });
    return totalPrice;
  }

  /**
   * Save cart in local storage
   * @param cart
   */
  saveLocalCart(cart: (IPurchaseCommandLine | NewPurchaseCommandLine)[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
  }

  /**
   * Add book on local storage or db depending on user connexion
   * @param book
   * @param quantity
   */
  addToCart(book: IBook, quantity = 1): void {
    if (this.accountService.isAuthenticated()) {
      this.addBookToDBCart(book, quantity);
    } else {
      this.addBookToLocalCart(book, quantity);
    }
  }

  addBookToDBCart(book: IBook, quantity = 1) {
    const newItem: NewPurchaseCommandLine = {
      id: null,
      book,
      quantity,
      unitPrice: book.price,
      purchaseCommand: null,
    };

    this.purchaseCommandService.addPurchaseCommandLineToCart(newItem).subscribe({
      next: (res: HttpResponse<any>) => {
        this.cart = (res.body.purchaseCommandLines as (IPurchaseCommandLine | NewPurchaseCommandLine)[]) || [];
      },
      error: err => {
        console.error('Error occurred:', err);
      },
    });
  }

  addBookToLocalCart(book: IBook, quantity = 1) {
    const existingItem = this.cart.find(item => item.book?.id === book.id);

    if (existingItem?.quantity) {
      existingItem.quantity += quantity;
    } else {
      const newItem: NewPurchaseCommandLine = {
        id: null,
        book,
        quantity,
        unitPrice: book.price,
        purchaseCommand: null,
      };
      this.cart.push(newItem);
    }
    this.saveLocalCart(this.cart);

    this.getLocalCart();
  }

  /**
   * Remove book form cart
   * @param bookId
   */
  removeFromCart(bookId: string): void {
    if (this.accountService.isAuthenticated()) {
      this.removeBookOnDBCart(bookId);
    } else {
      this.removeBookOnLocalStorage(bookId);
    }
  }

  removeBookOnDBCart(bookId: string): void {
    this.purchaseCommandService.removePurchaseCommandLineFromCart(bookId).subscribe({
      next: (res: HttpResponse<any>) => {
        this.cart = (res.body.purchaseCommandLines as (IPurchaseCommandLine | NewPurchaseCommandLine)[]) || [];
      },
      error: err => console.error('Error removing item from cart: ', err),
    });
  }

  removeBookOnLocalStorage(bookId: string) {
    this.cart = this.cart.filter(item => item.book?.id !== bookId);
    this.saveLocalCart(this.cart);
  }

  /**
   * Decrease book quantity, if quantity is 0, remove item from cart
   * @param bookId
   */
  decreaseQuantity(bookId: string): void {
    if (this.accountService.isAuthenticated()) {
      this.decreaseQuantityOnDBCart(bookId);
    } else {
      this.decreaseQuantityOnLocalStorage(bookId);
    }
  }

  decreaseQuantityOnDBCart(bookId: string) {
    this.purchaseCommandService.decrementPurchaseCommandLine(bookId).subscribe({
      next: (res: HttpResponse<any>) => {
        this.cart = (res.body.purchaseCommandLines as (IPurchaseCommandLine | NewPurchaseCommandLine)[]) || [];
      },
      error: err => console.error('Error removing item from cart: ', err),
    });
  }

  decreaseQuantityOnLocalStorage(bookId: string) {
    const purchaseCommandLine = this.cart.find(item => item.book?.id === bookId);

    if (purchaseCommandLine?.quantity) {
      purchaseCommandLine.quantity -= 1;
      if (purchaseCommandLine.quantity <= 0) {
        this.removeFromCart(bookId);
      } else {
        this.saveLocalCart(this.cart);
      }
    }
  }

  /**
   * Clear all cart
   */
  clearCart(): void {
    if (this.accountService.isAuthenticated()) {
      this.clearDBCart();
    } else {
      this.clearLocalStorageCart();
    }
  }

  clearDBCart() {
    this.purchaseCommandService.clearCart().subscribe({
      next: (res: HttpResponse<any>) => {
        this.cart = (res.body.purchaseCommandLines as (IPurchaseCommandLine | NewPurchaseCommandLine)[]) || [];
      },
      error: err => console.error('Error clearing cart:', err),
    });
  }

  clearLocalStorageCart() {
    localStorage.removeItem(this.storageKey);
    this.cart = [];
  }
}
