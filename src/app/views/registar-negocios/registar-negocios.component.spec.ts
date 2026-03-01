import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarNegociosComponent } from './registar-negocios.component';

describe('RegistarNegociosComponent', () => {
  let component: RegistarNegociosComponent;
  let fixture: ComponentFixture<RegistarNegociosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistarNegociosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistarNegociosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
