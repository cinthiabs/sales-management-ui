import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCostsComponent } from './register-costs.component';

describe('RegisterCostsComponent', () => {
  let component: RegisterCostsComponent;
  let fixture: ComponentFixture<RegisterCostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterCostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
