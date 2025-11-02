// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes'; // Tus rutas

// --- Importaciones de Firebase para la inicialización ---
import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// --- Importa tu configuración de entorno (¡esto es crucial!) ---
import { environment } from '../environments/environment';

// --- Inicialización de Firebase App aquí al inicio de la aplicación ---
const firebaseApp = initializeApp(environment.firebaseConfig);

// --- Exporta las instancias de Auth y Firestore para que los servicios puedan importarlas/inyectarlas ---
export const auth: Auth = getAuth(firebaseApp);
export const firestore: Firestore = getFirestore(firebaseApp);

// --- Exporta el ID del proyecto (lo usaremos para las rutas de Firestore si es necesario, aunque en este esquema son de nivel superior) ---
export const firebaseAppId: string = environment.firebaseConfig.projectId;



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()), // Mantiene tus transiciones de vista
    
    // Aquí podrías añadir otros providers si fueran necesarios, como servicios globales, interceptores, etc.
  ]
};