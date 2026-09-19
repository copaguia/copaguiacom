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
import { GoogleMap, MapPolygon } from '@angular/google-maps';

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
    GoogleMap,
    MapPolygon
  ],
  templateUrl: './dev-dashboard.component.html',
  styleUrls: ['./dev-dashboard.component.css']
})
export class DevDashboardComponent {
  private fb = inject(FormBuilder);
  private firestore = inject(InstanciaFirebase).firestore;
  private snackBar = inject(MatSnackBar);

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  
  public isSubmitting = signal(false);
  public mapOptions: google.maps.MapOptions = {
    center: { lat: 6.25184, lng: -75.56359 }, // Medellín by default
    zoom: 13,
    disableDoubleClickZoom: true // Para evitar zoom al hacer doble clic rápido
  };
  
  public polygonOptions: google.maps.PolygonOptions = {
    fillColor: '#FF0000',
    fillOpacity: 0.3,
    strokeWeight: 2,
    clickable: false,
    editable: false,
    zIndex: 1,
  };

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

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      // Agregar el nuevo punto
      this.limitePoligonal = [...this.limitePoligonal, { 
        lat: event.latLng.lat(), 
        lng: event.latLng.lng() 
      }];
    }
  }

  borrarPoligono() {
    this.limitePoligonal = [];
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
