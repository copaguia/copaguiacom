import { Injectable} from '@angular/core';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';
import { getStorage } from 'firebase/storage';
import { getPerformance } from 'firebase/performance';
import { getRemoteConfig } from 'firebase/remote-config';
import { getDatabase } from 'firebase/database';
import { getFunctions } from 'firebase/functions';

@Injectable({
  providedIn: 'root'
})
export class GetService {

  private firestore = getFirestore();       //1. Instacia firestore para la base de datos de negocios y usuarios.
  private analytics = getAnalytics();       //2. Instancia Analytics para gestion analisis de uso de la app.
  private auth = getAuth();                 //3. Instancia AUTH para autenticación de usuarios.
  private messaging = getMessaging();       //4. Instancia messaging para notificaciones push.
  private storage = getStorage();           //5. Instancia torage para almacenamiento de ( pdf ).
  private performance = getPerformance();   //6. Instancia Performance para revisar el rendimiento de la app.  
  private functions = getFunctions();       //7. Para funciones configuradas en el servidor.


  
}


