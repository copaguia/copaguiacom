import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlazaDeMercadoComponent } from './plaza-de-mercado.component';

describe('PlazaDeMercadoComponent', () => {
  let component: PlazaDeMercadoComponent;
  let fixture: ComponentFixture<PlazaDeMercadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlazaDeMercadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlazaDeMercadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
