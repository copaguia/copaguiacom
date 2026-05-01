import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoporteConsolaComponent } from './soporte-consola.component';

describe('SoporteConsolaComponent', () => {
  let component: SoporteConsolaComponent;
  let fixture: ComponentFixture<SoporteConsolaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoporteConsolaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoporteConsolaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
