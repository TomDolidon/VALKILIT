import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartValidationButtonComponent } from './cart-validation-btn.component';

describe('CartValidationButtonComponent', () => {
  let component: CartValidationButtonComponent;
  let fixture: ComponentFixture<CartValidationButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartValidationButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartValidationButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
