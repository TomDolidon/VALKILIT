import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartvalidateComponent } from './cartvalidationbtn.component';

describe('CartvalidateComponent', () => {
  let component: CartvalidateComponent;
  let fixture: ComponentFixture<CartvalidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartvalidateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartvalidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
