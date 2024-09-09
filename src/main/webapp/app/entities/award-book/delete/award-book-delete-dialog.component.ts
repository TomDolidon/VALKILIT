import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAwardBook } from '../award-book.model';
import { AwardBookService } from '../service/award-book.service';

@Component({
  standalone: true,
  templateUrl: './award-book-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AwardBookDeleteDialogComponent {
  awardBook?: IAwardBook;

  protected awardBookService = inject(AwardBookService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.awardBookService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
