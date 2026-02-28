import { Injectable } from '@angular/core';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { getMessaging, Messaging } from 'firebase/messaging';
import { FirebasePerformance, getPerformance } from 'firebase/performance';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { environment } from '../../../environments/environment';

/*** 1. INICIALIZACIÓN DE LA APLICACIÓN FIREBASE * Punto de entrada principal para todos los servicios */
import { initializeApp } from 'firebase/app';
export const app = initializeApp(environment.firebaseConfig);

@Injectable({
  providedIn: 'root'
})
export class InstanciaFirebase {
  public auth:        Auth                = getAuth(app);
  public firestore:   Firestore           = getFirestore(app);
  public storage:     FirebaseStorage     = getStorage(app);
  public messaging:   Messaging           = getMessaging(app);
  public analytics:   Analytics           = getAnalytics(app);
  public performance: FirebasePerformance = getPerformance(app);
}




