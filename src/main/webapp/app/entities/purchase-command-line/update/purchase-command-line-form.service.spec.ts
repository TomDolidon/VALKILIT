import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../purchase-command-line.test-samples';

import { PurchaseCommandLineFormService } from './purchase-command-line-form.service';

describe('PurchaseCommandLine Form Service', () => {
  let service: PurchaseCommandLineFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseCommandLineFormService);
  });

  describe('Service methods', () => {
    describe('createPurchaseCommandLineFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPurchaseCommandLineFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quantity: expect.any(Object),
            unitPrice: expect.any(Object),
            book: expect.any(Object),
            purchaseCommand: expect.any(Object),
          }),
        );
      });

      it('passing IPurchaseCommandLine should create a new form with FormGroup', () => {
        const formGroup = service.createPurchaseCommandLineFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quantity: expect.any(Object),
            unitPrice: expect.any(Object),
            book: expect.any(Object),
            purchaseCommand: expect.any(Object),
          }),
        );
      });
    });

    describe('getPurchaseCommandLine', () => {
      it('should return NewPurchaseCommandLine for default PurchaseCommandLine initial value', () => {
        const formGroup = service.createPurchaseCommandLineFormGroup(sampleWithNewData);

        const purchaseCommandLine = service.getPurchaseCommandLine(formGroup) as any;

        expect(purchaseCommandLine).toMatchObject(sampleWithNewData);
      });

      it('should return NewPurchaseCommandLine for empty PurchaseCommandLine initial value', () => {
        const formGroup = service.createPurchaseCommandLineFormGroup();

        const purchaseCommandLine = service.getPurchaseCommandLine(formGroup) as any;

        expect(purchaseCommandLine).toMatchObject({});
      });

      it('should return IPurchaseCommandLine', () => {
        const formGroup = service.createPurchaseCommandLineFormGroup(sampleWithRequiredData);

        const purchaseCommandLine = service.getPurchaseCommandLine(formGroup) as any;

        expect(purchaseCommandLine).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPurchaseCommandLine should not enable id FormControl', () => {
        const formGroup = service.createPurchaseCommandLineFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPurchaseCommandLine should disable id FormControl', () => {
        const formGroup = service.createPurchaseCommandLineFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
