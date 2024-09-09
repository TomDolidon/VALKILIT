import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { AwardBookDetailComponent } from './award-book-detail.component';

describe('AwardBook Management Detail Component', () => {
  let comp: AwardBookDetailComponent;
  let fixture: ComponentFixture<AwardBookDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwardBookDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./award-book-detail.component').then(m => m.AwardBookDetailComponent),
              resolve: { awardBook: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(AwardBookDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardBookDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load awardBook on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', AwardBookDetailComponent);

      // THEN
      expect(instance.awardBook()).toEqual(expect.objectContaining({ id: 123 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
