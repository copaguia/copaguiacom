import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsGalleryComponent } from './cards-gallery.component';

describe('CardsGalleryComponent', () => {
  let component: CardsGalleryComponent;
  let fixture: ComponentFixture<CardsGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
