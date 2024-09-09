import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { PublisherService } from '../service/publisher.service';
import { IPublisher } from '../publisher.model';
import { PublisherFormGroup, PublisherFormService } from './publisher-form.service';

@Component({
  standalone: true,
  selector: 'jhi-publisher-update',
  templateUrl: './publisher-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PublisherUpdateComponent implements OnInit {
  isSaving = false;
  publisher: IPublisher | null = null;

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected publisherService = inject(PublisherService);
  protected publisherFormService = inject(PublisherFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PublisherFormGroup = this.publisherFormService.createPublisherFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ publisher }) => {
      this.publisher = publisher;
      if (publisher) {
        this.updateForm(publisher);
      }
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('valkylitApp.error', { ...err, key: `error.file.${err.key}` })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const publisher = this.publisherFormService.getPublisher(this.editForm);
    if (publisher.id !== null) {
      this.subscribeToSaveResponse(this.publisherService.update(publisher));
    } else {
      this.subscribeToSaveResponse(this.publisherService.create(publisher));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPublisher>>): void {
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

  protected updateForm(publisher: IPublisher): void {
    this.publisher = publisher;
    this.publisherFormService.resetForm(this.editForm, publisher);
  }
}
