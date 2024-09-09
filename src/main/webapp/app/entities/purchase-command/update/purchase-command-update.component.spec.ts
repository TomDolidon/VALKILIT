import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { IPurchaseCommand } from '../purchase-command.model';
import { PurchaseCommandService } from '../service/purchase-command.service';
import { PurchaseCommandFormService } from './purchase-command-form.service';

import { PurchaseCommandUpdateComponent } from './purchase-command-update.component';

describe('PurchaseCommand Management Update Component', () => {
  let comp: PurchaseCommandUpdateComponent;
  let fixture: ComponentFixture<PurchaseCommandUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let purchaseCommandFormService: PurchaseCommandFormService;
  let purchaseCommandService: PurchaseCommandService;
  let addressService: AddressService;
  let clientService: ClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PurchaseCommandUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PurchaseCommandUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PurchaseCommandUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    purchaseCommandFormService = TestBed.inject(PurchaseCommandFormService);
    purchaseCommandService = TestBed.inject(PurchaseCommandService);
    addressService = TestBed.inject(AddressService);
    clientService = TestBed.inject(ClientService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Address query and add missing value', () => {
      const purchaseCommand: IPurchaseCommand = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const deliveryAddress: IAddress = { id: 'e9ad3128-2271-490b-ba94-f7ef9e665bb1' };
      purchaseCommand.deliveryAddress = deliveryAddress;

      const addressCollection: IAddress[] = [{ id: '209021dd-9649-4c81-92a4-e9f1cf72122e' }];
      jest.spyOn(addressService, 'query').mockReturnValue(of(new HttpResponse({ body: addressCollection })));
      const additionalAddresses = [deliveryAddress];
      const expectedCollection: IAddress[] = [...additionalAddresses, ...addressCollection];
      jest.spyOn(addressService, 'addAddressToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ purchaseCommand });
      comp.ngOnInit();

      expect(addressService.query).toHaveBeenCalled();
      expect(addressService.addAddressToCollectionIfMissing).toHaveBeenCalledWith(
        addressCollection,
        ...additionalAddresses.map(expect.objectContaining),
      );
      expect(comp.addressesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Client query and add missing value', () => {
      const purchaseCommand: IPurchaseCommand = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const client: IClient = { id: '8049c18d-868a-49b0-8568-2e8d4977814e' };
      purchaseCommand.client = client;

      const clientCollection: IClient[] = [{ id: 'cc31dd77-91cc-46a6-902c-962904749406' }];
      jest.spyOn(clientService, 'query').mockReturnValue(of(new HttpResponse({ body: clientCollection })));
      const additionalClients = [client];
      const expectedCollection: IClient[] = [...additionalClients, ...clientCollection];
      jest.spyOn(clientService, 'addClientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ purchaseCommand });
      comp.ngOnInit();

      expect(clientService.query).toHaveBeenCalled();
      expect(clientService.addClientToCollectionIfMissing).toHaveBeenCalledWith(
        clientCollection,
        ...additionalClients.map(expect.objectContaining),
      );
      expect(comp.clientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const purchaseCommand: IPurchaseCommand = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const deliveryAddress: IAddress = { id: '2bb05e19-2ce0-4564-8b54-e323263d8e78' };
      purchaseCommand.deliveryAddress = deliveryAddress;
      const client: IClient = { id: 'f0af6783-ddc2-4861-9cac-cebd1b79802a' };
      purchaseCommand.client = client;

      activatedRoute.data = of({ purchaseCommand });
      comp.ngOnInit();

      expect(comp.addressesSharedCollection).toContain(deliveryAddress);
      expect(comp.clientsSharedCollection).toContain(client);
      expect(comp.purchaseCommand).toEqual(purchaseCommand);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchaseCommand>>();
      const purchaseCommand = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(purchaseCommandFormService, 'getPurchaseCommand').mockReturnValue(purchaseCommand);
      jest.spyOn(purchaseCommandService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchaseCommand });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: purchaseCommand }));
      saveSubject.complete();

      // THEN
      expect(purchaseCommandFormService.getPurchaseCommand).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(purchaseCommandService.update).toHaveBeenCalledWith(expect.objectContaining(purchaseCommand));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchaseCommand>>();
      const purchaseCommand = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(purchaseCommandFormService, 'getPurchaseCommand').mockReturnValue({ id: null });
      jest.spyOn(purchaseCommandService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchaseCommand: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: purchaseCommand }));
      saveSubject.complete();

      // THEN
      expect(purchaseCommandFormService.getPurchaseCommand).toHaveBeenCalled();
      expect(purchaseCommandService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPurchaseCommand>>();
      const purchaseCommand = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(purchaseCommandService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ purchaseCommand });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(purchaseCommandService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAddress', () => {
      it('Should forward to addressService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(addressService, 'compareAddress');
        comp.compareAddress(entity, entity2);
        expect(addressService.compareAddress).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareClient', () => {
      it('Should forward to clientService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(clientService, 'compareClient');
        comp.compareClient(entity, entity2);
        expect(clientService.compareClient).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
