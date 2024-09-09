import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IAwardBook } from '../award-book.model';

@Component({
  standalone: true,
  selector: 'jhi-award-book-detail',
  templateUrl: './award-book-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class AwardBookDetailComponent {
  awardBook = input<IAwardBook | null>(null);

  previousState(): void {
    window.history.back();
  }
}
