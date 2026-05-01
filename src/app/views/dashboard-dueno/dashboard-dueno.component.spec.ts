import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDuenoComponent } from './dashboard-dueno.component';

describe('DashboardDuenoComponent', () => {
  let component: DashboardDuenoComponent;
  let fixture: ComponentFixture<DashboardDuenoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDuenoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardDuenoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
