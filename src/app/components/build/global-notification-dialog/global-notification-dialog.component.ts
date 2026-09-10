import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NotificacionGlobal } from '../../../interfaces/notificacion-global';
import { GlobalNotificationService } from '../../../core/services/global-notification.service';

@Component({
  selector: 'app-global-notification-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './global-notification-dialog.component.html',
  styleUrl: './global-notification-dialog.component.css'
})
export class GlobalNotificationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<GlobalNotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NotificacionGlobal,
    private notificationService: GlobalNotificationService
  ) {}

  cerrar() {
    if (this.data.id) {
      this.notificationService.marcarComoVista(this.data.id);
    }
    this.dialogRef.close();
  }
}
