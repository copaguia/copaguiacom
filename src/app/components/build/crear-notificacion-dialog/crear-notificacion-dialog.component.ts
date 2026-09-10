import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { GlobalNotificationService } from '../../../core/services/global-notification.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-crear-notificacion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './crear-notificacion-dialog.component.html',
  styleUrl: './crear-notificacion-dialog.component.css'
})
export class CrearNotificacionDialogComponent {
  private fb = inject(FormBuilder);
  private notificationService = inject(GlobalNotificationService);
  private dialogRef = inject(MatDialogRef<CrearNotificacionDialogComponent>);
  private snackbar = inject(SnackbarService);

  form: FormGroup;
  archivoSeleccionado: File | null = null;
  vistaPreviaUrl: string | null = null;
  cargando = false;

  constructor() {
    this.form = this.fb.group({
      titulo: ['', [Validators.required]],
      mensaje: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      fechaCaducidad: ['', [Validators.required]]
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      // Crear previsualización
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.vistaPreviaUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removerImagen() {
    this.archivoSeleccionado = null;
    this.vistaPreviaUrl = null;
  }

  async crearNotificacion() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;
    try {
      const datos = {
        titulo: this.form.value.titulo,
        mensaje: this.form.value.mensaje,
        tipo: this.form.value.tipo,
        fechaCaducidad: new Date(this.form.value.fechaCaducidad).toISOString()
      };

      await this.notificationService.crearNotificacionGlobal(datos, this.archivoSeleccionado || undefined);
      
      this.snackbar.mostrar('Notificación global creada y enviada', 'Genial');
      this.dialogRef.close(true);
    } catch (error) {
      this.snackbar.mostrar('Error al crear la notificación', 'Cerrar');
    } finally {
      this.cargando = false;
    }
  }
}
