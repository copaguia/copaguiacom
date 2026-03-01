import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlaceGlobalComponent } from './market-place-global.component';

describe('MarketPlaceGlobalComponent', () => {
  let component: MarketPlaceGlobalComponent;
  let fixture: ComponentFixture<MarketPlaceGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketPlaceGlobalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketPlaceGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
