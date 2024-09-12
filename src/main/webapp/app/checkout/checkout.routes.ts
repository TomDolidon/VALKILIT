import { Routes } from '@angular/router';
import { UserRouteAccessService } from '../core/auth/user-route-access.service';
import { CheckoutComponent } from './checkout.component';

const CheckoutRoutes: Routes = [
  {
    path: '',
    component: CheckoutComponent,
    title: 'global.purchase-command',
    canActivate: [UserRouteAccessService],
  },
];

export default CheckoutRoutes;
