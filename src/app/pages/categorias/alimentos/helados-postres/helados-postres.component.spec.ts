import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeladosPostresComponent } from './helados-postres.component';

describe('HeladosPostresComponent', () => {
  let component: HeladosPostresComponent;
  let fixture: ComponentFixture<HeladosPostresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeladosPostresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeladosPostresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
