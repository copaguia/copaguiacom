import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessFeedComponent } from './business-feed.component';

describe('BusinessFeedComponent', () => {
  let component: BusinessFeedComponent;
  let fixture: ComponentFixture<BusinessFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessFeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
