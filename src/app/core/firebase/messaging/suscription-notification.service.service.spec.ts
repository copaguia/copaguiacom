import { TestBed } from '@angular/core/testing';

import { SuscriptionNotificationServiceService } from './suscription-notification.service.service';

describe('SuscriptionNotificationServiceService', () => {
  let service: SuscriptionNotificationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuscriptionNotificationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
