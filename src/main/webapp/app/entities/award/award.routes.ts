import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import AwardResolve from './route/award-routing-resolve.service';

const awardRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/award.component').then(m => m.AwardComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/award-detail.component').then(m => m.AwardDetailComponent),
    resolve: {
      award: AwardResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/award-update.component').then(m => m.AwardUpdateComponent),
    resolve: {
      award: AwardResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/award-update.component').then(m => m.AwardUpdateComponent),
    resolve: {
      award: AwardResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default awardRoute;
