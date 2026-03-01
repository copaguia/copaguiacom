import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleNegocioComponent } from './detalle-negocio.component';

describe('DetalleNegocioComponent', () => {
  let component: DetalleNegocioComponent;
  let fixture: ComponentFixture<DetalleNegocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleNegocioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleNegocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
