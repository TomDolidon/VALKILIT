import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IAward } from '../award.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../award.test-samples';

import { AwardService } from './award.service';

const requireRestSample: IAward = {
  ...sampleWithRequiredData,
};

describe('Award Service', () => {
  let service: AwardService;
  let httpMock: HttpTestingController;
  let expectedResult: IAward | IAward[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AwardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Award', () => {
      const award = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(award).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Award', () => {
      const award = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(award).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Award', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Award', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Award', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAwardToCollectionIfMissing', () => {
      it('should add a Award to an empty array', () => {
        const award: IAward = sampleWithRequiredData;
        expectedResult = service.addAwardToCollectionIfMissing([], award);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(award);
      });

      it('should not add a Award to an array that contains it', () => {
        const award: IAward = sampleWithRequiredData;
        const awardCollection: IAward[] = [
          {
            ...award,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAwardToCollectionIfMissing(awardCollection, award);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Award to an array that doesn't contain it", () => {
        const award: IAward = sampleWithRequiredData;
        const awardCollection: IAward[] = [sampleWithPartialData];
        expectedResult = service.addAwardToCollectionIfMissing(awardCollection, award);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(award);
      });

      it('should add only unique Award to an array', () => {
        const awardArray: IAward[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const awardCollection: IAward[] = [sampleWithRequiredData];
        expectedResult = service.addAwardToCollectionIfMissing(awardCollection, ...awardArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const award: IAward = sampleWithRequiredData;
        const award2: IAward = sampleWithPartialData;
        expectedResult = service.addAwardToCollectionIfMissing([], award, award2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(award);
        expect(expectedResult).toContain(award2);
      });

      it('should accept null and undefined values', () => {
        const award: IAward = sampleWithRequiredData;
        expectedResult = service.addAwardToCollectionIfMissing([], null, award, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(award);
      });

      it('should return initial array if no Award is added', () => {
        const awardCollection: IAward[] = [sampleWithRequiredData];
        expectedResult = service.addAwardToCollectionIfMissing(awardCollection, undefined, null);
        expect(expectedResult).toEqual(awardCollection);
      });
    });

    describe('compareAward', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAward(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = null;

        const compareResult1 = service.compareAward(entity1, entity2);
        const compareResult2 = service.compareAward(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

        const compareResult1 = service.compareAward(entity1, entity2);
        const compareResult2 = service.compareAward(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        const compareResult1 = service.compareAward(entity1, entity2);
        const compareResult2 = service.compareAward(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
