import { Component } from '@angular/core';
import { ClientService } from '../../entities/client/service/client.service';
import { IPurchaseCommandWithLines } from '../../entities/purchase-command/purchase-command.model';
import { PurchaseCommandService } from '../../entities/purchase-command/service/purchase-command.service';
import { UserService } from '../../entities/user/service/user.service';
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

  constructor(
    private clientService: ClientService,
    private purchaseCommandsService: PurchaseCommandService,
    private userService: UserService,
  ) {
    this.purchaseCommandsService.getSelfPurchaseCommands(true).subscribe({
      next: response => {
        this.purchaseCommands = response.body as IPurchaseCommandWithLines[];
        this.purchaseCommands.reverse().filter(command => command.status !== 'DRAFT');
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
