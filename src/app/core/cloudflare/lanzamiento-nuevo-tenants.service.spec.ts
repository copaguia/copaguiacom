import { TestBed } from '@angular/core/testing';

import { LanzamientoNuevoTenantsService } from './lanzamiento-nuevo-tenants.service';

describe('LanzamientoNuevoTenantsService', () => {
  let service: LanzamientoNuevoTenantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanzamientoNuevoTenantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
