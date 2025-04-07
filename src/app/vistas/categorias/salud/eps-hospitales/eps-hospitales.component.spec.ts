import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpsHospitalesComponent } from './eps-hospitales.component';

describe('EpsHospitalesComponent', () => {
  let component: EpsHospitalesComponent;
  let fixture: ComponentFixture<EpsHospitalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpsHospitalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpsHospitalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
