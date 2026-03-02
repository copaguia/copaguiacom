import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-list-notifications',
  imports: [ CommonModule, MatDialogModule, MatListModule, MatIconModule, MatButtonModule, MatDividerModule ],
  templateUrl: './list-notifications.component.html',
  styleUrl: './list-notifications.component.css'
})
export class ListNotificationsComponent {

  private dialogRef      = inject(MatDialogRef<ListNotificationsComponent>);
  
  public notificaciones  = signal<any[]>([
    { id: '1', titulo: 'Oferta en Copacabana', cuerpo: 'Descuento del 20% en lácteos', fecha: '10:30 AM' },
    { id: '2', titulo: 'Pago Exitoso', cuerpo: 'Tu suscripción ha sido renovada', fecha: 'Ayer' }
  ]);

  cerrar(): void {
    this.dialogRef.close();
  }

  marcarComoLeida(id: string): void {
    const idNotificacion = id;
    console.log("Notificación leída:", idNotificacion);
  }

}
