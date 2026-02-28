import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { doc, updateDoc, query, collection, where, getDocs } from 'firebase/firestore';

// L10: Arquitectura Lidertech
import { InstanciaFirebase } from '../../core/firebase/instancias.service';
import { AuthService } from '../../core/auth/auth.service';
import { NegocioInterface } from '../../interfaces/negocio-interface';
import { RolUsuario } from '../../core/auth/rol-usuario';

// L10: Componentes de UI reutilizables
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './perfil-negocio-editor.component.html',
  styleUrls: ['./perfil-negocio-editor.component.css']
})
export class PerfilNegocioEditorComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private snackBar    = inject(MatSnackBar);
  private authService = inject(AuthService);
  private firestore   = inject(InstanciaFirebase).firestore;

  public estaCargando = signal<boolean>(false);
  public negocioId    = signal<string | undefined>(undefined);

  public formGroup = this.formBuilder.group({
    logo:        ['', [Validators.required]],
    banner:      ['', [Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(20)]],
    whatsapp:    ['', [Validators.required]],
    instagram:   ['']
  });

  async ngOnInit() {
    this.estaCargando.set(true);
    const perfil = this.authService.perfilLectura();

    if (perfil && perfil.rolUsuario === RolUsuario.DUENO) {
      const uid = perfil.id;
      const q = query(collection(this.firestore, 'negocios'), where('duenoId', '==', uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const negocioDoc = querySnapshot.docs[0];
        this.negocioId.set(negocioDoc.id);
        const negocioData = negocioDoc.data() as NegocioInterface;

        this.formGroup.patchValue({
          logo:        negocioData.logo,
          banner:      negocioData.banner,
          descripcion: negocioData.descripcion,
          whatsapp:    negocioData.contacto.whatsapp,
          instagram:   negocioData.contacto.redes?.instagram || ''
        });
      } else {
        this.snackBar.open('No se encontró un negocio asociado a tu cuenta.', 'Cerrar', { duration: 5000 });
        this.formGroup.disable();
      }
    } else {
      this.snackBar.open('Acceso denegado. Debes ser dueño de un negocio para editar.', 'Cerrar', { duration: 5000 });
      this.formGroup.disable();
    }
    this.estaCargando.set(false);
  }

  async actualizarDatos() {
    if (this.formGroup.invalid) {
      this.snackBar.open('El formulario no es válido. Revisa los campos.', 'Cerrar', { duration: 3000 });
      return;
    }

    const negocioId = this.negocioId();
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
      'contacto.whatsapp': this.formGroup.value.whatsapp,
      'contacto.redes.instagram': this.formGroup.value.instagram
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