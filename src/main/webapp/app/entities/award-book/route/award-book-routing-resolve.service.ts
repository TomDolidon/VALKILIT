import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAwardBook } from '../award-book.model';
import { AwardBookService } from '../service/award-book.service';

const awardBookResolve = (route: ActivatedRouteSnapshot): Observable<null | IAwardBook> => {
  const id = route.params.id;
  if (id) {
    return inject(AwardBookService)
      .find(id)
      .pipe(
        mergeMap((awardBook: HttpResponse<IAwardBook>) => {
          if (awardBook.body) {
            return of(awardBook.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default awardBookResolve;
