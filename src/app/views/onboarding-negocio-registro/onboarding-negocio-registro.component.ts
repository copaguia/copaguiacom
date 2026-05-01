
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

// Importamos la fuente de datos UNIFICADA y ENRIQUECIDA
import { categoriaData } from '../../data/categoriasData';
import { RolUsuario } from '../../core/auth/rol-usuario';

@Component({
  selector: 'app-onboarding-negocio-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule],
  templateUrl: './onboarding-negocio-registro.component.html',
  styleUrl: './onboarding-negocio-registro.component.css'
})
export class OnboardingNegocioRegistroComponent {

  private formBuilder    = inject(FormBuilder);
  private auth           = getAuth();
  private firestore      = getFirestore();
  
  // Usamos la fuente de datos unificada
  public categorias      = categoriaData;
  public estaProcesando  = signal(false);

  public formGroupUsuario = this.formBuilder.group({
    nombre:   ['', [Validators.required]],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // El formulario ahora manejará la categoría principal (ruta) y la sub-categoría (seccion)
  public formGroupNegocio = this.formBuilder.group({
    nombreNegocio: ['', [Validators.required]],
    categoria:     ['', [Validators.required]], // <- Corresponderá a la 'ruta' de la categoría principal
    subcategoria:  ['', [Validators.required]], // <- Corresponderá a la 'ruta' de la seccion
    whatsapp:      ['', [Validators.required]]
  });

  // Cuando se selecciona una categoría principal, filtramos las sub-categorías (secciones)
  get subcategoriasDisponibles() {
    const categoriaRuta = this.formGroupNegocio.get('categoria')?.value;
    if (!categoriaRuta) return [];
    const categoriaEncontrada = this.categorias.find(c => c.ruta === categoriaRuta);
    return categoriaEncontrada?.seccion || [];
  }


  public async finalizarRegistro() {
    if (this.formGroupUsuario.invalid || this.formGroupNegocio.invalid) return;

    this.estaProcesando.set(true);
    const { email, password, nombre } = this.formGroupUsuario.value;
    // Capturamos la categoría y subcategoría del formulario
    const { nombreNegocio, categoria, subcategoria, whatsapp } = this.formGroupNegocio.value;

    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(this.auth, email!, password!);
      const uid = userCredential.user.uid;

      // 2. Crear perfil de usuario en Firestore
      await setDoc(doc(this.firestore, `usuarios/${uid}`), {
        id:            uid,
        nombreUsuario: nombre,
        email:         email,
        rolUsuario:    RolUsuario.ADMIN,
        fechaCreacion: new Date().toISOString()
      });

      // 3. Crear el documento del negocio
      const slug = nombreNegocio!.toLowerCase().replace(/ /g, '-');
      await addDoc(collection(this.firestore, 'negocios'), {
        duenoId:       uid,
        nombre:        nombreNegocio,
        slug:          slug,
        categoria:     categoria,    // Guardamos la 'ruta' de la categoría principal
        subcategoria:  subcategoria, // Guardamos la 'ruta' de la seccion
        contacto:      { whatsapp },
        verificado:    false,
        catalogo:      [],
        fechaRegistro: new Date().toISOString()
      });

      // TODO: Redirigir al dashboard del negocio o a una página de éxito

    } catch (error) {
      console.error('Error en el registro:', error);
    } finally {
      this.estaProcesando.set(false);
    }
  }
}
