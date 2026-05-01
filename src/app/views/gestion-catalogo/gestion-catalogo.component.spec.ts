import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCatalogoComponent } from './gestion-catalogo.component';

describe('GestionCatalogoComponent', () => {
  let component: GestionCatalogoComponent;
  let fixture: ComponentFixture<GestionCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionCatalogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
