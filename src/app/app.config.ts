// src/app/app.config.ts
import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()), 
    
    
    // Aquí podrías añadir otros providers si fueran necesarios, como servicios globales, interceptores, etc.
  ]
};


