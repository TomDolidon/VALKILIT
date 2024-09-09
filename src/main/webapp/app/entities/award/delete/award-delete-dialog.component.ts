import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAward } from '../award.model';
import { AwardService } from '../service/award.service';

@Component({
  standalone: true,
  templateUrl: './award-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AwardDeleteDialogComponent {
  award?: IAward;

  protected awardService = inject(AwardService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.awardService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
