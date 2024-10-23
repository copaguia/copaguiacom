import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaRComponent } from './categoria-r.component';

describe('CategoriaRComponent', () => {
  let component: CategoriaRComponent;
  let fixture: ComponentFixture<CategoriaRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaRComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
