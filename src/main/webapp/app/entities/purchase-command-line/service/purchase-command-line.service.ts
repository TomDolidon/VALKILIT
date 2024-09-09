import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPurchaseCommandLine, NewPurchaseCommandLine } from '../purchase-command-line.model';

export type PartialUpdatePurchaseCommandLine = Partial<IPurchaseCommandLine> & Pick<IPurchaseCommandLine, 'id'>;

export type EntityResponseType = HttpResponse<IPurchaseCommandLine>;
export type EntityArrayResponseType = HttpResponse<IPurchaseCommandLine[]>;

@Injectable({ providedIn: 'root' })
export class PurchaseCommandLineService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/purchase-command-lines');

  create(purchaseCommandLine: NewPurchaseCommandLine): Observable<EntityResponseType> {
    return this.http.post<IPurchaseCommandLine>(this.resourceUrl, purchaseCommandLine, { observe: 'response' });
  }

  update(purchaseCommandLine: IPurchaseCommandLine): Observable<EntityResponseType> {
    return this.http.put<IPurchaseCommandLine>(
      `${this.resourceUrl}/${this.getPurchaseCommandLineIdentifier(purchaseCommandLine)}`,
      purchaseCommandLine,
      { observe: 'response' },
    );
  }

  partialUpdate(purchaseCommandLine: PartialUpdatePurchaseCommandLine): Observable<EntityResponseType> {
    return this.http.patch<IPurchaseCommandLine>(
      `${this.resourceUrl}/${this.getPurchaseCommandLineIdentifier(purchaseCommandLine)}`,
      purchaseCommandLine,
      { observe: 'response' },
    );
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IPurchaseCommandLine>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPurchaseCommandLine[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPurchaseCommandLineIdentifier(purchaseCommandLine: Pick<IPurchaseCommandLine, 'id'>): string {
    return purchaseCommandLine.id;
  }

  comparePurchaseCommandLine(o1: Pick<IPurchaseCommandLine, 'id'> | null, o2: Pick<IPurchaseCommandLine, 'id'> | null): boolean {
    return o1 && o2 ? this.getPurchaseCommandLineIdentifier(o1) === this.getPurchaseCommandLineIdentifier(o2) : o1 === o2;
  }

  addPurchaseCommandLineToCollectionIfMissing<Type extends Pick<IPurchaseCommandLine, 'id'>>(
    purchaseCommandLineCollection: Type[],
    ...purchaseCommandLinesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const purchaseCommandLines: Type[] = purchaseCommandLinesToCheck.filter(isPresent);
    if (purchaseCommandLines.length > 0) {
      const purchaseCommandLineCollectionIdentifiers = purchaseCommandLineCollection.map(purchaseCommandLineItem =>
        this.getPurchaseCommandLineIdentifier(purchaseCommandLineItem),
      );
      const purchaseCommandLinesToAdd = purchaseCommandLines.filter(purchaseCommandLineItem => {
        const purchaseCommandLineIdentifier = this.getPurchaseCommandLineIdentifier(purchaseCommandLineItem);
        if (purchaseCommandLineCollectionIdentifiers.includes(purchaseCommandLineIdentifier)) {
          return false;
        }
        purchaseCommandLineCollectionIdentifiers.push(purchaseCommandLineIdentifier);
        return true;
      });
      return [...purchaseCommandLinesToAdd, ...purchaseCommandLineCollection];
    }
    return purchaseCommandLineCollection;
  }
}
