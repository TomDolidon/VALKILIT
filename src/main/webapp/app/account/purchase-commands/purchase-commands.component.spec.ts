import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseCommandsComponent } from './purchase-commands.component';

describe('PurchaseCommandsComponent', () => {
  let component: PurchaseCommandsComponent;
  let fixture: ComponentFixture<PurchaseCommandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseCommandsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseCommandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
