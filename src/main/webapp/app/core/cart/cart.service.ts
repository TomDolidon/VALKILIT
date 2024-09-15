import { Injectable, signal } from '@angular/core';
import IBookCart from 'app/model/IBookCart';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalCartService {
  private storageKey = new Map<string, string>();
  private cartItemCount = new BehaviorSubject<number>(0);

  constructor() {
    this.initStorageKeys();
  }

  public getCartItemCount(): Observable<number> {
    return this.cartItemCount.asObservable();
  }

  // -------------- METHODS -----------------
  // Retrieve all lines in the cart
  public getAllLines(): IBookCart[] {
    const cart: IBookCart[] = [];
    this.storageKey.forEach((_, key: string) => {
      const cartValue = this.getCart(key);
      if (cartValue) {
        try {
          cart.push(JSON.parse(cartValue) as IBookCart);
        } catch (error) {
          console.error('Error parsing cart item:', error);
        }
      }
    });
    return cart;
  }

  // Get total number of items in the cart
  public getCartTotalItems(): number {
    let sum = 0;
    this.storageKey.forEach((_, key: string) => {
      const cartValue = this.getCart(key);
      if (cartValue) {
        try {
          const cartJson = JSON.parse(cartValue) as IBookCart;
          sum += cartJson.quantity;
        } catch (error) {
          console.error('Error parsing cart item:', error);
        }
      }
    });
    return sum;
  }

  // Get total price of items in the cart
  public getCartTotalPrice(): number {
    let sum = 0;
    this.storageKey.forEach((_, key: string) => {
      const cartValue = this.getCart(key);
      if (cartValue) {
        try {
          const cartJson = JSON.parse(cartValue) as IBookCart;
          sum += cartJson.quantity * cartJson.book.price!;
        } catch (error) {
          console.error('Error parsing cart item:', error);
        }
      }
    });
    return sum;
  }

  // Save or update an item in the cart
  public saveCart(key: string, value: string): void {
    const existingCartValue = this.getCart(key);
    if (existingCartValue) {
      try {
        const bookInCart = JSON.parse(existingCartValue) as IBookCart;
        bookInCart.quantity += JSON.parse(value).quantity as number;
        bookInCart.sub_total = bookInCart.quantity * bookInCart.book.price!;
        if (bookInCart.quantity < 1) {
          this.deleteCart(key);
          this.cartItemCount.next(this.getCartTotalItems());
        } else {
          localStorage.setItem(key, JSON.stringify(bookInCart));
          this.cartItemCount.next(this.getCartTotalItems());
        }
      } catch (error) {
        console.error('Error updating cart item:', error);
      }
    } else {
      this.storageKey.set(key, key);
      localStorage.setItem(key, value);
      this.cartItemCount.next(this.getCartTotalItems());
    }
  }

  // Get a single cart item by key
  public getCart(key: string): string | null {
    return localStorage.getItem(key);
  }

  // Delete an item from the cart
  public deleteCart(key: string): void {
    this.storageKey.delete(key);
    localStorage.removeItem(key);
  }

  // Clear the entire cart
  public clearCart(): void {
    this.storageKey.clear();
    localStorage.clear();
    this.cartItemCount.next(0);
  }

  private initStorageKeys(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)!;
      this.storageKey.set(key, key);
    }
  }
}
