import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PedidoService } from '../../../core/internal/pedido.service.service';

@Component({
  selector: 'app-item-catalogo',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatSelectModule, MatFormFieldModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './item-catalogo.component.html',
  styleUrl: './item-catalogo.component.css'
})
export class ItemCatalogoComponent {

  private pedidoService = inject(PedidoService);
  private formBuilder   = inject(FormBuilder);
  private snackBar      = inject(MatSnackBar);

  // Recibe el ítem del catálogo desde el componente padre
  public item = input.required<any>();

  public formGroup = this.formBuilder.group({
    cantidad: [1, [Validators.required, Validators.min(1)]],
    variante: ['']
  });

  public cambiarCantidad(valor: number): void {
    const actual = this.formGroup.value.cantidad || 1;
    const nueva  = actual + valor;
    if (nueva >= 1) {
      this.formGroup.patchValue({ cantidad: nueva });
    }
  }

  public agregar(): void {
    const { cantidad, variante } = this.formGroup.value;
    const producto = this.item();

    this.pedidoService.agregarAlCarrito(producto, cantidad!, variante || undefined);

    this.snackBar.open(`${cantidad}x ${producto.nombre} agregado`, 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });

    // Reset local
    this.formGroup.patchValue({ cantidad: 1 });
  }

}
