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

interface BgImage { url: string; name: string; lat?: number; lng?: number; }

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
  clockIntervalId: any;
  currentTime = signal<Date>(new Date());

  get dateString() {
    const str = new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }).format(this.currentTime());
    return str.charAt(0).toUpperCase() + str.slice(1); // Capitalizar
  }

  get timeString() {
    return new Intl.DateTimeFormat('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true }).format(this.currentTime());
  }

  ngOnInit() {
    this.configurarFondosAleatorios();
    this.iniciarCarrusel();
    this.detectarUbicacionUsuario();
    this.clockIntervalId = setInterval(() => {
      this.currentTime.set(new Date());
    }, 1000);
  }

  detectarUbicacionUsuario() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          this.fijarFondoCercano(userLat, userLng);
        },
        (error) => {
          console.warn('Geolocalización denegada o fallida', error);
        },
        { timeout: 10000 }
      );
    }
  }

  fijarFondoCercano(lat1: number, lon1: number) {
    let closestBg: BgImage | null = null;
    let minDistance = 15; // Radio máximo de 15km para considerarlo "en la zona"

    for (const bg of this.backgrounds()) {
      if (bg.lat && bg.lng) {
        const d = this.calcularDistancia(lat1, lon1, bg.lat, bg.lng);
        if (d < minDistance) {
          minDistance = d;
          closestBg = bg;
        }
      }
    }

    if (closestBg) {
      // Detenemos el carrusel y dejamos solo la foto local
      if (this.intervalId) clearInterval(this.intervalId);
      this.backgrounds.set([closestBg]);
      this.currentBgIndex.set(0);
    }
  }

  // Fórmula de Haversine para calcular distancia en km
  calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
  }

  configurarFondosAleatorios() {
    // Solo tomamos municipios que tienen al menos un directorio (principal o sector) activo
    const activos = this.listaMunicipios.filter(m => this.isMunicipioActivo(m));
    
    // Obtenemos el fondoUrl y coordenadas
    const disponibles = activos.map(m => {
      let url = m.directorios['principal']?.fondoUrl;
      let lat = m.directorios['principal']?.areaBusquedaApify?.lat;
      let lng = m.directorios['principal']?.areaBusquedaApify?.lng;

      if (!m.directorios['principal']?.activo) {
        const sectorActivo = Object.values(m.directorios).find(d => d.sector !== 'Principal' && d.activo);
        if (sectorActivo?.fondoUrl) {
          url = sectorActivo.fondoUrl;
          lat = sectorActivo.areaBusquedaApify?.lat;
          lng = sectorActivo.areaBusquedaApify?.lng;
        }
      }
      return { url: url!, name: m.nombre, lat, lng };
    }).filter(bg => bg.url); // Aseguramos que haya URL

    const mezclados = [...disponibles].sort(() => 0.5 - Math.random());
    const seleccionados = mezclados.slice(0, 10);
    
    this.backgrounds.set(seleccionados);
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
    if (this.clockIntervalId) {
      clearInterval(this.clockIntervalId);
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
