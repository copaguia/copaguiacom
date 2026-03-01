import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FincasSalonesComponent } from './fincas-salones.component';

describe('FincasSalonesComponent', () => {
  let component: FincasSalonesComponent;
  let fixture: ComponentFixture<FincasSalonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FincasSalonesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FincasSalonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
