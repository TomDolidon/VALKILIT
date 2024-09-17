import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PurchaseCommandsComponent } from './purchase-commands.component';

const purchaseCommandsRoute: Route = {
  path: 'purchase-commands',
  component: PurchaseCommandsComponent,
  title: 'global.menu.account.purchase-commands',
  canActivate: [UserRouteAccessService],
};

export default purchaseCommandsRoute;
