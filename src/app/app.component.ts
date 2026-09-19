import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './tools/material/material.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    imports: [MaterialModule, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'myapp';

  constructor() {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    iconRegistry.addSvgIcon('whatsapp', sanitizer.bypassSecurityTrustResourceUrl('assets/iconos/whatsapp.svg'));

    this.loadGoogleMaps();
  }

  private loadGoogleMaps() {
    if (document.getElementById('google-maps-script')) return; // Evitar inyección múltiple

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
}
