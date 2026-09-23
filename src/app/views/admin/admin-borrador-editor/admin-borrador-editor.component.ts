import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';

// L10: Arquitectura Lidertech
import { AdminBorradorService } from '../../../core/services/admin-borrador.service';
import { AuthorizationService } from '../../../core/auth/authorization.service';
import { AuthService } from '../../../core/auth/auth.service';
import { NegocioInterface } from '../../../interfaces/negocio-interface';

// L10: Componentes de UI reutilizables
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-admin-borrador-editor',
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
  templateUrl: './admin-borrador-editor.component.html',
  styleUrls: ['./admin-borrador-editor.component.css']
})
export class AdminBorradorEditorComponent implements OnInit {

  private formBuilder     = inject(FormBuilder);
  private snackBar        = inject(MatSnackBar);
  private router          = inject(Router);
  private route           = inject(ActivatedRoute);
  private adminBorradorService = inject(AdminBorradorService);
  private authorization   = inject(AuthorizationService);
  private authService     = inject(AuthService);

  public estaCargando = signal<boolean>(false);
  private borradorId = signal<string | null>(null);
  
  public categoriasAllowed = ['Alimentos', 'Comercios', 'Servicios', 'Entretenimiento', 'Salud', 'Comunidad', 'Oportunidades', 'Inmuebles', 'Educación', 'Pasatiempos', 'Noticias'];

  public formGroup = this.formBuilder.group({
    logo:        [''],
    banner:      [''],
    descripcion: [''],
    whatsapp:    [''],
    instagram:   [''],
    nombre:      ['', [Validators.required]],
    seccion:     [''],
    direccion:   [''],
    telefono:    [''],
    categoria:   ['', [Validators.required]],
    facebook:    ['']
  });

  ngOnInit() {
    if (!this.authorization.esAdmin() && !this.authorization.esAgente() && !this.authorization.esDev()) {
      this.router.navigate(['/']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.borradorId.set(id);
      this.cargarDatos(id);
    } else {
      this.snackBar.open('ID de borrador no proporcionado', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/admin/data-borrador']);
    }
  }

  async cargarDatos(id: string) {
    this.estaCargando.set(true);
    try {
      const data = await this.adminBorradorService.obtenerBorrador(id);
      if (data) {
        this.formGroup.patchValue({
          logo:        data.logo || '',
          banner:      data.banner || '',
          descripcion: data.descripcion || '',
          whatsapp:    data.contacto?.whatsapp || '',
          instagram:   data.contacto?.redes?.instagram || '',
          nombre:      data.nombre || '',
          seccion:     data.seccion || '',
          direccion:   data.ubicacion?.direccion || data.contacto?.direccion || '',
          telefono:    data.contacto?.telefono || '',
          categoria:   data.categoria || '',
          facebook:    data.contacto?.redes?.facebook || ''
        });
      } else {
        this.snackBar.open('Borrador no encontrado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/admin/data-borrador']);
      }
    } catch (error) {
      this.snackBar.open('Error al cargar borrador', 'Cerrar', { duration: 3000 });
    } finally {
      this.estaCargando.set(false);
    }
  }

  async aprobarDatos() {
    if (this.formGroup.invalid) {
      this.snackBar.open('Formulario inválido', 'Cerrar', { duration: 3000 });
      return;
    }

    const id = this.borradorId();
    if (!id) return;

    this.estaCargando.set(true);
    
    // Preparar el payload reconstruyendo la interfaz original de negocio
    const values = this.formGroup.value;
    const negocioValidado: Partial<NegocioInterface> = {
      nombre: values.nombre || '',
      categoria: values.categoria as NegocioInterface['categoria'],
      seccion: values.seccion || '',
      descripcion: values.descripcion || '',
      logo: values.logo || '',
      banner: values.banner || '',
      contacto: {
        direccion: values.direccion || '',
        telefono: values.telefono || '',
        whatsapp: values.whatsapp || '',
        email: '',
        redes: {
          instagram: values.instagram || '',
          facebook: values.facebook || ''
        }
      },
      ubicacion: {
        direccion: values.direccion || '',
        barrio: '',
        ciudad: '',
        latitud: 0,
        longitud: 0,
        googleMapsUrl: ''
      },
      verificado: false,
      metadatos: { origen: 'revision_manual_admin' }
    };

    const usuario = this.authService.usuarioLectura();
    const adminAprobador = {
      uid: usuario?.uid || 'desconocido',
      email: usuario?.email || 'desconocido'
    };

    try {
      await this.adminBorradorService.aprobarBorrador(id, negocioValidado, adminAprobador);
      this.snackBar.open('Negocio aprobado y publicado', 'OK', { duration: 3000 });
      this.router.navigate(['/admin/data-borrador']);
    } catch (error) {
      console.error(error);
      this.snackBar.open('Error al aprobar el negocio', 'Cerrar', { duration: 3000 });
    } finally {
      this.estaCargando.set(false);
    }
  }

  cancelar() {
    this.router.navigate(['/admin/data-borrador']);
  }
}
