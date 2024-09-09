import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAwardBook, NewAwardBook } from '../award-book.model';

export type PartialUpdateAwardBook = Partial<IAwardBook> & Pick<IAwardBook, 'id'>;

type RestOf<T extends IAwardBook | NewAwardBook> = Omit<T, 'year'> & {
  year?: string | null;
};

export type RestAwardBook = RestOf<IAwardBook>;

export type NewRestAwardBook = RestOf<NewAwardBook>;

export type PartialUpdateRestAwardBook = RestOf<PartialUpdateAwardBook>;

export type EntityResponseType = HttpResponse<IAwardBook>;
export type EntityArrayResponseType = HttpResponse<IAwardBook[]>;

@Injectable({ providedIn: 'root' })
export class AwardBookService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/award-books');

  create(awardBook: NewAwardBook): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(awardBook);
    return this.http
      .post<RestAwardBook>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(awardBook: IAwardBook): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(awardBook);
    return this.http
      .put<RestAwardBook>(`${this.resourceUrl}/${this.getAwardBookIdentifier(awardBook)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(awardBook: PartialUpdateAwardBook): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(awardBook);
    return this.http
      .patch<RestAwardBook>(`${this.resourceUrl}/${this.getAwardBookIdentifier(awardBook)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAwardBook>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAwardBook[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAwardBookIdentifier(awardBook: Pick<IAwardBook, 'id'>): number {
    return awardBook.id;
  }

  compareAwardBook(o1: Pick<IAwardBook, 'id'> | null, o2: Pick<IAwardBook, 'id'> | null): boolean {
    return o1 && o2 ? this.getAwardBookIdentifier(o1) === this.getAwardBookIdentifier(o2) : o1 === o2;
  }

  addAwardBookToCollectionIfMissing<Type extends Pick<IAwardBook, 'id'>>(
    awardBookCollection: Type[],
    ...awardBooksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const awardBooks: Type[] = awardBooksToCheck.filter(isPresent);
    if (awardBooks.length > 0) {
      const awardBookCollectionIdentifiers = awardBookCollection.map(awardBookItem => this.getAwardBookIdentifier(awardBookItem));
      const awardBooksToAdd = awardBooks.filter(awardBookItem => {
        const awardBookIdentifier = this.getAwardBookIdentifier(awardBookItem);
        if (awardBookCollectionIdentifiers.includes(awardBookIdentifier)) {
          return false;
        }
        awardBookCollectionIdentifiers.push(awardBookIdentifier);
        return true;
      });
      return [...awardBooksToAdd, ...awardBookCollection];
    }
    return awardBookCollection;
  }

  protected convertDateFromClient<T extends IAwardBook | NewAwardBook | PartialUpdateAwardBook>(awardBook: T): RestOf<T> {
    return {
      ...awardBook,
      year: awardBook.year?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restAwardBook: RestAwardBook): IAwardBook {
    return {
      ...restAwardBook,
      year: restAwardBook.year ? dayjs(restAwardBook.year) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAwardBook>): HttpResponse<IAwardBook> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAwardBook[]>): HttpResponse<IAwardBook[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
