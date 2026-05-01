import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVerificacionComponent } from './admin-verificacion.component';

describe('AdminVerificacionComponent', () => {
  let component: AdminVerificacionComponent;
  let fixture: ComponentFixture<AdminVerificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminVerificacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminVerificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
