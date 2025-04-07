import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CafeteriasPanaderiasComponent } from './cafeterias-panaderias.component';

describe('CafeteriasPanaderiasComponent', () => {
  let component: CafeteriasPanaderiasComponent;
  let fixture: ComponentFixture<CafeteriasPanaderiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CafeteriasPanaderiasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CafeteriasPanaderiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
