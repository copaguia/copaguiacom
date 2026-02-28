import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { addDoc, collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { CATEGORIAS_NEGOCIOS } from '../../data/categorias-negocios';
import { RolUsuario } from '../../core/auth/rol-usuario';

@Component({
  selector: 'app-onboarding-negocio-registro',
  imports: [CommonModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule],
  templateUrl: './onboarding-negocio-registro.component.html',
  styleUrl: './onboarding-negocio-registro.component.css'
})
export class OnboardingNegocioRegistroComponent {

  private formBuilder    = inject(FormBuilder);
  private auth           = getAuth();
  private firestore      = getFirestore();
  
  public categorias      = CATEGORIAS_NEGOCIOS;
  public estaProcesando  = signal(false);

  public formGroupUsuario = this.formBuilder.group({
    nombre:   ['', [Validators.required]],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  public formGroupNegocio = this.formBuilder.group({
    nombreNegocio: ['', [Validators.required]],
    categoria:     ['', [Validators.required]],
    whatsapp:      ['', [Validators.required]]
  });

  public async finalizarRegistro() {
    if (this.formGroupUsuario.invalid || this.formGroupNegocio.invalid) return;

    this.estaProcesando.set(true);
    const { email, password, nombre } = this.formGroupUsuario.value;
    const { nombreNegocio, categoria, whatsapp } = this.formGroupNegocio.value;

    try {
      // 1. Crear Usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(this.auth, email!, password!);
      const uid = userCredential.user.uid;

      // 2. Crear Perfil en Firestore
      await setDoc(doc(this.firestore, `usuarios/${uid}`), {
        id:            uid,
        nombreUsuario: nombre,
        email:         email,
        rolUsuario:    RolUsuario.ADMIN, // Le damos rol de admin de su propio negocio
        fechaCreacion: new Date().toISOString()
      });

      // 3. Crear Documento del Negocio Inicial
      const slug = nombreNegocio!.toLowerCase().replace(/ /g, '-');
      await addDoc(collection(this.firestore, 'negocios'), {
        duenoId:      uid,
        nombre:       nombreNegocio,
        slug:         slug,
        categoria:    categoria,
        contacto:     { whatsapp },
        verificado:   false,
        catalogo:     [],
        fechaRegistro: new Date().toISOString()
      });

      // Redirigir al Dashboard
    } catch (error) {
      console.error('Error en onboarding:', error);
    } finally {
      this.estaProcesando.set(false);
    }
  }


}
