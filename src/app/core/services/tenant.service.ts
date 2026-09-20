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

    const defaultTenant: DirectorioInterface = {
      id: 'hub-central',
      nombre: 'Directorio Paisa',
      dominio: 'directoriopaisa.com',
      descripcion: 'El directorio oficial de todos los municipios de Antioquia.',
      logoUrl: 'assets/brand/dp-logo.png',
      municipio: 'Antioquia',
      sector: 'Todos',
      activo: true,
      seoConfig: {
        titleTemplate: '%s | Directorio Paisa',
        metaDescription: 'Encuentra comercios, servicios y turismo en todos los municipios de Antioquia.',
        keywords: ['directorio', 'antioquia', 'comercios', 'paisa'],
        ogImage: 'assets/brand/dp-logo.png',
        schemaType: 'WebSite'
      }
    };

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
      } else if (domainToSearch === 'niquia.com') {
        const niquiaTenant: DirectorioInterface = {
          id: 'niquia_bello',
          dominio: 'niquia.com',
          nombre: 'Directorio Niquía',
          descripcion: 'El directorio oficial comercial de Niquía, Bello.',
          logoUrl: 'assets/brand/niquia-logo.png',
          municipio: 'Bello',
          sector: 'Niquía',
          activo: true,
          seoConfig: {
            titleTemplate: '%s | Directorio Niquía',
            metaDescription: 'Encuentra comercios y servicios en Niquía, Bello.',
            keywords: ['niquia', 'bello', 'directorio', 'comercios'],
            ogImage: 'assets/brand/niquia-logo.png',
            schemaType: 'WebSite'
          },
          tema: {
            corporativo: '#000B2B', // Dark Blue
            secundario: '#E81E61',  // Magenta
            resaltante: '#FFFFFF'   // White
          }
        };
        this.currentTenant.set(niquiaTenant);
        this.aplicarSEO(niquiaTenant);
      } else {
        // Fallback a Directorio Paisa (Hub Central) si el dominio no existe en la BD
        this.currentTenant.set(defaultTenant);
        this.aplicarSEO(defaultTenant);
      }
    } catch (error) {
      console.error('Error cargando el tenant:', error);
      // Fallback a Directorio Paisa si hay error de red o permisos
      this.currentTenant.set(defaultTenant);
      this.aplicarSEO(defaultTenant);
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
