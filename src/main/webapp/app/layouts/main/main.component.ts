import { Component, inject, OnInit, Renderer2, RendererFactory2 } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import dayjs from 'dayjs/esm';

import { AccountService } from 'app/core/auth/account.service';
import { AppPageTitleStrategy } from 'app/app-page-title-strategy';
import FooterComponent from '../footer/footer.component';
import PageRibbonComponent from '../profiles/page-ribbon.component';
import { ToastModule } from 'primeng/toast';
import { Message, MessageService } from 'primeng/api';
import { NgIf } from '@angular/common';
import { GenericPageComponent } from '../generic-page/generic-page.component';
import { CartSynchMessageService } from 'app/core/cart/cart-synch-message.service';

@Component({
  standalone: true,
  selector: 'jhi-main',
  templateUrl: './main.component.html',
  providers: [AppPageTitleStrategy, MessageService],
  imports: [RouterOutlet, FooterComponent, PageRibbonComponent, ToastModule, GenericPageComponent, NgIf],
})
export default class MainComponent implements OnInit {
  isSpecialPage = false;
  specialDesignedPages = ['/', '/catalog', ''];

  private renderer: Renderer2;

  private router = inject(Router);
  private appPageTitleStrategy = inject(AppPageTitleStrategy);
  private accountService = inject(AccountService);
  private translateService = inject(TranslateService);
  private rootRenderer = inject(RendererFactory2);
  private cartSynchMessageService = inject(CartSynchMessageService);
  private messageService = inject(MessageService);

  constructor() {
    this.renderer = this.rootRenderer.createRenderer(document.querySelector('html'), null);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isSpecialPage =
          this.specialDesignedPages.includes(event.url) || event.url.startsWith('/catalog') || event.url.startsWith('/details/');
      }
    });
  }

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe();

    this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.appPageTitleStrategy.updateTitle(this.router.routerState.snapshot);
      dayjs.locale(langChangeEvent.lang);
      this.renderer.setAttribute(document.querySelector('html'), 'lang', langChangeEvent.lang);
    });

    this.cartSynchMessageService.message$.subscribe((message: Message) => {
      this.messageService.add(message);
    });
  }
}
