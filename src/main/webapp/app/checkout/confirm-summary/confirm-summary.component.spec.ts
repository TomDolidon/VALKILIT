import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSummaryComponent } from './confirm-summary.component';

describe('ConfirmSummaryComponent', () => {
  let component: ConfirmSummaryComponent;
  let fixture: ComponentFixture<ConfirmSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
