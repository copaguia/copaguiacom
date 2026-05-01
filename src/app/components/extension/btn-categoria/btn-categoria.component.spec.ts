import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnCategoriaComponent } from './btn-categoria.component';

describe('BtnCategoriaComponent', () => {
  let component: BtnCategoriaComponent;
  let fixture: ComponentFixture<BtnCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnCategoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
