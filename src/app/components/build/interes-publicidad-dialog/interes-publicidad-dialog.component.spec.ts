import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteresPublicidadDialogComponent } from './interes-publicidad-dialog.component';

describe('InteresPublicidadDialogComponent', () => {
  let component: InteresPublicidadDialogComponent;
  let fixture: ComponentFixture<InteresPublicidadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteresPublicidadDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteresPublicidadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
