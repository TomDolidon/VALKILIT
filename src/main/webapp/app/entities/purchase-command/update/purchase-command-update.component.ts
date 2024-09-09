import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { PurchaseCommandStatus } from 'app/entities/enumerations/purchase-command-status.model';
import { PurchaseCommandService } from '../service/purchase-command.service';
import { IPurchaseCommand } from '../purchase-command.model';
import { PurchaseCommandFormGroup, PurchaseCommandFormService } from './purchase-command-form.service';

@Component({
  standalone: true,
  selector: 'jhi-purchase-command-update',
  templateUrl: './purchase-command-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PurchaseCommandUpdateComponent implements OnInit {
  isSaving = false;
  purchaseCommand: IPurchaseCommand | null = null;
  purchaseCommandStatusValues = Object.keys(PurchaseCommandStatus);

  addressesSharedCollection: IAddress[] = [];
  clientsSharedCollection: IClient[] = [];

  protected purchaseCommandService = inject(PurchaseCommandService);
  protected purchaseCommandFormService = inject(PurchaseCommandFormService);
  protected addressService = inject(AddressService);
  protected clientService = inject(ClientService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PurchaseCommandFormGroup = this.purchaseCommandFormService.createPurchaseCommandFormGroup();

  compareAddress = (o1: IAddress | null, o2: IAddress | null): boolean => this.addressService.compareAddress(o1, o2);

  compareClient = (o1: IClient | null, o2: IClient | null): boolean => this.clientService.compareClient(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ purchaseCommand }) => {
      this.purchaseCommand = purchaseCommand;
      if (purchaseCommand) {
        this.updateForm(purchaseCommand);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const purchaseCommand = this.purchaseCommandFormService.getPurchaseCommand(this.editForm);
    if (purchaseCommand.id !== null) {
      this.subscribeToSaveResponse(this.purchaseCommandService.update(purchaseCommand));
    } else {
      this.subscribeToSaveResponse(this.purchaseCommandService.create(purchaseCommand));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPurchaseCommand>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(purchaseCommand: IPurchaseCommand): void {
    this.purchaseCommand = purchaseCommand;
    this.purchaseCommandFormService.resetForm(this.editForm, purchaseCommand);

    this.addressesSharedCollection = this.addressService.addAddressToCollectionIfMissing<IAddress>(
      this.addressesSharedCollection,
      purchaseCommand.deliveryAddress,
    );
    this.clientsSharedCollection = this.clientService.addClientToCollectionIfMissing<IClient>(
      this.clientsSharedCollection,
      purchaseCommand.client,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.addressService
      .query()
      .pipe(map((res: HttpResponse<IAddress[]>) => res.body ?? []))
      .pipe(
        map((addresses: IAddress[]) =>
          this.addressService.addAddressToCollectionIfMissing<IAddress>(addresses, this.purchaseCommand?.deliveryAddress),
        ),
      )
      .subscribe((addresses: IAddress[]) => (this.addressesSharedCollection = addresses));

    this.clientService
      .query()
      .pipe(map((res: HttpResponse<IClient[]>) => res.body ?? []))
      .pipe(map((clients: IClient[]) => this.clientService.addClientToCollectionIfMissing<IClient>(clients, this.purchaseCommand?.client)))
      .subscribe((clients: IClient[]) => (this.clientsSharedCollection = clients));
  }
}
