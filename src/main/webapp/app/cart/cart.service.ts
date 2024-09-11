import { Injectable } from '@angular/core';
import { IPurchaseCommandLine } from 'app/entities/purchase-command-line/purchase-command-line.model';

@Injectable({
  providedIn: 'root',
})
export class LocalCartService {
  public saveCart(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public getCart(key: string): string | null {
    return localStorage.getItem(key);
  }

  public deleteCart(key: string): void {
    localStorage.removeItem(key);
  }

  public clearCart(): void {
    localStorage.clear();
  }
}
