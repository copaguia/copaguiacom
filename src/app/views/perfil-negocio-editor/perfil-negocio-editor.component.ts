import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Router } from '@angular/router';

// L10: Arquitectura Lidertech
import { InstanciaFirebase } from '../../core/firebase/instancias.service';
import { NegocioVerificationService } from '../../core/auth/negocio-verification.service'; // <-- NUEVO SERVICIO
import { NegocioInterface, TipoNegocio } from '../../interfaces/negocio-interface';

// L10: Componentes de UI reutilizables
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-perfil-negocio-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './perfil-negocio-editor.component.html',
  styleUrls: ['./perfil-negocio-editor.component.css']
})
export class PerfilNegocioEditorComponent implements OnInit {

  private formBuilder     = inject(FormBuilder);
  private snackBar        = inject(MatSnackBar);
  private firestore       = inject(InstanciaFirebase).firestore;
  private router          = inject(Router);
  public negocioService = inject(NegocioVerificationService); // <-- INYECTAMOS EL SERVICIO

  public estaCargando = signal<boolean>(false);
  
  public tiposDeNegocio = Object.values(TipoNegocio);

  public formGroup = this.formBuilder.group({
    logo:        ['', [Validators.required]],
    banner:      ['', [Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(20)]],
    whatsapp:    ['', [Validators.required]],
    instagram:   [''],
    nombre:      ['', [Validators.required]],
    direccion:   ['', [Validators.required]],
    telefono:    ['', [Validators.required]],
    tipoNegocio: ['', [Validators.required]],
    facebook:    ['']
  });

  constructor() {
    // Usamos effect para reaccionar a los cambios en el servicio de verificación
    effect(() => {
      const estaVerificando = this.negocioService.estaVerificando();
      if (!estaVerificando) {
        const tieneNegocio = this.negocioService.tieneNegocio();
        if (tieneNegocio) {
          this.cargarDatosDelNegocio();
        } else {
          this.snackBar.open('Primero debes registrar tu negocio.', 'Ok', { duration: 5000 });
          this.router.navigate(['/onboarding-negocio-registro']);
        }
      }
    });
  }

  ngOnInit() { 
    // ngOnInit ahora puede estar más limpio o usarse para otras inicializaciones
    this.estaCargando.set(this.negocioService.estaVerificando());
  }

  async cargarDatosDelNegocio() {
    this.estaCargando.set(true);
    const negocioId = this.negocioService.negocioId();
    if (!negocioId) return; // Salvaguarda

    const negocioRef = doc(this.firestore, 'negocios', negocioId);
    const negocioSnap = await getDoc(negocioRef);

    if (negocioSnap.exists()) {
      const negocioData = negocioSnap.data() as NegocioInterface;
      this.formGroup.patchValue({
        logo:        negocioData.logo,
        banner:      negocioData.banner,
        descripcion: negocioData.descripcion,
        whatsapp:    negocioData.contacto.whatsapp,
        instagram:   negocioData.contacto.redes?.instagram || '',
        nombre:      negocioData.nombre,
        direccion:   negocioData.contacto.direccion,
        telefono:    negocioData.contacto.telefono,
        tipoNegocio: negocioData.tipoNegocio,
        facebook:    negocioData.contacto.redes?.facebook || ''
      });
    } else {
      // Esto no debería ocurrir si la lógica del servicio es correcta, pero es una buena salvaguarda
      this.snackBar.open('Error: No se encontraron los datos del negocio.', 'Cerrar', { duration: 5000 });
      this.router.navigate(['/onboarding-negocio-registro']);
    }
    this.estaCargando.set(false);
  }

  async actualizarDatos() {
    if (this.formGroup.invalid) {
      this.snackBar.open('El formulario no es válido. Revisa los campos.', 'Cerrar', { duration: 3000 });
      return;
    }

    const negocioId = this.negocioService.negocioId();
    if (!negocioId) {
        this.snackBar.open('No se ha podido identificar el negocio a actualizar.', 'Cerrar', { duration: 5000 });
        return;
    }

    this.estaCargando.set(true);
    const negocioRef = doc(this.firestore, `negocios/${negocioId}`);
    
    const nuevosDatos = {
      logo:        this.formGroup.value.logo,
      banner:      this.formGroup.value.banner,
      descripcion: this.formGroup.value.descripcion,
      nombre:      this.formGroup.value.nombre,
      tipoNegocio: this.formGroup.value.tipoNegocio,
      'contacto.whatsapp': this.formGroup.value.whatsapp,
      'contacto.telefono': this.formGroup.value.telefono,
      'contacto.direccion': this.formGroup.value.direccion,
      'contacto.redes.instagram': this.formGroup.value.instagram,
      'contacto.redes.facebook': this.formGroup.value.facebook
    };

    try {
      await updateDoc(negocioRef, nuevosDatos);
      this.snackBar.open('¡Información actualizada con éxito!', 'Ok', { duration: 3000 });
    } catch (error) {
      console.error('Error al actualizar:', error);
      this.snackBar.open('Hubo un error al actualizar los datos.', 'Cerrar', { duration: 5000 });
    } finally {
      this.estaCargando.set(false);
    }
  }
}
