import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarniceriasLegumbreriasComponent } from './carnicerias-legumbrerias.component';

describe('CarniceriasLegumbreriasComponent', () => {
  let component: CarniceriasLegumbreriasComponent;
  let fixture: ComponentFixture<CarniceriasLegumbreriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarniceriasLegumbreriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarniceriasLegumbreriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
