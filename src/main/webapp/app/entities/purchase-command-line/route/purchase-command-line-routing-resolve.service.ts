import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPurchaseCommandLine } from '../purchase-command-line.model';
import { PurchaseCommandLineService } from '../service/purchase-command-line.service';

const purchaseCommandLineResolve = (route: ActivatedRouteSnapshot): Observable<null | IPurchaseCommandLine> => {
  const id = route.params.id;
  if (id) {
    return inject(PurchaseCommandLineService)
      .find(id)
      .pipe(
        mergeMap((purchaseCommandLine: HttpResponse<IPurchaseCommandLine>) => {
          if (purchaseCommandLine.body) {
            return of(purchaseCommandLine.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default purchaseCommandLineResolve;
