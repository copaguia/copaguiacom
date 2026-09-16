import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SistemaPautasComponent } from './sistema-pautas.component';

describe('SistemaPautasComponent', () => {
  let component: SistemaPautasComponent;
  let fixture: ComponentFixture<SistemaPautasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SistemaPautasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SistemaPautasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
