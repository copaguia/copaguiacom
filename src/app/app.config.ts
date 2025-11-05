// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes'; // Tus rutas



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()), // Mantiene tus transiciones de vista
    
    // Aquí podrías añadir otros providers si fueran necesarios, como servicios globales, interceptores, etc.
  ]
};