import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRComponent } from './card-r.component';

describe('CardRComponent', () => {
  let component: CardRComponent;
  let fixture: ComponentFixture<CardRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardRComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
