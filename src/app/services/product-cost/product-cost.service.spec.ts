import { TestBed } from '@angular/core/testing';

import { ProductCostService } from './product-cost.service';

describe('ProductCostService', () => {
  let service: ProductCostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductCostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
