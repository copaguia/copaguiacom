import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PapeleriasLibreriasComponent } from './papelerias-librerias.component';

describe('PapeleriasLibreriasComponent', () => {
  let component: PapeleriasLibreriasComponent;
  let fixture: ComponentFixture<PapeleriasLibreriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PapeleriasLibreriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PapeleriasLibreriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
