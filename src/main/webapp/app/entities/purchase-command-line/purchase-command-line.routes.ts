import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import PurchaseCommandLineResolve from './route/purchase-command-line-routing-resolve.service';

const purchaseCommandLineRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/purchase-command-line.component').then(m => m.PurchaseCommandLineComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/purchase-command-line-detail.component').then(m => m.PurchaseCommandLineDetailComponent),
    resolve: {
      purchaseCommandLine: PurchaseCommandLineResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/purchase-command-line-update.component').then(m => m.PurchaseCommandLineUpdateComponent),
    resolve: {
      purchaseCommandLine: PurchaseCommandLineResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/purchase-command-line-update.component').then(m => m.PurchaseCommandLineUpdateComponent),
    resolve: {
      purchaseCommandLine: PurchaseCommandLineResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default purchaseCommandLineRoute;
