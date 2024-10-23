import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withViewTransitions()), provideAnimationsAsync(), 
    provideFirebaseApp(() => initializeApp({"projectId":"copaguia-53f7f","appId":"1:719139766457:web:131686372ce4cf537e1b68","storageBucket":"copaguia-53f7f.appspot.com","apiKey":"AIzaSyCik-43hXGUaJLhD8QoAP1KdNlnH2zITQc","authDomain":"copaguia-53f7f.firebaseapp.com","messagingSenderId":"719139766457","measurementId":"G-WHB4S126H9"})), 
    provideAuth(() => getAuth()), 
    provideAnalytics(() => getAnalytics()), ScreenTrackingService, UserTrackingService, 
    provideFirestore(() => getFirestore()), 
    provideStorage(() => getStorage()), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync()]
};
