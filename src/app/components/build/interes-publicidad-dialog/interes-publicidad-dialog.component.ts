import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

export interface InteresData {
  categoria: string;
  espacio: string;
}

@Component({
  selector: 'app-interes-publicidad-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule
  ],
  templateUrl: './interes-publicidad-dialog.component.html',
  styleUrl: './interes-publicidad-dialog.component.css'
})
export class InteresPublicidadDialogComponent implements OnInit {
  
  private firestore = getFirestore(getApp());
  leadForm: FormGroup;
  userLat: number | null = null;
  userLng: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<InteresPublicidadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InteresData,
    private fb: FormBuilder
  ) {
    this.leadForm = this.fb.group({
      nombreEmpresa: ['', Validators.required],
      nombreContacto: ['', Validators.required],
      correoCorporativo: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.detectarUbicacionUsuario();
  }

  detectarUbicacionUsuario() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLat = position.coords.latitude;
          this.userLng = position.coords.longitude;
        },
        (error) => {
          console.warn('Geolocalización denegada o fallida en lead de sponsor', error);
        },
        { timeout: 10000 }
      );
    }
  }

  async contactarWhatsApp() {
    if (this.leadForm.invalid) {
      this.leadForm.markAllAsTouched();
      return;
    }

    const { nombreEmpresa, nombreContacto, correoCorporativo } = this.leadForm.value;
    const telefonoAdmin = '573242380090'; 
    const mensaje = `Hola Directorio Paisa, soy *${nombreContacto}* de la empresa *${nombreEmpresa}*. Estoy interesado en ser Sponsor en el espacio "${this.data.espacio}" del directorio "${this.data.categoria}". Mi correo es: ${correoCorporativo}. ¿Me podrían dar información?`;
    
    // Generar fecha y hora
    const now = new Date();
    const timeString = new Intl.DateTimeFormat('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true }).format(now);
    let dateString = new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }).format(now);
    dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1); // Capitalizar

    // Guardar solicitud en Firestore
    try {
      const colRef = collection(this.firestore, 'solicitudSponsor');
      await addDoc(colRef, {
        categoria: this.data.categoria,
        espacio: this.data.espacio,
        nombreEmpresa,
        nombreContacto,
        correoCorporativo,
        fechaISO: now.toISOString(),
        fechaYDia: dateString,
        hora: timeString,
        latitud: this.userLat,
        longitud: this.userLng,
        estado: 'pendiente'
      });
    } catch (e) {
      console.error('Error guardando solicitud de sponsor', e);
    }

    const url = `https://wa.me/${telefonoAdmin}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    this.dialogRef.close();
  }

  cerrar() {
    this.dialogRef.close();
  }
}
