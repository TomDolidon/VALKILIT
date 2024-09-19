import { Component } from '@angular/core';
import { TranslateDirective } from 'app/shared/language';
import { RouterLink } from '@angular/router';
import { Footer } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  imports: [TranslateDirective, RouterLink, Footer, TranslateModule],
})
export default class FooterComponent {}
