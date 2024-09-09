import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import ReviewResolve from './route/review-routing-resolve.service';

const reviewRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/review.component').then(m => m.ReviewComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/review-detail.component').then(m => m.ReviewDetailComponent),
    resolve: {
      review: ReviewResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/review-update.component').then(m => m.ReviewUpdateComponent),
    resolve: {
      review: ReviewResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/review-update.component').then(m => m.ReviewUpdateComponent),
    resolve: {
      review: ReviewResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default reviewRoute;
