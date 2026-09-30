import { Injectable, signal, inject, computed } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ANTIOQUIA_HUB } from '../../data/antioquia-hub.const';
import { DirectorioInterface } from '../../interfaces/directorio-interface';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly document = inject(DOCUMENT);

  readonly currentTenant = signal<string>('default');
  
  readonly tenantConfig = computed<DirectorioInterface | null>(() => {
    const allDirectorios = Object.values(ANTIOQUIA_HUB).flatMap(m => Object.values(m.directorios));
    return allDirectorios.find(d => d.id === this.currentTenant()) || null;
  });

  readonly isCopaguia     = computed(() => this.currentTenant() === 'copaguia');
  readonly isNiquia       = computed(() => this.currentTenant() === 'niquia');
  readonly isElHueco      = computed(() => this.currentTenant() === 'elhueco');

  constructor() {
    this.detectarTenant();
  }

    private detectarTenant(): void {
    const hostname = this.document.location.hostname;
    
    // Aplanar el árbol para buscar qué directorio responde a este dominio
    const allDirectorios = Object.values(ANTIOQUIA_HUB).flatMap(m => Object.values(m.directorios));
    const tenantEncontrado = allDirectorios.find(d => hostname.includes(d.dominio) && d.activo);
    
    if (tenantEncontrado) {
      this.currentTenant.set(tenantEncontrado.id);
    }
  }
}
