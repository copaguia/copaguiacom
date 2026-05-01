import { TestBed } from '@angular/core/testing';

import { InstanciasService } from './instancias.service';

describe('InstanciasService', () => {
  let service: InstanciasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstanciasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
