import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { InstanciaFirebase } from '../../../core/firebase/instancias.service';
import { NegocioInterface } from '../../../interfaces/negocio-interface';

// Importamos la fuente de datos unificada y sus interfaces
import { categoriaData, SeccionInterface } from '../../../data/categoriasData';

@Component({
  selector: 'app-agregar-negocio',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './agregar-negocio.component.html',
  styleUrls: ['./agregar-negocio.component.css']
})
export class AgregarNegocioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private firestore = inject(InstanciaFirebase).firestore;

  negocioForm!: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  // Usamos la fuente de datos unificada
  categorias = categoriaData;
  seccionesDisponibles: SeccionInterface[] = []; // Se mantiene el nombre original

  ngOnInit() {
    this.negocioForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      seccion: ['', Validators.required], // Se revierte a 'seccion'
      imagen: [''],
      logo: [''],
      banner: [''],
      verificado: [false],
      destacado: [false],
      activo: [true],
      contacto: this.fb.group({
        whatsapp: [''],
        telefono: [''],
        direccion: [''],
        email: ['', Validators.email]
      }),
      ubicacion: this.fb.group({
        direccion: [''],
        barrio: [''],
        latitud: [0],
        longitud: [0]
      }),
    });

    // Lógica para actualizar las secciones disponibles
    this.negocioForm.get('categoria')?.valueChanges.subscribe(categoriaRuta => {
      const categoriaSeleccionada = this.categorias.find(c => c.ruta === categoriaRuta);
      this.seccionesDisponibles = categoriaSeleccionada?.seccion || [];
      this.negocioForm.get('seccion')?.setValue(''); // Se limpia el campo 'seccion'
    });
  }

  async onSubmit() {
    if (this.negocioForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      this.errorMessage = 'Debes estar autenticado para agregar un negocio.';
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    try {
      const formValue = this.negocioForm.value;
      const imagenUrl = formValue.imagen || 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png';

      const nuevoNegocio: Partial<NegocioInterface> = {
        ...formValue,
        duenoId: user.uid, 
        imagen: imagenUrl,
        activo: formValue.activo,
        fechaRegistro: new Date().toISOString(),
        rating: 0,
        totalResenas: 0
      };
      
      const docRef = await addDoc(collection(this.firestore, 'negocios'), nuevoNegocio);
      
      this.successMessage = `¡Negocio "${formValue.nombre}" agregado con éxito! ID: ${docRef.id}`;
      this.negocioForm.reset();
      this.negocioForm.patchValue({ activo: true });
      
    } catch (error) {
      console.error('Error al agregar el negocio:', error);
      this.errorMessage = 'Ocurrió un error al guardar el negocio. Revisa los permisos o inténtalo de nuevo.';
    } finally {
      this.isLoading = false;
    }
  }
}
