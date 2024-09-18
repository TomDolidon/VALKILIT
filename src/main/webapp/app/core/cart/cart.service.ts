import { inject, Injectable } from '@angular/core';
import { IPurchaseCommandLine, NewPurchaseCommandLine } from 'app/entities/purchase-command-line/purchase-command-line.model';
import { AccountService } from '../auth/account.service';
import { EntityResponseType } from 'app/entities/book/service/book.service';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators'; // Ensure these are imported

import { ApplicationConfigService } from '../config/application-config.service';
import { PurchaseCommandService } from 'app/entities/purchase-command/service/purchase-command.service';
import { IPurchaseCommand } from 'app/entities/purchase-command/purchase-command.model';
import { MessageService } from 'primeng/api';
import { IBook } from 'app/entities/book/book.model';

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
  // private messageService = inject(MessageService);

  private cart: (IPurchaseCommandLine | NewPurchaseCommandLine)[] = [];
  private cartItemsCount = new BehaviorSubject<number>(0);

  // constructor(private messageService: MessageService) {}

  public getCartItemsCount(): Observable<number> {
    return this.cartItemsCount.asObservable();
  }

  public getCart(): (IPurchaseCommandLine | NewPurchaseCommandLine)[] {
    return this.cart;
  }

  public loadCart(): void {
    if (this.accountService.isAuthenticated()) {
      this.getDBCart().subscribe({
        next: cartLines => {
          // Update the cart property after getting data from the database
          this.cart = cartLines;
          this.cartItemsCount.next(this.getCartTotalItems());
        },
        error: () => {
          // Handle error if needed
        },
      });
    } else {
      this.cart = this.getLocalCart();
      this.cartItemsCount.next(this.getCartTotalItems());
    }
  }

  /**
   * Retrieve cart from the database
   * @returns Observable<IPurchaseCommandLine[]>
   */
  getDBCart(): Observable<(IPurchaseCommandLine | NewPurchaseCommandLine)[]> {
    return this.purchaseCommandService.getSelfCurrentDraftPurchaseCommand().pipe(
      // Ensure that we return an array of IPurchaseCommandLine
      map((res: HttpResponse<any>) => {
        return (res.body.purchaseCommandLines as (IPurchaseCommandLine | NewPurchaseCommandLine)[]) || [];
      }),
      catchError(() => {
        // Handle errors if needed
        return of([]); // Return an empty array in case of error
      }),
    );
  }

  getLocalCart(): (IPurchaseCommandLine | NewPurchaseCommandLine)[] {
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

  addBookToDBCart(book: IBook, quantity = 1): void {
    const newItem: NewPurchaseCommandLine = {
      id: null,
      book,
      quantity,
      unitPrice: book.price,
      purchaseCommand: null,
    };

    this.purchaseCommandService.addPurchaseCommandLineToCart(newItem).subscribe({
      next: (res: HttpResponse<any>) => {
        this.cart = res.body.purchaseCommandLines as (IPurchaseCommandLine | NewPurchaseCommandLine)[];
        this.cartItemsCount.next(this.getCartTotalItems());
      },
      error(err) {
        console.error('Error occurred:', err);
      },
    });
  }

  addBookToLocalCart(book: IBook, quantity = 1): void {
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
    this.cartItemsCount.next(this.getCartTotalItems());

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
        this.cart = res.body.purchaseCommandLines as (IPurchaseCommandLine | NewPurchaseCommandLine)[];
        this.cartItemsCount.next(this.getCartTotalItems());
      },
      error: err => console.error('Error removing item from cart: ', err),
    });
  }

  removeBookOnLocalStorage(bookId: string): void {
    this.cart = this.cart.filter(item => item.book?.id !== bookId);
    this.saveLocalCart(this.cart);
    this.cartItemsCount.next(this.getCartTotalItems());
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

  decreaseQuantityOnDBCart(bookId: string): void {
    this.purchaseCommandService.decrementPurchaseCommandLine(bookId).subscribe({
      next: (res: HttpResponse<any>) => {
        this.cart = res.body.purchaseCommandLines as (IPurchaseCommandLine | NewPurchaseCommandLine)[];
        this.cartItemsCount.next(this.getCartTotalItems());
      },
      error: err => console.error('Error removing item from cart: ', err),
    });
  }

  decreaseQuantityOnLocalStorage(bookId: string): void {
    const purchaseCommandLine = this.cart.find(item => item.book?.id === bookId);

    if (purchaseCommandLine?.quantity) {
      purchaseCommandLine.quantity -= 1;
      if (purchaseCommandLine.quantity <= 0) {
        this.removeFromCart(bookId);
      } else {
        this.saveLocalCart(this.cart);
      }
    }
    this.cartItemsCount.next(this.getCartTotalItems());
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
    this.cartItemsCount.next(0);
  }

  clearDBCart(): void {
    this.purchaseCommandService.clearCart().subscribe({
      next: (res: HttpResponse<any>) => {
        this.cart = res.body.purchaseCommandLines as (IPurchaseCommandLine | NewPurchaseCommandLine)[];
      },
      error: err => console.error('Error clearing cart:', err),
    });
  }

  clearLocalStorageCart(): void {
    localStorage.removeItem(this.storageKey);
    this.cart = [];
  }

  handleLogin(): void {
    // Récupérer le panier local
    const localCart = this.getLocalCart();

    // Vérifier si l'utilisateur est authentifié
    // Récupérer le panier de la base de données
    this.getDBCart().subscribe({
      next: dbCommandLines => {
        if (localCart.length > 0 && dbCommandLines.length > 0) {
          console.log('🔊 ~ CartService ~ UN LOCAL ET UNE COMMANDE');
          // Fusionner les paniers : ajouter les articles locaux au panier DB
          const mergedCart = [...dbCommandLines];

          localCart.forEach(localItem => {
            const existingItem = mergedCart.find(item => item.book?.id === localItem.book?.id);

            if (existingItem && existingItem.quantity && localItem.quantity) {
              existingItem.quantity += localItem.quantity;
            } else {
              mergedCart.push(localItem);
            }
          });

          // TODO HANDLE THIS SERVER SIDE
          // Supprimer les identifiants de toutes les lignes dans mergedCart
          const mergedCartWithoutIds = mergedCart.map(item => {
            return { ...item, id: null }; // Réinitialiser l'id pour toutes les lignes
          });

          console.log('🔊 ~ CartService ~ this.getDBCart ~ mergedCart:', mergedCart);

          // Envoyer le panier fusionné à la base de données
          this.purchaseCommandService.updateCart(mergedCartWithoutIds).subscribe({
            next: () => {
              this.getDBCart().subscribe({
                next: updatedCart => {
                  // Mise à jour du panier local avec le panier actualisé de la base de données
                  this.cart = updatedCart;
                  this.cartItemsCount.next(this.getCartTotalItems());
                  console.log('Cart updated from DB after merge:', updatedCart);
                },
                error: err => {
                  console.error('Error fetching updated cart from DB:', err);
                },
              });

              // this.messageService.add({
              //   severity: 'info',
              //   summary: 'Fusion des paniers',
              //   detail: 'Votre panier courant a été fusionné avec le panier de votre compte',
              // });
            },
            error: err => console.error('Error updating cart in DB:', err),
          });
        } else if (localCart.length > 0) {
          console.log('🔊 ~ CartService ~ UNIQUEMENT DU LOCAL');

          // Panier local uniquement, ajouter au panier DB
          this.purchaseCommandService.updateCart(localCart).subscribe({
            next: () => {
              this.getDBCart().subscribe({
                next: updatedCart => {
                  // Mise à jour du panier local avec le panier actualisé de la base de données
                  this.cart = updatedCart;
                  this.cartItemsCount.next(this.getCartTotalItems());
                  console.log('Cart updated on DB from local', updatedCart);
                },
                error: err => {
                  console.error('Error fetching updated cart from DB:', err);
                },
              });

              // Réinitialiser le panier local après ajout

              // this.messageService.add({
              //   severity: 'info',
              //   summary: 'Association du panier',
              //   detail: 'Votre panier courrant a été associé à votre compte',
              // });
            },
            error: err => console.error('Error adding local cart to DB:', err),
          });
        } else if (dbCommandLines.length > 0) {
          console.log('🔊 ~ CartService ~ PAS DE LOCAL ET UNE DB');

          // Panier DB uniquement, mettre à jour le panier local
          this.cart = dbCommandLines;
          this.cartItemsCount.next(this.getCartTotalItems());

          // this.messageService.add({
          //   severity: 'info',
          //   summary: 'Récupération du panier',
          //   detail: 'Le panier associé à votre compte a été récupéré',
          // });
        }
      },
      error: err => console.error('Error retrieving DB cart:', err),
    });
  }

  handleLogout() {
    this.clearLocalStorageCart();
    this.cartItemsCount.next(0);
  }
}
