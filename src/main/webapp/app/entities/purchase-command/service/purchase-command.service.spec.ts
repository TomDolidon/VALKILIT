import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPurchaseCommand } from '../purchase-command.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../purchase-command.test-samples';

import { PurchaseCommandService, RestPurchaseCommand } from './purchase-command.service';

const requireRestSample: RestPurchaseCommand = {
  ...sampleWithRequiredData,
  expeditionDate: sampleWithRequiredData.expeditionDate?.format(DATE_FORMAT),
};

describe('PurchaseCommand Service', () => {
  let service: PurchaseCommandService;
  let httpMock: HttpTestingController;
  let expectedResult: IPurchaseCommand | IPurchaseCommand[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PurchaseCommandService);
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

    it('should create a PurchaseCommand', () => {
      const purchaseCommand = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(purchaseCommand).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PurchaseCommand', () => {
      const purchaseCommand = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(purchaseCommand).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PurchaseCommand', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PurchaseCommand', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PurchaseCommand', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPurchaseCommandToCollectionIfMissing', () => {
      it('should add a PurchaseCommand to an empty array', () => {
        const purchaseCommand: IPurchaseCommand = sampleWithRequiredData;
        expectedResult = service.addPurchaseCommandToCollectionIfMissing([], purchaseCommand);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(purchaseCommand);
      });

      it('should not add a PurchaseCommand to an array that contains it', () => {
        const purchaseCommand: IPurchaseCommand = sampleWithRequiredData;
        const purchaseCommandCollection: IPurchaseCommand[] = [
          {
            ...purchaseCommand,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPurchaseCommandToCollectionIfMissing(purchaseCommandCollection, purchaseCommand);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PurchaseCommand to an array that doesn't contain it", () => {
        const purchaseCommand: IPurchaseCommand = sampleWithRequiredData;
        const purchaseCommandCollection: IPurchaseCommand[] = [sampleWithPartialData];
        expectedResult = service.addPurchaseCommandToCollectionIfMissing(purchaseCommandCollection, purchaseCommand);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(purchaseCommand);
      });

      it('should add only unique PurchaseCommand to an array', () => {
        const purchaseCommandArray: IPurchaseCommand[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const purchaseCommandCollection: IPurchaseCommand[] = [sampleWithRequiredData];
        expectedResult = service.addPurchaseCommandToCollectionIfMissing(purchaseCommandCollection, ...purchaseCommandArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const purchaseCommand: IPurchaseCommand = sampleWithRequiredData;
        const purchaseCommand2: IPurchaseCommand = sampleWithPartialData;
        expectedResult = service.addPurchaseCommandToCollectionIfMissing([], purchaseCommand, purchaseCommand2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(purchaseCommand);
        expect(expectedResult).toContain(purchaseCommand2);
      });

      it('should accept null and undefined values', () => {
        const purchaseCommand: IPurchaseCommand = sampleWithRequiredData;
        expectedResult = service.addPurchaseCommandToCollectionIfMissing([], null, purchaseCommand, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(purchaseCommand);
      });

      it('should return initial array if no PurchaseCommand is added', () => {
        const purchaseCommandCollection: IPurchaseCommand[] = [sampleWithRequiredData];
        expectedResult = service.addPurchaseCommandToCollectionIfMissing(purchaseCommandCollection, undefined, null);
        expect(expectedResult).toEqual(purchaseCommandCollection);
      });
    });

    describe('comparePurchaseCommand', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePurchaseCommand(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = null;

        const compareResult1 = service.comparePurchaseCommand(entity1, entity2);
        const compareResult2 = service.comparePurchaseCommand(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

        const compareResult1 = service.comparePurchaseCommand(entity1, entity2);
        const compareResult2 = service.comparePurchaseCommand(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        const compareResult1 = service.comparePurchaseCommand(entity1, entity2);
        const compareResult2 = service.comparePurchaseCommand(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
