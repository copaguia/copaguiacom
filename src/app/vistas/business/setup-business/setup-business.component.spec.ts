import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupBusinessComponent } from './setup-business.component';

describe('SetupBusinessComponent', () => {
  let component: SetupBusinessComponent;
  let fixture: ComponentFixture<SetupBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupBusinessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
