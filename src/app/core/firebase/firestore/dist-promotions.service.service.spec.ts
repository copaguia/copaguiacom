import { TestBed } from '@angular/core/testing';

import { DistPromotionsServiceService } from './dist-promotions.service.service';

describe('DistPromotionsServiceService', () => {
  let service: DistPromotionsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistPromotionsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
