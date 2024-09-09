import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../purchase-command.test-samples';

import { PurchaseCommandFormService } from './purchase-command-form.service';

describe('PurchaseCommand Form Service', () => {
  let service: PurchaseCommandFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseCommandFormService);
  });

  describe('Service methods', () => {
    describe('createPurchaseCommandFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPurchaseCommandFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            expeditionDate: expect.any(Object),
            status: expect.any(Object),
            deliveryAddress: expect.any(Object),
            client: expect.any(Object),
          }),
        );
      });

      it('passing IPurchaseCommand should create a new form with FormGroup', () => {
        const formGroup = service.createPurchaseCommandFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            expeditionDate: expect.any(Object),
            status: expect.any(Object),
            deliveryAddress: expect.any(Object),
            client: expect.any(Object),
          }),
        );
      });
    });

    describe('getPurchaseCommand', () => {
      it('should return NewPurchaseCommand for default PurchaseCommand initial value', () => {
        const formGroup = service.createPurchaseCommandFormGroup(sampleWithNewData);

        const purchaseCommand = service.getPurchaseCommand(formGroup) as any;

        expect(purchaseCommand).toMatchObject(sampleWithNewData);
      });

      it('should return NewPurchaseCommand for empty PurchaseCommand initial value', () => {
        const formGroup = service.createPurchaseCommandFormGroup();

        const purchaseCommand = service.getPurchaseCommand(formGroup) as any;

        expect(purchaseCommand).toMatchObject({});
      });

      it('should return IPurchaseCommand', () => {
        const formGroup = service.createPurchaseCommandFormGroup(sampleWithRequiredData);

        const purchaseCommand = service.getPurchaseCommand(formGroup) as any;

        expect(purchaseCommand).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPurchaseCommand should not enable id FormControl', () => {
        const formGroup = service.createPurchaseCommandFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPurchaseCommand should disable id FormControl', () => {
        const formGroup = service.createPurchaseCommandFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
