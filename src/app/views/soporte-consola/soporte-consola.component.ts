import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { SoporteService } from '../../core/firebase/soporte.service';

@Component({
  selector: 'app-soporte-consola',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatTabsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './soporte-consola.component.html',
  styleUrl: './soporte-consola.component.css'
})
export class SoporteConsolaComponent {

  public consolaService = inject(SoporteService);
  private formBuilder    = inject(FormBuilder);

  public formGroup = this.formBuilder.group({
    nombre:      ['', [Validators.required]],
    whatsapp:    ['', [Validators.required]],
    descripcion: ['', [Validators.required]]
  });

  public async buscarNegocio(termino: string) {
    // Lógica para buscar negocio en Firestore y setear consolaService.negocioSeleccionado
    // Al encontrarlo, parcheamos el formulario:
    // this.formGroup.patchValue(negocioEncontrado);
  }

  public async guardarCambios() {
    const id = this.consolaService.negocioSeleccionado().id;
    const datos = this.formGroup.value;
    
    await this.consolaService.actualizarInformacionNegocio(id, datos);
    alert('Información optimizada con éxito por el equipo interno.');
  }

}
