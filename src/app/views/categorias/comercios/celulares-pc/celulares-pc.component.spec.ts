import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CelularesPcComponent } from './celulares-pc.component';

describe('CelularesPcComponent', () => {
  let component: CelularesPcComponent;
  let fixture: ComponentFixture<CelularesPcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CelularesPcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CelularesPcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
