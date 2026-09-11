import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPublicidadComponent } from './admin-publicidad.component';

describe('AdminPublicidadComponent', () => {
  let component: AdminPublicidadComponent;
  let fixture: ComponentFixture<AdminPublicidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPublicidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPublicidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
