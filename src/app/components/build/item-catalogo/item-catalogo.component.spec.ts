import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCatalogoComponent } from './item-catalogo.component';

describe('ItemCatalogoComponent', () => {
  let component: ItemCatalogoComponent;
  let fixture: ComponentFixture<ItemCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemCatalogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
