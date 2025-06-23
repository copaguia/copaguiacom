import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupAdminComponent } from './setup-admin.component';

describe('SetupAdminComponent', () => {
  let component: SetupAdminComponent;
  let fixture: ComponentFixture<SetupAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
