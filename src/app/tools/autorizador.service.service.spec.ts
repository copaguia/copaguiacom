import { TestBed } from '@angular/core/testing';

import { AutorizadorService } from './autorizador.service.service';

describe('AutorizadorServiceService', () => {
  let service: AutorizadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutorizadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
