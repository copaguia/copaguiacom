import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilNegocioEditorComponent } from './perfil-negocio-editor.component';

describe('PerfilNegocioEditorComponent', () => {
  let component: PerfilNegocioEditorComponent;
  let fixture: ComponentFixture<PerfilNegocioEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilNegocioEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilNegocioEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
