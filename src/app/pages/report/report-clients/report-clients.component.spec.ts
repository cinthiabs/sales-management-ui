import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportClientsComponent } from './report-clients.component';

describe('ReportComponent', () => {
  let component: ReportClientsComponent;
  let fixture: ComponentFixture<ReportClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
