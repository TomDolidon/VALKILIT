import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPurchaseCommand, NewPurchaseCommand } from '../purchase-command.model';
import { IPurchaseCommandLine, NewPurchaseCommandLine } from 'app/entities/purchase-command-line/purchase-command-line.model';

export type PartialUpdatePurchaseCommand = Partial<IPurchaseCommand> & Pick<IPurchaseCommand, 'id'>;

type RestOf<T extends IPurchaseCommand | NewPurchaseCommand> = Omit<T, 'expeditionDate'> & {
  expeditionDate?: string | null;
};

export type RestPurchaseCommand = RestOf<IPurchaseCommand>;

export type NewRestPurchaseCommand = RestOf<NewPurchaseCommand>;

export type PartialUpdateRestPurchaseCommand = RestOf<PartialUpdatePurchaseCommand>;

export type EntityResponseType = HttpResponse<IPurchaseCommand>;
export type EntityArrayResponseType = HttpResponse<IPurchaseCommand[]>;

@Injectable({ providedIn: 'root' })
export class PurchaseCommandService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/purchase-commands');

  create(purchaseCommand: NewPurchaseCommand): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(purchaseCommand);
    return this.http
      .post<RestPurchaseCommand>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(purchaseCommand: IPurchaseCommand): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(purchaseCommand);
    return this.http
      .put<RestPurchaseCommand>(`${this.resourceUrl}/${this.getPurchaseCommandIdentifier(purchaseCommand)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(purchaseCommand: PartialUpdatePurchaseCommand): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(purchaseCommand);
    return this.http
      .patch<RestPurchaseCommand>(`${this.resourceUrl}/${this.getPurchaseCommandIdentifier(purchaseCommand)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestPurchaseCommand>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPurchaseCommand[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPurchaseCommandIdentifier(purchaseCommand: Pick<IPurchaseCommand, 'id'>): string {
    return purchaseCommand.id;
  }

  getSelfPurchaseCommands(showLines = false): Observable<HttpResponse<{}>> {
    const showLinesParam = showLines ? '?showLines=true' : '';
    return this.http.get(`${this.resourceUrl}/self${showLinesParam}`, { observe: 'response' });
  }

  getSelfCurrentDraftPurchaseCommand(): Observable<HttpResponse<{}>> {
    return this.http.get(`${this.resourceUrl}/self-current-draft`, { observe: 'response' });
  }

  checkSelfCurrentDraftPurchaseCommandStock(): Observable<HttpResponse<{}>> {
    return this.http.get(`${this.resourceUrl}/self-current-draft/check-stock`, { observe: 'response' });
  }

  validateSelfCurrentDraftPurchaseCommand(): Observable<HttpResponse<{}>> {
    return this.http.get(`${this.resourceUrl}/self-current-draft/validate`, { observe: 'response' });
  }

  comparePurchaseCommand(o1: Pick<IPurchaseCommand, 'id'> | null, o2: Pick<IPurchaseCommand, 'id'> | null): boolean {
    return o1 && o2 ? this.getPurchaseCommandIdentifier(o1) === this.getPurchaseCommandIdentifier(o2) : o1 === o2;
  }

  addPurchaseCommandToCollectionIfMissing<Type extends Pick<IPurchaseCommand, 'id'>>(
    purchaseCommandCollection: Type[],
    ...purchaseCommandsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const purchaseCommands: Type[] = purchaseCommandsToCheck.filter(isPresent);
    if (purchaseCommands.length > 0) {
      const purchaseCommandCollectionIdentifiers = purchaseCommandCollection.map(purchaseCommandItem =>
        this.getPurchaseCommandIdentifier(purchaseCommandItem),
      );
      const purchaseCommandsToAdd = purchaseCommands.filter(purchaseCommandItem => {
        const purchaseCommandIdentifier = this.getPurchaseCommandIdentifier(purchaseCommandItem);
        if (purchaseCommandCollectionIdentifiers.includes(purchaseCommandIdentifier)) {
          return false;
        }
        purchaseCommandCollectionIdentifiers.push(purchaseCommandIdentifier);
        return true;
      });
      return [...purchaseCommandsToAdd, ...purchaseCommandCollection];
    }
    return purchaseCommandCollection;
  }

  addPurchaseCommandLineToCart(purchaseCommandLine: NewPurchaseCommandLine): Observable<EntityResponseType> {
    return this.http
      .post<RestPurchaseCommand>(`${this.resourceUrl}/self-current-draft/add-command-line`, purchaseCommandLine, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  removePurchaseCommandLineFromCart(bookId: string): Observable<EntityResponseType> {
    return this.http
      .delete<RestPurchaseCommand>(`${this.resourceUrl}/self-current-draft/remove-command-line/${bookId}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Clear all items from the cart.
   * @returns an Observable with the updated PurchaseCommand.
   */
  clearCart(): Observable<EntityResponseType> {
    return this.http
      .delete<RestPurchaseCommand>(`${this.resourceUrl}/self-current-draft/clear-cart`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  /**
   * Decrease the quantity of an item in the cart.
   * @param bookId the ID of the book to decrement.
   * @returns an Observable with the updated PurchaseCommand.
   */
  decrementPurchaseCommandLine(bookId: string): Observable<EntityResponseType> {
    return this.http
      .delete<RestPurchaseCommand>(`${this.resourceUrl}/self-current-draft/decrement-command-line/${bookId}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  updateCart(purchaseCommandsLines: (IPurchaseCommandLine | NewPurchaseCommandLine)[]): Observable<HttpResponse<IPurchaseCommand>> {
    return this.http.put<IPurchaseCommand>(`${this.resourceUrl}/self-current-draft/update-command-line`, purchaseCommandsLines, {
      observe: 'response',
    });
  }

  protected convertDateFromClient<T extends IPurchaseCommand | NewPurchaseCommand | PartialUpdatePurchaseCommand>(
    purchaseCommand: T,
  ): RestOf<T> {
    return {
      ...purchaseCommand,
      expeditionDate: purchaseCommand.expeditionDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restPurchaseCommand: RestPurchaseCommand): IPurchaseCommand {
    return {
      ...restPurchaseCommand,
      expeditionDate: restPurchaseCommand.expeditionDate ? dayjs(restPurchaseCommand.expeditionDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPurchaseCommand>): HttpResponse<IPurchaseCommand> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPurchaseCommand[]>): HttpResponse<IPurchaseCommand[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
