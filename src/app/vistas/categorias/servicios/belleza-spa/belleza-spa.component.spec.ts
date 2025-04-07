import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BellezaSpaComponent } from './belleza-spa.component';

describe('BellezaSpaComponent', () => {
  let component: BellezaSpaComponent;
  let fixture: ComponentFixture<BellezaSpaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BellezaSpaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BellezaSpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
