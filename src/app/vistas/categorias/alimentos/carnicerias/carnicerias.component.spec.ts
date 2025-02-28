import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarniceriasComponent } from './carnicerias.component';

describe('CarniceriasComponent', () => {
  let component: CarniceriasComponent;
  let fixture: ComponentFixture<CarniceriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarniceriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarniceriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
