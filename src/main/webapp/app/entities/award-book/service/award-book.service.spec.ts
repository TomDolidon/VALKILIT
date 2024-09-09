import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IAwardBook } from '../award-book.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../award-book.test-samples';

import { AwardBookService, RestAwardBook } from './award-book.service';

const requireRestSample: RestAwardBook = {
  ...sampleWithRequiredData,
  year: sampleWithRequiredData.year?.format(DATE_FORMAT),
};

describe('AwardBook Service', () => {
  let service: AwardBookService;
  let httpMock: HttpTestingController;
  let expectedResult: IAwardBook | IAwardBook[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AwardBookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a AwardBook', () => {
      const awardBook = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(awardBook).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AwardBook', () => {
      const awardBook = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(awardBook).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AwardBook', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AwardBook', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AwardBook', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAwardBookToCollectionIfMissing', () => {
      it('should add a AwardBook to an empty array', () => {
        const awardBook: IAwardBook = sampleWithRequiredData;
        expectedResult = service.addAwardBookToCollectionIfMissing([], awardBook);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(awardBook);
      });

      it('should not add a AwardBook to an array that contains it', () => {
        const awardBook: IAwardBook = sampleWithRequiredData;
        const awardBookCollection: IAwardBook[] = [
          {
            ...awardBook,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAwardBookToCollectionIfMissing(awardBookCollection, awardBook);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AwardBook to an array that doesn't contain it", () => {
        const awardBook: IAwardBook = sampleWithRequiredData;
        const awardBookCollection: IAwardBook[] = [sampleWithPartialData];
        expectedResult = service.addAwardBookToCollectionIfMissing(awardBookCollection, awardBook);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(awardBook);
      });

      it('should add only unique AwardBook to an array', () => {
        const awardBookArray: IAwardBook[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const awardBookCollection: IAwardBook[] = [sampleWithRequiredData];
        expectedResult = service.addAwardBookToCollectionIfMissing(awardBookCollection, ...awardBookArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const awardBook: IAwardBook = sampleWithRequiredData;
        const awardBook2: IAwardBook = sampleWithPartialData;
        expectedResult = service.addAwardBookToCollectionIfMissing([], awardBook, awardBook2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(awardBook);
        expect(expectedResult).toContain(awardBook2);
      });

      it('should accept null and undefined values', () => {
        const awardBook: IAwardBook = sampleWithRequiredData;
        expectedResult = service.addAwardBookToCollectionIfMissing([], null, awardBook, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(awardBook);
      });

      it('should return initial array if no AwardBook is added', () => {
        const awardBookCollection: IAwardBook[] = [sampleWithRequiredData];
        expectedResult = service.addAwardBookToCollectionIfMissing(awardBookCollection, undefined, null);
        expect(expectedResult).toEqual(awardBookCollection);
      });
    });

    describe('compareAwardBook', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAwardBook(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAwardBook(entity1, entity2);
        const compareResult2 = service.compareAwardBook(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAwardBook(entity1, entity2);
        const compareResult2 = service.compareAwardBook(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAwardBook(entity1, entity2);
        const compareResult2 = service.compareAwardBook(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
