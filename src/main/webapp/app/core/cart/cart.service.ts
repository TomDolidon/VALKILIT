import { Injectable } from '@angular/core';
import IBookCart from 'app/model/IBookCart';

@Injectable({
  providedIn: 'root',
})
export class LocalCartService {
  private storageKey = new Map<string, string>();

  // -----------------------------------------------
  public getAllLines(): IBookCart[] {
    const cart: IBookCart[] = [];
    this.storageKey.forEach((value: string, _) => {
      const cartValue = this.getCart(value) ?? 'null';
      cart.push(JSON.parse(cartValue) as IBookCart);
    });
    return cart;
  }

  // to get the total items in cart
  public getCartTotalItems(): number {
    let sum = 0;
    this.storageKey.forEach((value: string, _) => {
      const cartValue = this.getCart(value) ?? 'null';
      const cartJson = JSON.parse(cartValue) as IBookCart;
      sum += cartJson.quantity;
    });
    return sum;
  }

  // to get the total order's price
  public getCartTotalPrice(): number {
    let sum = 0;
    this.storageKey.forEach((value: string, _) => {
      const cartValue = this.getCart(value) ?? 'null';
      const cartJson = JSON.parse(cartValue) as IBookCart;
      sum += cartJson.quantity * cartJson.book.price!;
    });
    return sum;
  }

  public saveCart(key: string, value: string): void {
    if (this.getCart(key)) {
      const bookInCart = JSON.parse(this.getCart(key) ?? 'null') as IBookCart;
      bookInCart.quantity += 1;
      bookInCart.sub_total! += bookInCart.book.price!;
      localStorage.setItem(key, JSON.stringify(bookInCart));
    } else {
      this.storageKey.set(key, key);
      localStorage.setItem(key, value);
    }
  }

  public getCart(key: string): string | null {
    return localStorage.getItem(key);
  }

  public deleteCart(key: string): void {
    this.storageKey.delete(key);
    localStorage.removeItem(key);
  }

  public clearCart(): void {
    this.storageKey.clear();
    localStorage.clear();
  }
}
