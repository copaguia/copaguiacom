import { Component, inject, signal, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { InstanciaFirebase } from '../../../core/firebase/instancias.service';
import { GoogleMap, MapPolygon } from '@angular/google-maps';
import { httpsCallable } from 'firebase/functions';
import { CostosPanelComponent } from './components/costos-panel/costos-panel.component';

declare var google: any;

interface CloudflareDominio {
  nombre:     string;
  expiracion: string;
  autoRenew:  boolean;
  estado:     string;
}

@Component({
  selector:    'app-dev-dashboard',
  standalone:  true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule,
    MatTabsModule,
    GoogleMap,
    MapPolygon,
    CostosPanelComponent
  ],
  templateUrl: './dev-dashboard.component.html',
  styleUrls:   ['./dev-dashboard.component.css']
})
export class DevDashboardComponent implements OnInit {
  private fb       = inject(FormBuilder);
  private firebase = inject(InstanciaFirebase);
  private snackBar = inject(MatSnackBar);

  @ViewChild(GoogleMap,   { static: false }) map!: GoogleMap;
  @ViewChild(MapPolygon, { static: false }) polygonRef!: MapPolygon;

  public isSubmitting       = signal(false);
  public cargandoDominios   = signal(false);
  public dominiosCloudflare = signal<CloudflareDominio[]>([]);

  public mapOptions: google.maps.MapOptions = {
    center:                 { lat: 6.25184, lng: -75.56359 },
    zoom:                   13,
    disableDoubleClickZoom: true
  };

  public polygonOptions: google.maps.PolygonOptions = {
    fillColor:    '#1976D2',
    fillOpacity:  0.25,
    strokeColor:  '#1976D2',
    strokeWeight: 2,
    clickable:    false,
    editable:     true,  // Vértices arrastrables
    zIndex:       1,
  };

  public limitePoligonal: Array<{ lat: number; lng: number }> = [];

  public tenantForm = this.fb.group({
    id:               ['', Validators.required],
    dominio:          ['', Validators.required],
    modoConexion:     ['EXISTENTE', Validators.required],
    nombre:           ['', Validators.required],
    descripcion:      [''],
    logoUrl:          [''],
    municipio:        ['', Validators.required],
    sector:           ['', Validators.required],
    agenteAsignadoId: ['']
  });

  async ngOnInit() {
    await this.cargarDominiosCloudflare();
  }

  async cargarDominiosCloudflare() {
    this.cargandoDominios.set(true);
    try {
      const fn      = httpsCallable<void, { success: boolean; dominios: CloudflareDominio[] }>(
        this.firebase.functions, 'listarDominiosCloudflare'
      );
      const result  = await fn();
      this.dominiosCloudflare.set(result.data.dominios ?? []);
    } catch (error: any) {
      console.warn('No se pudieron cargar dominios de Cloudflare:', error.message);
      this.dominiosCloudflare.set([]);
    } finally {
      this.cargandoDominios.set(false);
    }
  }

  onDominioSeleccionado(dominio: string) {
    this.tenantForm.patchValue({ dominio, modoConexion: 'EXISTENTE' });
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.limitePoligonal = [...this.limitePoligonal, {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      }];
    }
  }

  // Sincroniza el arreglo de coordenadas cuando el usuario arrastra un vértice
  sincronizarPoligono() {
    if (!this.polygonRef?.polygon) return;
    const path = this.polygonRef.polygon.getPath();
    const puntos: Array<{ lat: number; lng: number }> = [];
    path.forEach((latLng: google.maps.LatLng) => {
      puntos.push({ lat: latLng.lat(), lng: latLng.lng() });
    });
    this.limitePoligonal = puntos;
  }

  borrarPoligono() {
    this.limitePoligonal = [];
  }

  async onSubmit() {
    if (this.tenantForm.invalid) return;

    if (this.limitePoligonal.length < 3) {
      this.snackBar.open('Debes dibujar un polígono de al menos 3 puntos en el mapa.', 'OK', { duration: 4000 });
      return;
    }

    this.isSubmitting.set(true);
    this.snackBar.open('Iniciando aprovisionamiento Zero-Touch...', 'Espera', { duration: 5000 });

    try {
      const formValue = this.tenantForm.value;
      const provisionDirectoryFn = httpsCallable(this.firebase.functions, 'provisionarNuevoDirectorio');

      const response = await provisionDirectoryFn({
        nombreDirectorio: formValue.nombre,
        dominioObjetivo:  formValue.dominio,
        modoConexion:     formValue.modoConexion,
        limitePoligonal:  this.limitePoligonal
      });

      console.log('Respuesta Orquestador:', response.data);
      this.snackBar.open('¡Directorio aprovisionado exitosamente!', 'OK', { duration: 5000 });
      this.tenantForm.reset({ modoConexion: 'EXISTENTE' });
      this.borrarPoligono();
      await this.cargarDominiosCloudflare(); // Refresca la lista
    } catch (error: any) {
      console.error(error);
      this.snackBar.open('Error al orquestar directorio: ' + error.message, 'Cerrar', { duration: 8000 });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
