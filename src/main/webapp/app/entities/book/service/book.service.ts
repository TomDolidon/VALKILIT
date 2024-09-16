import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBook, NewBook } from '../book.model';
import IBookFilter from 'app/model/IBookFilter';

export type PartialUpdateBook = Partial<IBook> & Pick<IBook, 'id'>;

type RestOf<T extends IBook | NewBook> = Omit<T, 'publishDate'> & {
  publishDate?: string | null;
};

export type RestBook = RestOf<IBook>;

export type NewRestBook = RestOf<NewBook>;

export type PartialUpdateRestBook = RestOf<PartialUpdateBook>;

export type EntityResponseType = HttpResponse<IBook>;
export type EntityArrayResponseType = HttpResponse<IBook[]>;

@Injectable({ providedIn: 'root' })
export class BookService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/books');

  create(book: NewBook, file: File): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(book);
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'bookCreate',
      new Blob([JSON.stringify(copy)], {
        type: 'application/json',
      }),
    );
    return this.http
      .post<RestBook>(this.resourceUrl, formData, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(book: IBook): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(book);
    return this.http
      .put<RestBook>(`${this.resourceUrl}/${this.getBookIdentifier(book)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(book: PartialUpdateBook): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(book);
    return this.http
      .patch<RestBook>(`${this.resourceUrl}/${this.getBookIdentifier(book)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestBook>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any, filter?: IBookFilter, searchTerm?: string): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);

    let params = new HttpParams();

    if (filter?.authors) {
      filter.authors.forEach(author => {
        if (author.name) params = params.append('authors', author.name);
      });
    }

    if (filter?.formats && filter.formats.length > 0) {
      filter.formats.forEach(format => {
        params = params.append('formats', format);
      });
    }

    if (filter?.priceRange !== undefined) {
      params = params.set('minPrice', filter.priceRange[0].toString());
    }

    if (filter?.priceRange !== undefined) {
      params = params.set('maxPrice', filter.priceRange[1].toString());
    }

    if (searchTerm !== undefined) {
      params = params.set('searchTerm', searchTerm.toString());
    }

    let mergedParams = options;
    params.keys().forEach(key => {
      params.getAll(key)?.forEach(value => {
        mergedParams = mergedParams.append(key, value);
      });
    });

    return this.http
      .get<RestBook[]>(this.resourceUrl, { params: mergedParams, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBookIdentifier(book: Pick<IBook, 'id'>): string {
    return book.id;
  }

  compareBook(o1: Pick<IBook, 'id'> | null, o2: Pick<IBook, 'id'> | null): boolean {
    return o1 && o2 ? this.getBookIdentifier(o1) === this.getBookIdentifier(o2) : o1 === o2;
  }

  addBookToCollectionIfMissing<Type extends Pick<IBook, 'id'>>(
    bookCollection: Type[],
    ...booksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const books: Type[] = booksToCheck.filter(isPresent);
    if (books.length > 0) {
      const bookCollectionIdentifiers = bookCollection.map(bookItem => this.getBookIdentifier(bookItem));
      const booksToAdd = books.filter(bookItem => {
        const bookIdentifier = this.getBookIdentifier(bookItem);
        if (bookCollectionIdentifiers.includes(bookIdentifier)) {
          return false;
        }
        bookCollectionIdentifiers.push(bookIdentifier);
        return true;
      });
      return [...booksToAdd, ...bookCollection];
    }
    return bookCollection;
  }

  protected convertDateFromClient<T extends IBook | NewBook | PartialUpdateBook>(book: T): RestOf<T> {
    return {
      ...book,
      publishDate: book.publishDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restBook: RestBook): IBook {
    return {
      ...restBook,
      publishDate: restBook.publishDate ? dayjs(restBook.publishDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestBook>): HttpResponse<IBook> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestBook[]>): HttpResponse<IBook[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
