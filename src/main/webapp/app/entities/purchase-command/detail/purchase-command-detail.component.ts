import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IPurchaseCommand } from '../purchase-command.model';

@Component({
  standalone: true,
  selector: 'jhi-purchase-command-detail',
  templateUrl: './purchase-command-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class PurchaseCommandDetailComponent {
  purchaseCommand = input<IPurchaseCommand | null>(null);

  previousState(): void {
    window.history.back();
  }
}
