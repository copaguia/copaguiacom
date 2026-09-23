import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MUNICIPIOS_ANTIOQUIA, MunicipioAntioquia } from '../../../data/municipios-antioquia';
import { httpsCallable } from 'firebase/functions';
import { InstanciaFirebase } from '../../../core/firebase/instancias.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GoogleMapsLoaderService } from '../../../core/services/google-maps-loader.service';

declare var google: any;

@Component({
  selector: 'app-admin-municipios-hub',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './admin-municipios-hub.component.html',
  styleUrl: './admin-municipios-hub.component.css'
})
export class AdminMunicipiosHubComponent {
  private firebase = inject(InstanciaFirebase);
  private snackBar = inject(MatSnackBar);
  private mapsLoader = inject(GoogleMapsLoaderService);

  // Guardar instancias de mapas y drawing managers por municipio id
  private mapas: { [key: string]: any } = {};
  private drawingManagers: { [key: string]: any } = {};
  private currentPolygons: { [key: string]: any } = {};

  public subregionSeleccionada = signal<string>('Todas');
  public busquedaTexto = signal<string>('');
  
  public readonly subregiones = [
    'Todas', 'Valle de Aburrá', 'Oriente', 'Occidente', 'Suroeste', 
    'Norte', 'Urabá', 'Bajo Cauca', 'Nordeste', 'Magdalena Medio'
  ];

  public displayedColumns: string[] = ['nombre', 'subregion', 'dominio', 'estado', 'acciones'];

  public municipiosFiltrados = computed(() => {
    let filtrados = MUNICIPIOS_ANTIOQUIA;
    const sub = this.subregionSeleccionada();
    const texto = this.busquedaTexto().toLowerCase();

    if (sub !== 'Todas') {
      filtrados = filtrados.filter(m => m.subregion === sub);
    }
    
    if (texto) {
      filtrados = filtrados.filter(m => m.nombre.toLowerCase().includes(texto));
    }
    
    return filtrados;
  });

  public async verificarDominio(municipio: MunicipioAntioquia) {
    if (!municipio.dominioPropuesto) return;
    
    this.snackBar.open(`Verificando disponibilidad de ${municipio.dominioPropuesto}...`, 'OK', { duration: 2000 });
    municipio.estado = 'PROVISIONANDO'; // Estado visual temporal de carga

    try {
      const checkDomain = httpsCallable(this.firebase.functions, 'checkDomainAvailability');
      const res = await checkDomain({ dominio: municipio.dominioPropuesto }) as any;
      
      if (res.data.success && res.data.disponible) {
        this.snackBar.open(`¡Dominio disponible por ${res.data.precio} ${res.data.moneda}!`, 'Excelente', { duration: 4000 });
        municipio.estado = 'PENDIENTE'; // Vuelve a pendiente para poder activar
      } else {
        this.snackBar.open(`El dominio no está disponible.`, 'Cerrar', { duration: 4000 });
        municipio.estado = 'PENDIENTE';
      }
    } catch (error: any) {
      console.error(error);
      this.snackBar.open(`Error: ${error.message}`, 'Cerrar', { duration: 4000 });
      municipio.estado = 'PENDIENTE';
    }
  }

  public async activarDirectorio(municipio: MunicipioAntioquia) {
    if (!confirm(`¿Estás seguro de comprar y activar ${municipio.dominioPropuesto}? Se realizará el cobro en Cloudflare.`)) {
      return;
    }

    this.snackBar.open(`Iniciando Zero-Touch para ${municipio.nombre}...`, 'OK', { duration: 3000 });
    municipio.estado = 'PROVISIONANDO';

    try {
      const provisionar = httpsCallable(this.firebase.functions, 'provisionarNuevoDirectorio');
      
      const res = await provisionar({
        nombreDirectorio: municipio.nombre,
        dominioObjetivo: municipio.dominioPropuesto,
        limitePoligonal: municipio.limitePoligonal || {},
        modoConexion: 'SUBDOMINIO'
      }) as any;

      if (res.data.success) {
        this.snackBar.open(`¡Directorio Activado!`, '¡Genial!', { duration: 5000 });
        municipio.estado = 'ACTIVO';
      }
    } catch (error: any) {
      console.error(error);
      this.snackBar.open(`Error de aprovisionamiento: ${error.message}`, 'Cerrar', { duration: 5000 });
      municipio.estado = 'PENDIENTE';
    }
  }

  // Lógica del Mapa Interactivo
  public async abrirMapa(municipio: any) {
    try {
      this.snackBar.open('Cargando Google Maps...', '', { duration: 1500 });
      await this.mapsLoader.load();
      municipio.mapaActivo = true;

      // Esperar un tick de Angular para que el div se renderice
      setTimeout(() => {
        this.initMap(municipio);
      }, 100);
    } catch (error) {
      console.error('Error cargando Maps', error);
      this.snackBar.open('Error al cargar el mapa. Verifica tu API Key.', 'OK', { duration: 4000 });
    }
  }

  private initMap(municipio: any) {
    const mapElement = document.getElementById('map-' + municipio.id);
    if (!mapElement) return;

    // Medellín por defecto, o podríamos usar las coords del municipio si las tuviéramos
    const center = { lat: 6.2442, lng: -75.5812 }; 
    
    const map = new google.maps.Map(mapElement, {
      center: center,
      zoom: 12,
      mapTypeId: 'roadmap',
      streetViewControl: false,
      mapTypeControl: false
    });
    this.mapas[municipio.id] = map;

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon']
      },
      polygonOptions: {
        fillColor: '#3f51b5',
        fillOpacity: 0.3,
        strokeWeight: 2,
        clickable: false,
        editable: true,
        zIndex: 1
      }
    });

    drawingManager.setMap(map);
    this.drawingManagers[municipio.id] = drawingManager;

    google.maps.event.addListener(drawingManager, 'overlaycomplete', (event: any) => {
      if (event.type === 'polygon') {
        const polygon = event.overlay;
        this.currentPolygons[municipio.id] = polygon;
        
        // Bloquear para no dibujar más de uno
        drawingManager.setDrawingMode(null);
        drawingManager.setOptions({ drawingControl: false });

        this.generarGeoJson(municipio, polygon);

        // Escuchar si lo editan para regenerar el GeoJSON
        polygon.getPath().addListener('set_at', () => this.generarGeoJson(municipio, polygon));
        polygon.getPath().addListener('insert_at', () => this.generarGeoJson(municipio, polygon));
      }
    });
  }

  private generarGeoJson(municipio: any, polygon: any) {
    const path = polygon.getPath();
    const coordinates: number[][] = [];
    
    for (let i = 0; i < path.getLength(); i++) {
      const xy = path.getAt(i);
      coordinates.push([xy.lng(), xy.lat()]); // GeoJSON es [Longitud, Latitud]
    }
    
    // Cerrar el polígono repitiendo el primer punto al final
    if (coordinates.length > 0) {
      coordinates.push([...coordinates[0]]);
    }

    municipio.limitePoligonal = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [coordinates]
      }
    };
  }

  public limpiarPoligono(municipio: any) {
    const polygon = this.currentPolygons[municipio.id];
    if (polygon) {
      polygon.setMap(null);
      delete this.currentPolygons[municipio.id];
    }
    
    const drawingManager = this.drawingManagers[municipio.id];
    if (drawingManager) {
      drawingManager.setOptions({ drawingControl: true });
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    }

    municipio.limitePoligonal = {};
  }
}
