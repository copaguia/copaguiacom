import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FerreteriasAgropecuariasComponent } from './ferreterias-agropecuarias.component';

describe('FerreteriasAgropecuariasComponent', () => {
  let component: FerreteriasAgropecuariasComponent;
  let fixture: ComponentFixture<FerreteriasAgropecuariasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FerreteriasAgropecuariasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FerreteriasAgropecuariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
