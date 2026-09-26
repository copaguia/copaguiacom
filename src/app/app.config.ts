// src/app/app.config.ts
import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes, withViewTransitions()),             registrationStrategy: 'registerWhenStable:30000'
          }),
    
    
    // Aquí podrías añadir otros providers si fueran necesarios, como servicios globales, interceptores, etc.
  ]
};


