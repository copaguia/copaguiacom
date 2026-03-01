import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaDeSolComponent } from './dia-de-sol.component';

describe('DiaDeSolComponent', () => {
  let component: DiaDeSolComponent;
  let fixture: ComponentFixture<DiaDeSolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiaDeSolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiaDeSolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
