import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAward } from '../award.model';
import { AwardService } from '../service/award.service';

const awardResolve = (route: ActivatedRouteSnapshot): Observable<null | IAward> => {
  const id = route.params.id;
  if (id) {
    return inject(AwardService)
      .find(id)
      .pipe(
        mergeMap((award: HttpResponse<IAward>) => {
          if (award.body) {
            return of(award.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default awardResolve;
