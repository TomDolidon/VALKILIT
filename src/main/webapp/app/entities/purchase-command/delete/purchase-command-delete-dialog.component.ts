import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPurchaseCommand } from '../purchase-command.model';
import { PurchaseCommandService } from '../service/purchase-command.service';

@Component({
  standalone: true,
  templateUrl: './purchase-command-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PurchaseCommandDeleteDialogComponent {
  purchaseCommand?: IPurchaseCommand;

  protected purchaseCommandService = inject(PurchaseCommandService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.purchaseCommandService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
