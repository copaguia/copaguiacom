import { Injectable, inject, signal } from '@angular/core';
import { InstanciaFirebase } from '../firebase/instancias.service';
import { collection, getDocs, getCountFromServer } from 'firebase/firestore';

export interface DesgloseCosto {
  concepto: string;
  montoUsd: number;
  porcentaje: number;
  colorMaterial: string;
  detalles: string;
}

export interface ReporteCosto {
  totalUsdMes: number;
  totalDirectorios: number;
  totalNegocios: number;
  totalUsuariosEstimados: number;
  desglose: DesgloseCosto[];
}

@Injectable({
  providedIn: 'root'
})
export class CostoAppService {
  private firestore = inject(InstanciaFirebase).firestore;

  public reporte = signal<ReporteCosto | null>(null);
  public cargando = signal<boolean>(false);

  // --- Constantes de Precios Estimados ---
  private COSTO_CLOUDFLARE_DOMINIO_EXTRA = 2.0; // USD a partir del dominio 101 (SaaS)
  private DOMINIOS_GRATIS_CLOUDFLARE = 100;
  
  // Estimación de infraestructura por negocio activo (Reads/Writes/Hosting/Functions)
  // Basado en 1000 visitas/mes por negocio promedio
  private COSTO_FIREBASE_POR_NEGOCIO = 0.05; // USD/Mes estimado

  constructor() {}

  public async calcularCostosEnTiempoReal() {
    this.cargando.set(true);
    try {
      // 1. Contar Directorios (Tenants)
      const collDirectorios = collection(this.firestore, 'directorios');
      const snapDirectorios = await getCountFromServer(collDirectorios);
      const totalDirectorios = snapDirectorios.data().count || 1; // Mínimo 1

      // 2. Contar Negocios
      const collNegocios = collection(this.firestore, 'negocios');
      const snapNegocios = await getCountFromServer(collNegocios);
      const totalNegocios = snapNegocios.data().count || 0;

      // 3. Usuarios Estimados (Regla de negocio: ~100 usuarios recurrentes por negocio registrado)
      const totalUsuariosEstimados = totalNegocios * 100;

      // 4. Calcular Costos
      let costoCloudflare = 0;
      if (totalDirectorios > this.DOMINIOS_GRATIS_CLOUDFLARE) {
        costoCloudflare = (totalDirectorios - this.DOMINIOS_GRATIS_CLOUDFLARE) * this.COSTO_CLOUDFLARE_DOMINIO_EXTRA;
      }

      const costoFirebase = totalNegocios * this.COSTO_FIREBASE_POR_NEGOCIO;
      
      // Funciones / IA (Vertex, etc) - Estimado fijo por directorio activo
      const costoGcpFunctions = totalDirectorios * 0.10; 

      const totalMonto = costoCloudflare + costoFirebase + costoGcpFunctions;

      const desglose: DesgloseCosto[] = [
        {
          concepto: 'Firebase (BD & Hosting)',
          montoUsd: costoFirebase,
          porcentaje: totalMonto > 0 ? (costoFirebase / totalMonto) * 100 : 0,
          colorMaterial: '#FFCA28', // Amber (Firebase)
          detalles: `${totalNegocios} negocios x $${this.COSTO_FIREBASE_POR_NEGOCIO}/m`
        },
        {
          concepto: 'GCP (Cloud Functions & IA)',
          montoUsd: costoGcpFunctions,
          porcentaje: totalMonto > 0 ? (costoGcpFunctions / totalMonto) * 100 : 0,
          colorMaterial: '#4285F4', // Blue (GCP)
          detalles: `${totalDirectorios} directorios orquestados`
        },
        {
          concepto: 'Cloudflare (Routing)',
          montoUsd: costoCloudflare,
          porcentaje: totalMonto > 0 ? (costoCloudflare / totalMonto) * 100 : 0,
          colorMaterial: '#F6821F', // Orange (Cloudflare)
          detalles: totalDirectorios <= 100 ? '<100 dominios (Gratis)' : `${totalDirectorios - 100} dominios extra x $2`
        }
      ];

      this.reporte.set({
        totalUsdMes: totalMonto,
        totalDirectorios,
        totalNegocios,
        totalUsuariosEstimados,
        desglose
      });

    } catch (error) {
      console.error('Error calculando costos:', error);
    } finally {
      this.cargando.set(false);
    }
  }
}
