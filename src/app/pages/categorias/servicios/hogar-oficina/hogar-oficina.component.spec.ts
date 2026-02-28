import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HogarOficinaComponent } from './hogar-oficina.component';

describe('HogarOficinaComponent', () => {
  let component: HogarOficinaComponent;
  let fixture: ComponentFixture<HogarOficinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HogarOficinaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HogarOficinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
