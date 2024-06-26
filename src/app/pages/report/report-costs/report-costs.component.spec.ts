import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCostsComponent } from './report-costs.component';

describe('ReportCostsComponent', () => {
  let component: ReportCostsComponent;
  let fixture: ComponentFixture<ReportCostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportCostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportCostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
