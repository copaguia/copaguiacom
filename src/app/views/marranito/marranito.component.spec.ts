import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarranitoComponent } from './marranito.component';

describe('MarranitoComponent', () => {
  let component: MarranitoComponent;
  let fixture: ComponentFixture<MarranitoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarranitoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarranitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
