import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CosmeticcosComponent } from './cosmeticcos.component';

describe('CosmeticcosComponent', () => {
  let component: CosmeticcosComponent;
  let fixture: ComponentFixture<CosmeticcosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CosmeticcosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CosmeticcosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
