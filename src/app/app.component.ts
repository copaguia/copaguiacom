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
      const temas: Record<string, {corporativo: string, secundario: string, resaltante: string}> = {
        'copaguia': { corporativo: '#0056b3', secundario: '#e9ecef', resaltante: '#ffc107' },
        'niquia': { corporativo: '#28a745', secundario: '#e9ecef', resaltante: '#ffc107' },
        'elhueco': { corporativo: '#dc3545', secundario: '#e9ecef', resaltante: '#ffc107' },
        'default': { corporativo: '#1a73e8', secundario: '#f8f9fa', resaltante: '#ff9800' }
      };

      const tema = temas[tenant] || temas['default'];
      document.documentElement.style.setProperty('--corporativo', tema.corporativo);
      document.documentElement.style.setProperty('--secundario', tema.secundario);
      document.documentElement.style.setProperty('--resaltante', tema.resaltante);

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
