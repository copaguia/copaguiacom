import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {
  private scriptLoaded = false;
  private loadPromise: Promise<void> | null = null;

  public load(): Promise<void> {
    if (this.scriptLoaded) {
      return Promise.resolve();
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      // Si por alguna razón el objeto google.maps ya existe (ej. cargado en index.html)
      if ((window as any).google && (window as any).google.maps) {
        this.scriptLoaded = true;
        return resolve();
      }

      const script = document.createElement('script');
      // Cargamos la API con la librería 'drawing'
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=drawing`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };

      script.onerror = (error) => {
        reject(error);
      };

      document.body.appendChild(script);
    });

    return this.loadPromise;
  }
}
