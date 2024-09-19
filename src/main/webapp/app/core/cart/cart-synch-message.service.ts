// message.service.ts
import { inject, Injectable } from '@angular/core';
import { Message } from 'primeng/api';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CartSynchMessageService {
  public messageSource = new Subject<Message>();
  public message$ = this.messageSource.asObservable();

  private router = inject(Router);

  sendMessage(message: Message): void {
    if (this.router.url !== '/cart') {
      this.messageSource.next(message);
    }
  }
}
