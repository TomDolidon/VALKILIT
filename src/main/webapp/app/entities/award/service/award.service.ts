import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAward, NewAward } from '../award.model';

export type PartialUpdateAward = Partial<IAward> & Pick<IAward, 'id'>;

export type EntityResponseType = HttpResponse<IAward>;
export type EntityArrayResponseType = HttpResponse<IAward[]>;

@Injectable({ providedIn: 'root' })
export class AwardService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/awards');

  create(award: NewAward): Observable<EntityResponseType> {
    return this.http.post<IAward>(this.resourceUrl, award, { observe: 'response' });
  }

  update(award: IAward): Observable<EntityResponseType> {
    return this.http.put<IAward>(`${this.resourceUrl}/${this.getAwardIdentifier(award)}`, award, { observe: 'response' });
  }

  partialUpdate(award: PartialUpdateAward): Observable<EntityResponseType> {
    return this.http.patch<IAward>(`${this.resourceUrl}/${this.getAwardIdentifier(award)}`, award, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IAward>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAward[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAwardIdentifier(award: Pick<IAward, 'id'>): string {
    return award.id;
  }

  compareAward(o1: Pick<IAward, 'id'> | null, o2: Pick<IAward, 'id'> | null): boolean {
    return o1 && o2 ? this.getAwardIdentifier(o1) === this.getAwardIdentifier(o2) : o1 === o2;
  }

  addAwardToCollectionIfMissing<Type extends Pick<IAward, 'id'>>(
    awardCollection: Type[],
    ...awardsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const awards: Type[] = awardsToCheck.filter(isPresent);
    if (awards.length > 0) {
      const awardCollectionIdentifiers = awardCollection.map(awardItem => this.getAwardIdentifier(awardItem));
      const awardsToAdd = awards.filter(awardItem => {
        const awardIdentifier = this.getAwardIdentifier(awardItem);
        if (awardCollectionIdentifiers.includes(awardIdentifier)) {
          return false;
        }
        awardCollectionIdentifiers.push(awardIdentifier);
        return true;
      });
      return [...awardsToAdd, ...awardCollection];
    }
    return awardCollection;
  }
}
