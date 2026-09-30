const fs = require('fs');
const tsPath = '/Users/aleo/AngularProjects/directoriopaisa.com/src/app/views/admin/admin-municipios-hub/admin-municipios-hub.component.ts';
const htmlPath = '/Users/aleo/AngularProjects/directoriopaisa.com/src/app/views/admin/admin-municipios-hub/admin-municipios-hub.component.html';

let tsContent = fs.readFileSync(tsPath, 'utf8');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// 1. Añadir import de storage a TS
tsContent = tsContent.replace(
  "import { InstanciaFirebase } from '../../../core/firebase/instancias.service';",
  "import { InstanciaFirebase } from '../../../core/firebase/instancias.service';\nimport { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';"
);

// 2. Modificar la función abrirMapa para usar Geocoder y Circle
tsContent = tsContent.replace(
  /public async abrirMapa.*?\n  private initMap\(municipio: any\) \{[\s\S]*?private generarGeoJson/m,
`  public async abrirMapa(municipio: any) {
    try {
      this.snackBar.open('Cargando Google Maps...', '', { duration: 1500 });
      await this.mapsLoader.load();
      municipio.mapaActivo = true;

      setTimeout(() => {
        this.initMap(municipio);
      }, 100);
    } catch (error) {
      console.error('Error cargando Maps', error);
      this.snackBar.open('Error al cargar el mapa.', 'OK', { duration: 4000 });
    }
  }

  private initMap(municipio: any) {
    const mapElement = document.getElementById('map-' + municipio.id);
    if (!mapElement) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: municipio.nombre + ', Antioquia, Colombia' }, (results: any, status: any) => {
      let center = { lat: 6.2442, lng: -75.5812 }; // default
      if (status === 'OK' && results && results[0]) {
        center = results[0].geometry.location;
      }

      const map = new google.maps.Map(mapElement, {
        center: center,
        zoom: 14,
        mapTypeId: 'roadmap',
        streetViewControl: false,
        mapTypeControl: false
      });
      this.mapas[municipio.id] = map;

      // Crear el Círculo por defecto en el centro
      const circle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map,
        center: center,
        radius: 3000, // 3km por defecto
        editable: true,
        draggable: true
      });

      this.currentPolygons[municipio.id] = circle; // guardamos el circulo aquí

      this.actualizarDatosCirculo(municipio, circle);

      // Escuchar cambios
      circle.addListener('radius_changed', () => this.actualizarDatosCirculo(municipio, circle));
      circle.addListener('center_changed', () => this.actualizarDatosCirculo(municipio, circle));
    });
  }

  private actualizarDatosCirculo(municipio: any, circle: any) {
    const center = circle.getCenter();
    municipio.areaBusquedaApify = {
      lat: center.lat(),
      lng: center.lng(),
      radioKm: +(circle.getRadius() / 1000).toFixed(2)
    };
  }

  public async subirLogo(event: any, municipio: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.snackBar.open('Subiendo logo...', '', { duration: 2000 });
    const storage = getStorage(this.firebase.app);
    const logoRef = ref(storage, \`directorios/\${municipio.id}/logo_\${file.name}\`);

    try {
      await uploadBytes(logoRef, file);
      const url = await getDownloadURL(logoRef);
      municipio.logoUrl = url;
      this.snackBar.open('Logo subido', 'OK', { duration: 3000 });
    } catch (e: any) {
      this.snackBar.open('Error al subir: ' + e.message, 'OK', { duration: 3000 });
    }
  }

  private generarGeoJson`
);

// Limpiar el limpiarPoligono para remover el circle en vez del polygon y el drawingmanager
tsContent = tsContent.replace(
  /public limpiarPoligono\(municipio: any\) \{[\s\S]*?\}/m,
`  public limpiarPoligono(municipio: any) {
    const circle = this.currentPolygons[municipio.id];
    if (circle) {
      circle.setMap(null);
      delete this.currentPolygons[municipio.id];
    }
    municipio.areaBusquedaApify = undefined;
    municipio.mapaActivo = false;
  }`
);

// Adaptar la activación para usar área
tsContent = tsContent.replace(
  /limitePoligonal: municipio.limitePoligonal \|\| \{\},/m,
  "areaBusquedaApify: municipio.areaBusquedaApify || {}, logoUrl: municipio.logoUrl || '',"
);

// 3. Modificar HTML para agregar campos
htmlContent = htmlContent.replace(
  '<mat-form-field appearance="outline" class="full-width">',
  `<mat-form-field appearance="outline" class="full-width">
              <mat-label>Logo del Directorio</mat-label>
              <div class="file-upload-wrapper" style="display:flex; gap:10px; align-items:center;">
                 <input matInput [(ngModel)]="municipio.logoUrl" placeholder="URL de la imagen o Sube un archivo" readonly>
                 <button mat-icon-button color="primary" (click)="fileInput.click()">
                    <mat-icon>upload</mat-icon>
                 </button>
                 <input #fileInput type="file" style="display:none" (change)="subirLogo($event, municipio)" accept="image/*">
              </div>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">`
);

htmlContent = htmlContent.replace(
  '<button mat-stroked-button color="primary" (click)="abrirMapa(municipio)" *ngIf="!municipio.mapaActivo && municipio.estado !== \'ACTIVO\'">',
  '<button mat-stroked-button color="primary" (click)="abrirMapa(municipio)" *ngIf="!municipio.mapaActivo && municipio.estado !== \'ACTIVO\'">'
).replace(
  '<mat-icon>map</mat-icon> Dibujar Zona de Extracción',
  '<mat-icon>map</mat-icon> Configurar Área de Búsqueda (Punto/Radio)'
);

htmlContent = htmlContent.replace(
  /<span class="geo-status".*municipio\.limitePoligonal.*<\/span>/g,
  ""
);
htmlContent = htmlContent.replace(
  /<span class="geo-status warn".*municipio\.limitePoligonal.*<\/span>/g,
  `<span class="geo-status" *ngIf="municipio.areaBusquedaApify">
     <mat-icon color="primary">check_circle</mat-icon> Área lista: {{municipio.areaBusquedaApify.radioKm}}km de radio
   </span>
   <span class="geo-status warn" *ngIf="!municipio.areaBusquedaApify">
     Configura el centro y radio en el mapa
   </span>`
);

fs.writeFileSync(tsPath, tsContent);
fs.writeFileSync(htmlPath, htmlContent);

console.log("Archivos modificados exitosamente");
