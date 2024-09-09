import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../award-book.test-samples';

import { AwardBookFormService } from './award-book-form.service';

describe('AwardBook Form Service', () => {
  let service: AwardBookFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AwardBookFormService);
  });

  describe('Service methods', () => {
    describe('createAwardBookFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAwardBookFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            year: expect.any(Object),
            book: expect.any(Object),
            award: expect.any(Object),
          }),
        );
      });

      it('passing IAwardBook should create a new form with FormGroup', () => {
        const formGroup = service.createAwardBookFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            year: expect.any(Object),
            book: expect.any(Object),
            award: expect.any(Object),
          }),
        );
      });
    });

    describe('getAwardBook', () => {
      it('should return NewAwardBook for default AwardBook initial value', () => {
        const formGroup = service.createAwardBookFormGroup(sampleWithNewData);

        const awardBook = service.getAwardBook(formGroup) as any;

        expect(awardBook).toMatchObject(sampleWithNewData);
      });

      it('should return NewAwardBook for empty AwardBook initial value', () => {
        const formGroup = service.createAwardBookFormGroup();

        const awardBook = service.getAwardBook(formGroup) as any;

        expect(awardBook).toMatchObject({});
      });

      it('should return IAwardBook', () => {
        const formGroup = service.createAwardBookFormGroup(sampleWithRequiredData);

        const awardBook = service.getAwardBook(formGroup) as any;

        expect(awardBook).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAwardBook should not enable id FormControl', () => {
        const formGroup = service.createAwardBookFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAwardBook should disable id FormControl', () => {
        const formGroup = service.createAwardBookFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
