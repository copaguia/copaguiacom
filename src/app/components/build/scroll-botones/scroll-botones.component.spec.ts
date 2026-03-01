import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollBotonesComponent } from './scroll-botones.component';

describe('ScrollBotonesComponent', () => {
  let component: ScrollBotonesComponent;
  let fixture: ComponentFixture<ScrollBotonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollBotonesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollBotonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
