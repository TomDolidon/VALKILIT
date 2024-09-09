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
import { AwardService } from '../service/award.service';
import { IAward } from '../award.model';
import { AwardFormGroup, AwardFormService } from './award-form.service';

@Component({
  standalone: true,
  selector: 'jhi-award-update',
  templateUrl: './award-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AwardUpdateComponent implements OnInit {
  isSaving = false;
  award: IAward | null = null;

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected awardService = inject(AwardService);
  protected awardFormService = inject(AwardFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AwardFormGroup = this.awardFormService.createAwardFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ award }) => {
      this.award = award;
      if (award) {
        this.updateForm(award);
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
    const award = this.awardFormService.getAward(this.editForm);
    if (award.id !== null) {
      this.subscribeToSaveResponse(this.awardService.update(award));
    } else {
      this.subscribeToSaveResponse(this.awardService.create(award));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAward>>): void {
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

  protected updateForm(award: IAward): void {
    this.award = award;
    this.awardFormService.resetForm(this.editForm, award);
  }
}
