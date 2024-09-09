import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPurchaseCommand } from '../purchase-command.model';
import { PurchaseCommandService } from '../service/purchase-command.service';

const purchaseCommandResolve = (route: ActivatedRouteSnapshot): Observable<null | IPurchaseCommand> => {
  const id = route.params.id;
  if (id) {
    return inject(PurchaseCommandService)
      .find(id)
      .pipe(
        mergeMap((purchaseCommand: HttpResponse<IPurchaseCommand>) => {
          if (purchaseCommand.body) {
            return of(purchaseCommand.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default purchaseCommandResolve;
