import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolBarPageComponent } from './tool-bar-page.component';

describe('ToolBarPageComponent', () => {
  let component: ToolBarPageComponent;
  let fixture: ComponentFixture<ToolBarPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolBarPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolBarPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
