import { Component, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PublicidadService } from '../../../core/services/publicidad.service';
import { categoriaData } from '../../../data/categoriasData';
import { BannerInterface } from '../../../components/build/carrusel/carrusel.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-publicidad',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatIconModule, MatSnackBarModule, MatRadioModule],
  templateUrl: './admin-publicidad.component.html',
  styleUrl: './admin-publicidad.component.css'
})
export class AdminPublicidadComponent {
  private publicidadService = inject(PublicidadService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  categoriasDisponibles = categoriaData.map(c => c.ruta);
  
  categoriaSeleccionada = signal<string>('');
  tipoAnuncio = signal<'carrusel' | 'toolbar'>('carrusel');
  banners = signal<BannerInterface[]>([]);
  toolbarBanner = signal<BannerInterface | null>(null);
  isSaving = signal<boolean>(false);
  archivosPendientes = signal<File[]>([]);
  archivoToolbarPendiente = signal<File | null>(null);

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
    
    const toolbarData = await this.publicidadService.obtenerToolbarAd(categoriaId);
    this.toolbarBanner.set(toolbarData);
    this.archivoToolbarPendiente.set(null);
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      if (this.tipoAnuncio() === 'carrusel') {
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
      } else {
        this.archivoToolbarPendiente.set(file);
        
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const bannerActual = this.toolbarBanner() || { id: 'toolbar', image: '', patrocinador: '' };
          this.toolbarBanner.set({ ...bannerActual, image: e.target.result });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  async guardarBanner(index: number = 0) {
    if (this.isSaving()) return;
    this.isSaving.set(true);

    try {
      const catId = this.categoriaSeleccionada();
      
      if (this.tipoAnuncio() === 'carrusel') {
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
        const current = [...this.archivosPendientes()];
        current[index] = null as any;
        this.archivosPendientes.set(current);
      } else {
        const banner = this.toolbarBanner();
        const file = this.archivoToolbarPendiente();
        
        await this.publicidadService.guardarToolbarAd(
          catId,
          file,
          banner?.patrocinador || '',
          banner?.whatsapp,
          banner?.phoneFijo
        );
        this.archivoToolbarPendiente.set(null);
      }
      
      this.snackBar.open('Publicidad guardada con éxito', 'Cerrar', { duration: 3000 });
      
    } catch (error) {
      console.error(error);
      this.snackBar.open('Error al guardar', 'Cerrar', { duration: 3000 });
    } finally {
      this.isSaving.set(false);
    }
  }

  async eliminarBanner(index: number = 0) {
    if (confirm('¿Estás seguro de eliminar este banner?')) {
      const catId = this.categoriaSeleccionada();
      
      if (this.tipoAnuncio() === 'carrusel') {
        await this.publicidadService.eliminarBanner(catId, index);
      } else {
        await this.publicidadService.eliminarToolbarAd(catId);
      }
      
      await this.cargarBanners(catId);
      this.snackBar.open('Publicidad eliminada', 'Cerrar', { duration: 3000 });
    }
  }

  volver() {
    this.router.navigate(['/']);
  }
}
