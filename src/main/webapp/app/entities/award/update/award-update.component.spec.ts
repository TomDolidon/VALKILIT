import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { AwardService } from '../service/award.service';
import { IAward } from '../award.model';
import { AwardFormService } from './award-form.service';

import { AwardUpdateComponent } from './award-update.component';

describe('Award Management Update Component', () => {
  let comp: AwardUpdateComponent;
  let fixture: ComponentFixture<AwardUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let awardFormService: AwardFormService;
  let awardService: AwardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AwardUpdateComponent],
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
      .overrideTemplate(AwardUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AwardUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    awardFormService = TestBed.inject(AwardFormService);
    awardService = TestBed.inject(AwardService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const award: IAward = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

      activatedRoute.data = of({ award });
      comp.ngOnInit();

      expect(comp.award).toEqual(award);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAward>>();
      const award = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(awardFormService, 'getAward').mockReturnValue(award);
      jest.spyOn(awardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ award });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: award }));
      saveSubject.complete();

      // THEN
      expect(awardFormService.getAward).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(awardService.update).toHaveBeenCalledWith(expect.objectContaining(award));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAward>>();
      const award = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(awardFormService, 'getAward').mockReturnValue({ id: null });
      jest.spyOn(awardService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ award: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: award }));
      saveSubject.complete();

      // THEN
      expect(awardFormService.getAward).toHaveBeenCalled();
      expect(awardService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAward>>();
      const award = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(awardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ award });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(awardService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
