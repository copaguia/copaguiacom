import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosLogisticaComponent } from './eventos-logistica.component';

describe('EventosLogisticaComponent', () => {
  let component: EventosLogisticaComponent;
  let fixture: ComponentFixture<EventosLogisticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosLogisticaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventosLogisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
