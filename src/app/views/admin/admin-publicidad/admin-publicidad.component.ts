import { Component, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PublicidadService } from '../../../core/services/publicidad.service';
import { categoriaData } from '../../../data/categoriasData';
import { BannerInterface } from '../../../components/build/carrusel/carrusel.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-publicidad',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatIconModule, MatSnackBarModule],
  templateUrl: './admin-publicidad.component.html',
  styleUrl: './admin-publicidad.component.css'
})
export class AdminPublicidadComponent {
  private publicidadService = inject(PublicidadService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  categoriasDisponibles = categoriaData.map(c => c.ruta);
  
  categoriaSeleccionada = signal<string>('');
  banners = signal<BannerInterface[]>([]);
  isSaving = signal<boolean>(false);
  archivosPendientes = signal<File[]>([]);

  constructor() {
    effect(() => {
      const cat = this.categoriaSeleccionada();
      if (cat) {
        this.cargarBanners(cat);
      }
    });
  }

  async cargarBanners(categoriaId: string) {
    const data = await this.publicidadService.obtenerBanners(categoriaId);
    this.banners.set([...data]);
    this.archivosPendientes.set([null as any, null as any, null as any]);
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const current = [...this.archivosPendientes()];
      current[index] = file;
      this.archivosPendientes.set(current);
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const bannersActuales = [...this.banners()];
        bannersActuales[index].image = e.target.result;
        this.banners.set(bannersActuales);
      };
      reader.readAsDataURL(file);
    }
  }

  async guardarBanner(index: number) {
    if (this.isSaving()) return;
    this.isSaving.set(true);

    try {
      const catId = this.categoriaSeleccionada();
      const banner = this.banners()[index];
      const file = this.archivosPendientes()[index] || null;

      await this.publicidadService.guardarBanner(
        catId, 
        index, 
        file, 
        banner.patrocinador || '', 
        banner.whatsapp, 
        banner.phoneFijo
      );
      
      this.snackBar.open('Publicidad guardada con éxito', 'Cerrar', { duration: 3000 });
      const current = [...this.archivosPendientes()];
      current[index] = null as any;
      this.archivosPendientes.set(current);
      
    } catch (error) {
      console.error(error);
      this.snackBar.open('Error al guardar', 'Cerrar', { duration: 3000 });
    } finally {
      this.isSaving.set(false);
    }
  }

  async eliminarBanner(index: number) {
    if (confirm('¿Estás seguro de eliminar este banner?')) {
      const catId = this.categoriaSeleccionada();
      await this.publicidadService.eliminarBanner(catId, index);
      await this.cargarBanners(catId);
      this.snackBar.open('Publicidad eliminada', 'Cerrar', { duration: 3000 });
    }
  }

  volver() {
    this.router.navigate(['/']);
  }
}
