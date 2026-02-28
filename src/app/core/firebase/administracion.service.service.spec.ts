import { TestBed } from '@angular/core/testing';

import { AdministracionServiceService } from './administracion.service.service';

describe('AdministracionServiceService', () => {
  let service: AdministracionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdministracionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
