import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCalculateComponent } from './dialog-calculate.component';

describe('DialogCalculateComponent', () => {
  let component: DialogCalculateComponent;
  let fixture: ComponentFixture<DialogCalculateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCalculateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCalculateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
