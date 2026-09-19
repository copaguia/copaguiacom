import { Component, inject, signal, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { InstanciaFirebase } from '../../../core/firebase/instancias.service';
import { DirectorioInterface } from '../../../interfaces/directorio-interface';
import { GoogleMap } from '@angular/google-maps';

declare var google: any;

@Component({
  selector: 'app-dev-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    GoogleMap
  ],
  templateUrl: './dev-dashboard.component.html',
  styleUrls: ['./dev-dashboard.component.css']
})
export class DevDashboardComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  private firestore = inject(InstanciaFirebase).firestore;
  private snackBar = inject(MatSnackBar);

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  
  public isSubmitting = signal(false);
  public mapOptions: google.maps.MapOptions = {
    center: { lat: 6.25184, lng: -75.56359 }, // Medellín by default
    zoom: 13,
  };
  
  private drawingManager: any;
  private currentPolygon: any = null;
  public limitePoligonal: Array<{lat: number, lng: number}> = [];

  public tenantForm = this.fb.group({
    id: ['', Validators.required],
    dominio: ['', Validators.required],
    nombre: ['', Validators.required],
    descripcion: [''],
    logoUrl: [''],
    municipio: ['', Validators.required],
    sector: ['', Validators.required],
    agenteAsignadoId: ['']
  });

  ngAfterViewInit() {
    this.initDrawingManager();
  }

  private initDrawingManager() {
    // Check if google maps is loaded and drawing library is available
    if (typeof google === 'undefined' || !google.maps || !google.maps.drawing) {
      console.warn('Google Maps API or Drawing Library not loaded yet.');
      return;
    }

    if (this.map && this.map.googleMap) {
      this.drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [google.maps.drawing.OverlayType.POLYGON],
        },
        polygonOptions: {
          fillColor: '#FF0000',
          fillOpacity: 0.3,
          strokeWeight: 2,
          clickable: true,
          editable: true,
          zIndex: 1,
        },
      });

      this.drawingManager.setMap(this.map.googleMap);

      google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event: any) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          // Si ya había un polígono, lo borramos para dejar solo uno
          if (this.currentPolygon) {
            this.currentPolygon.setMap(null);
          }
          this.currentPolygon = event.overlay;
          
          // Cambiar el cursor a la mano normal después de dibujar
          this.drawingManager.setDrawingMode(null);
          
          this.extractPolygonPath();
          
          // Escuchar cambios si el usuario edita los vértices
          const path = this.currentPolygon.getPath();
          google.maps.event.addListener(path, 'set_at', () => this.extractPolygonPath());
          google.maps.event.addListener(path, 'insert_at', () => this.extractPolygonPath());
        }
      });
    }
  }

  private extractPolygonPath() {
    if (!this.currentPolygon) return;
    
    const vertices = this.currentPolygon.getPath();
    const coordinates: Array<{lat: number, lng: number}> = [];
    
    for (let i = 0; i < vertices.getLength(); i++) {
      const xy = vertices.getAt(i);
      coordinates.push({ lat: xy.lat(), lng: xy.lng() });
    }
    
    this.limitePoligonal = coordinates;
    this.snackBar.open(`Polígono de ${coordinates.length} vértices capturado.`, 'OK', { duration: 2000 });
  }

  borrarPoligono() {
    if (this.currentPolygon) {
      this.currentPolygon.setMap(null);
      this.currentPolygon = null;
      this.limitePoligonal = [];
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    }
  }

  async onSubmit() {
    if (this.tenantForm.invalid) return;

    this.isSubmitting.set(true);
    try {
      const formValue = this.tenantForm.value;
      
      const newTenant: Partial<DirectorioInterface> = {
        id: formValue.id!,
        dominio: formValue.dominio!,
        nombre: formValue.nombre!,
        descripcion: formValue.descripcion || '',
        logoUrl: formValue.logoUrl || 'assets/brand/copaguia-intro.gif',
        municipio: formValue.municipio!,
        sector: formValue.sector!,
        agenteAsignadoId: formValue.agenteAsignadoId || '',
        activo: true,
        limitePoligonal: this.limitePoligonal, // Guardar las coordenadas trazadas
        seoConfig: {
          titleTemplate: `${formValue.nombre} | %s`,
          metaDescription: formValue.descripcion || `Directorio de negocios en ${formValue.municipio}`,
          keywords: [formValue.municipio!, 'negocios', 'directorio'],
          ogImage: formValue.logoUrl || 'assets/brand/copaguia-intro.gif',
          schemaType: 'LocalBusiness'
        }
      };

      // Guardar en Firestore
      await addDoc(collection(this.firestore, 'directorios'), {
        ...newTenant,
        createdAt: serverTimestamp()
      });

      this.snackBar.open('Tenant creado exitosamente con sus límites.', 'OK', { duration: 3000 });
      this.tenantForm.reset();
      this.borrarPoligono();
    } catch (error: any) {
      this.snackBar.open('Error al crear tenant: ' + error.message, 'Cerrar', { duration: 5000 });
    } finally {
      this.isSubmitting.set(false);
    }
  }

  ejecutarScraper() {
    const tenantId = this.tenantForm.get('id')?.value;
    if (!tenantId) {
      this.snackBar.open('Debes ingresar un ID de Tenant', 'OK', { duration: 3000 });
      return;
    }
    
    if (this.limitePoligonal.length === 0) {
      this.snackBar.open('Debes dibujar el polígono del barrio en el mapa antes de simular el scraper.', 'OK', { duration: 4000 });
      return;
    }

    // Aquí iría el llamado a Apify o Outscraper enviando this.limitePoligonal
    console.log("Coordenadas enviadas al Scraper:", this.limitePoligonal);
    this.snackBar.open(`¡Señal de Scraping (Point-in-Polygon) enviada para ${tenantId}!`, 'OK', { duration: 5000 });
  }
}
