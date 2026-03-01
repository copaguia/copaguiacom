import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingNegocioRegistroComponent } from './onboarding-negocio-registro.component';

describe('OnboardingNegocioRegistroComponent', () => {
  let component: OnboardingNegocioRegistroComponent;
  let fixture: ComponentFixture<OnboardingNegocioRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingNegocioRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingNegocioRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
