import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionPageComponent } from './seccion-page.component';

describe('SeccionPageComponent', () => {
  let component: SeccionPageComponent;
  let fixture: ComponentFixture<SeccionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeccionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
