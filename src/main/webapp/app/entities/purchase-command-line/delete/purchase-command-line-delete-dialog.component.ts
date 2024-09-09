import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPurchaseCommandLine } from '../purchase-command-line.model';
import { PurchaseCommandLineService } from '../service/purchase-command-line.service';

@Component({
  standalone: true,
  templateUrl: './purchase-command-line-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PurchaseCommandLineDeleteDialogComponent {
  purchaseCommandLine?: IPurchaseCommandLine;

  protected purchaseCommandLineService = inject(PurchaseCommandLineService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.purchaseCommandLineService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
