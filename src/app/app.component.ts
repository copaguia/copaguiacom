import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './tools/material/material.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { TenantService } from './core/services/tenant.service';
import { effect } from '@angular/core';

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
    const tenantService = inject(TenantService);

    iconRegistry.addSvgIcon('whatsapp', sanitizer.bypassSecurityTrustResourceUrl('assets/iconos/whatsapp.svg'));

    this.loadGoogleMaps();

    effect(() => {
      const tenant = tenantService.currentTenant();
      if (tenant && tenant.tema) {
        document.documentElement.style.setProperty('--corporativo', tenant.tema.corporativo);
        document.documentElement.style.setProperty('--secundario', tenant.tema.secundario);
        document.documentElement.style.setProperty('--resaltante', tenant.tema.resaltante);
      }
    });
  }

  private loadGoogleMaps() {
    if (document.getElementById('google-maps-script')) return; // Evitar inyección múltiple

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&loading=async`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
}
