import { Injectable, inject, signal, computed } from '@angular/core';
import { InstanciaFirebase } from '../firebase/instancias.service';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { DirectorioInterface } from '../../interfaces/directorio-interface';
import { SeoService } from './seo.service';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private firestore = inject(InstanciaFirebase).firestore;
  private seoService = inject(SeoService);

  // Estado reactivo del Tenant
  public currentTenant = signal<DirectorioInterface | null>(null);
  public isCargando = signal<boolean>(true);
  
  // Computada para saber el zonaId del tenant actual (útil para filtros)
  public tenantZonaId = computed(() => this.currentTenant()?.id || null);

  constructor() {
    this.initTenant();
  }

  private async initTenant() {
    this.isCargando.set(true);
    try {
      const hostname = window.location.hostname;
      // Para pruebas locales (localhost) podemos mockear un subdominio o cargar uno por defecto
      const domainToSearch = (hostname === 'localhost' || hostname === '127.0.0.1') 
          ? 'campoamor.com' // Mock para DEV
          : hostname;

      const q = query(
        collection(this.firestore, 'directorios'),
        where('dominio', '==', domainToSearch),
        where('activo', '==', true)
      );

      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const tenantData = snapshot.docs[0].data() as DirectorioInterface;
        this.currentTenant.set({ ...tenantData, id: snapshot.docs[0].id });
        this.aplicarSEO(tenantData);
      } else {
        // No hay tenant específico, usar configuración genérica de CopaGuia
        this.currentTenant.set(null);
      }
    } catch (error) {
      console.error('Error cargando el tenant:', error);
      this.currentTenant.set(null);
    } finally {
      this.isCargando.set(false);
    }
  }

  private aplicarSEO(tenant: DirectorioInterface) {
    if (!tenant.seoConfig) return;

    this.seoService.updateSeoTags({
      title: tenant.seoConfig.titleTemplate.replace('%s', 'Inicio'),
      description: tenant.seoConfig.metaDescription,
      keywords: tenant.seoConfig.keywords,
      image: tenant.seoConfig.ogImage || tenant.logoUrl
    });

    this.seoService.insertSchema({
      name: tenant.nombre,
      description: tenant.descripcion,
      image: tenant.logoUrl,
      address: {
        '@type': 'PostalAddress',
        addressLocality: tenant.municipio
      }
    }, tenant.seoConfig.schemaType || 'WebSite');
  }
}
