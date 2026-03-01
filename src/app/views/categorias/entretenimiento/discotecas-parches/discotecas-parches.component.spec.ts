import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscotecasParchesComponent } from './discotecas-parches.component';

describe('DiscotecasParchesComponent', () => {
  let component: DiscotecasParchesComponent;
  let fixture: ComponentFixture<DiscotecasParchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscotecasParchesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscotecasParchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
