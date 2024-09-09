import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../award.test-samples';

import { AwardFormService } from './award-form.service';

describe('Award Form Service', () => {
  let service: AwardFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AwardFormService);
  });

  describe('Service methods', () => {
    describe('createAwardFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAwardFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
          }),
        );
      });

      it('passing IAward should create a new form with FormGroup', () => {
        const formGroup = service.createAwardFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
          }),
        );
      });
    });

    describe('getAward', () => {
      it('should return NewAward for default Award initial value', () => {
        const formGroup = service.createAwardFormGroup(sampleWithNewData);

        const award = service.getAward(formGroup) as any;

        expect(award).toMatchObject(sampleWithNewData);
      });

      it('should return NewAward for empty Award initial value', () => {
        const formGroup = service.createAwardFormGroup();

        const award = service.getAward(formGroup) as any;

        expect(award).toMatchObject({});
      });

      it('should return IAward', () => {
        const formGroup = service.createAwardFormGroup(sampleWithRequiredData);

        const award = service.getAward(formGroup) as any;

        expect(award).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAward should not enable id FormControl', () => {
        const formGroup = service.createAwardFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAward should disable id FormControl', () => {
        const formGroup = service.createAwardFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
