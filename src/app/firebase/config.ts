// src/app/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import { getAuth} from 'firebase/auth';
import { getMessaging} from "firebase/messaging";
import { getStorage} from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";
import { getFunctions } from "firebase/functions";
import { environment } from '../../environments/environment';

// Configuración desde environment
const firebaseConfig = environment.firebaseConfig;

// Inicializar Firebase una sola vez
const app = initializeApp(firebaseConfig);

// Exportar instancias como constantes
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);
export const analytics = getAnalytics(app);
export const functions = getFunctions(app);

