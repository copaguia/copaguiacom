import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaCalzadoComponent } from './moda-calzado.component';

describe('ModaCalzadoComponent', () => {
  let component: ModaCalzadoComponent;
  let fixture: ComponentFixture<ModaCalzadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaCalzadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModaCalzadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
