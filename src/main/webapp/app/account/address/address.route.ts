import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AddressComponent } from './address.component';

const addressRoute: Route = {
  path: 'address',
  component: AddressComponent,
  title: 'global.menu.account.address',
  canActivate: [UserRouteAccessService],
};

export default addressRoute;
