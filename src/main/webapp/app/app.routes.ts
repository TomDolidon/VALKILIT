import { Routes } from '@angular/router';

import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { errorRoute } from './layouts/error/error.route';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
    title: 'home.title',
  },
  {
    path: '',
    loadComponent: () => import('./layouts/navbar/navbar.component'),
    outlet: 'navbar',
  },
  {
    path: 'admin',
    data: {
      authorities: [Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.route'),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
    title: 'login.title',
  },
  {
    path: 'catalog',
    loadComponent: () => import('./catalog/catalog.component'),
    title: 'catalog',
  },
  {
    path: 'details/:id',
    loadComponent: () => import('./details/details.component'),
    title: 'details',
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.routes'),
  },
  {
    path: '',
    loadChildren: () => import(`./entities/entity.routes`),
  },
  {
    path: 'cart',
    loadComponent: () => import(`./cart/cart.component`),
  },
  {
    path: 'contact',
    loadComponent: () => import(`./pages/contact/contact.component`),
  },
  {
    path: 'faq',
    loadComponent: () => import(`./pages/faq/faq.component`),
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import(`./pages/privacy-policy/privacy-policy.component`),
  },
  {
    path: 'terms-of-use',
    loadComponent: () => import(`./pages/terms-of-use/terms-of-use.component`),
  },
  ...errorRoute,
];

export default routes;
