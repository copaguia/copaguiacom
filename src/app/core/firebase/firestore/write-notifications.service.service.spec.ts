import { TestBed } from '@angular/core/testing';

import { WriteNotificationsServiceService } from './write-notifications.service.service';

describe('WriteNotificationsServiceService', () => {
  let service: WriteNotificationsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WriteNotificationsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
