import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSalesComponent } from './register-sales.component';

describe('RegisterSalesComponent', () => {
  let component: RegisterSalesComponent;
  let fixture: ComponentFixture<RegisterSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
