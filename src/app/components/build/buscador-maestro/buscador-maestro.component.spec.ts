import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorMaestroComponent } from './buscador-maestro.component';

describe('BuscadorMaestroComponent', () => {
  let component: BuscadorMaestroComponent;
  let fixture: ComponentFixture<BuscadorMaestroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscadorMaestroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscadorMaestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
