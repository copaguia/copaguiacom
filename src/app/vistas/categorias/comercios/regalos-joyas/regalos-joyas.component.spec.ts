import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegalosJoyasComponent } from './regalos-joyas.component';

describe('RegalosJoyasComponent', () => {
  let component: RegalosJoyasComponent;
  let fixture: ComponentFixture<RegalosJoyasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegalosJoyasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegalosJoyasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
