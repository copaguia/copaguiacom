import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupConsumerComponent } from './setup-consumer.component';

describe('SetupConsumerComponent', () => {
  let component: SetupConsumerComponent;
  let fixture: ComponentFixture<SetupConsumerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupConsumerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupConsumerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
