// src/app/firebase/config.ts
import { environment } from '../../environments/environment';
const firebaseConfig = environment.firebaseConfig; // Configuración desde variables de entorno




/*** 1. INICIALIZACIÓN DE LA APLICACIÓN FIREBASE * Punto de entrada principal para todos los servicios */
import { initializeApp } from 'firebase/app';
export const app = initializeApp(firebaseConfig);
// Beneficio: Centraliza la configuración y permite compartir la misma instancia entre servicios




/*** 2. FIRESTORE - Base de datos NoSQL en tiempo real
 * Almacenamiento de datos estructurados con sincronización en tiempo real */
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
export const firestore = initializeFirestore(app, {
  localCache: persistentLocalCache()
});
// Beneficio: Permite trabajar sin conexión y sincroniza automáticamente al reconectar




/*** 3. AUTENTICACIÓN - Sistema de gestión de usuarios * Identificación y gestión de sesiones de usuarios */
import { getAuth } from 'firebase/auth';
export const auth = getAuth(app);
// Beneficio: Múltiples métodos de autenticación (email/password, redes sociales, etc.)



/*** 4. ALMACENAMIENTO - Gestión de archivos * Almacenamiento de archivos en la nube optimizado para contenido multimedia */
import { getStorage } from 'firebase/storage';
export const storage = getStorage(app);
// Beneficio: Gestión eficiente de contenido multimedia con control de permisos.




/*** 5. MENSAJERÍA - Notificaciones push * Sistema de comunicación con usuarios cuando la app está cerrada */
import { getMessaging, getToken } from "firebase/messaging";
export const messaging = getMessaging(app);
// Beneficio: Comunicación en tiempo real con los usuarios incluso cuando la app está cerrada.




/*** 6. ANALYTICS - Análisis de comportamiento * Seguimiento y análisis del uso de la aplicación */
import { getAnalytics } from "firebase/analytics";
export const analytics = getAnalytics(app);
// Beneficio: Métricas detalladas de uso para mejorar la experiencia del usuario.




/*** 7. CLOUD FUNCTIONS - Código serverless * Ejecución de código en la nube sin gestionar servidores */
import { getFunctions } from "firebase/functions";
export const functions = getFunctions(app);
// Beneficio: Ejecutar lógica en la nube sin necesidad de gestionar servidores.




/*** 8. PERFORMANCE - Monitoreo de rendimiento * Análisis y optimización del rendimiento de la aplicación */
import { getPerformance } from "firebase/performance"; 
export const performance = getPerformance(app);
// Beneficio: Identifica cuellos de botella y optimiza la velocidad de la aplicación.




/*** 9. INSTALLATIONS - Gestión de instalaciones * Identificación única de dispositivos e instalaciones */
import { getInstallations } from "firebase/installations";
export const installations = getInstallations(app);
// Beneficio: Identificación única de dispositivos para análisis y mensajería.




/*** 10. APP CHECK - Protección contra uso indebido * Verificación de que las solicitudes provienen de tu aplicación legítima */
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('tu-clave-recaptcha'),
  isTokenAutoRefreshEnabled: true
});
// Beneficio: Verifica que las solicitudes provienen de tu app legítima.