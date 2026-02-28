import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrogueriasOpticasComponent } from './droguerias-opticas.component';

describe('DrogueriasOpticasComponent', () => {
  let component: DrogueriasOpticasComponent;
  let fixture: ComponentFixture<DrogueriasOpticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrogueriasOpticasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrogueriasOpticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
