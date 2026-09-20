import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMunicipiosHubComponent } from './admin-municipios-hub.component';

describe('AdminMunicipiosHubComponent', () => {
  let component: AdminMunicipiosHubComponent;
  let fixture: ComponentFixture<AdminMunicipiosHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMunicipiosHubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMunicipiosHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
