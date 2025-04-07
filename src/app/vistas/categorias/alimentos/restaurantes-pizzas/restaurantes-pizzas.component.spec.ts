import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantesPizzasComponent } from './restaurantes-pizzas.component';

describe('RestaurantesPizzasComponent', () => {
  let component: RestaurantesPizzasComponent;
  let fixture: ComponentFixture<RestaurantesPizzasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantesPizzasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantesPizzasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
