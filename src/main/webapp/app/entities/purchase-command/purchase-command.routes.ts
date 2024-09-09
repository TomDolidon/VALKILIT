import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import PurchaseCommandResolve from './route/purchase-command-routing-resolve.service';

const purchaseCommandRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/purchase-command.component').then(m => m.PurchaseCommandComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/purchase-command-detail.component').then(m => m.PurchaseCommandDetailComponent),
    resolve: {
      purchaseCommand: PurchaseCommandResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/purchase-command-update.component').then(m => m.PurchaseCommandUpdateComponent),
    resolve: {
      purchaseCommand: PurchaseCommandResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/purchase-command-update.component').then(m => m.PurchaseCommandUpdateComponent),
    resolve: {
      purchaseCommand: PurchaseCommandResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default purchaseCommandRoute;
