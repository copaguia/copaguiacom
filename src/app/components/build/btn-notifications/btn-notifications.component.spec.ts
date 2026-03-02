import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnNotificationsComponent } from './btn-notifications.component';

describe('BtnNotificationsComponent', () => {
  let component: BtnNotificationsComponent;
  let fixture: ComponentFixture<BtnNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
