import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthHubComponent } from './auth-hub.component';

describe('AuthHubComponent', () => {
  let component: AuthHubComponent;
  let fixture: ComponentFixture<AuthHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthHubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
