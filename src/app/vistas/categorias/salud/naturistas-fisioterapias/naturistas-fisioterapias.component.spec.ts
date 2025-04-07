import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaturistasFisioterapiasComponent } from './naturistas-fisioterapias.component';

describe('NaturistasFisioterapiasComponent', () => {
  let component: NaturistasFisioterapiasComponent;
  let fixture: ComponentFixture<NaturistasFisioterapiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NaturistasFisioterapiasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaturistasFisioterapiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
