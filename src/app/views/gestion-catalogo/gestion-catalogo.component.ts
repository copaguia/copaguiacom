import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCard } from "@angular/material/card";

@Component({
  selector: 'app-gestion-catalogo',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCard],
  templateUrl: './gestion-catalogo.component.html',
  styleUrl: './gestion-catalogo.component.css'
})
export class GestionCatalogoComponent {

  private formBuilder = inject(FormBuilder);
  
  public mostrarFormulario = signal(false);
  public datosCatalogo     = signal<any[]>([]); // Se llenaría del estado global
  public columnas          = ['nombre', 'precio', 'acciones'];

  public formGroup = this.formBuilder.group({
    nombre:        ['', [Validators.required]],
    precio:        [0, [Validators.required, Validators.min(0)]],
    descripcion:   [''],
    categoriaItem: ['', [Validators.required]],
    disponible:    [true]
  });

  public abrirFormulario() {
    this.formGroup.reset({ disponible: true });
    this.mostrarFormulario.set(true);
  }

  public async guardar() {
    if (this.formGroup.valid) {
      const nuevoProducto = this.formGroup.value;
      // Aquí llamarías al servicio: await this.adminService.agregarProducto(id, nuevoProducto);
      this.mostrarFormulario.set(false);
    }
  }

  public borrar(producto: any) {
    // Lógica para confirmar y eliminar
  }

}
