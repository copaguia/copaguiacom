import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ANTIOQUIA_HUB } from '../../data/antioquia-hub.const';
import { MunicipioGlobal, DirectorioInterface } from '../../interfaces/directorio-interface';
import { CardsGalleryComponent } from '../../components/build/cards-gallery/cards-gallery.component';

interface BgImage { url: string; name: string; }

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatRippleModule, MatMenuModule, MatIconModule, CardsGalleryComponent],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.css'
})
export class PortalComponent implements OnInit, OnDestroy {
  listaMunicipios = Object.values(ANTIOQUIA_HUB);
  
  backgrounds = signal<BgImage[]>([]);
  currentBgIndex = signal(0);
  intervalId: any;

  ngOnInit() {
    this.configurarFondosAleatorios();
    this.iniciarCarrusel();
  }

  configurarFondosAleatorios() {
    // Tomamos todos los que tienen fondo
    const disponibles = this.listaMunicipios.filter(m => m.directorios['principal']?.fondoUrl);
    // Mezclamos
    const mezclados = [...disponibles].sort(() => 0.5 - Math.random());
    // Seleccionamos 10 al azar para no sobrecargar el navegador con 125 imágenes HD
    const seleccionados = mezclados.slice(0, 10);
    
    // Convertimos al formato BgImage
    this.backgrounds.set(
      seleccionados.map(m => ({ url: m.directorios['principal'].fondoUrl!, name: m.nombre }))
    );
  }

  iniciarCarrusel() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.backgrounds().length > 1) {
      this.intervalId = setInterval(() => {
        this.currentBgIndex.update(index => (index + 1) % this.backgrounds().length);
      }, 6000);
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  irADirectorio(dominio?: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (dominio) {
      window.location.href = `https://${dominio}`;
    }
  }

  getSectoresActivos(mun: MunicipioGlobal): DirectorioInterface[] {
    return Object.values(mun.directorios).filter(d => d.sector !== 'Principal' && d.activo);
  }

  isMunicipioActivo(mun: MunicipioGlobal): boolean {
    return Object.values(mun.directorios).some(d => d.activo);
  }

  getDominioActivo(mun: MunicipioGlobal): string | undefined {
    if (mun.directorios['principal']?.activo) {
      return mun.directorios['principal'].dominio;
    }
    const sectorActivo = Object.values(mun.directorios).find(d => d.sector !== 'Principal' && d.activo);
    return sectorActivo?.dominio;
  }
}
