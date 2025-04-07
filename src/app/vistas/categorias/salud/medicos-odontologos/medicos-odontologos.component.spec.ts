import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicosOdontologosComponent } from './medicos-odontologos.component';

describe('MedicosOdontologosComponent', () => {
  let component: MedicosOdontologosComponent;
  let fixture: ComponentFixture<MedicosOdontologosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicosOdontologosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicosOdontologosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
