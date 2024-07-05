import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExcelSalesComponent } from './import-excel-sales.component';

describe('ImportExcelSalesComponent', () => {
  let component: ImportExcelSalesComponent;
  let fixture: ComponentFixture<ImportExcelSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportExcelSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportExcelSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
