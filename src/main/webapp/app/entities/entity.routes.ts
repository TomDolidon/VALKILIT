import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'valkylitApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'client',
    data: { pageTitle: 'valkylitApp.client.home.title' },
    loadChildren: () => import('./client/client.routes'),
  },
  {
    path: 'purchase-command',
    data: { pageTitle: 'valkylitApp.purchaseCommand.home.title' },
    loadChildren: () => import('./purchase-command/purchase-command.routes'),
  },
  {
    path: 'purchase-command-line',
    data: { pageTitle: 'valkylitApp.purchaseCommandLine.home.title' },
    loadChildren: () => import('./purchase-command-line/purchase-command-line.routes'),
  },
  {
    path: 'book',
    data: { pageTitle: 'valkylitApp.book.home.title' },
    loadChildren: () => import('./book/book.routes'),
  },
  {
    path: 'address',
    data: { pageTitle: 'valkylitApp.address.home.title' },
    loadChildren: () => import('./address/address.routes'),
  },
  {
    path: 'author',
    data: { pageTitle: 'valkylitApp.author.home.title' },
    loadChildren: () => import('./author/author.routes'),
  },
  {
    path: 'publisher',
    data: { pageTitle: 'valkylitApp.publisher.home.title' },
    loadChildren: () => import('./publisher/publisher.routes'),
  },
  {
    path: 'award',
    data: { pageTitle: 'valkylitApp.award.home.title' },
    loadChildren: () => import('./award/award.routes'),
  },
  {
    path: 'award-book',
    data: { pageTitle: 'valkylitApp.awardBook.home.title' },
    loadChildren: () => import('./award-book/award-book.routes'),
  },
  {
    path: 'book-category',
    data: { pageTitle: 'valkylitApp.bookCategory.home.title' },
    loadChildren: () => import('./book-category/book-category.routes'),
  },
  {
    path: 'review',
    data: { pageTitle: 'valkylitApp.review.home.title' },
    loadChildren: () => import('./review/review.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
