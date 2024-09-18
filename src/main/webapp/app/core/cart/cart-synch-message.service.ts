// message.service.ts
import { Injectable } from '@angular/core';
import { Message } from 'primeng/api';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartSynchMessageService {
  public messageSource = new Subject<Message>();
  public message$ = this.messageSource.asObservable();

  sendMessage(message: Message): void {
    this.messageSource.next(message);
  }
}
