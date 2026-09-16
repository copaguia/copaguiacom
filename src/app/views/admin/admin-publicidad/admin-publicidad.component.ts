import { Component, signal, inject, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PublicidadService, PublicidadCategoria } from '../../../core/services/publicidad.service';
import { categoriaData } from '../../../data/categoriasData';
import { BannerInterface } from '../../../components/build/carrusel/carrusel.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-publicidad',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatDividerModule,
    MatBadgeModule,
    MatTooltipModule,
    MatRadioModule
  ],
  templateUrl: './admin-publicidad.component.html',
  styleUrl: './admin-publicidad.component.css'
})
export class AdminPublicidadComponent implements OnInit {
  private publicidadService = inject(PublicidadService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  categoriasAgrupadas = categoriaData.map(c => ({
    nombre: c.ruta,
    secciones: c.seccion ? c.seccion.map(s => s.ruta) : []
  }));
  
  categoriaSeleccionada = signal<string>('');
  tipoAnuncio = signal<'carrusel' | 'toolbar' | 'oferta'>('carrusel');
  
  // Dashboard state
  modoDashboard = signal<boolean>(true);
  todosLosAnuncios = signal<Record<string, PublicidadCategoria>>({});

  banners = signal<BannerInterface[]>([
    { id: '1', image: '', patrocinador: '' },
    { id: '2', image: '', patrocinador: '' },
    { id: '3', image: '', patrocinador: '' }
  ]);
  
  toolbarBanner = signal<BannerInterface | null>(null);
  ofertaBanner = signal<BannerInterface | null>(null);
  
  isSaving = signal<boolean>(false);
  archivosPendientes = signal<(File | null)[]>([null, null, null]);
  archivoToolbarPendiente = signal<File | null>(null);
  archivoOfertaPendiente = signal<File | null>(null);

  constructor() {
    effect(() => {
      const cat = this.categoriaSeleccionada();
      if (cat && !this.modoDashboard()) {
        this.cargarBanners(cat);
      }
    });
  }

  ngOnInit() {
    this.cargarTodosLosAnuncios();
  }

  async cargarTodosLosAnuncios() {
    const data = await this.publicidadService.obtenerTodosLosAnuncios();
    this.todosLosAnuncios.set(data);
  }

  abrirEditor(categoria: string, tipo: 'carrusel' | 'toolbar' | 'oferta') {
    this.categoriaSeleccionada.set(categoria);
    this.tipoAnuncio.set(tipo);
    this.modoDashboard.set(false);
    this.cargarBanners(categoria);
  }

  volverAlDashboard() {
    this.modoDashboard.set(true);
    this.categoriaSeleccionada.set('');
    this.cargarTodosLosAnuncios();
  }

  estadoVencimiento(fechaISO?: string): 'vacio' | 'ok' | 'por-vencer' {
    if (!fechaISO) return 'vacio';
    
    const caducidad = new Date(fechaISO);
    const ahora = new Date();
    
    if (caducidad < ahora) return 'vacio';

    const diasFaltantes = (caducidad.getTime() - ahora.getTime()) / (1000 * 3600 * 24);
    if (diasFaltantes <= 2) return 'por-vencer';
    return 'ok';
  }

  async cargarBanners(categoriaId: string) {
    const data = await this.publicidadService.obtenerBanners(categoriaId);
    this.banners.set([...data]);
    this.archivosPendientes.set([null as any, null as any, null as any]);
    
    const toolbarData = await this.publicidadService.obtenerToolbarAd(categoriaId);
    this.toolbarBanner.set(toolbarData);
    this.archivoToolbarPendiente.set(null);

    const ofertaData = await this.publicidadService.obtenerOfertaCentralAd(categoriaId);
    this.ofertaBanner.set(ofertaData);
    this.archivoOfertaPendiente.set(null);
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
      } else if (this.tipoAnuncio() === 'toolbar') {
        this.archivoToolbarPendiente.set(file);
        
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const bannerActual = this.toolbarBanner() || { id: 'toolbar', image: '', patrocinador: '' };
          this.toolbarBanner.set({ ...bannerActual, image: e.target.result });
        };
        reader.readAsDataURL(file);
      } else {
        this.archivoOfertaPendiente.set(file);
        
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const bannerActual = this.ofertaBanner() || { id: 'oferta-central', image: '', patrocinador: '' };
          this.ofertaBanner.set({ ...bannerActual, image: e.target.result });
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

        let fechaISO = banner.fechaCaducidad;
        if (fechaISO && typeof fechaISO !== 'string') {
          fechaISO = (fechaISO as Date).toISOString();
        }

        await this.publicidadService.guardarBanner(
          catId, 
          index, 
          file, 
          banner.patrocinador || '', 
          banner.whatsapp, 
          banner.phoneFijo,
          fechaISO
        );
        const current = [...this.archivosPendientes()];
        current[index] = null as any;
        this.archivosPendientes.set(current);
      } else if (this.tipoAnuncio() === 'toolbar') {
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
      } else {
        const banner = this.ofertaBanner();
        const file = this.archivoOfertaPendiente();
        
        let fechaISO = banner?.fechaCaducidad;
        if (fechaISO && typeof fechaISO !== 'string') {
          fechaISO = (fechaISO as Date).toISOString();
        }
        
        await this.publicidadService.guardarOfertaCentralAd(
          catId,
          file,
          banner?.patrocinador || '',
          banner?.whatsapp,
          banner?.phoneFijo,
          fechaISO
        );
        this.archivoOfertaPendiente.set(null);
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
      } else if (this.tipoAnuncio() === 'toolbar') {
        await this.publicidadService.eliminarToolbarAd(catId);
      } else {
        await this.publicidadService.eliminarOfertaCentralAd(catId);
      }
      
      await this.cargarBanners(catId);
      this.snackBar.open('Publicidad eliminada', 'Cerrar', { duration: 3000 });
    }
  }

  volver() {
    this.router.navigate(['/']);
  }
}
