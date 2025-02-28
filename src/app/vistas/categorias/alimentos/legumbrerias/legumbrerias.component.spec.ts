import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegumbreriasComponent } from './legumbrerias.component';

describe('LegumbreriasComponent', () => {
  let component: LegumbreriasComponent;
  let fixture: ComponentFixture<LegumbreriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegumbreriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegumbreriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
