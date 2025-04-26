import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnShareComponent } from './btn-share.component';

describe('BtnShareComponent', () => {
  let component: BtnShareComponent;
  let fixture: ComponentFixture<BtnShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnShareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
