import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IPurchaseCommandLine } from '../purchase-command-line.model';
import {
  sampleWithFullData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithRequiredData,
} from '../purchase-command-line.test-samples';

import { PurchaseCommandLineService } from './purchase-command-line.service';

const requireRestSample: IPurchaseCommandLine = {
  ...sampleWithRequiredData,
};

describe('PurchaseCommandLine Service', () => {
  let service: PurchaseCommandLineService;
  let httpMock: HttpTestingController;
  let expectedResult: IPurchaseCommandLine | IPurchaseCommandLine[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PurchaseCommandLineService);
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

    it('should create a PurchaseCommandLine', () => {
      const purchaseCommandLine = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(purchaseCommandLine).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PurchaseCommandLine', () => {
      const purchaseCommandLine = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(purchaseCommandLine).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PurchaseCommandLine', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PurchaseCommandLine', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PurchaseCommandLine', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPurchaseCommandLineToCollectionIfMissing', () => {
      it('should add a PurchaseCommandLine to an empty array', () => {
        const purchaseCommandLine: IPurchaseCommandLine = sampleWithRequiredData;
        expectedResult = service.addPurchaseCommandLineToCollectionIfMissing([], purchaseCommandLine);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(purchaseCommandLine);
      });

      it('should not add a PurchaseCommandLine to an array that contains it', () => {
        const purchaseCommandLine: IPurchaseCommandLine = sampleWithRequiredData;
        const purchaseCommandLineCollection: IPurchaseCommandLine[] = [
          {
            ...purchaseCommandLine,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPurchaseCommandLineToCollectionIfMissing(purchaseCommandLineCollection, purchaseCommandLine);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PurchaseCommandLine to an array that doesn't contain it", () => {
        const purchaseCommandLine: IPurchaseCommandLine = sampleWithRequiredData;
        const purchaseCommandLineCollection: IPurchaseCommandLine[] = [sampleWithPartialData];
        expectedResult = service.addPurchaseCommandLineToCollectionIfMissing(purchaseCommandLineCollection, purchaseCommandLine);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(purchaseCommandLine);
      });

      it('should add only unique PurchaseCommandLine to an array', () => {
        const purchaseCommandLineArray: IPurchaseCommandLine[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const purchaseCommandLineCollection: IPurchaseCommandLine[] = [sampleWithRequiredData];
        expectedResult = service.addPurchaseCommandLineToCollectionIfMissing(purchaseCommandLineCollection, ...purchaseCommandLineArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const purchaseCommandLine: IPurchaseCommandLine = sampleWithRequiredData;
        const purchaseCommandLine2: IPurchaseCommandLine = sampleWithPartialData;
        expectedResult = service.addPurchaseCommandLineToCollectionIfMissing([], purchaseCommandLine, purchaseCommandLine2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(purchaseCommandLine);
        expect(expectedResult).toContain(purchaseCommandLine2);
      });

      it('should accept null and undefined values', () => {
        const purchaseCommandLine: IPurchaseCommandLine = sampleWithRequiredData;
        expectedResult = service.addPurchaseCommandLineToCollectionIfMissing([], null, purchaseCommandLine, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(purchaseCommandLine);
      });

      it('should return initial array if no PurchaseCommandLine is added', () => {
        const purchaseCommandLineCollection: IPurchaseCommandLine[] = [sampleWithRequiredData];
        expectedResult = service.addPurchaseCommandLineToCollectionIfMissing(purchaseCommandLineCollection, undefined, null);
        expect(expectedResult).toEqual(purchaseCommandLineCollection);
      });
    });

    describe('comparePurchaseCommandLine', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePurchaseCommandLine(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = null;

        const compareResult1 = service.comparePurchaseCommandLine(entity1, entity2);
        const compareResult2 = service.comparePurchaseCommandLine(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

        const compareResult1 = service.comparePurchaseCommandLine(entity1, entity2);
        const compareResult2 = service.comparePurchaseCommandLine(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        const compareResult1 = service.comparePurchaseCommandLine(entity1, entity2);
        const compareResult2 = service.comparePurchaseCommandLine(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
