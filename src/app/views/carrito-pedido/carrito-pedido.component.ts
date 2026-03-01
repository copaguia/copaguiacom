import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { PedidoService } from '../../core/internal/pedido.service.service';
import { NegocioInterface } from '../../interfaces/negocio-interface';

@Component({
  selector: 'app-carrito-pedido',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatListModule, ReactiveFormsModule],
  templateUrl: './carrito-pedido.component.html',
  styleUrl: './carrito-pedido.component.css'
})
export class CarritoPedidoComponent implements OnDestroy {

  public pedidoService = inject(PedidoService);
  private formBuilder = inject(FormBuilder);

  // El negocio debería venir por Input o de un estado global del directorio
  public negocioActual = signal<NegocioInterface | null>(null); 

  public formGroup = this.formBuilder.group({
    nombre:     ['', [Validators.required, Validators.minLength(3)]],
    direccion:  ['', [Validators.required]],
    metodoPago: ['Efectivo', [Validators.required]],
    nota:       ['']
  });

  public quitar(id: string, variante?: string): void {
    this.pedidoService.eliminarDelCarrito(id, variante);
  }

  public confirmarEnvio(): void {
    const negocio = this.negocioActual();
    if (negocio && this.formGroup.valid) {
      const valores = this.formGroup.value;
      
      this.pedidoService.cliente.set({
        nombre:     valores.nombre!,
        direccion:  valores.direccion!,
        metodoPago: valores.metodoPago!,
        nota:       valores.nota || ''
      });

      this.pedidoService.enviarPedido(negocio);
    }
  }

  ngOnDestroy(): void {
    // Implementación preventiva para fugas de memoria
  }

}
