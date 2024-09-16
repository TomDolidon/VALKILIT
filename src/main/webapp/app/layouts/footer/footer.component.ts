import { Component } from '@angular/core';
import { TranslateDirective } from 'app/shared/language';
import { RouterLink } from '@angular/router';
import { Footer } from 'primeng/api';

@Component({
  standalone: true,
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
  imports: [TranslateDirective, RouterLink, Footer],
})
export default class FooterComponent {}
