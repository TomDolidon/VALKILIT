import { Component } from '@angular/core';
import { IPurchaseCommandWithLines } from '../../entities/purchase-command/purchase-command.model';
import { PurchaseCommandService } from '../../entities/purchase-command/service/purchase-command.service';
import { CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'jhi-purchase-commands',
  standalone: true,
  imports: [NgForOf, DatePipe, TranslateModule, AccordionModule, RouterLink, CurrencyPipe, TagModule, NgIf],
  templateUrl: './purchase-commands.component.html',
  styleUrl: './purchase-commands.component.scss',
})
export class PurchaseCommandsComponent {
  purchaseCommands!: IPurchaseCommandWithLines[];

  constructor(private purchaseCommandsService: PurchaseCommandService) {
    this.purchaseCommandsService.getSelfPurchaseCommands(true).subscribe({
      next: response => {
        this.purchaseCommands = response.body as IPurchaseCommandWithLines[];
        this.purchaseCommands = this.purchaseCommands.filter(command => command.status !== 'DRAFT' && command.expeditionDate).reverse();
      },
    });
  }

  getPurchaseCommandTotal(purchaseCommand: IPurchaseCommandWithLines): number {
    let total = 0;
    purchaseCommand.purchaseCommandLines?.forEach(pcl => {
      total += pcl.unitPrice! * pcl.quantity!;
    });
    return total;
  }
}
