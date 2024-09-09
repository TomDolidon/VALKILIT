import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IPurchaseCommandLine } from '../purchase-command-line.model';

@Component({
  standalone: true,
  selector: 'jhi-purchase-command-line-detail',
  templateUrl: './purchase-command-line-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class PurchaseCommandLineDetailComponent {
  purchaseCommandLine = input<IPurchaseCommandLine | null>(null);

  previousState(): void {
    window.history.back();
  }
}
