import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ListNotificationsComponent } from './list-notifications/list-notifications.component';
import {MatBadgeModule} from '@angular/material/badge';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuscriptionNotificationService } from '../../../core/firebase/messaging/suscription-notification.service.service';
import { InstanciaFirebase } from '../../../core/firebase/instancias.service';

@Component({
  selector: 'app-btn-notifications',
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, MatBadgeModule ],
  templateUrl: './btn-notifications.component.html',
  styleUrl: './btn-notifications.component.css'
})
export class BtnNotificationsComponent implements OnInit {

  private snackBar           = inject(MatSnackBar);
  private dialog             = inject(MatDialog);
  private suscriptionService = inject(SuscriptionNotificationService);
  private firebaseAuth       = inject(InstanciaFirebase).auth;

  public permisoActivado     = signal<boolean>(false);
  
  // Vinculamos el contador directamente al Signal del servicio
  public notificacionesCount = computed(() => this.suscriptionService.contadorUnread());

  constructor() {
    effect(() => {
      const estaSuscrito     = this.permisoActivado();
      
      // L10: Solo invitamos si no tiene el permiso concedido
      if (!estaSuscrito) {
        this.lanzarInvitacionSuscripcion();
      }
    });
  }

  ngOnInit(): void {
    const estadoNativo       = Notification.permission;
    const concedido          = 'granted';
    
    this.permisoActivado.set(estadoNativo === concedido);

    // Iniciamos la escucha de Firestore si hay un usuario
    const usuarioActual      = this.firebaseAuth.currentUser;
    if (usuarioActual) {
      this.suscriptionService.escucharNotificaciones(usuarioActual.uid);
    }
  }

  private lanzarInvitacionSuscripcion(): void {
    const mensaje            = "🔔 ¡Activa las notificaciones para recibir ofertas exclusivas!";
    const accion             = "ACTIVAR";

    const snackRef           = this.snackBar.open(mensaje, accion, {
      duration               : 8000,
      horizontalPosition     : 'center',
      verticalPosition       : 'bottom'
    });

    snackRef.onAction().subscribe(() => {
      this.abrirCentroNotificaciones();
    });
  }

  abrirCentroNotificaciones(): void {
    const configModal        = {
      width                  : '100vw',
      height                 : '100vh',
      maxWidth               : '100vw',
      panelClass             : 'lidertech-modal-full'
    };

    this.dialog.open(ListNotificationsComponent, configModal);
  }

}
