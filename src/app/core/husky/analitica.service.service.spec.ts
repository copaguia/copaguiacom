import { TestBed } from '@angular/core/testing';

import { AnaliticaServiceService } from './analitica.service.service';

describe('AnaliticaServiceService', () => {
  let service: AnaliticaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnaliticaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
